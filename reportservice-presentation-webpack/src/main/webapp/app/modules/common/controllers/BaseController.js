
const BaseController = ($timeout, $sce, BaseService, $state, $scope, gumgaController, $filter, $compile, GumgaWebStorage) => {
    $scope.keysJsonUrl = []
    $scope.gumgaMenu = []
    $scope.organizations = []

    $scope.info = GumgaWebStorage.getSessionStorageItem('user')

    $scope.orgAtual = JSON.parse(sessionStorage.getItem('user'))

    function getItemByName(menu, key, callback){
        menu.forEach(function(item){
            if(item.state == key){
                callback(item);
            }else{
                if(item.children){
                    return getItemByName(item.children, key, callback);
                }
            }
        })
    }

    $scope.getTitlePage = (menu) => {
        getItemByName(menu, $state.current.name, item => $scope.title = item.label);
    }

    BaseService.getGumgaMenu()
        .then(function(response) {
            $scope.gumgaMenu = response.data;
            $scope.getTitlePage($scope.gumgaMenu);
        })

    BaseService.getKeysJsonUrl()
        .then(function(response) {
            $scope.keysJsonUrl = response.data
        })

    BaseService.listOrganizations()
        .then(function(response) {
            $scope.organizations = response.data
        });

    $scope.changeOrganization = function(organization) {
        BaseService.changeOrganization(organization.id)
            .then(function(response) {
                var token = response.data.token || JSON.parse(sessionStorage.getItem('user')).token
                response.data.token = token
                sessionStorage.setItem('user', JSON.stringify(response.data))
                location.reload(true)
            })
    }

    $scope.logout = function() {
        sessionStorage.clear();
        $state.go('app.login')
    }
}

BaseController.$inject = ['$timeout', '$sce', 'BaseService', '$state', '$scope', 'gumgaController', '$filter', '$compile', 'GumgaWebStorage']

module.exports = BaseController
