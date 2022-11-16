import express from 'express';
import { getData, updateSekolah } from '../controllers/SekolahController.js';
import auth from '../middlewares/AuthMiddleware.js';
import { role } from '../middlewares/RoleMiddleware.js';

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getData);
router.put('/', auth, role(['OPERATOR']), updateSekolah);

export default router;