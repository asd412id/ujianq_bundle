import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
import SekolahRoutes from './routes/SekolahRoutes.js';
import MapelRoutes from './routes/MapelRoutes.js';
import PesertaRoutes from './routes/PesertaRoutes.js';
import SoalKategoriRoutes from './routes/SoalKategoriRoutes.js';
import cookie from 'cookie-parser'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.APP_PORT;

const app = express();
app.use(cors());
app.use(cookie());
app.use(express.json());
app.use('/api/v1', UserRoutes);
app.use('/api/v1/sekolah', SekolahRoutes);
app.use('/api/v1/mapels', MapelRoutes);
app.use('/api/v1/pesertas', PesertaRoutes);
app.use('/api/v1/kategori-soal', SoalKategoriRoutes);

if (process.env.APP_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('Listening: ' + PORT);
  });
} else {
  app.listen();
}