angular.module('geodash')
    .controller('IndicatorsController', [
      '$routeParams', '$timeout', 'Indicator', 'ChartFactory', IndicatorsController
    ]);

function IndicatorsController($routeParams, $timeout, Indicator, ChartFactory) {
  this.results = Indicator.query({id : $routeParams.id}, function() {

    $timeout(function(){
      this.results.forEach(function(board) {

        var selector = '#board_' + board.id + '_chart';
        var chart = ChartFactory.getChart(board.name).then(
            function(chart) {
              $(selector).highcharts(chart);
            });
      });
    }.bind(this));
  }.bind(this));
}

