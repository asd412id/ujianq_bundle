const bcryptjs = require('bcryptjs');
const { Sequelize } = require('sequelize');
const db = require('../configs/Database.js');
const Sekolah = require('./SekolahModel.js');
const dotenv = require('dotenv');
const Jadwal = require('./JadwalModel.js');
const Mapel = require('./MapelModel.js');
const Soal = require('./SoalModel.js');

dotenv.config();

const { hashSync } = bcryptjs;

const { DataTypes } = Sequelize;

const User = db.define('users', {
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
  email: {
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
  role: {
    type: DataTypes.STRING,
    defaultValue: 'OPERATOR',
    comment: 'ADMIN, OPERATOR, PENILAI',
    allowNull: false
  }
}, {
  scopes: {
    hidePassword: {
      attributes: {
        exclude: ['password']
      }
    }
  },
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

Sekolah.hasMany(User, {
  onDelete: 'CASCADE'
});
User.hasMany(Soal);
Soal.belongsTo(User);
User.belongsToMany(Mapel, { through: 'user_mapel', timestamps: false });
Mapel.belongsToMany(User, { through: 'user_mapel', timestamps: false });
User.belongsTo(Sekolah);
User.belongsToMany(Jadwal, { through: 'user_jadwal', timestamps: false });
Jadwal.belongsToMany(User, { through: 'user_jadwal', timestamps: false });

module.exports = User;