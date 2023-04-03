const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const JadwalKategori = require('./JadwalKategoriModel.js');
const Soal = require('./SoalModel.js');

const { DataTypes } = Sequelize;

const SoalKategori = db.define('soal_kategories', {
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

SoalKategori.hasMany(Soal, {
  onDelete: 'CASCADE'
});
Soal.belongsTo(SoalKategori);
SoalKategori.belongsToMany(JadwalKategori, { as: 'jadwal_kategories', through: 'jadwalkategori_soalkategori', timestamps: false });
JadwalKategori.belongsToMany(SoalKategori, { as: 'soal_kategories', through: 'jadwalkategori_soalkategori', timestamps: false });

module.exports = SoalKategori;