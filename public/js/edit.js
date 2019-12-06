'use strict';

let $modalEl = $('.modal');
let $updButton = $('#update');


$updButton.on('click', () => {
  $modalEl.fadeIn(300);
  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)) { $modalEl.fadeOut(300); }
  });
});
