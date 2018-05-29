$(document).ready(function() {
  
  //捲軸下滑後選單固定浮在上方//
  var $window = $(window),
  $navigation = $("#navigation");
  $window.scroll(function() {
    if (!$navigation.hasClass("fixed") && ($window.scrollTop() > $navigation.offset().top)) {
        $navigation.addClass("fixed").data("top", $navigation.offset().top);
    }
    else if ($navigation.hasClass("fixed") && ($window.scrollTop() < $navigation.data("top"))) {
        $navigation.removeClass("fixed");
    }
  }); 

  //開合式效果//
  $('#bio > div').hide();
  // uncomment the next line if you'd like the first pane to be visible by default
  $('#bio > div:first').show();
  $('#bio h3').click(function() {
    $(this).next().animate({
      'height':'toggle'
    }, 'slow', 'easeOutBounce');
  });

  $('a[href=#]').click(function(e) {
    $.scrollTo(0,'slow');
    e.preventDefault();
  });

});