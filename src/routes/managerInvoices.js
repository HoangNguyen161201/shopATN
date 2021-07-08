const express = require('express');
var controllerInvoices = require('../app/controllers/controllerInvoices');
var router = express.Router();
router.get('/',controllerInvoices.show);
router.get('/addNew',controllerInvoices.showAddInvoice);
router.post('/actAddNew',controllerInvoices.actAddNew);
router.get('/order/:id',controllerInvoices.showDetail);
router.get('/bill/:id',controllerInvoices.printBill);
module.exports = router;