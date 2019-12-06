'use strict';

const $asteroidDiv = $('.asteroid');

function openForm(event) {
  if($(event.target).is('button.select')) {
    const $modalEl = $(this).find('.modal');
    $modalEl.fadeIn(300);
    $(window).on('click', (event) => {
      if($(event.target).is($modalEl)) { $modalEl.fadeOut(300); }
    });
  }
}


$asteroidDiv.on('click', openForm);
