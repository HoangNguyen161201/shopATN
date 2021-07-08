var express = require('express');
var controllerProducts = require('../app/controllers/controllerProducts');
var router = express.Router();
router.all('/',controllerProducts.show);
router.get('/add',controllerProducts.add);
router.post('/insert',controllerProducts.insert);
router.get('/delete/:id',controllerProducts.delete);
router.get('/update/:id',controllerProducts.update);
router.post('/actUpdate',controllerProducts.actUpdate);
module.exports = router