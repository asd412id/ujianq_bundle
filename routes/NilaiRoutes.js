const express = require('express');
const { getNilais, setNilai, getNilaiByJadwal } = require('../controllers/NilaiController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:loginId', auth, role(['OPERATOR', 'PENILAI']), getNilais);
router.patch('/:loginId', auth, role(['OPERATOR', 'PENILAI']), setNilai);
router.get('/:jid/:ruang', auth, role(['OPERATOR', 'PENILAI']), getNilaiByJadwal);

module.exports = router;