const { Op } = require("sequelize");
const User = require("../models/UserModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");

module.exports.getPenilais = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await User.scope('hidePassword').findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          }, {
            email: {
              [Op.substring]: search
            }
          }
        ],
        role: 'PENILAI',
        sekolahId: req.user.sekolahId
      },
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

module.exports.getPenilai = async (req, res) => {
  try {
    const data = await User.scope('hidePassword').findOne({
      where: {
        id: req.params.id,
        role: 'PENILAI',
        sekolahId: req.user.sekolahId
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data');
  }
}

module.exports.store = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  const data = {};

  try {
    const checkEmail = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: req.params?.id
        }
      }
    });
    if (checkEmail) {
      return sendStatus(res, 406, `Email "${email}" sudah digunakan`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  if (password !== confirm_password) {
    return sendStatus(res, 406, 'Perulangan password tidak benar');
  }

  try {
    if (req.params?.id) {
      if (!name || !email) {
        return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
      }

      data.name = name;
      data.email = email;

      if (password) {
        data.password = password;
      }

      await User.update(data, {
        where: {
          id: req.params.id,
          sekolahId: req.user.sekolahId
        }
      });
    } else {
      if (!name || !email || !password) {
        return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
      }

      data.name = name;
      data.email = email;
      data.password = password;
      data.role = 'PENILAI';
      data.sekolahId = req.user.sekolahId;

      await User.create(data);
    }

    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan');
  }
}

module.exports.destroy = async (req, res) => {
  const destroy = await User.destroy({
    where: {
      id: req.params.id,
      sekolahId: req.user.sekolahId
    }
  });
  if (destroy) {
    return sendStatus(res, 202, 'Data berhasil dihapus');
  }
  return sendStatus(res, 500, 'Data gagal dihapus');
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}