const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    metaData: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);