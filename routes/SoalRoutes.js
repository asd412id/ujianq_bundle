const express = require('express');
const { destroy, getSoal, getSoals, store } = require('../controllers/SoalController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:katid', auth, role(['OPERATOR', 'PENILAI']), getSoals);
router.post('/:katid', auth, role(['OPERATOR', 'PENILAI']), store);
router.get('/:katid/:id', auth, role(['OPERATOR', 'PENILAI']), getSoal);
router.put('/:katid/:id', auth, role(['OPERATOR', 'PENILAI']), store);
router.delete('/:katid/:id', auth, role(['OPERATOR', 'PENILAI']), destroy);

module.exports = router;