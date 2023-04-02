const { Op } = require("sequelize");
const Peserta = require("../models/PesertaModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");
const { Worker } = require('worker_threads');
const Sekolah = require("../models/SekolahModel.js");

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
        ['username', 'asc'],
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
      data.password_raw = password;
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
  let destroy = null;
  if (req.params.id === 'all') {
    destroy = await Peserta.destroy({ where: {} });
  } else {
    destroy = await Peserta.destroy({
      where: {
        id: req.params.id,
        sekolahId: req.user.sekolahId
      }
    });
  }
  if (destroy) {
    return sendStatus(res, 202, 'Data berhasil dihapus');
  }
  return sendStatus(res, 500, 'Data gagal dihapus');
}

const importProcess = (data, req) => {
  return new Promise((resolve, eject) => {
    const loop = async (i) => {
      if (i == data.length) {
        resolve(i);
        return;
      }
      const v = data[i];
      try {
        if (v.username != '' && v.name != '' && v.password != '') {
          const checkUsername = await Peserta.findOne({
            where: {
              username: {
                [Op.eq]: v.username
              }
            }
          });
          if (checkUsername) {
            if (checkUsername.sekolahId === req.user.sekolahId) {
              await Peserta.update({ ...v, ...({ password_raw: v.password, token: null }) }, { where: { id: checkUsername.id } });
            }
          } else {
            await Peserta.create({ ...v, ...({ password_raw: v.password, sekolahId: req.user.sekolahId }) }, {
              include: [Sekolah]
            });
          }
        }
        setTimeout(() => {
          loop(i + 1);
        }, 0);
      } catch (error) {
        console.log(`Error: ${error.message}`);
        eject(error.message);
      }
    }
    let i = 0;
    loop(i);
  });
}

module.exports.importExcel = async (req, res) => {
  const arr = req.body;
  if (arr.length) {
    importProcess(arr, req)
      .then(c => {
        return sendStatus(res, 201, c + ' data berhasil diimpor');
      })
      .catch(error => {
        return sendStatus(res, 500, 'Data gagal diimpor: ' + error);
      });
  } else {
    return sendStatus(res, 200, 'Tidak ada data yang diimpor');
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
      raw: true
    }))].map(e => e.ruang);
    return res.json(ruangs);
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mengambil data');
  }
}

module.exports.getPesertasByRuang = async (req, res) => {
  const { ruang } = req.params;
  try {
    const data = await Peserta.findAll({
      where: {
        ruang: {
          [Op.eq]: ruang
        },
        sekolahId: req.user.sekolahId
      }
    });
    return res.json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mengambil data');
  }
}

module.exports.resetLogin = async (req, res) => {
  try {
    const peserta = await Peserta.findByPk(req.params.id);
    if (!peserta) {
      return sendStatus(res, 404, 'Data peserta tidak ditemukan');
    }
    peserta.update({ token: null });
    return sendStatus(res, 202, 'Data login ' + peserta.name + ' berhasil direset');
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mengambil data: ' + error.message);
  }
}

module.exports.resetAll = async (req, res) => {
  try {
    await Peserta.update({ token: null }, {
      where: {
        sekolahId: req.user.sekolahId
      }
    });
    return sendStatus(res, 202, 'Semua data login berhasil direset');
  } catch (error) {
    return sendStatus(res, 500, 'Gagal mereset data: ' + error.message);
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}