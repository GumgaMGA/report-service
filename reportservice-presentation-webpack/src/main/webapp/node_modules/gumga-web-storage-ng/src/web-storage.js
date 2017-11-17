(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  'use strict';

  WebStorage.$inject = [];
  function WebStorage() {
    return {
      setSessionStorageItem: function setSessionStorageItem(key, value) {
        var _value = value;
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
          _value = angular.toJson(value);
        }
        window.sessionStorage.setItem(key, _value);
      },
      getSessionStorageItem: function getSessionStorageItem(key) {
        var g = window.sessionStorage.getItem(key);
        if (!g) {
          return null;
        }
        try {
          angular.fromJson(g);
        } catch (e) {
          return g;
        }
        return angular.fromJson(g);
      },
      removeSessionStorageItem: function removeSessionStorageItem(key) {
        window.sessionStorage.removeItem(key);
      },
      clearSessionStorage: function clearSessionStorage() {
        window.sessionStorage.clear();
      },
      getNumberOfItemsInSessionStorage: function getNumberOfItemsInSessionStorage() {
        return window.sessionStorage.length;
      },
      setLocalStorageItem: function setLocalStorageItem(key, value) {
        window.localStorage.setItem(key, angular.toJson(value));
      },
      getLocalStorageItem: function getLocalStorageItem(key) {
        var g = window.localStorage.getItem(key);
        try {
          angular.fromJson(g);
        } catch (e) {
          return g;
        }
        return angular.fromJson(g);
      },
      removeLocalStorageItem: function removeLocalStorageItem(key) {
        window.localStorage.removeItem(key);
      },
      clearLocalStorage: function clearLocalStorage() {
        window.localStorage.clear();
      },
      getNumberOfItemsInLocalStorage: function getNumberOfItemsInLocalStorage() {
        return window.localStorage.length;
      }
    };

  }

  if(!window.angular){
    throw 'Gumga Web Storage requires the AngularJS library. See -> https://angularjs.org';
  }

  angular.module('gumga.webstorage', [])
         .provider('GumgaWebStorage', function(){
           this.$get = function () {
              return WebStorage();
            }
         });

})();

},{}]},{},[1]);
