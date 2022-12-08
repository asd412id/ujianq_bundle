const { Op } = require('sequelize');
const { parentPort, workerData } = require('worker_threads');
const Peserta = require('../models/PesertaModel');
const Sekolah = require('../models/SekolahModel');

workerData.arr.forEach(async (v, i) => {
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
        if (checkUsername.sekolahId === workerData.sekolahId) {
          await Peserta.update({ ...v, ...({ password_raw: v.password }) }, { where: { id: checkUsername.id } });
        }
      } else {
        await Peserta.create({ ...v, ...({ password_raw: v.password, sekolahId: workerData.sekolahId }) }, {
          include: [Sekolah]
        });
      }

      if (i == workerData.arr.length - 1) {
        parentPort.postMessage({
          status: 'success',
          data: (i + 1)
        });
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    parentPort.postMessage({
      status: 'error',
      message: error.message
    });
  }
});