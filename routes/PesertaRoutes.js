const express = require('express');
const { destroy, getPeserta, getPesertas, store, importExcel } = require('../controllers/PesertaController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getPesertas);
router.post('/', auth, role(['OPERATOR']), store);
router.post('/import', auth, role(['OPERATOR']), importExcel);
router.get('/:id', auth, role(['OPERATOR']), getPeserta);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;