angular.module('geodash').service('appFlash',
  ['Flash', '$translate', function(Flash, $translate) {

    this.create = function(type, text, replacements, addClass ) {
      $translate(text, replacements).then(function(translation) {
        return Flash.create(type, translation, addClass);
      }, function() {
        return Flash.create(type, text, addClass);
      });
    };
  }]);
