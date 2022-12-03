const { Op } = require("sequelize");
const Jadwal = require("../models/JadwalModel");
const PesertaLogin = require("../models/PesertaLoginModel");
const PesertaTest = require("../models/PesertaTestModel");

module.exports.ujianMiddleware = async (req, res, next) => {
  try {
    const login = await PesertaLogin.findOne({
      where: {
        pesertaId: req.user.id,
        end: {
          [Op.eq]: null
        }
      },
      include: [
        {
          model: Jadwal,
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
        },
        {
          model: PesertaTest,
          attributes: [
            'id',
            'type',
            'text',
            'options',
            'labels',
            'relations',
            'jawaban'
          ]
        }
      ],
      order: [
        [PesertaTest, 'id', 'asc']
      ]
    });
    if (login) {
      const start = new Date(login.start);
      const duration = login.jadwal.duration;
      const total = new Date(start.getTime() + (duration * 60 * 1000));
      const now = new Date();

      if (total.getTime() < now.getTime()) {
        login.update({ end: now });
        return res.status(406).json({ message: 'Ujian telah selesai' });
      }
      return res.json(login);
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Tidak dapat memuat data' });
  }
}