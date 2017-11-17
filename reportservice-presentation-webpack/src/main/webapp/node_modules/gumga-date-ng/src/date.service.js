(() => {
  'use strict';

  const GumgaService = () => {

      const configuration = {
        background: '#1abc9c',
        primaryColor: '#1abc9c',
        fontColor: '#fff',
        format: 'dd/MM/yyyy',
        minYear: 1700,
        timeZone: "America/Sao_Paulo",
        maxYear: 2050,
        position: 'BOTTOM_LEFT',
        changeDateOnTab: false,
        showCalendar: true,
        closeOnChange: false,
        inputProperties: {
          class: 'form-control gmd'
        }
      }

      let _holidays = {
        'M': {//Month, Day
            '01/01': "Confraternização Universal",
            '04/14': "Paixão de Cristo",
            '04/21': "Tiradentes",
            '05/01': "Dia do Trabalho",
            '09/05': "Independência do Brasil",
            '10/12': "Nossa Senhora Aparecida",
            '11/02': "Finados",
            '11/15': "Proclamação da República",
            '12/25': "Natal"
        },
        'W': {//Month, Week of Month, Day of Week
            // '1/3/1': "Martin Luther King Jr. Day",
            // '2/3/1': "Washington's Birthday",
            // '5/5/1': "Memorial Day",
            // '9/1/1': "Labor Day",
            // '10/2/1': "Columbus Day",
            // '11/4/4': "Thanksgiving Day"
        }
    };

      const getDefaultConfiguration = () => {
        return configuration;
      }

      const setDefaultConfiguration = config => {
        Object.keys(config).forEach(key => configuration[key] = config[key]);
      }

      const getHolidays = () => {
        return _holidays;
      }

      const addHoliday = (date, description) => {
        let month = moment(date).month() + 1;
        let day = moment(date).date();
        if(day < 10) day = '0'+day;
        if(month < 10) month = '0'+month;
        _holidays['M'][`${month}/${day}`] = description;
      }

      return {
        getDefaultConfiguration : getDefaultConfiguration,
        setDefaultConfiguration : setDefaultConfiguration,
        getHolidays : getHolidays,
        addHoliday : addHoliday,
        $get : function(){
          return {
            getDefaultConfiguration : getDefaultConfiguration,
            setDefaultConfiguration : setDefaultConfiguration,
            getHolidays : getHolidays,
            addHoliday : addHoliday
          }
        }
      };

  }

  angular.module('gumga.date.service', [])
         .provider('GumgaDateService', GumgaService);
})();
