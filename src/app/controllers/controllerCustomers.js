const modelCustomers = require('../models/modelCustomers');
const checkAccount = require('../helpers/checkAccount');
class controllerCustomers {
    show(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
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
        } else {
            res.redirect('/login');
        }
    }
    add(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'addCustomer')) {
                res.render('customer/addCustomer', {
                    nameAccount: r[1][0]
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
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
            req.session.alertDl = 'New customer has been added successfully';
            res.redirect('/managerCustomers');
        }
    }
    async delete(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r1 = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r1, 'deleteCustomer')) {
                var r = Number(req.params.id);
                await modelCustomers.deleteOne({
                    _id: r
                });
                req.session.alertDl = 'Successfully deleted customer xóa';
                res.redirect('/managerCustomers');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    update(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r1 = checkAccount.checkAccount(req.cookies);
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
        } else {
            res.redirect('/login');
        }
    }
    async actUpdate(req, res) {
        await modelCustomers.where({
            _id: Number(req.body.id)
        }).updateOne(req.body);
        req.session.alertDl = 'Customer has been updated';
        res.redirect('/managerCustomers');
    }

}
module.exports = new controllerCustomers;