const { Op } = require('sequelize');
const { parentPort, workerData } = require('worker_threads');
const Peserta = require('../models/PesertaModel');
const Sekolah = require('../models/SekolahModel');

const data = JSON.parse(workerData);
data.arr.forEach(async (v, i) => {
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
        if (checkUsername.sekolahId === data.sekolahId) {
          await Peserta.update({ ...v, ...({ password_raw: v.password, token: null }) }, { where: { id: checkUsername.id } });
        }
      } else {
        await Peserta.create({ ...v, ...({ password_raw: v.password, sekolahId: data.sekolahId }) }, {
          include: [Sekolah]
        });
      }

      if (i == data.arr.length - 1) {
        parentPort.postMessage(JSON.stringify({
          status: 'success',
          data: (i + 1)
        }));
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    parentPort.postMessage(JSON.stringify({
      status: 'error',
      message: error.message
    }));
  }
});