const express = require('express');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes.js');
const SekolahRoutes = require('./routes/SekolahRoutes.js');
const MapelRoutes = require('./routes/MapelRoutes.js');
const PenilaiRoutes = require('./routes/PenilaiRoutes.js');
const PesertaRoutes = require('./routes/PesertaRoutes.js');
const SoalKategoriRoutes = require('./routes/SoalKategoriRoutes.js');
const SoalRoutes = require('./routes/SoalRoutes.js');
const SoalItemRoutes = require('./routes/SoalItemRoutes.js');
const JadwalKategoriRoutes = require('./routes/JadwalKategoriRoutes.js');
const SearchRoutes = require('./routes/SearchRoutes.js');
const JadwalRoutes = require('./routes/JadwalRoutes.js');
const NilaiRoutes = require('./routes/NilaiRoutes.js');
const UjianRoutes = require('./routes/UjianRoutes.js');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const db = require('./configs/Database.js');
const Sekolah = require('./models/SekolahModel.js');
const User = require('./models/UserModel.js');

const PORT = process.env.APP_PORT;

const app = express();
app.use(cors({
  credentials: true,
  origin: [process.env.APP_ORIGINS?.split(',')]
}));
app.use(cookie());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(fileUpload());

app.use(express.static('client'));

const _API = '/api/v1';

app.use(_API, UserRoutes);
app.use(`${_API}/sekolah`, SekolahRoutes);
app.use(`${_API}/mapels`, MapelRoutes);
app.use(`${_API}/penilais`, PenilaiRoutes);
app.use(`${_API}/pesertas`, PesertaRoutes);
app.use(`${_API}/soal-kategories`, SoalKategoriRoutes);
app.use(`${_API}/soals`, SoalRoutes);
app.use(`${_API}/soal-items`, SoalItemRoutes);
app.use(`${_API}/jadwal-kategories`, JadwalKategoriRoutes);
app.use(`${_API}/jadwals`, JadwalRoutes);
app.use(`${_API}/nilais`, NilaiRoutes);
app.use(`${_API}/ujian`, UjianRoutes);
app.use(`${_API}/search`, SearchRoutes);

app.get('*', (req, res) => {
  res.sendFile('client/index.html', { root: '.' });
});


(async () => {
  try {
    await db.sync();
    const sekolah = await Sekolah.count();
    if (!sekolah) {
      const data = {
        name: 'UPTD NAMA SEKOLAH',
        users: [{
          name: 'Operator',
          email: 'admin@websekolah.sch.id',
          password: 'password'
        }]
      };
      await Sekolah.create(data, {
        include: [User]
      });
      console.log("User admin created");
    }
  } catch (error) {
    console.log(error);
  }
})()

app.listen(80,()=>{
  console.log('Aplikasi Ujian Ready!!!');
});