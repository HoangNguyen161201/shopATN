var express = require('express');
// connect to controller
var controllerLogin = require('../app/controllers/controllerLogin');
var router = express.Router();
// show page login
router.get('/',controllerLogin.showLogin);
// check account
router.post('/',controllerLogin.checkLogin);
// logout
router.get('/out',controllerLogin.logout);

module.exports = router