import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import PesertaTest from './PesertaTestModel.js';

const { DataTypes } = Sequelize;

const SoalItem = db.define('soal_items', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PG',
    comment: 'PG, PGK, IS, E, BS, JD'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  bobot: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  options: {
    type: DataTypes.JSON
  },
  corrects: {
    type: DataTypes.JSON
  },
  relations: {
    type: DataTypes.JSON
  },
  labels: {
    type: DataTypes.JSON
  },
  shuffle: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  answer: {
    type: DataTypes.TEXT
  }
});

SoalItem.hasMany(PesertaTest);
PesertaTest.belongsTo(SoalItem);

export default SoalItem;

(async () => {
  await db.sync();
})();