
//  connect to helper to check account
const checkAccount = require("../helpers/checkAccount");
// connect to models
const modelCustomers = require("../models/modelCustomers");
const modelSuppliers = require("../models/modelSuppliers");
const modelInvoice = require("../models/modelInvoices");
const modelProducts = require("../models/modelProducts");
class home {
    // show dashboard
    async show(req, res) {
        // Check if your account is logged in
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            var total_month;
            var count_order = [{count:0}];
            var count_cs;
            var total_today = 0;
            var total_year = 0;
            var suppliers;
            var customers;
            var pr_month;
            
            await modelInvoice.aggregate().match({
                date_to_order: {
                    $gte: new Date(new Date().getFullYear(), 1, 1)
                }
            }).group({
                _id: {
                    month: {
                        $month: '$date_to_order'
                    },
                    year: {
                        $year: '$date_to_order'
                    }
                },
                total: {
                    $sum: '$total'
                }
            }).exec((err, doc) => {
                total_month = doc;
            });
            // get count of order
            await modelInvoice.aggregate().group({
                _id: '$id_order',
            }).group({
                _id: null,
                count: {
                    $sum: 1
                }
            }).exec((err, count_order1) => {
                if(count_order1.length != 0){
                    count_order = count_order1;
                }
            })
            // get count of customer
            await modelCustomers.find({}).countDocuments({}).then(count_cs1 => {
                count_cs = count_cs1;
            })
            // get infor of 5 suppliers
            await modelSuppliers.find({}).limit(5).then(e => {
                suppliers = e.map(es => es.toObject());
            })
            // get infor of 5 customers
            await modelCustomers.find({}).limit(5).then(e => {
                customers = e.map(es => es.toObject());
            })
            // get total price in today
            await modelInvoice.aggregate().match({
                date_to_order: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0)
                }
            }).group({
                _id: null,
                total: {
                    $sum: '$total'
                }
            }).exec((err, total) => {
                if (total[0] != null) {
                    total_today = total[0].total;
                }
                // Show the amount earned so far
                modelInvoice.aggregate().group({
                    _id: null,
                    total: {
                        $sum: '$total'
                    }
                }).exec((err, total_year1) => {
                    total_year = total_year1;
                    // get Top 3 best selling products
                    modelProducts.aggregate().sort({
                        quantity_sold: -1
                    }).limit(3).exec((err, productsBest) => {
                        // get Top 5 best selling products in month
                        modelInvoice.aggregate().match({
                            date_to_order: {
                                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 0, 0, 0, 0, 0)
                            }
                        }).group({
                            _id: '$id_product',
                            total: {
                                $sum: '$total'
                            },
                            quantity: {
                                $sum: '$quantity_pr'
                            }
                        }).lookup({
                            from: 'products',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'product'
                        }).sort({
                            quantity: -1
                        }).limit(5).exec((err, e) => {
                            if (e[0] != null) {
                                pr_month = e;
                                console.log(pr_month);
                            }
                            res.render("dashboard", {
                                nameAccount: r[1][0],
                                total_month,
                                count_order,
                                count_cs,
                                total_today,
                                total_year,
                                suppliers,
                                customers,
                                productsBest,
                                pr_month
                            });
                        })
                    })
                })

            })
        }
        // If you are not logged in, go back to the login page
        else {
            res.redirect("/login");
        }
    }
}
module.exports = new home();