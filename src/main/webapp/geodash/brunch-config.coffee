module.exports = config:
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
          'vendor/angular.js',
          'vendor/angular-resource.js',
          'vendor/router.es5.js',
          'vendor/chosen.jquery.js',
          'vendor/angular-chosen.js',
          'vendor/highcharts.js',
          'vendor/highcharts-more.js',
          'vendor/angular-flash.js',
          'vendor/angular-translate.js',
          'vendor/angular-translate-loader-static-files.js'
        ]
    stylesheets:
      joinTo:
        'app.css': /^app/
        'libraries.css': [
          'vendor/bootstrap.css',
          'vendor/chosen.min.css'
        ]
    templates:
      joinTo:
        'templates.js': /^app/
