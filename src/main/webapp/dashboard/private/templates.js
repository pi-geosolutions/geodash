(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("assets/public/index", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('assets/public/index.html', [
'<!doctype html>',
'<html lang="en">',
'<head>',
'  <meta charset="utf-8">',
'  <base href="/geodash/dashboard/public/">',
'',
'  <link rel="stylesheet" href="libraries.css">',
'  <link rel="stylesheet" href="app.css">',
'  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/styles/default.min.css">',
'',
'  <title>Geo Dashboard</title>',
'</head>',
'',
'<body ng-app="geodash" ng-strict-di ng-controller="DashboardController as mainCtrl">',
'',
'  <div flash-message="2000"></div>',
'',
'  <div class="container-fluid" ng-class="{edit: mainCtrl.editing}">',
'    <gd-myboard editing="mainCtrl.editing" class="app-dashboard"></gd-myboard>',
'  </div>',
'',
'  <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js"></script>',
'  <script src="libraries.js"></script>',
'  <script src="templates.js"></script>',
'  <script src="app.js"></script>',
'  <script>require(\'app\');</script>',
'',
'</body>',
'',''].join("\n"));
  }]);
})();
});

require.register("components/admin/admin.tpl", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('components/admin/admin.tpl.html', [
'<section class="geodash-admin">',
'',
'  <!--Left panel-->',
'  <div class="col-sm-4 left-panel">',
'    <h4 translate="">Indicators</h4>',
'',
'    <!--Indicators list-->',
'    <div class="list-group">',
'      <a href="admin" class="list-group-item"',
'         ng-repeat="indicator in admin.indicators"',
'         ng-class="{active: admin.current == indicator}"',
'         ng-click="admin.current = indicator">',
'        {{indicator.config.label || indicator.name}}',
'      </a>',
'    </div>',
'',
'    <!--New indicator button-->',
'    <button class="btn btn-geodash" ng-click="admin.initNew()">',
'      <span translate="">new</span>',
'    </button>',
'',
'  </div>',
'',
'  <form novalidate name="indicatorForm" class="form-horizontal">',
'',
'    <!--Right panel-->',
'    <div class="col-sm-8" ng-if="admin.current">',
'',
'      <h4 translate="">{{admin.current.config.label || admin.current.name}}</h4>',
'',
'      <!--Create new alert message-->',
'      <div ng-if="!admin.current.id" class="alert alert-success" role="alert">',
'        createNew',
'      </div>',
'',
'',
'      <!--Tab menu-->',
'      <ul class="nav nav-tabs" role="tablist">',
'        <li role="presentation" class="active">',
'          <a href="admin" data-target="#global" aria-controls="global" role="tab" data-toggle="tab">global</a>',
'        </li>',
'        <li role="presentation">',
'          <a href="admin" data-target="#datasource" aria-controls="datasource" role="tab" data-toggle="tab">datasource</a>',
'        </li>',
'        <li role="presentation">',
'          <a href="admin" data-target="#graph" aria-controls="graph" role="tab" data-toggle="tab">graph</a>',
'        </li>',
'',
'        <button class="pull-right btn btn-danger" ng-click="admin.delete()">',
'          <span translate="">Delete</span>',
'        </button>',
'        <button class="pull-right btn btn-success" ng-click="admin.save()">',
'          <span translate="">Save</span>',
'        </button>',
'      </ul>',
'',
'',
'      <div class="tab-content">',
'',
'        <!--Global tab content-->',
'        <div role="tabpanel" class="tab-pane active" id="global">',
'          <div class="form-group">',
'            <label class="col-sm-2 control-label">',
'              <span translate="">Name</span>',
'            </label>',
'            <div class="col-sm-8">',
'              <input type="text" class="form-control"',
'                     ng-model="admin.current.name">',
'            </div>',
'          </div>',
'          <div class="form-group">',
'            <label class="col-sm-2 control-label">',
'              <span translate="">Label</span>',
'            </label>',
'            <div class="col-sm-8">',
'              <input type="text" class="form-control"',
'                     ng-model="admin.current.config.label">',
'            </div>',
'          </div>',
'          <div class="form-group">',
'            <label class="col-sm-2 control-label">',
'              <span translate="">Description</span>',
'            </label>',
'            <div class="col-sm-8">',
'              <textarea type="text" class="form-control"',
'                        ng-model="admin.current.config.description"></textarea>',
'            </div>',
'          </div>',
'        </div>',
'',
'        <!--Datasource tab content-->',
'        <div role="tabpanel" class="tab-pane" id="datasource">',
'',
'          <gd-datasources gd-datasources-array="admin.current.config.datasources"></gd-datasources>',
'',
'          <!--Datesource Test section-->',
'          <div class="col-md-offset-1" ng-if="admin.current.config.datasource.type">',
'',
'            <!--Nav pills-->',
'            <ul class="nav nav-pills test" role="tablist">',
'              <li role="presentation" ng-click="admin.showCoordsPicker()" ng-class="{disabled: !admin.isFormInputValid___(\'sqlquery\')}">',
'                <a href="admin" data-target="#testdatapane" aria-controls="global" role="tab" data-toggle="tab">testquery</a>',
'              </li>',
'              <li role="presentation" ng-if="admin.testData">',
'                <a href="admin" data-target="#testtransformpane" aria-controls="datasource" role="tab" data-toggle="tab">testdata</a>',
'              </li>',
'            </ul>',
'',
'            <div class="tab-content">',
'',
'              <!--Test request-->',
'              <div role="tabpanel" class="tab-pane" id="testdatapane">',
'',
'                <!--Coordinates picker-->',
'                <geodash-coordspicker coordinates="admin.lonlat" ng-if="!indicatorForm.sqlquery.$invalid && !indicatorForm.dburl.$invalid">',
'                </geodash-coordspicker>',
'',
'                <button class="btn btn-geodash test-btn" ng-disabled="admin.lonlat.length < 2" ng-click="admin.test()">',
'                  <span translate="">Test request</span>',
'                </button>',
'',
'                <div ng-if="admin.testData" id="testedData" ui-ace="admin.aceOptions" ng-model="admin.testData"></div>',
'                <div ng-if="admin.testError" class="alert alert-danger" role="alert">',
'                  {{admin.testError}}',
'                </div>',
'              </div>',
'',
'              <!--Transform config & test content-->',
'              <div role="tabpanel" class="tab-pane" id="testtransformpane">',
'                <label translate="">transformConfig</label>',
'',
'                <!--Transform config-->',
'                <div ng-if="admin.testData" id="transformConfig" ui-ace="{mode: \'json\', showGutter: false, showPrintMargin: false}" ng-model="admin.current.config.datasource.transform"></div>',
'',
'                <button ng-if="admin.testData" ng-disabled="!admin.current.config.datasource.transform" class="btn btn-geodash test-btn" ng-click="admin.exportData()">',
'                  <span translate="">Export data</span>',
'                </button>',
'',
'                <!--output series-->',
'                <div ng-if="admin.series" id="outputSerie" ui-ace="admin.aceOptions" ng-model="admin.series"></div>',
'',
'',
'              </div>',
'            </div>',
'',
'          </div>',
'        </div>',
'',
'        <!--Chart tab content-->',
'        <div role="tabpanel" class="tab-pane" id="graph">',
'          <div id="charConfig" ui-ace="admin.aceOptions" ng-model="admin.current.config.chartConfig"></div>',
'',
'          <button class="btn btn-geodash test-btn" ng-click="admin.viewChart(\'#chartDemo\')">',
'            <span translate="">view</span>',
'          </button>',
'',
'          <div id="chartDemo"></div>',
'',
'        </div>',
'      </div>',
'',
'    </div>',
'  </form>',
'',
'</section>',''].join("\n"));
  }]);
})();
});

require.register("components/admin/datasource.tpl", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('components/admin/datasource.tpl.html', [
'<div class="form-group">',
'  <label class="col-sm-2 control-label">',
'    <span translate="">Name</span>',
'  </label>',
'  <div class="col-sm-8">',
'    <input type="text" class="form-control"',
'           ng-model="ctrl.datasource.name">',
'  </div>',
'</div>',
'',
'<!--Type select-->',
'<div class="form-group">',
'  <label class="col-sm-2 control-label">',
'    <span translate="">Type</span>',
'  </label>',
'',
'  <div class="col-sm-10">',
'    <select class="form-control"',
'            ng-model="ctrl.datasource.type">',
'      <option>database</option>',
'      <option>filesystem</option>',
'    </select>',
'  </div>',
'</div>',
'',
'<!--Database options-->',
'<div class=""',
'     ng-if="ctrl.datasource.type == \'database\'">',
'',
'  <!--Database url-->',
'  <div class="form-group" ng-class="{\'has-error\': !ctrl.isFormInputValid(\'dburl\')}">',
'    <label class="col-sm-2 control-label">',
'      <span translate="">dburl</span>',
'    </label>',
'',
'    <div class="col-sm-10">',
'      <input type="text" class="form-control" required',
'             name="dburl" id="dburl"',
'             placeholder="jdbc:postgresql://localhost:5433/ne_risques_geodata?user=geonetwork&password=geonetwork"',
'             ng-model="ctrl.datasource.url">',
'    </div>',
'  </div>',
'',
'  <!--SQL Query-->',
'  <div class="form-group" ng-class="{\'has-error\': !ctrl.isFormInputValid(\'sqlquery\')}">',
'    <label class="col-sm-2 control-label">',
'      <span translate="">sqlquery</span>',
'    </label>',
'',
'    <div class="col-sm-10">',
'      <div id="sqlquery" required name="sqlquery" ui-ace="{mode: \'sql\', showGutter: false, showPrintMargin: false}"',
'           ng-model="ctrl.datasource.sql">',
'      </div>',
'    </div>',
'  </div>',
'</div>',
'',
'<!--Filesystem options-->',
'<div class=""',
'     ng-if="ctrl.datasource.type == \'filesystem\'">',
'',
'  <!--Path -->',
'  <div class="form-group" ng-class="{\'has-error\': !ctrl.isFormInputValid(\'fsPath\')}">',
'    <label class="col-sm-2 control-label">',
'      <span translate="">Path</span>',
'    </label>',
'',
'    <div class="col-sm-10">',
'      <input type="text" class="form-control" required',
'             name="fsPath" id="fsPath"',
'             placeholder="/home/philippe/data/cpc/rfe2/02_moyennes_pluies"',
'             ng-model="ctrl.datasource.path">',
'    </div>',
'  </div>',
'',
'  <div class="form-group" ng-class="{\'has-error\': !ctrl.isFormInputValid(\'fsPattern\')}">',
'    <label class="col-sm-2 control-label">',
'      <span translate="">Pattern</span>',
'    </label>',
'',
'    <div class="col-sm-10">',
'      <input type="text" class="form-control" required',
'             name="fsPattern" id="fsPattern"',
'             placeholder="Rain0Mm_${year}_days.tif"',
'             ng-model="ctrl.datasource.pattern">',
'    </div>',
'  </div>',
'  <div class="form-group" ng-class="{\'has-error\': !ctrl.isFormInputValid(\'fsAmount\')}">',
'    <label class="col-sm-2 control-label">',
'      <span translate="">Amount</span>',
'    </label>',
'',
'    <div class="col-sm-2">',
'      <input type="number" class="form-control" required',
'             name="fsAmount" id="fsAmount"',
'             ng-model="ctrl.datasource.amount">',
'    </div>',
'  </div>',
'</div>',
'<div class="checkbox col-sm-offset-2" ng-if="!$first">',
'  <label>',
'    <input type="checkbox" ng-model="ctrl.datasource.merge"><span translate="">Merge with previous</span>',
'  </label>',
'</div>',
'',
'',
'<!--Test section-->',
'<div class="col-md-offset-1" ng-if="ctrl.isValid()">',
'',
'  <!--Nav pills-->',
'  <ul class="nav nav-pills test" role="tablist">',
'    <li role="presentation" ng-click="ctrl.showCoordsPicker()">',
'      <a href="" data-target="{{::\'#testdatapane\' + ctrl.datasource.$$hashKey.replace(\':\', \'_\')}}" aria-controls="global" role="tab" data-toggle="tab">data</a>',
'    </li>',
'    <li role="presentation" ng-if="ctrl.testData">',
'      <a href="" data-target="#testtransformpane" aria-controls="datasource" role="tab" data-toggle="tab">transform</a>',
'    </li>',
'    <li role="presentation" ng-if="ctrl.testData">',
'      <a href="" data-target="#viewserie" aria-controls="datasource" role="tab" data-toggle="tab">view</a>',
'    </li>',
'  </ul>',
'',
'  <div class="tab-content">',
'',
'    <!--Test request-->',
'    <div role="tabpanel" class="tab-pane" id="{{::\'testdatapane\' + ctrl.datasource.$$hashKey.replace(\':\', \'_\')}}">',
'',
'      <!--Coordinates picker-->',
'      <geodash-coordspicker coordinates="ctrl.lonlat">',
'      </geodash-coordspicker>',
'',
'      <button class="btn btn-geodash test-btn" ng-disabled="ctrl.lonlat.length < 2" ng-click="ctrl.test()">',
'        <span translate="">Test request</span>',
'      </button>',
'',
'      <div ng-if="ctrl.testData" id="testedData" ui-ace="ctrl.aceOptions" ng-model="ctrl.testData"></div>',
'      <div ng-if="ctrl.testError" class="alert alert-danger" role="alert">',
'        {{ctrl.testError}}',
'      </div>',
'    </div>',
'',
'    <!--Transform config & test content-->',
'    <div role="tabpanel" class="tab-pane" id="testtransformpane">',
'      <label translate="">transformConfig</label>',
'',
'      <!--Transform config-->',
'      <div ng-if="ctrl.testData" id="transformConfig" ui-ace="{mode: \'json\', showGutter: false, showPrintMargin: false}" ng-model="ctrl.datasource.transform"></div>',
'',
'      <button ng-if="ctrl.testData" ng-disabled="!ctrl.datasource.transform" class="btn btn-geodash test-btn" ng-click="ctrl.exportData()">',
'        <span translate="">Export data</span>',
'      </button>',
'',
'      <!--output series-->',
'      <div ng-if="ctrl.series" id="outputSerie" ui-ace="ctrl.aceOptions" ng-model="ctrl.series"></div>',
'',
'',
'    </div>',
'',
'    <!--view serie-->',
'    <div role="tabpanel" class="tab-pane" id="viewserie">',
'      <input type="text" class="form-control input-sm"',
'             placeholder="{{::\'Name\' | translate}}"',
'             ng-model="ctrl.serieChart.name">',
'      <select class="form-control input-sm"',
'              placeholder="{{::\'Type\' | translate}}"',
'              ng-model="ctrl.serieChart.type">',
'        <option>column</option>',
'        <option>arearange</option>',
'        <option>spline</option>',
'      </select>',
'',
'      <button class="btn btn-geodash test-btn" ng-click="ctrl.viewChart(\'#chartDemo\')">',
'        <span translate="">view</span>',
'      </button>',
'',
'      <div id="testSerieChart"></div>',
'    </div>',
'',
'  </div>',
'',
'</div>',
'',''].join("\n"));
  }]);
})();
});

require.register("components/admin/datasources.tpl", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('components/admin/datasources.tpl.html', [
'<ul class="list-group">',
'  <li class="list-group-item"',
'      ng-repeat="ds in ctrl.datasources"',
'      ng-class="{active: ds == ctrl.current}"',
'      ng-if="ds.name">',
'',
'    <a ng-click="ctrl.show(ds)" href="">',
'      {{ds.name}}',
'    </a>',
'',
'    <span class="pull-right glyphicon glyphicon-remove" ng-click="ctrl.remove(ds)"></span>',
'  </li>',
'  <li class="list-group-item">',
'    <a href="" ng-click="ctrl.new()" title="{{\'addDatasource\' | translate}}"><span class="glyphicon-plus glyphicon"></span> </a>',
'  </li>',
'</ul>',
'',
'',
'<gd-datasource-form',
'        ng-repeat="ds in ctrl.datasources"',
'        gd-datasource-form-config="ds"',
'        ng-show="ctrl.current == ds">',
'</gd-datasource-form>',
'',
'',''].join("\n"));
  }]);
})();
});

require.register("components/coordspicker/coordspicker.tpl", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('components/coordspicker/coordspicker.tpl.html', [
'<div class="">',
'  <div class="col-md-4 form">',
'',
'    <div class="form-group">',
'      <label class="col-sm-2 control-label">',
'        <span translate="">lat</span>',
'      </label>',
'      <div class="col-sm-10">',
'        <input type="number" step="any" class="form-control"',
'               placeholder="6.8598"',
'               ng-model="ctrl.coordinates[1]"',
'               ng-change="ctrl.handleFormChange()">',
'',
'      </div>',
'    </div>',
'',
'    <div class="form-group">',
'      <label class="col-sm-2 control-label">',
'        <span translate="">lon</span>',
'      </label>',
'      <div class="col-sm-10">',
'        <input type="number" step="any" class="form-control"',
'               placeholder="45.3565"',
'               ng-model="ctrl.coordinates[0]"',
'               ng-change="ctrl.handleFormChange()">',
'      </div>',
'    </div>',
'  </div>',
'  <div class="col-md-8">',
'    <div class="coordspicker-map">',
'      <button ngeo-btn ng-model="ctrl.drawPoint.active" class="btn btn-sm btn-danger">',
'        <span class="glyphicon glyphicon-pencil"></span>',
'      </button>',
'    </div>',
'',
'  </div>',
'</div>',
'',''].join("\n"));
  }]);
})();
});

require.register("components/indicators/indicators.tpl", function(exports, require, module) {
(function() {
  var module;

  try {
    // Get current templates module
    module = angular.module('geodash');
  } catch (error) {
    // Or create a new one
    module = angular.module('geodash', []);
  }

  module.run(['$templateCache', function($templateCache) {
    return $templateCache.put('components/indicators/indicators.tpl.html', [
'<nav class="navbar navbar-default navbar-fixed-top" role="navigation">',
'  <div class="container-fluid">',
'    <ul class="nav navbar-nav">',
'      <li><a href="">Welcome to your Dashboard</a></li>',
'      <li class="config">',
'        <a href="" ng-click="ctrl.edit()" title="{{ctrl.editing ? \'stopconfigboard\' : \'configboard\' | translate}}">',
'          <span class="glyphicon glyphicon-cog" ng-class="{\'fa-counter-spin\': ctrl.editing}"></span>',
'        </a>',
'      </li>',
'      <li class="config" ng-if="ctrl.editing">',
'        <a data-toggle="modal" data-target="#modaladd" href="" ng-click="ctrl.add()" title="{{\'addIndicator\' | translate}}">',
'          <span class="glyphicon glyphicon-plus"></span>',
'        </a>',
'      </li>',
'      <li class="button offset" ng-if="ctrl.editing">',
'        <a href="" ng-click="ctrl.saveState()" title="{{\'state.save\' | translate}}">',
'          <span translate="">edit.save</span>',
'        </a>',
'      </li>',
'      <li class="button" ng-if="ctrl.editing">',
'        <a href="" ng-click="ctrl.cancelState()"  title="{{\'state.cancel\' | translate}}">',
'          <span translate="">edit.cancel</span>',
'        </a>',
'      </li>',
'    </ul>',
'  </div>',
'</nav>',
'',
'',
'<section>',
'',
'  <div id="sortable" class="ui-sortable" ng-hide="ctrl.zoom">',
'    <div ng-repeat="indicator in ctrl.indicators track by indicator.id" id="board_{{indicator.id}}"',
'         class="ui-sortable-handle panel panel-default">',
'        <div class="panel-heading">',
'          <h3 class="panel-title" ng-click="ctrl.open(indicator)">',
'            {{::indicator.config.label || indicator.name}}',
'          </h3>',
'        </div>',
'        <div class="panel-body">',
'          <div id="board_{{indicator.id}}_chart">',
'          </div>',
'          <div class="delete-btn"><span class="glyphicon glyphicon-trash" ng-click="ctrl.remove(indicator)" data-toggle="modal" data-target="#modalok"></span></div>',
'        </div>',
'    </div>',
'  </div>',
'',
'  <div class="full-view" ng-show="ctrl.zoom">',
'    <div class="panel panel-default">',
'      <div class="panel-heading">',
'        <h3 class="panel-title" >',
'          {{ctrl.zoom.config.label  || ctrl.zoom.name}}',
'        </h3>',
'        <button class="close-panel" ng-click="ctrl.zoom = null">',
'          ✕',
'        </button>',
'      </div>',
'      <div class="panel-body">',
'        <div id="board_zoom_{{ctrl.zoom.id}}_chart">',
'        </div>',
'      </div>',
'    </div>',
'  </div>',
'',
'  <!--Ok Modal to confirm actions-->',
'<div class="modal fade" id="modalok">',
'  <div class="modal-dialog">',
'    <div class="modal-content">',
'',
'      <div class="modal-header" ng-if="ctrl.modal.title">',
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close">',
'          <span aria-hidden="true">&times;</span>',
'        </button>',
'        <h4 class="modal-title">{{ctrl.modal.title | translate}}</h4>',
'      </div>',
'',
'      <div class="modal-body">',
'        {{ctrl.modal.message | translate}}',
'      </div>',
'',
'      <div class="modal-footer">',
'        <button type="button" class="btn btn-link" data-dismiss="modal" translate>modal.cancel</button>',
'        <button type="button" class="btn btn-link" data-dismiss="modal" ng-click="ctrl.modal.ok()" translate>modal.ok</button>',
'      </div>',
'    </div><!-- /.modal-content -->',
'  </div><!-- /.modal-dialog -->',
'</div><!-- /.modal -->',
'',
'',
'<!--Modal to add new indicators on edit mode-->',
'<div class="modal fade" id="modaladd">',
'  <div class="modal-dialog">',
'    <div class="modal-content">',
'',
'      <div class="modal-header">',
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close">',
'          <span aria-hidden="true">&times;</span>',
'        </button>',
'        <h4 class="modal-title" translate>modal.add.title</h4>',
'      </div>',
'',
'      <div class="modal-body">',
'        <div class="list-group">',
'          <a href="" ng-repeat="indicator in ctrl.allIndicators" class="list-group-item"',
'             ng-click="ctrl.selectToAdd(indicator)" ng-class="{active: ctrl.indicatorsIdToAdd.indexOf(indicator.id) >= 0}">',
'            <span>{{indicator.config.label || indicator.name}}</span>',
'          </a>',
'        </div>',
'      </div>',
'',
'      <div class="modal-footer">',
'        <button type="button" class="btn btn-link" data-dismiss="modal" ng-click="ctrl.cancelAdd()"translate>modal.cancel</button>',
'        <button type="button" class="btn btn-link" data-dismiss="modal" ng-click="ctrl.confirmAdd()" translate>modal.add</button>',
'      </div>',
'    </div>',
'  </div>',
'</div>',
'',
'</section>',
'',''].join("\n"));
  }]);
})();
});


//# sourceMappingURL=templates.js.map