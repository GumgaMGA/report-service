const AccountService = ($http, GumgaRest, $q) => {
    const Service = new GumgaRest()

    


    return Service
}

AccountService.$inject = ['$http', 'GumgaRest', '$q']

module.exports = AccountService;
