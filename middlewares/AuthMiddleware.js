const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel.js');
const Peserta = require('../models/PesertaModel.js');
const Sekolah = require('../models/SekolahModel.js');

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.cookies._token || req.header('Authorization');
  if (!token) {
    return accessDenied('Token tidak ada', res);
  } else {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      if (!decode) {
        return accessDenied('Anda tidak memiliki akses', res);
      }

      const user = decode._type === 'admin' ? await User.scope('hidePassword').findByPk(decode._id, { include: { model: Sekolah, attributes: ['id', 'name', 'opt'] } }) : await Peserta.scope('hidePassword').findByPk(decode._id, { include: { model: Sekolah, attributes: ['id', 'name', 'opt'] } });
      if (!user) {
        if (req.cookies._token) {
          res.cookie('_token', 'null', { maxAge: -1 });
        }
        return accessDenied('Anda tidak memiliki akses', res);
      }

      if (decode._type === 'peserta') {
        if (decode._token !== user.token) {
          if (req.cookies._token) {
            res.cookie('_token', 'null', { maxAge: -1 });
          }
          return accessDenied('Anda sudah login di tempat lain', res);
        }
      }

      req.user = user;
    } catch (error) {
      return accessDenied('Anda tidak memiliki akses', res);
    }
  }

  next();
}

module.exports = auth;

const accessDenied = (msg, res) => {
  return res.status(401).json({
    message: msg
  });
}