/**
 * Created by dpineda on 7/4/17.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    request = require("request"),
    email = require("../../library/sendEmailController"),
    fs = require('fs'),
    path = require('path');


exports.ecommerce = (req, res) => {
    var result = save_icommkt_contact(config.icommkt.ecommerce, req.body, res);
    console.log(result)
    if(req.body.n_discount){
        send_email({
            brand : 'ecommerce',
            subject : 'ecommerce.com te da la bienvenida con un 10% DCTO',
            from_name : 'ecommerce.com'
        }, req.body );
    }
}

var save_icommkt_contact = (icommkt, data, res) => {
    var bodyRequest =  {
        ProfileKey: icommkt.ProfileLists.VTEX_MASTERDATA,
        Contact: {
            Email: data.n_email,
            CustomFields: [
                {"Key":"NewsletterOptin","Value":data.n_validated},
                {"Key":"Genero","Value":data.n_gender},
            ]
        }
    };


    var options = { method: 'POST',
        url: icommkt.ApiService + icommkt.endpoints.SaveContact,
        headers:
            {   'cache-control': 'no-cache',
                authorization: icommkt.ApiKey + ':anytext',
            },
        body: bodyRequest,
        json: true
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.status(response.statusCode);
        res.json(response.body);
        return response.body;
    });
}

var send_email = (conf, data) => {
    email.setTransporter(conf.brand);

    var urlString = 'http://www.e-commerce.com/?utm_source=newsletter_frame&_ijt=' + randomString(31) + '&_tk=' + randomString(6) + Math.round(Math.random() * (2 - 1) + 1) + randomString(5);
    var template = fs.readFileSync(path.join(path.resolve(), 'views/email/' + conf.brand + '/email10dto.html'),'utf8');

    var options =  {
        'html': template.replace(/{{url_coupon}}/g, urlString),
        'from_name': conf.from_name,
        'to': data.n_email,
        'subject': conf.subject

    }

   email.send(options);
}

var randomString = function (_number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < _number; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var save_user = (data) => {

}

exports.validate_data =  (req, res, next) => {
    req.checkBody('n_email', 'ingrese su correo electronico').notEmpty();
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


