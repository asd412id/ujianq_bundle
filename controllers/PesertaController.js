const { Op } = require("sequelize");
const Peserta = require("../models/PesertaModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");

module.exports.getPesertas = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await Peserta.scope('hidePassword').findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          },
          {
            username: {
              [Op.substring]: search
            }
          },
          {
            ruang: {
              [Op.substring]: search
            }
          }
        ],
        sekolahId: req.user.sekolahId
      },
      order: [
        ['name', 'asc'],
        ['username', 'asc']
      ],
      limit: limit,
      offset: offset,
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.getPeserta = async (req, res) => {
  try {
    const data = await Peserta.scope('hidePassword').findOne({
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
  const { name, jk, username, password, ruang } = req.body;

  const data = {};

  try {
    const checkUsername = await Peserta.findOne({
      where: {
        username,
        id: {
          [Op.ne]: req.params?.id
        }
      }
    });
    if (checkUsername) {
      return sendStatus(res, 406, `Email "${username}" sudah digunakan`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  try {
    if (req.params?.id) {
      if (!name || !username) {
        return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
      }

      data.name = name;
      data.username = username;
      data.ruang = ruang;

      if (password) {
        data.password = password;
      }

      await Peserta.update(data, {
        where: {
          id: req.params.id,
          sekolahId: req.user.sekolahId
        }
      });
    } else {
      if (!name || !username || !password) {
        return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
      }

      data.name = name;
      data.jk = jk;
      data.username = username;
      data.password = password;
      data.ruang = ruang;
      data.sekolahId = req.user.sekolahId;

      await Peserta.create(data);
    }

    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan');
  }
}

module.exports.destroy = async (req, res) => {
  const destroy = await Peserta.destroy({
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

module.exports.importExcel = async (req, res) => {
  const arr = req.body;
  let waiting = null;
  let finish = false;
  let c = 0;
  if (arr.length) {
    arr.forEach(async (v, i) => {
      if (v.username != '' && v.name != '' && v.password != '') {
        try {
          const checkUsername = await Peserta.findOne({
            where: {
              username: {
                [Op.eq]: v.username
              }
            }
          });
          if (checkUsername) {
            if (checkUsername.sekolahId === req.user.sekolahId) {
              await Peserta.update(v, { where: { id: checkUsername.id } });
              c++;
            }
          } else {
            v = { ...v, ...({ sekolahId: req.user.sekolahId }) };
            await Peserta.create(v);
            c++
          }
          if (i == arr.length - 1) {
            finish = true;
          }
        } catch (error) {
          console.log(`Error: ${error.message}`);
          finish = 'error';
        }
      }
    });
  } else {
    finish = true;
  }
  if (waiting) {
    clearInterval(waiting);
  }
  waiting = setInterval(() => {
    if (finish && finish !== 'error') {
      clearInterval(waiting);
      return sendStatus(res, 201, c + ' data berhasil diimpor');
    }
    if (finish === 'error') {
      clearInterval(waiting);
      return sendStatus(res, 500, 'Gagal Menyimpan Data');
    }
  });
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}