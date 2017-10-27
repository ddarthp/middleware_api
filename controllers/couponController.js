'use strict';

exports.index = function (req, res) {
    //console.log(config)
    res.render('coupon/index', {
        'sectionName':'Cupones'
    });


}




exports.create = function (req, res) {


    res.render('coupon/edit', {
        'sectionName':'Cupones'
    });

}