(function () {
  'use strict';
  AddressService.$inject = ['$http', '$q', '$gumgaAddress'];
  function AddressService($http, $q, $gumgaAddress) {
    var base = $gumgaAddress.getServicesAPI();

    return {
      everyUf: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
                'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
                'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
                'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
               ],
      everyLogradouro: ['Outros', 'Aeroporto', 'Alameda', 'Área', 'Avenida', 'Campo', 'Chácara', 'Colônia', 'Condomínio', 'Conjunto', 'Distrito',
        'Esplanada', 'Estação', 'Estrada', 'Favela', 'Fazenda', 'Feira', 'Jardim', 'Ladeira', 'Largo', 'Lago', 'Lagoa', 'Loteamento',
        'Núcleo', 'Parque', 'Passarela', 'Pátio', 'Praça', 'Quadra', 'Recanto', 'Residencial', 'Rodovia', 'Rua', 'Setor', 'Sítio',
        'Travessa', 'Trevo', 'Trecho', 'Vale', 'Vereda', 'Via', 'Viaduto', 'Viela', 'Via'],
      availableCountries: ['Brasil'],
      returnFormattedObject: function () {
        return {
          zipCode: null,
          premisseType: null,
          premisse: null,
          number: null,
          information: null,
          neighbourhood: null,
          localization: null,
          state: null,
          country: null
        }
      },
      getLocations: function (uf, apiSearchCep) {
        return $http.get(getApiSearchCep(apiSearchCep) + '/public/buscar-cidades?uf=' + uf);
      },
      getGoogleCoords: function (address, callback) {
        /**
         * Foi feito assim pelo fato da existência de headers que bloqueiam a requisição.
         */

        var httpRequest
        httpRequest = new XMLHttpRequest()

        httpRequest.onreadystatechange = loadContent
        httpRequest.open('GET', 'http://maps.google.com/maps/api/geocode/json?address=' + address)
        httpRequest.send()

        function loadContent() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            callback({data:httpRequest.responseText, status: httpRequest.status});
          }
        }

      },
      getPremisseByUFAndCity: function (uf, city, apiSearchCep) {
        return $http.get(getApiSearchCep(apiSearchCep) + '/public/buscar-logradouros?uf=' + uf + '&cidade=' + city);
      },
      searchCepByUfAndCityAndPremisse: function (uf, city, premisse, apiSearchCep) {
        return $http.get(getApiSearchCep(apiSearchCep) + '/public/buscar-endereco-completo?uf=' + uf + '&cidade=' + city + '&logradouro=' + premisse);
      },
      getCep: function (cep, apiSearchCep) {
        return $http.get(getApiSearchCep(apiSearchCep) + '/public/busca-cep/' + cep)
      }
    }

    function getApiSearchCep(apiSearchCep) {
      return apiSearchCep || base
    }

  }
  angular.module('gumga.address.services', [])
    .factory('GumgaAddressService', AddressService);
})();
