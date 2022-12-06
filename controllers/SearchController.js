const { Op, fn, col } = require("sequelize");
const JadwalKategori = require("../models/JadwalKategoriModel.js");
const Mapel = require("../models/MapelModel.js");
const Peserta = require("../models/PesertaModel.js");
const Sekolah = require("../models/SekolahModel.js");
const SoalKategori = require("../models/SoalKategoriModel.js");
const Soal = require("../models/SoalModel.js");
const User = require("../models/UserModel.js");

module.exports.soal = async (req, res) => {
  const { search } = req.query;
  try {
    const data = req.user.role === 'OPERATOR' ? await Soal.findAll({
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
          },
          {
            '$mapel.name$': {
              [Op.substring]: search
            }
          },
          {
            '$mapel.desc$': {
              [Op.substring]: search
            }
          }
        ],
        '$mapel.sekolahId$': { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
      ],
      include: [
        {
          model: Mapel,
          attributes: []
        }
      ],
      order: [
        ['name', 'asc']
      ]
    }) : await Soal.findAll({
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
          },
          {
            '$mapel.name$': {
              [Op.substring]: search
            }
          },
          {
            '$mapel.desc$': {
              [Op.substring]: search
            }
          }
        ],
        '$mapel.sekolahId$': { [Op.eq]: req.user.sekolahId },
        userId: { [Op.eq]: req.user.id }
      },
      attributes: [
        'id',
        [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
      ],
      include: [
        {
          model: Mapel,
          attributes: []
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

module.exports.soalByJadwal = async (req, res) => {
  const { search } = req.query;
  const { jid } = req.params;
  try {
    const data = req.user.role === 'OPERATOR' ? await Soal.findAll({
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
          },
          {
            '$mapel.name$': {
              [Op.substring]: search
            }
          },
          {
            '$mapel.desc$': {
              [Op.substring]: search
            }
          }
        ],
        '$mapel.sekolahId$': { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
      ],
      include: [
        {
          model: Mapel,
          attributes: []
        },
        {
          model: SoalKategori,
          required: true,
          attributes: [],
          include: [
            {
              model: JadwalKategori,
              as: 'jadwal_kategories',
              attributes: [],
              where: {
                id: jid
              }
            }
          ]
        }
      ],
      order: [
        ['name', 'asc']
      ]
    }) : await Soal.findAll({
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
          },
          {
            '$mapel.name$': {
              [Op.substring]: search
            }
          },
          {
            '$mapel.desc$': {
              [Op.substring]: search
            }
          }
        ],
        '$mapel.sekolahId$': { [Op.eq]: req.user.sekolahId },
        userId: { [Op.eq]: req.user.id }
      },
      attributes: [
        'id',
        [fn('concat', col('soals.name'), ' ', '(', col('soals.desc'), ')'), 'text']
      ],
      include: [
        {
          model: Mapel,
          attributes: []
        },
        {
          model: SoalKategori,
          required: true,
          attributes: [],
          include: [
            {
              model: JadwalKategori,
              as: 'jadwal_kategories',
              attributes: [],
              where: {
                id: jid
              }
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
        sekolahId: { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        ['ruang', 'id'],
        ['ruang', 'text']
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

module.exports.soalKategori = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await SoalKategori.findAll({
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
        sekolahId: { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        [fn('concat', col('name'), ' ', '(', col('desc'), ')'), 'name']
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
        sekolahId: { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        ['name', 'text']
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

module.exports.penilai = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await User.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          },
          {
            email: {
              [Op.substring]: search
            }
          },
          {
            '$mapels.name$': {
              [Op.substring]: search
            }
          },
          {
            '$mapels.desc$': {
              [Op.substring]: search
            }
          }
        ],
        role: 'PENILAI',
        sekolahId: { [Op.eq]: req.user.sekolahId }
      },
      attributes: [
        'id',
        ['name', 'text']
      ],
      include: [
        {
          model: Mapel,
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