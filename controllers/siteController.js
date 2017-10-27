'use strict';
var _ = require ('underscore');
exports.configuration = function (req, res, next) {
	var app =  {
            'site': {
                'url': req.originalUrl
            }
        };
    mergeByProperty(config, app, 'site');
   next();

};


var mergeByProperty = function (arr1, arr2, prop) {
    _.each(arr2, function(arr2obj) {
        var arr1obj = _.find(arr1, function(arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });
         
        //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
         arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}

