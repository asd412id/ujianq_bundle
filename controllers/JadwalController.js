const { existsSync, rmSync } = require("fs");
const { col, fn, Op } = require("sequelize");
const Mapel = require("../models/MapelModel.js");
const Jadwal = require("../models/JadwalModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");
const Peserta = require("../models/PesertaModel.js");
const Soal = require("../models/SoalModel.js");

module.exports.getJadwals = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await Jadwal.findAndCountAll({
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
        jadwalKategoryId: req.params.jid
      },
      attributes: {
        include: [
          [fn('count', col('pesertas.id')), 'peserta_count']
        ]
      },
      include: [
        {
          model: Peserta,
          attributes: []
        }
      ],
      order: [
        ['createdAt', 'asc']
      ],
      distinct: true,
      group: ['id'],
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
  const { name, desc, mapelId } = req.body;
  if (!name || !mapelId) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  try {
    if (req.params?.id) {
      await Jadwal.update({ name, desc, mapelId: mapelId }, {
        where: {
          id: req.params.id,
          jadwalKategoryId: req.params.jid
        }
      });
    } else {
      await Jadwal.create({ name, desc, mapelId: mapelId, jadwalKategoryId: req.params.jid });
    }
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan');
  }
}

module.exports.destroy = async (req, res) => {
  try {
    if (existsSync(`${process.env.APP_ASSETS_PATH}/assets/${req.params.id}`)) {
      rmSync(`${process.env.APP_ASSETS_PATH}/assets/${req.params.id}`, { recursive: true, force: true });
    }
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

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}