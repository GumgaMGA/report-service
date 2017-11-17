export default function takePictureModalController($scope, $uibModalInstance, $timeout){
  var video, canvas, localStream;

  navigator.getUserMedia({video: true}, function(stream) {
    $timeout(function(){
      localStream = stream;
      video  = document.getElementById("video-area-my-profile");
      canvas = document.getElementById("canvas-area-my-profile");
      video.srcObject = stream;
      video.play();
    }, 500)
  }, function(err) {
    if(err.name == 'PermissionDeniedError'){
      swal('Você precisa permitir o acesso a sua Câmera.');
      $scope.close();
    }else if(err.name == 'DevicesNotFoundError'){
      swal('Conecte uma câmera para tirar fotos.');
      $scope.close();
    }else{
      swal('Aconteceu um erro na tentativa ligar a câmera.');
      $scope.close();
    }
  });

  $scope.take = function(){
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = canvas.toDataURL("image/png");
    $scope.close(img);
  }

  $scope.close = function(img){
    if(localStream){
      if(localStream.stop) localStream.stop();
      if(localStream.stopUserMedia) localStream.stopUserMedia();
      localStream.getVideoTracks().forEach(function (stream) {
          stream.stop();
      });
    }
    $uibModalInstance.close(img);
  }

}

takePictureModalController.$inject = ['$scope', '$uibModalInstance', '$timeout'];
