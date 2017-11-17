angular.module('app', ['ui.bootstrap', 'gumga.manytoone'])
  .controller('Ctrl', function($scope){
    $scope.produtos = [
      { nome: 'Notebook Acer Aspire', id: 1 },
      { nome: 'Motorola Moto X (2a Geração) 32GB', id: 2 },
      { nome: 'Smart TV LED 43" Samsung', id: 3 },
      { nome: 'Ar Condicionado Split 7000 BTU/s', id: 4 }
    ];

    $scope.produto = $scope.produtos[1];

    $scope.deselectCallback = function(value){
      console.log(value);
    }

    // Este método precisa ser assíncrono
    $scope.getSearch = function(param){
        return $q(function(resolve){
            var arr = $scope.produtos.filter(function(produto){
              return produto.nome.indexOf(param) != -1;
            })
            resolve(arr);
        })
    };
  })
