require('../services/module');

module.exports =  angular.module('app.gumgatagdefinition.controllers', ['app.gumgatagdefinition.services','ui.router'])
    .controller('GumgaTagDefinitionFormController', require('./GumgaTagDefinitionFormController'))
    .controller('GumgaTagDefinitionListController', require('./GumgaTagDefinitionListController'))
