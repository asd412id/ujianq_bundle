const express = require('express');
const { getUjians, getTes, saveJawaban, stopUjian, getSelsai } = require('../controllers/UjianController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { tesMiddleware } = require('../middlewares/TesMiddleware.js');
const { ujianMiddleware } = require('../middlewares/UjianMiddleware.js');

const router = express.Router();

router.get('/', auth, ujianMiddleware, getUjians);
router.get('/selesai', auth, getSelsai);
router.post('/tes', auth, ujianMiddleware, getTes);
router.put('/:loginId', auth, tesMiddleware, saveJawaban);
router.patch('/:loginId', auth, stopUjian);

module.exports = router;