const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const supplier = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    img: String,
},{ id: false });
supplier.plugin(mongoose_delete);
module.exports = mongoose.model('supplier',supplier);
