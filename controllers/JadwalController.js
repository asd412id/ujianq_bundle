const { existsSync, rmSync } = require("fs");
const { col, fn, Op } = require("sequelize");
const Jadwal = require("../models/JadwalModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");
const Peserta = require("../models/PesertaModel.js");
const Soal = require("../models/SoalModel.js");
const db = require("../configs/Database.js");
const User = require("../models/UserModel.js");
const SoalItem = require("../models/SoalItemModel.js");
const JadwalKategori = require("../models/JadwalKategoriModel.js");
const Mapel = require("../models/MapelModel.js");
const PesertaLogin = require("../models/PesertaLoginModel.js");
const PesertaTest = require("../models/PesertaTestModel.js");

module.exports.getJadwals = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = req.user.role === 'OPERATOR' ? await Jadwal.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          },
          {
            desc: {
              [Op.substring]: search
            }
          }
        ],
        jadwalKategoryId: req.params.jid
      },
      include: [
        {
          model: Peserta,
          attributes: [
            'username',
            'name',
            ['ruang', 'text']
          ],
          through: {
            attributes: []
          }
        },
        {
          model: JadwalKategori,
          attributes: [
            'name',
            'desc',
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            ['name', 'text']
          ],
          through: {
            attributes: []
          }
        },
        {
          model: Soal,
          attributes: [
            'id',
            [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
          ],
          through: {
            attributes: []
          },
          include: [Mapel]
        }
      ],
      order: [
        ['active', 'desc'],
        ['start', 'asc']
      ],
      distinct: true,
      limit: limit,
      offset: offset
    }) : await Jadwal.findAndCountAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          },
          {
            desc: {
              [Op.substring]: search
            }
          }
        ],
        jadwalKategoryId: req.params.jid,
        '$users.id$': { [Op.eq]: req.user.id }
      },
      include: [
        {
          model: Peserta,
          attributes: [
            'username',
            'name',
            ['ruang', 'text']
          ],
          through: {
            attributes: []
          }
        },
        {
          model: JadwalKategori,
          attributes: [
            'name',
            'desc',
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            ['name', 'text']
          ],
          through: {
            attributes: []
          }
        },
        {
          model: Soal,
          attributes: [
            'id',
            [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
          ],
          through: {
            attributes: []
          },
          include: [Mapel]
        }
      ],
      order: [
        ['active', 'desc'],
        ['start', 'asc']
      ],
      distinct: true,
      limit: limit,
      offset: offset
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.getJadwal = async (req, res) => {
  try {
    const data = await Jadwal.findOne({
      where: {
        id: req.params.id,
        jadwalKategoryId: req.params.jid
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data');
  }
}

module.exports.store = async (req, res) => {
  const { name, desc, start, end, duration, soal_count, shuffle, show_score, active, soals, ruangs, penilais } = req.body;
  if (!name || !start || !end || !duration || !soal_count || !soals.length || !ruangs.length) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const s = [];
  const r = [];
  const u = [];
  soals.forEach(v => {
    s.push(v.id);
  });

  const sCount = await SoalItem.count({
    attributes: ['id'],
    include: [
      {
        model: Soal,
        required: true,
        where: {
          id: {
            [Op.in]: s
          }
        },
        attributes: []
      }
    ]
  });

  ruangs.forEach(v => {
    r.push(v.text);
  });

  penilais.forEach(v => {
    u.push(v.id);
  });

  const tr = await db.transaction();
  try {
    const pesertas = await Peserta.findAll({
      where: {
        ruang: {
          [Op.in]: r
        }
      },
      attributes: ['id']
    });

    if (req.params?.id) {
      await Jadwal.update({
        name,
        desc,
        start,
        end,
        duration,
        soal_count: (soal_count <= sCount ? soal_count : sCount),
        shuffle,
        show_score,
        active
      },
        {
          where: {
            id: req.params.id,
            jadwalKategoryId: req.params.jid
          }
        }
      );
      const jadwal = await Jadwal.findByPk(req.params.id);
      jadwal.setSoals(s);
      jadwal.setPesertas(pesertas);
      jadwal.setUsers(u);
    } else {
      const jadwal = await Jadwal.create({
        name,
        desc,
        start,
        end,
        duration,
        soal_count: (soal_count <= sCount ? soal_count : sCount),
        shuffle,
        show_score,
        active,
        jadwalKategoryId: req.params.jid,
      });
      jadwal.addPesertas(pesertas);
      jadwal.addSoals(s);
      jadwal.addUsers(u);
    }
    tr.commit();
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    tr.rollback();
    return sendStatus(res, 500, 'Data gagal disimpan: ' + error.message);
  }
}

module.exports.destroy = async (req, res) => {
  try {
    await Jadwal.destroy({
      where: {
        id: req.params.id,
        jadwalKategoryId: req.params.jid
      }
    });
    return sendStatus(res, 202, 'Data berhasil dihapus');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal dihapus');
  }
}

module.exports.getRuangs = async (req, res) => {
  try {
    const ruangs = [...(await Peserta.findAll({
      where: {
        sekolahId: req.user.sekolahId
      },
      attributes: ['ruang'],
      group: ['ruang'],
      include: [
        {
          model: Jadwal,
          required: true,
          where: {
            id: req.params.id
          },
          through: {
            attributes: []
          }
        }
      ],
      raw: true
    }))].map(e => e.ruang);
    return res.json(ruangs);
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mengambil data');
  }
}

module.exports.monitor = async (req, res) => {
  const { search } = req.query;
  const { id, ruang } = req.params;
  try {
    const pesertas = await Peserta.findAll({
      where: {
        ruang: ruang,
        [Op.or]: [
          {
            username: {
              [Op.substring]: search
            }
          },
          {
            name: {
              [Op.substring]: search
            }
          }
        ]
      },
      include: [
        {
          model: Jadwal,
          required: true,
          attributes: [],
          where: {
            id: id
          },
          through: {
            attributes: []
          }
        },
        {
          model: PesertaLogin,
          required: false,
          where: {
            jadwalId: id
          },
          include: [
            {
              model: PesertaTest,
              required: false,
              attributes: [
                [fn('sum', col('nilai')), 'total_nilai']
              ]
            }
          ]
        }
      ],
      order: [
        ['username', 'asc'],
        ['name', 'asc']
      ],
      group: ['username']
    });
    return res.json(pesertas);
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mengambil data: ' + error.message);
  }
}

module.exports.stopUjian = async (req, res) => {
  const { loginid } = req.params;
  try {
    await PesertaLogin.update({ end: new Date() }, {
      where: {
        id: loginid
      }
    });
    return sendStatus(res, 202, 'Ujian berhasil dihentikan');
  } catch (error) {
    return sendStatus(res, 500, 'Gagal menghentikan ujian: ' + error.message);
  }
}

module.exports.resetUjian = async (req, res) => {
  const { loginid } = req.params;
  try {
    await PesertaLogin.destroy({
      where: {
        id: loginid
      }
    });
    return sendStatus(res, 202, 'Ujian berhasil reset');
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mereset ujian: ' + error.message);
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}