Confirm.$inject = ['$interpolate', '$uibModal', '$compile', '$rootScope']

function Confirm($interpolate, $uibModal, $compile, $rootScope){

  return {
    restrict: 'A',
    priority: 0,
    terminal: true,
    scope: false,
    link($scope, $element, $attrs){
      var scope = $rootScope.$new();
      scope.ngClick = $attrs.ngClick;
      $element.removeAttr('ng-click').removeAttr('data-ng-click');

      const confirmationMessage = $interpolate($attrs.gumgaConfirm)($scope)
      const size                = $attrs.size               || 'md'
      const icon                = $attrs.icon               || 'glyphicon glyphicon-question-sign'
      const dismissButton       = $attrs.dismissButton      ? $interpolate($attrs.dismissButton)($scope)      : 'Retornar'
      const confirmButton       = $attrs.confirmButton      ? $interpolate($attrs.confirmButton)($scope)      : 'Confirmar'
      const confirmButtonClass  = $attrs.confirmButtonClass ? $interpolate($attrs.confirmButtonClass)($scope) : 'btn btn-primary'
      const dismissButtonClass  = $attrs.dismissButtonClass ? $interpolate($attrs.dismissButtonClass)($scope) : 'btn btn-default'
      const whatToDoWhenClicked = $attrs.ngClick
      const whatToDoWhenDismiss = $attrs.dismiss;

      const elm = $compile($element[0].outerHTML.replace('gumga-confirm', 'label').replace('data-gumga-confirm', 'label'))($scope);

      $element.replaceWith(elm);

      elm.bind('click', event => {
        const controllerAs = 'ctrl'

        let resolve = {
          size(){           return size},
          icon(){           return icon },
          confirmMessage(){ return confirmationMessage },
          dismissBtn(){     return dismissButton },
          confirmBtn(){     return confirmButton },
          dismissClass(){   return dismissButtonClass },
          confirmClass(){   return confirmButtonClass }
        }

        controller.$inject = ['$scope','$uibModalInstance', 'confirmMessage', 'dismissBtn', 'confirmBtn', 'dismissClass', 'confirmClass']

        function controller($scope, $uibModalInstance, confirmMessage, dismissBtn, confirmBtn, dismissClass, confirmClass){
          let ctrl = this;

          ctrl.size               = size
          ctrl.icon               = icon
          ctrl.message            = confirmMessage
          ctrl.dismissButton      = dismissBtn
          ctrl.confirmButton      = confirmBtn
          ctrl.dismissButtonClass = dismissClass
          ctrl.confirmButtonClass = confirmClass
          ctrl.close              = boolean => boolean ? $uibModalInstance.close() : $uibModalInstance.dismiss()
        }

        let template = `
        <div class="gumga-confirm modal-body">
          <h3>
            <i class="{{ ::ctrl.icon }}"></i>
            {{ ::ctrl.message }}
          </h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="{{ ::ctrl.dismissButtonClass }}" ng-click="ctrl.close(false)">{{ ::ctrl.dismissButton }}</button>
          <button type="button" class="{{ ::ctrl.confirmButtonClass }}" ng-click="ctrl.close(true)"> {{ ::ctrl.confirmButton }}</button>
        </div>`


        $uibModal
          .open({ controller, template, size, controllerAs, resolve, backdrop: 'static' })
          .result
          .then(
                value =>  $scope.$eval(scope.ngClick),
                reject => $scope.$eval(whatToDoWhenDismiss)
              )
      })

    }
  }
}

const module = angular.module('gumga.confirm', ['ui.bootstrap'])
  .directive('gumgaConfirm', Confirm);

export default module.name;
