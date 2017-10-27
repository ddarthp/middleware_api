/*
 * Site logic for Appfactory 
 */


require.config({
//    baseUrl: 'js/lib',
    
   
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
	"datatablesjs" : { "deps" :['jquery'] },
	"autocomplete" : { "deps" :['jquery'] },
	"minicolors" : { "deps" :['jquery'] },
	"datatables" : { "deps" :['datatablesjs'] }
    },
    paths: {

         'jquery': 'libs/jquery',
	 'bootstrap': 'libs/bootstrap.min',
	 'datatablesjs': 'libs/jquery.dataTables.min',
	 'datatables':'libs/dataTables.bootstrap',
	 'autocomplete':'libs/jquery.autocomplete',
	 'minicolors':'libs/jquery.minicolors.min'
	 
    },

});



require(['Controller', 'jquery'],
	function (Controller, $, datatable, bootstrap, minicolors) {
	    
	
	
	window.onbeforeunload = null;

	// Hace bind a las acciones que se usan en el header
	//Controller('Header');

	/***************************
	*	 Controller Specific   *
	****************************/

	// Acciones que se realizar basados en el controller
	// y la acciÃ³n actual. E.g: menÃº, carrito, home

	var controller = app.site.url.split('/').filter(function (val){ return (val.trim() != "")? true : false})[0];

	console.log(controller);

	Controller('MainController');
	switch(controller) {
		case 'coupons':
			Controller('CouponsController');

			
		break;
		case 'packages':
			Controller('Packages')
		    break;
		case 'usuarios':
			Controller('UsersController');
		    break;

	}
	
	
	// side menu mark as active
	$(function(){
	    var nav = $('#main_menu').children('li');
	   
	    $.each(nav,function(k,v){
	       var link = $(v).children('a').attr('href');
	      
	       if(link.indexOf(app.controller) !=-1){
		   $(v).addClass('active');
	       }
	    });

	});

});