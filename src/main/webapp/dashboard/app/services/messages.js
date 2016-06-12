angular.module('geodash').service('appFlash',
  ['Flash', '$translate', function(Flash, $translate) {

    this.create = function(type, text, addClass ) {
      $translate(text).then(function(translation) {
        return Flash.create(type, translation, addClass);
      });
    };
  }]);
