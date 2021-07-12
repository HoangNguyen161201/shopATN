const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
// Define the fields and the type of each field
const invoice = new mongoose.Schema({
    id_order: Number,
    id_customer: Number,
    id_product: Number,
    quantity_pr: Number,
    total: Number,
    date_to_order: Date,
});
invoice.plugin(mongoose_delete);
module.exports = mongoose.model('invoice',invoice);