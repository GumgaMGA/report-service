angular.module('app', ['gumga.mask'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;

    ctrl.maskOptions = {
     maskDefinitions: {
       'seuRegex': /[regex]/ // <= aqui vai sua regex
     },
     clearOnBlur: false,
     eventsToHandle: ['input', 'keyup', 'click', 'focus']
   };


  })
