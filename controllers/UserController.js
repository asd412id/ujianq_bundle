const User = require("../models/UserModel.js");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require("bcryptjs");
const Sekolah = require("../models/SekolahModel.js");
const { Sequelize } = require("sequelize");
const Peserta = require("../models/PesertaModel.js");
const isEmail = require('is-email');
const randomstring = require('randomstring');

dotenv.config();
const { compareSync } = bcryptjs;

exports.UserRegister = async (req, res) => {
  const { sekolah, name, email, password } = req.body;
  if (!name || !email) {
    return res.status(406).json({ message: 'Data tidak lengkap' });
  }

  const datauser = await User.findOne({ where: { email } });
  if (datauser) {
    return res.status(406).json({ message: `Email "${email}" sudah terdaftar sebelumnya` });
  }

  const data = {
    name: sekolah,
    users: [{
      name: name,
      email: email,
      password: password
    }]
  };
  try {
    const insert = Sekolah.create(data, {
      include: [User]
    });
    if (!insert) {
      return res.status(500).json({ message: 'Gagal menyimpan data' });
    }
    return res.status(201).json({ message: 'Data berhasil disimpan' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan data' });
  }

}

exports.UserLogin = async (req, res) => {
  const { username, password } = req.body;
  let datauser = null;
  let typeUser = null;
  let __token = null;

  if (isEmail(username)) {
    datauser = await User.findOne({ where: { email: username } });
    typeUser = 'admin';
  } else {
    datauser = await Peserta.findOne({ where: { username } });
    if (datauser.token !== null) {
      if (req.cookies._token) {
        res.cookie('_token', 'null', { maxAge: -1 });
      };
      return res.status(401).json({ message: 'Anda sudah login di tempat lain' });
    }
    typeUser = 'peserta';
  }
  if (!datauser) {
    return errorLogin(res);
  }

  const passwordUser = compareSync(password, datauser.password);
  if (!passwordUser) {
    return errorLogin(res);
  }

  if (typeUser === 'peserta') {
    __token = randomstring.generate(40);
    datauser.update({ token: __token });
  }

  const data = {
    _id: datauser.id,
    _type: typeUser,
    _token: __token
  };
  const token = jwt.sign(data, process.env.JWT_SECRET);

  return res.status(200).cookie('_token', token, { maxAge: 24 * 60 * 60 * 1000 }).json({
    message: 'Login Berhasil',
    token: token
  });
}

exports.UserLogout = async (req, res) => {
  if (req.user.token) {
    req.user.update({ token: null });
  }
  if (req.cookies._token) {
    res.cookie('_token', 'null', { maxAge: -1 });
  }
  return res.status(200).json({
    data: null,
    token: null
  });
}

exports.checkLogin = async (req, res) => {
  return res.status(200).json(req.user);
}

exports.updateAccount = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (!name || !email) {
    return res.status(406).json({ message: 'Data tidak lengkap' });
  }
  const datauser = await User.findOne({
    where: {
      email,
      id: {
        [Sequelize.Op.ne]: req.user.id
      }
    }
  });

  if (datauser) {
    return res.status(406).json({ message: `Email "${email}" sudah terdaftar sebelumnya` });
  }

  try {
    const data = {};
    data['name'] = name;
    data['email'] = email;
    if (password) {
      if (password !== confirm_password) {
        return res.status(406).json({ message: `Perulangan password tidak sesuai` });
      }
      data['password'] = password;
    }

    const update = await User.update(data, { where: { id: req.user.id } });
    if (update[0] > 0) {
      return res.status(201).json({
        message: 'Data berhasil disimpan',
        data: await User.scope('hidePassword').findByPk(req.user.id)
      });
    }
    return res.status(500).json({ message: 'Data gagal disimpan' });
  } catch (error) {
    return res.status(500).json({ message: 'Data gagal disimpan' });
  }
}

exports.getUsers = async (req, res) => {
  const users = await User.scope('hidePassword').findAll({
    order: [['name', 'asc']],
    include: Sekolah
  });
  return res.status(200).json(users);
}

const errorLogin = (res) => {
  return res.status(404).json({ message: 'Data login tidak ditemukan' });
}