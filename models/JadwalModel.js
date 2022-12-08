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
});

Jadwal.hasMany(PesertaLogin, {
  onDelete: 'CASCADE'
});
PesertaLogin.belongsTo(Jadwal);
Jadwal.belongsToMany(Soal, { through: 'Jadwal_Soal', timestamps: false });
Soal.belongsToMany(Jadwal, { through: 'Jadwal_Soal', timestamps: false });

module.exports = Jadwal;