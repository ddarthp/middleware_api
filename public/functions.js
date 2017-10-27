var urlParams = {
	'host': function () {
		var urlSplit = document.URL.split('#');
		return urlSplit[0];
	},
	'params':function() {
		if(document.URL.indexOf('#') == -1){
			return null;
		}
		var urlSplit = document.URL.split('#');
		if(typeof urlSplit[1] != 'undefined' ){
			urlSplit = urlSplit[1].split('?');	
		}else{
			urlSplit = urlSplit[0].split('?');
		}
		
		var paramsArray = urlSplit[0].split('/');
		return paramsArray.filter(function(key) { return key !=''});
	}, 
	'query': function () {
		var url = document.URL;
		if(url.indexOf('?') == -1){
			return null;
		}
		var request = {};
	    var pairs = url.substring(url.indexOf('?') + 1).split('&');
	    for (var i = 0; i < pairs.length; i++) {
	        if(!pairs[i])
	            continue;
	        var pair = pairs[i].split('=');
	        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	     }
	     return request;
	},
	push: function (params, query) {
		var parameters = params.filter(function(key) { return key != null});
		return window.history.pushState('','','#/'+parameters.join('/'));
	}
};

// process operations cart info saved in local storage 
var cart = {
	addItem: function (product) {
		if( localStorage.getItem('cart') == null){
    		localStorage.setItem('cart', '{}');
    	}
    	
    	var cart = JSON.parse(localStorage.getItem('cart'));
    	console.log(cart);
    	if(typeof cart[product.id] != "undefined"){
    		cart[product.id].quantity++;
    	}else{
    		cart[product.id] = product;
    	}
    	console.log(JSON.stringify(cart));
    	localStorage.removeItem('cart');
    	localStorage.setItem('cart', JSON.stringify(cart));
	},
	removeItem: function (product) {
		var cart = JSON.parse(localStorage.getItem('cart'));
    	console.log(cart);
    	if(typeof cart[product.id] != "undefined"){
    		cart[product.id].quantity--;
    		if(cart[product.id].quantity == 0){
    			delete cart[product.id];
    		}
    	}

    	localStorage.removeItem('cart');
    	localStorage.setItem('cart', JSON.stringify(cart));
	},
	getItems: function (){
		var cart = JSON.parse(localStorage.getItem('cart'));
		return cart;
	},
	updateTotal: function () {
		var cartItems = JSON.parse(localStorage.getItem('cart'));
		var grandTotal = 0;
		for(var i in cartItems) {
	    	console.log(cartItems[i]);
	    	var totalItem = cartItems[i].otherprice * cartItems[i].quantity;
	    	grandTotal+=totalItem;
	    }
	    return grandTotal;
	},
	countItems: function () {
		var cartItems = JSON.parse(localStorage.getItem('cart'));
		count = 0;
		for(var i in cartItems){
			count++;
		}
		return count;
	},
	removeAll: function() {
		localStorage.removeItem('cart');
		return true;
	}

}

var requestProducts = function(options){
	var params = urlParams.params();
	var id = null;
	var name = null;
	if(params){
		if(params[0]){
			id = params[0];
		}

		if(params[1]){
			name = params[1];
		}	
	}
	
	var opt = {
		'categoryId':id,
		'sortType': 'a-z',
		'categoryName':name,
		'sortDirection':'asc',
		'priceRange': [0, 0]
	};
	$.extend( opt, options );

	var parameters = [opt.categoryId, opt.categoryName];
	$('#sorting-direction-btns button').removeClass('btn-warning');
	$('#sorting-btns button').removeClass('btn-warning');
	$('#sorting-direction-btns button#'+opt.sortDirection).addClass('btn-warning');
	$('#sorting-btns button#'+opt.sortType).addClass('btn-warning');
	
	var url = '/data/products/';
	if(opt.categoryId){
		url += opt.categoryId;
	}
	
	if(opt.sortType && opt.sortDirection){
		url += '?sort=' + opt.sortType+ '|' + opt.sortDirection;
	}
	    		
	$.ajax({
	  url: url,
	  complete: function(data) {

	    var data = data.responseJSON ;
	    $('#content').html('');
	   
	    $.each(data.products,  function (k, product) {
	    	var product_data = {
	    		'name': product.name,
	    		'quantity': 1,
	    		'id':product.id,
	    		'price':product.price,
	    		'otherprice':product.otherprice
	    	};

	    	var productHtml = '<div data-price="' + product.otherprice +'" data-name="' + product.name +'" data-category="' +
	    	 product.categoryname +'" data-info="' + JSON.stringify(product_data).replace(/"/g,"'") 
	    	+'" class="product col-xs-5 col-md-4 col-lg-4">'
			+'<div class="product-img">'
			+'<img src="http://placehold.it/200x200" title="image" alt="">'
			+'</div>'
			+'<div class="product-info">'
			+'<h4 class="name">' + product.name +'</h4>'
			+'<span class="price"> ' + product.price +' </span>'
			+'<h5 class="available">Available <span>(' + product.quantity +')</span></h5>'
			+'</div>'
			+'<div class="clearfix"></div>'
			+'</div>';

			$('#content').append(productHtml);
	    });

	   
	    $( "#slider-range" ).slider({
	      range: true,
	      min: 0,
	      max: data.maxprice,
	      values: [ 0, data.maxprice ],
	      slide: function( event, ui ) {
	        $( "#amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );

	        $.each($('#content').children(), function(k, product) {
	        	var product = $(product);
	        	if(product.attr('data-price') >= ui.values[ 0 ] 
	        		&&  product.attr('data-price') <= ui.values[ 1 ] ){
        			product.show();
	        	}else{
	        		product.hide();
	        	}
	        } );
	      }
	    });

	    $('#searchbox').on('keyup', function (e) {
	    	var searchStr = $(this).val().toLowerCase();
				$.each($('#content').children(), function(k, product) {
		        	var product = $(product);
		        	if(searchStr != '' && searchbox != null){
		        		if(product.attr('data-name').toLowerCase().indexOf(searchStr) != -1 
		        		|| product.attr('data-category').toLowerCase().indexOf(searchStr) != -1 ){
		        			product.show();
			        	}else{
			        		product.hide();
			        	}	
		        	}else{
		        		product.show();
		        	}
		        } );	    			
	    });

	    $( "#amount" ).html( "$" + $( "#slider-range" ).slider( "values", 0 ) +
	      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
			

		//add functionality to click subcategory menus    
    	$('#navbar-menu').on('click', 'li.subcat', function(e) {
    		e.stopPropagation();
    		var elHasClass = $(this).hasClass('open')
    		if( elHasClass ) {
    			$(this).removeClass('open');
    		}else{
    			$(this).addClass('open');
    		}
    		
    	});
    	$('#navbar-menu').on('click', 'li.nosub', function(e){
			$('.subcat, .category-nav').removeClass('open');
    	});
		    
		//add functionality to product clic add to cart
	    $('#content').on('click', '.product', function (e) {
	    	var product = JSON.parse($(this).data('info').replace(/'/g,'"'));
			cart.addItem(product);
	    	$('.cart .cart-count').html(cart.countItems());
	    });
	    urlParams.push(parameters, null);
	  }
	});

}



var createSubMenu = function (data, parent) {
	$.each(data,function (k, subcat) {

			if(parent.find('ul').length == 0) {
				parent.append('<ul class="dropdown-menu subcat"></ul>');
			}
			
			if(typeof subcat.sublevels != 'undefined') {
				parent.find('ul').append('<li class="subcat dropdown-' + subcat.id +'"  id="subcat-' + subcat.id + '" data-name="' 
					+subcat.name+ '"><a data-id="'+subcat.id+'" href="#" class="dropdown-toggle" '
					+' data-toggle="dropdown-' + subcat.id +'" role="" aria-haspopup="true" aria-expanded="false">'
					+subcat.name+ '<span class="caret"></span></a> </li>');
				var newParent = $('#subcat-'+ subcat.id);
				createSubMenu(subcat.sublevels, newParent);	
			}else{
				if ($('#subcat-' + subcat.id).length == 0) {
					parent.find('ul').append('<li class="nosub" id="subcat-' + subcat.id + '" data-name="' +subcat.name+ '"><a data-id="'+subcat.id+'" href="#">'+subcat.name+'</a></li>');	
				}	
			}
	});
	}



