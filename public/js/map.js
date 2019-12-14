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

var map;
async function initMap()
{
  map = new google.maps.Map(document.getElementById('google'), {
    center: {lat: 47.608013, lng: -122.335167,},
    zoom: 3,
  });
}

function fetchCityData(event) {
  event.preventDefault();
  let searchQuery = $('#input-search').val().toLowerCase();
  $.ajax({
    url: `/map`,
    method: 'GET',
    data: { data: searchQuery }
  })
    .then(location => {
      console.log(location);
      displayMap(location);
    })
    .catch(error => { console.log(error);
    });
}

async function displayMap(location) {
  let radius = parseInt($('#distance').val());
  console.log(radius);
  const URL = `https://data.nasa.gov/resource/gh4g-9sfh.json`;
  const fetchResult = fetch(URL);
  const response = await fetchResult;
  const jsonData = await response.json();
  let input = [location.latitude, location.longitude];
  let filtered = jsonData.filter(el =>{if(el.geolocation !== undefined){return el;}}).filter( el => {
    if(distance(input[0], parseInt(el.geolocation.latitude), input[1], parseInt(el.geolocation.longitude)) < radius){ return el;
    } else { $('.query-placeholder').text(`Here are No results for (${location.formatted_query})`);
    }
  });
  plotMarkers(filtered);

  // $('.map').removeClass('hide');
  $('.query-placeholder').text(`Here are (${filtered.length}) results for ${location.formatted_query}`);
}

var markers;
var bounds;
function plotMarkers(m) {
  markers = [];
  bounds = new google.maps.LatLngBounds();
  m.forEach(function (marker) {
    console.log(marker.geolocation);
    var position = new google.maps.LatLng(parseInt(marker.geolocation.latitude), parseInt(marker.geolocation.longitude));

    markers.push(
      new google.maps.Marker({
        position: position,
        map: map,
        title: `Name: ${marker.name} date: ${marker.year.slice(0, 10)} mass: ${(marker.mass/453.59).toFixed(2)}lb`,
        animation: google.maps.Animation.DROP,
      })
    );
    var infowindow = new google.maps.InfoWindow({
	    content: marker.name,
    });
    bounds.extend(position);
  });

  map.fitBounds(bounds);
}

function distance(input1, lat2, input2, lon2){
  let lo1 = input1 * Math.PI / 180;
  let lo2 = lon2 * Math.PI / 180; 
  let la1 = input2 * Math.PI / 180;
  let la2 = lat2 * Math.PI / 180; 

  let dlon = lo2 - lo1; 
  let dlat = la2 - la1;
  let a = Math.sin(dlat / 2)**2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dlon / 2)**2
  
  let c = 2 * Math.asin(Math.sqrt(a));
   
  let r = 6371;
    
  return(c * r) 

}

$('#search-form').on('submit', fetchCityData);
