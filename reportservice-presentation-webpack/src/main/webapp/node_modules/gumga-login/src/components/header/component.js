let HeaderComponent = {
  bindings: {
    register: '@',
    login: '@',
    background: '@',
    logo: '@',
    menus: '=?',
    title: '@'
  },
  template: `
    <header class="header-login" style="background-image: url({{$ctrl.background}})">
      <nav class="login-nav" style="{{$ctrl.menus.length == 0 ? 'border:none;': ''}}">
        <ul ng-if="$ctrl.menus.length > 0">
          <li ng-repeat="menu in $ctrl.menus">
            <a href="{{menu.url}}" ng-if="menu.link" title="menu.label">
                <div ng-bind-html="menu.icon" style="float: left;margin-right: 5px;"></div>
                {{menu.label}}
            </a>
            <a ui-sref="{{menu.url}}" ng-if="!menu.link" title="menu.label">
                <div ng-bind-html="menu.icon" style="float: left;margin-right: 5px;"></div>
                &nbsp;{{menu.label}}
            </a>
          </li>
        </ul>
      </nav>
      <div class="logo-box">
        <img data-ng-src="{{$ctrl.logo}}" title="{{$ctrl.title}}">
      </div>
    </header>
  `,
    controller: [function() {
      let ctrl = this;

      ctrl.$onInit = () => {
        ctrl.menus = ctrl.menus || [];
      }

    }]
}

export default HeaderComponent
