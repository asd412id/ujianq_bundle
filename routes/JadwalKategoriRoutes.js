const express = require('express');
const { destroy, getJadwalKategori, getJadwalKategoris, store } = require('../controllers/JadwalKategoriController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getJadwalKategoris);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getJadwalKategori);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;