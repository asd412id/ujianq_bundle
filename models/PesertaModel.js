import bcryptjs from 'bcryptjs';
import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import Jadwal from './JadwalModel.js';
import PesertaLogin from './PesertaLoginModel.js';

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

export default Peserta;

(async () => {
  await db.sync();
})();