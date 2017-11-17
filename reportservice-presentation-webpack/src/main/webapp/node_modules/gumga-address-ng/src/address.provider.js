function AddressProvider(){

  let defaultConfiguration = {
    servicesAPI : 'http://45.33.100.20/services-api',
    translation : {
      country: 'Pais',
      zipCode: 'CEP',
      premisseType: 'Tipo Logradouro',
      premisse: 'Logradouro',
      number: 'Número',
      information: 'Complemento',
      neighbourhood: 'Bairro',
      state: 'UF',
      stateCode: 'Cód. UF',
      localization: 'Localidade',
      formalCode: 'Cód. IBGE',
      coordinates: 'Latitude e Longitude'
    }
  }

  const setServicesAPI = (apiLocation) => defaultConfiguration['servicesAPI'] = apiLocation;

  const getServicesAPI = () => defaultConfiguration['servicesAPI'];

  const setTranslation = (translation) => Object.keys(translation)
    .forEach(key => defaultConfiguration['translation'][key] = translation[key]);

  const getTranslation = () => defaultConfiguration['translation'];

  return {
    setServicesAPI: setServicesAPI,
    getServicesAPI: getServicesAPI,
    setTranslation: setTranslation,
    getTranslation: getTranslation,
    $get: function(){
      return {
        setServicesAPI: setServicesAPI,
        getServicesAPI: getServicesAPI,
        setTranslation: setTranslation,
        getTranslation: getTranslation
      }
    }
  }
}

AddressProvider.$inject = [];

export default AddressProvider;
