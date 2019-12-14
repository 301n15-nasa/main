'use strict';
document.addEventListener('DOMContentLoaded', function () {
  $('.gm-style').removeClass('gm-style');
  if (document.querySelectorAll('#map').length > 0){
  if (document.querySelector('html').lang)
    var lang = document.querySelector('html').lang;
  else
    lang = 'en';

  var js_file = document.createElement('script');
  js_file.type = 'text/javascript';
  js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyDRqtaBHGSqzh7lUXPIQpryMqxZA-z25OI&language=' + lang;
  document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var markers;
var bounds;
var map;
async function initMap()
{
  map = new google.maps.Map(document.getElementById('google'), {
    center: {lat: 47.608013, lng: -122.335167,},
    zoom: 3,
  });
}

function fetchmeteorData() {
  console.log('i live');
  $.ajax({
    url: `/meteors`,
    method: 'GET'
  })
    .then(meteor => {
      console.log(meteor);
      plotMeteor(meteor);
    })
    .catch(error => { console.log(error);
    });
}

function plotMeteor(meteor) {
  markers = [];
  bounds = new google.maps.LatLngBounds();
  meteor.forEach(function (marker) {
    console.log(marker);
    var position = new google.maps.LatLng(parseInt(marker.lat), parseInt(marker.lon));
    var infowindow = new google.maps.InfoWindow({
      content: 
      `<div>
        <p>Date/Time of impact: ${marker.date}</p>
        <p>Impact energy: ${marker.energy} kilotons, or ${marker.energy/15} Hiroshima bombs</p>
        <p>Latitude: ${marker.lat}</p>
        <p>Longitude: ${marker.lon}</p>
      </div>`
    });
    var containerObj = new google.maps.Marker({
      position: position,
      map: map
    });
    containerObj.addListener('click', function() {
      infowindow.open(map, containerObj);
    });
    markers.push(containerObj);
    bounds.extend(position);
  });
}

$('#show-asteroids').on('click', fetchmeteorData);
