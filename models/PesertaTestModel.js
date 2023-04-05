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
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('options'));
    },
    set: function (value) {
      this.setDataValue('options', JSON.stringify(value));
    }
  },
  corrects: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('corrects'));
    },
    set: function (value) {
      this.setDataValue('corrects', JSON.stringify(value));
    }
  },
  relations: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('relations'));
    },
    set: function (value) {
      this.setDataValue('relations', JSON.stringify(value));
    }
  },
  labels: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('labels'));
    },
    set: function (value) {
      this.setDataValue('labels', JSON.stringify(value));
    }
  },
  answer: {
    type: DataTypes.TEXT
  },
  jawaban: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue('jawaban'));
    },
    set: function (value) {
      this.setDataValue('jawaban', JSON.stringify(value));
    }
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = PesertaTest;