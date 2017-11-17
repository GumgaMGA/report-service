
const GumgaCustomFieldService = (GumgaRest) => {
  const Service = new GumgaRest(APILocation.apiLocation + '/api/gumgacustomfield');

  return Service;
}

GumgaCustomFieldService.$inject = ['GumgaRest'];
module.exports = GumgaCustomFieldService;
