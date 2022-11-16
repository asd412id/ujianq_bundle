import Sekolah from "../models/SekolahModel.js";


export const getData = async (req, res) => {
  const sekolah = await Sekolah.findByPk(req.user.sekolahId);

  return res.status(200).json(sekolah);
}

export const updateSekolah = async (req, res) => {
  const { name, opt } = req.body;
  if (!name || !opt) {
    return res.status(406).json({ message: 'Data yang dikirim tidak lengkap' });
  }

  const update = await Sekolah.update({ name, opt }, { where: { id: req.user.sekolahId } });
  if (update) {
    return res.status(202).json({ message: 'Data berhasil disimpan' });
  }
  return res.status(500).json({ message: 'Data gagal disimpan' });
}