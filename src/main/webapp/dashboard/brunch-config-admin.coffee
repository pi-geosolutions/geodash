module.exports = config:
  conventions: {
    assets: /assets\/private[\\/]/
  }
  paths: {
    public: 'toto'
  }
  plugins:
    ng_templates:
      module: 'geodash'
      relativePath: 'app/'
  files:
    javascripts:
      joinTo:
        'app.js': /^app/
        'libraries.js': [
          'vendor/jquery.js',
          'vendor/jquery-ui.js',
          'vendor/angular.js',
          'vendor/bootstrap.js',
          'vendor/angular-resource.js',
          'vendor/router.es5.js',
          'vendor/chosen.jquery.js',
          'vendor/angular-chosen.js',
          'vendor/highcharts.js',
          'vendor/highcharts-3d.js',
          'vendor/highcharts-more.js',
          'vendor/angular-flash.js',
          'vendor/angular-translate.js',
          'vendor/angular-translate-loader-static-files.js'
          'vendor/ngeo.js'
          'vendor/ace/ace.js',
          'vendor/ace/ui-ace.js',
          'vendor/ace/mode-javascript.js',
          'vendor/ace/mode-json.js',
          'vendor/ace/mode-sql.js',
          'vendor/ace/theme-tomorrow.js'
        ]
    stylesheets:
      joinTo:
        'app.css': /^app/
        'libraries.css': [
          'vendor/bootstrap.css',
          'vendor/jquery-ui.css',
          'vendor/chosen.min.css',
          'vendor/ol.css'
        ]
    templates:
      joinTo:
        'templates.js': /^app/
