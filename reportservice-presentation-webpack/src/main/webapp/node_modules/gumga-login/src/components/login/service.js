export default function GumgaLoginService($http, $window){
    const Service = {};

    Service.login = (email, password) => {
        return $http.post(Service.configuration['appURL'].concat('/public/token'), {user:email, password: password});
    }

    Service.getOrganizations = (token) => {
        return $http.get(Service.configuration['appURL'].concat('/public/token/organizations/'.concat(token)));
    }
    
    Service.changeOrganization = (token, organization) => {
      return $http.get(Service.configuration['appURL'].concat('/public/token/changeorganization/'.concat(token).concat('/').concat(organization.id)));
    }

    Service.lostPassword = (email) => {
      return $http.get(Service.configuration['appURL'].concat('/public/token/lost-my-password'), {
        params: {
          email: email,
          url: location.href
        }
      })
    }

    Service.searchTicket = (ticket) => {
      return $http.get(Service.configuration['appURL'].concat('/public/token/searchticket/').concat(ticket));
    }

    Service.updatePassword = (ticket, password) => {
      return $http.get(Service.configuration['appURL'].concat('/public/token/lostpassword/').concat(ticket).concat('/').concat(password));
    }

    Service.setItemInSession = (key, value) => $window.sessionStorage.setItem(key, JSON.stringify(value));

    Service.initConfiguration = _configuration => Service.configuration = _configuration;

    return Service;
}

GumgaLoginService.$inject = ['$http', '$window'];
