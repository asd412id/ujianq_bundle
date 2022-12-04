const express = require('express');
const { getData, updateSekolah } = require('../controllers/SekolahController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getData);
router.post('/', auth, role(['OPERATOR']), updateSekolah);

module.exports = router;