const { Op, literal, fn, col } = require("sequelize");
const JadwalKategori = require("../models/JadwalKategoriModel.js");
const Jadwal = require("../models/JadwalModel.js");
const PesertaLogin = require("../models/PesertaLoginModel.js");
const Peserta = require("../models/PesertaModel.js");
const PesertaTest = require("../models/PesertaTestModel.js");
const SoalItem = require("../models/SoalItemModel.js");
const Soal = require("../models/SoalModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");
const { Worker } = require('worker_threads');

module.exports.getUjians = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const check = [...(await Jadwal.findAll({
      subQuery: false,
      where: {
        '$pesertas.id$': {
          [Op.eq]: req.user.id
        },
        active: true,
        start: {
          [Op.lte]: new Date()
        },
        end: {
          [Op.gte]: new Date()
        }
      },
      attributes: ['id'],
      include: [
        {
          model: Peserta,
          attributes: []
        },
        {
          model: PesertaLogin,
          attributes: [],
          required: true,
          where: {
            pesertaId: req.user.id
          }
        }
      ],
      raw: true
    }))].map(v => v.id);

    const datas = await Jadwal.findAndCountAll({
      subQuery: false,
      where: {
        id: {
          [Op.notIn]: check
        },
        '$pesertas.id$': {
          [Op.eq]: req.user.id
        },
        active: true,
        start: {
          [Op.lte]: new Date()
        },
        end: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: Peserta,
          attributes: []
        },
        {
          model: JadwalKategori,
          attributes: ['name', 'desc']
        }
      ],
      order: [
        ['start', 'asc']
      ],
      group: ['id'],
      limit: limit,
      offset: offset,
      distinct: true
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.getTes = async (req, res) => {
  const { id } = req.body;
  try {
    const jadwal = await Jadwal.findByPk(id);
    if (!jadwal) {
      return sendStatus(res, 404, 'Jadwal tidak ditemukan');
    }
    const login = await PesertaLogin.findOne({
      where: {
        jadwalId: id,
        pesertaId: req.user.id
      }
    });
    if (login) {
      return sendStatus(res, 406, 'Anda telah mengikuti ujian ini!');
    }
    const soals = await SoalItem.findAndCountAll(
      {
        subQuery: false,
        where: {
          '$soal.jadwals.id$': {
            [Op.eq]: jadwal.id
          }
        },
        attributes: [
          'id',
          'type',
          'num',
          'text',
          'bobot',
          'options',
          'labels',
          'corrects',
          'relations',
          'answer',
          'shuffle',
        ],
        include: [
          {
            model: Soal,
            attributes: [],
            include: [
              {
                model: Jadwal,
                attributes: [],
                through: {
                  attributes: []
                }
              }
            ]
          }
        ],
        order: [jadwal.shuffle ? literal('rand()') : 'num'],
        limit: jadwal.soal_count
      }
    );
    if (soals.count) {
      const worker = new Worker('./workers/PupulateSoal.js', { workerData: { rows: JSON.stringify(soals.rows) } });
      worker.on('message', async (items) => {
        const login = await PesertaLogin.create({
          start: new Date(),
          jadwalId: jadwal.id,
          pesertaId: req.user.id,
          peserta_tests: items
        }, {
          include: [PesertaTest]
        });
        const plogin = await PesertaLogin.findByPk(login.id, {
          include: [
            {
              model: Jadwal,
              attributes: [
                'name',
                'start',
                'end',
                'duration',
                'show_score',
              ]
            },
            {
              model: PesertaTest,
              attributes: [
                'id',
                'type',
                'text',
                'options',
                'labels',
                'relations',
                'jawaban'
              ]
            }
          ],
          order: [
            [PesertaTest, 'id', 'asc']
          ]
        });
        return res.json(plogin);
      });
      worker.on('error', error => {
        return sendStatus(res, 500, 'Tidak dapat mengambil data worker: ' + error);
      })
    } else {
      return sendStatus(res, 404, 'Soal tidak tersedia pada jadwal');
    }
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.saveJawaban = (req, res) => {
  const data = req.body;
  const { loginId } = req.params;
  const worker = new Worker('./workers/SaveJawaban.js', { workerData: { data, loginId } });
  worker.on('message', () => {
    return sendStatus(res, 202, 'Data berhasil disimpan');
  });
  worker.on('error', (error) => {
    return sendStatus(res, 500, 'Data gagal disimpan: ' + error);
  })
}

module.exports.stopUjian = (req, res) => {
  const { loginId } = req.params;
  PesertaLogin.update({ end: new Date() }, {
    where: {
      id: loginId
    }
  });
  return sendStatus(res, 202, 'Ujian berhasil dihentikan');
}

module.exports.getSelsai = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await PesertaLogin.findAndCountAll({
      subQuery: false,
      where: {
        pesertaId: req.user.id,
        [Op.or]: [
          {
            start: {
              [Op.gt]: new Date((new Date()).setMinutes((new Date()).getMinutes() - '$jadwal.duration$'))
            }
          },
          {
            end: {
              [Op.ne]: null
            }
          }
        ]
      },
      attributes: {
        include: [
          [fn('sum', col('peserta_tests.nilai')), 'nilai']
        ]
      },
      include: [
        {
          model: Jadwal,
          attributes: ['name', 'desc', 'duration', 'show_score', 'soal_count'],
          include: [
            {
              model: JadwalKategori,
              attributes: ['name', 'desc']
            }
          ]
        },
        {
          model: PesertaTest,
          attributes: []
        }
      ],
      order: [
        ['end', 'desc'],
        ['start', 'desc'],
      ],
      group: ['id'],
      limit: limit,
      offset: offset,
      distinct: true
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}