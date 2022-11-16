import express from 'express';
import { create, destroy, getMapel, getMapels, update } from '../controllers/MapelController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getMapels);
router.post('/', auth, role(['OPERATOR']), create);
router.get('/:id', auth, role(['OPERATOR']), getMapel);
router.put('/:id', auth, role(['OPERATOR']), update);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

export default router;