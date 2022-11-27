const express = require('express');
const { checkLogin, getUsers, updateAccount, UserLogin, UserLogout, UserRegister } = require('../controllers/UserController.js');
const auth = require('../middlewares/AuthMiddleware.js');

const router = express.Router();

router.post('/login', UserLogin);
router.get('/check', auth, checkLogin);
router.put('/account', auth, updateAccount);
router.get('/users', auth, getUsers);
router.post('/register', UserRegister);
router.post('/logout', auth, UserLogout);

module.exports = router;