const Sekolah = require("../models/SekolahModel.js");
const { extname } = require('path');
const { existsSync, rmSync, mkdirSync } = require("fs");
const Mapel = require("../models/MapelModel.js");
const User = require("../models/UserModel.js");
const Peserta = require("../models/PesertaModel.js");
const Soal = require("../models/SoalModel.js");
const SoalKategori = require("../models/SoalKategoriModel.js");
const JadwalKategori = require("../models/JadwalKategoriModel.js");
const Jadwal = require("../models/JadwalModel.js");
require('dotenv').config();


module.exports.getData = async (req, res) => {
  const sekolah = await Sekolah.findByPk(req.user.sekolahId);

  return res.status(200).json(sekolah);
}

module.exports.updateSekolah = async (req, res) => {
  const { name, opt } = req.body;
  if (!name) {
    return res.status(406).json({ message: 'Data yang dikirim tidak lengkap' });
  }

  const jopt = JSON.parse(opt) ?? {
    opt: null,
    address: null
  };

  let kopName = '';
  const sekolah = await Sekolah.findByPk(req.user.sekolahId);
  if (!sekolah) {
    return res.status(406).json({ message: 'Data sekolah tidak ditemukan' });
  }

  jopt['kop'] = sekolah.opt?.kop;

  if (req.files && Object.keys(req.files).length) {
    const kop = req.files.kop;

    if (kop.size > 2 * 1024 * 1024) {
      return res.status(406).json({ message: 'File kop tidak boleh lebih dari 2MB' });
    }

    const ext = extname(kop.name);
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    if (!allowedExt.includes(ext)) {
      return res.status(406).json({ message: 'File kop hanya boleh berekstensi jpg, jpeg, atau png' });
    }

    if (existsSync(`${process.env.APP_ASSETS_PATH}${sekolah.opt?.kop}`)) {
      rmSync(`${process.env.APP_ASSETS_PATH}${sekolah.opt?.kop}`);
    }

    if (!existsSync(`${process.env.APP_ASSETS_PATH}/assets`)) {
      mkdirSync(`${process.env.APP_ASSETS_PATH}/assets`);
    }

    if (!existsSync(`${process.env.APP_ASSETS_PATH}/assets/kop`)) {
      mkdirSync(`${process.env.APP_ASSETS_PATH}/assets/kop`);
    }

    kopName = `/assets/kop/${kop.md5}-${Date.now()}${ext}`;
    kop.mv(`${process.env.APP_ASSETS_PATH}${kopName}`);
    jopt['kop'] = kopName;
  }

  const update = sekolah.update({ name, opt: jopt });
  if (update) {
    return res.status(202).json({ message: 'Data berhasil disimpan' });
  }
  return res.status(500).json({ message: 'Data gagal disimpan' });
}

module.exports.getStatus = async (req, res) => {
  try {
    const mapel = await Mapel.count({
      where: {
        sekolahId: req.user.sekolahId
      }
    });
    const penilai = await User.count({
      where: {
        role: 'PENILAI',
        sekolahId: req.user.sekolahId
      }
    });
    const peserta = await Peserta.count({
      where: {
        sekolahId: req.user.sekolahId
      }
    });
    const soal = req.user.role === 'OPERATOR' ? await Soal.count({
      include: [
        {
          model: SoalKategori,
          required: true,
          where: {
            sekolahId: req.user.sekolahId
          },
          attributes: []
        }
      ]
    }) : await Soal.count({
      include: [
        {
          model: SoalKategori,
          required: true,
          where: {
            sekolahId: req.user.sekolahId
          },
          attributes: []
        },
        {
          model: User,
          required: true,
          where: {
            id: req.user.id
          },
          attributes: []
        }
      ]
    });
    const jadwal = req.user.role === 'OPERATOR' ? await Jadwal.count({
      include: [
        {
          model: JadwalKategori,
          required: true,
          where: {
            sekolahId: req.user.sekolahId
          },
          attributes: []
        }
      ]
    }) : await Jadwal.count({
      include: [
        {
          model: JadwalKategori,
          required: true,
          where: {
            sekolahId: req.user.sekolahId
          },
          attributes: []
        },
        {
          model: User,
          required: true,
          where: {
            id: req.user.id
          },
          attributes: []
        }
      ]
    });

    return res.json({ mapel, penilai, peserta, soal, jadwal });
  } catch (error) {
    res.status(500).json({ message: 'Tidak dapat memuat data: ' + error.message });
  }
}