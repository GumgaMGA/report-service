GumgaReportListController.$inject = ['$scope', 'GumgaReportService', 'gumgaController'];

function GumgaReportListController($scope, GumgaReportService, gumgaController) {

  gumgaController.createRestMethods($scope, GumgaReportService, 'gumgareport');

  GumgaReportService.resetDefaultState();
  $scope.gumgareport.execute('get');

  $scope.gumgareport.on('deleteSuccess', function () {
    $scope.gumgareport.execute('get');
  });

  $scope.actions = [
    { key: 'option1', label: 'option1' },
    { key: 'option2', label: 'option2' }
  ];

  $scope.search = function (field, param) {
    $scope.query = { searchFields: [field], q: param }
    $scope.gumgareport.methods.search(field, param)
  }

  $scope.advancedSearch = function (param) {
    $scope.gumgareport.methods.advancedSearch(param)
  }

  $scope.action = function (queryaction) {
    // console.log(queryaction);
  }

  $scope.tableConfig = {
    columns: 'id ,button',
    checkbox: true,
    selection: 'multi',
    materialTheme: true,
    itemsPerPage: [5, 10, 15, 30],
    columnsConfig: [
      {
        name: 'id',
        title: '<span gumga-translate-tag="gumgareport.id"> id </span>',
        content: '{{$value.id }}',
        sortField: 'id'
      },
      {
        name: 'button',
        title: ' ',
        content: `
        <span class="pull-right"><a class="btn gmd btn-link gmd-ripple" ui-sref="gumgareport.edit({id: $value.id })"><i class="glyphicon glyphicon-pencil"></i></a></span>
        <span class="pull-right"><a class="btn gmd btn-link gmd-ripple" ui-sref="gumgareport.view({id: $value.id })"><i class="glyphicon glyphicon-search"></i></a></span>
        `
      }
    ]
  };

};

module.exports = GumgaReportListController;
