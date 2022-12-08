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

const _API = '/api/v1';

app.post(`${_API}/setupdb`, async (req, res) => {
  try {
    await db.sync();
    return res.json({ message: 'Pengaturan database selesai' });
  } catch (error) {
    return res.json({ message: 'Pengaturan database gagal: ' + error.message });
  }
});

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

if (process.env.APP_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Listening Port ` + PORT);
  });
} else {
  app.listen();
}