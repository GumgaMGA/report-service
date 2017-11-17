angular.module('app', ['ui.bootstrap', 'gumga.layout', 'gumga.myAccountEmbedded'])
    .controller('ctrl', function($scope){

      sessionStorage.setItem('user', JSON.stringify(
          {"idUser":1,"organization":"GUMGA","organizationLogo":null,"timeOfCreation":"1491921900503","name":"GumgaAdmin","organizationHierarchyCode":"1.","securityManager":false,"login":"gumga@gumga.com.br","softwareHouse":true,"timeOfExpiration":"1491923700503","picture":null,"token":"eterno","profileImage":"src/images/user-without-image.png"}
      ));

        $scope.config = {
          defaultPicture:'https://upload.wikimedia.org/wikipedia/commons/1/18/Gnome-Wikipedia-user-male.png',
          facialRecognition: true,
          appURL: 'http://localhost:8080/dashboard-api'
        }

    })
