angular.module('app', ['ui.ace'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;

    ctrl.consoleValue = "var gquery = \n    new GQuery(new Criteria('nome', ComparisonOperator.EQUAL, 'Mateus'))\n    .or(new Criteria('nome', ComparisonOperator.CONTAINS, 'Felipe'))\n    .and(new Criteria('nome', ComparisonOperator.ENDS_WITH, 'Almeida'))\n\n\n\nreturn gquery;";

    ctrl.generate = function(){
      try{
        var json = eval('(function() {' + ctrl.consoleValue + ' }())');
        if(json){
          $('#json').JSONView(JSON.parse(JSON.stringify(json)));
          ctrl.json = json;
        }else{
          $.notify("Você deve retornar o GQuery para ver o JSON.");
        }
      }catch(e){
        console.error('Seu script está incorreto.', e);
      }
    }

    ctrl.generate();

    var clipboard = new Clipboard('.copy-json');

    clipboard.on('success', function(e) {
        $.notify("Copiado", "success");
        e.clearSelection();
    });


    ctrl.goTo = function(id){
      angular.element('html, body').animate({
        scrollTop: angular.element('#'+id).offset().top - 60
      }, 1000);
    }

  })
