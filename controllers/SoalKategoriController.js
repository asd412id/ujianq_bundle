import SoalKategori from "../models/SoalKateogoriModel.js";

export const getSoalKategoris = async (req, res) => {
  const datas = await SoalKategori.findAll({
    where: {
      sekolahId: req.user.sekolahId
    }
  });

  return res.status(200).json(datas);
}

export const getSoalKategori = async (req, res) => {
  const data = await SoalKategori.findOne({
    where: {
      id: req.params.id,
      sekolahId: req.user.sekolahId
    }
  });
  if (!data) {
    return sendStatus(res, 404, 'Data tidak ditemukan');
  }
  return res.status(200).json(data);
}

export const create = async (req, res) => {
  const { name, desc } = req.body;
  if (!name) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const insert = await SoalKategori.create({ name, desc, sekolahId: req.user.sekolahId });
  if (insert) {
    return sendStatus(res, 201, 'Data berhasil disimpan');
  }
  return sendStatus(res, 500, 'Data gagal disimpan');
}

export const update = async (req, res) => {
  const { name, desc } = req.body;
  if (!name) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const update = await SoalKategori.update({ name, desc }, {
    where: {
      id: req.params.id,
      sekolahId: req.user.sekolahId
    }
  });
  if (update[0] > 0) {
    return sendStatus(res, 202, 'Data berhasil disimpan');
  }
  return sendStatus(res, 500, 'Data gagal disimpan');
}

export const destroy = async (req, res) => {
  const destroy = await SoalKategori.destroy({
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