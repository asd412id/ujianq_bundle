import express from 'express';
import { destroy, getJadwalKategori, getJadwalKategoris, store } from '../controllers/JadwalKategoriController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getJadwalKategoris);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getJadwalKategori);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;