import Login        from './login/component.js'
import GumgaLoginService        from './login/service.js'
import LoginHeader  from './header/component.js'
import Facebook  from './facebook/component.js'
import Google  from './google/component.js'
import FacebookFactory  from '../factorys/facebook/factory.js'
import GooglePlus  from './google/angular-google-plus.js'
// import Sanitize  from 'angular-sanitize'

require('../stylesheets/login.css');

angular
  .module('gumga.login', ['googleplus'])
  .component('glLogin', Login)
  .component('glLoginHeader', LoginHeader)
  .component('glLoginFacebook', Facebook)
  .component('glLoginGoogle', Google)
  .service('GumgaLoginService', GumgaLoginService)
  .factory('FacebookFactory', FacebookFactory.facebookFactory)
