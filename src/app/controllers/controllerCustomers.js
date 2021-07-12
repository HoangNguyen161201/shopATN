// connect to models
const modelCustomers = require('../models/modelCustomers');
//  connect to helper to check account
const checkAccount = require('../helpers/checkAccount');
class controllerCustomers {
    // show infor of all customers
    show(req, res) {
        var r = checkAccount.checkAccount(req.cookies);
        modelCustomers.find({}).then(result => {
            result = result.map(e => e.toObject());
            if (req.session.alertDl) {
                res.render('customer/showCustomers', {
                    result,
                    alertDl: req.session.alertDl,
                    nameAccount: r[1][0]
                });
            } else {
                res.render('customer/showCustomers', {
                    result,
                    nameAccount: r[1][0]
                });
            }
        }).catch(e => {})
    }
    // show form to add new customer
    add(req, res) {
        // Check if the account is admin account or not.
        var r = checkAccount.checkAccount(req.cookies);
        if (checkAccount.checkAllow(r, 'addCustomer')) {
            res.render('customer/addCustomer', {
                nameAccount: r[1][0]
            });
        } else {
            res.redirect('/');
        }
    }
    // make to add new customer
    async insert(req, res) {
        if (req.body) {
            var id = 1;
            await modelCustomers.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                var r = new modelCustomers(req.body);
                r.save(function () {});
            }).catch(() => {});
            // Notify users
            req.session.alertDl = 'New customer has been added successfully';
            res.redirect('/managerCustomers');
        }
    }
    // delete account by customer
    async delete(req, res) {
        var r1 = checkAccount.checkAccount(req.cookies);
        // check if the account is admin or not, or the staff account has permission to access this page.
        if (checkAccount.checkAllow(r1, 'deleteCustomer')) {
            var r = Number(req.params.id);
            await modelCustomers.deleteOne({
                _id: r
            });
            // Notify users
            req.session.alertDl = 'Successfully deleted customer xóa';
            res.redirect('/managerCustomers');
        } else {
            res.redirect('/');
        }
    }
    // show form to update customer
    update(req, res) {
        var r1 = checkAccount.checkAccount(req.cookies);
        // check if the account is admin or not, or the staff account has permission to access this page.
        if (checkAccount.checkAllow(r1, 'updateCustomer')) {
            modelCustomers.find({
                _id: req.params.id
            }).then(customer => {
                customer = customer.map(e => e.toObject());
                res.render("customer/updateCustomer", {
                    customer,
                    nameAccount: r1[1][0]
                });
            }).catch(e => {

            })
        } else {
            res.redirect('/');
        }
    }
    // make to update customer
    async actUpdate(req, res) {
        await modelCustomers.where({
            _id: Number(req.body.id)
        }).updateOne(req.body);
        // Notify users
        req.session.alertDl = 'Customer has been updated';
        res.redirect('/managerCustomers');
    }

}
module.exports = new controllerCustomers;