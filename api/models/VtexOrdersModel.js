/**
 * Created by dpineda on 22/06/17.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VtexOrdersSchema = new Schema({
    "orderId": Schema.Types.Mixed,
    "creationDate": {type: Date},
    "clientName": Schema.Types.Mixed,
    "items": Schema.Types.Mixed,
    "totalValue": Schema.Types.Mixed,
    "paymentNames": Schema.Types.Mixed,
    "status": Schema.Types.Mixed,
    "statusDescription": Schema.Types.Mixed,
    "marketPlaceOrderId": Schema.Types.Mixed,
    "sequence": Schema.Types.Mixed,
    "salesChannel": Schema.Types.Mixed,
    "affiliateId": Schema.Types.Mixed,
    "origin": Schema.Types.Mixed,
    "workflowInErrorState": Schema.Types.Mixed,
    "workflowInRetry": Schema.Types.Mixed,
    "lastMessageUnread": Schema.Types.Mixed,
    "ShippingEstimatedDate": Schema.Types.Mixed,
    "orderIsComplete": Schema.Types.Mixed,
    "listId": Schema.Types.Mixed,
    "listType": Schema.Types.Mixed,
    "authorizedDate": {type: Date},
    "callCenterOperatorName": Schema.Types.Mixed,
    "brand": Schema.Types.Mixed,
    "sapID": {type: String, default: null},
    "auditedDate":{type: Date}
});

module.exports = mongoose.model('VtexOrders', VtexOrdersSchema);