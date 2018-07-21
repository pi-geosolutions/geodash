var module = angular.module('geodash');
angular.module('geodash')
    .service('gdUtils', [function() {

      var MONTH_SHORT_FR = ['jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'juil', 'aou', 'sep', 'oct', 'nov', 'dec'];
      var getDay = function() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
      };

      var getLastDayEpoq = function() {
        var now = new Date();
        return now.setUTCHours(0,0,0,0);
      };

      var getBeforeLastDayEpoq = function() {
        var msecPerDay = 24 * 60 * 60 * 1000;
        var now = new Date();
        return now.setUTCHours(0,0,0,0) - msecPerDay;
      };

      var monthInYearAxisLabelFormatter = function() {
        var value = this.value;
        // "01" is Janv
        if(angular.isString(value)) {
          value = parseInt(value) -1;
        }
        // value is the number of the day in the year
        else {
          value = Math.round(value / 30.41);
        }
        return MONTH_SHORT_FR[value];
      };

      var percentFormatter = function() {
        return (this.value || this.y) * 100 + ' %';
      };

      var periodFormatter = function() {
        return '<b>Début</b>: ' + this.point.low + '<sub>ème</sub> jours<br>' +
        '<b>Durée</b>: ' + (this.point.high - this.point.low) + ' jours';
      };

      var noYearInDateTimeFormatter = function() {
        return Highcharts.dateFormat("%b", this.value);
      };

      var esaFormatter = function() {
        var p = getEsaDef(this.point.y)
        return p.label;
      };

      var monthInYearAxisLabelPositioner = function() {
        var months = [0,1,2,3,4,5,6,7,8,9,10,11,12];
        return months.map(function(v) {
          return v*30.41;
        });
      };

      var getEsaDef = function(id) {
        var ret;
        esaLandcoverage.some(function(o) {
          if(o.id == id) {
            ret = o;
            return true;
          }
        });
        return ret;
      };
      this.getEsaDef = getEsaDef;

      this.aceStringify = function(obj) {
        return JSON.stringify(obj, null, 4);
      };

      this.aceParse = function(string) {
        return JSON.parse(string, function(k, v) {
          if(angular.isString(v) && v.indexOf('$eval:') === 0) {
            var expr = v.substring(6, v.length);
            return eval(expr);
          }
          return v;
        });
      };
    }]);

module.directive('gdConfirmClick', [
  function() {
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function(e) {
          var message = attrs.gdConfirmClick;
          if (message && !confirm(message)) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    };
  }
]);


var esaLandcoverage = [
  {
    "id": 10,
    "label": "Cropland, rainfed",
    "R": 255,
    "G": 255,
    "B": 100,
    "soilErosion": 1,
    "croplands": 1,
    "pastoralism": "0,2"
  },
  {
    "id": 11,
    "label": "Herbaceous cover",
    "R": 255,
    "G": 255,
    "B": 100,
    "soilErosion": 1,
    "croplands": 1,
    "pastoralism": "0,2"
  },
  {
    "id": 12,
    "label": "Tree or shrub cover",
    "R": 255,
    "G": 255,
    "B": 0,
    "soilErosion": 1,
    "croplands": 1,
    "pastoralism": "0,4"
  },
  {
    "id": 20,
    "label": "Cropland, irrigated or post-flooding",
    "R": 170,
    "G": 240,
    "B": 240,
    "soilErosion": "",
    "croplands": 1,
    "pastoralism": 0
  },
  {
    "id": 30,
    "label": "Mosaic cropland (>50%) / natural vegetation (tree, shrub, herbaceous cover) (<50%)",
    "R": 220,
    "G": 240,
    "B": 100,
    "soilErosion": "0,6",
    "croplands": 1,
    "pastoralism": "0,5"
  },
  {
    "id": 40,
    "label": "Mosaic natural vegetation (tree, shrub, herbaceous cover) (>50%) / cropland (<50%)",
    "R": 200,
    "G": 200,
    "B": 100,
    "soilErosion": "0,4",
    "croplands": 1,
    "pastoralism": "0,7"
  },
  {
    "id": 50,
    "label": "Tree cover, broadleaved, evergreen, closed to open (>15%)",
    "R": 0,
    "G": 100,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 60,
    "label": "Tree cover, broadleaved, deciduous, closed to open (>15%)",
    "R": 0,
    "G": 160,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 61,
    "label": "Tree cover, broadleaved, deciduous, closed (>40%)",
    "R": 0,
    "G": 160,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 62,
    "label": "Tree cover, broadleaved, deciduous, open (15-40%)",
    "R": 170,
    "G": 200,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 70,
    "label": "Tree cover, needleleaved, evergreen, closed to open (>15%)",
    "R": 0,
    "G": 60,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 71,
    "label": "Tree cover, needleleaved, evergreen, closed (>40%)",
    "R": 0,
    "G": 60,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 72,
    "label": "Tree cover, needleleaved, evergreen, open (15-40%)",
    "R": 0,
    "G": 80,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 80,
    "label": "Tree cover, needleleaved, deciduous, closed to open (>15%)",
    "R": 40,
    "G": 80,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 81,
    "label": "Tree cover, needleleaved, deciduous, closed (>40%)",
    "R": 40,
    "G": 80,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 82,
    "label": "Tree cover, needleleaved, deciduous, open (15-40%)",
    "R": 40,
    "G": 100,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,2",
    "pastoralism": 1
  },
  {
    "id": 90,
    "label": "Tree cover, mixed leaf type (broadleaved and needleleaved)",
    "R": 120,
    "G": 130,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 100,
    "label": "Mosaic tree and shrub (>50%) / herbaceous cover (<50%)",
    "R": 140,
    "G": 160,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 110,
    "label": "Mosaic herbaceous cover (>50%) / tree and shrub (<50%)",
    "R": 190,
    "G": 150,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 120,
    "label": "Shrubland",
    "R": 150,
    "G": 100,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 121,
    "label": "Shrubland evergreen",
    "R": 120,
    "G": 75,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 122,
    "label": "Shrubland deciduous",
    "R": 150,
    "G": 100,
    "B": 0,
    "soilErosion": "",
    "croplands": "0,1",
    "pastoralism": 1
  },
  {
    "id": 130,
    "label": "Grassland",
    "R": 255,
    "G": 180,
    "B": 50,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 1
  },
  {
    "id": 140,
    "label": "Lichens and mosses",
    "R": 255,
    "G": 220,
    "B": 210,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 150,
    "label": "Sparse vegetation (tree, shrub, herbaceous cover) (<15%)",
    "R": 255,
    "G": 235,
    "B": 175,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": "0,1"
  },
  {
    "id": 152,
    "label": "Sparse shrub (<15%)",
    "R": 255,
    "G": 210,
    "B": 120,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": "0,2"
  },
  {
    "id": 153,
    "label": "Sparse herbaceous cover (<15%)",
    "R": 255,
    "G": 235,
    "B": 175,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": "0,1"
  },
  {
    "id": 160,
    "label": "Tree cover, flooded, fresh or brakish water",
    "R": 0,
    "G": 120,
    "B": 90,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 170,
    "label": "Tree cover, flooded, saline water",
    "R": 0,
    "G": 150,
    "B": 120,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 180,
    "label": "Shrub or herbaceous cover, flooded, fresh/saline/brakish water",
    "R": 0,
    "G": 220,
    "B": 130,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": "0,3"
  },
  {
    "id": 190,
    "label": "Urban areas",
    "R": 195,
    "G": 20,
    "B": 0,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 200,
    "label": "Bare areas",
    "R": 255,
    "G": 245,
    "B": 215,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 201,
    "label": "Consolidated bare areas",
    "R": 220,
    "G": 220,
    "B": 220,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 202,
    "label": "Unconsolidated bare areas",
    "R": 255,
    "G": 245,
    "B": 215,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 210,
    "label": "Water bodies",
    "R": 0,
    "G": 70,
    "B": 200,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  },
  {
    "id": 220,
    "label": "Permanent snow and ice",
    "R": 255,
    "G": 255,
    "B": 255,
    "soilErosion": "",
    "croplands": 0,
    "pastoralism": 0
  }
];