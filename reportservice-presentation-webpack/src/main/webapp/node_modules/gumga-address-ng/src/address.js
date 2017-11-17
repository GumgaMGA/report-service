require('./address.service.js')
import templateModal from './address.modal.template.js'
import GumgaAddressModalController from './address.modal.controller.js'
import AddressProvider from './address.provider.js'

'use strict';
AddressDirective.$inject = ['GumgaAddressService', '$http', '$compile', '$uibModal', '$timeout', '$injector', '$gumgaAddress'];
function AddressDirective(GumgaAddressService, $http, $compile, $uibModal, $timeout, $injector, $gumgaAddress) {

  function useGumgaLayout(){
    try {
      return !!angular.module('gumga.layout');
    } catch (error) {
      return false;
    }
  }

  var templateBegin =
    '<div class="row">' +
    ' <div class="col-md-12 col-sm-12 col-xs-12">' +
    '   <accordion>' +
    '	  <accordion-group is-open="false" heading="{{::title}}">'
    ;
  var blockCountryCep = useGumgaLayout() ?
    `<div class="row">
     <div class="col-md-8">
      <div class="form-group" style="margin-top: 21px;">
       <gmd-select ng-model="value.country"
                     ng-disabled="true"
                     placeholder="{{getTranslateByKey('country')}}">
        <gmd-option    ng-repeat="pais in factoryData.availableCountries"
                       ng-value="pais"
                       ng-label="pais">
          {{pais}}
        </gmd-option>
      </gmd-select>
      </div>
      </div>
     <div class="col-md-4">
      <div class="form-group">
        <a data-ng-click="openModal()" style="cursor: pointer;margin: 0;float: right;" class="text text-primary">Não sabe?</a>
        <div class="input-group" style="width: 100%;">
          <gmd-input>
            <input type="text"
                   class="form-control gmd"
                   ng-keypress="custom($event,value.zipCode)"
                   ng-keyup="notfound=false"
                   gumga-mask="99999-999"
                   ng-model="value.zipCode"  id="input{{::id}}"
                   required>
            <label for="input{{::id}}" class="control-label">{{getTranslateByKey('zipCode')}} <span ng-show="checkFieldRequired('zipCode')" class="text text-danger">*</span></label>
          </gmd-input>
          <span class="input-group-btn">
            <button ng-show="!notfound" style="margin-bottom: 22px;" class="btn btn-primary gmd" type="button" ng-click="searchCep(value.zipCode)" ng-disabled="loader{{::id}}" id="buttonSearch{{::id}}"><i class="glyphicon glyphicon-search"></i></button>
            <button ng-show="notfound"  style="margin-bottom: 22px;" uib-tooltip="Cep não encontrado!" popover-trigger="\'mouseenter\'" class="btn btn-danger gmd" type="button"><i class="glyphicon glyphicon-info-sign"></i></button>
          </span>
        </div>

      </div>
     </div>
    </div>`
    :
    `<div class="row">
     <div class="col-md-8">
    	<div class="form-group">
       <label for="country">{{getTranslateByKey('country')}} <span ng-show="checkFieldRequired('country')" class="text text-danger">*</span></label>
    	  <select ng-readonly="true" ng-model="value.country" class="form-control" ng-options="pais for pais in factoryData.availableCountries"></select>
    	</div>
    	</div>
     <div class="col-md-4">
    	<div class="form-group">
       <label for="input{{::id}}">{{getTranslateByKey('zipCode')}}</label>
       <a data-ng-click="openModal()" style="cursor: pointer;margin: 0;float: right;" class="text text-primary">Não sabe?</a>
    	  <div class="input-group" style="width: 100%;">
    		<input type="text" ng-keyup="notfound=false" class="form-control" gumga-mask="99999-999" ng-model="value.zipCode" id="input{{::id}}" ng-keypress="custom($event,value.zipCode)">
    		<span class="input-group-btn">
    	    <button ng-show="!notfound" class="btn btn-primary" type="button" ng-click="searchCep(value.zipCode)" ng-disabled="loader{{::id}}" id="buttonSearch{{::id}}"><i class="glyphicon glyphicon-search"></i></button>
    	    <button ng-show="notfound" uib-popover="Cep não encontrado!" popover-trigger="\'mouseenter\'" class="btn btn-danger" type="button"><i class="glyphicon glyphicon-info-sign"></i></button>
    		</span>
    	  </div>
    	</div>
     </div>
    </div>`;

  var streetType = useGumgaLayout() ?
    `
      <div class="form-group">
        <gmd-select ng-model="value.premisseType" placeholder="{{getTranslateByKey('premisseType')}}">
          <gmd-select-search ng-model="searchStreetTypes"
                placeholder="Buscar...">
          </gmd-select-search>
         <gmd-option    ng-repeat="type in streetTypes | filter: searchStreetTypes track by $index"
                        ng-value="type"
                        ng-label="type">
           {{type}}
         </gmd-option>
       </gmd-select>
      </div>
    `
    :
    `
      <div class="form-group">
       <label for="tipoLogradouro">{{getTranslateByKey('premisseType')}} <span ng-show="checkFieldRequired('premisseType')" class="text text-danger">*</span></label>
       <input type="text" ng-model="value.premisseType" typeahead-min-length="0" uib-typeahead="type for type in streetTypes | filter:$viewValue | limitTo:8" typeahead-editable="false" typeahead-show-hint="true" typeahead-min-length="0" class="form-control" typeahead-editable="false" typeahead-show-hint="true" typeahead-min-length="0">
      </div>
    `;
  var street =  useGumgaLayout() ?
    `
      <div class="form-group">
        <gmd-input>
         <input type="text"
                class="form-control gmd"
                ng-blur="searchCoordsOnPremisse(value, true)"
                ng-model="value.premisse"
                required>
         <span class="bar"></span>
         <label class="control-label">{{getTranslateByKey('premisse')}} <span ng-show="checkFieldRequired('premisse')" class="text text-danger">*</span></label>
       </gmd-input>
      </div>
    `
    :
    `
      <div class="form-group">
       <label for="premisse">{{getTranslateByKey('premisse')}} <span ng-show="checkFieldRequired('premisse')" class="text text-danger">*</span></label>
       <input type="text" ng-model="value.premisse" class="form-control" ng-blur="searchCoordsOnPremisse(value, true)"/>
      </div>
    `
    ;
  var number = useGumgaLayout() ?
    `
    <div class="form-group">
      <gmd-input>
       <input type="text"
              class="form-control gmd"
              ng-blur="searchCoordsOnNumber(value, true)"
              ng-model="value.number"
              required>
       <span class="bar"></span>
       <label class="control-label">{{getTranslateByKey('number')}} <span ng-show="checkFieldRequired('number')" class="text text-danger">*</span></label>
     </gmd-input>
    </div>
    `
    :
    `
    <div class="form-group">
    		<label for="number">{{getTranslateByKey('number')}} <span ng-show="checkFieldRequired('number')" class="text text-danger">*</span></label>
    		<input type="text" ng-model="value.number" class="form-control" id="numberInput{{::id}}" ng-blur="searchCoordsOnNumber(value, true)"/>
    </div>
    `;

  var blockStreet =
    '<div class="row">' +
    '		<div class="col-md-4">' + streetType +
    '		</div>' +
    '		<div class="col-md-8">' + street +
    '		</div>' +
    '</div>'
    ;
  var blockStreetNumber =
    '<div class="row">' +
    '		<div class="col-md-4">' + streetType +
    '		</div>' +
    '		<div class="col-md-5">' + street +
    '		</div>' +
    '		<div class="col-md-3">' + number +
    '		</div>' +
    '</div>'
    ;
  var blockComplement = useGumgaLayout() ?
    `
      <div class="row">
    		<div class="col-md-6">
    				<div class="form-group">
                <gmd-input>
                  <input type="text"
                         class="form-control gmd"
                         ng-model="value.information"
                         required>
                  <span class="bar"></span>
                  <label class="control-label">{{getTranslateByKey('information')}} <span ng-show="checkFieldRequired('information')" class="text text-danger">*</span></label>
                </gmd-input>
    				</div>
    		</div>
    `
    :
    `
     <div class="row">
    		<div class="col-md-6">
    				<div class="form-group">
    						<label for="information">{{getTranslateByKey('information')}} <span ng-show="checkFieldRequired('information')" class="text text-danger">*</span></label>
    						<input type="text" ng-model="value.information" class="form-control"/>
    				</div>
    		</div>
      `;

  var blockNeighbourhood = useGumgaLayout() ?
    `
      <div class="row">
          <div class="col-md-12">
              <div class="form-group">
                  <gmd-input>
                    <input type="text"
                           class="form-control gmd"
                           ng-model="value.neighbourhood" id="name"
                           required>
                    <span class="bar"></span>
                    <label for="name" class="control-label">{{getTranslateByKey('neighbourhood')}} <span ng-show="checkFieldRequired('neighbourhood')" class="text text-danger">*</span></label>
                  </gmd-input>
              </div>
          </div>
      </div>
    `
    :
    `
      <div class="row">
      		<div class="col-md-12">
      				<div class="form-group">
      						<label for="neighbourhood">{{getTranslateByKey('neighbourhood')}} <span ng-show="checkFieldRequired('neighbourhood')" class="text text-danger">*</span></label>
      						<input type="text" ng-model="value.neighbourhood" class="form-control"/>
      				</div>
      		</div>
      </div>
    `;

  var state = useGumgaLayout() ?
    `
    <div class="form-group">
      <gmd-select ng-model="value.state" placeholder="{{getTranslateByKey('state')}}">
        <gmd-select-search ng-model="searchUF"
                placeholder="Buscar...">
        </gmd-select-search>
        <gmd-option    ng-repeat="uf in factoryData.ufs | filter: searchUF"
                       ng-value="uf"
                       ng-label="uf">
          {{uf}}
        </gmd-option>
      </gmd-select>
		</div>
    `
    :
    `<div class="form-group">
        <label for="uf">{{getTranslateByKey('state')}}</label>
    		<select ng-model="value.state" class="form-control" ng-options="uf for uf in factoryData.ufs"></select>
    </div>`;

  var stateCode = useGumgaLayout() ?
		`
    <div class="form-group">
      <gmd-input>
        <input type="text"
          class="form-control gmd"
          ng-model="value.stateCode"
          required>
        <span class="bar"></span>
        <label for="stateCode">{{getTranslateByKey('stateCode')}} <span ng-show="checkFieldRequired('stateCode')" class="text text-danger">*</span></label>
      </gmd-input>
		</div>
    `
    :
    `
    <div class="form-group">
				<label for="stateCode">{{getTranslateByKey('stateCode')}} <span ng-show="checkFieldRequired('stateCode')" class="text text-danger">*</span></label>
				<input type="text" ng-model="value.stateCode" class="form-control"/>
		</div>
    `;

  var city = useGumgaLayout() ?
    `
    <div class="form-group">
      <gmd-input>
        <input type="text"
          class="form-control gmd"
          ng-model="value.localization"
          required>
        <span class="bar"></span>
        <label class="control-label">{{getTranslateByKey('localization')}} <span ng-show="checkFieldRequired('localization')" class="text text-danger">*</span></label>
      </gmd-input>
    </div>
    `
    :
    `
    <div class="form-group">
    		<label for="localization">{{getTranslateByKey('localization')}} <span ng-show="checkFieldRequired('localization')" class="text text-danger">*</span></label>
    		<input type="text" ng-model="value.localization" class="form-control"/>
    </div>
    `;

  var codIBGE = useGumgaLayout() ?
     `<div class="form-group">
         <gmd-input>
           <input type="text"
             class="form-control gmd"
             id="CodIBGE{{::id}}"
             ng-model="value.formalCode"
             required>
           <span class="bar"></span>
           <label for="CodIBGE{{::id}}" class="control-label">{{getTranslateByKey('formalCode')}} <span ng-show="checkFieldRequired('formalCode')" class="text text-danger">*</span></label>
         </gmd-input>
     </div> `
    :
    `<div class="form-group">
    		<label for="CodIBGE{{::id}}">{{getTranslateByKey('formalCode')}} <span ng-show="checkFieldRequired('formalCode')" class="text text-danger">*</span></label>
    		<input type="text" ng-model="value.formalCode" class="form-control" id="CodIBGE{{::id}}"/>
    </div> `;

  var blockStateCity =
    '<div class="row">' +
    '		<div class="{{withStateCode ? \'col-md-2\' : \'col-md-4\'}}">' + state +
    '		</div>' +
    '		<div class="col-md-2" ng-show="withStateCode">' + stateCode +
    '		</div>' +
    '		<div class="col-md-8">' + city +
    '		</div>' +
    '</div>'
    ;
  var blockStateCityIBGE =
    '<div class="row">' +
    '		<div class="{{withStateCode ? \'col-md-2\' : \'col-md-4\'}}">' + state +
    '		</div>' +
    '		<div class="col-md-2" ng-show="withStateCode">' + stateCode +
    '		</div>' +
    '		<div class="col-md-4">' + city +
    '		</div>' +
    '		<div class="col-md-4">' + codIBGE +
    '		</div>' +
    '</div>'
    ;
  var blockLatLng = useGumgaLayout() ?
    `
      <div class="col-md-6">
       <div class="form-group" style="margin-top: -24px;">
          <label for="Latitude{{::id}}" style="font-size: 14px;color: #999;font-weight: normal;pointer-events: none;">{{getTranslateByKey('coordinates')}}</label>
       <div class="input-group">
       <div class="input-group-btn" uib-tooltip="Visualizar mapa">
         <button type="button" class="btn btn-default btn-block" ng-disabled="!value.localization" ng-click="openMaps(value)" target="_blank"><i class="glyphicon glyphicon-map-marker"></i></button>
       </div>
       <div class="input-group-btn" style="width:calc(50% - 24px)">
         <input style="border-left: 0px; border-right: 0px;" type="text" ng-model="value.latitude" class="form-control" id="Latitude{{::id}}"/>
       </div>
       <input style="" type="text" ng-model="value.longitude" class="form-control" id="Longitude{{::id}}"/>
       <div class="input-group-btn">
          <button type="button" uib-tooltip="Buscar Coordenadas" class="btn btn-default btn-block" ng-click="searchCoords(value)"><i class="glyphicon glyphicon-globe"></i></button>
       </div>
     </div></div>
    `
    :

    `
    <div class="col-md-6">
     <div class="form-group">
        <label for="Latitude{{::id}}">{{getTranslateByKey('coordinates')}}</label>
     <div class="input-group">
     <div class="input-group-btn" uib-tooltip="Visualizar mapa">
       <button type="button" class="btn btn-default btn-block" ng-disabled="!value.localization" ng-click="openMaps(value)" target="_blank"><i class="glyphicon glyphicon-map-marker"></i></button>
     </div>
     <div class="input-group-btn" style="width:calc(50% - 24px)">
       <input style="border-left: 0px; border-right: 0px;" type="text" ng-model="value.latitude" class="form-control" id="Latitude{{::id}}"/>
     </div>
     <input style="" type="text" ng-model="value.longitude" class="form-control" id="Longitude{{:: className=""}}"/>
     <div class="input-group-btn">
        <button type="button" uib-tooltip="Buscar Coordenadas" class="btn btn-default btn-block" ng-click="searchCoords(value)"><i class="glyphicon glyphicon-globe"></i></button>
     </div>
    </div></div>
    `;

  var templateEnd =
    '						</accordion-group>' +
    '				</accordion>' +
    '		</div>' +
    '</div>'
    ;
  return {
    restrict: 'E',
    scope: {
      value: '=',
      onSearchCepStart: '&?',
      onSearchCepSuccess: '&?',
      onSearchCepError: '&?',
      requiredFieldMessage: '&?',
      apiSearchCep: '@?',
      coordsByCep: '@?',
      coordsByPremisse: '@?',
      coordsByNumber: '@?'
    },
    //template: template.join('\n'),
    link: function (scope, elm, attrs, ctrl) {
      scope.addressID = guid();

      scope.cities = [];

      scope.getTranslateByKey = key => $gumgaAddress.getTranslation()[key];

      scope.checkFieldRequired = field => {
        if(!scope.requiredFieldMessage) return;
        let fieldMessage = scope.requiredFieldMessage()[field];
        if(!fieldMessage) return;
        if(!gumgaForms){
          console.error('Para usar o campos obrigatorios, utilize o gumga form.');
          return;
        }
        let forms = gumgaForms.filter(form => form.element[0] == angular.element('form[gumga-form]')[0]);
        if(forms.length == 0) return;
        let scopeForm = forms[0].scope;
        scopeForm.updateErrorsModel();
        if(fieldMessage
          && (scope.value[field] == null
          || scope.value[field] == undefined
          || (scope.value[field]+'').trim() == '')){
            scopeForm.updateFormErrors(scope.addressID+'-'+field, '-gumga-address-required', false, fieldMessage);
            scopeForm.updateErrorsModel();
            return true;
        }
        scopeForm.deleteErrosByInputName(scope.addressID+'-'+field);
        scopeForm.updateErrorsModel();
      }

      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      function isEmpty(obj) {
        for (var key in obj) if (obj.hasOwnProperty(key)) {
          return false;
        }
        return true;
      }

      function forceAttr2Bool(attr) {
        return (attr == undefined || attr == 'true') ? true : false;
      }

      function forceAttr2BoolCoords(attr) {
        return (attr == 'true') ? true : false;
      }

      if (isEmpty(scope.value)) scope.value = GumgaAddressService.returnFormattedObject();

      attrs.countryCep = forceAttr2Bool(attrs.countryCep);
      attrs.street = forceAttr2Bool(attrs.street);
      attrs.streetNumber = forceAttr2Bool(attrs.streetNumber);
      attrs.complement = forceAttr2Bool(attrs.complement);
      attrs.neighborhood = forceAttr2Bool(attrs.neighborhood);
      attrs.stateCity = forceAttr2Bool(attrs.stateCity);
      attrs.stateCityIbge = forceAttr2Bool(attrs.stateCityIbge);
      attrs.latLng = forceAttr2Bool(attrs.latLng);
      attrs.maps = forceAttr2Bool(attrs.maps);
      attrs.coordsByCep = forceAttr2BoolCoords(attrs.coordsByCep);
      attrs.coordsByPremisse = forceAttr2BoolCoords(attrs.coordsByPremisse);
      attrs.coordsByNumber = forceAttr2BoolCoords(attrs.coordsByNumber);

      if (attrs.stateCode) scope.withStateCode = forceAttr2Bool(attrs.stateCode);

      scope.streetTypes = ['AV', 'AVENIDA', 'RUA', 'ROD.', 'BC', 'TRAVESSA', 'ALAMEDA', 'VIELA', 'CAMINHO', 'ESTRADA', 'PRAÇA', 'PASSAGEM', 'VILA', 'VIADUTO', 'RODOVIA', 'BECO', 'ACESSO', 'LARGO', 'VIA', 'CAMPO', 'MONTE', 'LADEIRA', 'CALÇADA', 'LOTEAMENTO', 'ROTATÓRIA', 'PASSEIO', 'NÚCLEO', 'PARQUE', 'ANTIGA', 'LAGO', 'BOULEVARD', 'ACAMPAMENTO', 'COMPLEXO', 'CONTORNO', 'BALÇO', 'CONJUNTO', 'MORRO', 'CONDOMÍNIO', 'TERMINAL', 'ESCADA', 'FAVELA', 'COLÔNIA', 'RECANTO', 'ALTO', 'ILHA', 'JARDIM', 'PASSARELA', 'PONTE', 'GALERIA', 'VALE', 'VEREDA', 'ENTRADA', 'BULEVAR', 'TRECHO', 'TÚNEL', 'ESTACIONAMENTO', 'QUADRA', 'BOSQUE', 'RETORNO', 'PÁTIO', 'PRAIA', 'RAMAL', 'BAIXA', 'CHÁCARA', 'SÍTIO', 'UNIDADE', 'RESIDENCIAL', 'FEIRA', 'ESTAÇÂO', 'RÓTULA', 'CANAL', 'FAZENDA', 'RETIRO', 'SETOR', 'RAMPA', 'ESPLANADA', 'CAMPUS', 'BLOCO', 'CENTRO', 'MÓDULO', 'ESTÁDIO', 'ESCADARIA', 'AEROPORTO', 'SERVIDÃO', 'FERROVIA', 'TREVO', 'PORTO', 'ATALHO', 'DISTRITO', 'CORREDOR', 'FONTE', 'CÓRREGO', 'CIRCULAR', 'CAIS', 'SUBIDA', 'LAGOA', 'PROLONGAMENTO', 'DESCIDA', 'PARALELA', 'ELEVADA', 'RETA', 'PONTA', 'VALA', 'BURACO', 'MARINA', 'FORTE', 'PARADA', 'LINHA', 'FRANCISCO', 'MARECHAL', 'ROD.', 'CICLOVIA']

      if (!attrs.name) console.error("É necessário passar um parâmetro 'name' como identificador para GumgaAddress");
      if (!(!attrs.street || !attrs.streetNumber) || !(!attrs.stateCity || !attrs.stateCityIbge)) console.error("É necessário usar ao menos um dos elementos principais [street ou street-number e state-city ou state-city-ibge] para GumgaAddress");
      if (!attrs.countryCep && (attrs.onSearchCepStart || attrs.onSearchCepSuccess || attrs.onSearchCepError)) throw "É necessário uso do atributo country-cep para uso das funções [on-search-cep-start / on-search-cep-success / on-search-cep-error]";

      var template = '';

      template = template.concat(templateBegin);

      if (attrs.countryCep) template = template.concat(blockCountryCep);
      if (attrs.stateCity) template = template.concat(blockStateCity);
      if (attrs.stateCityIbge) template = template.concat(blockStateCityIBGE);
      if (attrs.neighborhood) template = template.concat(blockNeighbourhood);
      if (attrs.street) template = template.concat(blockStreet);
      if (attrs.streetNumber) template = template.concat(blockStreetNumber);
      if (attrs.complement) template = template.concat(blockComplement);
      if (attrs.latLng) template = template.concat(blockLatLng);
      // if (attrs.maps) template = template.concat(blockMaps);

      template = template.concat(templateEnd);

      elm.append($compile(template)(scope));

      scope.title = attrs.title || 'Endereço';
      scope.id = attrs.name;
      scope['loader' + scope.id] = false;
      scope['maps' + scope.id] = false;

      scope.factoryData = {
        ufs: GumgaAddressService.everyUf,
        logs: GumgaAddressService.everyLogradouro,
        availableCountries: GumgaAddressService.availableCountries
      };

      scope.value.country = scope.factoryData.availableCountries[0];

      var eventHandler = {
        searchCepStart: (attrs.onSearchCepStart ? scope.onSearchCepStart : angular.noop),
        searchCepSuccess: (attrs.onSearchCepSuccess ? scope.onSearchCepSuccess : angular.noop),
        searchCepError: (attrs.onSearchCepError ? scope.onSearchCepError : angular.noop)
      };

      scope.openModal = () => {
        var modal = $uibModal.open({
          template: templateModal,
          controller: GumgaAddressModalController,
          size: 'lg',
          resolve: {
            factoryData: scope.factoryData,
            apiSearchCep: scope.apiSearchCep
          }
        });

        modal.result.then(function (cep) {
          if (cep) {
            scope.searchCep(cep.cep);
            scope.value.zipCode = cep.cep;
            scope.value.codigo_ibge = cep.codigoIbgeCidade;
          }
        });
      }

      scope.custom = function ($event, cep) {
        if (cep && $event.charCode == 13) {
          scope.searchCep(cep)
        }
      };

      scope.openMaps = function (value) {
        if (!value.number) {
          value.number = '';
        }
        var maps = 'https://www.google.com.br/maps/place/' + value.premisseType + ' ' + value.premisse + ',' + value.number + ',' + value.localization;
        window.open(maps);
      };

      scope.searchCoords = function (value, isSearchField) {

        if ((value.latitude && value.longitude) && isSearchField) return

        var address = angular.copy(value)

        for (var key in address) {
          if (!address[key]) {
            address[key] = ""
          }
        }

        var formattedAddress = address.premisseType + " "
          + address.premisse + ", "
          + address.number + " "
          + address.neighbourhood + " - "
          + address.state + " " + address.country

        GumgaAddressService.getGoogleCoords(formattedAddress, function(data){
           if(data.status == 200){
             data = {data:JSON.parse(data.data)};
             scope.value.latitude = data.data.results[0].geometry.location.lat
             scope.value.longitude = data.data.results[0].geometry.location.lng
           }
        })
      }

      scope.searchCoordsOnPremisse = function (value, isSearchField) {
        if (attrs.coordsByPremisse) scope.searchCoords(value, isSearchField)
      }

      scope.searchCoordsOnNumber = function (value, isSearchField) {
        if (attrs.coordsByNumber) scope.searchCoords(value, isSearchField)
      }

      scope.returnLink = function (value) {
        if (!value.number) {
          value.number = '';
        }
        return 'https://www.google.com.br/maps/place/' + value.premisseType + ' ' + value.premisse + ',' + value.number + ',' + value.localization;
      };

      scope.searchCep = function (cep) {
        scope['loader' + scope.id] = true;
        eventHandler.searchCepStart();
        GumgaAddressService.getCep(cep, scope.apiSearchCep)
          .then(response => {
            eventHandler.searchCepSuccess({ $value: response.data });
            scope['loader' + scope.id] = false;
            if (parseInt(response.data.resultado) == 1) {
              scope.value.premisseType = response.data.tipo_logradouro ? response.data.tipo_logradouro : scope.value.premisseType;
              scope.value.premisse = response.data.logradouro ? response.data.logradouro : scope.value.premisse;
              scope.value.localization = response.data.cidade ? response.data.cidade : scope.value.localization;
              scope.value.neighbourhood = response.data.bairro ? response.data.bairro : scope.value.neighbourhood;
              scope.value.state = response.data.uf ? response.data.uf : scope.value.state;
              scope.value.stateCode = response.data.codigo_estado ? response.data.codigo_estado : scope.value.stateCode
              if (attrs.coordsByCep) scope.searchCoords(scope.value);
              scope.value.formalCode = response.data.ibge_cod_cidade ? response.data.ibge_cod_cidade : scope.value.formalCode;
              scope.value.country = 'Brasil';
              delete scope.notfound;
            } else {
              scope.notfound = true;
              document.getElementById('input' + scope.id).focus();
              $timeout(() => {
                document.getElementById('input' + scope.id).select();
              }, 10)
            }
          }, error => eventHandler.searchCepError({ $value: error }))
      };

      var stateCodes = {
          'AC':12,
          'AL':27,
          'AP':16,
          'AM':13,
          'BA':29,
          'CE':23,
          'DF':53,
          'ES':32,
          'GO':52,
          'MA':21,
          'MT':51,
          'MS':50,
          'MG':31,
          'PA':15,
          'PB':25,
          'PR':41,
          'PE':26,
          'PI':22,
          'RJ':33,
          'RN':24,
          'RS':43,
          'RO':11,
          'RR':14,
          'SC':42,
          'SP':35,
          'SE':28,
          'TO':17
      }
      scope.setStateCode = function(uf) {
          scope.value.stateCode = stateCodes[uf];
      }

      if (scope.value.zipCode) {
        // scope.searchCep(scope.value.zipCode);
      }

    }
  };
}

angular.module('gumga.address', ['gumga.address.services'])
  .directive('gumgaAddress', AddressDirective)
  .provider('$gumgaAddress', AddressProvider);
