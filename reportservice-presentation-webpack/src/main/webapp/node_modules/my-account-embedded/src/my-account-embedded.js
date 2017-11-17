import myAccountTemplate from './my-account.template.js'
import cropTemplate from './my-account-crop.template.js'
import takePictureTemplate from './my-account-tack-picture.template.js'

import takePictureModalController from './my-account-tack-picture.controller.js'
import cropModalController from './my-account-crop.controller.js'
import facialRecognitionController from './my-account-facial-recognition.controller.js'
import facialRecognitionTemplate from './my-account-facial-recognition.template.js'

function MyAccountEmbedded($timeout, $uibModal, $http, $rootScope) {
    var ctrl = this, inputFile;

    navigator.getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var userLocalStorage = JSON.parse(sessionStorage.getItem('user'));

    ctrl.user = angular.copy(userLocalStorage);

    var getPictureDefault = () => {
        return ctrl.configuration.defaultPicture || 'resources/images/user-not-image.png';
    }

    var setPictureURLByPicture = (picture, ignoreSave) => {
      $timeout(function(){
        ctrl.user.pictureURL = 'data:' + picture.mimeType + ';base64,' + picture.bytes;
      })
      if(!ignoreSave)
        savePicture();
    }

    var savePicture = function(){
      userLocalStorage.picture = ctrl.user.picture;
      sessionStorage.setItem('user', JSON.stringify(userLocalStorage));
      $rootScope.$broadcast('updateUserPicture', userLocalStorage);
      ctrl.saveUser();
    }

    ctrl.saveUser = function(message){
      $http.put(ctrl.configuration.appURL + '/api/security/update-user', {
        name: ctrl.user.name,
        picture: ctrl.user.picture,
        login: ctrl.user.login
      }, {
        headers: {
          'gumgaToken' : ctrl.user.token
        }
      }).then(resp=>{
        if(resp.status == 200 && message){
          $rootScope.$broadcast('myAccountUpdateUser', ctrl.user);
          swal('Perfil atualizado', message, 'success');
        }
      }, () => {
        swal('Aconteceu um erro na tentativa de salvar suas atualizações, tente novamente.');
      })
    }

    $timeout(function(){
      inputFile = document.getElementById('my-account-file-input');
      if(!inputFile) location.reload();
      inputFile.onchange = function(event) {
          var elm = event.srcElement || event.target;
          if(elm.files.length == 0) return;
          var file = elm.files[0];
          if(file){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(evt) {
              var data = evt.target.result;
              ctrl.openModalCropImage(data);
            };
          }
      }
      if(ctrl.user.picture){
        setPictureURLByPicture(ctrl.user.picture, true);
      }else{
        ctrl.user.pictureURL = getPictureDefault();
      }
    }, 1000)

    ctrl.capturePicture = function() {
      var modalInstance = $uibModal.open({
        template: takePictureTemplate,
        controller: takePictureModalController,
        controllerAs: '$ctrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
        }
      });
      modalInstance.result.then(function (picture) {
        if(picture){
          ctrl.openModalCropImage(picture);
        }
      });
    }

    ctrl.loadPicture = function() {
      inputFile.click()
    };

    ctrl.removePicture = function() {
        ctrl.user.pictureURL = getPictureDefault();
        ctrl.user.picture = null;
        savePicture();
    }

    ctrl.openModalCropImage = function(image){
      var modalInstance = $uibModal.open({
        template: cropTemplate,
        controller: cropModalController,
        controllerAs: '$ctrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          image: function () {
            return image;
          }
        }
      });
      modalInstance.result.then(function (picture) {
        if(picture){
          ctrl.user.picture = picture;
          setPictureURLByPicture(ctrl.user.picture);
        }
      });
    }

    ctrl.updatePassword = function(oldPassword, newPassword, confirmNewPassword) {
        if(!oldPassword){
          swal('Informe sua senha atual.');
          return;
        }
        if(!newPassword || newPassword.length <= 2){
          swal('Informe uma nova senha que tenha ao menos 3 digitos.');
          return;
        }
        if(newPassword == oldPassword){
          swal('Por favor, escolha uma senha diferente da antiga.');
          delete ctrl.user.newPassword
          delete ctrl.user.confirmNewPassword
          return;
        }
        if(!confirmNewPassword || confirmNewPassword != newPassword){
          swal('Você deve repetir sua senha corretamente.');
          delete ctrl.user.confirmNewPassword
          return;
        }

        $http.put(ctrl.configuration.appURL + '/public/token', {
          user: ctrl.user.login,
          password: oldPassword,
          newPassword: newPassword
        }).then(function(resp){
          if(resp.data.response == 'BAD_PASSWORD'){
            swal('A senha antiga está incorreta.');
            delete ctrl.user.oldPassword
          }
          if(resp.data.response == 'OK'){
            swal('Atualizado', 'Sua senha foi atualizada com sucesso.', 'success');
            delete ctrl.user.oldPassword
            delete ctrl.user.newPassword
            delete ctrl.user.confirmNewPassword
          }
        })

    }

    ctrl.facialRecognition = function() {
        var modalInstance = $uibModal.open({
            template: facialRecognitionTemplate,
            controller: facialRecognitionController,
            controllerAs: '$ctrl',
            backdrop: 'static',
            size: 'md',
            resolve: {
                config: function () {
                    return ctrl.configuration;
                },
                user: function () {
                    return ctrl.user;
                }
            }
        });
        modalInstance.result.then(function (picture) {

        });
    }

}

MyAccountEmbedded.$inject = ['$timeout', '$uibModal', '$http', '$rootScope'];

export default {
    bindings: {
      configuration: '<?'
    },
    template: myAccountTemplate,
    controller: MyAccountEmbedded
}
