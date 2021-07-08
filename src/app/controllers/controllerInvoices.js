const modelCustomers = require('../models/modelCustomers');
const modelProducts = require('../models/modelProducts');
const modelInvoices = require('../models/modelInvoices');
const checkAccount = require('../helpers/checkAccount');
class controllerInvoices {
    async show(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            await modelInvoices.aggregate().lookup({
                from: 'customers',
                localField: 'id_customer',
                foreignField: '_id',
                as: 'customer'
            }).unwind("customer").group({
                _id: {
                    id_order: "$id_order",
                    customer: "$customer",
                    date_to_order: "$date_to_order"
                },
                type_product: {
                    $sum: 1
                },
                quantity: {
                    $sum: "$quantity_pr"
                },
                total: {
                    $sum: "$total"
                },
            }).exec((err, result) => {
                res.render('invoices/showInvoices', {
                    result,
                    nameAccount: r[1][0]
                });
            })
        } else {
            res.redirect('/login');
        }
    }
    showAddInvoice(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'addOrder')) {
                modelCustomers.find({}).select(["_id", "name", "numberPhone"]).then(customers => {
                    customers = customers.map(e => e.toObject());
                    modelProducts.find({
                        quantity: {
                            $gte: 1
                        }
                    }).then(products => {
                        products = products.map(pr => pr.toObject());
                        res.render('invoices/addInvoice', {
                            customers,
                            products,
                            nameAccount: r[1][0]
                        });
                    }).catch(e => {

                    })
                }).catch(e => {});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    async actAddNew(req, res) {
        var r = Object.entries(req.body);
        var i = 0;
        var id_order1 = 1;
        await modelInvoices.findOne().sort({
            id_order: 'desc'
        }).then(e => {
            if (e) {
                id_order1 = e.id_order + 1;
            }
        }).catch(async e => {});
        var date = Date.now();
        for (i; i < (r.length - 1); i++) {
            var order = new Object;
            order.id_product = r[i][0];
            order.quantity_pr = r[i][1];
            await modelProducts.findOne({
                _id: Number(order.id_product)
            }).then(async pr => {
                console.log(pr);
                pr.quantity = Number(pr.quantity) - Number(order.quantity_pr);
                pr.quantity_sold = Number(pr.quantity_sold) + Number(order.quantity_pr);
                await modelProducts.updateOne({
                    _id: Number(order.id_product)
                }, pr);
            }).catch(e => {});
            order.id_customer = r[r.length - 1][1];
            order.date_to_order = date;
            var total1 = 0;
            order.id_order = id_order1;
            await modelProducts.findOne({
                _id: Number(r[i][0])
            }).then(e => {
                total1 = Number(r[i][1]) * Number(e.new_price);
            }).catch(e => {});
            order.total = total1;
            await modelInvoices.create(order);
        }
        res.redirect('/managerInvoices');
    }
    async showDetail(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'detailInvoice')) {
                await modelInvoices.aggregate().match({
                    id_order: Number(req.params.id)
                }).lookup({
                    from: 'products',
                    localField: 'id_product',
                    foreignField: '_id',
                    as: 'product'
                }).exec(async (err, result) => {
                    await modelCustomers.find({
                        _id: Number(result[0].id_customer)
                    }).then(async customer => {
                        customer = customer.map(e => e.toObject());
                        await modelInvoices.aggregate().match({
                            id_order: Number(req.params.id)
                        }).group({
                            _id: "$id_order",
                            type: {
                                $sum: 1
                            },
                            quantity: {
                                $sum: "$quantity_pr"
                            },
                            total: {
                                $sum: "$total"
                            },
                        }).exec((err, tk) => {
                            console.log(tk);
                            res.render('invoices/detailInvoice', {
                                result,
                                tk,
                                customer,
                                nameAccount: r[1][0]
                            });
                        })
                    }).catch(e => {});
                })
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    async printBill(req, res) {
        if (checkAccount.logged(req.cookies) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'printBill')) {
                var pageBill = "<html lang='en'><head><meta charset='UTF-8'> <title>Bill</title><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC' crossorigin='anonymous'><link rel='stylesheet' href='../../public/css/bill.css'></head><body style='width: 100%;height: auto;position: relative;display: flex;justify-content: center;flex-direction: column;align-items: center;padding-top: 30px;padding-left:20px;padding-right:20px'><img src='../.src/public/img/delete.png' alt=''><p class='shop' style='font-size:30px;font-weight: 900;color: #525ce5;text-align:center'>ATN shop</p><div class='infor-cs'><p class='title' style='color: #525ce5; margin-top: 20px;font-weight: 500;'>Invoice</p><div class='container infor-main' style='padding:0px 20px;border-radius: 5px;position: relative;'>";
                var pagebill1 = "</div></div><div class='infor-cs'><p class='title' style='color: #525ce5; margin-top: 20px;font-weight: 500;'>Infor customer</p><div class='container infor-main' style=' background-color: #8991ff;padding: 20px;border-radius: 5px;position: relative;'>"
                var pageBill2 = "</div></div><div class='infor-cs '><p class='title' style='color: #525ce5;margin-top: 20px;font-weight: 500;'>Infor product</p><div class='table-infor' style='padding: 10px;position: relative;'><table class='table container'><thead><tr><td class='title-table' style='color: #727272;font-weight: 500;' scope='col'>Id productt</td><td class='title-table' style='    color: #727272;font-weight: 500;' scope='col'>Name porduct</td><td class='title-table' style='    color: #727272; font-weight: 500;' scope='col'>quantity</td><td class='title-table' style='color: #727272;font-weight: 500;' scope='col'>price</td><td class='title-table' style='    color: #727272;font-weight: 500;' scope='col'>total price</td></tr></thead><tbody>";
                var pageBill3 = "</tbody></table></div></div></body></html>";
                await modelInvoices.aggregate().match({
                    id_order: Number(req.params.id)
                }).lookup({
                    from: 'products',
                    localField: 'id_product',
                    foreignField: '_id',
                    as: 'product'
                }).exec(async (err, result) => {
                    var pagePr = "";
                    result.forEach(e => {
                        pagePr += "<tr><td scope='row'>" + e.product[0]._id + "</td>";
                        pagePr += "<td>" + e.product[0].name + "</td>";
                        pagePr += "<td>" + e.quantity_pr + "</td>";
                        pagePr += "<td>" + e.product[0].new_price + "$</td>";
                        pagePr += "<td>" + e.total + "$</td></tr>";
                    })
                    await modelCustomers.find({
                        _id: Number(result[0].id_customer)
                    }).then(async customer => {
                        customer = customer.map(e => e.toObject());
                        var pageCs = "<p>Id customer: " + customer[0]._id + "</p>" +
                            "<p>Name customer: " + customer[0].name + "</p>" +
                            "<p>Email customer: " + customer[0].email + "</p>" +
                            "<p>Phone number: " + customer[0].numberPhone + "</p>";
                        await modelInvoices.aggregate().match({
                            id_order: Number(req.params.id)
                        }).group({
                            _id: {id:"$id_order",date:"$date_to_order"},
                            type: {
                                $sum: 1
                            },
                            quantity: {
                                $sum: "$quantity_pr"
                            },
                            total: {
                                $sum: "$total"
                            },
                        }).exec((err, tk) => {
                            console.log(tk);
                            var r = new Date(tk[0]._id.date);
                            var c = r.getDate()+"-"+(r.getMonth()+1)+"-"+r.getFullYear();
                            var pageInvoice = "<p>In invoice: "+tk[0]._id.id+"</p>"+"<p>Date to order: "+c+"</p>";
                            var pageTotal = "<tr><td scope='row'></td><td colspan='2'></td><td></td>" +
                                "<td><p class='total'>Total: <span style='    font-weight: 500;color: red;'>" + tk[0].total + "$</span></p></td></tr>";
                            var page = pageBill + pageInvoice + pagebill1 + pageCs + pageBill2 + pagePr + pageTotal + pageBill3;
                            res.pdfFromHTML({
                                filename: 'generated.pdf',
                                htmlContent: page,
                            });
                        })
                    }).catch(e => {});
                })
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
}
module.exports = new controllerInvoices;