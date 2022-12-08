const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');

const { DataTypes } = Sequelize;

const PesertaTest = db.define('peserta_tests', {
  type: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'PG',
    comment: 'PG, PGK, IS, E, BS, JD'
  },
  num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bobot: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  nilai: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  options: {
    type: DataTypes.JSON
  },
  corrects: {
    type: DataTypes.JSON
  },
  relations: {
    type: DataTypes.JSON
  },
  labels: {
    type: DataTypes.JSON
  },
  answer: {
    type: DataTypes.TEXT
  },
  jawaban: {
    type: DataTypes.JSON
  }
});

module.exports = PesertaTest;