(function () {
  'use strict';

  require ('./form/form.js');
  require ('./form-class/form-class.js');
  require ('./errors/errors.js');
  require ('./error/error.js');
  require ('./max/date.js');
  require ('./max/length.js');
  require ('./max/number.js');
  require ('./min/date.js');
  require ('./min/length.js');
  require ('./min/number.js');
  require ('./pattern/pattern.js');
  require ('./range/date.js');
  require ('./range/number.js');
  require ('./required/required.js');
  require ('./validate/type.js');
  require ('./model-error/model-error.js');
  require ('./model-error/model-error.provider.js');


  angular.module('gumga.form', [
    'gumga.form.form',
    'gumga.form.class',
    'gumga.form.errors',
    'gumga.form.error',
    'gumga.form.max.date',
    'gumga.form.max.length',
    'gumga.form.max.number',
    'gumga.form.min.date',
    'gumga.form.min.length',
    'gumga.form.min.number',
    'gumga.form.pattern',
    'gumga.form.range.date',
    'gumga.form.range.number',
    'gumga.form.required',
    'gumga.form.validate.type',
    'gumga.form.modelerror',
    'gumga.form.modelerror.provider'
  ])
})();

/*!
*	Gerador e Validador de CPF v1.0.0
*	https://github.com/tiagoporto/gerador-validador-cpf
*	Copyright (c) 2014-2015 Tiago Porto (http://www.tiagoporto.com)
*	Released under the MIT license
*/
function CPF(){"user_strict";function r(r){for(var t=null,n=0;9>n;++n)t+=r.toString().charAt(n)*(10-n);var i=t%11;return i=2>i?0:11-i}function t(r){for(var t=null,n=0;10>n;++n)t+=r.toString().charAt(n)*(11-n);var i=t%11;return i=2>i?0:11-i}var n=false,i=true;this.generate=function(){for(var n="",i=0;9>i;++i)n+=Math.floor(9*Math.random())+"";var o=r(n),a=n+"-"+o+t(n+""+o);return a},this.isValid=function(o){for(var a=o.replace(/\D/g,""),u=a.substring(0,9),f=a.substring(9,11),v=0;10>v;v++)if(""+u+f==""+v+v+v+v+v+v+v+v+v+v+v)return n;var c=r(u),e=t(u+""+c);return f.toString()===c.toString()+e.toString()?i:n}}
window.GumgaCPF = new CPF();  
