(function(){
    'use strict';
    
    function UtilService () {
        var vm = this;
        
        vm.getCurrentDate = getCurrentDate;
        
        function getCurrentDate() {
            return new Date();
        };
    };
    
    angular
        .module('armentum')
        .service('UtilService', [
            UtilService
    ]);
    angular
    	.module('armentum.rh')
    	.service('UtilService', [
	    	UtilService
    	]);
    
})();