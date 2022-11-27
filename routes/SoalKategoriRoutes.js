const express = require('express');
const { destroy, getSoalKategori, getSoalKategoris, store } = require('../controllers/SoalKategoriController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR', 'PENILAI']), getSoalKategoris);
router.post('/', auth, role(['OPERATOR', 'PENILAI']), store);
router.get('/:id', auth, role(['OPERATOR', 'PENILAI']), getSoalKategori);
router.put('/:id', auth, role(['OPERATOR', 'PENILAI']), store);
router.delete('/:id', auth, role(['OPERATOR', 'PENILAI']), destroy);

module.exports = router;