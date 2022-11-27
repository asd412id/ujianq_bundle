const bcryptjs = require('bcryptjs');
const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const Jadwal = require('./JadwalModel.js');
const PesertaLogin = require('./PesertaLoginModel.js');

const { hashSync } = bcryptjs;

const { DataTypes } = Sequelize;

const Peserta = db.define('pesertas', {
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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', hashSync(value, 10));
    }
  },
  ruang: {
    type: DataTypes.STRING
  }
}, {
  scopes: {
    hidePassword: {
      attributes: {
        exclude: ['password']
      }
    }
  }
});

Peserta.belongsToMany(Jadwal, { through: 'Jadwal_Peserta', timestamps: false });
Jadwal.belongsToMany(Peserta, { through: 'Jadwal_Peserta', timestamps: false });
Peserta.hasMany(PesertaLogin, {
  onDelete: 'CASCADE'
});
PesertaLogin.belongsTo(Peserta);

module.exports = Peserta;

(async () => {
  await db.sync();
})();