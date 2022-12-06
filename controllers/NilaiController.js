const { col, fn } = require("sequelize");
const Jadwal = require("../models/JadwalModel");
const PesertaLogin = require("../models/PesertaLoginModel");
const Peserta = require("../models/PesertaModel");
const PesertaTest = require("../models/PesertaTestModel");
const SoalItem = require("../models/SoalItemModel");

module.exports.getNilais = async (req, res) => {
  try {
    const login = await PesertaLogin.findByPk(req.params.loginId, {
      include: [
        {
          model: Peserta,
          attributes: ['id', 'name', 'ruang']
        },
        {
          model: Jadwal,
          attributes: ['name']
        },
        {
          model: PesertaTest,
          separate: true,
          order: [
            ['num', 'asc']
          ],
          include: [SoalItem]
        }
      ]
    });
    return res.json(login);
  } catch (error) {
    return res.status(500).json({ message: 'Tidak dapat memuat data: ' + error.message });
  }
}

module.exports.setNilai = (req, res) => {
  const data = req.body;
  try {
    if (Object.keys(data).length) {
      Object.keys(data).forEach(k => {
        PesertaTest.update({ nilai: data[k] }, {
          where: {
            id: k
          }
        });
      });
      PesertaLogin.update({ checked: true }, {
        where: {
          id: req.params.loginId
        }
      });
      return res.json({ message: 'Nilai berhasil diupdate' });
    }
    return res.json({ message: 'Tidak ada perubahan nilai' });
  } catch (error) {
    return res.status(500).json({ message: 'Tidak dapat memuat data: ' + error.message });
  }
}

module.exports.getNilaiByJadwal = async (req, res) => {
  const { jid, ruang } = req.params;
  try {
    const data = await Peserta.findAll({
      where: {
        ruang: ruang
      },
      include: [
        {
          model: Jadwal,
          required: true,
          where: {
            id: jid
          },
          attributes: []
        },
        {
          model: PesertaLogin,
          required: false,
          where: {
            jadwalId: jid
          },
          include: [
            {
              model: PesertaTest,
              attributes: [
                [fn('sum', col('nilai')), 'nilai']
              ]
            }
          ]
        }
      ],
      group: ['id'],
      order: [
        ['username', 'asc']
      ]
    });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Tidak dapat memuat data: ' + error.message });
  }
}