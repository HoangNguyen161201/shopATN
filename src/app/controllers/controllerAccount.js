// connect to models
const modelAccounts = require('../models/modelAccounts');
const checkAccount = require('../helpers/checkAccount');
// use md5 to creat password security
const md5 = require('md5');
class controllerStaff {
    // show infor of all accounts
    show(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        // Check if the account is admin account or not.
        if (role[0] == 1) {
            modelAccounts.find({}).then(result => {
                result = result.map(e => e.toObject());
                if (req.session.alertDl) {
                    res.render('accounts/showAccount', {
                        result,
                        alertDl: req.session.alertDl,
                        nameAccount: role[1][0]
                    });
                } else {
                    res.render('accounts/showAccount', {
                        result,
                        nameAccount: role[1][0]
                    });
                }
            }).catch(e => {})
        }
        // if you are not admin, back to home
        else {
            res.redirect('/');
        }
    }
    // show form to add new account
    add(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        // Check if the account is admin account or not.
        if (role[0] == 1) {
            res.render('accounts/addAccount', {
                nameAccount: role[1][0]
            });
        } else {
            res.redirect('/');
        }
    }
    // make to add new account
    async insert(req, res) {
        if (req.body) {
            var id = 1;
            await modelAccounts.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                if (req.body.role == 'admin') {
                    req.body.permission = new Array;
                }
                req.body.password = md5(req.body.password);
                var r = new modelAccounts(req.body);
                r.save(function () {});
            }).catch(() => {});
            // Notify users
            req.session.alertDl = 'Successfully added new account';
            res.redirect('/managerAccounts');
        }
    }
    // delete account by id
    async delete(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        // check if the account is admin account or not.
        if (role[0] == 1) {
            var r = Number(req.params.id);
            await modelAccounts.deleteOne({
                _id: r
            });
            // Notify users
            req.session.alertDl = 'Account deleted successfully';
            res.redirect('/managerAccounts');
        } else {
            res.redirect('/');
        }
    }
    // show form to update account
    update(req, res) {
        var role = checkAccount.checkAccount(req.cookies);
        // check if the account is admin account or not.
        if (role[0] == 1) {
            modelAccounts.find({
                _id: req.params.id
            }).then(staff => {
                staff = staff.map(e => e.toObject());
                res.render("accounts/UpdateAccount", {
                    staff,
                    nameAccount: role[1][0]
                });
            }).catch(e => {})
        } else {
            res.redirect('/');
        }

    }
    // make to update account
    async actUpdate(req, res) {
        req.body.password = md5(req.body.password);
        if (req.body.role == 'admin') {
            req.body.permission = new Array;
        }
        await modelAccounts.where({
            _id: Number(req.body.id)
        }).update(req.body);
        req.session.alertDl = 'Account has been updated successfully';
        res.redirect('/managerAccounts');
    }

}
module.exports = new controllerStaff;