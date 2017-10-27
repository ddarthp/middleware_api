'use strict';


exports.products = function (req, res) {
    var category_id = req.params['categoryId'];
    var output = '',
        fs = require('fs'),
        path = require('path'),      
        databasePath = path.join(path.resolve(), 'database/');
    var products =  JSON.parse(fs.readFileSync( databasePath + 'products.json', 'utf8'));
    var categories =  JSON.parse(fs.readFileSync( databasePath + 'categories.json', 'utf8'));
    var filterProducts = [];
    var maxPrice = 0;

    for (var i in products) {
        if(products[i].available == true){
            products[i]['otherprice'] = parseInt(products[i].price.replace(/[^0-9\.]+/g,""));
            var productCategory = getCategory(categories, products[i].sublevel_id);
            products[i]['categoryname'] = productCategory.name;
            filterProducts.push(products[i]);
            if(parseInt(products[i].price.replace(/[^0-9\.]+/g,"")) > maxPrice){
                maxPrice = parseInt(products[i].price.replace(/[^0-9\.]+/g,""));
            }
        }
    }
    var sort=null;
    if(req.query.sort){
        sort = req.query.sort;
        console.log(sort);
        filterProducts = sortData(filterProducts, sort);
    }

    res.json({
        products: filterProducts,
        maxprice: maxPrice,
        sort: sort
    });

}





exports.productsbycat = function (req,res) {

    var category_id = req.params['categoryId'];
    var output = '',
        fs = require('fs'),
        path = require('path'),      
        databasePath = path.join(path.resolve(), 'database/');
    var products =  JSON.parse(fs.readFileSync( databasePath + 'products.json', 'utf8'));
    var categories =  JSON.parse(fs.readFileSync( databasePath + 'categories.json', 'utf8'));
    var filterProducts = [];
    var maxPrice = 0;

    for (var i in products) {
        if(products[i].sublevel_id == category_id && products[i].available == true){
            products[i]['otherprice'] = parseInt(products[i].price.replace(/[^0-9\.]+/g,""));
            var productCategory = getCategory(categories, products[i].sublevel_id);
            products[i]['categoryname'] = productCategory.name;
            filterProducts.push(products[i]);
            if(parseInt(products[i].price.replace(/[^0-9\.]+/g,"")) > maxPrice){
                maxPrice = parseInt(products[i].price.replace(/[^0-9\.]+/g,""));
            }
        }
    }

    var sort=null;
    if(req.query.sort){
        sort = req.query.sort;
        filterProducts = sortData(filterProducts, sort);
    }

    res.json({
        products: filterProducts,
        maxprice: maxPrice,
        sort: sort
    });

};

var sortData = function (array, sort_str) {
    var sort = sort_str.split('|');
    var keysort = 'name'

    if(sort[1] == 'desc') {
        keysort = '-'+keysort;
    }
    
    var sorted_products = array.sort(dynamicSort(keysort));
    return sorted_products;

}

var dynamicSort = function (property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

var getCategory = function (categories, id) {   
    if (categories) {
        for (var i in categories) {
            if (typeof categories[i].id != 'undefined' && categories[i].id == id) {
                return categories[i];
            }
            var found = getCategory(categories[i].sublevels, id);
            if (found) return found;
        }
    }
};