/**
 * Created by dpineda on 8/2/17.
 */
'use strict';

var mongoose = require('mongoose'),
    UserRefunds = mongoose.model('UserRefunds'),
    request = require("request"),
    fs = require('fs'),
    path = require('path');
var _brand = null;

exports.users_data = (req, res) => {
    req.query.brand_info = req.params.brand;
    _brand = req.params.brand;
    if( email_authorized (req.query.email) ){
        req.query.validated = true;
        email_exists_valid(req, res, save_data);
    }else{
        render_landing(res, 'refunds_error', {
            error: 'Su email no tiene un reembolso autorizado',
            data: {"Email": req.query.email}
        });
    }
}

var save_data = (req, res) => {
    var userRefunds = new UserRefunds(req.query);
    userRefunds.save(function (err) {
        if (err) {
            throw new Error(err);
            render_landing(res, 'refunds_error', {error: err });
        }else{
            if(req.query.refund_selected == 'consignacion_bancaria'){
                render_landing(res, 'refunds_form', req.query);
            }else{
                render_landing(res, 'refunds_thanks', req.query);
            }
        }
    });
}

var render_landing = (res, page, data) => {
    res.render('landings/'+ _brand + '/' + page, {
        'data':data
    });
}

var email_exists_valid = (req, res, callback) => {
    var findEmail = UserRefunds.findOne({'email': req.query.email, 'brand_info': _brand });

    findEmail.exec(function(err, data) {
        if (err) {
            throw new Error(err);
            render_landing(res, 'refunds_error', {error: err });
        } else {
            if (data){ // el email existe. eso quiere decir que el usuario ya seleccionó una respuesta en alguna marca
                var datos = {
                    "email":data.email
                };

                switch(data.refund_selected) {
                    case "vale_tienda" :
                        datos['Tipo de reembolso'] = 'Vale en tienda Física';
                        break;
                    case "vale_online" :
                        datos['Tipo de reembolso'] = 'Vale en tienda Online';
                        break;
                    case "consignacion_bancaria" :
                        datos['Tipo de reembolso'] = 'Consignacion bancaria';
                        break;

                }
                render_landing(res, 'refunds_error', {
                    error: 'Ya ha seleccionado previamente un tipo de reembolso',
                    data: datos
                });
            }else{
                callback(req, res);
            }
        }
    });
}

var email_authorized = (email) => {
    var  autorizedEmailsDB = path.join(path.resolve(), 'database/autorizedEmailsRefunds.json');
    var autorizedEmails = JSON.parse(fs.readFileSync( autorizedEmailsDB, 'utf8'));

    for (var i in autorizedEmails) {
        if( autorizedEmails[i].email === email && autorizedEmails[i].brand === _brand ) {
            return true;
        }
    }
    return false;
}

exports.validate_data = (req, res, next) => {
    req.checkQuery('email', 'email inválido').notEmpty();
    req.checkQuery('refund_selected', 'debe seleccionar un tipo de reembolso').notEmpty();
    req.checkParams('brand', 'tienda inválida').isAlpha();

    var errors = req.validationErrors();
    if (errors) {
        var response = { errors: [] };
        errors.forEach(function(err) {
            response.errors.push(err.msg);
        });
        res.statusCode = 400;
        return res.json(response);
    }
    return next();
}


