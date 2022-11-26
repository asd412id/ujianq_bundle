import express from 'express';
import { destroy, getSoalItem, getSoalItems, store } from '../controllers/SoalItemController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/:soalid', auth, role(['OPERATOR']), getSoalItems);
router.post('/:soalid', auth, role(['OPERATOR']), store);
router.get('/:soalid/:id', auth, role(['OPERATOR']), getSoalItem);
router.put('/:soalid/:id', auth, role(['OPERATOR']), store);
router.delete('/:soalid/:id', auth, role(['OPERATOR']), destroy);

export default router;