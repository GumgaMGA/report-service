(function(angular){

    angular.module('app', ['gumga.date', 'gumga.layout'])
      .config(function(GumgaDateServiceProvider){

        GumgaDateServiceProvider.setDefaultConfiguration({
          // fontColor: '#000'
          maxYear: 3000
        })

        // GumgaDateServiceProvider.addHoliday(07, 10, 'Aniver do dasdasdsa');
        // GumgaDateServiceProvider.addHoliday(11, 13, 'Aniver do teteu');

        // var datanascimentomateus = new Date("1996-11-13T10:30:00-03:00");

        GumgaDateServiceProvider.addHoliday("2017-11-03", 'Feriado de exemplo');
        // GumgaDateServiceProvider.addHoliday(847891800000, 'Aniver do mateus');
        

      })
      .controller('ctrl', function($scope) {

        // $scope.nascimento = new Date("2017-03-25T10:30:00-03:00");

        // LEFT_BOTTOM,LEFT_TOP,BOTTOM_LEFT,BOTTOM_RIGHT,RIGHT_BOTTOM,RIGHT_TOP,TOP_LEFT,TOP_RIGHT

        $scope.config = {
          fontColor: '#fff',
          format: 'dd/MM/yyyy',
          position: 'BOTTOM_LEFT',
          closeOnChange : true,
          changeDateOnTab: false,
          showCalendar: true,
          timeZone: "America/Sao_Paulo",
          change: function(data){
            // console.log(data)
          }
        }

        $scope.config2 = {
          fontColor: '#fff',
          format: 'HH:mm',
          position: 'BOTTOM_LEFT',
          showCalendar: true,
          timeZone: "America/Sao_Paulo",
          change: function(data){
            // console.log(data)
          }
        }

          $scope.config3 = {
              fontColor: '#fff',
              format: 'dd/MM/yyyy',
              position: 'BOTTOM_LEFT',
              closeOnChange : true,
              changeDateOnTab: false,
              showCalendar: true,
              timeZone: "America/Sao_Paulo",
              change: function(data){
                  // console.log(data)
              }
          }

          $scope.config4 = {
              fontColor: '#fff',
              format: 'dd/MM/yyyy',
              position: 'BOTTOM_LEFT',
              closeOnChange : true,
              changeDateOnTab: false,
              showCalendar: true,
              timeZone: "America/Sao_Paulo",
              change: function(data){
                  // console.log(data)
              }
          }
          $scope.config5 = {
              fontColor: '#fff',
              format: 'dd/MM/yyyy',
              position: 'BOTTOM_LEFT',
              closeOnChange : true,
              changeDateOnTab: false,
              showCalendar: true,
              timeZone: "America/Sao_Paulo",
              change: function(data){
                  // console.log(data)
              }
          }


      });

})(window.angular);
