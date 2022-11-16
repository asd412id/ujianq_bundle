import Peserta from "../models/PesertaModel.js";

export const getPesertas = async (req, res) => {
  const datas = await Peserta.scope('hidePassword').findAll({
    where: {
      sekolahId: req.user.sekolahId
    }
  });

  return res.status(200).json(datas);
}

export const getPeserta = async (req, res) => {
  const data = await Peserta.scope('hidePassword').findOne({
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
  const { name, username, password, ruang } = req.body;
  if (!name || !username || !password || !ruang) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const insert = await Peserta.create({ name, username, password, ruang, sekolahId: req.user.sekolahId });
  if (insert) {
    return sendStatus(res, 201, 'Data berhasil disimpan');
  }
  return sendStatus(res, 500, 'Data gagal disimpan');
}

export const update = async (req, res) => {
  const { name, username, password, ruang } = req.body;
  if (!name || !username || !password) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  const update = await Peserta.update({ name, username, password, ruang }, {
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

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}