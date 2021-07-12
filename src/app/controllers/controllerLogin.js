// connect to models
const modelAccounts = require('../models/modelAccounts');
//  connect to helper to check account
const checkAccount = require('../helpers/checkAccount');
const md5 = require('md5');
class login {
    // show login page
    showLogin(req, res) {
        // Check if your account is logged in
        if (checkAccount.logged(req.cookies) == 0) {
            res.render('login', {
                layout: false
            });
        }
        // if user has account, program will redirect user to homepage
        else {
            if (checkAccount.logged(req.cookies) == 1) {
                res.redirect('/');
            }
        }
    }
    // check account
    async checkLogin(req, res) {
        // if user use admin account
        if (req.body.person == "admin") {
            // check the email that the user entered is correct or not, check the role.
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
                    // Check if the password entered by the user is correct or not
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
                            // Create cookies to store account information.
                            res.cookie('admin', [ps[0].name,ps[0]._id], {
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
        // if user use staff account
        if (req.body.person == "staff") {
             // check the email that the user entered is correct or not, check the role.
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
                    // Check if the password entered by the user is correct or not
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
                            // Create cookies to store account information.
                            res.cookie('staff', [e[0].name,e[0]._id, e[0].role, e[0].permission], {
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
    // make to logout account
    logout(req, res) {
        res.clearCookie('admin');
        res.clearCookie('staff');
        res.redirect('/login');
    }
}
module.exports = new login;