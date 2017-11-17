angular
  .module('app',['gumga.login'])
  .controller('LoginController', ['$scope',function($scope) {

    $scope.configuration = {
        appURL : 'http://192.168.25.250/security-api'
        // appURL : 'http://gumga.io/darci-api'
    };

    $scope.onLogin = (user, organizations) => {
      console.log(user, organizations)
    }

    $scope.loginGumga = function(login) {
      console.log(login)
    }


    $scope.pedido = {
      "cliente": "mateus",
      "itens": [{}]
    }

    $scope.$watch('pedido', function(pedido){

      console.log(pedido)

    }, true);

    $scope.exemplo = {
      fields: [
        {
          field: 'name',
          placeholder: 'Razao',
          type: 'text'
        },
        {
          field: 'password',
          placeholder: 'Senha',
          type: 'password'
        },
        {
          field: 'confirmPassword',
          placeholder: 'Confirme sua senha',
          type: 'password',
          conditions: [
            {
              operation: '==',
              field: 'password'
            }
          ]
        }
      ],
      submit: function(data){
        console.log(data)
      }
    }

    $scope.login = function(dados){
       console.log(dados)
    }

    $scope.meumenu = [
      {
        label: 'Pagina inicial',
        link: true,
        icon: '<i class="fa fa-home" aria-hidden="true"></i>',
        url: 'https://www.gumga.io/'
      }
    ]

  }])
