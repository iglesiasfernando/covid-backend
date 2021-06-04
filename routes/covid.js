var express = require('express');
var router = express.Router();

var covidController = require('../controllers/covid.js');

router.get('/stats',covidController.getStats);
router.get('/checks',covidController.getAll);
router.get('/checks/search/',covidController.search);

router.post('/checks',covidController.insert);
router.post('/test',covidController.test);




/*
router.get('/:id', authService.authorize(['Administrador','Medico','Radiologo']), userController.getById);
router.delete('/:id', authService.authorize(['Administrador','Radiologo']), userController.remove);
router.post('/:id', authService.authorize(['Administrador','Medico','Radiologo']), userController.update);
router.post('/', userController.create);
router.post('/:id/resend/welcome', authService.authorize(['Administrador','Radiologo']), userController.resendWelcome);
*/
module.exports = router;