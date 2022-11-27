const { Op } = require("sequelize");
const Mapel = require("../models/MapelModel.js");
const User = require("../models/UserModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");

module.exports.getMapels = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = req.user.role === 'OPERATOR' ? await Mapel.findAndCountAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          }, {
            desc: {
              [Op.substring]: search
            }
          }
        ],
        sekolahId: req.user.sekolahId
      },
      order: [
        ['name', 'asc']
      ],
      limit: limit,
      offset: offset,
    }) : await Mapel.findAndCountAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          }, {
            desc: {
              [Op.substring]: search
            }
          }
        ],
        sekolahId: req.user.sekolahId,
        '$users.id$': { [Op.eq]: req.user.id }
      },
      include: [
        {
          model: User,
          attributes: []
        }
      ],
      order: [
        ['name', 'asc']
      ],
      limit: limit,
      offset: offset,
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.getMapel = async (req, res) => {
  try {
    const data = await Mapel.findOne({
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

module.exports.store = async (req, res) => {
  const { name, desc } = req.body;
  if (!name) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  try {
    if (req.params?.id) {
      await Mapel.update({ name, desc }, {
        where: {
          id: req.params.id,
          sekolahId: req.user.sekolahId
        }
      });
    } else {
      await Mapel.create({ name, desc, sekolahId: req.user.sekolahId });
    }
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan');
  }
}

module.exports.destroy = async (req, res) => {
  try {
    await Mapel.destroy({
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