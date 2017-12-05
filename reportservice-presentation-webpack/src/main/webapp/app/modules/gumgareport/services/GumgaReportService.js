GumgaReportService.$inject = ['GumgaRest'];

function GumgaReportService(GumgaRest) {
	var Service = new GumgaRest(APILocation.apiLocation + '/api/gumgareport');

	return Service;
}

module.exports = GumgaReportService;
