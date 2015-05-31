(function() {
	'use strict'
	
	function ProyectoService ($resource) {
		'use strict';
		
		var vm = this;
	
		vm.ProyectoSrc = $resource (
			'http://127.0.0.1:3000/armentum/api/proyectos/:id', 
			{id: '@id'}
		);
			
		vm.TareaSrc = $resource (
			'http://127.0.0.1:3000/armentum/api/tareas/:id', 
			{id: '@id'}
		);
		
		vm.ProyectoLookup = $resource (
			'http://127.0.0.1:3000/armentum/api/proyectos',
			{key: '@key'},
			{lookup: {method: 'GET', isArray: true}}
		);
		
		return vm;
	
	};
	
	angular
		.module('armentum.proy')
		.factory('ProyService', [
			'$resource',
			ProyectoService
		]);
	
	angular
		.module('armentum.rh')
		.factory('ProyService', [
			'$resource',
			ProyectoService
		]);
	
})();