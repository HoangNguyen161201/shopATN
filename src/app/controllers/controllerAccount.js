const modelAccounts = require('../models/modelAccounts');
const checkAccount = require('../helpers/checkAccount');
const md5 = require('md5');
class controllerStaff {
    show(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var role = checkAccount.checkAccount(req.cookies);
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
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    add(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var role = checkAccount.checkAccount(req.cookies);
            if (role[0] == 1) {
                res.render('accounts/addAccount', {
                    nameAccount: role[1][0]
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
            req.session.alertDl = 'Successfully added new account';
            res.redirect('/managerAccounts');
        }
    }
    async delete(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var role = checkAccount.checkAccount(req.cookies);
            if (role[0] == 1) {
                var r = Number(req.params.id);
                await modelAccounts.deleteOne({
                    _id: r
                });
                req.session.alertDl = 'Account deleted successfully';
                res.redirect('/managerAccounts');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    update(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var role = checkAccount.checkAccount(req.cookies);
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
        } else {
            res.redirect('/login');
        }
    }
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