$(document).ready(function(){
  $('p:first').toggle(function() {
    $(this).animate( {'height':'+=150px'}, 500, 'easeOutElastic')
  }, function() {
    $(this).animate( {'height':'-=150px'}, 500, 'swing');
  });
});

$(document).ready(function(){
  $('#toggleButton').click(function(){
    $('#disclaimer').toggle('slow');
  });
});