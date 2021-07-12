// connect to models
const modelCategory = require('../models/modelCategories');
const modelSupplier = require('../models/modelSuppliers');
const modelProducts = require('../models/modelProducts');
//  connect to helper to check account
const checkAccount = require('../helpers/checkAccount');
class managerProducts {
    // show infor of all products
    show(req, res) {
        var r = checkAccount.checkAccount(req.cookies);
        var products = modelProducts.aggregate().lookup({
            from: 'categories',
            localField: 'id_category',
            foreignField: '_id',
            as: 'categories'
        }).lookup({
            from: 'suppliers',
            localField: 'id_supplier',
            foreignField: '_id',
            as: 'suppliers'
        }).unwind('suppliers');
        // if user is searching product by category
        if (req.query.category) {
            products.match({
                id_category: Number(req.query.category)
            });
        }
        // if user is searching product by supplier
        if (req.query.supplier) {
            products.match({
                id_supplier: Number(req.query.supplier)
            });
        }
        // search by id
        if (req.body.search) {
            products = products.match({
                name: {
                    $regex: '.*' + req.body.search + '.*',
                    $options: 'i'
                }
            });
        }
        // phan trang
        if (req.body.page) {
            products = products.skip(((req.body.page - 1) * 8)).limit(8);
        } else {
            products = products.limit(8);
        }

        // get data for page
        products.exec((err, listPrs) => {
            if (!err) {
                modelCategory.find({}, function (err, categories) {
                    if (!err) {
                        var categories1 = categories.map(e1 => e1.toObject());
                        modelSupplier.find({}, async function (err, suppliers) {
                            var suppliers1 = suppliers.map(e1 => e1.toObject());
                            var count1;
                            await modelProducts.find({}).countDocuments({}).then(e => {
                                count1 = e;
                            })
                            // get count
                            count1 = Math.ceil(count1 / 8);
                            var arrcount = [];
                            var j;
                            for (j = 1; j <= count1; j++) {
                                if (req.body.page) {
                                    arrcount[(j - 1)] = {
                                        count: j,
                                        mainPage: Number(req.body.page)
                                    };
                                } else {
                                    arrcount[(j - 1)] = {
                                        count: j,
                                        mainPage: 1
                                    };
                                }
                            }
                            //
                            console.log(arrcount);

                            if (req.session.alertDl) {
                                res.render('product/showProducts', {
                                    listPrs,
                                    alertDl: req.session.alertDl,
                                    categories1,
                                    suppliers1,
                                    count: arrcount,
                                    nameAccount: r[1][0]
                                });
                            } else {
                                res.render('product/showProducts', {
                                    listPrs,
                                    categories1,
                                    suppliers1,
                                    count: arrcount,
                                    nameAccount: r[1][0]
                                });
                            }
                        })
                    }
                })
            }
        })
    }
    // show form to add new product
    async add(req, res) {
        // check if the account is admin or not, or the staff account has permission to access this page.
        var r = checkAccount.checkAccount(req.cookies);
        if (checkAccount.checkAllow(r, 'addProduct')) {
            var category;
            var supplier;
            await modelCategory.find({}).then(e => {
                category = e.map(es => es.toObject());
            });
            await modelSupplier.find({}).then(r => {
                supplier = r.map(rs => rs.toObject());
            });
            res.render('product/addNewpr', {
                category,
                supplier,
                nameAccount: r[1][0]
            });
        } else {
            res.redirect('/');
        }
    }
    // action add new product
    async insert(req, res) {
        try {
            var file = req.files.file;
            var filename = file.name;
            console.log(file.name);
            await file.mv('src/public/img/product/' + filename, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('thanh cong');
                }
            });
            var id = 1;
            await modelProducts.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                req.body.img = '/img/product/' + filename;
                req.body.quantity_sold = 0;
                var r = new modelProducts(req.body);
                r.save(function () {});
            }).catch(() => {});
            // Notify users
            req.session.alertDl = 'New product has been added successfully';
            res.redirect('/managerProduct');
        } catch (error) {
            var id = 1;
            await modelProducts.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                req.body.quantity_sold = 0;
                var r = new modelProducts(req.body);
                r.save(function () {});
            }).catch(() => {});
            // Notify users
            req.session.alertDl = 'New product has been added successfully';
            res.redirect('/managerProduct');
        }

    }
    // delete product by id
    delete(req, res) {
        // check if the account is admin or not, or the staff account has permission to access this page.
        var r = checkAccount.checkAccount(req.cookies);
        if (checkAccount.checkAllow(r, 'deleteProduct')) {
            modelProducts.findOne({
                '_id': req.params.id
            }).then(async e => {
                if (e != null) {
                    await modelProducts.deleteOne({
                        _id: req.params.id
                    });
                    // Notify users
                    req.session.alertDl = 'The product has been deleted';
                    console.log(req.session.alertDl);
                    res.redirect('/managerProduct');
                }
                console.log(e);
            }).catch(e => {

            });
        } else {
            res.redirect('/');
        }
    }
    // show form to update product
    update(req, res) {
        // check if the account is admin or not, or the staff account has permission to access this page.
        var r = checkAccount.checkAccount(req.cookies);
        if (checkAccount.checkAllow(r, 'updateProduct')) {
            modelProducts.aggregate().match({
                _id: Number(req.params.id)
            }).lookup({
                from: 'categories',
                localField: 'id_category',
                foreignField: '_id',
                as: 'category'
            }).lookup({
                from: 'suppliers',
                localField: 'id_supplier',
                foreignField: '_id',
                as: 'supplier'
            }).unwind('supplier').unwind('category').exec((err, doc) => {
                if (!err) {
                    if (doc[0] != null) {
                        modelCategory.find({}).then(category => {
                            modelSupplier.find({}).then(supplier => {
                                var ct = category.map(e => e.toObject());
                                var suppliers = supplier.map(e => e.toObject());
                                doc[0].categories = ct;
                                doc[0].suppliers = suppliers
                                console.log(doc[0].suppliers);
                                console.log(req.headers.location);
                                res.render('product/updateProduct', {
                                    doc,
                                    ct,
                                    suppliers,
                                    nameAccount: r[1][0]
                                });
                            }).catch(e => {

                            });
                        }).catch(e => {

                        });
                    } else {
                        res.redirect('/');
                    }

                } else {
                    res.redirect('/managerProduct');
                }
            })
        } else {
            res.redirect('/');
        }
    }
    // make to update product
    async actUpdate(req, res) {
        try {
            var file = req.files.file;
            var filename = file.name;
            console.log(file.name);
            await file.mv('src/public/img/product/' + filename, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('thanh cong');
                }
            });
            req.body.img = '/img/product/' + filename;
            // Notify users
            req.session.alertDl = 'The product has been successfully updated';
            if (req.body.quantity_sold == null || req.body.quantity_sold == "") {
                req.body.quantity_sold = 0;
            }
            await modelProducts.where({
                _id: Number(req.body.id)
            }).updateOne(req.body);
            res.redirect('/managerProduct');
        } catch (error) {
            // Notify users
            req.session.alertDl = 'The product has been successfully updated';
            if (req.body.quantity_sold == null || req.body.quantity_sold == "") {
                req.body.quantity_sold = 0;
            }
            await modelProducts.where({
                _id: Number(req.body.id)
            }).updateOne(req.body);
            res.redirect('/managerProduct');
        }
    }

}
module.exports = new managerProducts;