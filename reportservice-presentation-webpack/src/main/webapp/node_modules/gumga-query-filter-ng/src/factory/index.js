'use strict';

require('./hql-factory.js')
require('./query-model-factory.js')

angular
  .module('gumga.queryfilter.factory'
  ,['gumga.queryfilter.factory.hql','gumga.queryfilter.factory.querymodel']);