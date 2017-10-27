/**
 * Created by dpineda on 9/27/17.
 */
'use strict';
let fs = require('fs');
let busboy = require('connect-busboy');
let path = require('path');
let convertExcel = require('excel-as-json').processFile;
let mongoose = require('mongoose');
let VtexOrders = mongoose.model('VtexOrders');

exports.sapFileUploader = (req, res) => {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype, ex) {
        let pos = filename.lastIndexOf('.');
        let newName = filename.substr(0, pos) + Math.floor((Math.random() * 1000) + 1);
        let ext = filename.substr(pos+1);

        if( ext === 'xlsx' ) {
            let filepath = path.join(path.resolve(), '/uploads/' + newName + '.' + ext);
                fstream = fs.createWriteStream(filepath);
                file.pipe(fstream);
                fstream.on('close', function () {

                    let jsonFileName = filepath.replace(ext, 'json');

                    convertExcel(filepath, jsonFileName, null,  (err, data) => {
                        if (err) {
                            throw new Error(err);
                        } else {
                            let dates = parseSapFile(jsonFileName, true);
                            res.json({
                                'error': false,
                                'message': 'file parsed ok',
                                'data': {
                                    'path': jsonFileName,
                                    'dates': dates
                                }
                            });

                        }
                    });

                });

        }else{
            res.json({
                'error': true,
                'message': 'file type is not valid',
                'data': {
                    'path': null
                }
            });
             return false;
        }

    });
};


var parseSapFile = (path, dateExcel) => {
    let sapOrders = JSON.parse(fs.readFileSync( path, 'utf8'));
    let max = null;
    let min = null;

    for (var i = 0; i < sapOrders.length; i++) {
        let current = sapOrders[i];
        if (max === null || current['Fecha Vtex'] > max['Fecha Vtex']) {

            max = current;
        }
        if (min === null || current['Fecha Vtex'] < min['Fecha Vtex']) {
            min = current;
        }
    }
    let dates = null;
    if(dateExcel){
        dates = {
            from: new Date((min['Fecha Vtex'] - (25567 + 2 ))*86400*1000),
            to: new Date((max['Fecha Vtex'] - (25567 + 2))*86400*1000),
        };
    }else{

        let min_parts = min['Fecha Vtex'].split('/');
        let max_parts = max['Fecha Vtex'].split('/');
        min_parts[2] = (min_parts[2].length > 2) ? min_parts[2].substring(min_parts[2].length-2,min_parts[2].length):min_parts[2];
        max_parts[2] = (max_parts[2].length > 2) ? max_parts[2].substring(max_parts[2].length-2,max_parts[2].length):max_parts[2];

        let from_str = "20"+min_parts[2]+"-"+min_parts[1]+"-"+min_parts[0];
        let to_str = "20"+max_parts[2]+"-"+max_parts[1]+"-"+max_parts[0];


        dates = {
            from: new Date(from_str),
            to: new Date(to_str),
        };

    }
    return dates;
};
exports.audit_sap =  (req, res) => {
    this.sapFileUploader(req, res);

};
exports.getSavedOrders = (req, res) => {

    if(!req.body['from'] || !req.body['to'] || !req.body['brand'] || !req.body['file_path']) {
        res.json(
            {
                'error': false,
                'message': 'Invalid post parameters',
                'data': null
            }
        );
        return false;
    }else{

        var dateTo = req.body['to'].split('T')[0];
        let query = {
            creationDate: {
                $gte: new Date(req.body['from']),
                $lt:  new Date(dateTo + 'T23:59:59.000Z')
            },
            brand: req.body['brand']
        };
        let vtexOrders = VtexOrders.find(query);
        vtexOrders.exec(function(err, data) {
            if (err) {
                throw new Error(err);
            }else{
                let sap = JSON.parse(fs.readFileSync( req.body['file_path'], 'utf8'));
                let vtexOrders = [];
                for (let i in data ) {
                    let vtexOrder = data[i];
                    let optionsRows = {}
                    for (let i in sap ) {
                        let sapOrder = sap[i];
                        if(vtexOrder['orderId'] === sapOrder['Pedido Vtex']){
                            vtexOrder['sapID'] = (sapOrder['Clase de Pedido'])? sapOrder['Clase de Pedido']+ ' ('+sapOrder['Tiendas'] + ') : ' + String(sapOrder['Pedido Sap']):  String(sapOrder['Pedido Sap']);
                            vtexOrder['auditedDate'] = new Date();
                            saveUpdateOrder(vtexOrder);
                            continue;
                        }

                    }
                    if( vtexOrder['status'] === 'payment-pending') {
                        optionsRows.style = '#ffdc9d';
                    }

                    if( vtexOrder['status'] === 'handling') {
                        optionsRows.style = '#ccffde';
                    }
                    if( (vtexOrder['sapID'] === null || vtexOrder['sapID'] === '')
                        &&  (vtexOrder['status'] !== 'canceled' && vtexOrder['status'] !== 'payment-pending' && vtexOrder['status'] !== 'invoiced' ) ) {
                        optionsRows.style = '#f9b5b5';
                    }

                    vtexOrders.push({'row': vtexOrder, 'options': optionsRows});
                }


                res.json(
                    {
                        'error': false,
                        'message': 'vtex orders',
                        'data': {
                            'cant':vtexOrders.length,
                            'rows':vtexOrders
                        }
                    }
                )
            }
        });
    }

};
let saveUpdateOrder = (order) => {
    let updateOrder = VtexOrders.update({'orderId': order.orderId}, order, {upsert: true});
    updateOrder.exec(function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            //console.log(data);
        }
    });
};
exports.validate_data = (req, res, next) => {
    return next();
}

