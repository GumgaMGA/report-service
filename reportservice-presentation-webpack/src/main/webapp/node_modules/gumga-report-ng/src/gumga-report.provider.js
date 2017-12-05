'use strict';
GumgaReportProvider.$inject = [];

function GumgaReportProvider() {

    return {
        $get: ['GumgaRest', '$http', function (GumgaRest, $http) {
            var self = this;

            self._isEmpty = (value) => {
                return value == undefined || value == null
            }

            self._APILocation = self._APILocation || window.APILocation
            self._token = self._token || sessionStorage.getItem('token') || localStorage.getItem('token');
            self._licenseKey = self._licenseKey || undefined;
            self._enableOi = self._isEmpty(self._enableOi) || self._enableOi
            self._urlGumgaReport = self._urlGumgaReport || self._APILocation.apiLocation + '/api/gumgareport';
            self._urlReportConnection = self._urlReportConnection || self._APILocation.apiLocation + '/api/genericreport/reportconnection';

            if (self._token) {
                self._urlGumgaReport = self._urlGumgaReport.concat('?gumgaToken=' + self._token);
                self._urlReportConnection = self._urlReportConnection.concat('?gumgaToken=' + self._token);
            }

            var Service = new GumgaRest(self._urlGumgaReport);
            Service.connectionLocal = self._urlReportConnection;

            Service.getUrlGumgaReport = () => {
                return self._urlGumgaReport.split('?')
            };

            Service.getNew = () => {
                return $http.get(Service.getUrlGumgaReport() + "/new" + (self._token ? '?gumgaToken=' + self._token : ''));
            };

            Service.licenseKey = () => {
                return self._licenseKey;
            };

            Service.isEnableOi = () => {
                return self._enableOi;
            };

            return Service;
        }],
        setAPILocation: function (api) {
            this._APILocation = api
        },
        getAPILocation: function (api) {
            return this._APILocation
        },
        setLocalizationLang: function (locationLang, description) {
            Stimulsoft.Base.Localization.StiLocalization
            .addLocalizationFile(locationLang, false, description || "Portuguese (Brazil)");
            Stimulsoft.Base.Localization.StiLocalization
            .setLocalizationFile(locationLang, true);
        },
        setToken: function (token) {
            this._token = token
        },
        getToken: function (token) {
            return this._token
        },
        setUrlGumgaReport: function (urlGumgaReport) {
            this._urlGumgaReport = urlGumgaReport
        },
        getUrlGumgaReport: function () {
            return this._urlGumgaReport
        },
        setUrlReportConnection: function (urlReportConnection) {
            this._urlReportConnection = urlReportConnection
        },
        getUrlReportConnection: function () {
            return this._urlReportConnection
        },
        setLicenseKey: function (key) {
            this._licenseKey = key
        },
        getLicenseKey: function (key) {
            return this._licenseKey
        },
        enableOi: function () {
            this._enableOi = true
        },
        disableOi: function () {
            this._enableOi = false
        }
    }
}

export default angular.module('gumga.report.provider', []).provider('$gumgaReport', GumgaReportProvider);
