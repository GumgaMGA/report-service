export default `
    <div class="modal-header modal-header-my-profile">
      <i class="glyphicon glyphicon-remove close-crop-my-profile" ng-click="close()"></i>
      <span>Arraste a imagem para ajustar</span>
    </div>
    <div class="modal-body modal-body-my-profile">
      <div class="cropArea">
        <img-crop image="myImage" result-image="myCroppedImage"></img-crop>
      </div>
    </div>
    <div class="modal-footer modal-footer-my-profile">
      <button class="btn btn-done-my-profile"
              type="button"
              ng-click="crop(myCroppedImage)">
              <i class="glyphicon glyphicon-ok"></i>
              </button>
    </div>
  `
