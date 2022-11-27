const express = require('express');
const { destroy, getSoalKategori, getSoalKategoris, store } = require('../controllers/SoalKategoriController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getSoalKategoris);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getSoalKategori);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;