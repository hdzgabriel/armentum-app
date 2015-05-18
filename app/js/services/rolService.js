(function() {
	'use strict';
	
	function RolService ($resource) {
		
		console.info('Rol Service Loaded');
		
		return $resource (
			'http://127.0.0.1:3000/armentum/api/empleados/:id',
			{id: '@id'}
		);
	};
	
	angular
		.module('armentum.rh')
		.factory('RolService', [
			'$resource',
			RolService
		]);
		
})();