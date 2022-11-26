import express from 'express';
import { destroy, getPeserta, getPesertas, store } from '../controllers/PesertaController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getPesertas);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getPeserta);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;