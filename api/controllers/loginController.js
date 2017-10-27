'use strict';

var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path');
var crypto = require('crypto');
exports.authentication = (req, res) => {
    var isAuth = validate_login(req.body.username, req.body.password);



    if(isAuth) {
        res.json({
            'error':false,
            'message': 'usuario autorizado',
            'data': {
                'user' : {
                    'name': isAuth.email,
                    'authorized': true
                }
            }
        })
    }else{
        res.json({
            'error':true,
            'message': 'combinación de usuario y contraseña inválido',
            'data': {
                'user' : {
                    'authorized': false
                }
            }

            }
        )
    }
}

var validate_login = (email, password) => {
    var  authUsersDB = path.join(path.resolve(), 'database/authUsers.json');
    var authUsers = JSON.parse(fs.readFileSync( authUsersDB, 'utf8'));

    for (var i in authUsers) {
        if( authUsers[i].email === email && authUsers[i].password === encrypt(password) ) {
            return authUsers[i];
        }
    }
    return false;
}

exports.validate_data = (req, res, next) => {
    req.checkBody('username', 'nombre de usuario invalido').notEmpty();
    req.checkBody('password', 'nombre de usuario y password invalidos').notEmpty();

    let errors = req.validationErrors();
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
 var encrypt =  (string) => {
    let hashMd5 = crypto.createHash('md5').update(config.salt + string).digest("hex");
    return crypto.createHash('sha1').update(hashMd5).digest("hex");
}