const { existsSync, rmSync } = require("fs");
const { col, fn, Op } = require("sequelize");
const Mapel = require("../models/MapelModel.js");
const SoalItem = require("../models/SoalItemModel.js");
const Soal = require("../models/SoalModel.js");
const User = require("../models/UserModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");

module.exports.getSoals = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = req.user.role === 'OPERATOR' ? await Soal.findAndCountAll({
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
        soalKategoryId: req.params.katid
      },
      attributes: {
        include: [
          [fn('count', col('soal_items.id')), 'soal_count']
        ]
      },
      include: [
        {
          model: SoalItem,
          attributes: []
        },
        {
          model: Mapel,
          attributes: ['name']
        }
      ],
      order: [
        ['createdAt', 'asc']
      ],
      distinct: true,
      group: ['id'],
      limit: limit,
      offset: offset
    }) : await Soal.findAndCountAll({
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
        soalKategoryId: req.params.katid,
        '$mapel->users.id$': { [Op.eq]: req.user.id }
      },
      attributes: {
        include: [
          [fn('count', col('soal_items.id')), 'soal_count']
        ]
      },
      include: [
        {
          model: SoalItem,
          attributes: []
        },
        {
          model: Mapel,
          attributes: ['name'],
          include: [
            {
              model: User,
              attributes: []
            }
          ]
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

module.exports.getSoal = async (req, res) => {
  try {
    const data = await Soal.findOne({
      where: {
        id: req.params.id,
        soalKategoryId: req.params.katid
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
      await Soal.update({ name, desc, mapelId: mapelId }, {
        where: {
          id: req.params.id,
          soalKategoryId: req.params.katid
        }
      });
    } else {
      await Soal.create({ name, desc, mapelId: mapelId, soalKategoryId: req.params.katid });
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
    await Soal.destroy({
      where: {
        id: req.params.id,
        soalKategoryId: req.params.katid
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