
'use strict'

Filter.$inject = ['HQLFactory', '$compile', '$timeout', '$interpolate', 'QueryModelFactory', '$filter']
function Filter(HQLFactory, $compile, $timeout, $interpolate, QueryModelFactory, $filter) {
  let template = `
        <style>
          .gumga-filter .dropdown-menu > li > a {
            cursor: pointer;
          }
          .gumga-filter .panel-body .input-group-btn {
            border: 1px solid #ccc;
            border-left-width: 2px;
            border-right-width: 2px;
            border-radius: 4px;
          }
          .gumga-filter .panel-body .input-group-btn .btn {
            border-color: transparent;
            border-radius: 4px;
            border: 1px;
          }
          .gumga-filter .panel-body .btn,
          .gumga-filter .panel-body .input-group-btn .btn {
            padding: 3px 6px;
          }
          .gumga-filter-panel {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            float: left;
            min-width: 160px;
            padding: 12px;
            margin: 2px 0 0;
            font-size: 14px;
            text-align: left;
            background-color: #fff;
            border: 1px solid #ccc;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: 4px;
            box-shadow: 0 6px 12px rgba(0,0,0,.175);
            background-clip: padding-box;
          }
          .gumga-filter-panel .dropdown-menu li {
            z-index: 3000;
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            float: left;
            min-width: 160px;
            padding: 12px;
            margin: 2px 0 0;
            font-size: 14px;
            text-align: left;
            background-color: #fff;
            border: 1px solid #ccc;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: 4px;
            box-shadow: 0 6px 12px rgba(0,0,0,.175);
            background:-clip padding-box;
          }
          gumga-filter .panel.heading {
            padding: 5px 10px;
          }
          gumga-filter .form-inline.panel-body .input-group {
            margin-right: 5px;
          }
          gumga-filter .form-inline.panel-body .input-group-btn > button,
          gumga-filter .form-inline.panel-body .input-group-btn > btn-group > button[uib-dropdown-toggle] {
            z-index: 0;
          }
          gumga-filter .form-inline.panel-body .input-group-btn > btn-group > ul[uib-dropdown-menu],
          gumga-filter .form-inline.panel-body .input-group-btn > btn-group > ul[uib-dropdown-menu] > li {
            z-index: 3000;
          }
          gumga-filter .btn-group.dropdown .glyphicon {
            top: 3px;
          }
          gumga-query .row.replace-filter {
            margin-top: .5%;
          }
        </style>
        <div class="gumga-filter panel panel-default" >
            <header class="panel-heading" style="padding: 5px 10px;">
                <div class="row">
                    <div class="col-md-8 col-xs-7">
                        <h5>Pesquisa avançada <strong ng-if="filterSelectItem"> - {{filterSelectItem.description}}</strong></h5>
                    </div>
                    <div class="col-md-4 col-xs-5" ng-show="saveQuery">
                        <div class="input-group" >
                            <input type="text" ng-model="nameSearch" class="form-control" id="_save" ng-show="saveFilterOpen" ng-keyup="saveSearch(nameSearch, $event)" ng-blur="closeInput()">
                            <div class="input-group-btn">
                                <button class="btn btn-success" ng-show="saveFilterOpen" ng-click="saveSearch(nameSearcht)" ng-disabled="!nameSearch">
                                    <i class="glyphicon glyphicon-floppy-saved"></i>
                                </button>
                                <button class="btn btn-default pull-right" type="button" ng-hide="saveFilterOpen" ng-click="showInput()" ng-disabled="!isAnyQueryNotOk()">
                                    <i class="glyphicon glyphicon-floppy-disk"></i>
                                </button>
                                <button class="btn btn-default"  ng-click="deleteFilter(filterSelectItem.id)" ng-if="filterSelectItem" style="float: right;margin-right: 15px;">
                                    <i class="glyphicon glyphicon-floppy-remove"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div class="form-inline panel-body">
              <div class="row">
                <div class="col-md-6">
                  <h5><strong>Filtrar por:</strong></h5>
                </div>
                <div class="col-md-6">
                  <button id="single-button" type="button" class="btn btn-default pull-right" ng-click="clearQuery()" ng-disabled="!isAnyQueryNotOk()" >
                    <i class="glyphicon glyphicon-repeat"></i> Limpar filtros
                  </button>
                </div>
              </div>
              <div class="input-group" ng-repeat="($key, $value) in controlMap" style="margin-right: 1%;margin-top: 7.5px;z-index: {{$value.zIndex}}" ng-show="$value.active" id="first" >
                  <div class="input-group-btn">
                    <div class="btn-group" uib-dropdown ng-show="!$value.query.label" is-open="$value.isUPDATING_ATTRIBUTE()" auto-close="disabled">
                      <button type="button" style="z-index: 0" class="btn btn-default" uib-dropdown-toggle ng-click="toggleUpdatingAttribute(this)" ng-disabled="$value.isUPDATING_VALUE() || $value.isUPDATING_CONDITION() || (!isAnyQueryNotOk() && $value.isEVERYTHING_NEEDED()) ">
                        <span> {{ $value.query.attribute.label || 'Atributo' }}  <i class="glyphicon glyphicon-chevron-down"></i></span>
                      </button>
                      <ul uib-dropdown-menu style="z-index: 3000" role="menu">
                        <li style="z-index: 3000;" role="menuitem" ng-repeat="attribute in _attributes track by $index">
                          <a ng-click="addAttribute(attribute, this.$parent, $key)">{{attribute.label}}</a>
                        </li>
                      </ul>
                    </div>
                    <div class="btn-group" uib-dropdown is-open="$value.isUPDATING_CONDITION()" ng-show="!$value.query.label" auto-close="disabled">
                      <button type="button" class="btn btn-default" uib-dropdown-toggle ng-click="toggleUpdatingCondition(this)" ng-disabled="$value.isUPDATING_VALUE() || $value.isUPDATING_ATTRIBUTE() || (!isAnyQueryNotOk() && $value.isEVERYTHING_NEEDED()) || $value.isNOTHING()">
                          <span>{{ $value.query.condition.label || 'Condição' }} <i class="glyphicon glyphicon-chevron-down"></i></span>
                      </button>
                      <ul uib-dropdown-menu role="menu" >
                        <li role="menuitem" ng-repeat="condition in conditions track by $index">
                          <a ng-click="addCondition(condition, this.$parent, $key)">{{condition.label}}</a>
                        </li>
                      </ul>
                    </div>
                    <div class="btn-group" id="_btnValue{{$key}}" ng-show="!$value.query.label">
                      <button type="button" class="btn btn-default" ng-click="toggleUpdatingValue(this, $key)" ng-disabled="validatonValue($value)" id="_valueLabel{{$key}}">
                          <span id="_conditionLabel{{$key}}">{{ getTextQuery($value) }} </span>
                      </button>
                      <div class="gumga-filter-panel" id="_panelValue{{$key}}"></div>
                    </div>
                    <div class="btn-group" ng-show="$value.query.label">
                      <button type="button" class="btn btn-default" ng-click="updateOperator(this)" ng-disabled="!isAnyQueryNotOk()">
                        <span> {{$value.query.label}} </span>
                      </button>
                    </div>
                    <button type="button" 
                            style="z-index: 0;border-left: 1px solid #ccc; " 
                            class="btn btn-default" 
                            ng-click="removeQuery(this, $event, $index)" 
                            ng-show="!$value.query.label">
                      <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    </div>
                  </div>
                  <button id="single-button" 
                          type="button" 
                          class="btn btn-default" 
                          ng-click="addQuery()" 
                          ng-disabled="!isAnyQueryNotOk()" 
                          style="margin-top: 7.5px;" >
                    <span class="glyphicon glyphicon-plus"></span>
                  </button>
                </div>
              </div>
            </div>
        </div>`

  return {
    restrict: 'E',
    template: template,
    transclude: true,
    scope: {
      search: '&',
      saveQuery: '&',
      useGquery: '=?',
      uid: '@?'
    },
    link: ($scope, $element, $attrs, $ctrl, $transclude) => {
      const outerScope = $scope.$parent.$parent
      const FIELD_ERR = `É necessário atribuir um valor ao atributo FIELD da tag ADVANCED-SEARCH-FIELD.`,
        TYPE_ERR = `O tipo "{1}" passado como parâmetro para o ADVANCED-SEARCH-FIELD não é suportado.`,
        NOTYPE_ERR = `É necessário atribuir um valor ao atributo TYPE da tag ADVANCED-SEARCH-FIELD.`,
        SEARCH_ERR = `É necessário atribuir uma função para o atributo SEARCH. [search="foo()"]`

      var zIndexInitial = 999

      $scope._attributes = []
      $scope.controlMap = {}
      $scope.addCondition = addCondition
      $scope.addQuery = addQuery
      $scope.clearQuery = clearQuery
      $scope.closeInput = closeInput
      $scope.removeQuery = removeQuery
      $scope.showInput = showInput
      $scope.saveSearch = saveSearch
      $scope.updateOperator = updateOperator
      $scope.toggleEnum = toggleEnum
      $scope.saveQuery = $attrs.saveQuery ? $scope.saveQuery : false

      if (!$attrs.search) console.error(SEARCH_ERR)

      $scope.$on('filter-items', (err, data) => {
        let value = JSON.parse(data.value)
        $scope.controlMap = {}
        if($scope.useGquery){
          $timeout(() => $scope.search({ param: value }));
        }else{
          JSON.parse(value.source).forEach((val, index) => {
            if (index % 2 == 0) {
              $scope.controlMap[index] = QueryModelFactory.create(val, true, 'EVERYTHING_NEEDED', zIndexInitial--)
            } else {
              $scope.controlMap[index] = QueryModelFactory.create({ value: val.value, label: val.value === 'AND' ? 'E' : 'OU' }, undefined, 'EVERYTHING_NEEDED', zIndexInitial--)
            }
          })
          $scope.filterSelectItem = data;
          $timeout(() => $scope.search({ param: HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent) }));
        }
      })

      $scope.getTextQuery = ($value) => {
         var toReturn = 'valor';
         if($value && $value.query && $value.query.attribute){
           if($value.query.attribute.type && $value.query.attribute.type == 'select' && $value.query.value != undefined && $value.query.value != null){
             let data = $value.query.attribute.extraProperties.data.filter(data => data.field == $value.query.value);
             if(data.length > 0){
               return data[0].label;
             }
           }
           toReturn = $filter('gumgaGenericFilter')(($value.query.value ? $value.query.value.push && $value.query.value.length > 0  ? $value.query.value.join(', ') : $value.query.value : 'valor'), $value.query.attribute.type);
         }
         return toReturn;
      }

      $scope.$on('openOrCloseFilter'+$scope.uid, (event, openOrClose) => {
        if (!openOrClose) {
          delete $scope.filterSelectItem;
          Object.keys($scope.controlMap)
            .forEach(key => {
              const scope = getIndexScope(key)
              scope.$value.active = false;
              delete $scope.controlMap[key]
              $timeout(_ => scope.$destroy())
            })

          $scope.search({ param: {} });
          return
        }

        // if (!$scope.controlMap['0']) 
        initialize()

      })

      $transclude((transcludeElement) => {
        let parentContext = $scope.$parent.$parent;

        [].slice.call(transcludeElement).forEach((value, $index) => {
          if (value.nodeName !== 'ADVANCED-SEARCH-FIELD') return
          if (!value.getAttribute('field')) return console.error(FIELD_ERR)

          let field = value.getAttribute('field'),
            type = value.getAttribute('type'),
            innerJoin = value.getAttribute('inner-join') ? value.getAttribute('inner-join').split(',') : [],
            leftJoin = value.getAttribute('left-join') ? value.getAttribute('left-join').split(',') : [],
            label = value.getAttribute('label') ? $interpolate(value.getAttribute('label'))(parentContext) : field.charAt(0).toUpperCase().concat(field.slice(1)),
            extraProperties = {},
            ignoreCase = value.getAttribute('ignore-case') == "false" ? false : true,
            translate = value.getAttribute('translate') == "false" ? false : true;

          if (!type) return console.error(NOTYPE_ERR)

          type = type.toLowerCase().trim() || ''
          label = label || field.charAt(0).toUpperCase() + field.slice(1)
          extraProperties = getExtraProperties(value)

          if (!HQLFactory.useType(type)) return console.error(TYPE_ERR.replace('{1}', type))

          $scope._attributes.push({ field, type, label, extraProperties, innerJoin, leftJoin, ignoreCase, translate })
        })
      })

      if (!$scope._attributes[0]) return;
      const getElm = string => angular.element($element.find('#'+string))
      const initialize = _ => {
        $scope.controlMap['0'] = QueryModelFactory.create({ attribute: {}, condition: {}, value: '' }, true, 'NOTHING', zIndexInitial--)

        $timeout(_ => {
          var indexScope = getIndexScope();
          indexScope.$value.removeState('NOTHING').addState('UPDATING_ATTRIBUTE');
        })
      }

      initialize()

      let defaultAttribute = angular.copy($scope._attributes[0]),
        defaultCondition = angular.copy(HQLFactory.useType(defaultAttribute.type).defaultCondition)[0]


      $scope.addAttribute = addAttribute
      $scope.toggleUpdatingAttribute = toggleUpdatingAttribute

      $scope.addCondition = addCondition
      $scope.toggleUpdatingCondition = toggleUpdatingCondition

      $scope.toggleUpdatingValue = toggleUpdatingValue

      $scope.goSearch = goSearch

      $scope.callSearch = callSearch

      $scope.deleteFilter = deleteFilter

      $scope.isAnyQueryNotOk = isAnyQueryNotOk

      $scope.lastOfControlMap = lastOfControlMap

      $scope.getIndexScope = getIndexScope

      $scope.validatonValue = validatonValue

      function addAttribute(selectedAttribute, scope, key) {
        scope.$value.query.attribute = selectedAttribute
        scope.conditions = HQLFactory.useType(selectedAttribute.type).conditions
        scope.validator = HQLFactory.useType(selectedAttribute.type).validator

        scope.$value.removeState('UPDATING_ATTRIBUTE').removeState('NOTHING').addState('ONLY_ATTRIBUTE')

        $timeout(() => {
          scope.$value.addState('UPDATING_CONDITION')
          if (scope.$value.isEVERYTHING_NEEDED()) {
            scope.$value.removeState('EVERYTHING_NEEDED')
            scope.$value.query.value = ''
          }
        })
      }

      function goSearch(event) {
        if (event.keyCode == 13) {
          callSearch(event);
        }
      }

      function deleteFilter(filterId) {
        //TODO fazer o deletar filtro
      }

      function toggleUpdatingAttribute(scope) {
        scope.$value.isUPDATING_ATTRIBUTE() ? scope.$value.removeState('UPDATING_ATTRIBUTE') : scope.$value.addState('UPDATING_ATTRIBUTE')
      }

      function addCondition(selectedCondition, scope, key) {
        scope.$value.query.condition = selectedCondition
        scope.$value.removeState('UPDATING_CONDITION').removeState('ONLY_ATTRIBUTE')
        $timeout(() => {
          if (!scope.$value.isEVERYTHING_NEEDED()) {
            scope.$value.removeState('ATTRIBUTE_AND_CONDITION').addState('UPDATING_VALUE')
            compileContent(key, scope)
          } else {
            $scope.search({ param: HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent) });
          }
        })
      }

      function compileContent(key, scope) {
        let elm = getElm(`_panelValue${key}`)
        elm.addClass('show')
        if (scope.$value.query.attribute.type == 'enum') {
          elm.attr('style', 'width: 500px')
        } else if (scope.$value.query.attribute.type !== 'enum' && elm.attr('style')) {
          elm.removeAttr('style')
        }
        $compile(elm.html(HQLFactory.useType(scope.$value.query.attribute.type).template).contents())(scope)
      }

      function toggleUpdatingCondition(scope) {
        scope.$value.isUPDATING_CONDITION() ?
          scope.$value.removeState('UPDATING_CONDITION')
          : scope.$value.addState('UPDATING_CONDITION')
      }

      function toggleUpdatingValue(scope, key) {
        scope.$value.isUPDATING_VALUE() ?
          (scope.$value.removeState('UPDATING_VALUE'), getElm(`_panelValue${key}`).addClass('show'))
          : (scope.$value.addState('UPDATING_VALUE'), getElm(`_panelValue${key}`).addClass('show'))
      }

      function isAnyQueryNotOk() {
        return Object.keys($scope.controlMap).filter((intern) => {
          return (!$scope.controlMap[intern].isEVERYTHING_NEEDED()
          || $scope.controlMap[intern].isUPDATING_ATTRIBUTE()
          || $scope.controlMap[intern].isUPDATING_CONDITION()
          || $scope.controlMap[intern].isUPDATING_VALUE()) && $scope.controlMap[intern].active
        }).filter(value => (parseInt(value) % 2 == 0)).length === 0
      }

      function lastOfControlMap() {
        return Object.keys($scope.controlMap)[Object.keys($scope.controlMap).length - 1]
      }

      function getIndexScope(index = 0) {
        let desiredScope = angular.element($element.find('#first')).scope()
        while (desiredScope.$index != index) {
          if (desiredScope.$$nextSibling == null) break;
          desiredScope = desiredScope.$$nextSibling
        }
        return desiredScope
      }

      function validatonValue($value) {
        return $value && ($value.isNOTHING()
          || $value.isUPDATING_ATTRIBUTE()
          || $value.isUPDATING_VALUE()
          || $value.isUPDATING_CONDITION()
          || !($value.isEVERYTHING_NEEDED() || !$value.isATTRIBUTE_AND_CONDITION())
          || (!isAnyQueryNotOk() && $value.isEVERYTHING_NEEDED()))
      }


      function toggleEnum(event, key, field) {
        event.stopPropagation()
        let elm = getElm(`_panelValue${key}`).scope();
        if (!Array.isArray(elm.$value.query.value)) elm.$value.query.value = [];
        var index = elm.$value.query.value.indexOf(field)
        if (index > -1) {
          elm.$value.query.value.splice(index, 1)
        } else {
          elm.$value.query.value.push(field)
        }
      }

      function getExtraProperties(value) {
        let properties;
        switch (value.getAttribute('type')) {
          case 'boolean': {
            properties = { trueLabel: value.getAttribute('true-label'), falseLabel: value.getAttribute('false-label') }
            break;
          }
          case 'select': {
            properties = { data: outerScope[value.getAttribute('data')] }
            break;
          }
          case 'enum': {
            properties = { data: outerScope[value.getAttribute('data')] }
          }
        }
        return properties;
      }


      function addValue(index, value) {
        getElm(`_value${index}`).html(value);
      }

      function addQuery() {
        delete $scope.filterSelectItem;
        $scope.controlMap[parseInt(lastOfControlMap()) + 1] = QueryModelFactory.create({ value: 'AND', label: 'E' }, undefined, 'EVERYTHING_NEEDED', zIndexInitial--)
        $scope.controlMap[parseInt(lastOfControlMap()) + 1] = QueryModelFactory.create({ attribute: {}, condition: {}, value: '' }, undefined, 'NOTHING', zIndexInitial--)
        $timeout(() => getIndexScope(parseInt(lastOfControlMap())).$value.addState('UPDATING_ATTRIBUTE'));
      }

      function clearQuery() {
        $scope.controlMap = []
        initialize()
      }

      function closeInput() {
        $timeout(() => {
          $scope.saveFilterOpen = false
        }, 200)
      }

      function showInput() {
        $scope.saveFilterOpen = true
        $timeout(() => $element.find('$_save').focus())
      }

      function saveSearch(name, event) {
        if (!event || event.keyCode == 13) {
          $scope.$parent.proxySave(HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent), $scope.nameSearch)
          $scope.saveFilterOpen = !$scope.saveFilterOpen;
          $scope.nameSearch = '';
        }
      }

      function removeQuery(scope, e, index) {
        delete $scope.filterSelectItem;
        if (!scope.$$prevSibling.$key && !scope.$$nextSibling) {
          scope.$value.query = { attribute: {}, condition: {}, value: '' }
          scope.$value.activeStates = 0;
          $timeout(() => scope.$value.addState('UPDATING_ATTRIBUTE'))
          callSearch(e, 'remove', index);
          return
        }
        if (!scope.$$prevSibling.$key && scope.$$nextSibling) {
          scope.$value.active = false
          scope.$$nextSibling.$value.active = false
          $timeout(() => (scope.$$nextSibling.$destroy(), scope.$destroy()))
          callSearch(e, 'remove', index);
          return
        }
        if (scope.$$prevSibling.$key) {
          scope.$value.active = false
          scope.$$prevSibling.$value.active = false
          $timeout(() => (scope.$$prevSibling.$destroy(), scope.$destroy()))
          callSearch(e, 'remove', index);
        }
      }


      function updateOperator(scope) {
        if (scope.$value.query.value === 'AND') {
          scope.$value.query.value = 'OR'
          scope.$value.query.label = 'OU'
          $scope.search({ param: HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent) });
          return
        }
        scope.$value.query.value = 'AND'
        scope.$value.query.label = 'E'
        $scope.search({ param: HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent) });
      }

      document.addEventListener('click', (e) => {
        callSearch(e);
      });

      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) {
          Object.keys($scope.controlMap)
            .forEach(key => {
              const scope = getIndexScope(key)
              if (scope.$value.activeStates !== 8) {
                if (scope.$$prevSibling.$key) {
                  scope.$$prevSibling.$value.active = false
                  delete $scope.controlMap[scope.$$prevSibling.$key]
                  $timeout(() => (scope.$$prevSibling.$destroy()))
                } else if (scope.$$nextSibling.$key) {
                  scope.$$nextSibling.$value.active = false
                  delete $scope.controlMap[scope.$$nextSibling.$key]
                  $timeout(() => (scope.$$nextSibling.$destroy()))
                } else if (scope.$$prevSibling.$key && scope.$$nextSibling.$key) {
                  scope.$$nextSibling.$value.active = false
                  delete $scope.controlMap[scope.$$nextSibling.$key]
                  $timeout(() => (scope.$$nextSibling.$destroy()))
                }
                scope.$value.active = false
                delete $scope.controlMap[key]
                $timeout(_ => scope.$destroy())
              }
            })
        }
      })

      function callSearch(e, typeSearch, positionCondition = -1) {
        let outerClick = true
        let updatingValue = Object.keys($scope.controlMap).filter((intern) => $scope.controlMap[intern].isUPDATING_VALUE())[0],
          validator;

        const isPanelAParent = (element, id) => {
          for (var desired = angular.element(element); desired.parent().length != 0; desired = desired.parent()) if (desired[0].id == `_panelValue${id}`) {
            desired = true
            break;
          }
          return desired === true ? desired : false
        }

        if (e.target.id == `_conditionLabel${updatingValue}` || e.target.id == `_valueLabel${updatingValue}`) {
          return
        }

        if (e.target.id == `_panelValue${updatingValue}` || isPanelAParent(e.target, updatingValue)) {
          outerClick = false
        }

        if ($scope.controlMap[updatingValue]) {
          validator = HQLFactory.validator($scope.controlMap[updatingValue].query.attribute.type)
        }
        if (outerClick && validator && validator($scope.controlMap[updatingValue].query.value) || e.type == 'keyup' || typeSearch == "btn") {
          let scopeBeingUpdated = getElm(`_panelValue${updatingValue}`).scope()
          $timeout(() => scopeBeingUpdated.$value.removeState('UPDATING_VALUE').removeState('ATTRIBUTE_AND_CONDITION').addState('EVERYTHING_NEEDED'))
          getElm(`_panelValue${updatingValue}`).removeClass('show')
          $scope.search({ param: HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent) });
        }
        if (typeSearch == "remove") {
          $timeout(() => {
            let param = positionCondition == 0 ? {} : HQLFactory.createHql($scope.controlMap, $scope.useGquery, $scope.$parent);
            $scope.search({ param: param });
          });
        }
      }

    }
  }
}
angular.module('gumga.queryfilter.filter.core', [])
  .directive('gumgaFilterCore', Filter)
