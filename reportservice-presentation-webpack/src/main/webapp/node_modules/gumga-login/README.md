# Gumga Login
Gumga login ofereçe uma experiência moderna aos usuários, o login é feito pelo próprio componente,
armazenando o usuário e suas organizações na sessionStorage.

### Dependências

- Angular

```
bower install angular
```
```html
// Adicione no seu projeto
<script src="/bower_components/angular/angular.min.js"></script>
```

## Instalação
```
bower install gumga-login
```

## Exemplo de uso
```html
// Adicione no seu projeto
<script src="bower_components/gumga-login/dist/gumga-login.min.js"></script>
<link rel="stylesheet" href="bower_components/gumga-login/dist/gumga-login.min.css">
```

### Gumga Header
```html
<gl-login-header
  background="/images/gumga-login-bg.jpg"
  logo="/images/gumga-logo-vertical-negative.svg"
  title="Gumga Studio"
  menus="meusmenus"></gl-login-header>
```
| Atributo | Descrição |
| --- | --- |
| background | Caminho da imagem que será usada de background |
| logo | Caminho da imagem que será usada de logo |
| title | Usado no atributo title da logo |

### Gumga Login
```html
<gl-login
  on-login="onLogin(user, organizations)"
  register="exemplo"
  configuration="configuration">
</gl-login>
```
| Atributo | Descrição |
| --- | --- |
| on-login | Função de retorno que será executada após o login |
| register | Objeto com os atributos do formulário de registro |
| configuration | Objeto de configuração do gumga login |


### Controller
```js
angular
  .module('app',['gumga.login'])
  .controller('LoginController', ['$scope',function($scope) {
  
    $scope.configuration = {
        appURL : 'http://gumga.studio/dashboard-api' //ROTA DA SUA API QUE SERÁ FEITO O LOGIN
    };

    $scope.onLogin = (user, organizations) => {
      console.log(user, organizations)
    }

    $scope.exemplo = {
      fields: [ // CAMPOS QUE SERÃO MOSTRADOS NO FORMULÁRIO
        {
          field: 'name', // NOME DO ATRIBUTO
          placeholder: 'Nome', // DESCRIÇÃO DA INPUT
          type: 'text' // TIPO DA INPUT  (color, date, datetime-local, email, month, number, range, tel, time, url, week)
        },
        {
          field: 'email',// NOME DO ATRIBUTO
          placeholder: 'E-mail',// DESCRIÇÃO DA INPUT
          type: 'email'// TIPO DA INPUT  (color, date, datetime-local, email, month, number, range, tel, time, url, week)
        },
        {
          field: 'password',// NOME DO ATRIBUTO
          placeholder: 'Senha',// DESCRIÇÃO DA INPUT
          type: 'password'// TIPO DA INPUT  (color, date, datetime-local, email, month, number, range, tel, time, url, week)
        },
        {
          field: 'confirmPassword',// NOME DO ATRIBUTO
          placeholder: 'Confirme sua senha',// DESCRIÇÃO DA INPUT
          type: 'password',// TIPO DA INPUT  (color, date, datetime-local, email, month, number, range, tel, time, url, week)
          conditions: [ // CONDIÇÕES DE VALIDAÇÃO DO CAMPO
            {
              operation: '==', // OPERAÇÃO DA CONDIÇÃO ( !=, ==, ==, <, >, <=, >= )
              field: 'password' // NOME DO ATRIBUTO DO OUTRO CAMPO DA CONDIÇÃO
            }
          ]
        }
      ],
      //FUNÇÃO QUE SERÁ CHAMADA QUANDO O USUÁRIO CLICAR EM EXECUTAR, A FUNÇÃO RECEBE O PARAMETRO DATA QUE SÃO OS DADOS DO USUÁRIO
      submit: function(data){
        console.log(data)
      }
    }


  }])
```

## Adicionando Menus a Header
```html
<body ng-controller="LoginController">
  <gl-login-header
    background="/images/gumga-login-bg.jpg"
    logo="/images/gumga-logo-vertical-negative.svg"
    title="Gumga Studio"
    menus="meusmenus"
    ></gl-login-header>
</body>
```
```js
angular
  .module('app',['gumga.login'])
  .controller('LoginController', ['$scope',function($scope) {
      $scope.meumenu = [
        {
          label: 'Pagina inicial', // DESCRIÇÃO DO MENU
          link: true, // SE FOR URL DEIXAR TRUE, CASO FOR UM ESTADO DO ANGULAR DEIXAR FALSE
          icon: '<i class="fa fa-etsy" aria-hidden="true"></i>', //ICONE
          url: 'https://www.gumga.io/' // URL DE REDIRECIONAMENTO
        },
        {
          label: 'Pagina inicial', // DESCRIÇÃO DO MENU
          link: false, // SE FOR URL DEIXAR TRUE, CASO FOR UM ESTADO DO ANGULAR DEIXAR FALSE
          icon: '<i class="fa fa-etsy" aria-hidden="true"></i>', //ICONE
          url: 'cliente.list' // NOME DO STATE PARA REDIRECIONAMENTO
        }
      ]
  }])
```

## Login com redes sociais
```html
<body ng-controller="LoginController">
  <gl-login-header
    register="home.login"
    login="home.login"
    background="/images/gumga-login-bg.jpg"
    logo="/images/gumga-logo-vertical-negative.svg"
    title="Gumga Studio"
    ></gl-login-header>

  <gl-login on-submit="loginGumga(login)" type="email" username="email" password="senha">
      <div class="divider"><strong class="divider-title">ou entre com</strong></div>
      <gl-login-facebook app-key="" on-login="login(data)"></gl-login-facebook>
      <gl-login-google app-key=""
                       on-login="login(data)"
                       client-id="">
      </gl-login-google>
  </gl-login>
</body>
```
