const express = require('express');
// connect to controller
var controllerInvoices = require('../app/controllers/controllerInvoices');
var router = express.Router();
// show information of all invoices
router.get('/',controllerInvoices.show);
// show form to add a new invoice
router.get('/addNew',controllerInvoices.showAddInvoice);
// add new invoice
router.post('/actAddNew',controllerInvoices.actAddNew);
// show detail
router.get('/order/:id',controllerInvoices.showDetail);
// print bill
router.get('/bill/:id',controllerInvoices.printBill);
module.exports = router;