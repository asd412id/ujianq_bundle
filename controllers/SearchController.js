const { Op, fn, col } = require("sequelize");
const Mapel = require("../models/MapelModel.js");
const Peserta = require("../models/PesertaModel.js");
const Sekolah = require("../models/SekolahModel.js");
const SoalKategori = require("../models/SoalKategoriModel.js");
const Soal = require("../models/SoalModel.js");

module.exports.soal = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await Soal.findAll({
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
        '$soal_kategory->sekolah.id$': { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
      ],
      include: [
        {
          model: SoalKategori,
          attributes: [],
          include: [
            {
              model: Sekolah,
              attributes: [],
            }
          ]
        }
      ],
      order: [
        ['name', 'asc']
      ]
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.ruang = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await Peserta.findAll({
      where: {
        [Op.or]: [
          {
            ruang: {
              [Op.substring]: search
            }
          }
        ],
        '$sekolah.id$': { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        ['ruang', 'text']
      ],
      include: [
        {
          model: Sekolah,
          attributes: [],
        }
      ],
      group: 'ruang',
      order: [
        ['ruang', 'asc']
      ]
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.mapel = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await Mapel.findAll({
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
        '$sekolah.id$': { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        ['name', 'text']
      ],
      include: [
        {
          model: Sekolah,
          attributes: [],
        }
      ],
      order: [
        ['name', 'asc']
      ]
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}