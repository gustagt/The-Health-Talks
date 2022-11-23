const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');

//HELPER
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/', ToughtController.showToughts);
router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.get('/add', checkAuth, ToughtController.createTought);
router.get('/edit/:id', checkAuth, ToughtController.updateTought);
router.get('/info', ToughtController.info);

router.post('/add', checkAuth, ToughtController.createToughtPost);
router.post('/remove', checkAuth, ToughtController.removeTought);
router.post('/edit', checkAuth, ToughtController.updateToughtPost);

module.exports = router;