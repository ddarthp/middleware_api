$(document).ready(function(e){
	
	requestProducts();
	$('.cart .cart-count').html(cart.countItems());

	//add functionality to sort buttons.
	$('#sorting-btns').on('click', 'button', function(e) {
		var element = $(this);
		if( element.hasClass('btn-warning') ) {
			element.removeClass('btn-warning');
		}else{
			$('#sorting-btns button').removeClass('btn-warning');
			element.addClass('btn-warning');
			var sortDirection = $('#sorting-direction-btns button.btn-warning').data('sort')
			var sortType = element.data('sorttype');
			var options = {
				'sortType': sortType,
				'sortDirection':sortDirection
			};
			if(sortDirection){
				requestProducts(options);	
			}
		}
	});

	// add functionality to order sort buttons
	$('#sorting-direction-btns').on('click', 'button', function(e) {
		var element = $(this);
		if( element.hasClass('btn-warning') ) {
			element.removeClass('btn-warning');
		}else{
			$('#sorting-direction-btns button').removeClass('btn-warning');
			element.addClass('btn-warning');

			var sortType = $('#sorting-btns button.btn-warning').data('sorttype')
			var sortDirection = element.data('sort');
			var options = {
				'sortType': sortType,
				'sortDirection':sortDirection
			}

			if(sortType){
				requestProducts(options);
			}
		}
	});

	// filter by subcategory
	$('#navbar-menu').on('click', '.subcat a', function(){
		var id = $(this).attr('data-id');
		var name = $(this).parent().attr('data-name');
		requestProducts({"categoryId":id, 'categoryName':name});
	});

	//creates the main menu categories and call createsSuMenu function to render submenus
	$.ajax({
	  url: '/data/categories',
	  complete: function(data) {
	    var data = data.responseJSON ;
	    $('#navbar-menu').html('');
	    $.each(data.categories,  function (k, category) {
	    		$('#navbar-menu').append('<li  class="dropdown category-nav" data-name="' + category.name + '" id="cat-' + category.id 
	    		+ '"><a data-id="'+category.id+'" data-name="'+category.name+'" href="#" class="dropdown-toggle" '+
	    		' data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" >'+category.name+'<span class="caret"></span></a></a></li>');
	    		var categoryElement = $('#cat-' + category.id);
	    		if(typeof category.sublevels != 'undefined') {
	    			createSubMenu(category.sublevels, categoryElement);
	    		} 
	    });
	  }
	});

	//shows the cart and his elements to buy
	$('.cart').click(function(){
		$(".panel-cart").animate({width:'toggle'},500);
		var cartItems = cart.getItems();
	    $(".panel-cart .content-cart").html('');
	    var grandTotal = 0;
	    for(var i in cartItems) {
	    	console.log(cartItems[i]);
	    	var totalItem = cartItems[i].otherprice * cartItems[i].quantity;
	    	grandTotal+=totalItem;
	    	var item = '<div class="item-cart">'+
					'<div class="item-name">' + cartItems[i].name + '</div>'+
					'<div class="item-info">'+
						'<div class="price" data-price="' + cartItems[i].otherprice + '">price: <span>' + 
						cartItems[i].price + '</span></div>'+
						'<div class="quantity">'+
							'<button class="minus" data-product="' + JSON.stringify(cartItems[i]).replace(/"/g,"'") +'"><span class="glyphicon glyphicon-minus"></span></button>'+
							'<input class="input-qty" type="text" readonly value="' + cartItems[i].quantity + '">'+
							'<button class="plus" data-product="' + JSON.stringify(cartItems[i]).replace(/"/g,"'") +'"><span class="glyphicon glyphicon-plus"></span></button>'+
						'</div>'+
					'</div>'+
					'<div class="item-total" data-itemtotal="'+totalItem+'">total item: <span>$ ' + totalItem +'</span></div>'+
				'</div>';

				$(".panel-cart .content-cart").append(item);
	    }
		$(".panel-cart .total span").html('$ '+ grandTotal);
	});
	$(document).click(function(event) { 
	    if(!$(event.target).closest('.panel-cart').length && !$(event.target).closest('.cart').length) {
	        if($('.panel-cart').is(":visible")) {
	            $(".panel-cart").animate({width:'toggle'},500);
	        }
	    }        
	})

	// adds or removes items quantity from cart
	$('.panel-cart').on('click', '.quantity button', function() {
		var product = JSON.parse($(this).data('product').replace(/'/g,'"'));
		var parent = $(this).parent().parent().parent();
		var cant = parent.find('.input-qty').val();
		var totalItem = parent.find('.price').data('price') * cant;
		console.log(parent);
		if($(this).hasClass('plus')) {
			cart.addItem(product);
			cant++;
			parent.find('.input-qty').val('cant');
		}
		if($(this).hasClass('minus')) {
			cart.removeItem(product);
			cant--;

		}
		if(cant <= 0) {
			parent.remove()
		}
		var totalItem = parent.find('.price').attr('data-price') * cant;
		parent.find('.item-total span').html('$ ' + totalItem );
		parent.find('.input-qty').val(cant);
		$(".panel-cart .total span").html('$ '+ cart.updateTotal());
		$('.cart .cart-count').html(cart.countItems());	
	});


	$('.panel-cart .buy button').on('click', function(e) {

		$('.bs-thanks-modal-sm').modal('show');
	});

	$('.bs-thanks-modal-sm').on('shown.bs.modal', function (e) {
	  cart.removeAll();
	  	$(".panel-cart .total span").html('$ '+ cart.updateTotal());
		$('.cart .cart-count').html(cart.countItems());	
		$(".panel-cart").animate({width:'toggle'},500);
	});

	


});



