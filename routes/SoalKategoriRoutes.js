import express from 'express';
import { create, destroy, getSoalKategori, getSoalKategoris, update } from '../controllers/SoalKategoriController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getSoalKategoris);
router.post('/', auth, role(['OPERATOR']), create);
router.get('/:id', auth, role(['OPERATOR']), getSoalKategori);
router.put('/:id', auth, role(['OPERATOR']), update);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;