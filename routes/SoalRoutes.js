import express from 'express';
import { destroy, getSoal, getSoals, store } from '../controllers/SoalController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/:katid', auth, role(['OPERATOR']), getSoals);
router.post('/:katid', auth, role(['OPERATOR']), store);
router.get('/:katid/:id', auth, role(['OPERATOR']), getSoal);
router.put('/:katid/:id', auth, role(['OPERATOR']), store);
router.delete('/:katid/:id', auth, role(['OPERATOR']), destroy);

export default router;