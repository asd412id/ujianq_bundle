import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import PesertaLogin from './PesertaLoginModel.js';
import Soal from './SoalModel.js';

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

export default Jadwal;

(async () => {
  await db.sync();
})();