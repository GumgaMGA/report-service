angular.module('app', ['gumga.translate'])
  .controller('Ctrl', function ($http, $filter) {
    var ctrl = this;

    ctrl.traducaoFilter = $filter('gumgaTranslate')('name','person');


  })
