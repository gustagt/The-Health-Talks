const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');

//HELPER
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.get('/', ToughtController.showToughts);
router.get('/add', checkAuth, ToughtController.createTought);

router.post('/add', checkAuth, ToughtController.createToughtPost);
router.post('/remove', checkAuth, ToughtController.removeTought);

module.exports = router;