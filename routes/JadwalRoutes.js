const express = require('express');
const { destroy, getJadwal, getJadwals, store, monitor, getRuangs } = require('../controllers/JadwalController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:jid', auth, role(['OPERATOR', 'PENILAI']), getJadwals);
router.post('/:jid', auth, role(['OPERATOR', 'PENILAI']), store);
router.get('/:jid/:id', auth, role(['OPERATOR', 'PENILAI']), getJadwal);
router.put('/:jid/:id', auth, role(['OPERATOR', 'PENILAI']), store);
router.delete('/:jid/:id', auth, role(['OPERATOR', 'PENILAI']), destroy);
router.get('/:jid/:id/ruangs', auth, role(['OPERATOR', 'PENILAI']), getRuangs);
router.get('/:jid/:id/ruangs/:ruang', auth, role(['OPERATOR', 'PENILAI']), monitor);

module.exports = router;