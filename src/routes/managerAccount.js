var express = require('express');
// connect to controller
var controllerStaff = require('../app/controllers/controllerAccount');
var router = express.Router();
// show information of all accounts
router.get('/',controllerStaff.show);
// delete account
router.get('/delete/:id',controllerStaff.delete);
// show form add to user can add new account
router.get('/add',controllerStaff.add);
// make add new account
router.post('/insert',controllerStaff.insert);
// show form add to user can update new account
router.get('/update/:id',controllerStaff.update);
// make update account
router.post('/actUpdate',controllerStaff.actUpdate);
module.exports = router