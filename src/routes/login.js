var express = require('express');
var controllerLogin = require('../app/controllers/controllerLogin');
var router = express.Router();
router.get('/',controllerLogin.showLogin);
router.post('/',controllerLogin.checkLogin);
router.get('/out',controllerLogin.logout);

module.exports = router