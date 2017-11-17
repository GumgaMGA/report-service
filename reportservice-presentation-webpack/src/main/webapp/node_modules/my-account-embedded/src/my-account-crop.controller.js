export default function cropModalController($scope, image, $uibModalInstance){
  $scope.myCroppedImage = '';
  $scope.myImage = image;

  $scope.crop = function(myCroppedImage){
    var mimeType = myCroppedImage.substring((myCroppedImage.indexOf(':') + 1), myCroppedImage.indexOf(';'));
    var picture = {
      mimeType: mimeType,
      name: 'profilePicture.' + (mimeType.substring((mimeType.lastIndexOf('/')+1), mimeType.length)),
      bytes: myCroppedImage.substring((myCroppedImage.indexOf(',') + 1), myCroppedImage.length),
      size: Math.round((myCroppedImage.length * 6) / 8)
    };
    $uibModalInstance.close(picture);
  }

  $scope.close = function() {
    $uibModalInstance.close();
  }

}

cropModalController.$inject = ['$scope', 'image', '$uibModalInstance'];
