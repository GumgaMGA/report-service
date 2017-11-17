
const GumgaTagDefinitionService = (GumgaRest) => {
  const Service = new GumgaRest(APILocation.apiLocation + '/api/gumgatagdefinition');

  return Service;
}

GumgaTagDefinitionService.$inject = ['GumgaRest'];
module.exports = GumgaTagDefinitionService;
