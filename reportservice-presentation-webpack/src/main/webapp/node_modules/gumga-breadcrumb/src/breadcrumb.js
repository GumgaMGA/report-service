(function () {
  'use strict';

  Breadcrumb.$inject = ['$rootScope'];
  function Breadcrumb($rootScope) {
    var template = [
      '<ol class="breadcrumb">',
      '<li ng-repeat="bread in breadcrumbs" ><a ui-sref="{{::bread.state}}">{{::bread.state}}</a></li>',
      '</ol>'
    ];
    return {
      restrict: 'E',
      template: template.join('\n'),
      replace: true,
      link: function ($scope, $elm, $attrs) {
        $scope.$on('breadChanged', function () {
          $scope.breadcrumbs = $rootScope.breadcrumbs.filter(function (e) {
            return e.state.split('.').length >= 2;
          });
        });
      }
    };
  }
  angular.module('gumga.breadcrumb', [])
    .directive('gumgaBreadcrumb', Breadcrumb);
})();