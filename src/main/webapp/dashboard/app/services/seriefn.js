var module = angular.module('geodash');

angular.module('geodash')
    .value('gdSerieFn', {
      std1: function(data, value, i) {
        if(value.length == 2) {
          var ET = data.length == 1 ? data[0][1] : data[i][1];
          return [value[0], Math.max(0, value[1] - ET), value[1] + ET];
        }
        else {
          // single value serie, use it to build all output
          var ET = data.length == 1 ? data[0][0] : data[i][0];
          return [Math.max(0, value[0] - ET), value[0] + ET];
        }
      },
      std2: function(data, value, i) {
        if(value.length == 2) {
          var ET = data.length == 1 ? data[0][1] : data[i][1];
          ET = 2 * ET;
          return [value[0], Math.max(0, value[1] - ET), value[1] + ET];
        }
        else {
          // single value serie, use it to build all output
          var ET = data.length == 1 ? data[0][0] : data[i][0];
          ET = 2 * ET;
          return [Math.max(0, value[0] - ET), value[0] + ET];
        }
      }
    });
