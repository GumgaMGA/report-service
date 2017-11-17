require('./list-creator.factory.js');
require('./grid.js');
require('./grid.resize.js');

import style from './list-material-design';

List.$inject = ['$compile', 'listCreator']

function List($compile, listCreator){

    controller.$inject = ['$scope', '$element', '$attrs', '$timeout', '$sce']

    function controller($scope, $element, $attrs, $timeout, $sce){
      let ctrl = this

      const errorMessages = {
        noData: 'O componente gumgaList necessita de um atributo data, que irá conter os dados que serão visualizados.',
        noConfig: 'O componente gumgaList necessita de um atributo config, que irá conter a configuração necessária.',
        noColumns:  'O componente gumgaList necessita que, no objeto de configuração, exista um atributo columns.',
        perPageNoArray:  'O atributo itemsPerPage do gumgaList precisa ser um array, por exemplo - itemsPerPage: [5, 10, 15]'
      }

      const hasAttr             = string  => !!$attrs[string],
            hasConfig           = string  => !!(ctrl.config && ctrl.config[string]),
            defaultHeaders      = true,
            defaultCssClass     = 'table ',
            defaultSelection    = 'single',
            defaultItemsPerPage = [],
            defaultSortedColumn = null

      function guaranteeColumns(columns = ' ', columnsConfig = []){
        return columns.split(',').map(rawColumn => {
          let column        = rawColumn.trim(),
              configuration = columnsConfig.filter(value => value.name == column)[0] || { name: column };
          let title         = configuration.title       || (column.charAt(0).toUpperCase() + column.slice(1)),
              size          = configuration.resizable && configuration.size ? configuration.size :  ' ',
              name          = configuration.name        ||  column,
              editable      = configuration.editable    ||  false,
              possibleColumn= configuration.possibleColumn    ||  false,
              label         = configuration.label       ||  column,
              content       = configuration.content     ||  '{{$value.' + column + '}}',
              sortField     = configuration.sortField   ||  null,
              alignColumn   = configuration.alignColumn ||  'left',
              alignRows     = configuration.alignRows   ||  'left',
              widthPorcentage     = configuration.widthPorcentage   ||  undefined,
              conditional   = configuration.conditional || angular.noop
          return { title, size, name, content, sortField, conditional, editable, possibleColumn, label, alignColumn: alignColumn, alignRows: alignRows, widthPorcentage: widthPorcentage  }
        })
      }



      // Garantindo que existam todas as configurações necessárias no objeto.
      function guaranteeConfig() {
        ctrl.listConfig.headers       = ctrl.listConfig.hasOwnProperty('headers') ? !!ctrl.listConfig.headers     : defaultHeaders
        ctrl.listConfig.checkbox      = !!ctrl.listConfig.checkbox
        ctrl.listConfig.selection     = hasConfig('selection')                ? ctrl.listConfig.selection     : defaultSelection
        ctrl.listConfig.itemsPerPage  = hasConfig('itemsPerPage')             ? ctrl.listConfig.itemsPerPage  : defaultItemsPerPage
        ctrl.listConfig.sortDefault   = hasConfig('sortDefault')              ? ctrl.listConfig.sortDefault   : defaultSortedColumn
        ctrl.listConfig.conditional   = hasConfig('conditional')              ? ctrl.listConfig.conditional   : angular.noop
        ctrl.listConfig.columnsConfig = guaranteeColumns(ctrl.listConfig.columns, ctrl.listConfig.columnsConfig)
      }


      function init(){
        // Garantindo que existam todos os atributos que podem ser passados via elemento.
        ctrl.data           = ctrl.data   || []
        ctrl.pageModel           = ctrl.pageModel   || 1;
        ctrl.pageAlign           = ctrl.pageAlign   || "flex-end"; // flex-end, flex-start center
        ctrl.pagePosition           = ctrl.pagePosition ? ctrl.pagePosition : "BOTTOM"; // top , bottom, all
        ctrl.listConfig         = ctrl.listConfig || {}
        ctrl.sort           = hasAttr('sort')           ? ctrl.sort                                   : angular.noop
        ctrl.class          = hasAttr('class')          ? defaultCssClass.concat($attrs.class || ' ') : defaultCssClass
        ctrl.onClick        = hasAttr('onClick')        ? ctrl.onClick                                : angular.noop
        ctrl.onDoubleClick  = hasAttr('onDoubleClick')  ? ctrl.onDoubleClick                          : angular.noop
        ctrl.onSort         = hasAttr('onSort')         ? ctrl.onSort                                 : angular.noop
        ctrl.changePerPage  = hasAttr('changePerPage')  ? ctrl.changePerPage                          : angular.noop

        // Tratamento de erros do componente.
        if(!hasAttr('data'))             console.error(errorMessages.noData)
        if(!hasAttr('configuration'))    console.error(errorMessages.noConfig)
        if(!hasConfig('columns'))        console.error(errorMessages.noColumns)
      }

      // Variáveis e funções utilizadas pelo componente durante tempo de execução.
      ctrl.selectedValues       = []
      ctrl.selectedMap          = {}
      ctrl.activeSorted         = { column: null, direction: null }

      ctrl.conditional          = conditional
      ctrl.conditionalTableCell = conditionalTableCell

      ctrl.doSort               = doSort
      ctrl.doubleClick          = doubleClick
      ctrl.select               = select
      ctrl.selectAll            = selectAll

      if(ctrl.config && ctrl.config.sortDefault && ctrl.config.sortDefault != null) ctrl.doSort(ctrl.config.sortDefault)

      $scope.$parent.selectedValues = ctrl.selectedValues;

      $scope.$watch('ctrl.config', (value) => {
        applyConfig(value);
      })

      const applyConfig = value => {
        if(!value) return;
        if(Object.keys(value).length == 0) return;
        init();
        value.columnsConfig
            .forEach((column) => {
                if(column.possibleColumn){
                  value.columns = value.columns.replace(/\s/g,'');
                  value.columns = ctrl.replaceAll(value.columns, ','+column.name, '');
                  value.columns = ctrl.replaceAll(value.columns, column.name+',', '');
                  value.columns = ctrl.replaceAll(value.columns, column.name, '');
                }
            });
        ctrl.listConfig = angular.copy(value);
        guaranteeConfig();
        compileElement()
        handlingGrid();
        inactiveLoading();
        ctrl.analyzeColumnsWidth();
      }

      const isLoading = (data) => data.filter(row => row['LIST-LOADING']).length > 0;

      $scope.$watch('ctrl.data', (data) => {
          if(ctrl.updatingRow) return;
          updateMap(ctrl.data);
          handlingGrid();
          if(!isLoading(data)){
            inactiveLoading();
          }
      }, true);


      $scope.$watch('ctrl.selectedValues', (newVal = [], oldVal = []) => updateSelected(newVal, newVal.length - oldVal.length >= 0, oldVal), true)

      $scope.$watch('ctrl.selectedItemPerPage', (newVal, oldVal) => changePerPage(newVal), true)

      function findEqualInMap(obj = {}){
        const auxObj = ctrl.selectedMap
        for(var key in auxObj) if(auxObj.hasOwnProperty(key) && angular.equals(obj, auxObj[key].value)) return auxObj[key]
        return false;
      }

      function findEqualInSelected(obj = {}) {
        return ctrl.selectedValues.filter(val => angular.equals(obj.value, val)).length == 0
      }

      function updateMap(newVal = []){
        ctrl.selectedMap = {};
        newVal.forEach((value, index) => (ctrl.selectedMap[index] = { checkbox: false, value }))
        updateSelectedValues()
      }

      function updateSelected(selectedValues, wasAdded, oldSelectedValues){
        if(selectedValues.length > 1 && ctrl.listConfig.selection == 'single'){
          selectedValues = selectedValues.filter(value => !angular.equals(oldSelectedValues[0], value))
          uncheckSelectedMap()
        }
        if(wasAdded){
          selectedValues.forEach(val => {
            const mapObject = findEqualInMap(val)
            if (mapObject && !mapObject.checkbox) mapObject.checkbox = true
          })
        } else {
          Object.keys(ctrl.selectedMap).forEach(value => {
            if(ctrl.selectedMap[value].checkbox && findEqualInSelected(ctrl.selectedMap[value]))
              ctrl.selectedMap[value].checkbox = false
          })
        }
        updateSelectedValues()
      }

      function updateSelectedValues(){
        let selected  = Object.keys(ctrl.selectedMap)
                          .filter(val => ctrl.selectedMap[val].checkbox)
                          .map(val => ctrl.selectedMap[val].value)
        if(!$attrs.selectedValues){
          $scope.$parent.selectedValues = selected
        }
        ctrl.selectedValues           = selected
      }

      function uncheckSelectedMap(){
        Object.keys(ctrl.selectedMap).forEach(value => {
          if(ctrl.selectedMap[value].checkbox)  ctrl.selectedMap[value].checkbox = !ctrl.selectedMap[value].checkbox
        })
      }

      function conditional(value){
        let obj = ctrl.listConfig.conditional(value);
        let trueValue, falseValue
        for(let key in obj){
          obj[key] === true ? trueValue = key : falseValue = key
        }
        if(trueValue) return '\"'.concat(trueValue).concat('\"')
        return '\'\''
      }


      function conditionalTableCell(value,ordering){
        let columnToGetTheConditional = ctrl.listConfig.columnsConfig.filter(val => val.name == ordering)[0]

        if(columnToGetTheConditional){
          let obj = columnToGetTheConditional.conditional(value), trueValue, falseValue

          for(var key in obj){
            if(obj[key] === true){
              trueValue = key
            } else {
              falseValue = key
            }
          }

          return '\"'.concat(trueValue).concat('\"')
        }
        return '\'\''
      }

      function doSort(sortField){
        if(ctrl.activeSorted.direction){
          activeLoading();
        }
        ctrl.activeSorted.column = sortField
        ctrl.activeSorted.direction = ctrl.activeSorted.direction == 'asc' ? 'desc' : 'asc'
        ctrl.sort({field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction, pageSize: ctrl.pageSize})
        if(ctrl.onSort){
          ctrl.onSort({field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction, pageSize: ctrl.pageSize})
        }
      }

      function activeLoading(){
        ctrl.loading = true;
        ctrl.data.push({ 'LIST-LOADING' : true });
      }

      function inactiveLoading(){
        ctrl.loading = false;
      }

      function doubleClick($value){
        ctrl.onDoubleClick({ $value })
      }

      function changePerPage(value){
        if(ctrl.changePerPage){
          ctrl.changePerPage({ value })
        }
      }

      ctrl.rowIsDisabled = (row) => {
        if(!ctrl.config.disabledRow) return false; //linha não disabilitada
        var rowIsDisabled = ctrl.config.disabledRow(row);
        if(typeof(rowIsDisabled) === "boolean"){
          return rowIsDisabled;
        }
        return false;
      }

      ctrl.checkConditions = (row) => {
        if(!ctrl.listConfig.conditionalClass) return "";
        var rowClass = ctrl.listConfig.conditionalClass(row);
        if(rowClass && typeof rowClass == "object"){
          return rowClass;
        }
        return "";
      }

      function select(index, event = { target: {} }){
        if (ctrl.listConfig.selection != 'none' && !ctrl.rowIsDisabled(ctrl.selectedMap[index].value)){
            if(event.target.name == '$checkbox' && ctrl.listConfig.selection == 'single') uncheckSelectedMap()
            if(event.target.name == '$checkbox' && ctrl.listConfig.selection == 'multi') ctrl.selectedMap[index].checkbox = !ctrl.selectedMap[index].checkbox
            if(ctrl.checkAll) ctrl.checkAll = false
            if(ctrl.listConfig.selection == 'single' && !ctrl.selectedMap[index].checkbox) uncheckSelectedMap()
            ctrl.selectedMap[index].checkbox = !ctrl.selectedMap[index].checkbox
            updateSelectedValues()
            ctrl.onClick({ $value : ctrl.selectedMap[index].value})
        }
      }

      function selectAll(boolean){
        Object.keys(ctrl.selectedMap).forEach(value => {
          if(!ctrl.rowIsDisabled(ctrl.selectedMap[value].value)){
            ctrl.selectedMap[value].checkbox = boolean;
          }
        })
        updateSelectedValues()
      }

      // Compilação do componente na tela.
      function compileElement() {
        $element.html('')
        const element = angular.element(listCreator.mountTable(ctrl.listConfig, ctrl.class, style, ctrl.getTableId(), ctrl.getStyleMaterialDesign(), ctrl.name))
        $element.append($compile(element)($scope))
      }
      try {
        compileElement();
      } catch(err){}

      const handlingGrid = () => {
        if(!ctrl.listConfig) return;
        if(ctrl.listConfig.fixed){
          $timeout(() => $element.find('table').smartGrid(ctrl.listConfig.fixed));
        }
        if(ctrl.config.ordination && !ctrl.appyCache){
          ctrl.appyCache = true;
          let cache = ctrl.getOrderColumnsStorage();
          if(cache){
            ctrl.config.columns = cache;
            ctrl.config = angular.copy(ctrl.config);
          }
        }
      }

      ctrl.analyzeColumnsWidth = () => {
        let configKey = 'ngColumnResize.'+ctrl.getTableId()+'.BasicResizer';
        if(ctrl.listConfig.columnsConfig) {
          let config = {};
          ctrl.listConfig.columnsConfig.forEach(column => {
            if(column.widthPorcentage){
              config[ctrl.getTableId()+'-'+column.name] = column.widthPorcentage + '%';
            }
          });
          if(Object.keys(config).length > 0){
            config[ctrl.getTableId()+'-$checkbox'] = '4%';
            sessionStorage.setItem(configKey, JSON.stringify(config));
          }
        }
      }

      ctrl.getTotalPage = () => {
        var res = [];
        for (var i = 1; i <= Math.ceil(ctrl.count/ctrl.pageSize); i++) {
          res.push(i);
        }
        return res;
      }

      ctrl.changePage = (page, itensPerPage) => {
          if(ctrl.onPageChange){
            if(page != ctrl.pageModel || itensPerPage != ctrl.pageSize){
              activeLoading();
            }
            ctrl.pageSize = itensPerPage || ctrl.pageSize;
            ctrl.pageModel = page || ctrl.pageModel;
            
            ctrl.onPageChange({page: page, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction});
          }
      }

      ctrl.previousPage = () => {
          if(ctrl.onPageChange && ctrl.existsPreviousPage()){
            activeLoading();
            ctrl.onPageChange({page: ctrl.pageModel-1, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction});
            ctrl.pageModel = ctrl.pageModel-1;
          }
      }

      ctrl.nextPage = () => {
        if(ctrl.onPageChange && ctrl.existsNextPage()){
          activeLoading();
          ctrl.onPageChange({page: ctrl.pageModel+1, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction});
          ctrl.pageModel = ctrl.pageModel+1;
        }
      }

      ctrl.roundNumber = (count, pageSize, pageModel) => {
        let round = pageSize * pageModel;
        if(Math.floor(round) >= count) return count;
        return round;
      }

      ctrl.existsPreviousPage = () => (ctrl.pageModel-1) > 0;

      ctrl.existsNextPage = () => ((ctrl.pageModel+1) <= Math.ceil(ctrl.count/ctrl.pageSize));

      ctrl.inputPageChange = (evt) => {
        if(evt.keyCode == 13){
          if(ctrl.onPageChange && (Number(evt.target.value) <= Math.ceil(ctrl.count/ctrl.pageSize)) && evt.target.value != ctrl.pageModel){
            activeLoading();
            ctrl.onPageChange({page: evt.target.value, pageSize: ctrl.pageSize, field: ctrl.activeSorted.column, dir: ctrl.activeSorted.direction});
            ctrl.pageModel = Number(evt.target.value);
          }
        }
      }

      ctrl.trustAsHtml = string => $sce.trustAsHtml(string);

      ctrl.replaceAll = function(style, needle, replacement) {
          return style.replace(new RegExp(needle, 'g'), replacement);
      };

      ctrl.getStyleMaterialDesign = () => {
         let height = ctrl.listConfig.lineHeight || 48;
         let s = ctrl.replaceAll(style, 'LINE_HEIGHT_VALUE', (height) + 'px');
         if(ctrl.name){
           s = ctrl.replaceAll(s, 'GUMGA_LIST_KEY', 'gumga-list[name="'+ctrl.name+'"]');
         }else{
           s = ctrl.replaceAll(s, 'GUMGA_LIST_KEY', 'gumga-list');
         }
         var checkboxColor = ctrl.listConfig.checkboxColor || '#4f8196';
         var activeLineColor = ctrl.listConfig.activeLineColor || '#f5f5f5';
         var hoverLineColor = ctrl.listConfig.hoverLineColor || activeLineColor;
         s = ctrl.replaceAll(s, 'ACTIVE_ROW_COLOR', activeLineColor);
         s = ctrl.replaceAll(s, 'HOVER_ROW_COLOR', hoverLineColor);
         s = ctrl.replaceAll(s, 'CHECKBOX_COLOR', checkboxColor);
         return s;
      }

      ctrl.handlingLineHeight = (height) => {
        ctrl.listConfig.lineHeight = height;
        ctrl.getStyleMaterialDesign();
      }

      ctrl.editInline = (ev, row, column) => {
        if(ctrl.rowIsDisabled(row)){
          return;
        }
        var columnConfig = ctrl.listConfig.columnsConfig.filter(val => val.name == column)[0];
        if(columnConfig && columnConfig.editable){
          ev.stopPropagation();
          angular.element(ev.target).attr('contenteditable', true)
          var value = angular.element(ev.target).html();
          ctrl.updateVal(ev.target, row, column, value.trim());
        }
      }

      ctrl.rowUpdate = (ev, currentEle, row, column) => {
          var rowModified = angular.copy(row);
          angular.element(ev.target).attr('contenteditable', false);
          if(ctrl.updatingRow) return;
          ctrl.updatingRow = true;
          let newValue = angular.element(ev.target).text().trim();
          rowModified[column] = newValue;
          if(!ctrl.onRowChange){
            throw "O gumga-list precisa que você informe o atributo on-row-change para saber quando os registros forem alterados.";
          }
          ctrl.onRowChange({row: rowModified});
          $timeout(function () {
            ctrl.updatingRow = false;
          }, 100);
      }

      ctrl.updateVal = (currentEle, row, column, value) => {
        currentEle.focus();
        $timeout(()=>{
          angular.element(currentEle).select();
        }, 10)
        angular.element(currentEle).keydown((ev)=> {
          if (ev.keyCode == 13) {
            ev.preventDefault();
            ev.stopPropagation();
            ctrl.rowUpdate(ev, currentEle, row, column);
            return false;
          }
        });
        angular.element(currentEle).blur((ev) => {
            ctrl.rowUpdate(ev, currentEle, row, column);
        });
        angular.element(currentEle).click(function(e) {
             e.stopPropagation();
        });
      }

      ctrl.getPossibleColumns = () => {
          let toReturn =  ctrl.config.columnsConfig
              .filter(column => {
                  return column.possibleColumn;
              });
          return toReturn;
      }

      ctrl.addColumn =  column => {
        column.possibleColumn = false;
        ctrl.config.columns = column.name + ',' + ctrl.config.columns;
        ctrl.config.columnsConfig.unshift(column);
        ctrl.config = angular.copy(ctrl.config);
      }

      ctrl.getTableId = () => {
        var ramdomId = (window.Math.random().toString());
        return ctrl.name ? 'gumga-list-' + ctrl.name : 'gumga-list-'+ctrl.replaceAll(ramdomId, '.', '');
      }

      ctrl.moveColumn = (direction, columnName) => {
        var columns = ctrl.config.columns.replace(/\s/g,'');
        columns = columns.split(',');

        var columnIndex = columns.indexOf(columnName)
        switch (direction.toLowerCase()) {
          case 'left':
            var columnNameRemove = columns[columnIndex-1]
            columns[columnIndex-1] = columnName
            columns[columnIndex] = columnNameRemove
            break;
          case 'right':
            var columnNameRemove = columns[columnIndex+1]
            columns[columnIndex+1] = columnName
            columns[columnIndex] = columnNameRemove
            break;
        }
        ctrl.config.columns = columns.toString();
        ctrl.config = angular.copy(ctrl.config);
        ctrl.setOrderColumnsStorage(ctrl.config.columns);
      }

      ctrl.isPosssibleLeft = (columnName, index) => {
        if(!ctrl.listConfig.ordination) return false;
        if(columnName == '$checkbox' || index == 0) return false;
        if(ctrl.listConfig.checkbox && index == 1) return false;
        return true;
      }

      ctrl.isPosssibleRight = (columnName, index) => {
        if(!ctrl.listConfig.ordination) return false;
        if(columnName == '$checkbox') return false;
        if(index == ctrl.listConfig.columnsConfig.length-1) return false;
        return true;
      }

      ctrl.setOrderColumnsStorage = (columns) => {
        window.sessionStorage.setItem('ngColumnOrder.gumga-list-'+ctrl.getTableId(), columns)
      }

      ctrl.getOrderColumnsStorage = (columns) => {
        return window.sessionStorage.getItem('ngColumnOrder.gumga-list-'+ctrl.getTableId());
      }

      ctrl.checkResizer = () => {
        if($element.find('table')[0] && $element.find('table')[0].loadResize){
          $element.find('table')[0].loadResize();
        }
      }

      ctrl.visibleRow = row => !row['LIST-LOADING'];
    }

    return {
      restrict: 'E',
      scope: {
        'name': '@?',
        'sort': '&?',
        'data': '=',
        'selectedValues': '=?',
        'onClick': '&?',
        'onDoubleClick': '&?',
        'onSort': '&?',
        'config': '=configuration',
        'changePerPage': '&?',
        'maxHeight': '@?',
        'pagePosition': '@?',
        'pageAlign': '@?',
        'pageSize': '=?',
        'count': '=?',
        'pageModel': '=?',
        'onPageChange': '&?',
        'onRowChange': '&?',
        'activeSorted' : '=?'
      },
      bindToController: true,
      controllerAs: 'ctrl',
      transclude: true,
      controller
    }
}

angular.module('gumga.list', ['gumga.list.creator', 'ngSmartGridResize'])
  .directive('gumgaList', List)
