angular.module('app', ['gumga.list'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;

    $http.get('https://api.github.com/repos/gumga/gumga-list-ng/releases')
      .then(function (resp) {
        ctrl.exemplo = resp.data;
      })

    ctrl.tableConfig = {
      columns: 'tag_name, published_at',
      checkbox: true,
      materialTheme: true,
      ordination: true,
      resizable: true,
      fixed: {
          head: true,
          left: 2
      },
      columnsConfig: [
        {
          name: 'tag_name',
          alignColumn: 'center',
          alignRows: 'center' 
        }
      ]
    }

  })
