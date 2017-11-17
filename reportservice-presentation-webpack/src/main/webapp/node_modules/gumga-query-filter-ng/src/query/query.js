// (function(){
  //Description
  Search.$inject = ['$q','$timeout','$compile','$interpolate', '$rootScope' ]

  function Search($q, $timeout, $compile, $interpolate, $rootScope){

    let template = `
    <style>
      gumga-query .gumga-date {
        left:0 !important;
        top:35px;
      }
    </style>
     <div class="input-group">
        <input type="text" placeholder="Busque seus filtros salvos" class="form-control" ng-model="ctrl.searchField" ng-keyup="ctrl.doSearch(ctrl.searchField, $event, 'TYPEAHEAD')" uib-typeahead="item.description for item in ctrl.proxyFn($viewValue)" typeahead-on-select="ctrl.filterSelect($item, $model, $label, $event)" ng-show="ctrl.hasQuerySaved && openFilter"/>
            
        <input type="number" ng-if="ctrl.getInputType() == 'number'" ng-disabled="ctrl.getActivesFields().length == 0 || openFilter" class="form-control" ng-model="ctrl.searchField" ng-keyup="ctrl.doSearch(ctrl.searchField, $event)" ng-show="!ctrl.hasQuerySaved || !openFilter" />
        <input type="text" ng-if="ctrl.getInputType() == 'text'" ng-disabled="ctrl.getActivesFields().length == 0" class="form-control" ng-model="ctrl.searchField" ng-keyup="ctrl.doSearch(ctrl.searchField, $event)" ng-show="!ctrl.hasQuerySaved || !openFilter" />
        
        <input type="date" ng-if="ctrl.getInputType() == 'date' && !ctrl.useGumgaDate()" ng-disabled="ctrl.getActivesFields().length == 0" class="form-control" ng-model="ctrl.searchField" ng-keyup="ctrl.doSearch(ctrl.searchField, $event)" ng-show="!ctrl.hasQuerySaved || !openFilter" />
        <gumga-date ng-if="ctrl.getInputType() == 'date' && ctrl.useGumgaDate()" ng-model="ctrl.searchField" ng-disabled="ctrl.getActivesFields().length == 0" ng-keyup="ctrl.doSearch(ctrl.searchField, $event)" ng-show="!ctrl.hasQuerySaved || !openFilter"></gumga-date>
        
        <span class="input-group-btn" uib-dropdown uib-keyboard-nav auto-close="outsideClick">
          <button class="btn btn-default" type="button" uib-dropdown-toggle>
            <span class="glyphicon glyphicon-chevron-down"><span>
          </button>
          <ul uib-dropdown-menu role="menu" aria-labelledby="single-button" class="dropdown-menu-search">
            <li role="menuitem" ng-repeat="(key, $value) in ctrl.mapFields" style="{{ctrl.isDisabled($value.field) ? 'opacity: 0.3;' : ''}}">
              <a class="no-padding-search-fields">
                <label ng-click="ctrl.checkFields($event, $value.field)">
                  <input type="checkbox" ng-model="$value.checkbox" style="pointer-events: none;"/>
                  {{::$value.label}}
                </label>
              </a>
            </li>
          </ul>
          <button class="btn btn-default" ng-click="openFilter = !openFilter" type="button">
            <span class="glyphicon glyphicon-filter"></span>
          </button>
          <button class="btn btn-primary" type="button" ng-click="ctrl.doSearch(ctrl.searchField)" ng-disabled="openFilter">
            <span> {{::ctrl.searchText}} </span>
            <span class="glyphicon glyphicon-search rotate-search-glyph"></span>
          </button>
        </span>
      </div>
      <div class="row replace-filter">
        <div class="col-md-12">
          <div id="replaceFilter"></div>
        </div>
      </div>`

    controller.$inject = ['$scope', '$element', '$attrs', '$transclude']

    function controller($scope, $element, $attrs, $transclude){
      let ctrl = this

      const hasAttr             = string  => (!!$attrs[string]),
            FIELD_ERR           = 'É necessário um parâmetro field na tag search-field.[<search-field field="foo"></search-field>]',
            SEARCH_ERR          = 'É necessário passar uma função para o atributo "search". [search="foo(field, param)"]'

      ctrl.mapFields              = {}
      ctrl.possibleAdvancedFields = []

      const SOURCE_CHARS = "'âàãáÁÂÀÃéêÉÊíÍóôõÓÔÕüúÜÚÇç'";
      const TARGET_CHARS = "'AAAAAAAAEEEEIIOOOOOOUUUUCC'";

      ctrl.uid = guid();
      
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      if(!hasAttr('search')) console.error(SEARCH_ERR)

      $transclude((transcludeElement) => {
        let alreadySelected = false,
            parentContext   = $scope.$parent;

        [].slice.call(transcludeElement).forEach(value => {

          if(value && value.nodeName === 'ADVANCED-SEARCH-FIELD') ctrl.possibleAdvancedFields.push(value.outerHTML)
          if(!value || value.nodeName !== 'SEARCH-FIELD') return

          let element   = angular.element(value),
              field     = element.attr('field') ? element.attr('field') : '',
              type     = element.attr('type') ? element.attr('type') : 'string',
              checkbox  = !!$scope.$eval(element.attr('select')),
              label     = element.attr('label') ? $interpolate(element.attr('label'))(parentContext) : field.charAt(0).toUpperCase().concat(field.slice(1)),
              innerJoin = element.attr('inner-join') ? element.attr('inner-join').split(',') : [],
              leftJoin = element.attr('left-join') ? element.attr('left-join').split(',') : [],
              ignoreCase = element.attr('ignore-case') == "false" ? false : true,
              translate = element.attr('translate') == "false" ? false : true;

          if(!field)      console.error(FIELD_ERR)
          if(checkbox)    alreadySelected = true
          ctrl.mapFields[field] = { checkbox, label, field, type, innerJoin, leftJoin, ignoreCase, translate }
        })

        if(!alreadySelected){
          for(var first in ctrl.mapFields) break
          if(first) ctrl.mapFields[first].checkbox = true
        }
      })



      ctrl.$onInit = () => {
        ctrl.compileFilter      = compileFilter
        ctrl.doSearch           = doSearch
        ctrl.proxyFn            = proxyFn
        ctrl.filterSelect       = filterSelect
        ctrl.advancedSearch     = hasAttr('advancedSearch') ? ctrl.advancedSearch   : null
        ctrl.containerAdvanced  = hasAttr('containerAdvanced') ? ctrl.containerAdvanced : "replaceFilter"
        ctrl.savedFilters       = hasAttr('savedFilters')   ? ctrl.savedFilters     : angular.noop
        ctrl.searchText         = hasAttr('searchText')     ? $attrs['searchText']  : ' '
        ctrl.proxySearch        = (param) => ctrl.advancedSearch({ param })
        ctrl.hasQuerySaved      = !!$attrs.savedFilters
        $scope.proxySave        = (query, name) => ctrl.saveQuery({ query, name })
        if(ctrl.advancedSearch) ctrl.compileFilter()
      }

      function compileFilter(){
        let template  = `<gumga-filter-core uid="${ctrl.uid}" ng-show="openFilter" use-gquery="${$attrs.useGquery}" is-open="true" search="ctrl.proxySearch(param)" ${$attrs.saveQuery ? 'save-query="saveQuery(query, name)"' : ''}is-query="true">${ctrl.possibleAdvancedFields.reduce(((prev, next) => prev += next), '')}</gumga-filter-core>`,
        element   = angular.element($element.find('#'+ctrl.containerAdvanced));
        element.replaceWith($compile(template)($scope));
      }

      const getTypeInputByTypeField = (type) => {
        switch(type){
          case 'string':
            return 'text';
          case 'number':
            return 'number';
          case 'date':
            return 'date';
          default:
            return 'text';  
        }
      }

      ctrl.getInputType = () => {
        let selecteds = Object
        .keys(ctrl.mapFields)
        .filter(value => !!ctrl.mapFields[value].checkbox);
        if(selecteds.length == 0) ctrl.searchSimpleType = 'text';
        let type = ctrl.mapFields[selecteds[0]] && ctrl.mapFields[selecteds[0]].type ? ctrl.mapFields[selecteds[0]].type : 'string';
        ctrl.searchSimpleType = getTypeInputByTypeField(type);
        return ctrl.searchSimpleType;
      }

      function doSearch(param, event = { keyCode: 13 }, inputType){
          if(event.keyCode !== 13 || inputType == 'TYPEAHEAD') return;
          let result = Object
                      .keys(ctrl.mapFields)
                      .filter(value => !!ctrl.mapFields[value].checkbox)
                      .reduce((prev, next) => (prev += next.concat(',')), '')
                      .slice(0, -1);



          if(result.length === 0) return;
          if(ctrl.useGquery){
            let query = new GQuery();
            result = result.split(',');

            let innerJoins = [];
            let leftJoins = [];

            let selecteds = Object
            .keys(ctrl.mapFields)
            .filter(value => !!ctrl.mapFields[value].checkbox);

            selecteds.map(key => {
              return ctrl.mapFields[key];
            }).forEach(field => {
              if (field.innerJoin) {
                field.innerJoin.forEach(innerJoin => {
                  if(innerJoins.indexOf(innerJoin) == -1){
                    innerJoins.push(innerJoin);
                  }
                })
              }

              if (field.leftJoin) {
                field.leftJoin.forEach(leftJoin => {
                  if(leftJoins.indexOf(leftJoin) == -1){
                    leftJoins.push(leftJoin);
                  }
                })
              }

            })

            result.forEach((field, index) => {
              let criteria = null;
              if(param != undefined && param != null){
                criteria = new Criteria(field, getComparisonOperatorByType(field), param == undefined || param == null ? '' : param);
              }
              if(ctrl.mapFields[field].type == 'number' && param != undefined && param != null) {
                criteria = new Criteria(field, getComparisonOperatorByType(field), param == undefined || param == null ? 0 : Number(param));
              } else if(ctrl.mapFields[field].type == 'date' && param) {
                criteria = new Criteria(field, getComparisonOperatorByType(field), param == undefined || param == null ? new Date() : new Date(param));
              } else if(ctrl.mapFields[field].type == 'string') {
                  criteria.setFieldFunction('%s');
                  criteria.setValueFunction('%s');
                  
                if(ctrl.mapFields[field].ignoreCase) {
                    criteria.setFieldFunction(addIgnoreCase(criteria.getFieldFunction()));
                    criteria.setValueFunction(addIgnoreCase(criteria.getValueFunction()));
                }

                if(ctrl.mapFields[field].translate) {
                    criteria.setFieldFunction(addTranslate(criteria.getFieldFunction()));
                    criteria.setValueFunction(addTranslate(criteria.getValueFunction()));
                }
              }
              
              if(index == 0){ 
                query = new GQuery(criteria);
              }else{
                query = query.or(criteria);
              }

            });

            innerJoins.forEach(function(innerJoin) {
              query.join(new Join(innerJoin, JoinType.INNER))
            })

            leftJoins.forEach(function(leftJoin) {
              query.join(new Join(leftJoin, JoinType.LEFT))
            })

            if($attrs.lastGquery){
              ctrl.lastGquery = angular.copy(query);
            }
            ctrl.search({ param: query });
          }else{
            ctrl.search({ field: result, param: param })
          }
      }

      function addIgnoreCase(value) {
        return value.replace(/%s/g, "lower(%s)");
      }

      function addTranslate(value) {
          return value.replace(/%s/g, "translate(%s, "+SOURCE_CHARS+","+TARGET_CHARS+")");
      }

      function getComparisonOperatorByType(field){
        if(ctrl.mapFields[field].type == 'string'){
          return ComparisonOperator.CONTAINS;
        }
        return ComparisonOperator.EQUAL;
      }

      $scope.$watch('openFilter', (open) => {
        if(open != undefined) $rootScope.$broadcast('openOrCloseFilter'+ctrl.uid, open);
      })

      ctrl.getActivesFields = () => {
        return Object.keys(ctrl.mapFields).filter(value => !!ctrl.mapFields[value].checkbox);
      }

      ctrl.isDisabled = (field) => {
        let someChecked = ctrl.getActivesFields();
        if(ctrl.mapFields[field] && ctrl.mapFields[field].type){
          let differentKinds = someChecked.filter(some => ctrl.mapFields[some].type != ctrl.mapFields[field].type);
          return differentKinds.length > 0;
        }
      }

      ctrl.checkFields = (event, field) => {
        let someChecked = ctrl.getActivesFields();
        // if ((someChecked.length == 1 && someChecked[0] == field) || Object.keys(ctrl.mapFields).length == 1) {
        //   event.preventDefault();
        // }
        if(ctrl.mapFields[field] && ctrl.mapFields[field].type && getTypeInputByTypeField(ctrl.mapFields[field].type) != ctrl.searchSimpleType){
          delete ctrl.searchField;
        }
        if(ctrl.mapFields[field] && ctrl.mapFields[field].type){
          let differentKinds = someChecked.filter(some => ctrl.mapFields[some].type != ctrl.mapFields[field].type);        
          if(differentKinds.length > 0){          
            ctrl.mapFields[field].checkbox = false;
          }
        }



        event.stopPropagation();
      }

      ctrl.useGumgaDate = function() {
        try {
          return false// !!angular.module('gumga.date');
        } catch (error) {
          return false;
        }
      }

      function proxyFn($value){
        return $q.when(ctrl.savedFilters({ page: location.hash }))
      }

      function filterSelect($item, $model, $label, $event){
        $timeout(() => (ctrl.searchField=  '', $scope.$broadcast('filter-items', $item)))
      }
    }

    return {
      restrict: 'E',
      scope: {
        search: '&',
        advancedSearch: '&?',
        containerAdvanced: '@?',
        savedFilters: '&?',
        saveQuery:'&?',
        useGquery:'=?',
        lastGquery:'=?'
      },
      bindToController: true,
      transclude: true,
      controllerAs: 'ctrl',
      controller,
      template
    }
  }

  angular.module('gumga.queryfilter.query', [])
    .directive('gumgaQuery', Search)

// })()
