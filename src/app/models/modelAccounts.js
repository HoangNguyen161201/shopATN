const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
// Define the fields and the type of each field
const account = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    password: String,
    role: String,
    permission: Array,
}, {
    id: false
});
account.plugin(mongoose_delete);
module.exports = mongoose.model('account', account);