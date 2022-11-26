import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
import SekolahRoutes from './routes/SekolahRoutes.js';
import MapelRoutes from './routes/MapelRoutes.js';
import PenilaiRoutes from './routes/PenilaiRoutes.js';
import PesertaRoutes from './routes/PesertaRoutes.js';
import SoalKategoriRoutes from './routes/SoalKategoriRoutes.js';
import SoalRoutes from './routes/SoalRoutes.js';
import SoalItemRoutes from './routes/SoalItemRoutes.js';
import JadwalKategoriRoutes from './routes/JadwalKategoriRoutes.js';
import bodyParser from 'body-parser'
import cookie from 'cookie-parser'
import dotenv from 'dotenv';

import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';
import { dirname } from 'path';

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

const numCPUs = cpus().length;

if (process.env.APP_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Listening Port ` + PORT);
  });
} else {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app.listen();
  }

}