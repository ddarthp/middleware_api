/**
 * Created by dpineda on 22/06/17.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserRefundsSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    refund_selected: {
        type: String,
        required: true,
    },
    brand_info: {
        type: String,
        required: true,
    },
    validated: {
        type: Boolean,
        default: false
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('UserRefunds', UserRefundsSchema);