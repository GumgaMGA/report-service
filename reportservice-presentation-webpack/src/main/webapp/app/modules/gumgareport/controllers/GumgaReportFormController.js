GumgaReportFormController.$inject = ['GumgaReportService', '$state', 'entity', '$scope', 'gumgaController'];

function GumgaReportFormController(GumgaReportService, $state, entity, $scope, gumgaController) {

	gumgaController.createRestMethods($scope, GumgaReportService, 'gumgareport');

	$scope.gumgareport.data = entity.data || {};
	$scope.continue = {};

	$scope.dictionaryDatabases = [
		new Stimulsoft.Report.Dictionary.StiMySqlDatabase("teste MySQL", "", "url=jdbc:mysql://localhost:3306/security?zeroDateTimeBehavior=convertToNull; user = root; password = senha;", false)
	]

	$scope.dictionaryVariables = [
		new Stimulsoft.Report.Dictionary.StiVariable("Gumga Examples", "teste", "teste", "teste ID", Stimulsoft.System.Type.valueOf(), "[[teste]]", true, Stimulsoft.Report.Dictionary.StiVariableInitBy.Value, false),
		new Stimulsoft.Report.Dictionary.StiVariable("Outro Examples", "teste2", "teste2", "teste2 ID", Stimulsoft.System.Type.valueOf(), "[[teste2]]", true, Stimulsoft.Report.Dictionary.StiVariableInitBy.Value, false)
	]

	$scope.gumgareport.on('putSuccess', function (data) {
		$state.go('gumgareport.list');
	});
}

module.exports = GumgaReportFormController;
