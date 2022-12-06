const express = require('express');
const { soal, ruang, mapel, penilai, soalKategori, soalByJadwal } = require('../controllers/SearchController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/soal', auth, soal);
router.get('/soal/:jid', auth, soalByJadwal);
router.get('/ruang', auth, ruang);
router.get('/mapel', auth, mapel);
router.get('/penilai', auth, penilai);
router.get('/soal-kategori', auth, soalKategori);

module.exports = router;