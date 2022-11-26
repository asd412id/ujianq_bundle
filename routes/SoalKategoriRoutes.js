import express from 'express';
import { destroy, getSoalKategori, getSoalKategoris, store } from '../controllers/SoalKategoriController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getSoalKategoris);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getSoalKategori);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;