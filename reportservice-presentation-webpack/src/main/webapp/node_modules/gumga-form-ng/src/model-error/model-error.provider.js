let Provider = () => {

  const GumgaModelInstance = function (scope, model, formElement) {
      let conditions = [];

      this.condition = (_condition, _message) => {
        conditions.push({
          condition: _condition,
          message: _message,
          evals: {}
        });
        return this;
      }

      const getFormCtrl = () => {
        if(!window.gumgaForms) return;
        let forms = gumgaForms.filter(form => {
          return angular.element(form.element)[0] === angular.element(formElement)[0];
        })
        if(forms && forms[0]) return forms[0].scope;
      }

      const analyze = (value, indexValue) => {
        conditions.forEach(condition => {
          condition.evals[indexValue] = false;
          if(!condition.condition.startsWith(model)){
              condition.evals[indexValue] = scope.$eval(condition.condition, value);
          }else{
              condition.evals[indexValue] = scope.$eval(condition.condition);
          }
        });

        conditions.forEach(condition => {
          let error = Object.keys(condition.evals)
            .map(key => condition.evals[key])
            .filter(evalResult => evalResult).length > 0;

          let formScope = getFormCtrl();

          if(!formScope){
            throw "Não identificamos o seu gumga-form."
          }

          formScope.updateFormErrors(condition.condition, 'gumgamodel', !error, condition.message);
          formScope.updateErrorsModel();
        })

      }

      this.analyzeConditions = (value) => {
        if(angular.isArray(value)){
          value.forEach((item, index) => {
            analyze(item, index);
          });
        }else{
          analyze(value);
        }
        return this;
      }

      this.removeAllConditions = () => conditions = [];

  }

  const $watch = (scope, model, elm) => {
    if(!scope || !model){
      console.error("Para usar o watch do gumga model é necessário passar o scope e o nome da variavél a ser observada.");
      return;
    }
    if(!scope.$watch || !scope.hasOwnProperty('$id')){
      console.error("Verifique se você passou um objecto do tipo scope no primeiro parâmetro.");
      return;
    }
    let form = angular.element(elm)[0] || angular.element('form[gumga-form]')[0];
    let gumgaModelInstance = new GumgaModelInstance(scope, model, form);
    scope.$watch(model, (value) => gumgaModelInstance.analyzeConditions(value), true);
    return gumgaModelInstance;
  }

  return {
    $get() {
        return {
          $watch: $watch
        };
      }
  }

}

Provider.$inject = [];

angular.module('gumga.form.modelerror.provider',[]).provider('$gumgaModel', Provider);
