'use strict';

const LoginService = ($http) => {
    const Service = {};

    var publicApi = APILocation.apiLocation + '/public/token'

    Service.loginGumga = (user) => {
        return $http.get(publicApi + '/create/' + user.email + '/' + user.senha);
    }

    Service.setRedirectLogin = (organization, presentationUrl) => {
        LoginService.redirect = {organization: organization, presentationUrl: presentationUrl};
    }

    Service.getRedirectLogin = () => {
        return LoginService.redirect || undefined;
    }

    Service.removeRedirectLogin = () => {
        delete LoginService.redirect;
        LoginService.redirect = undefined;
    }

    Service.setUserSession = (user) => {
        sessionStorage.setItem('gumgaToken', user.token);
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    Service.removeUserSession = (user) => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('gumgaToken');
    }

    Service.listOrganizations = (token) => {
        return $http.get(publicApi + '/organizations/' + token + '/');
    }

    Service.changeOrganization = (token, organizationId) => {
        return $http.get(publicApi + '/changeorganization/' + token + '/' + organizationId);
    }

    Service.createTokenWithFacebook = (email, token) => {
        return $http.get(APILocation.apiLocation + '/public/token/facebook?email='+email+'&token='+token)
    }

    Service.createTokenWithGooglePlus = (email, token) => {
        return $http.get(APILocation.apiLocation + '/public/token/google-plus?email='+email+'&token='+token)
    }

    Service.getSecurityUserData = () => {
        return $http.get(APILocation.apiLocation + '/api/userdata/check');
    }

    Service.updateSecurityUserData = (gumgaUserData) => {
        return $http.post(APILocation.apiLocation + '/api/userdata/updateValue', gumgaUserData);
    }

    return Service;
}

LoginService.$inject = ['$http'];

module.exports = LoginService;
