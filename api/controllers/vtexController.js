/**
 * Created by dpineda on 9/27/17.
 */
'use strict';

var mongoose = require('mongoose'),
    VtexOrders = mongoose.model('VtexOrders'),
    request = require("request"),
    fs = require('fs'),
    path = require('path');



exports.getOrders =  (req, res) => {
    if(! req.body['brand']){
        res.json({
            'error': true,
            'message': 'must be define a brand',
            'data': null
        });
        return false;
    }
    let vtex = config.vtex[req.body['brand']];
    let from, to, pag = 1, perPage = 20;

    let dates = req.body['dates'];
    if(!dates ){
        res.json({
            'error': true,
            'message': 'must be define a range of dates',
            'data': null
        });
        return false;
    }
    if( typeof dates['from'] == 'object') {
         from = dates['from'].getFullYear() + '-' + (dates['from'].getMonth()+1) + '-' + (dates['from'].getDate()+1);
    }else if( typeof dates['from'] == 'string' ){
         from = dates['from'].split('T')[0];
    }

    if( typeof dates['to'] == 'object') {
        to = dates['to'].getFullYear() + '-' + (dates['to'].getMonth()+1) + '-' + (dates['to'].getDate()+1);
    }else if (typeof dates['to'] == 'string') {
        to = dates['to'].split('T')[0];
    }

    if(req.body['page']){
        pag = req.body['page'];
    }
    if(req.body['perPage']){
        perPage = req.body['perPage'];
    }

    if(vtex){
        let options = { method: 'GET',
            url: vtex.ApiService + vtex.endpoints.listOrders,
            qs:
                { f_creationDate: 'creationDate:['
                + from + 'T00:00:00.000Z TO '
                + to + 'T23:59:59.999Z]',
                    page: pag,
                    per_page: perPage
                },
            headers: {
                'cache-control': 'no-cache',
                'x-vtex-api-apptoken': vtex["x-vtex-api-appToken"],
                'x-vtex-api-appkey': vtex["x-vtex-api-appKey"],
                'content-type': 'application/json'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.status(response.statusCode);

            let responseData = JSON.parse(response.body);

            let countOrders = 0;
            for( let i in responseData.list ){
                let order = responseData.list[i];
                order.brand = req.body['brand'];

                saveUpdateOrder(order);
                countOrders++;

            }

            console.log("ordenes guardadas:" + countOrders);

            res.json({
                'error': false,
                'message': 'Vtex orders added/updated',
                'data': {
                    paging: responseData.paging,
                    query: req.body
                }
            });


        });

    }else{
        res.json({
            'error': true,
            'message': 'Invalid brand Provided',
            'data': null
        });
    }
};


let saveUpdateOrder = (order) => {
    let updateOrder = VtexOrders.update({'orderId': order.orderId}, order, {upsert: true});
    updateOrder.exec(function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
          //  console.log(data);
        }
    });
};







