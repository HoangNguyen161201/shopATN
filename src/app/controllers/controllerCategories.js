// connect to models
const modelCategory = require("../models/modelCategories");
const modelProducts = require("../models/modelProducts");
const checkAccount = require("../helpers/checkAccount");
class controllerProducts {
  // show infor of all categorise
  show(req, res) {

    var r = checkAccount.checkAccount(req.cookies);
    modelCategory
      .find({})
      .then((result) => {
        result = result.map((e) => e.toObject());
        if (req.session.alertDl) {
          res.render("category/showCategories", {
            result,
            alertDl: req.session.alertDl,
            nameAccount: r[1][0],
          });
        } else {
          res.render("category/showCategories", {
            result,
            nameAccount: r[1][0],
          });
        }
      })
      .catch((e) => {});
  }
  // add new category
  add(req, res) {
    var r = checkAccount.checkAccount(req.cookies);
    // check if the account is admin or not, or the staff account has permission to access this page.
    if (checkAccount.checkAllow(r, "addCategory")) {
      res.render("category/addCategory", {
        nameAccount: r[1][0]
      });
    } else {
      res.redirect("/");
    }
  }
  // add new category
  async insert(req, res) {
    var id = 1;
    await modelCategory
      .findOne()
      .sort({
        _id: "desc"
      })
      .then((doc) => {
        if (doc) {
          id = doc._id + 1;
        }
        req.body._id = id;
        var r = new modelCategory(req.body);
        r.save(function () {});
      })
      .catch(() => {});
    req.session.alertDl = "Successfully added new category";
    res.redirect("/managerCategories");
  }
  // show form to update cateogy
  update(req, res) {

    var r = checkAccount.checkAccount(req.cookies);
    // check if the account is admin or not, or the staff account has permission to access this page.
    if (checkAccount.checkAllow(r, "updateCategory")) {
      modelCategory
        .find({
          _id: req.params.id
        })
        .then((category) => {
          category = category.map((e) => e.toObject());
          res.render("category/updateCt", {
            category,
            nameAccount: r[1][0]
          });
        })
        .catch({});

    }
    // If you are not logged in, go back to the login page
    else {
      res.redirect("/login");
    }
  }
  // make to update category
  async actUpdate(req, res) {
    await modelCategory.where({
      _id: Number(req.body.id)
    }).updateOne(req.body);
    req.session.alertDl = "The category has been updated successfully";
    res.redirect("/managerCategories");
  }
  // delete ctegory by id
  async delete(req, res) {

    var r1 = checkAccount.checkAccount(req.cookies);
    // check if the account is admin or not, or the staff account has permission to access this page.
    if (checkAccount.checkAllow(r1, "deleteCategory")) {
      var r = Number(req.params.id);
      await modelCategory.deleteOne({
        _id: r
      });
      await modelProducts.deleteMany({
        id_category: r
      });
      req.session.alertDl = "Category has been deleted successfully";
      res.redirect("/managerCategories");
    } else {
      res.redirect("/");
    }

  }
  // show detail
  async detail(req, res) {

    var r1 = checkAccount.checkAccount(req.cookies);
    // check if the account is admin or not, or the staff account has permission to access this page.
    if (checkAccount.checkAllow(r1, "detailCategory")) {
      modelProducts
        .aggregate()
        .match({
          id_category: Number(req.params.id)
        })
        .lookup({
          from: "categories",
          localField: "id_category",
          foreignField: "_id",
          as: "categories",
        })
        .group({
          _id: "$categories",
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
          },
        })
        .exec((err, statistical) => {
          modelProducts
            .aggregate()
            .match({
              id_category: Number(req.params.id)
            })
            .lookup({
              from: "categories",
              localField: "id_category",
              foreignField: "_id",
              as: "categories",
            })
            .lookup({
              from: "suppliers",
              localField: "id_supplier",
              foreignField: "_id",
              as: "suppliers",
            })
            .unwind("suppliers")
            .unwind("categories")
            .exec((err, products) => {
              res.render("category/detailCategories", {
                statistical,
                products,
                nameAccount: r1[1][0],
              });
            });
        });
    } else {
      res.redirect("/");
    }
  }
}
module.exports = new controllerProducts();