const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const product = new mongoose.Schema({
    _id: Number,
    name: String,
    new_price: Number,
    old_price: Number,
    quantity: Number,
    id_category: {type: Number,ref:'category'},
    content: String,
    id_supplier: {type: Number,ref:'supplier'},
    img: String,
    quantity_sold: Number

},{ id: false });
product.plugin(mongoose_delete);
module.exports = mongoose.model('product',product);
