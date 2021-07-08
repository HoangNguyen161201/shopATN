const exportExcel = require('../helpers/fileExcel');
const modelProducts = require('../models/modelProducts');
const modelCustomers = require('../models/modelCustomers');
const modelCategory = require("../models/modelCategories");
const modelInvoices = require('../models/modelInvoices');
const modelAccounts = require('../models/modelAccounts');
const modelSupplier = require('../models/modelSuppliers');
const checkAccount = require('../helpers/checkAccount');
const fs = require('fs');
class excel {
    async exportData(req, res) {
        if(checkAccount.logged(req.cookies) == 1){
            var role = checkAccount.checkAccount(req.cookies);
            if (role[0] == 1) {
                await modelProducts.find({}).then(e => {
                    var pr = e.map(es => es.toObject());
                    fs.unlink('src/public/products.xlsx', (err) => {
        
                    });
                    exportExcel.exportProduct(pr, ['_id', 'name', 'new_price', 'old_price', 'quantity', 'quantity_sold', 'content', 'id_category', 'id_supplier', 'img'], 'products', 'src/public/excel/products.xlsx');
                })
                await modelCustomers.find({}).then(e => {
                    var cs = e.map(es => es.toObject());
                    fs.unlink('src/public/customers.xlsx', (err) => {
        
                    });
                    exportExcel.exportCustomer(cs, ['_id', 'name', 'email', 'numberPhone'], 'customers', 'src/public/excel/customers.xlsx');
                })
                await modelCategory.find({}).then(e => {
                    var ct = e.map(es => es.toObject());
                    fs.unlink('src/public/categories.xlsx', (err) => {
        
                    });
                    exportExcel.exportCategory(ct, ['_id', 'name'], 'customers', 'src/public/excel/categories.xlsx');
                })
                await modelInvoices.find({}).then(e => {
                    var iv = e.map(es => es.toObject());
                    fs.unlink('src/public/invoices.xlsx', (err) => {
        
                    });
                    exportExcel.exportInvoice(iv, ['_id', 'id_order', 'id_product', 'quantity_pr', 'id_customer', 'date_to_order', 'total'], 'invoices', 'src/public/excel/invoices.xlsx');
                })
                await modelAccounts.find({}).then(e => {
                    var acc = e.map(es => es.toObject());
                    fs.unlink('src/public/accounts.xlsx', (err) => {
        
                    });
                    exportExcel.exportAccount(acc, ['_id', 'name', 'email', 'password', 'role', 'permission'], 'accounts', 'src/public/excel/accounts.xlsx');
                })
                await modelSupplier.find({}).then(e => {
                    var sp = e.map(es => es.toObject());
                    fs.unlink('src/public/suppliers.xlsx', (err) => {
        
                    });
                    exportExcel.exportSupplier(sp, ['_id', 'name', 'email', 'img'], 'suppliers', 'src/public/excel/suppliers.xlsx');
                })
                res.redirect('/exportData');
            }
            else{
                res.redirect('/');
            }
        }
        else {
            res.redirect('/login');
        }
    }
    show(req, res) {
        if(checkAccount.logged(req.cookies) == 1){
            var role = checkAccount.checkAccount(req.cookies);
            if (role[0] == 1) {
                return res.render('exportData',{
                    nameAccount: role[1][0]
                });
            }
            else{
                res.redirect('/');
            }
        }
        else{
            res.redirect('/login');
        }
    }
}
module.exports = new excel;