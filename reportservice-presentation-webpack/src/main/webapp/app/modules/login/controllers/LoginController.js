'use strict';

function LoginController (LoginService, $state, $scope, $timeout){
    var vm = this;

    vm.loginGumga = (login) => {
        LoginService.loginGumga(login)
            .then((response) => {
                $state.go('welcome.home');
            }, (error) => {
                // console.error(error);
            })
    }

    vm.loginFacebook = (login) => {
        LoginService.createTokenWithFacebook(login.user.email, login.authResponse.accessToken)
            .then((tokenSecurity) => {
                if (!tokenSecurity.data.response) {
                    $state.go('welcome.home');
                } else {
                    showMessagesFacebook(tokenSecurity.data.response)
                }
            })
    }

    const showMessagesFacebook = (response) => {
        showMessages(response)
        if (response == 'NO_USER') {
            sweetAlert("Usuário não existe", "O usuário do facebook parece não ter cadastro no sistema, crie uma conta e tente novamente.", "warning");
        }
    }

    const showMessagesGooglePlus = (response) => {
        showMessages(response)
        if (response == 'NO_USER') {
            sweetAlert("Usuário não existe", "O usuário do google plus parece não ter cadastro no sistema, crie uma conta e tente novamente.", "warning");
        }
    }

    const showMessages = (response) => {
        if (response == 'TOKEN_EXPIRED_OR_NOT_IS_VALID') {
            sweetAlert("Oops...", "Seu token está expirado ou não existe.", "error");
        }
        if (response == 'USER_NOT_ENTITLED_IN_TOKEN') {
            sweetAlert("Oops...", "Usuário informado não possui direito sobre o token.", "error");
        }
    }

    vm.loginGooglePlus = (login) => {
        LoginService.createTokenWithGooglePlus(login.user.email, login.authResponse.access_token)
            .then((tokenSecurity) => {
                if (!tokenSecurity.data.response) {
                    $state.go('welcome.home');
                } else {
                    showMessagesGooglePlus(tokenSecurity.data.response)
                }
            })
    }

    vm.configuration = {
        appURL : APILocation.apiLocation
    };

    vm.onLogin = (user, organizations) => {
        $state.go('welcome.home');
    }

}

LoginController.$inject = ['LoginService', '$state', '$scope', '$timeout'];

module.exports = LoginController;
