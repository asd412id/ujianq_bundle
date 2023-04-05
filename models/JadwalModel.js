const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const PesertaLogin = require('./PesertaLoginModel.js');
const Soal = require('./SoalModel.js');

const { DataTypes } = Sequelize;

const Jadwal = db.define('jadwals', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.TEXT,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.SMALLINT
  },
  soal_count: {
    type: DataTypes.SMALLINT
  },
  shuffle: {
    type: DataTypes.BOOLEAN
  },
  show_score: {
    type: DataTypes.BOOLEAN
  },
  active: {
    type: DataTypes.BOOLEAN
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

Jadwal.hasMany(PesertaLogin, {
  onDelete: 'CASCADE'
});
PesertaLogin.belongsTo(Jadwal);
Jadwal.belongsToMany(Soal, { through: 'jadwal_soal', timestamps: false });
Soal.belongsToMany(Jadwal, { through: 'jadwal_soal', timestamps: false });

module.exports = Jadwal;