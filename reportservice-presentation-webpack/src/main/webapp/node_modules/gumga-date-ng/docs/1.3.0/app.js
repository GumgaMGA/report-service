angular.module('app', ['gumga.date'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;

    ctrl.config = {
      format: 'dd/MM/yyyy HH:mm',
      showCalendar: true,
      closeOnChange: false,
      inputProperties: {
        class: 'form-control gmd'
      }
    }


  })
