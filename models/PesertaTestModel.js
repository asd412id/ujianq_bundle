import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';

const { DataTypes } = Sequelize;

const PesertaTest = db.define('peserta_tests', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PG',
    comment: 'PG, PGK, IS, E, BS, JD'
  },
  bobot: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  nilai: {
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
  answer: {
    type: DataTypes.TEXT
  }
});

export default PesertaTest;

(async () => {
  await db.sync();
})();