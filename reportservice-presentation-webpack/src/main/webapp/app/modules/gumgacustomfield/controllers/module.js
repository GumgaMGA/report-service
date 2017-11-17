require('../services/module');

module.exports = angular.module('app.gumgacustomfield.controllers', ['app.gumgacustomfield.services','ui.router'])
    .controller('GumgaCustomFieldFormController', require('./GumgaCustomFieldFormController'))
    .controller('GumgaCustomFieldListController', require('./GumgaCustomFieldListController'));
