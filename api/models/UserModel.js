/**
 * Created by dpineda on 22/06/17.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    utm_source: {
        type: String,
        required: true,

    },
    query_token: {
        type: Boolean,
        default: null
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Users', UserSchema);