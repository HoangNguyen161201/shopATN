var express = require('express');
// connect to controller
const controllerSuppliers = require('../app/controllers/controllerSuppliers');
var router = express.Router();
// show information of all suppliers
router.get('/',controllerSuppliers.show);
// show form add to user can add new supplier
router.get('/add',controllerSuppliers.add);
// show form add to user can update new supplier
router.get('/update/:id',controllerSuppliers.update);
// make add new supplier
router.post('/insert',controllerSuppliers.insert);
// make update supplier
router.post('/actUpdate',controllerSuppliers.actUpdate);
// delete supplier
router.get('/delete/:id',controllerSuppliers.delete);
// show detail
router.get('/supplier/:id',controllerSuppliers.detail);
module.exports = router