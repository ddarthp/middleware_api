// Controller es un wrapper para hacer require a los settings especÃ­ficos por vista

define(function(require) {
	
	function Controller(path) {
		require(['Controller/' + path], function(Action) { /* Already triggered */ })
	}
	return Controller
})