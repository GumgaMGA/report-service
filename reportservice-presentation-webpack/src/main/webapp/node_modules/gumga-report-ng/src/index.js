import GumgaReport from './gumga-report.component'
import GumgaReportProvider from './gumga-report.provider'

module.exports = angular.module('gumga.report', ['gumga.report.provider'])
    .component('gumgaReport', GumgaReport)
    