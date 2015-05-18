(function() {
    'use strict';
    
    function RecursosHumanosCtrl ($scope, RHService, ROLES_CAT, ROL_NIVELES_CAT, EQUIPOS_TRABAJO_CAT) {
        var vm = this;
        
        vm.empleados_count = 0;
		vm.consultoras_count = 0;
		
		RHService.RolSrc.query(function(data){
			for (var i in data ){
				if (!isNaN(i)){
					ROLES_CAT[data[i]._id] = data[i].rol;
				}
			}

			console.log('ROLES_CAT');
			for (var i in ROLES_CAT) {
				console.log('ROLES_CAT['+i+'] = ' + ROLES_CAT[i]);
			}
		});
		
		RHService.RolNivelSrc.query(function(data){
			for(var i in data) {
				if(!isNaN(i)){
					ROL_NIVELES_CAT[data[i]._id] = data[i].nivel;
				}
			}
			console.log('ROL_NIVELES_CAT');
			for (var i in ROL_NIVELES_CAT) {
				console.log('ROL_NIVELES_CAT['+i+'] = ' + ROL_NIVELES_CAT[i]);
			}
		});
		
		RHService.EqsTrabajoSrc.query(function(data){
			formatCatalog(EQUIPOS_TRABAJO_CAT, data, 'equipo');
		});
		
		function formatCatalog (catalog, elements, name) {
			for(var e in elements) {
				if (!isNaN(e)) {
					catalog[elements[e]._id] = eval('elements[e].'+name);
					console.log(catalog[e]);
				}
			}
		};
		
        console.info('RecursosHumanosController loaded');
    };
    
    angular
        .module('armentum.rh')
        .controller ('RecursosHumanosCtrl', [
            '$scope',
			'RHService',
			'ROLES_CAT',
			'ROL_NIVELES_CAT',
			'EQUIPOS_TRABAJO_CAT',
            RecursosHumanosCtrl
        ]);
		
})();