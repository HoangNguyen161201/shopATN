// connect fileExcel.js to make export fiel excel
const exportExcel = require('../helpers/fileExcel');
// connect to models
const modelProducts = require('../models/modelProducts');
const modelCustomers = require('../models/modelCustomers');
const modelCategory = require("../models/modelCategories");
const modelInvoices = require('../models/modelInvoices');
const modelAccounts = require('../models/modelAccounts');
const modelSupplier = require('../models/modelSuppliers');
//  connect to helper to check account
const checkAccount = require('../helpers/checkAccount');
const fs = require('fs');
class excel {
    async exportData(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        // Check if the account is admin account or not.
        if (role[0] == 1) {
            // export file excel for product
            await modelProducts.find({}).then(e => {
                var pr = e.map(es => es.toObject());
                fs.unlink('src/public/products.xlsx', (err) => {

                });
                exportExcel.exportProduct(pr, ['_id', 'name', 'new_price', 'old_price', 'quantity', 'quantity_sold', 'content', 'id_category', 'id_supplier', 'img'], 'products', 'src/public/excel/products.xlsx');
            })
            // export file excel for customer
            await modelCustomers.find({}).then(e => {
                var cs = e.map(es => es.toObject());
                fs.unlink('src/public/customers.xlsx', (err) => {

                });
                exportExcel.exportCustomer(cs, ['_id', 'name', 'email', 'numberPhone'], 'customers', 'src/public/excel/customers.xlsx');
            })
            // export file excel for category
            await modelCategory.find({}).then(e => {
                var ct = e.map(es => es.toObject());
                fs.unlink('src/public/categories.xlsx', (err) => {

                });
                exportExcel.exportCategory(ct, ['_id', 'name'], 'customers', 'src/public/excel/categories.xlsx');
            })
            // export file excel for invoice
            await modelInvoices.find({}).then(e => {
                var iv = e.map(es => es.toObject());
                fs.unlink('src/public/invoices.xlsx', (err) => {

                });
                exportExcel.exportInvoice(iv, ['_id', 'id_order', 'id_product', 'quantity_pr', 'id_customer', 'date_to_order', 'total'], 'invoices', 'src/public/excel/invoices.xlsx');
            })
            // export file excel for account
            await modelAccounts.find({}).then(e => {
                var acc = e.map(es => es.toObject());
                fs.unlink('src/public/accounts.xlsx', (err) => {

                });
                exportExcel.exportAccount(acc, ['_id', 'name', 'email', 'password', 'role', 'permission'], 'accounts', 'src/public/excel/accounts.xlsx');
            })
            // export file excel for supplier
            await modelSupplier.find({}).then(e => {
                var sp = e.map(es => es.toObject());
                fs.unlink('src/public/suppliers.xlsx', (err) => {

                });
                exportExcel.exportSupplier(sp, ['_id', 'name', 'email', 'img'], 'suppliers', 'src/public/excel/suppliers.xlsx');
            })
            res.redirect('/exportData');
        }
        // If you are not logged in, go back to the login page
        else {
            res.redirect('/');
        }
    }
    // show links to user can download file excel
    show(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        if (role[0] == 1) {
            return res.render('exportData', {
                nameAccount: role[1][0]
            });
        } else {
            res.redirect('/');
        }
    }
}
module.exports = new excel;