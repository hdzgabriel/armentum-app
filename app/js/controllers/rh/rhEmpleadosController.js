(function() {
	'use strict';
	
	function RecursosHumanosEmpleadosCtrl ($scope, $modal, $filter, $routeParams, $location, RHService, ROLES_CAT, ROL_NIVELES_CAT, EQUIPOS_TRABAJO_CAT) {
		var vm = this;

		vm.listEmpleados = null;
		vm.showListEmpleados = null;
		vm.empToolsIsOpen = false;
        vm.empleado = null;
        vm.empleadoEdit = null;
        vm.empEditable = false;
        vm.ROLES_CAT = ROLES_CAT;
        vm.ROL_NIVELES_CAT = ROL_NIVELES_CAT;
        vm.EQUIPOS_TRABAJO_CAT = EQUIPOS_TRABAJO_CAT;
        vm.asignaciones = {};

		vm.getEmpleadosList = getEmpleadosList;
		vm.showDeleteDialog = showDeleteDialog;
		vm.getEmpleado = getEmpleado;
        vm.allowEditEmpleado = allowEditEmpleado;
        vm.cancelEditEmpleado = cancelEditEmpleado;
        vm.getCurrentDate = getCurrentDate;
        
		var modalInstance = null;
		
		function getAsignaciones(asignaciones) {
			console.log('getAsignaciones');
			console.log(asignaciones);
			for (var a in asignaciones) {
				console.log('asignaciones['+a+'] = ' + asignaciones[a]);
				RHService.AsignacionSrc.get({id: asignaciones[a]}, function(asignacion) {
					console.log(asignacion);
					vm.asignaciones[asignacion._id] = asignacion;
					console.log(vm.asignaciones);
				});
			}
		};
        
        function getCurrentDate() {
            return new Date ();
        }
        
        function cancelEditEmpleado() {
            console.info('cancelEditEmpleado');
            vm.empleadoEdit = angular.copy(vm.empleado);
            vm.empEditable = !vm.empEditable;
            console.log('empEditable: '+vm.empEditable);
        }
        
        function allowEditEmpleado() {
            vm.empEditable = !vm.empEditable;
            console.log('empEditable: '+vm.empEditable);
        }
		
        function getEmpleado() {
	        console.log('getEmpleado');
            var id = $routeParams.id;
            console.log('Empleado id: '+id);
            RHService.EmpleadoSrc.get({id: id}, function(data){
                console.log('Query Executed');
                vm.empleado = data;
                console.log('Empleado: ');
                console.log(vm.empleado);
                vm.empleadoEdit = angular.copy(vm.empleado);
                console.log('EmpleadoEdit: ');
                console.log(vm.empleadoEdit);
                console.log(vm.empleado.asignaciones);
                getAsignaciones(vm.empleado.asignaciones);
            });
        };
        
		function getEmpleadosList () {
			console.log('rhController - listEmpleados');
			return RHService.EmpleadoSrc.query(function (data) {
				vm.listEmpleados = data;
				vm.showListEmpleados = [].concat(vm.listEmpleados);
				console.log('Query Executed');
			});
			
		};

		function showDeleteDialog(selectedEmp) {
			modalInstance = $modal.open({
				animation: false,
				templateUrl: 'modalDelete.html',
				controller: 'RecursosHumanosDeleteCtrl',
				controllerAs: 'rhemd',
				size: 'sm',
				resolve: {
					empleado: function(){return selectedEmp;}
				}
			});
			console.log(modalInstance);
			modalInstance.result
				.then (
					function(choise){
						console.log("Choise: " + choise);
						vm.confirmDelete = choise;
					}, 
					function () {
						console.log('Cancel');
					}
			);
		};
	};
	
	angular
		.module('armentum.rh')
		.controller('RecursosHumanosEmpleadosCtrl', [
			'$scope', 
			'$modal', 
			'$filter', 
            '$routeParams',
            '$location',
			'RHService',
			'ROLES_CAT',
			'ROL_NIVELES_CAT',
			'EQUIPOS_TRABAJO_CAT',
			RecursosHumanosEmpleadosCtrl
	]);
	
})();

// Controlador para el panel modal.
(function(){
	'use strict';
	
	function RecursosHumanosEmpleadosDeleteCtrl ($scope, $modalInstance, empleado) {
		var vm = this;
		console.log(empleado);
		
		vm.empleado = empleado;
		vm.closeDeleteDialog = function(c) {		
			c ? $modalInstance.close(c) : $modalInstance.dismiss('cancelled');
		};
	};
	
	angular
		.module('armentum.rh')
		.controller('RecursosHumanosEmpleadosDeleteCtrl',[
			'$scope',
			'$modalInstance',
			'empleado',
			RecursosHumanosEmpleadosDeleteCtrl
	]);
})();