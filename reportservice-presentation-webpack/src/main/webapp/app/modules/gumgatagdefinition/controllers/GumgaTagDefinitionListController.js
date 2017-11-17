
const GumgaTagDefinitionListController = ($scope, GumgaTagDefinitionService, gumgaController) => {

    gumgaController.createRestMethods($scope, GumgaTagDefinitionService, 'gumgatagdefinition');

    GumgaTagDefinitionService.resetDefaultState();

    $scope.gumgatagdefinition.execute('get');

    $scope.gumgatagdefinition.on('deleteSuccess', () => {
        $scope.gumgatagdefinition.execute('get');
    });

    $scope.actions = [
        { key: 'option1', label: 'option1' },
        { key: 'option2', label: 'option2' }
    ]

    $scope.search = (field, param) => {
        $scope.query = { searchFields: [field], q: param }
        $scope.gumgatagdefinition.methods.search(field,param)
    }

    $scope.advancedSearch = (param) => {
        $scope.gumgatagdefinition.methods.advancedSearch(param)
    }

    $scope.action = (queryaction) => {
        console.log(queryaction);
    }

    $scope.tableConfig = {
        columns: 'name,button',
        checkbox: true,
        selection: 'multi',
        materialTheme: true,
        itemsPerPage: [5, 10, 15, 30],
        columnsConfig: [{
                name: 'name',
                title: '<span gumga-translate-tag="gumgatagdefinition.name">name</span>',
                content: '{{$value.name}}',
                sortField: 'name'
            },
            {
                name: 'button',
                title: ' ',
                content: '<span class="pull-right"><a class="btn btn-primary btn-sm" ui-sref="gumgatagdefinition.edit({id: {{$value.id}} })"><i class="glyphicon glyphicon-pencil"></i></a></span>'
            }]
    };

}

GumgaTagDefinitionListController.$inject = ['$scope', 'GumgaTagDefinitionService', 'gumgaController'];
module.exports = GumgaTagDefinitionListController;
