angular.module('app', ['gumga.form', 'ui.utils.masks'])
  .controller('Ctrl', function ($http, $gumgaModel, $scope, $timeout) {
    var ctrl = this;
    ctrl.entity = ctrl.entity || { name: "" };

    ctrl.validate = function(name){
      return {
        error: name.length < 5,
        message: "Informe um nome com mais de 5 letras"
      }
    }

    $gumgaModel.$watch($scope, 'ctrl.entity', angular.element('form[name="ExampleGumgaModel"]'))
               .condition("nome == null || nome == ''", "Preencha um nome.")
               .condition("nome.toLowerCase().startsWith('mat')", "Seu nome não pode ser Mateus.");



  })
