const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const customer = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    numberPhone: String,
},{ id: false });
customer.plugin(mongoose_delete);
module.exports = mongoose.model('customer',customer);