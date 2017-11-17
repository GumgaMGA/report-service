(function () {
	'use strict';

	Error.$inject = ['$compile', '$timeout', '$rootScope'];

	function Error($compile, $timeout, $rootScope) {
		return {
			restrict: 'A',
			scope: false,
			require: ['ngModel', '^?gumgaForm'],
			link: (scope, elm, attrs, controllers) => {
					scope[`${attrs.name.concat('errors')}`] = {};
				let nameOfInput = attrs.name,
					translationField = attrs.translationField,
					ngModel = controllers[0],
					gumgaCtrl = controllers[1],
					template = `<ol class="list-errors text-danger"><li ng-repeat="(key, value) in ${nameOfInput.concat('errors')}" ><label>{{ value }}</li></ol>`,
					err = scope[`${nameOfInput.concat('errors')}`];

				elm.scope().$watch(attrs.ngModel, (value) => {
					if(attrs.gumgaError){
						var result = elm.scope().$eval(attrs.gumgaError);
						if(result.error){
							err["gumgaerror"] = result.message;
						}else{
							(err['gumgaerror'] ? (delete err['gumgaerror']) : angular.noop);
						}
						var index = scope.$index || '';
						gumgaCtrl.updateFormErrors(attrs.name + index, 'gumgaerror', !result.error, result.message);
						ngModel.$setValidity(attrs.name + index, !result.error);
						$rootScope.$broadcast('form-changed');
					}
				})

				scope.$on(`${nameOfInput}-valid`, (ev, data) => {
					(err[data.validationType] ? (delete err[data.validationType]) : angular.noop);
				});

				scope.$on(`${nameOfInput}-invalid`, (ev, data) => {
					if (!err[data.validationType]) err[data.validationType] = data.message
				})

				elm.after($compile(template)(scope));

			}
		}
	}
	angular.module('gumga.form.error', [])
		.directive('gumgaError', Error);

})();
