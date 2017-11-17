angular.module('app', ['gumga.webstorage'])
  .controller('ctrl', function($scope, GumgaWebStorage){
    $scope.items = GumgaWebStorage.getSessionStorageItem('items') || [];

    $scope.adicionar = function(item){
      $scope.items.push(item);
      GumgaWebStorage.setSessionStorageItem('items', $scope.items);
    }

    $scope.remover = function(index){
      $scope.items.splice(index, 1);
      GumgaWebStorage.setSessionStorageItem('items', $scope.items);
    }

  });
