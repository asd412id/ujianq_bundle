import { col, fn, Op } from "sequelize";
import SoalKategori from "../models/SoalKategoriModel.js";
import Soal from "../models/SoalModel.js";
import { getPagination, getPagingData } from "../utils/Pagination.js";

export const getSoalKategoris = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await SoalKategori.findAndCountAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: search
            }
          },
          {
            desc: {
              [Op.substring]: search
            }
          }
        ],
        sekolahId: req.user.sekolahId
      },
      attributes: {
        include: [
          [fn('count', col('soals.id')), 'soal_count']
        ]
      },
      include: [
        {
          model: Soal,
          attributes: []
        }
      ],
      order: [
        ['createdAt', 'desc']
      ],
      group: ['id'],
      limit: limit,
      offset: offset,
      distinct: true
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

export const getSoalKategori = async (req, res) => {
  try {
    const data = await SoalKategori.findOne({
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

export const store = async (req, res) => {
  const { name, desc } = req.body;
  if (!name) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  try {
    if (req.params?.id) {
      await SoalKategori.update({ name, desc }, {
        where: {
          id: req.params.id,
          sekolahId: req.user.sekolahId
        }
      });
    } else {
      await SoalKategori.create({ name, desc, sekolahId: req.user.sekolahId });
    }
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan');
  }
}

export const destroy = async (req, res) => {
  try {
    await SoalKategori.destroy({
      where: {
        id: req.params.id,
        sekolahId: req.user.sekolahId
      }
    });
    return sendStatus(res, 202, 'Data berhasil dihapus');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal dihapus');
  }
}

const sendStatus = (res, status, text) => {
  return res.status(status).json({ message: text });
}