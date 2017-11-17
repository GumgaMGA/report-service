require('./services/module');
require('./controllers/module');

module.exports = angular
  .module('app.gumgatagdefinition', [
    'ui.router',
    'app.gumgatagdefinition.controllers',
    'app.gumgatagdefinition.services',
    'gumga.core'
  ])
  .config(($stateProvider, $httpProvider) => {
    $stateProvider
      .state('gumgatagdefinition.list', {
        url: '/list',
        templateUrl: 'app/modules/gumgatagdefinition/views/list.html',
        controller: 'GumgaTagDefinitionListController'
      })
      .state('gumgatagdefinition.insert', {
        url: '/insert',
        templateUrl: 'app/modules/gumgatagdefinition/views/form.html',
        controller: 'GumgaTagDefinitionFormController',
        resolve: {
          entity: ['$stateParams', '$http', function($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgatagdefinition/new');
          }]
        }
      })
      .state('gumgatagdefinition.edit', {
        url: '/edit/:id',
        templateUrl: 'app/modules/gumgatagdefinition/views/form.html',
        controller: 'GumgaTagDefinitionFormController',
        resolve: {
          entity: ['$stateParams', '$http', function($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgatagdefinition/' + $stateParams.id);
          }]
        }
      });
  })
