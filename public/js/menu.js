'use strict';

$(document).ready(function(){
  $('#nav-icon3').click(function(){
    $(this).toggleClass('open');
    $('#menu').toggleClass('transform');
  });
});

const $desc = $('div#description');
const $p = $('p.desc_p');
const $date = $('.date');
const $info = $('.fa-info-circle');

function menuHandler(event) {
  let target = $(event.target);
  if (target.is($info)){
    $desc.slideToggle(300);
  } else if(!target.is($p) && !target.is($date) && !target.is($desc)) {
    $desc.slideUp(300);
  }
}

$( () => $(document).on('click', menuHandler) );
