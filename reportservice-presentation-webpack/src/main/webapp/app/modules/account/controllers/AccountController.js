const AccocuntController = ($timeout, $sce, AccountService, $state, $scope) => {

  $scope.config = {
    defaultPicture:'resources/images/picture_pattern.png',
    facialRecognition: false,
    appURL: APILocation.apiLocation
  }

}

AccocuntController.$inject = ['$timeout', '$sce', 'AccountService', '$state', '$scope']

module.exports = AccocuntController
