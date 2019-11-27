;(function ($) {
  $.fn.menu = function (opts) {
    // default configuration
    var config = $.extend({}, {
      opt1: null
    }, opts);
    // main function
    function init(obj) {
      var dObj = $(obj);
      var dMenulink = dObj.find('.nav-btn');
      var dAllLink = dObj.find('.nav-menu a');
      var dMenuClose = dObj.find('.nav-close');
      dMenulink.click(function () {
        dObj.toggleClass('nav--active');
        // $('body').toggleClass('_freeze');
      });
      dMenuClose.click(function () { 
        dObj.removeClass("nav--active");
        // $('body').removeClass('_freeze');
      })

      dAllLink.click(function () {
        dObj.removeClass('nav--active')
        // $('body').removeClass('_freeze');
      });
    }
    // initialize every element
    return this.each(function () {
      init($(this));
    });
  };
  // start
  
})(jQuery);
