const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    phone: Number,
    gender: String,
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);