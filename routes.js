'use strict';

module.exports = function(app) {
    var cors = require('cors');
    // site Controllers
 	var home = require('./controllers/homeController');
 	var coupon = require('./controllers/couponController');
 	var site = require('./controllers/siteController');

 	// api controllers
    var apiCoupons = require('./api/controllers/couponsController');
    var apiLogin = require('./api/controllers/loginController');
    var apiZendesk = require('./api/controllers/zendeskController');
    var apiRefunds = require('./api/controllers/refundsController');
    var apiNewsletter = require('./api/controllers/newsletterController');
    var apiVtex = require('./api/controllers/vtexController');
    var apiSap = require('./api/controllers/sapController');

    var originsWhitelist = [
        'http://patprimo.vtexcommercestable.com.br',
        'http://sevenseven.vtexcommercestable.com.br',
        'http://www.patprimo.com',
        'http://www.sevenseven.com',
        'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop',
        'https://www.patprimo.com',
        'https://www.sevenseven.com',
        'http://patprimo.vtexcommercestable.com.br',
        'http://sevensevencolombia.vtexcommercestable.com.br',
        'http://localhost:4200',
        'http://200.93.168.196:4200',
        'http://sevensevencolombia.vtexlocal.com.br',
        'http://patprimo.vtexlocal.com.br',
        'http://www.sevenseven.com',


    ];
    var corsOptions = {
        origin: function(origin, callback){
            var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials:true
    }
    //here is the magic
    app.use(cors(corsOptions));

    app.options('/api', cors(corsOptions));



    app.route('/api/zendesk/patprimo')
        .post(apiZendesk.validate_data, cors(corsOptions)); //validate create data for product
    app.route('/api/zendesk/patprimo')
        .post(apiZendesk.patprimo, cors(corsOptions));
    app.route('/api/zendesk/sevenseven')
        .post(apiZendesk.validate_data, cors(corsOptions)); //validate create data for product
    app.route('/api/zendesk/sevenseven')
        .post(apiZendesk.sevenseven, cors(corsOptions));

    // for newsletter & Coupons
    app.route('/api/newsletter/patprimo')
        .post(apiNewsletter.validate_data, cors(corsOptions)); //validate create data for product
    app.route('/api/newsletter/patprimo')
        .post(apiNewsletter.patprimo, cors(corsOptions));
    app.route('/api/newsletter/sevenseven')
        .post(apiNewsletter.validate_data, cors(corsOptions)); //validate create data for product
    app.route('/api/newsletter/sevenseven')
        .post(apiNewsletter.sevenseven, cors(corsOptions));

    // endpoint para solicitar tipo de reembolso
    app.route('/api/refunds/:brand*')
        .get(apiRefunds.validate_data);
    app.route('/api/refunds/:brand*')
        .get(apiRefunds.users_data);

    app.route('/api/login/')
         .post(apiLogin.validate_data, cors(corsOptions));
    app.route('/api/login/')
        .post(apiLogin.authentication, cors(corsOptions));

    app.route('/api/sap/audit')
        .post(apiSap.validate_data, cors(corsOptions));
    app.route('/api/sap/audit')
        .post(apiSap.audit_sap, cors(corsOptions));
    app.route('/api/sap/upload/')
        .post(apiSap.sapFileUploader, cors(corsOptions));

    app.route('/api/vtex/getOrders')
        .post(apiVtex.getOrders, cors(corsOptions));
    app.route('/api/sap/process/')
        .post(apiSap.getSavedOrders, cors(corsOptions));


    app.use('/',site.configuration);
    /*begins  routes*/
    app.get('/', home.index);
};