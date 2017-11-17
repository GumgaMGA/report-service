const GumgaAddressModalController = ($scope, factoryData, GumgaAddressService, $uibModalInstance, apiSearchCep, $gumgaAddress) => {

    $scope.value = {};
    $scope.factoryData = angular.copy(factoryData);

    $scope.getCitiesByUF = function(uf){
      delete $scope.value.localization;
      delete $scope.value.premisse;
      delete $scope.ceps;
      GumgaAddressService.getLocations(uf, apiSearchCep).then(resp=>{
        $scope.cities = resp.data;
      })
    }

    $scope.getTranslateByKey = key => $gumgaAddress.getTranslation()[key];

    $scope.getPremisseByUFAndCity = function(uf, city){
        delete $scope.value.premisse;
        delete $scope.ceps;
        GumgaAddressService.getPremisseByUFAndCity(uf, city, apiSearchCep).then(resp=>{
          $scope.premisses = resp.data;
        })
    }

    $scope.searchCep = function(uf, city, premisse){
        if(!premisse) return;
        if(!city) return;
        if(!uf) return;
        $scope.lookingZipCode = true;
        GumgaAddressService.searchCepByUfAndCityAndPremisse(uf, city, premisse, apiSearchCep).then(resp=>{
          $scope.ceps = resp.data;
          $scope.lookingZipCode = false;
        })
    }

    $scope.select = function(cep){
      $uibModalInstance.close(cep);
    }

}

GumgaAddressModalController.$inject = ['$scope', 'factoryData', 'GumgaAddressService', '$uibModalInstance', 'apiSearchCep', '$gumgaAddress'];

export default GumgaAddressModalController;
