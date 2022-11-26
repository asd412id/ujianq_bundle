import express from 'express';
import { getPenilai, getPenilais, store, destroy } from '../controllers/PenilaiController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getPenilais);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getPenilai);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;