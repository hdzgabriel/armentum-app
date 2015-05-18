(function() {
	'use strict';
	
	function RHEAsignacionesController ($scope, $routeParams, RHService, UtilService, ProyService, ROLES_CAT, ROL_NIVELES_CAT, EQUIPOS_TRABAJO_CAT) {
		var vm = this;
		
		vm.empleado = null;
		vm.asignaciones = {};
		vm.asignacionesOriginal = {};
		vm.proyectos = {}
		vm.tareas = {};
		vm.ROLES_CAT = ROLES_CAT; 
		vm.ROL_NIVELES_CAT = ROL_NIVELES_CAT;
		vm.EQUIPOS_TRABAJO_CAT = EQUIPOS_TRABAJO_CAT;
		
		vm.initEmpleado = initEmpleado;
		vm.getCurrentDate = getCurrentDate;
		
		function getCurrentDate() {
			return UtilService.getCurrentDate();
		}
		
		function initEmpleado () {
			var id = $routeParams.id;
			console.log('Looking for ' + id);
			RHService.EmpleadoSrc.get({id: id}, function(empleado) {
				vm.empleado = empleado;
				console.log(vm.empleado);
				getAsignaciones(vm.empleado.asignaciones);
			});
			console.log(vm.ROLES_CAT);
		};
		
		function getAsignaciones(asignaciones) {
			console.log('getAsignaciones');
			console.log(asignaciones);
			for (var a in asignaciones) {
				console.log('asignaciones['+a+'] = ' + asignaciones[a]);
				RHService.AsignacionSrc.get({id: asignaciones[a]}, function(asignacion) {
					console.log(asignacion);
					vm.asignacionesOriginal[asignacion._id] = asignacion;
					console.log('vm.asignaciones{'+a+'} = ' + asignacion);
					getProyecto (asignacion.proyecto);
					getTareas (asignacion.tarea);
					vm.asignaciones = angular.copy(vm.asignacionesOriginal);
				});
			}
		};
		
		function getProyecto (idp) {
			console.log('getProyecto');
			ProyService.ProyectoSrc.get({id: idp}, function(data) {
				vm.proyectos[data._id] = data;
				console.log(vm.proyectos);
			});
		};
		
		function getTareas (ts) {
			console.log('getTarea');
			for (var t in ts) {
				if (!vm.tareas[ts[t]]) {
					ProyService.TareaSrc.get({id: ts[t]}, function(data) {
						vm.tareas[data._id] = data;
					});
					console.log(vm.tareas);
				}
			}
		};
	};
	
	angular
		.module('armentum.rh')
		.controller('RHEAsignacionesCtrl', [
			'$scope',
			'$routeParams',
			'RHService',
			'UtilService',
			'ProyService',
			'ROLES_CAT', 
			'ROL_NIVELES_CAT', 
			'EQUIPOS_TRABAJO_CAT',
			RHEAsignacionesController
		]);
})();