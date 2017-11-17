export default `

    <div class="modal-header modal-header-my-profile">
      <i class="glyphicon glyphicon-remove close-crop-my-profile" ng-click="close()"></i>
      <span>Fotos do Reconhecimento Facial</span>
    </div>
    <div class="modal-body modal-body-my-profile" style="margin-bottom: -5px;height: 449px; text-align: center;">
      <video style="border-radius: 2px;" id="video-area-my-profile" width="320" height="240" preload autoplay loop muted ></video>
      <canvas id="canvas-area-my-profile" width="320" height="240"></canvas>

      <div class="my-profile-images">
        <label ng-show="images.length == 0 && !message" style="width: 100%;margin-top: 40px;">
          Você não possui fotos, que tal tirar uma agora?
        </label>
        <div ng-repeat="image in images" class="image-item-my-profile">
          <img class="img-circle" style="width: 100px;" ng-src="{{image.image}}" >
          <span class="image-my-profile-placeholder" ng-click="removeImage(image.id, $index)">
            <i class="glyphicon glyphicon-trash"></i>
            <br>
            Remover
          </span>
        </div>
      </div>

    </div>
    <div class="modal-footer modal-footer-my-profile" style="display: flex;">
      <label class="message-my-profile" ng-show="message">{{message}}</label>
      <label class="message-my-profile text-danger" ng-show="messageError">{{messageError}}</label>
      <button class="btn btn-take-my-profile"
              ng-disabled="message"
              type="button"
              ng-click="take()">
              <i class="glyphicon glyphicon-camera"></i>
              </button>
    </div>

    <canvas id="pic-my-profile" style="display: none;"></canvas>


    <style>
        .message-my-profile{
          margin: 0 auto;
          margin-top: 35px;
        }

        .image-item-my-profile:hover > .image-my-profile-placeholder{
          display: block;
        }

        .image-item-my-profile{
          float: left;
          width: 100px !important;
          height: 100px;
          margin-right: 10px;
          position: relative;
        }

        .image-my-profile-placeholder{
          position: absolute;
          top: 0;
          width: 100px;
          left: 0;
          height: 100%;
          background: rgba(0, 0, 0, 0.57);
          border-radius: 50%;
          color: #fff;
          display: none;
          cursor: pointer;
        }

        .image-my-profile-placeholder > i {
          color: #fff;
          margin: 0 auto;
          margin-top: 25px;
          font-size: 25px;
        }

        .my-profile-images{
            height: 145px;
            background: #f5f5f5;
            width: 100%;
            padding: 15px;
            overflow-x: scroll;
            margin-top: 35px;
            display: inline-flex;
        }
        #canvas-area-my-profile {
            margin-left: -320px;
        }
         #video-area-my-profile {
            /*box-shadow: 0px 1px 9px 0px #333131;*/
            margin: 0 auto;
            margin-top: 20px;
        }
</style>



    `
