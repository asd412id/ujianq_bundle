import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import Soal from './SoalModel.js';

const { DataTypes } = Sequelize;

const SoalKategori = db.define('soal_kategories', {
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
});

SoalKategori.hasMany(Soal, {
  onDelete: 'CASCADE'
});
Soal.belongsTo(SoalKategori);

export default SoalKategori;

(async () => {
  await db.sync();
})();