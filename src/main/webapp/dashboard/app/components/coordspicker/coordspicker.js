angular.module('geodash')
    .component('geodashCoordspicker', {
      bindings    : {
        coordinates: '=',
        map: '='
      },
      controller  : CoordspickerController,
      controllerAs: 'ctrl',
      templateUrl : 'components/coordspicker/coordspicker.tpl.html'
    });

function CoordspickerController($scope, $timeout, $element,
                                ngeoDecorateInteraction) {

  this.ngeoDecorateInteraction_ = ngeoDecorateInteraction;
  this.$scope = $scope;
  this.coordinates = [];

  this.map = new ol.Map({
    layers: [new ol.layer.Tile({
      source: new ol.source.OSM()
    })],
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    })
  });
  this.map.setTarget($element.find('.coordspicker-map')[0]);

  var style =  new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'red'
      }),
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 1.25
      }),
      radius: 6
    })
  });

  var fo = new ol.layer.Vector({
    source: new ol.source.Vector({
      useSpatialIndex: false
    }),
    style: style,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    map: this.map
  });

  this.feature = new ol.Feature();
  fo.getSource().addFeature(this.feature);
  this.featureOverlay = fo;

  this.drawPoint = new ol.interaction.Draw({
    features: fo.getSource().getFeatures(),
    type: 'Point',
    style: style
  });

  var drawPoint = this.drawPoint;
  this.ngeoDecorateInteraction_(drawPoint);
  drawPoint.setActive(false);
  this.map.addInteraction(drawPoint);

  drawPoint.on('drawstart', this.handleDrawStart_.bind(this));
  drawPoint.on('drawend', this.handleDrawEnd_.bind(this));

  $scope.$on('showMap', function() {
    $timeout(function(){
      this.map.updateSize();
    }.bind(this), 100);
  }.bind(this));
};

CoordspickerController.prototype.handleFormChange = function() {
  var lon = this.coordinates[0],
      lat = this.coordinates[1];

  if(lon && lat) {
    this.feature.setGeometry(new ol.geom.Point(ol.proj.transform([lon, lat],
        'EPSG:4326', this.map.getView().getProjection())));
    this.featureOverlay.changed();
  }
};

CoordspickerController.prototype.handleDrawStart_ = function() {
  this.$scope.$apply(function() {
    this.feature.setGeometry(null);
  }.bind(this));
};

CoordspickerController.prototype.handleDrawEnd_ = function(event) {
  this.$scope.$apply(function() {
    this.feature = event.feature;
    var coords = this.feature.getGeometry().getCoordinates();
    coords = ol.proj.transform(coords, this.map.getView().getProjection(),
        'EPSG:4326');
    this.coordinates[0] = Number(coords[0].toFixed(3));
    this.coordinates[1] = Number(coords[1].toFixed(3));
    this.featureOverlay.changed();
    this.drawPoint.active = false;
  }.bind(this));
};

CoordspickerController.$inject = ['$scope','$timeout', '$element',
  'ngeoDecorateInteraction'];
