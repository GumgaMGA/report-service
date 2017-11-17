'use strict';

module.exports = angular
    .module('app.base', [])
    .controller('BaseController', require('./controllers/BaseController'))
    .service('BaseService', require('./services/BaseService'))
