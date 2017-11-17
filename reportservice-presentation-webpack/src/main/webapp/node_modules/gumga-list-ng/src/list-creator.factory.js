ListCreator.$inject = [];
//TODO: Otimizar estas funções de criação de HTML.
function ListCreator() {
  // TEMPLATE DA VERSÃO SEM MATERIAL DESIGN
  const itemsPerPage = `
      <div class="row">
        <div class="col-md-offset-9 col-md-2">
          <div class="text-right" style="line-height: 30px">
            <span gumga-translate-tag="gumgalist.itemsperpage"></span>
          </div>
        </div>
        <div class="col-md-1">
          <select class="form-control input-sm" ng-options="item for item in ctrl.listConfig.itemsPerPage" ng-model="ctrl.selectedItemPerPage">
          </select>
        </div>
      </div>`;

  const paginationTemplate = `
        <div class="page-select">
          <div class="btn-group smart-footer-item">
            <button type="button"
                    class="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
              Página: &nbsp; {{ctrl.pageModel}} &nbsp; <span class="caret"></span>
            </button>
            <ul class="gmd dropdown-menu">
              <li class="search">
                <input type="number" min="1" step="1" oninput="this.value=this.value.replace(/[^0-9]/g,'');" autofocus max="{{ctrl.getTotalPage()[ctrl.getTotalPage().length - 1]}}" placeholder="Página" class="form-control" ng-keypress="ctrl.inputPageChange($event)"/>
              </li>
              <li class="effect-ripple {{page == ctrl.pageModel ? 'selected' : ''}}" ng-click="ctrl.changePage(page, ctrl.pageSize)" ng-repeat="page in ctrl.getTotalPage()">
                {{page}}
              </li>
            </ul>
          </div>
        </div>

        <div class="page-select" ng-show="ctrl.listConfig.itemsPerPage.length > 0">
          <div class="btn-group smart-footer-item">
            <button type="button"
                    class="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
              Itens por página: &nbsp; {{ctrl.pageSize}} &nbsp; <span class="caret"></span>
            </button>
            <ul class="gmd dropdown-menu">
              <li class="effect-ripple {{itemPerPage == ctrl.pageSize ? 'selected' : ''}}"
                  ng-click="ctrl.changePage(ctrl.pageModel, itemPerPage)" ng-repeat="itemPerPage in ctrl.listConfig.itemsPerPage">
                {{itemPerPage}}
              </li>
            </ul>
          </div>
        </div>

        <div class="page-select">
          <div class="smart-footer-item">
            {{ 1+ (ctrl.pageModel-1) * ctrl.pageSize}} - {{ctrl.roundNumber(ctrl.count, ctrl.pageSize, ctrl.pageModel)}} de {{ctrl.count}}
            <button class="btn" type="button" ng-disabled="!ctrl.existsPreviousPage()" ng-click="ctrl.previousPage()"><i class="effect-ripple glyphicon glyphicon-chevron-left"></i></button>
            <button class="btn" type="button" ng-disabled="!ctrl.existsNextPage()" ng-click="ctrl.nextPage()"><i class="effect-ripple glyphicon glyphicon-chevron-right"></i></button>
          </div>
        </div>
  `;

  function formatTableHeader(sortField, title) {
    let templateWithSort = `
        <div style="display: flex">
        <a ng-click="ctrl.doSort('${sortField}')" class="th-sort">
          ${title}
        </a>
        <span class="sort-caret-span" style="{{ctrl.activeSorted.column  == '${sortField}' ? '': 'opacity: 0.4;'}}" ng-class="ctrl.activeSorted.direction == 'asc' ? 'dropup' : ' ' ">
          <span class="caret"></span>
        </span>
        </div>
`;
    return !!sortField ? templateWithSort : title;
  }

  function generateHeader(config, tableId) {
    if (config.headers) {
      return `
              ${generateHeaderColumns(config.columnsConfig, undefined, tableId)}
        `
    } else { return '' }
  }

  function generateHeaderColumns(columnsArray = [], hasCheckbox = true, tableId) {
    return columnsArray.reduce((prev, next, index) => {
      return prev += `
          <th ng-init="ctrl.checkResizer()" id="${tableId}-${next.name}" style="${next.style ? next.style+';' : ''}text-align: ${next.alignColumn}; white-space: normal; {{ctrl.listConfig.fixed && ctrl.listConfig.fixed.left ? '' : 'z-index: 1;'}}" class="${next.size || ' '}">
            <i ng-show="ctrl.isPosssibleLeft('${next.name}', ${index})"  class="glyphicon glyphicon-triangle-left left" ng-click="ctrl.moveColumn('left', '${next.name}')"></i>
            <strong>
              ${formatTableHeader(next.sortField, next.title)}
            </strong>
            <i ng-show="ctrl.isPosssibleRight('${next.name}', ${index})" class="glyphicon glyphicon-triangle-right right" ng-click="ctrl.moveColumn('right', '${next.name}')"></i>
          </th>
          `
    }, ' ')
  }

  function generateBody(columnsArray) {
    return columnsArray.reduce((prev, next) => {
      if(next.name == "$checkbox"){
        return prev += `
            <td class="${next.size} td-checkbox" ng-class="ctrl.checkConditions($value)" ng-style="{'border-left': {{ ctrl.conditionalTableCell($value,'${next.name}') }} }"> ${next.content}</td>`;
      }
      return prev += `
                <td   class="${next.size}"
                      style="text-align: ${next.alignRows};"
                      ng-class="ctrl.checkConditions($value)"
                      ng-dblclick="ctrl.editInline($event, $value, '${next.name}')"
                      ng-style="{'border-left': {{ ctrl.conditionalTableCell($value,'${next.name}') }} }">
                      ${next.content}
                </td>
            `;
    }, ' ')
  }

  function mountTable(config, className, style, tableId, styleMaterial, listName) {
    if (config.checkbox) {
      config.columnsConfig.unshift({
        title: `
              <div class="pure-checkbox">
                  <input type="checkbox"
                         ng-model="ctrl.checkAll"
                         ng-change="ctrl.selectAll(ctrl.checkAll)"
                         ng-show="'${config.selection}' === 'multi'"/>
                         <label ng-click="ctrl.checkAll = !ctrl.checkAll; ctrl.selectAll(ctrl.checkAll)"></label>
                </div>`,
        name: '$checkbox',
        content: `<div class="pure-checkbox">
                    <input  name="$checkbox"
                            type="checkbox"
                            ng-model="ctrl.selectedMap[$index].checkbox"/>
                            <label></label>
                  </div>`,
        size: 'col-md-1',
        conditional: angular.noop
      })
    }

    if(config.materialTheme){
      var style = document.createElement('style'), head = document.getElementsByTagName('head')[0];
          style.innerHTML = styleMaterial;
          style.id        = 'gumga-list' + ('-'+listName || '');
          head.insertBefore(style, head.firstChild);
    }

    return `
        ${config.itemsPerPage.length > 0  && !config.materialTheme ? itemsPerPage : ' '}
        <div class="{{ctrl.listConfig.materialTheme ? 'gmd panel': ''}}">
          <div class="page-select"
              ng-show="ctrl.getPossibleColumns().length > 0"
              style="position: absolute;right: 35px;z-index: 10;top: 15px;">
                <div class="btn-group smart-footer-item">
                  <button class="btn btn-default dropdown-toggle "
                          data-toggle="dropdown"
                          type="button"
                          aria-haspopup="true"
                          aria-expanded="false" style="font-size: 14px;">
                          <span class="glyphicon glyphicon-plus"></span>
                  </button>
                  <ul class="gmd dropdown-menu" style="margin-left: -120px;margin-top: -20px;">
                    <li style="border-bottom: 1px solid #ddd;">
                      <label>Adicionar colunas</label>
                    </li>
                    <li class="effect-ripple"
                        ng-repeat="column in ctrl.getPossibleColumns() track by $index"
                        ng-click="ctrl.addColumn(column)">
                        {{column.label || column.name}}
                    </li>
                  </ul>
                </div>
          </div>
          <div ng-show="(ctrl.listConfig.materialTheme
                        && ((ctrl.listConfig.actions.length > 0
                        || ctrl.listConfig.title)
                        || ctrl.listConfig.enabledBetweenLines))"
               class="{{ctrl.listConfig.materialTheme ? 'panel-actions': ''}}">
              <h4 ng-show="ctrl.listConfig.title">{{ctrl.listConfig.title}}</h4>
              <div class="actions">
                <div  ng-repeat="action in ctrl.listConfig.actions"
                      ng-click="action.onClick(ctrl.selectedValues, ctrl.data)"
                      style="float: left;padding-left: 15px;"
                      class="{{ctrl.selectedValues.length > 0 ? action.classOnSelectedValues : action.classOnNotSelectedValues}}"
                      ng-bind-html="ctrl.trustAsHtml(action.icon)"></div>

                <div style="float: left;padding-left: 15px;" ng-show="ctrl.listConfig.enabledBetweenLines">
                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(25)" style="font-size: 14px;"></i>
                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(48)" style="font-size: 16px;margin-left: 5px;"></i>
                    <i class="glyphicon glyphicon-menu-hamburger" ng-click="ctrl.handlingLineHeight(60)" style="font-size: 20px;margin-left: 5px;"></i>
                </div>
              </div>
          </div>
          <div ng-show="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == 'TOP' || ctrl.pagePosition.toUpperCase() == 'ALL')"
               class="{{ctrl.listConfig.materialTheme ? 'panel-heading': ''}}"
               style="justify-content: {{ctrl.pageAlign}};">
              ${paginationTemplate}
          </div>
          <div class="{{ctrl.listConfig.materialTheme ? 'panel-body': ''}}" style="padding: 0;">
            <div class="table-responsive" style="{{ctrl.maxHeight ? 'max-height: '+ctrl.maxHeight : ''}}">

              <table class="${className}" ${config.resizable ? 'resizeable mode="\'BasicResizer\'" ' : ' '} id="${tableId}">
                <thead>
                  <tr>
                    ${generateHeader(config, tableId)}
                  </tr>
                </thead>
                <tbody ng-init="ctrl.checkResizer()">
                  <tr ng-style="{ 'border-left': {{ctrl.conditional($value)}} }"
                      style="{{ctrl.rowIsDisabled(ctrl.selectedMap[$index].value) ? 'opacity: 0.4;' : ''}}"
                      class="{{ctrl.rowIsDisabled(ctrl.selectedMap[$index].value) ? 'row-disabled' : ''}} "
                      ng-dblclick="ctrl.doubleClick($value)"
                      ng-class="ctrl.selectedMap[$index].checkbox ? 'active active-list' : ''"
                      ng-repeat="$value in ctrl.data track by $index"
                      ng-init="ctrl.checkResizer()"
                      ng-show="ctrl.visibleRow($value)"
                      ng-click="ctrl.select($index,$event)">
                      ${generateBody(config.columnsConfig)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div ng-if="(ctrl.listConfig.materialTheme && ctrl.pageSize) && (ctrl.pagePosition.toUpperCase() == 'BOTTOM' || ctrl.pagePosition.toUpperCase() == 'ALL')"
               class="{{ctrl.listConfig.materialTheme ? 'panel-footer gumga-list-paginable': ''}}"
               style="justify-content: {{ctrl.pageAlign}};">
               <div class="signal" ng-show="ctrl.loading"></div>
              ${paginationTemplate}
          </div>
        </div>
        `;
  }


  return { mountTable };
}

angular.module('gumga.list.creator', [])
  .factory('listCreator', ListCreator);
