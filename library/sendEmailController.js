/**
 * Created by dpineda on 6/23/17.
 */
'use strict';
const nodemailer = require('nodemailer');

var emailConf = config.email;
var transporterConf = null;

// create reusable transporter object using the default SMTP transport
var transporter = null;

exports.setTransporter = function (brand){
    var service = emailConf.default_service;
    if( !service ) throw new Error("there isn't default sender service in config");

    transporterConf = emailConf.services[service][brand];
    if( !transporterConf ) throw new Error("the brand o default service does't exists!");
    var cnf = {
        host: transporterConf.host,
        port: transporterConf.port,
        secure: transporterConf.secure, // secure:true for port 465, secure:false for port 587
        auth: {
            user: transporterConf.username,
            pass: transporterConf.password
        },
        tls:{rejectUnauthorized: false}

    };
    console.log(cnf);
    transporter = nodemailer.createTransport(cnf);
}

exports.send = function (options) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: options.from_name + '<' + transporterConf.username + '>', // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        html: options.html // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw new Error (error);
        return info;
    });
}


