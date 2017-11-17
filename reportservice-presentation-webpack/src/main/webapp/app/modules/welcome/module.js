'use strict';

const WelcomeConfiguration = ($stateProvider) => {
    $stateProvider
        .state('welcome.home', {
            url: '/home',
            templateUrl: 'app/modules/welcome/views/welcome.html'
        });
}

WelcomeConfiguration.$inject = ['$stateProvider'];

module.exports = angular.module('app.welcome', ['ui.router']).config(WelcomeConfiguration);
