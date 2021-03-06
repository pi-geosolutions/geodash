"use strict";

angular.module('geodash', [
  'ngResource',
  'ngNewRouter',
  'angular-chosen',
  'flash',
  'pascalprecht.translate',
  'ui.ace',
  'ngeo'
]).controller(
  'AppController', [ '$router', AppController ]
).config(['$componentLoaderProvider', function ($componentLoaderProvider) {
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'components/' + name + '/' + name + '.tpl.html';
  });
}]).config(['$translateProvider', function ($translateProvider) {

  $translateProvider
    .preferredLanguage('en')
    .useSanitizeValueStrategy('escape')
    .useStaticFilesLoader({
      prefix: 'lang/',
      suffix: '.json'
    });

}]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]).filter('gdFromNow', function() {
  return function(dateString) {
    return moment(new Date(dateString)).fromNow();
  };
});
;


require('./components/admin/admin');
require('./components/admin/admin.tpl');
require('./components/admin/datasource');
require('./components/admin/datasource.tpl');
require('./components/admin/datasources');
require('./components/admin/datasources.tpl');
require('./components/coordspicker/coordspicker');
require('./components/coordspicker/coordspicker.tpl');
require('./components/indicators/indicators');
require('./components/indicators/indicators.tpl');
require('./components/remotes/remotes');
require('./components/remotes/remotes.tpl');
require('./components/harvesters/harvesters');
require('./components/harvesters/harvesters.tpl');
require('./components/harvesters/scheduler.tpl');
require('./services/analytics');
require('./services/messages');
require('./services/chart_factory');
require('./services/utils');
require('./services/rest/indicators');
require('./services/rest/harvesters');
require('./services/indicators');
require('./services/seriefn');

function AppController($router) {
  $router.config([
    { path: '/'                 , component: 'admin' },
    { path: '/admin'            , component: 'admin' },
    { path: '/harvesters'       , component: 'harvesters' },
    { path: '/remotes'          , component: 'remotes' }
  ]);
}

