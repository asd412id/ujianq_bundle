const { Op } = require("sequelize");
const Jadwal = require("../models/JadwalModel");
const PesertaLogin = require("../models/PesertaLoginModel");
const PesertaTest = require("../models/PesertaTestModel");

module.exports.tesMiddleware = async (req, res, next) => {
  try {
    const login = await PesertaLogin.count({
      where: {
        pesertaId: req.user.id,
        end: {
          [Op.eq]: null
        }
      },
      include: [
        {
          model: Jadwal,
          required: true,
          attributes: [
            'name',
            'start',
            'end',
            'duration',
            'show_score',
          ],
          where: {
            active: true
          }
        }
      ]
    });
    if (!login) {
      return res.status(406).json({ message: 'Ujian telah selesai' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Tidak dapat memuat data' });
  }
}