angular.module('app', ['ui.bootstrap','gumga.populate','gumga.onetomany'])
  .controller('Ctrl', function () {
    var ctrl = this
    ctrl.clientes = [{
      nome: 'Mateus Miranda',
      id: 1
    }]
  })
  .controller('ModalClienteController',function($scope, entity, $uibModalInstance){
    $scope.entity = angular.copy(entity) || {}

    $scope.cancelar = function(){
      $uibModalInstance.dismiss('cancel')
    }

    $scope.salvar = function(entity){
      $uibModalInstance.close(entity)
    }
  })