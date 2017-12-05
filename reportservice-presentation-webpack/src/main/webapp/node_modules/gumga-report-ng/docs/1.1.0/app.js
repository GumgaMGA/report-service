window.APILocation = {
  APILocation: 'http://minha-api'
}
angular.module('app', ['gumga.report', 'gumga.rest', 'gumga.controller'])
  .controller('Ctrl', function ($http, $window) {
    
    var ctrl = this;

    $http.get('https://api.github.com/repos/gumga/gumga-report-ng/releases')
      .then(function (resp) {
        ctrl.exemplo = resp.data;
      })

    ctrl.options = {height: '740px'}
    ctrl.gumgareport = {
      data: {
        id: null
      }
    }

  })
  .config(function ($httpProvider, $gumgaReportProvider) {
        $gumgaReportProvider.setAPILocation({apiLocation:'http://45.33.97.32/reportservice-api'})
        $gumgaReportProvider.setToken('testereport')
        $gumgaReportProvider.setLicenseKey(null);
        $httpProvider.defaults.headers.common['gumgaToken'] = 'testereport'
    })