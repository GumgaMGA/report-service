import style from './alert.style.js';

const applyStyle = () => {
	if(!document.getElementById("gumga-alert-style")){
		let head = document.head || document.getElementsByTagName('head')[0]
		let elm = document.createElement('style');
		elm.type = 'text/css';
		elm.id = 'gumga-alert-style';
		if (elm.styleSheet) {
				elm.styleSheet.cssText = style;
		} else {
				elm.appendChild(document.createTextNode(style));
		}
		head.appendChild(elm);
	}
}

Alert.$inject = [];

function Alert(){
	return {
		$get: function(){
			applyStyle();
			return this;
		},
		__config: {
			warning: {
				icon: 'glyphicon glyphicon-warning-sign',
				type: 'warning'
			},
			danger: {
				icon: 'glyphicon glyphicon-exclamation-sign',
				type: 'danger'
			},
			success: {
				icon:'glyphicon glyphicon-ok',
				type: 'success'
			},
			info: {
				icon: 'glyphicon glyphicon-info-sign',
				type: 'info'
			}
		},
		_notify: function(type,title,message,options){
			var config = this.__config[type]
			,		offset = options.offset || 50
			,		timer = options.timer || 100
			,		delay = options.delay || 6000
			,		color = options.color || undefined
			,		alowDismiss = options.alowDismiss || true
			,		animationEnter = options.animationEnter || 'animated bounceInRight'
			,		animationExit = options.animationExit || 'animated bounceOutRight';

			$.notify({
				icon: config.icon,
				title: title,
				message: message
			},{
				type: type,
				offset: offset,
				timer: timer,
				delay: delay,
				alow_dismiss: alowDismiss,
				z_index: 1500,
				animate: {
					enter: animationEnter,
					exit: animationExit
				},
				template: `

				<div data-notify="container"
					class="gumga-alert-popup col-xs-9 col-sm-3 alert alert-{0}" role="alert">

					<button
							type="button"
							aria-hidden="true"
							class="close gumga-alert-popup-icon-close gumga-alert-popup-icon-close-{0}"
							data-notify="dismiss">×</button>
					<div class="gumga-alert-popup-icon">
						<span class="gumga-alert-popup-icon-circle">
						<div data-notify="icon"></div>
						</span>

					</div>
					<div class="gumga-alert-popup-content">
						<span data-notify="title"><b>{1}</b></span><br>
						<span data-notify="message">{2}</span>
					</div>
				</div>

				`
			})
		},
		createWarningMessage: function(title,message,options){
			if(!options) options = {};
			this._notify('warning',title,message,options);
		},
		createDangerMessage: function(title,message,options){
			if(!options) options = {};
			this._notify('danger',title,message,options);
		},
		createSuccessMessage: function(title,message,options){
			if(!options) options = {};
			this._notify('success',title,message,options);
		},
		createInfoMessage: function(title,message,options){
			if(!options) options = {};
			this._notify('info',title,message,options);
		}
	}
}

const module = angular.module('gumga.alert',[]).provider('GumgaAlert',Alert);

export default module.name;
