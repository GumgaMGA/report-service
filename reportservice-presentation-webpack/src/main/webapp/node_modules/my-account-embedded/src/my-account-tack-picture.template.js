export default `

    <div class="modal-header modal-header-my-profile">
      <i class="glyphicon glyphicon-remove close-crop-my-profile" ng-click="close()"></i>
      <span>Tirar foto</span>
    </div>
    <div class="modal-body modal-body-my-profile" style="margin-bottom: -5px;height: 449px;">
      <video id="video-area-my-profile" width="100%" height="100%"></video>
      <canvas id="canvas-area-my-profile" style="display:none;"></canvas>
    </div>
    <div class="modal-footer modal-footer-my-profile">
      <button class="btn btn-take-my-profile"
              type="button"
              ng-click="take()">
              <i class="glyphicon glyphicon-camera"></i>
              </button>
    </div>
    `
