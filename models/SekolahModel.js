import { Sequelize } from 'sequelize';
import db from '../configs/Database.js';
import JadwalKategori from './JadwalKategoriModel.js';
import Mapel from './MapelModel.js';
import Peserta from './PesertaModel.js';
import SoalKategori from './SoalKateogoriModel.js';
import Soal from './SoalModel.js';

const { DataTypes } = Sequelize;

const Sekolah = db.define('sekolahs', {
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
  opt: {
    type: DataTypes.JSON,
    set(value) {
      this.setDataValue('opt', JSON.stringify(value));
    },
    get() {
      return JSON.parse(this.getDataValue('opt'));
    }
  }
});

Sekolah.hasMany(Mapel, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(Peserta, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(SoalKategori, {
  onDelete: 'CASCADE'
});
Sekolah.hasMany(JadwalKategori, {
  onDelete: 'CASCADE'
});
Mapel.belongsTo(Sekolah);
Peserta.belongsTo(Sekolah);
SoalKategori.belongsTo(Sekolah);
JadwalKategori.belongsTo(Sekolah);

export default Sekolah;

(async () => {
  await db.sync();
})();