const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const PesertaTest = require('./PesertaTestModel.js');

const { DataTypes } = Sequelize;

const PesertaLogin = db.define('peserta_logins', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  start: {
    type: DataTypes.DATE
  },
  end: {
    type: DataTypes.DATE
  },
  current_number: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  checked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

PesertaLogin.hasMany(PesertaTest, {
  onDelete: 'CASCADE'
});
PesertaTest.belongsTo(PesertaLogin);

module.exports = PesertaLogin;