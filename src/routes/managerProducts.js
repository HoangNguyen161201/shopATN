var express = require('express');
// connect to controller
var controllerProducts = require('../app/controllers/controllerProducts');
var router = express.Router();
// show information of all products
router.all('/',controllerProducts.show);
// show form add to user can add new product
router.get('/add',controllerProducts.add);
// make add new product
router.post('/insert',controllerProducts.insert);
// delete customer
router.get('/delete/:id',controllerProducts.delete);
// show form add to user can update new product
router.get('/update/:id',controllerProducts.update);
// make update product
router.post('/actUpdate',controllerProducts.actUpdate);
module.exports = router