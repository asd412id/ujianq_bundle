const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const Soal = require('./SoalModel.js');

const { DataTypes } = Sequelize;

const Mapel = db.define('mapels', {
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

Mapel.hasMany(Soal);
Soal.belongsTo(Mapel);

module.exports = Mapel;