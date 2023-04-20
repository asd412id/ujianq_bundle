const express = require('express');
const { destroy, getSoalItem, getSoalItems, store, importExcel } = require('../controllers/SoalItemController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:soalid', auth, role(['OPERATOR', 'PENILAI']), getSoalItems);
router.post('/:soalid', auth, role(['OPERATOR', 'PENILAI']), store);
router.get('/:soalid/:id', auth, role(['OPERATOR', 'PENILAI']), getSoalItem);
router.put('/:soalid/:id', auth, role(['OPERATOR', 'PENILAI']), store);
router.post('/:soalid/import', auth, role(['OPERATOR', 'PENILAI']), importExcel);
router.delete('/:soalid/:id', auth, role(['OPERATOR', 'PENILAI']), destroy);

module.exports = router;