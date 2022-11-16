import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';

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

      const user = await User.scope('hidePassword').findByPk(decode._id);
      if (!user) {
        if (req.cookies._token) {
          res.cookie('_token', 'null', { maxAge: -1 });
        }
        return accessDenied('Anda tidak memiliki akses', res);
      }

      req.user = user;
    } catch (error) {
      return accessDenied('Anda tidak memiliki akses', res);
    }
  }

  next();
}

export default auth;

const accessDenied = (msg, res) => {
  return res.status(401).json({
    message: msg
  });
}