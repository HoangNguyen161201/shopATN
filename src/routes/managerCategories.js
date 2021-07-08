var express = require('express');
var controllerCategories = require('../app/controllers/controllerCategories');
var router = express.Router();
router.get('/',controllerCategories.show);
router.get('/add',controllerCategories.add);
router.get('/update/:id',controllerCategories.update);
router.get('/delete/:id',controllerCategories.delete);
router.post('/insert',controllerCategories.insert);
router.post('/actUpdate',controllerCategories.actUpdate);
router.get('/category/:id',controllerCategories.detail);
module.exports = router