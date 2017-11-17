angular
  .module('app', ['ui.bootstrap', 'gumga.rest', 'gumga.controller', 'gumga.genericfilter', 'gumga.queryfilter'])
  .controller('Ctrl', ['gumgaController', 'GumgaRest', '$scope', '$http', function (gumgaController, GumgaRest, $scope, $http) {
    var PessoaService = new GumgaRest('host-api');
    gumgaController.createRestMethods($scope, PessoaService, 'pessoas');
    $scope.pessoas.methods.get();

    $scope.simple = function (field, param) {
      console.info('GumgaQuery', 'Field: ' + field + ', Valor:' + param)
    }

    $scope.advanced = function (value) {
      console.info('GumgaQuery', 'Value: ', value)
    }
  }])