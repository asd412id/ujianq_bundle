const express = require('express');
const { destroy, getJadwalKategori, getJadwalKategoris, store } = require('../controllers/JadwalKategoriController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR', 'PENILAI']), getJadwalKategoris);
router.post('/', auth, role(['OPERATOR', 'PENILAI']), store);
router.get('/:id', auth, role(['OPERATOR', 'PENILAI']), getJadwalKategori);
router.put('/:id', auth, role(['OPERATOR', 'PENILAI']), store);
router.delete('/:id', auth, role(['OPERATOR', 'PENILAI']), destroy);

module.exports = router;