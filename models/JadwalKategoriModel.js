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
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

JadwalKategori.hasMany(Jadwal, {
  onDelete: 'CASCADE'
});
Jadwal.belongsTo(JadwalKategori);

module.exports = JadwalKategori;