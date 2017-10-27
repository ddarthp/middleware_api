'use strict';

var mongoose = require('mongoose');

exports.create_for_users = function (req, res){
    //res.json(config);
    var response = emBlue.request(req.body);
    res.json(response);

};


exports.validate_create_for_users = function (req, res, next) {
    req.checkQuery('utmSource', 'debe especificar el utm source ').notEmpty();
    req.checkBody('utmCampaign', 'debe especificar el nombre de la campaña (utm)').notEmpty();
    req.checkBody('email', 'especifique el email').notEmpty();

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
};


exports.email_create_coupon_token = function (req, res) {
    var queryToken
    var token = jwt.sign(queryToken, config.secret, {
            expiresIn : 3600 * 24 // expires in 1 day
        });

        res.json({
            success: true,
            message: 'user token returned',
            token: token
        });



};