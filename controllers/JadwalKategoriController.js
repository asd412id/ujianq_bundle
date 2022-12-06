const { col, fn, Op } = require("sequelize");
const db = require("../configs/Database.js");
const JadwalKategori = require("../models/JadwalKategoriModel.js");
const Jadwal = require("../models/JadwalModel.js");
const SoalKategori = require("../models/SoalKategoriModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");

exports.getJadwalKategoris = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await JadwalKategori.findAndCountAll({
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
        sekolahId: req.user.sekolahId
      },
      include: [
        {
          model: Jadwal,
          separate: true,
          attributes: [
            [fn('count', col('jadwals.id')), 'count']
          ]
        },
        {
          model: SoalKategori,
          as: 'soal_kategories',
          attributes: [
            'id',
            [fn('concat', col('soal_kategories.name'), ' ', '(', col('soal_kategories.desc'), ')'), 'name']
          ],
          through: {
            attributes: []
          }
        }
      ],
      order: [
        ['createdAt', 'desc']
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

exports.getJadwalKategori = async (req, res) => {
  try {
    const data = await JadwalKategori.findOne({
      where: {
        id: req.params.id,
        sekolahId: req.user.sekolahId
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data');
  }
}

exports.store = async (req, res) => {
  const { name, desc, soal_kategories } = req.body;
  if (!name) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const sk = [...(soal_kategories.map(v => v.id))];

  const tr = await db.transaction();
  try {
    if (req.params?.id) {
      await JadwalKategori.update({ name, desc }, {
        where: {
          id: req.params.id,
          sekolahId: req.user.sekolahId
        }
      });
      const jk = await JadwalKategori.findByPk(req.params.id);
      jk.setSoal_kategories(sk);
    } else {
      const jk = await JadwalKategori.create({ name, desc, sekolahId: req.user.sekolahId });
      jk.addSoal_kategories(sk);
    }
    tr.commit();
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    tr.rollback();
    return sendStatus(res, 500, 'Data gagal disimpan: ' + error.message);
  }
}

exports.destroy = async (req, res) => {
  try {
    await JadwalKategori.destroy({
      where: {
        id: req.params.id,
        sekolahId: req.user.sekolahId
      }
    });
    return sendStatus(res, 202, 'Data berhasil dihapus');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal dihapus');
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}