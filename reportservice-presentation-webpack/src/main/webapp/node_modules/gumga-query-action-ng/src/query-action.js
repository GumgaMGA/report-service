const template = `
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
      <button type="button" class="btn btn-default"
        data-ng-show="$ctrl.showBtnSearch()" data-ng-click="$ctrl.setBeyond()">
        <span data-ng-show="!$ctrl.beyond">Deseja marcar todos os <strong data-ng-bind="$ctrl.entity.count"></strong> registros da pesquisa?</span>
        <span data-ng-show="$ctrl.beyond">Desfazer seleção de registros da pesquisa</span>
      </button>
      <button type="button" class="btn btn-default"
        data-ng-show="$ctrl.showBtnBeyond()" data-ng-click="$ctrl.setBeyond()">
        <span data-ng-show="!$ctrl.beyond">Deseja marcar todos os <strong data-ng-bind="$ctrl.entity.count"></strong> registros alem desta página?</span>
        <span data-ng-show="$ctrl.beyond">Desfazer seleção de registros além desta página</span>
      </button>
    </div>
    <div class="btn-group" uib-dropdown>
      <button id="split-button" type="button" class="btn btn-default"
        data-ng-disabled="$ctrl.disabledAction()"
        data-ng-click="$ctrl.setAction($ctrl.firstAction)">
        {{$ctrl.firstAction.label}}
      </button>
      <button type="button" class="btn btn-default"
        data-ng-disabled="$ctrl.disabledAction()"
        uib-dropdown-toggle>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="split-button">
        <li role="menuitem" data-ng-repeat="action in $ctrl.actions">
          <a href="#" data-ng-click="$ctrl.setAction(action)">{{action.label}}</a>
        </li>
      </ul>
    </div>
  </div>
`
const component = {
  restrict: 'E',
  bindings: {
    query: '<',
    entity: '<',
    selected: '<',
    beyond: '=',
    actions: '<',
    onAction: '&'
  },
  template,
  controller: function() {
    let ctrl = this
    ctrl.setAction = option => {
      let queryaction = {}
      if (ctrl.beyond && ctrl.query) {
        queryaction = ctrl.query
      } else if (!ctrl.beyond) {
        queryaction.ids = (!ctrl.beyond) ? ctrl.selected.map(item => item.id) : []
      }
      queryaction.action = option.key
      ctrl.onAction({queryaction: queryaction})
      ctrl.beyond = false
      ctrl.query = false
    }
    ctrl.disabledAction = () => {
      return ctrl.selected.length == 0
    }
    ctrl.showBtnSearch = () => {
      return (ctrl.entity.data.length == ctrl.selected.length) && (ctrl.entity.count > ctrl.entity.pageSize) && ctrl.query
    }
    ctrl.showBtnBeyond = () => {
      return (ctrl.entity.data.length == ctrl.selected.length) && (ctrl.entity.count > ctrl.entity.pageSize) && !ctrl.query
    }
    ctrl.setBeyond = () => {
      ctrl.beyond = !ctrl.beyond
    }
    ctrl.$onInit = () => {
      ctrl.firstAction = ctrl.actions[0]
      ctrl.beyond = false
      ctrl.actions.shift()
    }
  }
} 
angular
  .module('gumga.queryaction', [])
  .component('gumgaQueryAction', component)
