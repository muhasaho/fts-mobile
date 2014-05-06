angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $ionicPopup) {
  //alert("hello");
  var map, pointarray, heatmap;
  var taxiData = [];
  var points = [];
  var markers = [];

  function getData() {
  search = location.search;
  search = location.search.substring(1, 100);
  if (search == "")
  {
    search = "stop";
  }
  //url2 = 'http://api.hackfargo.co/calls/type/' + search + '?start=1-1-2010&end=12-1-2014';
  url2 = "js/data.js"
  $.getJSON(url2, function(data) {
    console.log(data.length);
      for (i=0; i<data.length; i++)
      {
        taxiData.push(new google.maps.LatLng(data[i].Lat, data[i].Long));
        points.push(data[i]);

        if (i == 0){
          address = points[0].Meta.Address;
          console.log(address);
        }
      }
      initialize();
    });
  }
  getData();



  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(46.87895748955729, -96.79799879663642),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;


    var pointArray = new google.maps.MVCArray(taxiData);

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });
    heatmap.setMap(map);
    heatmap.set('radius', 20);
    $scope.heatmap = heatmap;

    // add points
    for (i=0; i<points.length; i++)
    {
      var m = new google.maps.Marker({
          map:       map,
          title:     points[i].Meta.Address + ": " + points[i].Description + " | " + points[i].Meta.GeoLookupType,
          position:  new google.maps.LatLng(points[i].Lat,points[i].Long),
      });
      markers.push(m);
    }
    setAllMap(null); // hide markers by default
  }


  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }


  $scope.toggleHeatmap = function() {
    $scope.heatmap.setMap($scope.heatmap.getMap() ? null : $scope.map);
    console.log("toggle");
  }
  $scope.heatMapCheck = { checked: true };  //check by default


  google.maps.event.addDomListener(window, 'load', initialize);
  
  
  $scope.showInfo = function(){
    $ionicPopup.alert({
              title: 'FargoPD Traffic Stops',
              template: '<p>Heat map of Fargo Police traffic stops 2012-2014</p><p>Created by <a href="https://twitter.com/muhasaho" target="_blank">@muhasaho</a> using <a href="https://twitter.com/HackFargo" target="_blank">@HackFargo</a> API and <a href="http://ionicframework.com/" target="_blank">Ionic</a> Framework</p>'
            })
  }

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });

    
  };
});
