'use strict';

HQLFactory.$inject = ['$filter'];

function HQLFactory($filter){
  /*
    Regex de URL foi retirada do código-fonte do AngularJS, utilizado por eles para validar input[type="url"].
    LINK: https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L26
   */
  const CPF_REGEX       = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}/,
        CNPJ_REGEX      = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/,
        DATE_REGEX      = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/,
        URL_REGEX       = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,
        IP_REGEX        = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/,
        NUMBER_REGEX    = /^[0-9]+$/,
        FLOAT_REGEX     = /^[0-9]+(\.[0-9]{1,2})?$/

  let SUPPORTED_TYPES = {}

  const SOURCE_CHARS = "'âàãáÁÂÀÃéêÉÊíÍóôõÓÔÕüúÜÚÇç'";
  const TARGET_CHARS = "'AAAAAAAAEEEEIIOOOOOOUUUUCC'";

  SUPPORTED_TYPES['string'] = {
    validator: (string) => (typeof string === 'string' || string instanceof String),
    defaultCondition: hqlObjectCreator(['contains']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                  <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" required autofocus style=" width: 150px;height: 40px;" />
                  <div class="input-group-addon">
                      <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                      <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                  </div>
                  <div class="input-group-addon">
                      <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                  </div>
              </div>`
  }

  SUPPORTED_TYPES['number'] = {
    validator: (str) => (NUMBER_REGEX.test(str)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'gt', 'ge', 'lt', 'le']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" gumga-number required style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value)" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value)" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')"  class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['float'] = {
    validator: (number) => (FLOAT_REGEX.test(number)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'gt', 'ge', 'lt', 'le']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" gumga-number required style=" width: 150px;height: 40px;"/>
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value)" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value)" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['money'] = {
    validator: (number) => (FLOAT_REGEX.test(number)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'gt', 'ge', 'lt', 'le']),
    template: `<div class="input-group">
                    <input ng-keyup="goSearch($event)" type="text" ng-model="$value.query.value" gumga-mask="R$ " class="form-control" gumga-number required style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value)" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value)" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['cpf'] = {
    validator: (cpf) => (CPF_REGEX.test(utils.toCpf(cpf))),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" gumga-mask="999.999.999.99" class="form-control" required style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['cnpj'] = {
    validator: (cnpj) => (CNPJ_REGEX.test(cnpj)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" gumga-mask="99.999.999/9999-99" class="form-control" required style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['boolean'] = {
    validator: (boolean) => (boolean == 'true' || boolean == 'false'),
    defaultCondition: hqlObjectCreator(['is']),
    conditions: hqlObjectCreator(['is']),
    template: ` <div class="radio"><label><input  type="radio" ng-model="$value.query.value" value="true"> {{$value.query.attribute.extraProperties.trueLabel}}</label></div><div class="radio"><label><input type="radio" ng-model="$value.query.value" value="false"> {{$value.query.attribute.extraProperties.falseLabel}} </label></div>`
  }

  SUPPORTED_TYPES['date'] = {
    validator: (date) => (DATE_REGEX.test($filter('date')(date, 'dd/MM/yyyy'))),
    defaultCondition: hqlObjectCreator(['date_eq']),
    conditions: hqlObjectCreator(['date_eq', 'date_ne', 'date_lt', 'date_gt']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" gumga-mask="99/99/9999" class="form-control" required  style=" width: 150px;height: 40px;"/>
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['select'] = {
    validator: (value) => (!!value),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne']),
    template: `<select ng-model="$value.query.value" ng-options="d.field as d.label for d in $value.query.attribute.extraProperties.data track by d.field" class="form-control" required /></select>`
  }

  SUPPORTED_TYPES['enum'] = {
    validator: (enumList) => (Array.isArray(enumList)),
    defaultCondition: hqlObjectCreator(['in']),
    conditions: hqlObjectCreator(['in']),
    template: `<div class="col-md-4" ng-class="{'row': $index % 3 == 0}" ng-repeat="d in $value.query.attribute.extraProperties.data"><label><input type="checkbox" ng-checked="$value.query.value.indexOf(d.field) > -1" ng-click="toggleEnum($event, $key, d.field)"></label> {{d.label}}</div>`
  }

  SUPPORTED_TYPES['email'] = {
    validator: (emailAddress) => (typeof emailAddress === 'string' || emailAddress instanceof String),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" required  style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['url'] = {
    validator: (url) => (URL_REGEX.test(url)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                    <input type="url" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" required  style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  SUPPORTED_TYPES['ip'] = {
    validator: (ip) => (IP_REGEX.test(ip)),
    defaultCondition: hqlObjectCreator(['eq']),
    conditions: hqlObjectCreator(['eq', 'ne', 'contains', 'not_contains', 'starts_with', 'ends_with']),
    template: `<div class="input-group">
                    <input type="text" ng-keyup="goSearch($event)" ng-model="$value.query.value" class="form-control" required style=" width: 150px;height: 40px;" />
                    <div class="input-group-addon">
                        <i ng-show="validator($value.query.value) && $value.query.value.length > 0" class="glyphicon glyphicon-ok" style="color:green"></i></span>
                        <i ng-show="!validator($value.query.value) || !$value.query.value" class="glyphicon glyphicon-remove" style="color:red"></i>
                    </div>
                    <div class="input-group-addon">
                        <button ng-click="callSearch($event, 'btn')" class="btn btn-default">Buscar</button>
                    </div>
              </div>`
  }

  function useType(type) {
    return SUPPORTED_TYPES[type] || null;
  }

  function hqlObjectCreator(hqls = [], hqlObjects = {}){
    hqlObjects['contains']      = { key: 'CONTAINS', hql: ` contains `     , label:  ` contém `        , before: ` like upper('%`     , after:  `%')` }
    hqlObjects['not_contains']  = { key: 'NOT_CONTAINS', hql: ` not_contains ` , label:  ` não contém `    , before: ` not like upper('%` , after:  `%')` }
    hqlObjects['starts_with']   = { keys:'STARTS_WITH', hql: ` starts_with `  , label:  ` começa com `    , before: ` like upper('`      , after:  `%')` }
    hqlObjects['ends_with']     = { key: 'ENDS_WITH', hql: ` ends_with `    , label:  ` termina com `   , before: ` like upper('%`     , after:  `')` }
    hqlObjects['eq']            = { key: 'EQUAL', hql: ` eq `           , label:  ` igual `         , before: ` = upper('`         , after:  `')` }
    hqlObjects['ne']            = { key: 'NOT_EQUAL', hql: ` ne `           , label:  ` diferente de `  , before: ` != upper('`        , after:  `')` }
    hqlObjects['ge']            = { key: 'GREATER_EQUAL', hql: ` ge `           , label:  ` maior igual `   , before: ` >= upper('`        , after:  `')` }
    hqlObjects['gt']            = { key: 'GREATER', hql: ` gt `           , label:  ` maior que `     , before: ` >   `        , after:  `` }
    hqlObjects['le']            = { key: 'LOWER_EQUAL', hql: ` le `           , label:  ` menor igual `   , before: ` <=  `        , after:  `` }
    hqlObjects['lt']            = { key: 'LOWER', hql: ` lt `           , label:  ` menor que `     , before: ` < upper('`         , after:  `')` }
    hqlObjects['in']            = { key: 'IN', hql: ` in `           , label:  ` em`             , before: ` in (`        , after:  `)` }
    hqlObjects['is']            = { key: 'IS', hql: ` is `           , label:  ` está `          , before: ` is `         , after:  `` }
    hqlObjects['date_eq']       = { key: 'EQUAL', hql: ` eq `           , label:  ` igual `         , before: ` >= `         , after:  `` }
    hqlObjects['date_ne']       = { key: 'NOT_EQUAL', hql: ` ne `           , label:  ` diferente de `  , before: ` <= `         , after:  `` }
    hqlObjects['date_lt']       = { key: 'LOWER_EQUAL', hql: ` ld `           , label:  ` anterior a `    , before: ` <= `         , after:  `` }
    hqlObjects['date_gt']       = { key: 'GREATER_EQUAL', hql: ` gd `           , label:  ` posterior a `   , before: ` >= `         , after:  `` }

    // hqlObjects['date_eq']       = { hql: ` date_eq`       , label:  ` no dia `        , before: ` `}
    return hqls.map(value => hqlObjects[value])
  }

  function setJoins(mapObj, gQuery){
    let innerJoins = [];
    let leftJoins = [];
    Object.keys(mapObj).map(key => {
      return mapObj[key];
    }).forEach(field => {
      if (field.query && field.query.attribute && field.query.attribute.innerJoin && field.query.attribute.leftJoin) {
        field.query.attribute.innerJoin.forEach(innerJoin => {
          if(innerJoins.indexOf(innerJoin) == -1){
            innerJoins.push(innerJoin);
          }
        })
        field.query.attribute.leftJoin.forEach(leftJoin => {
          if(leftJoins.indexOf(leftJoin) == -1){
            leftJoins.push(leftJoin);
          }
        })
      }
    })
    innerJoins.forEach(function(innerJoin) {
      gQuery = gQuery.join(new Join(innerJoin, JoinType.INNER))
    })

    leftJoins.forEach(function(leftJoin) {
      gQuery = gQuery.join(new Join(leftJoin, JoinType.LEFT))
    })
  }

  const createCriteriaLower = (query, value) => {
    let criteria = new Criteria(query.attribute.field, query.condition.key, (value == undefined ? query.value : value));
    if(query.attribute.type == 'string'){
      criteria.setFieldFunction('%s');
      criteria.setValueFunction('%s');
        
      if(query.attribute.ignoreCase) {
          criteria.setFieldFunction(addIgnoreCase(criteria.getFieldFunction()));
          criteria.setValueFunction(addIgnoreCase(criteria.getValueFunction()));
      }

      if(query.attribute.translate) {
          criteria.setFieldFunction(addTranslate(criteria.getFieldFunction()));
          criteria.setValueFunction(addTranslate(criteria.getValueFunction()));
      }
    }
    return criteria;
  }

  function addIgnoreCase(value) {
    return value.replace(/%s/g, "lower(%s)");
  }

  function addTranslate(value) {
      return value.replace(/%s/g, "translate(%s, "+SOURCE_CHARS+","+TARGET_CHARS+")");
  }

  function generateGQuery(mapObj){
    let query = null;
    let querys = Object.keys(mapObj).map(key => mapObj[key]);
    let i=0;

    if(querys[i].query.attribute.type == 'date'){
      let value = new Date(Date.parse(querys[i].query.value.replace( /(\d{2})(\d{2})(\d{4})/, "$2/$1/$3")));
      query = new GQuery(null, new Criteria(querys[i].query.attribute.field, querys[i].query.condition.key, value));
    }else if(querys[i].query.attribute.type == 'string'){
      query = new GQuery(null, createCriteriaLower(querys[i].query));
    }else if(querys[i].query.attribute.type == 'boolean') {
      query = new GQuery(null, new Criteria(querys[i].query.attribute.field, querys[i].query.condition.key, querys[i].query.value === 'true'));
    } else if(querys[i].query.attribute.type == 'number') {
      query = new GQuery(null, new Criteria(querys[i].query.attribute.field, querys[i].query.condition.key, Number(querys[i].query.value)));
    } else {        
      query = new GQuery(null, new Criteria(querys[i].query.attribute.field, querys[i].query.condition.key, querys[i].query.value));
    }

    for( i = 2; i < querys.length; i += 2){
      let previousValue = querys[i-1];
      let value = querys[i].query.value;
      if(querys[i].query.attribute.type == 'date'){
        value = new Date(Date.parse(value.replace( /(\d{2})(\d{2})(\d{4})/, "$2/$1/$3")));
      } else if(querys[i].query.attribute.type == 'boolean') {
        value = value == 'true'
      } else if(querys[i].query.attribute.type == 'number') {
        value = Number(value)
      }
      query = query[previousValue.query.value.toLowerCase()](createCriteriaLower(querys[i].query, value));
    }

    return query;
  }

  function createHql(mapObj = {}, useGQuery = false, scopeParent){
    let onlyActives = {};  

    Object.keys(mapObj).forEach(key => {
      if(mapObj[key].active){
        onlyActives[key] = mapObj[key];
      }
    });

    if(useGQuery){
      scopeParent.ctrl.lastGquery = generateGQuery(onlyActives);      
      setJoins(onlyActives, scopeParent.ctrl.lastGquery);
      return scopeParent.ctrl.lastGquery;
    }

    let aqo = []
    let aq =
      Object
        .keys(mapObj)
        .filter(value => mapObj[value].active && mapObj[value].query.value)
        .map(val => {
           let attribute = 'obj.'.concat(mapObj[val].query.attribute ? mapObj[val].query.attribute.field : '*'),
              before    = mapObj[val].query.condition ? mapObj[val].query.condition.before : '*',
              value     = mapObj[val].query.value.replace ? mapObj[val].query.value.replace(/'/g,"''") : mapObj[val].query.value,
              after     = mapObj[val].query.condition ? mapObj[val].query.condition.after : '*';

            if (mapObj[val].query.attribute) {
              switch (mapObj[val].query.attribute.type) {
                case 'date':
                  let date = value.split('')
                  value = `${date[4]}${date[5]}${date[6]}${date[7]}-${date[2]}${date[3]}-${date[0]}${date[1]}`

                  // if (mapObj[val].query.condition.hql == ' eq ' || mapObj[val].query.condition.hql == ' ne ') {
                    let valueBefore = `to_timestamp('${value} 00:00:00','yyyy/MM/dd HH24:mi:ss')`,
                        valueAfter  = `to_timestamp('${value} 23:59:59','yyyy/MM/dd HH24:mi:ss')`


                    switch (mapObj[val].query.condition.hql) {
                      case ' eq ':
                        value = `${valueBefore} AND ${attribute} <= ${valueAfter}`
                        break;
                      case ' ne ':
                        value = `${valueBefore} OR ${attribute} >= ${valueAfter}`
                        break;
                      case ' ld ':
                        value = valueAfter;
                        break;
                      case ' gd ':
                        value = valueBefore;
                        break;
                    }
                  // }
                  // value = $filter('date')(new Date($filter('gumgaGenericFilter')(value, 'date')),'yyyy-MM-dd')
                  // value = $filter('gumgaGenericFilter')(value, 'date')

                  value = value
                  break;
                case 'enum':
                  value = `'${mapObj[val].query.value.join("','")}'`;
                  break;
                case 'number':
                case 'float':
                case 'money':
                  before    = before.replace(/'/g, '');
                  after     = after.replace(/'/g, '');
                  break;
                case 'string':
                case 'cpf':
                case 'cnpj':
                  attribute = `upper(${attribute})`
                  break;
              }
            }

            aqo.push({
              attribute:  mapObj[val].query.attribute,
              condition:  mapObj[val].query.condition,
              value:      mapObj[val].query.value.replace ? mapObj[val].query.value.replace(/'/g,"''") : mapObj[val].query.value
            })


        return (attribute.concat(before).concat(value).concat(after)).replace(/obj.\*/g,'').replace(/\*/g,'')
      })
      .filter((item, idx, ary) => {
        var operators = ["OR", "AND"];

        if (operators.indexOf(item) === -1)
          return true;

        var previousValue = ary[idx - 1];
        var nextValue = ary[idx + 1];
        if ((previousValue !== undefined && operators.indexOf(previousValue) === -1)
          && (nextValue !== undefined && operators.indexOf(nextValue) === -1))
          return true;

        return false;
      })
      .join(' ')

    if(aq.slice(-2) === 'ND' || aq.slice(-2) === 'OR'){
      aqo.pop()
      return { hql: aq.slice(0, -3), source: JSON.stringify(aqo)  }
    }

    if (aq) {
      return { hql: aq, source: JSON.stringify(aqo) }
    }

    return {}
  }


  let utils = {
    toCpf(input){
      let str = input+ '';
      return str.replace(/\D/g,'').replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
    }
  }

  function validator(type = ' '){
    return SUPPORTED_TYPES[type] ? SUPPORTED_TYPES[type].validator : angular.noop
  }

  return { useType , hqlObjectCreator, createHql, validator };

}

angular.module('gumga.queryfilter.factory.hql', [])
  .factory('HQLFactory', HQLFactory);
