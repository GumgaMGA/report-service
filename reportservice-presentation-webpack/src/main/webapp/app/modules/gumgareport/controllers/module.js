require('../services/module');

module.exports = angular
        .module('app.gumgareport.controllers', ['app.gumgareport.services'])
        .controller('GumgaReportFormController', require('./GumgaReportFormController'))
        .controller('GumgaReportListController', require('./GumgaReportListController'));
