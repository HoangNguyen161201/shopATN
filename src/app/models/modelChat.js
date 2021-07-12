const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
// Define the fields and the type of each field
const chat = new mongoose.Schema({
    _id: Number,
    id_account: Number,
    name: String,
    date: Date,
    message: String
},{ id: false });
chat.plugin(mongoose_delete);
module.exports = mongoose.model('chat',chat);
