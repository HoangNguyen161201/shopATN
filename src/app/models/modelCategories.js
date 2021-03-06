const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
// Define the fields and the type of each field
const category = new mongoose.Schema({
    _id: Number,
    name: String
},{id:false});
category.plugin(mongoose_delete);
module.exports = mongoose.model('category',category);
