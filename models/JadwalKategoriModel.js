const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const Jadwal = require('./JadwalModel.js');

const { DataTypes } = Sequelize;

const JadwalKategori = db.define('jadwal_kategories', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT
  }
});

JadwalKategori.hasMany(Jadwal, {
  onDelete: 'CASCADE'
});
Jadwal.belongsTo(JadwalKategori);

module.exports = JadwalKategori;