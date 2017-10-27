/**
 * Created by dpineda on 8/16/17.
 */
/**
 * Created by dpineda on 8/16/17.
 */
/**
 * Created by dpineda on 22/06/17.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NewsletterUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
    verify:{
        type: Boolean,
        default: false
    },
    active: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('NewsletterUsers', NewsletterUserSchema);
