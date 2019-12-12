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

let map;
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
    url: `http://localhost:3000/map`,
    method: 'GET',
    data: { data: searchQuery }
  })
    .then(location => {
      displayMap(location);
    })
    .catch(error => { console.log(error);
    });
}

function displayMap(location) {
  var marker = new google.maps.Marker({
    map: map,
    position: {lat: location.latitude, lng: location.longitude,},
  });
  marker.setMap(map);
  // $('.map').removeClass('hide');
  $('.query-placeholder').text(`Here are the results for ${location.formatted_query}`);
  // $('#map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude}%2c%20${location.longitude}&zoom=3&size=600x300&markers=color:blue%7Clabel:S%7C${location.latitude},${location.longitude}&maptype=roadmap
  // &key=AIzaSyDRqtaBHGSqzh7lUXPIQpryMqxZA-z25OI`);
}


$('#search-form').on('submit', fetchCityData);
