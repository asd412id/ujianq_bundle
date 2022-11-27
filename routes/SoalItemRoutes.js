const express = require('express');
const { destroy, getSoalItem, getSoalItems, store } = require('../controllers/SoalItemController.js');
const auth = require('../middlewares/AuthMiddleware.js');
const { role } = require('../middlewares/RoleMiddleware.js');

const router = express.Router();

router.get('/:soalid', auth, role(['OPERATOR']), getSoalItems);
router.post('/:soalid', auth, role(['OPERATOR']), store);
router.get('/:soalid/:id', auth, role(['OPERATOR']), getSoalItem);
router.put('/:soalid/:id', auth, role(['OPERATOR']), store);
router.delete('/:soalid/:id', auth, role(['OPERATOR']), destroy);

module.exports = router;