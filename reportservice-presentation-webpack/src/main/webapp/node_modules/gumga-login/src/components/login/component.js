let LoginComponent = {
  bindings: {
    onLogin: '&?',
    configuration: '=?',
    register: '=?'
  },
  transclude: true,
  template: `
    <div class="gumga-login-error" style="{{$ctrl.alertErrorMessage.type=='success'?'background: #009F95;':''}}" ng-show="$ctrl.alertErrorMessage">
      {{$ctrl.alertErrorMessage.message}}
    </div>
    <section class="login-box">

      <form name="login-form" class="login-form" data-ng-submit="$ctrl.submit(email, password)" novalidate ng-if="$ctrl.step == 'LOGIN'">
        <label for="username">
          <input type="email" name="username" placeholder="E-mail" data-ng-model="email">
        </label>
        <label for="password">
          <input type="password" name="password" placeholder="Senha" data-ng-model="password">
        </label>
        <label for="do-login">
          <button type="submit" name="do-login" class="do-login">{{$ctrl.loginText}}</button>
        </label>

        <a class="forgot-password" style="cursor:pointer;" data-ng-click="$ctrl.updateStep('FORGOT')">Esqueceu a senha?</a>

        <label for="do-register" style="margin: 10px;" ng-if="$ctrl.registerFields">
            Não tem uma conta?
            <a  type="button"
                style="cursor:pointer;"
                data-ng-click="$ctrl.updateStep('REGISTER')"
                name="do-register" class="do-register">Inscreva-se</a>
        </label>
        <div style="margin: 25px 35px;" ng-transclude></div>
      </form>

      <form name="login-form" class="login-form" ng-show="$ctrl.step == 'CHANGE_ORGANIZATION'">

        <img style="width: 100px;
          height: 100px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 50%;" data-ng-src="{{$ctrl.user.profileImage}}"/>

        <br>
        <br>
        <label>Atualmente em {{$ctrl.organizations.length}} organizações.</label>

        <label for="organization">
          <input type="text" autocomplete="off" name="username"
          placeholder="Qual organização deseja entrar?" ng-init="$ctrl.organizationFilter = ''" data-ng-model="$ctrl.organizationFilter">
        </label>

        <div class="organizations-container">
          <div style="background:#f5f5f5;margin-bottom:10px;padding: 10px;cursor: pointer;"
            data-ng-click="$ctrl.organizationSelected = organization"
            data-ng-repeat="organization in $ctrl.organizations | filter:{ name: $ctrl.organizationFilter }">
            <span class="text text-muted">{{organization.name}}</span>
            <span ng-show="$ctrl.organizationSelected.id == organization.id" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          </div>
        </div>

        <label for="do-login">
          <button type="button"
                  ng-disabled="!$ctrl.organizationSelected"
                  data-ng-click="$ctrl.changeOrganization($ctrl.organizationSelected)" name="do-login" class="do-login">{{$ctrl.changeOrganizationText}}</button>
        </label>

      </form>


      <form name="login-form" class="login-form" ng-show="$ctrl.step == 'REGISTER'">
        <div style="height: 20px;">
          <span style="cursor: pointer;font-size: 17px;" class="glyphicon glyphicon-chevron-left pull-left" ng-click="$ctrl.updateStep('LOGIN')"></span>
          <label style="cursor: pointer;" class="pull-left" ng-click="$ctrl.updateStep('LOGIN')">Voltar</label>
        </div>
        <label data-ng-repeat="field in $ctrl.registerFields" for="{{field.field}}">
          <input type="{{field.type}}" name="{{field.field}}" id="{{field.field}}" placeholder="{{field.placeholder}}" data-ng-model="field.value">
        </label>
        <label for="do-login">
          <button type="button"
          ng-disabled="!$ctrl.registerIsValid()"
          name="do-login"
          ng-click="$ctrl.submitRegister()"
          class="do-login">{{$ctrl.registerText}}</button>
        </label>
      </form>

      <form name="login-form" class="login-form" ng-show="$ctrl.step == 'FORGOT'">
        <div style="height: 20px;">
          <span style="cursor: pointer;font-size: 17px;" class="glyphicon glyphicon-chevron-left pull-left" ng-click="$ctrl.updateStep('LOGIN')"></span>
          <label style="cursor: pointer;" class="pull-left" ng-click="$ctrl.updateStep('LOGIN')">Voltar</label>
        </div>
        <label for="username">
          <input type="email" name="username" placeholder="Endereço de e-mail.." data-ng-model="$ctrl.forgotEmail">
        </label>
        <p style="font-size: 9px;">
          <b>Obs :</b> O E-mail informado acima, receberá uma mensagem contendo um informações de como redefinir sua senha.
        </p>
        <label for="do-login">
          <button type="button"
                  ng-disabled="!$ctrl.isValidEmail($ctrl.forgotEmail) || disabledForgotButton"
                  data-ng-click="$ctrl.lostPassword($ctrl.forgotEmail)"
                  name="do-login" class="do-login">{{$ctrl.forgotButtonText}}</button>
        </label>
      </form>

      <form name="login-form" class="login-form" ng-show="$ctrl.step == 'NEW_PASSWORD'" ng-init="$ctrl.lost={}">
          <div style="height: 20px;">
            <span style="cursor: pointer;font-size: 17px;" class="glyphicon glyphicon-chevron-left pull-left" ng-click="$ctrl.removeParams()"></span>
            <label style="cursor: pointer;" class="pull-left" ng-click="$ctrl.removeParams()">Voltar</label>
          </div>
          <label for="password">
            <input type="password" name="password" placeholder="Nova senha" data-ng-model="$ctrl.lost.password">
          </label>
          <label for="password">
            <input type="password" name="password" placeholder="Repita a nova senha" data-ng-model="$ctrl.lost.confirmPassword">
          </label>
          <label for="do-login">
            <button type="button"
                    ng-disabled="($ctrl.lost.password != $ctrl.lost.confirmPassword) || disabledLostButton || !$ctrl.lost.password"
                    data-ng-click="$ctrl.updatePassword($ctrl.lost);"
                    name="do-login" class="do-login">{{$ctrl.lostButtonText}}</button>
          </label>
      </form>

    </section>
  `,
  controller: ['GumgaLoginService', '$timeout', '$scope', function(GumgaLoginService, $timeout, $scope) {
    let ctrl = this;
    ctrl.loginText = 'Entrar';
    ctrl.changeOrganizationText = 'Continuar';
    ctrl.registerText = 'Inscrever';
    ctrl.forgotButtonText = 'Redefinir';
    ctrl.lostButtonText = 'Redefinir';
    ctrl.disabledLostButton = false;
    ctrl.disabledForgotButton = false;

    const getUrlVars = () => {
      let vars = {}, parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function(m,key,value) {
        vars[key] = value;
      });
      return vars;
    }

    var params = getUrlVars();

    if(ctrl.register){
      ctrl.registerFields = ctrl.register.fields;
    }
    ctrl.organizationFilter = '';

    ctrl.updateStep = _step => ctrl.step = _step;

    ctrl.updateStep('LOGIN');

    $scope.$watch('$ctrl.configuration', () => {
      GumgaLoginService.initConfiguration(ctrl.configuration);
    }, true);

    ctrl.$onInit = () => {
      if(!ctrl.configuration){
        console.error("Please enter the setup object for the gumga login.");
      }
      GumgaLoginService.initConfiguration(ctrl.configuration);
    }

    ctrl.back = (step) => {
        switch (step) {
          case 'LOGIN':
            ctrl.updateStep(step);
            delete ctrl.password;
            break;
        }
    }

    const createUserImage = (user) => {
        if(user.picture){
            user.profileImage = 'data:' + user.picture.mimeType + ';base64,' + user.picture.bytes;
            return;
        }
        user.profileImage = 'src/images/user-without-image.png';
    }

    ctrl.submit = (email, password) => {
      if(!email || !password){
        ctrl.showMessage('error', 'Precisamos que todas as informações sejam preenchidas.');
        return;
      }
      if(!ctrl.isValidEmail(email)){
        ctrl.showMessage('error', 'Aparentemente você digitou um E-mail incorreto.');
        return;
      }
      ctrl.loginText = 'Aguarde...';
      GumgaLoginService.login(email, password)
        .then(resp=>{
          ctrl.user = resp.data;
          createUserImage(ctrl.user);
          GumgaLoginService.setItemInSession('user', resp.data);
          GumgaLoginService.getOrganizations(resp.data.token)
            .then(organizations => {
                GumgaLoginService.setItemInSession('organizations', organizations.data);
                if(organizations.data.length == 1){
                    ctrl.onLogin({user: resp.data, organizations: organizations.data});
                }
                if(organizations.data.length > 1){
                    ctrl.updateStep('CHANGE_ORGANIZATION');
                    ctrl.organizations = organizations.data;
                }
            }, error => {
                ctrl.onLogin({user: resp.data, organizations: undefined});
            });
        }, error => {
          ctrl.loginText = 'Entrar';
        });
    }

    ctrl.changeOrganization = organization => {
      ctrl.changeOrganizationText = 'Aguarde...';
      GumgaLoginService.changeOrganization(ctrl.user.token, organization)
        .then(resp=>{
            ctrl.user['organization'] = resp.data['name'];
            ctrl.user['organizationHierarchyCode'] = resp.data['hierarchyCode'];
            ctrl.user['softwareHouse'] = resp.data['isSoftwareHouse'];
            ctrl.user['securityManager'] = resp.data['securityManager'];
            GumgaLoginService.setItemInSession('user', ctrl.user);
            ctrl.onLogin({user: ctrl.user, organizations: ctrl.organizations});
            ctrl.loginText = 'Entrar';
            ctrl.updateStep('LOGIN');
        }, error=> {
          ctrl.changeOrganizationText = 'Erro :(';
        });
    }

    ctrl.isUrl = url => {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
    }

    ctrl.isValidEmail = email => {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    const getRegisterFieldByName = name => {
      return ctrl.registerFields.filter(field => field.field == name)[0];
    }

    const handlingErrorRegister = (field, comparatorField, valid) => {
        var inputComparator = document.getElementById(comparatorField.field)
        var input = document.getElementById(field.field)
        if(inputComparator && input){
          inputComparator.classList[valid?'remove':'add']('gumga-login-input-error');
          input.classList[valid?'remove':'add']('gumga-login-input-error');
        }
    }

    ctrl.registerIsValid = () => {
      let valid = true;
      if(!ctrl.registerFields){return}
      ctrl.registerFields.forEach(field => {
        if(field.conditions){
          field.conditions.forEach(condition=>{
            if(condition.operation && condition.field){
               var comparatorField = getRegisterFieldByName(condition.field)
               if(valid){
                  valid = eval("'"+field.value+"' "+condition.operation+" '"+comparatorField.value+"'");
                  handlingErrorRegister(field, comparatorField, valid);
               }
            }
          })
        }
      });
      return valid;
    }

    ctrl.submitRegister = () => {
      ctrl.registerText = 'Aguarde...';
      if(!ctrl.registerFields){return}
      var toReturn = {};
      ctrl.registerFields.forEach(field => {
        toReturn[field.field] = field.value;
      });
      ctrl.register.submit(toReturn);
      ctrl.loginText = 'Entrar';
      ctrl.updateStep('LOGIN');
    }

    ctrl.lostPassword = (email) => {
      ctrl.forgotButtonText = 'Aguarde...';
      ctrl.disabledForgotButton = true;
      GumgaLoginService.lostPassword(email)
      .then(resp => {
        if(resp.data.response == 'OK'){
          ctrl.showMessage('success', 'Solicitação de nova senha enviada, verifique seu E-mail.');
          delete ctrl.forgotEmail;
          ctrl.updateStep('LOGIN');
        }else if(resp.data.response == 'NO_USER'){
          ctrl.showMessage('error', 'O E-mail informado não possui registro.');
        }
        ctrl.forgotButtonText = 'Redefinir';
        ctrl.disabledForgotButton = false;
      }, error => {
        ctrl.showMessage('error', 'Falha ao conectar com os servidores, tente mais tarde.');
        ctrl.forgotButtonText = 'Redefinir';
        ctrl.disabledForgotButton = false;
        ctrl.updateStep('LOGIN');
      })
    }

    ctrl.updatePassword = (lost) => {
      ctrl.lostButtonText = 'Aguarde...';
      ctrl.disabledLostButton = true;
      if(!lost.password || (lost.password != lost.confirmPassword)){
          ctrl.showMessage('error', 'Verifique se você repetiu sua senha corretamente.');
          return;
      }

      GumgaLoginService.updatePassword(params['ticket'], lost.password)
        .then(resp => {
          if(resp.data.response == 'OK'){
            ctrl.showMessage('success', 'Sua senha foi redefinida com sucesso.');
            ctrl.lostButtonText = 'Redefinir';
            ctrl.disabledLostButton = false;
            ctrl.updateStep('LOGIN');
          }else if(resp.data.response == 'TOKEN_EXPIRED'){
              ctrl.showMessage('error', 'Seu ticket de redefinição de senha foi expirado.', 3000, () => {
                ctrl.removeParams();
              });
          }else{
            ctrl.showMessage('error', 'Falha ao conectar com os servidores, aguarde...', 3000, () => {
              ctrl.removeParams();
            });
          }
        }, error => {
          ctrl.showMessage('error', 'Falha ao conectar com os servidores, aguarde...', 3000, () => {
            ctrl.removeParams();
          });
        })
    }

    ctrl.showMessage = (type, message, time, callback) => {
        ctrl.alertErrorMessage = {
          message: message,
          type: type
        };
        $timeout(() => {
          delete ctrl.alertErrorMessage
          if(callback) callback();
        }, (time || 3000));
    }

    ctrl.removeParams = () => {
      location.href = location.href.substring(0, location.href.lastIndexOf('?'));
    }


    if(params['ticket']){
       GumgaLoginService.searchTicket(params['ticket'])
        .then(resp => {
          if(resp.data.response == 'OK'){
            ctrl.updateStep('NEW_PASSWORD');
          }else if(resp.data.response == 'TOKEN_EXPIRED'){
              ctrl.showMessage('error', 'Seu ticket de redefinição de senha foi expirado.', 3000, () => {
                ctrl.removeParams();
              });
          }else{
            ctrl.showMessage('error', 'Falha ao conectar com os servidores, aguarde...', 3000, () => {
              ctrl.removeParams();
            });
          }
        }, error => {
          ctrl.showMessage('error', 'Falha ao conectar com os servidores, aguarde...', 3000, () => {
            ctrl.removeParams();
          });
        })
    }

  }]
}

export default LoginComponent
