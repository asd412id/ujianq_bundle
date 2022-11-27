const express = require('express');
const { destroy, getSoal, getSoals, store } = require('../controllers/SoalController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:katid', auth, role(['OPERATOR']), getSoals);
router.post('/:katid', auth, role(['OPERATOR']), store);
router.get('/:katid/:id', auth, role(['OPERATOR']), getSoal);
router.put('/:katid/:id', auth, role(['OPERATOR']), store);
router.delete('/:katid/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;