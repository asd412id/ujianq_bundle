import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import PesertaTest from './PesertaTestModel.js';

const { DataTypes } = Sequelize;

const PesertaLogin = db.define('peserta_logins', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true
  },
  start: {
    type: DataTypes.DATE
  },
  end: {
    type: DataTypes.DATE
  },
  current_number: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  reset: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

PesertaLogin.hasMany(PesertaTest, {
  onDelete: 'CASCADE'
});
PesertaTest.belongsTo(PesertaLogin);

export default PesertaLogin;

(async () => {
  await db.sync();
})();