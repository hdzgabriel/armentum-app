(function() {
	'use strict'
	
	function configDatePicker (datepickerConfig, datepickerPopupConfig) {
		console.log('datepickerConfig');
		
		//Datepicker Settings
		angular.extend(datepickerConfig, {
			datepickerMode: 'day',
			minDate: null,
			maxDate: null,
			dateDisabled: null,
			customClass: null,
			showWeeks: false,
			startingDay: 0,
			initDate: new Date (),
			minMode: 'day',
			maxMode: 'day',
			formatDay: 'dd',
			formatMonth: 'MMMM',
			formatYear: 'yyyy',
			formatDayHeader: 'EEE',
			formatDayTitle: 'MMMM yyyy',
			formatMonthTitle: 'yyyy',
			yearRange: 5,
			shortcutPropagation: false
		});
		console.log(datepickerConfig);
		
		//Popup Settings
		angular.extend(datepickerPopupConfig, {
			datepickerPopup: 'dd-MMM-yyyy',
			showButtonBar: false,
			currentText: "HOY",
			clearText: "LIMPIAR",
			closeText: "LISTO",
			closeOnDateSelection: true,
			appendToBody: false
		});
		console.log(datepickerPopupConfig);
	};
	
	function customClass (date, mode) {
		console.log('customClass');
	};
	
	angular
		.module('armentum.rh')
		.value('ROLES_CAT', {})
		.value('ROL_NIVELES_CAT', {})
		.value('EQUIPOS_TRABAJO_CAT', {})
		.value('TAREAS', {})
		.config(['datepickerConfig', 'datepickerPopupConfig', configDatePicker]);
		
})();