const express = require('express');
const { soal, ruang, mapel } = require('../controllers/SearchController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/soal', auth, soal);
router.get('/ruang', auth, ruang);
router.get('/mapel', auth, mapel);

module.exports = router;