angular.module('app', ['gumga.confirm'])
  .controller('Ctrl', function($scope, $q, $timeout){

    $scope.remove = function(){
      alert('removeu');
    }

  })
