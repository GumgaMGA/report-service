'use strict';

require('./provider/provider.js');
require('./helper/helper.js');
require('./filter/filter.js');

require('./directive/helper/helper.js');
require('./directive/translate-tag/translate-tag.js');
require('./directive/translate/translate.js');

angular.module('gumga.translate', [
    'gumga.translate.provider',
    'gumga.translate.filter',
    'gumga.translate.helper',
    'gumga.translate.directive',
    'gumga.translate.directive.translatetag',
    'gumga.translate.directive.translatehelper'
  ])
