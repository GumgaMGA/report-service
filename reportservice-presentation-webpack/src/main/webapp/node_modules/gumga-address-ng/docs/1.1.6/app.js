angular.module('app', ['gumga.address', 'ui.bootstrap', 'gumga.form'])
  .config(['$gumgaAddressProvider', function($gumgaAddressProvider){

      $gumgaAddressProvider.setTranslation({
        country: 'Pais',
        zipCode: 'CEP',
        premisseType: 'Tipo Logradouro',
        premisse: 'Logradouro',
        number: 'Número',
        information: 'Complemento',
        neighbourhood: 'Bairro',
        state: 'UF',
        stateCode: 'Cód. UF',
        localization: 'Localidade',
        formalCode: 'Cód. IBGE',
        coordinates: 'Latitude e Longitude'
      })

  }])
  .controller('Ctrl', function ($http) {
    var ctrl = this;


    ctrl.validRequiredAddress = function(){
      return {
        "premisse": "O campo localidade é obrigatorio",
        "localization": "O campo logradouro é obrigatorio"
      }
    }


  })
