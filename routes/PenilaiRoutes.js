const express = require('express');
const { getPenilai, getPenilais, store, destroy } = require('../controllers/PenilaiController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/', auth, role(['OPERATOR']), getPenilais);
router.post('/', auth, role(['OPERATOR']), store);
router.get('/:id', auth, role(['OPERATOR']), getPenilai);
router.put('/:id', auth, role(['OPERATOR']), store);
router.delete('/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;