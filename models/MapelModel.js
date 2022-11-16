import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import Soal from './SoalModel.js';

const { DataTypes } = Sequelize;

const Mapel = db.define('mapels', {
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

Mapel.hasMany(Soal);
Soal.belongsTo(Mapel);

export default Mapel;

(async () => {
  await db.sync();
})();