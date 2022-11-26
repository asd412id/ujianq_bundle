import express from 'express';
import { checkLogin, getUsers, updateAccount, UserLogin, UserLogout, UserRegister } from '../controllers/UserController.js';
import auth from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/login', UserLogin);
router.get('/check', auth, checkLogin);
router.put('/account', auth, updateAccount);
router.get('/users', auth, getUsers);
router.post('/register', UserRegister);
router.post('/logout', auth, UserLogout);

export default router;