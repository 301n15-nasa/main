'use strict';

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
  $('.map').removeClass('hide');
  $('.query-placeholder').text(`Here are the results for ${location.formatted_query}`);
  $('#map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude}%2c%20${location.longitude}&zoom=10&size=600x300&markers=color:blue%7Clabel:S%7C${location.latitude},${location.longitude}&maptype=roadmap
  &key=AIzaSyDRqtaBHGSqzh7lUXPIQpryMqxZA-z25OI`);
}

$('#search-form').on('submit', fetchCityData);

