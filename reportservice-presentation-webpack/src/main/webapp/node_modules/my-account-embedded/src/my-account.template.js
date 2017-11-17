export default `
<style>
  my-account-embedded .form-control.gmd[disabled]{
    background: #E4E4E4;
  }
  .cropArea {
    background: #E4E4E4;
    overflow: hidden;
    width:100%;
    height:350px;
  }
  .modal-body-my-profile{
    padding: 0;
  }
  .modal-footer-my-profile{
    background-color: #e0e0e0 !important;
    padding: 0;
    border: 0;
    height: 100px;
  }
  .modal-header-my-profile{
    background: #1eb7ad;
    border: none;
    color: #fff;
  }
  .modal-header-my-profile > span{
    font-weight: 500;
    font-size: 19px;
    line-height: 19px;
  }
  .btn-done-my-profile{
    width: 60px;
    color: #fff !important;
    height: 60px;
    border-radius: 50%;
    position: absolute;
    outline: none !important;
    right: 25px;
    top: 365px;
    font-size: 25px;
    background: #1eb7ad;
    padding-top: 10px;
  }
  .btn-take-my-profile{
    width: 60px;
    padding-top: 10px;
    color: #fff !important;
    height: 60px;
    border-radius: 50%;
    position: absolute;
    outline: none !important;
    font-size: 25px;
    right: 25px;
    top: 465px;
    background: #1eb7ad;
  }
  .close-crop-my-profile{
    cursor: pointer;
  }
</style>
<div class="row">
  <div class="col-xs-12">

    <div class="row">
      <div class="col-lg-2 col-sm-2 col-xs-12">
          <div class="gmd panel panel-default">
            <div class="panel-body">
              <img ng-src="{{$ctrl.user.pictureURL}}" class="img-responsive img-circle"/>
              <input id="my-account-file-input" type="file" style="display: none;" accept=".png, .jpg, .jpeg"/>
              <div class="dropdown gmd" align="center" style="margin-top: 15px;">
                  <button class="link gmd btn" aria-expanded="false"
                       style="white-space: normal;font-size: 13px;overflow: hidden;"
                       data-toggle="dropdown"
                       aria-haspopup="true"
                       aria-hidden="true">
                      <i class="glyphicon glyphicon-pencil"></i>
                      Alterar foto
                  </button>
                  <ul class="dropdown-menu gmd" aria-labelledby="dropdownMenu">
                      <li ><a style="padding: 15px;cursor: pointer;" ng-click="$ctrl.capturePicture()">Tirar foto</a></li>
                      <li ><a style="padding: 15px;cursor: pointer;" ng-click="$ctrl.loadPicture()">Carregar foto</a></li>
                      <li ><a style="padding: 15px;cursor: pointer;" ng-click="$ctrl.removePicture()">Remover foto</a></li>
                  </ul>
            </div>
            <br>
            <button ng-show="$ctrl.configuration.facialRecognition" class="link gmd btn btn-block" style="white-space: normal;font-size: 13px;overflow: hidden;" ng-click="$ctrl.facialRecognition()">
                <i class="glyphicon glyphicon-user"></i>
                Reconhecimento facial
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-10 col-sm-10 col-xs-12">

          <div class="gmd panel panel-default">
            <div class="panel-body">Informações</div>
            <div class="panel-body">
              <form>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="name">Nome</label>
                      <input type="text" ng-model="$ctrl.user.name" class="gmd form-control" id="name" placeholder="Qual seu nome completo?">
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="email">E-mail</label>
                      <input type="email" disabled="disabled" ng-model="$ctrl.user.login" class="gmd form-control" id="email" placeholder="Informe seu endereço de e-mail.">
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="panel-footer">
              <button class="gmd btn btn-primary" ng-click="$ctrl.saveUser('Dados atualizado com sucesso.')">Atualizar perfil</button>
            </div>
          </div>

          <div class="gmd panel panel-default">
            <div class="panel-body">Mudar senha</div>
            <div class="panel-body">
              <form>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label for="oldPassword">Senha antiga</label>
                      <input type="password" ng-model="$ctrl.user.oldPassword" class="gmd form-control" id="oldPassword" placeholder="Qual sua senha atual?">
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label for="newPassword">Nova senha</label>
                      <input type="password" ng-model="$ctrl.user.newPassword" class="gmd form-control" id="newPassword" placeholder="Escolha uma nova senha.">
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label for="confirmNewPassword">Confirme a nova senha</label>
                      <input type="password" ng-model="$ctrl.user.confirmNewPassword" class="gmd form-control" id="confirmNewPassword" placeholder="Repita sua nova senha.">
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="panel-footer">
              <button class="gmd btn btn-primary"
                      ng-click="$ctrl.updatePassword($ctrl.user.oldPassword, $ctrl.user.newPassword, $ctrl.user.confirmNewPassword)">
                      Atualizar senha
              </button>
            </div>
          </div>

      </div>
    </div>

  </div>
</div>

`
