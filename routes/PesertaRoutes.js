import express from 'express';
import { create, destroy, getPeserta, getPesertas, update } from '../controllers/PesertaController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getPesertas);
router.post('/', auth, role(['OPERATOR']), create);
router.get('/:id', auth, role(['OPERATOR']), getPeserta);
router.put('/:id', auth, role(['OPERATOR']), update);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;