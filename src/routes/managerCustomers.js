var express = require('express');
var controllerCustomers = require('../app/controllers/controllerCustomers');
var router = express.Router();
router.get('/',controllerCustomers.show);
router.get('/add',controllerCustomers.add);
router.post('/insert',controllerCustomers.insert);
router.get('/delete/:id',controllerCustomers.delete);
router.get('/update/:id',controllerCustomers.update);
router.post('/actUpdate',controllerCustomers.actUpdate);
module.exports = router