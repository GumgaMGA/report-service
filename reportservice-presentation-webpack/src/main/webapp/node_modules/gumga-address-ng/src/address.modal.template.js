export default `

<div class="modal-header">
    <h3 class="modal-title">Encontrar cep</h3>
</div>
<div class="modal-body" id="modal-body">

  <form>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group">
           <label for="UF">{{getTranslateByKey('state')}}</label>
            <select ng-model="value.state" ng-change="getCitiesByUF(value.state)" class="form-control gmd" ng-options="uf for uf in factoryData.ufs"></select>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
        		<label for="Localidade">{{getTranslateByKey('localization')}}</label>
        		<input type="text" typeahead-on-select="getPremisseByUFAndCity(value.state, value.localization)" ng-disabled="!value.state || cities.length == 0" placeholder="Digite para buscar..." typeahead-min-length="0" uib-typeahead="city for city in cities | filter:$viewValue | limitTo:8" ng-model="value.localization" class="form-control gmd"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group">
            <label for="Localidade">{{getTranslateByKey('premisse')}}</label>
            <input type="text"
              ng-disabled="!value.state || cities.length == 0"
              placeholder="Digite para buscar..."
              ng-model-options="{debounce: 1000}"
              ng-change="searchCep(value.state, value.localization, value.premisse)"
              ng-model="value.premisse"
              class="form-control gmd"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12" style="max-height: 200px;overflow: auto;">
        <label ng-if="lookingZipCode">
          <i class="glyphicon glyphicon-refresh"></i>
          Buscando, aguarde um momento...
        </label>
        <label ng-if="ceps.length == 0 && !lookingZipCode">
          Nada encontrado com base na sua pesquisa.
        </label>
        <table ng-show="ceps.length > 0 && !lookingZipCode" class="table table-striped">
            <tr>
              <th>{{getTranslateByKey('neighbourhood')}}</th>
              <th>{{getTranslateByKey('premisse')}}</th>
              <th>{{getTranslateByKey('zipCode')}}</th>
              <th></th>
            </tr>
            <tr ng-repeat="cep in ceps | limitTo:20">
              <td>{{cep.bairro}}</td>
              <td>{{cep.logradouro}}</td>
              <td>{{cep.cep}}</td>
              <td>
                <button class="gmd btn btn-primary" ng-click="select(cep)">Selecionar</button>
              </td>
            </tr>
        </table>
      </div>
    </div>

  </form>

</div>

`
