const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const SoalItem = require('./SoalItemModel.js');

const { DataTypes } = Sequelize;

const Soal = db.define('soals', {
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

Soal.hasMany(SoalItem, {
  onDelete: 'CASCADE'
});
SoalItem.belongsTo(Soal);

module.exports = Soal;