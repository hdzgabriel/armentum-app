(function() {
	'use estrict';

	function RecursosHumanosService ($resource) {
		var vm = this;

		console.info ('RecursosHumanosService loaded');

		vm.EmpleadoSrc = $resource (
				'http://127.0.0.1:3000/armentum/api/empleados/:id',
				{id: '@id'},
				{put: {method: 'PUT', isArray: false}}
			);

		vm.RolSrc = $resource (
				'http://127.0.0.1:3000/armentum/api/roles/:id',
				{id: '@id'}
			);

		vm.RolNivelSrc = $resource (
				'http://127.0.0.1:3000/armentum/api/rolniveles/:id',
				{id: '@id'}
			);

		vm.EqsTrabajoSrc = $resource (
				'http://127.0.0.1:3000/armentum/api/equipostrabajo/:id',
				{id: '@id'}
			);

		vm.AsignacionSrc = $resource (
				'http://127.0.0.1:3000/armentum/api/asignaciones/:id',
				{id: '@id'}
			);

		return vm;

	};

	angular
		.module('armentum.rh')
		.factory('RHService', [
			'$resource',
			RecursosHumanosService
		]);
})();
