import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import SoalItem from './SoalItemModel.js';

const { DataTypes } = Sequelize;

const Soal = db.define('soals', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Soal.hasMany(SoalItem, {
  onDelete: 'CASCADE'
});
SoalItem.belongsTo(Soal);

export default Soal;

(async () => {
  await db.sync();
})();