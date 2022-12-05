const { Op } = require("sequelize");
const SoalItem = require("../models/SoalItemModel.js");
const { getPagination, getPagingData } = require("../utils/Pagination.js");
const { existsSync, mkdirSync, rmSync, writeFileSync } = require("fs");

module.exports.getSoalItems = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    const datas = await SoalItem.findAndCountAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            text: {
              [Op.substring]: search
            }
          },
          {
            options: {
              [Op.substring]: search
            }
          },
          {
            labels: {
              [Op.substring]: search
            }
          }
        ],
        soalId: req.params.soalid
      },
      order: [
        ['num', 'asc']
      ],
      distinct: true,
      group: ['id'],
      limit: limit,
      offset: offset
    });
    return res.status(200).json(getPagingData(datas, page, size));
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data: ' + error.message);
  }
}

module.exports.getSoalItem = async (req, res) => {
  try {
    const data = await SoalItem.findOne({
      where: {
        id: req.params.id,
        soalId: req.params.soalid
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    return sendStatus(res, 500, 'Tidak dapat mengambil data');
  }
}

const saveAssets = (dir, assets) => {
  const newAssets = [];
  if (assets.length) {
    if (!existsSync(`${process.env.APP_ASSETS_PATH}/assets/${dir}`)) {
      mkdirSync(`${process.env.APP_ASSETS_PATH}/assets/${dir}`);
    }
    assets.forEach(v => {
      if (v.hasOwnProperty('base64Data')) {
        writeFileSync(`${process.env.APP_ASSETS_PATH}${v.filename}`, v.base64Data, 'base64');
      }
      newAssets.push({ filename: v.filename });
    });
  }

  return newAssets;
}

const deleteAssets = (assets, dassets) => {
  dassets.forEach(v => {
    let skip = false;
    assets.forEach(vv => {
      if (skip) {
        return;
      }
      if (v.filename === vv.filename) {
        skip = true;
        return;
      }
    });
    if (!skip) {
      try {
        if (existsSync(`${process.env.APP_ASSETS_PATH}${v.filename}`)) rmSync(`${process.env.APP_ASSETS_PATH}${v.filename}`);
      } catch { }
    }
  });
}

module.exports.store = async (req, res) => {
  const { type, num, text, bobot, options, corrects, relations, labels, assets, shuffle, answer } = req.body;
  if (!type || !num || !text) {
    return sendStatus(res, 406, 'Data yang dikirim tidak lengkap');
  }

  try {
    if (req.params?.id) {
      try {
        const data = await SoalItem.findByPk(req.params.id);
        if (data) {
          deleteAssets(assets, data.assets);
        }
      } catch (error) {
        return sendStatus(res, 500, 'Data gagal disimpan: ' + error.message);
      }
      const newAssets = saveAssets(req.params.soalid, assets);
      await SoalItem.update({ type, num, text, bobot, options, corrects, relations, labels, assets: newAssets, shuffle, answer }, {
        where: {
          id: req.params.id,
          soalId: req.params.soalid
        }
      });
    } else {
      const newAssets = saveAssets(req.params.soalid, assets);
      await SoalItem.create({ type, num, text, bobot, options, corrects, relations, labels, assets: newAssets, shuffle, answer, soalId: req.params.soalid });
    }
    return sendStatus(res, 201, 'Data berhasil disimpan');
  } catch (error) {
    return sendStatus(res, 500, 'Data gagal disimpan: ' + error.message);
  }
}

module.exports.destroy = async (req, res) => {
  try {
    const data = await SoalItem.findByPk(req.params.id);
    if (data) {
      deleteAssets([], data.assets);
    }
    await SoalItem.destroy({
      where: {
        id: req.params.id,
        soalId: req.params.soalid
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