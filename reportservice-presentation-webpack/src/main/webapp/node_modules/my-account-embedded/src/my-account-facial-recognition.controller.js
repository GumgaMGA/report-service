export default function facialRecognitionController($scope, $uibModalInstance, $timeout, $http, config, user){
    var video, canvas, localStream, videoTrack, context, capture, picDimensions, tracker, pic, ctx;

    if(!user || !user.token){
        swal('Parece que você está desconectado.');
        $scope.close();
    }

    function init() {
        $scope.images = undefined;
        $scope.message = 'Verificando se você possui fotos...';
        getImagesById(user.idUser).then(function (response) {
            $scope.images = [];
            response
                .data
                .forEach(function (data) {
                    $scope.images.push({id: data.id, image: 'data:image/png;base64,' + data.image.bytes})
                })
            delete $scope.message;
        })
    }
    init();

    function getImagesById(idUser) {
        return $http.get(config.appURL + '/api/security/image-by-user/' + idUser + "?gumgaToken="+user.token);
    }

    function sendImage(data, user) {
        $scope.message = 'Salvando sua foto, aguarde...';
        var formDataFile = new FormData();
        formDataFile.append('image', data);
        return $http({
            method: 'POST',
            url: config.appURL + '/api/security/user-image?gumgaToken='+user.token,
            data: {imageData: data.replace('data:image/png;base64,', ''), user: {
                id: user.idUser,
                login: user.login,
                picture: user.picture,
                name: user.name,
            }}
        })
    }

    $scope.removeImage = function(idImage, index){
      if($scope.message) return;
      $scope.message = 'Removendo sua foto, aguarde...';
      $http.get(config.appURL + '/api/security/remove-image/' + idImage + '?gumgaToken='+user.token)
        .then(function (response) {
            $scope.images.splice(index, 1)
            delete $scope.message;
        })
    }

    navigator.getUserMedia({video: true}, function(stream) {
        $timeout(function(){
            localStream = stream;
            video  = document.getElementById("video-area-my-profile");
            canvas = document.getElementById("canvas-area-my-profile");
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            context = canvas.getContext('2d');
            picDimensions = {sx: 0, sy: 0, sWidth: canvas.width, sHeight: canvas.height}
            video.srcObject = stream;
            video.play();
            tracker = new tracking.ObjectTracker('face');

            tracker.setInitialScale(4);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);
            tracking.stopUserMedia = function () {
                if (tracking.localStream) {
                    tracking.localStream.stop();
                }
            };

            videoTrack = tracking.track(video, tracker, {camera: false});
            $scope.isCapture = false
            tracker.on('track', function (event) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                event.data.forEach(function (rect) {
                    context.strokeStyle = '#1eb7ad';
                    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    context.font = '12px Helvetica';
                    context.fillStyle = "#000";
                    // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                    // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                    picDimensions.sx = rect.x;
                    picDimensions.sy = rect.y;
                    picDimensions.sWidth = rect.width;
                    picDimensions.sHeight = rect.height;

                });
                $scope.isCapture = event.data.length > 0;
            });

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

    var timeoutAux;

    $scope.take = function(){
        if($scope.isCapture){
            var pic = document.getElementById("pic-my-profile");
            var ctx = pic.getContext("2d");
            pic.width = picDimensions.sWidth;
            pic.height = picDimensions.sHeight;
            ctx.clearRect(0, 0, picDimensions.sWidth, picDimensions.sHeight);
            ctx.drawImage(video, picDimensions.sx * 2, picDimensions.sy * 2, picDimensions.sWidth * 2, picDimensions.sHeight * 2, 0, 0, picDimensions.sWidth, picDimensions.sHeight);
            if(timeoutAux){
              $timeout.cancel(timeoutAux);
              timeoutAux = undefined;
            }
            sendImage(pic.toDataURL(), user)
                .then(function (response) {
                    $scope.images.push({
                        id: response.data.data.id,
                        image: 'data:image/png;base64,' + response.data.data.image.bytes
                    })
                    $timeout(function () {
                        var el = document.getElementsByClassName('my-profile-images')[0]
                        el.scrollLeft = 99999999999;
                        delete $scope.message;
                    }, 500);
                })
        }else{
          $scope.messageError = 'Procure um lugar mais claro, não estamos conseguindo detectar seu rosto.';
          timeoutAux = $timeout(function(){
            delete $scope.messageError;
          }, 3000)
        }
    }

    $scope.close = function(img){
        if(localStream){
            if(localStream.stop) localStream.stop();
            if(localStream.stopUserMedia) localStream.stopUserMedia();
            localStream.getVideoTracks().forEach(function (stream) {
                stream.stop();
            });
        }
        if (tracking) {
            tracking.stopUserMedia()
        }

        if (videoTrack) {
            videoTrack.stop()
        }
        $uibModalInstance.close(img);
    }

}

facialRecognitionController.$inject = ['$scope', '$uibModalInstance', '$timeout', '$http', 'config', 'user'];
