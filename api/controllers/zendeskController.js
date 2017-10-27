/**
 * Created by dpineda on 7/4/17.
 */
var request = require("request");

exports.patprimo = function (req, res) {
    var zendesk = config.zendesk.patprimo;

    var bodyRequest = createBody(req);

    if ( zendesk.CUSTOM ) {
        var custom_fields = [];
        for(var i in req.body) {
            if( i.indexOf('c_') > -1 ) {
                custom_fields.push({
                    "id": i.replace('c_', ''),
                    "value": req.body[i]});
            }
        }
        if(custom_fields.length > 0){
            bodyRequest.ticket['custom_fields'] = custom_fields;
        }

    }

    var options = { method: 'POST',
        url: zendesk.ZDURL+'/tickets.json?',
        headers:
            {   'cache-control': 'no-cache',
                authorization: auth(zendesk)
            },
        body: bodyRequest,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.status(response.statusCode);
        res.json(response.body);
    });
}

exports.sevenseven = function (req, res) {
    var zendesk = config.zendesk.sevenseven;

    var bodyRequest = createBody(req);

    if ( zendesk.CUSTOM ) {
        var custom_fields = [];
        for(var i in req.body) {
            if( i.indexOf('c_') > -1 ) {
                custom_fields.push({
                    "id": i.replace('c_', ''),
                    "value": req.body[i]});
            }
        }
        if(custom_fields.length > 0){
            bodyRequest.ticket['custom_fields'] = custom_fields;
        }

    }

    var options = { method: 'POST',
        url: zendesk.ZDURL+'/tickets.json?',
        headers:
            {   'cache-control': 'no-cache',
                authorization: auth(zendesk)
            },
        body: bodyRequest,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.status(response.statusCode);
        res.json(response.body);
    });

}

exports.validate_data = function (req, res, next) {
    req.checkBody('z_name', 'ingrese su nombre').notEmpty();
    req.checkBody('z_requester', 'especifique el email').notEmpty();
    req.checkBody('z_phone', 'debe ingresar un telefono valido').notEmpty();
    req.checkBody('z_subject', 'especifique un tema').notEmpty();
    req.checkBody('z_description', 'solicitud no puede estar vacio').notEmpty();
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

var createBody = function (req) {
    var msg_body = req.body.z_description + '\n email: ' + req.body.z_requester + '\n télefono: ' + req.body.z_phone;
    var bodyRequest = {
        "ticket":{
            "subject": req.body.z_subject,
            "comment": msg_body,
            "requester": req.body.z_name,
            "phone": req.body.z_phone,
            "email": req.body.z_requester,
            "priority": "normal"
        }
    };

    if( req.body.z_priority ) {
        bodyRequest.ticket.priority = req.body.z_priority;
    }
    return bodyRequest;
};

var auth = function(data){
    return  "Basic " + new Buffer(data.ZDUSER + "/token:" + data.ZDAPIKEY).toString("base64");
}

