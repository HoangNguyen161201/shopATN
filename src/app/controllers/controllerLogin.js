const modelAccounts = require('../models/modelAccounts');
const checkAccount = require('../helpers/checkAccount');
const md5 = require('md5');
class login {
    showLogin(req, res) {
        if (checkAccount.logged(req.cookies) == 0) {
            res.render('login', {
                layout: false
            });
        } else {
            if (checkAccount.logged(req.cookies) == 1) {
                res.redirect('/');
            }
        }
    }
    async checkLogin(req, res) {
        if (req.body.person == "admin") {
            await modelAccounts.find({
                email: req.body.account,
                role: 'admin'
            }).then(async e => {
                if (e[0] == null) {
                    var emailFalse = "Email does not exist";
                    res.render('login', {
                        emailFalse,
                        layout: false,
                        email: req.body.account,
                        password: req.body.password,
                        admin: 1
                    });
                } else {
                    await modelAccounts.find({
                        email: req.body.account,
                        role: 'admin',
                        password: md5(req.body.password)
                    }).then(ps => {
                        if (ps[0] == null) {
                            var passwordFalse = "Incorrect password";
                            res.render('login', {
                                passwordFalse,
                                layout: false,
                                email: req.body.account,
                                password: req.body.password,
                                admin: 1
                            });
                        } else {

                            res.cookie('admin', ps[0].name, {
                                expires: new Date(Date.now() + 6000000)
                            });
                            res.redirect('/');
                        }
                    }).catch(ps => {

                    })
                }
            }).catch(e => {

            });
        }
        if (req.body.person == "staff") {
            await modelAccounts.find({
                email: req.body.account,
                role: 'staff'
            }).then(async e => {
                if (e[0] == null) {
                    var emailFalse = "Email does not exist";
                    res.render('login', {
                        emailFalse,
                        layout: false,
                        email: req.body.account,
                        password: req.body.password,
                        staff: 1
                    });
                } else {
                    await modelAccounts.find({
                        email: req.body.account,
                        role: 'staff',
                        password: md5(req.body.password)
                    }).then(ps => {
                        if (ps[0] == null) {
                            var passwordFalse = "Incorrect password";
                            res.render('login', {
                                passwordFalse,
                                layout: false,
                                email: req.body.account,
                                password: req.body.password,
                                staff: 1
                            });
                        } else {
                            res.cookie('staff', [e[0].name, e[0].role, e[0].permission], {
                                expires: new Date(Date.now() + 6000000)
                            });
                            res.redirect('/');
                        }
                    }).catch(ps => {

                    })
                }
            }).catch(e => {

            });
        }
    }
    logout(req, res) {
        res.clearCookie('admin');
        res.clearCookie('staff');
        res.redirect('/login');
    }
}
module.exports = new login;