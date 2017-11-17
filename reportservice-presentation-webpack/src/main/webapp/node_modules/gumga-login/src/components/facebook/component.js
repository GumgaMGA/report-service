let Facebook = {
  bindings: {
    appKey: '@',
    onLogin: '&'
  },
  template: `

        <svg version="1.1" data-ng-click="$ctrl.submit()" id="Layer_1" xmlns="http://www.w3.org/2000/svg" style="height: 40px;cursor:pointer;" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        	 viewBox="0 0 291.319 291.319" style="enable-background:new 0 0 291.319 291.319;" xml:space="preserve">
        <g>
        	<path style="fill:#3B5998;" d="M145.659,0c80.45,0,145.66,65.219,145.66,145.66c0,80.45-65.21,145.659-145.66,145.659
        		S0,226.109,0,145.66C0,65.219,65.21,0,145.659,0z"/>
        	<path style="fill:#FFFFFF;" d="M163.394,100.277h18.772v-27.73h-22.067v0.1c-26.738,0.947-32.218,15.977-32.701,31.763h-0.055
        		v13.847h-18.207v27.156h18.207v72.793h27.439v-72.793h22.477l4.342-27.156h-26.81v-8.366
        		C154.791,104.556,158.341,100.277,163.394,100.277z"/>
        </g>
      </svg>

  `,
  controller: ['FacebookFactory', '$transclude', function(FacebookFactory, $transclude) {
    let ctrl = this;

    ctrl.$onInit = () => {
      FacebookFactory.setLang('pt_BR') // set lang

      FacebookFactory.init({
          appId: ctrl.appKey, // required, default = null
          status: true, // optional, default = true
          cookie: false, // optional, default = false
          xfbml: false, // optional, default = false
          version: 'v2.4' // optional, default = v2.4
      })
    }

    ctrl.me = facebookStatus => {
        FacebookFactory.api('/me', {
            fields: 'name,email,gender,birthday'
        }, function(userResponse) {
            var response = {};
            response['authResponse'] = facebookStatus.authResponse;
            response['user'] = userResponse;
            ctrl.onLogin({data: response});
        })
    }

    ctrl.submit = () => {
      FacebookFactory.getLoginStatus(function(response) {
          if (response.status === 'connected') {
              ctrl.me(response);
          } else {
              FacebookFactory.login(function(response) {
                if (response.status === 'connected') {
                    ctrl.me(response);
                }
              }, {
                  scope: 'public_profile,email,user_birthday'
              })
          }
      })

    }

  }]
}

export default Facebook
