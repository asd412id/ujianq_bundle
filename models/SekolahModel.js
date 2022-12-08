const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const JadwalKategori = require('./JadwalKategoriModel.js');
const Mapel = require('./MapelModel.js');
const Peserta = require('./PesertaModel.js');
const SoalKategori = require('./SoalKategoriModel.js');
const Soal = require('./SoalModel.js');

const { DataTypes } = Sequelize;

const Sekolah = db.define('sekolahs', {
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
  opt: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('opt'));
    },
    set: function (value) {
      this.setDataValue('opt', JSON.stringify(value));
    }
  }
});

Sekolah.hasMany(Mapel, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(Peserta, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(SoalKategori, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(JadwalKategori, {
  onDelete: 'CASCADE'
});
Mapel.belongsTo(Sekolah);
Peserta.belongsTo(Sekolah);
SoalKategori.belongsTo(Sekolah);
JadwalKategori.belongsTo(Sekolah);

module.exports = Sekolah;