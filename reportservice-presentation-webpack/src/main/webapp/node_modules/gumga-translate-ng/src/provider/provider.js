(function () {
  'use strict';

  Translate.$inject = [];
  function Translate() {
    return {
      $get: ['$http', function ($http) {
        var self = this;
        this._url = this._url || './i18n/' + self._language + '.json';
        $http.get(this._url)
          .then(function SuccessGet(values) {
            localStorage.setItem('GUMGA' + self._language, JSON.stringify(values.data));
            localStorage.setItem('GUMGACurrent', self._language);
          })
        return self;
      }],
      setLanguage: function (language) {
        if (!language) throw 'You must pass a language to GumgaTranslate';
        this._language.toLowerCase() !== language.toLowerCase() ? this._language = language : function () { };
      },
      _language: 'pt-br',
      setURL: function(url){
        this._url = url;
      },
      getURL: function(){
        return this._url;
      }
    }
  }
  angular.module('gumga.translate.provider', [])
    .provider('$gumgaTranslate', Translate)
})();
