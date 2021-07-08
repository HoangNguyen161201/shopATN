var express = require('express');
const controllerSuppliers = require('../app/controllers/controllerSuppliers');
var router = express.Router();
router.get('/',controllerSuppliers.show);
router.get('/add',controllerSuppliers.add);
router.get('/update/:id',controllerSuppliers.update);
router.post('/insert',controllerSuppliers.insert);
router.post('/actUpdate',controllerSuppliers.actUpdate);
router.get('/delete/:id',controllerSuppliers.delete);
router.get('/supplier/:id',controllerSuppliers.detail);
module.exports = router