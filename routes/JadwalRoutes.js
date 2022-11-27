const express = require('express');
const { destroy, getJadwal, getJadwals, store } = require('../controllers/JadwalController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:jid', auth, role(['OPERATOR']), getJadwals);
router.post('/:jid', auth, role(['OPERATOR']), store);
router.get('/:jid/:id', auth, role(['OPERATOR']), getJadwal);
router.put('/:jid/:id', auth, role(['OPERATOR']), store);
router.delete('/:jid/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;