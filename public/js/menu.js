'use strict';

$(document).ready(function(){
  $('#nav-icon3').click(function(){
    $(this).toggleClass('open');
    $('#menu').toggleClass('transform');
  });
});

const validateForm = () => {
  let $a = $('#startdate').val().split('-');
  let $year1 = parseInt($a[0]);
  let $month1 = parseInt($a[1]);
  let $day1 = parseInt($a[2]);
  let $b = $('#enddate').val().split('-');
  let $year2 = parseInt($b[0]);
  let $month2 = parseInt($b[1]);
  let $day2 = parseInt($b[2]);
  let $sub = $day2 - $day1;
  if (!($month1 === $month2 && $year1 === $year2 && $sub < 7)) {
    alert ('Please enter dates within 7 days');
    return false;
  }
};


$('#new-search').on('submit', validateForm);
