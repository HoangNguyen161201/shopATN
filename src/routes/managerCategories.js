var express = require('express');
// connect to controller
var controllerCategories = require('../app/controllers/controllerCategories');
var router = express.Router();
// show information of all categories
router.get('/',controllerCategories.show);
// show form add to user can add new category
router.get('/add',controllerCategories.add);
// show form add to user can update new category
router.get('/update/:id',controllerCategories.update);
// delete cateogry
router.get('/delete/:id',controllerCategories.delete);
// make add new category
router.post('/insert',controllerCategories.insert);
// make update category
router.post('/actUpdate',controllerCategories.actUpdate);
// show detail
router.get('/category/:id',controllerCategories.detail);
module.exports = router