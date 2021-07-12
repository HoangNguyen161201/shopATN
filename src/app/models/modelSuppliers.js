const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
// Define the fields and the type of each field
const supplier = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    img: String,
},{ id: false });
supplier.plugin(mongoose_delete);
module.exports = mongoose.model('supplier',supplier);
