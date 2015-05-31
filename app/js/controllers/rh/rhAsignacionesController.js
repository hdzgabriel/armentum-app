(function() {
	'use strict';

	function RHEAsignacionesController ($scope, $routeParams, $modal, $route, RHService, UtilService, ProyService, ROLES_CAT, ROL_NIVELES_CAT, EQUIPOS_TRABAJO_CAT) {
		var vm = this;

		vm.empleado = null;
		vm.asignaciones = {};
		vm.asignacionesOriginal = {};
		vm.proyectos = {}
		vm.tareas = {};
		vm.ROLES_CAT = ROLES_CAT;
		vm.ROL_NIVELES_CAT = ROL_NIVELES_CAT;
		vm.EQUIPOS_TRABAJO_CAT = EQUIPOS_TRABAJO_CAT;
		vm.AsignacionesEditable = {};
		vm.nuevaAsigacion = {};

		vm.initEmpleado = initEmpleado;
		vm.getCurrentDate = getCurrentDate;
		vm.allowEditAsignacion = allowEditAsignacion;
		vm.cancelEditAsignacion = cancelEditAsignacion;
		vm.showNewDialog = showNewDialog;

		function showNewDialog() {
			console.log('showNewDialog');
			var asignacion = null;
			var empleado_id = vm.empleado._id;
			var modalInstance = $modal.open({
				animation: false,
				templateUrl: 'modalNewAsignacion.html',
				controller: 'RHEAsignacionNuevaCtrl',
				controllerAs: 'rhean',
				//size: 'lg',
				resolve: {
					empleado: function (){
						return vm.empleado;
					}
				}
			});
			console.log('modalInstance');
			console.log(modalInstance);

			modalInstance.result
				.then (
					function (nuevaAsignacion) {
						console.log('nuevaAsignacion');
						console.log(nuevaAsignacion);
						console.log('____________NUEVA____________');
						console.log(nuevaAsignacion);
						console.log('_____________________________');
						console.log('Guardando asignación');
						var ResourceAsignacion = new RHService.AsignacionSrc();
						ResourceAsignacion.fecha_ini = nuevaAsignacion.fecha_ini;
						ResourceAsignacion.fecha_fin = nuevaAsignacion.fecha_fin;
						ResourceAsignacion.rol_id = nuevaAsignacion.rol_id;
						ResourceAsignacion.rol_nivel = nuevaAsignacion.rol_nivel;
						ResourceAsignacion.equipo_trabajo = nuevaAsignacion.equipo_trabajo;
						ResourceAsignacion.proyecto = nuevaAsignacion.proyecto;
						ResourceAsignacion.comentarios = nuevaAsignacion.comentarios;
						ResourceAsignacion.tecs = nuevaAsignacion.tecs;
						ResourceAsignacion.tarea = nuevaAsignacion.tarea;
						console.log("_______ASIGNACION_RESOURCE_________");
						console.log(ResourceAsignacion);
						ResourceAsignacion.$save(function(doc) {
							console.log("********* INTERNO *********");
							console.log(doc);
							console.log("_______ASIGNACION_GUARDADA_________");
							console.log(doc);
							console.log('ResourceAsignacion._id: ' + doc._id);
							vm.empleado.asignaciones.push(doc._id);
							console.log(vm.empleado);
							vm.empleado.$put({id: vm.empleado._id}, function(emp) {
								console.log("EMPLEADO GUARDADO");
								console.log(emp);
								//vm.empleado = emp;
								$route.reload();

							}, function (err) {
								console.log("ERROR GUARDANDO EMPLEADO!!!");
							});
							console.log("***************************");
						}, function (err) {
							console.log("********** ERROR **********");
							console.log(err);
						});


					},
					function () {
						console.log('____________CANCEL____________');
					}
				)
		};

		function updateEmpleado () {
			if (empleado) {
				empleado.$save();
			}
		}

		function cancelEditAsignacion(aid) {
			console.log('cancelEditAsignacion');
			vm.asignaciones[aid] = vm.asignacionesOriginal[aid];
		};

		function allowEditAsignacion(aid) {
			console.log('allowEditAsignacion');
			vm.asignaciones[aid].editable = true;
		};

		function getCurrentDate() {
			return UtilService.getCurrentDate();
		};

		function initEmpleado () {
			console.log('initEmpleado');
			console.log('$routeParams.id: ' + $routeParams.id);
			var id = $routeParams.id;
			console.log('Looking for ' + id);
			RHService.EmpleadoSrc.get({id: id}, function(empleado) {
				vm.empleado = empleado;
				console.log(vm.empleado);
				getAsignaciones(vm.empleado.asignaciones);
				console.log('-------ROLES_CAT--------');
				console.log(vm.ROLES_CAT);
				console.log('------------------------');
				console.log('-------PROYECTOS--------');
				console.log(vm.proyectos);
				console.log('------------------------');
			}, function () {
				console.log('ERROR DE ALGO');
			});

		};

		function getAsignaciones(asignaciones) {
			console.log('getAsignaciones');
			console.log(asignaciones);
			for (var a in asignaciones) {
				console.log('asignaciones['+a+'] = ' + asignaciones[a]);
				RHService.AsignacionSrc.get({id: asignaciones[a]}, function(asignacion) {
					console.log(asignacion);
					vm.asignacionesOriginal[asignacion._id] = asignacion;
					vm.asignacionesOriginal[asignacion._id].editable = false;
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
			'$modal',
			'$route',
			'RHService',
			'UtilService',
			'ProyService',
			'ROLES_CAT',
			'ROL_NIVELES_CAT',
			'EQUIPOS_TRABAJO_CAT',
			RHEAsignacionesController
		]);
})();

(function() {
	'use strict'

	function RHEANuevaController($scope, $modalInstance, $dateParser, RHService, ProyService, ROLES_CAT, ROL_NIVELES_CAT, EQUIPOS_TRABAJO_CAT, TAREAS, empleado) {
		console.log('RHEANuevaController');
		var vm = this;
		console.log(empleado);

		vm.asignacion = {};
		vm.ROLES_CAT = ROLES_CAT;
		vm.ROL_NIVELES_CAT = ROL_NIVELES_CAT;
		vm.EQUIPOS_TRABAJO_CAT = EQUIPOS_TRABAJO_CAT;
		vm.isIniOpen = false;
		vm.isFinOpen = false;
		vm.loading = false;
		vm.selectedProject = undefined;
		vm.TAREAS = null;
		vm.selectedTareas = [];

		vm.closeOK = closeOK;
		vm.closeCancel = closeCancel;
		vm.dpIniOpen = dpIniOpen;
		vm.dpFinOpen = dpFinOpen;
		vm.dateDisabled = dateDisabled;
		vm.dpOpen = dpOpen;
		vm.getLookProyectosByKey = getLookProyectosByKey;
		vm.setProyectoValue = setProyectoValue;

		ProyService.TareaSrc.query(function(data) {
			console.log('quering tareas');
			vm.TAREAS = data;
			console.log(vm.TAREAS);
		});

		function setProyectoValue () {
			console.log('setProyectoValue');
		}

		function getLookProyectosByKey (key) {
			console.log('getLookProyectosByKey');
			console.log('key: ' + key);
			var p = ProyService.ProyectoLookup.lookup({key: key}).$promise;
			p.then(function(response) {
				console.log('PROMISE');
				console.log(response);
				console.log(response.data);
				//return response.map(function(item) {
				//	return item.proyecto
				//});
				return response;
			});
			console.log(p);
			return p;
		};

		function dpOpen (event, iptObject, flag) {
			console.log('dpOpen');
			console.log(event);
			console.log(iptObject);
			console.log(flag);

			event.preventDefault();
			event.stopPropagation();

			vm[flag] = true;

			iptObject.$setTouched();

		};

		function dpIniOpen (event, iptObject) {
			console.log('dpIniOrigen');
			console.log(event);
			console.log(iptObject);

			event.preventDefault();
			event.stopPropagation();

			vm.isIniOpen = true;

			iptObject.$setTouched();

		};

		function dpFinOpen (event) {
			event.preventDefault();
			event.stopPropagation();

			vm.isFinOpen = true;
		};

		function dateDisabled (date, mode) {
			//console.log('dateDisabled');
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};

		function closeOK (valid) {
			console.log('closeOK');
			if (valid) {
				//Asignacion de proyectos
				vm.asignacion.proyecto = vm.selectedProject._id;
				//asignación de tareas
				vm.asignacion.tarea = [];
				console.log('SELECTEDTAREAS');
				console.log(vm.selectedTareas);
				console.log("______ASIGNA TAREAS______");
				angular.forEach(vm.selectedTareas, function(tarea) {
					console.log(tarea);
					vm.asignacion.tarea.push(tarea._id);
				});
				console.log("___ASIGNACION_TAREAS___");
				console.log(vm.asignacion.tarea);
				console.log("___________________");
				$modalInstance.close(vm.asignacion);
			} else {
				console.log('INVALID');
			}
		};

		function closeCancel () {
			$modalInstance.dismiss('cancel');
		}

	};

	angular
		.module('armentum.rh')
		.controller( 'RHEAsignacionNuevaCtrl', [
			'$scope',
			'$modalInstance',
			'dateParser',
			'RHService',
			'ProyService',
			'ROLES_CAT',
			'ROL_NIVELES_CAT',
			'EQUIPOS_TRABAJO_CAT',
			'TAREAS',
			'empleado',
			RHEANuevaController
		]);
})();
