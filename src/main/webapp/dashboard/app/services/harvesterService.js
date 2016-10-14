angular.module('geodash').service('gdHarvesterService',
  [function() {

    this.list = function(type, text, replacements, addClass ) {
      $translate(text, replacements).then(function(translation) {
        return Flash.create(type, translation, addClass);
      }, function() {
        return Flash.create(type, text, addClass);
      });
    };
  }]);
