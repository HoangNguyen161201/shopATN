var express = require('express');
// connect to controller
var controllerCustomers = require('../app/controllers/controllerCustomers');
var router = express.Router();
// show information of all customers
router.get('/',controllerCustomers.show);
// show form add to user can add new customer
router.get('/add',controllerCustomers.add);
// make add new customer
router.post('/insert',controllerCustomers.insert);
// delete customer
router.get('/delete/:id',controllerCustomers.delete);
// show form add to user can update new customer
router.get('/update/:id',controllerCustomers.update);
// make update customer
router.post('/actUpdate',controllerCustomers.actUpdate);
module.exports = router