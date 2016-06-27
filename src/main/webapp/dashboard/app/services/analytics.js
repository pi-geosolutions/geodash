angular.module('geodash').service('Maths', [
  function() {

    /**
     *
     * @param {Array<Number>} data
     */
    this.average = function(values) {
      var sum = values.reduce(function(sum, value){
        return sum + value;
      }, 0);

      var avg = sum / values.length;
      return avg;
    };

    this.standardVariation = function(values) {

      var avg = this.average(values);

      var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = this.average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    };

  }])

.service('Transformer', [ 'Maths',
  function(Maths) {

    this.config = {
      dataType: 'serie',
      data: {
        xaxis: 'datereleve',
        yaxis: ['rain', 'avg', ['e1minus', 'e1plus']/*, ['e2minus', 'e2plus']*/]
      }
    };

    this.transform = function(data, config_) {
      var config = config_ || this.config;

      if(config.dataType = 'serie') {
        var transformer = new TransformerSerie(data, config, Maths);
        return transformer.buildSeries();
      }
    };
  }]);

var TransformerSerie = function(input, config, Maths) {
  this.config = config;
  this.input = input;
  this.Maths = Maths;
};

TransformerSerie.prototype.extractData = function() {
  var values = [];
  this.input.forEach(function(row) {
    values.push(row[this.config.data.value]);
  }.bind(this));
  return values;
};

TransformerSerie.prototype.buildSeries = function() {
  var output = [];
  this.config.data.yaxis.forEach(function() {
    output.push([]);
  });

  this.input.data.forEach(function(row, idx) {
    var dateS = row[this.config.data.xaxis];
    var date = new Date(dateS);
    var dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    this.config.data.yaxis.forEach(function(yaxis, idx) {
      if(angular.isArray(yaxis) && yaxis.length == 2) {
        output[idx].push([dateUTC, Number(row[yaxis[0]].toFixed(1)), Number(row[yaxis[1]].toFixed(1))]);
      }
      else {
        output[idx].push([dateUTC, Number(row[yaxis].toFixed(1))]);
      }
    });
  }.bind(this));

  return {
    data: output
  };
};
