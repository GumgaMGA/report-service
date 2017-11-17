'use strict';

require('./filter.js')
require('./filter-core.js')

angular
  .module('gumga.queryfilter.filter'
  , ['gumga.queryfilter.filter.directive','gumga.queryfilter.filter.core']);
