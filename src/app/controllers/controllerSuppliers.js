const modelSupplier = require('../models/modelSuppliers');
const modelProducts = require('../models/modelProducts');
const checkAccount = require('../helpers/checkAccount');
class managerProducts {
    // show all product
    show(req, res) {
        if (checkAccount.logged(req.cookies, res) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            modelSupplier.find({}).then(result => {
                result = result.map(e => e.toObject());
                if (req.session.alertDl) {
                    res.render("supplier/showSuppliers", {
                        result,
                        alertDl: req.session.alertDl,
                        nameAccount: r[1][0]
                    });
                } else {
                    res.render("supplier/showSuppliers", {
                        result,
                        nameAccount: r[1][0]
                    });
                }
            }).catch(e => {

            })
        } else {
            res.redirect('/login');
        }
    }
    // add new product
    add(req, res) {
        if (checkAccount.logged(req.cookies, res) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'addSupplier')) {
                res.render('supplier/addSp', {
                    nameAccount: r[1][0]
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    // action add new product
    async insert(req, res) {
        try {
            var file = req.files.file;
            var filename = file.name;
            console.log(file.name);
            await file.mv('src/public/img/brand/' + filename, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('thanh cong');
                }
            });
            var id = 1;
            await modelSupplier.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                req.body.img = '/img/brand/' + filename;
                var r = new modelSupplier(req.body);
                r.save(function () {});
            }).catch(() => {});
            req.session.alertDl = 'New supplier has been added successfully';
            res.redirect('/managerSuppliers');
        } catch (error) {
            var id = 1;
            await modelSupplier.findOne().sort({
                _id: 'desc'
            }).
            then(doc => {
                if (doc) {
                    id = doc._id + 1;
                }
                req.body._id = id;
                var r = new modelSupplier(req.body);
                r.save(function () {});
            }).catch(() => {});
            req.session.alertDl = 'New supplier has been added successfully';
            res.redirect('/managerSuppliers');
        }

    }
    // delete product by id
    async delete(req, res) {
        if (checkAccount.logged(req.cookies, res) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'deleteSupplier')) {
                var r = Number(req.params.id);
                await modelSupplier.deleteOne({
                    _id: r
                });
                await modelProducts.deleteMany({
                    id_supplier: r
                });
                req.session.alertDl = 'The supplier has been deleted successfully';
                res.redirect('/managerSuppliers');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }
    // update product
    async update(req, res) {
        if (checkAccount.logged(req.cookies, res) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'updateSupplier')) {
                await modelSupplier.find({
                    _id: Number(req.params.id)
                }).then(result => {
                    result = result.map(e => e.toObject());
                    res.render('supplier/updateSp', {
                        result,
                        nameAccount: r[1][0]
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
        try {
            var file = req.files.file;
            var filename = file.name;
            console.log(file.name);
            await file.mv('src/public/img/brand/' + filename, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('thanh cong');
                }
            });

            req.body.img = '/img/brand/' + filename;

            req.session.alertDl = 'The supplier has been successfully updated';
            await modelSupplier.where({
                _id: Number(req.body.id)
            }).updateOne(req.body);
            res.redirect('/managerSuppliers');
        } catch (error) {
            req.session.alertDl = 'The supplier has been successfully updated';
            await modelSupplier.where({
                _id: Number(req.body.id)
            }).updateOne(req.body);
            res.redirect('/managerSuppliers');
        }
    }

    async detail(req, res) {
        if (checkAccount.logged(req.cookies, res) == 1) {
            var r = checkAccount.checkAccount(req.cookies);
            if (checkAccount.checkAllow(r, 'detailSupplier')) {
                modelProducts.aggregate().match({
                    id_supplier: Number(req.params.id)
                }).lookup({
                    from: 'suppliers',
                    localField: 'id_supplier',
                    foreignField: '_id',
                    as: 'suppliers'
                }).group({
                    _id: "$suppliers",
                    type: {
                        $sum: 1
                    },
                    quantity: {
                        $sum: "$quantity"
                    },
                    total: {
                        $sum: {
                            $multiply: ["$quantity", "$new_price"]
                        }
                    }
                }).exec((err, statistical) => {
                    modelProducts.aggregate().match({
                        id_supplier: Number(req.params.id)
                    }).lookup({
                        from: 'categories',
                        localField: 'id_category',
                        foreignField: '_id',
                        as: 'categories'
                    }).lookup({
                        from: 'suppliers',
                        localField: 'id_supplier',
                        foreignField: '_id',
                        as: 'suppliers'
                    }).unwind('suppliers').unwind('categories').exec((err, products) => {
                        res.render('supplier/detailSuppliers', {
                            statistical,
                            products,
                            nameAccount: r[1][0]
                        });
                    })
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    }

}
module.exports = new managerProducts;