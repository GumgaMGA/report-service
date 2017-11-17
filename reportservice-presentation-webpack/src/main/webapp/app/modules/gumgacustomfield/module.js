require('./services/module');
require('./controllers/module');

module.exports = angular
  .module('app.gumgacustomfield', [
    'ui.router',
    'app.gumgacustomfield.controllers',
    'app.gumgacustomfield.services',
    'gumga.core'
  ])
  .config(($stateProvider, $httpProvider) => {
    $stateProvider
      .state('gumgacustomfield.list', {
        url: '/list',
        templateUrl: 'app/modules/gumgacustomfield/views/list.html',
        controller: 'GumgaCustomFieldListController'
      })
      .state('gumgacustomfield.insert', {
        url: '/insert',
        templateUrl: 'app/modules/gumgacustomfield/views/form.html',
        controller: 'GumgaCustomFieldFormController',
        resolve: {
          entity: ['$stateParams', '$http', function($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgacustomfield/new');
          }]
        }
      })
      .state('gumgacustomfield.edit', {
        url: '/edit/:id',
        templateUrl: 'app/modules/gumgacustomfield/views/form.html',
        controller: 'GumgaCustomFieldFormController',
        resolve: {
          entity: ['$stateParams', '$http', function($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgacustomfield/' + $stateParams.id);
          }]
        }
      });
  })
