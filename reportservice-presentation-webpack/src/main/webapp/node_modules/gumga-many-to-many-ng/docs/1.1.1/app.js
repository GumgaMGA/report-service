angular.module('app', ['gumga.manytomany'])
  .controller('Ctrl', function ($scope) {
    var ctrl = this
    $scope.searchLeft = function (param) {
      console.info('Filtro:', param)
    }

    $scope.selecionados = [
      { id: 1, nome: 'Smart TV LED 43" Samsung' }
    ]

    $scope.dados = [
      { id: 2, nome: 'Notebook Acer Aspire' },
      { id: 3, nome: 'Motorola Moto X (2a Geração) 32GB' },
      { id: 1, nome: 'Smart TV LED 43" Samsung' },
      { id: 4, nome: 'Ar Condicionado Split 7000 BTU/s' }
    ]

    $scope.compare = function(left, right){
      return left.id == right.id;
    }

  })
