(function(){
	'use strict';

  ModelError.$inject = ['$compile'];

  function ModelError($compile) {
    return {
      restrict: 'A',
			scope: false,
      require: '^?gumgaForm',
      link: (scope, elm, attrs, gumgaCtrl) => {
				// console.log(gumgaCtrl);

				if(!attrs.gumgaModelError){
					throw "gumgaModelError precisa de um objeto de configuração, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				let configuration = scope[attrs.gumgaModelError];

				if(!configuration.hasOwnProperty('ngModel')){
					throw "O Objeto de configuração precisa ter o atributo ngModel, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				if(!configuration.hasOwnProperty('options')){
					throw "O Objeto de configuração precisa ter o atributo options, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				//VALIDA QUANDO O TYPE FOR OBJETO
				const validateObject = (value,config) => {
						if(!config.hasOwnProperty('empty')){
							validateEmpty(value, config.empty, 'empty');
						}
						if(config.hasOwnProperty('fields')){
							validateFields(value, config.fields);
						}
						if(config){
							validateIsObject(value, config, 'type');
						}
				}

				scope.$on('$destroy', () => {
					gumgaCtrl.deleteErrosByInputName(configuration.ngModel);
				})

				//VALIDA QUANDO O TYPE FOR ARRAY
				const validateArray = (value,config) => {
						validateEmpty(value, config.empty, 'empty');

						if(config.hasOwnProperty('min') && value){
							validateMin(value.length, config.min, 'min');
						}

						if(config.hasOwnProperty('max') && value){
							validateMax(value.length, config.max, 'max');
						}

						if(config){
							validateIsArray(value, config, 'type');
						}

						if(config && config.childs){
							validateChilds(value, config.childs);
						}

				}

				const validateChilds = (value, childs) => {
						childs.forEach(child => {
								if(value)
									validateModel(value[child.position], child);
						});
				}

				const validateFields = (value, fields) => {
						fields.forEach(field => {
								let fieldValue = value ? value[field.name] : null;
								if(field.empty && typeof field.empty == 'object'){
									validateEmpty(fieldValue, field.empty, field.name + '-empty');
								}
								if(field.equal && typeof field.equal == 'object'){
									validateEqual(fieldValue, field.equal, field.name + '-equal');
								}
								if(field.contains && typeof field.contains == 'object'){
									validateContains(fieldValue, field.contains, field.name + '-contains');
								}
								if(field.max && typeof field.max == 'object'){
									validateMax(fieldValue, field.max, field.name + '-max');
								}
								if(field.min && typeof field.min == 'object'){
									validateMin(fieldValue, field.min, field.name + '-min');
								}
								if(field.regex && typeof field.regex == 'object'){
									validateRegex(fieldValue, field.regex, field.name + '-regex');
								}
						})
				}

				//CRIA ERRO SE FOR VAZIO
				const validateEmpty = (value, config, key) => {
						let isvalid = !((value == undefined || value == '' || value.length == 0) && !config.value);
						if(config && config.message)
							gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				//CRIA ERRO SE O VALOR NAO FOR IGUAL AO ESPERADO
				const validateEqual = (value, config, key) => {
					let isvalid = value == config.value;
					if(config && config.message)
						gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				//CRIA ERRO SE O VALOR NAO CONTER AO ESPERADO
				const validateContains = (value, config, key) => {
					let isvalid = value && value.indexOf(config.value) != -1;
					if(config && config.message){
						gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
					}
				}

				const validateRegex = (value, config, key) => {
					let isvalid = RegExp(config.value).test(value);
					gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				//CRIA ERRO SE O TIPO NÃO FOR OBJETO =
				const validateIsObject = (value, config, key) => {
						let isvalid = !(value !== Object(value));
						if(config && config.message)
							gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				const validateIsArray = (value, config, key) => {
						let isvalid = (Array.isArray(value));
						if(config && config.message)
							gumgaCtrl.updateFormErrors(configuration.ngModel, 'type', isvalid, config.message);
				}

				const validateMin = (value, config, key) => {
					let isvalid = !( (value < config.value));
					if(config && config.message)
						gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				const validateMax = (value, config, key) => {
					let isvalid = !(value > config.value);
					gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				}

				const validateModel = (value, config) => {
						switch (config.type.toLowerCase().trim()) {
							case 'object':
								validateObject(value, config);
								break;
							case 'array':
								validateArray(value, config);
								break;
						}
				}

				scope.$watch(configuration.ngModel, (value) => {
						validateModel(value, configuration.options);
						scope.$broadcast('form-changed');
				}, true);

      }
    }
  }
	angular.module('gumga.form.modelerror',[])
	.directive('gumgaModelError', ModelError);

})();
