(function () {
	'use strict';
	Form.$inject = [];

	function Form() {
		return {
			restrict: 'A',
			scope: false,
			priority: 501,
			require: 'form',
			transclude: false,
			controller: ['$scope', '$element', '$attrs', '$timeout', '$rootScope', function ($scope, $element, $attrs, $timeout, $rootScope) {
				let ctrl = this;

				ctrl.form = $element;
				ctrl.scope = $scope;

				window.gumgaForms = window.gumgaForms || [];

				window.gumgaForms.push({
					element: $element,
					scope: ctrl
				});

				const defaultMessages = {
					maxdate: 'A data especificada no campo {0} não deve ultrapassar o limite de: {1}.',
					maxlength: 'O texto especificado no campo {0} não deve ultrapassar o limite de: {1}.',
					maxnumber: 'O número especificado no campo {0} não deve ultrapassar o limite de: {1}.',
					mindate: 'A data especificada no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					minlength: 'O texto especificado no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					minnumber: 'O número especificado no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					pattern: 'O texto especificado no campo {0} deve estar dentro do padrão: {1}.',
					rangedate: 'A data especificada no campo {0} deve estar dentro do intervalo: {1}.',
					rangenumber: 'O número especificado no campo {0} deve estar dentro do intervalo: {1}.',
					validatetype: 'O valor digitado no campo {0} deve ser do tipo: {1}',
					required: 'O campo {0} é obrigatório.'
				};

				ctrl.customMessage = {};
				ctrl.formErrors = {};
				ctrl.changeInputMessage = changeInputMessage;
				ctrl.changeStateOfInput = changeStateOfInput;
				ctrl.getDefaultMessages = getDefaultMessages;
				ctrl.getFormErrors = getFormErrors;
				ctrl.getFormName = getFormName;
				ctrl.setFormValidity = setFormValidity;
				ctrl.updateFormErrors = updateFormErrors;
				ctrl.deleteErrosByInputName = deleteErrosByInputName;

				$scope.$on('$destroy', function () {
					window.gumgaForms = ($rootScope.gumgaForms || []).filter(function (form) {
						return form.$scope.$id != $scope.$id;
					});
				});

				ctrl.updateErrorsModel = () => $scope.$broadcast('form-changed');

				function changeInputMessage(inputName, obj) {
					if (!inputName) throw 'É necessário passar o nome do input [changeInputMessage(inputName, messages)]';
					if (!obj) throw 'É necessário passar um objeto com as mensagens [changeInputMessage(inputName, messages)]';
					let isMessagesRight = Object.keys(obj).filter(key => !defaultMessages[key]),
						moreThanOne = isMessagesRight.length > 1;
					if (isMessagesRight.length > 0) {
						throw `${moreThanOne ? 'Os' : 'O'} ${moreThanOne ? 'tipos' : 'tipo'} de validação ${moreThanOne ? isMessagesRight.join(',') : isMessagesRight} não ${moreThanOne ? 'existem' : 'existe'}.`
					}
					ctrl.customMessage[inputName] = obj;
					return this;
				}

				function changeStateOfInput(inputName, validationType, inputIsValid, value, field, customMessage) {
					field = field || inputName;
					if (!inputName) throw 'É necessário passar um valor válido como primeiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (!validationType) throw 'É necessário passar um valor válido como segundo parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (inputIsValid !== true && inputIsValid !== false) throw 'É necessário passar um booleano como terceiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';

					let custom = ctrl.customMessage[inputName] ? ctrl.customMessage[inputName] : {},
						auxString = (custom[validationType] ? custom[validationType] : defaultMessages[validationType]),
						message = auxString.replace('{0}', field).replace('{1}', validationType.indexOf('range') != -1 ? ('mínimo de ' + value[0] + ' e máximo de ' + value[1]) : value),
						objectSentToGumgaError;

					objectSentToGumgaError = (!inputIsValid) ? { message, validationType } : { validationType }
					this.updateFormErrors(inputName, validationType, inputIsValid, customMessage || message);

					$scope.$broadcast('form-changed');
					if (customMessage) objectSentToGumgaError.message = customMessage;
					$scope.$broadcast(`${inputName}-${inputIsValid ? '' : 'in'}valid`, objectSentToGumgaError);

					return this;
				}

				function getDefaultMessages() {
					return angular.copy(defaultMessages);
				}

				function getFormErrors() {
					return angular.copy(ctrl.formErrors);
				}

				function getFormName() {
					return $attrs.name;
				}

				function updateFormErrors(inputName, validationType, isValid, message) {
					let errs = ctrl.formErrors;
					if (errs[inputName] && errs[inputName][validationType] && isValid === true) {
						delete errs[inputName][validationType];
						return this;
					}

					if (errs[inputName] && errs[inputName][validationType]) return this;

					if (!ctrl.formErrors[inputName]) ctrl.formErrors[inputName] = {};

					if (!isValid) {
						ctrl.formErrors[inputName][validationType] = message;
					}

					return this;
				}

				function deleteErrosByInputName(inputName) {
					delete ctrl.formErrors[inputName];
				}

				function setFormValidity(boolean = true) {
					$timeout(() => {
						let errors = $scope[$attrs.name].$error,

							toExclude = [];
						Object.keys(errors)
							.forEach(value => errors[value].forEach((x, idx) => {
								toExclude.push(x);
								if (idx == errors[value].length - 1) {
									toExclude.forEach(x => x.$setValidity(value, boolean));
									toExclude = [];
								}
							}));
						return this;
					});
				}
			}]
		}
	}
	angular.module('gumga.form.form', [])
		.directive('gumgaForm', Form);
})();
