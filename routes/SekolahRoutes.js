const express = require('express');
const { getData, updateSekolah, getStatus } = require('../controllers/SekolahController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getData);
router.get('/status', auth, role(['OPERATOR', 'PENILAI']), getStatus);
router.post('/', auth, role(['OPERATOR']), updateSekolah);

module.exports = router;