require('./services/module');
require('./controllers/module');

module.exports = angular.module('app.gumgareport', [
  'app.gumgareport.controllers',
  'app.gumgareport.services'
])
  .config(function ($stateProvider, $httpProvider) {
    $stateProvider
      .state('gumgareport.list', {
        url: '/list',
        templateUrl: 'app/modules/gumgareport/views/list.html',
        controller: 'GumgaReportListController'
      })
      .state('gumgareport.insert', {
        url: '/insert',
        templateUrl: 'app/modules/gumgareport/views/form.html',
        controller: 'GumgaReportFormController',
        resolve: {
          entity: ['$stateParams', '$http', function ($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgareport/new');
          }]
        }
      })
      .state('gumgareport.edit', {
        url: '/edit/:id',
        templateUrl: 'app/modules/gumgareport/views/form.html',
        controller: 'GumgaReportFormController',
        resolve: {
          entity: ['$stateParams', '$http', function ($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgareport/' + $stateParams.id);
          }]
        }
      })
      .state('gumgareport.view', {
        url: '/viewer/:id',
        templateUrl: 'app/modules/gumgareport/views/viewer.html',
        controller: 'GumgaReportFormController',
        resolve: {
          entity: ['$stateParams', '$http', function ($stateParams, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgareport/' + $stateParams.id);
          }]
        }
      });
  })