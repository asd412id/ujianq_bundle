import bcryptjs from 'bcryptjs';
import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import Sekolah from './SekolahModel.js';
import dotenv from 'dotenv';
import Jadwal from './JadwalModel.js';
import Mapel from './MapelModel.js';

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
  }
});

Sekolah.hasMany(User, {
  onDelete: 'CASCADE'
});
User.belongsToMany(Mapel, { through: 'User_Mapel', timestamps: false });
Mapel.belongsToMany(User, { through: 'User_Mapel', timestamps: false });
User.belongsTo(Sekolah);
User.belongsToMany(Jadwal, { through: 'User_Jadwal', timestamps: false });
Jadwal.belongsToMany(User, { through: 'User_Jadwal', timestamps: false });

export default User;

(async () => {
  await db.sync();
})();