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
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const dotenv = require('dotenv');

// const cluster = require('cluster');
// const { cpus } = require('os');
const process = require('process');

dotenv.config();

const PORT = process.env.APP_PORT;

const app = express();
app.use(cors({
  credentials: true,
  origin: [process.env.APP_ORIGINS?.split(',')]
}));
app.use(cookie());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

app.use(`${_API}/search`, SearchRoutes);

// const numCPUs = cpus().length;

if (process.env.APP_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Listening Port ` + PORT);
  });
} else {
  // if (cluster.isPrimary) {
  //   console.log(`Primary ${process.pid} is running`);

  //   // Fork workers.
  //   for (let i = 0; i < numCPUs; i++) {
  //     cluster.fork();
  //   }

  //   cluster.on('exit', (worker, code, signal) => {
  //     console.log(`worker ${worker.process.pid} died`);
  //     cluster.fork();
  //   });
  // } else {
  app.listen();
  // }

}