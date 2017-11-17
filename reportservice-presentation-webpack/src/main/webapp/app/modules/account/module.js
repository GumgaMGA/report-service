module.exports = angular
  .module('app.account', [])
  .controller('AccountController', require('./controllers/AccountController'))
  .service('AccountService', require('./services/AccountService'))
  .config(($stateProvider, $httpProvider) => {
    $stateProvider
      .state('account.browse', {
        url: '/browse',
        templateUrl: 'app/modules/account/views/account.html',
        controller: 'AccountController'
      })
  })
