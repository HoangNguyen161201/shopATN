var express = require('express');
var controllerStaff = require('../app/controllers/controllerAccount');
var router = express.Router();
router.get('/',controllerStaff.show);
router.get('/delete/:id',controllerStaff.delete);
router.get('/add',controllerStaff.add);
router.post('/insert',controllerStaff.insert);
router.get('/update/:id',controllerStaff.update);
router.post('/actUpdate',controllerStaff.actUpdate);
module.exports = router