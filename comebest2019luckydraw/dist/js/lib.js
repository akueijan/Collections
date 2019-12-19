"use strict";

/*
 *  jQuery Date Dropdowns - v1.0.0
 *  A simple, customisable date select plugin
 *
 *  Made by Chris Brown
 *  Under MIT License
 */
!function (a, b, c, d) {
  "use strict";

  function e(b, c) {
    return this.element = b, this.$element = a(b), this.config = a.extend({}, g, c), this.internals = {
      objectRefs: {}
    }, this.init(), this;
  }

  var f = "dateDropdowns",
      g = {
    defaultDate: null,
    defaultDateFormat: "yyyy-mm-dd",
    displayFormat: "dmy",
    submitFormat: "yyyy-mm-dd",
    minAge: 0,
    maxAge: 120,
    minYear: null,
    maxYear: null,
    submitFieldName: "date",
    wrapperClass: "date-dropdowns",
    dropdownClass: null,
    daySuffixes: !0,
    monthSuffixes: !0,
    monthFormat: "long",
    required: !1,
    dayLabel: "Day",
    monthLabel: "Month",
    yearLabel: "Year",
    monthLongValues: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthShortValues: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    initialDayMonthYearValues: ["Day", "Month", "Year"],
    daySuffixValues: ["st", "nd", "rd", "th"]
  };
  a.extend(e.prototype, {
    init: function init() {
      this.checkForDuplicateElement(), this.setInternalVariables(), this.setupMarkup(), this.buildDropdowns(), this.attachDropdowns(), this.bindChangeEvent(), this.config.defaultDate && this.populateDefaultDate();
    },
    checkForDuplicateElement: function checkForDuplicateElement() {
      return !a('input[name="' + this.config.submitFieldName + '"]').length || (a.error("Duplicate element found"), !1);
    },
    setInternalVariables: function setInternalVariables() {
      var a = new Date();
      this.internals.currentDay = a.getDate(), this.internals.currentMonth = a.getMonth() + 1, this.internals.currentYear = a.getFullYear();
    },
    setupMarkup: function setupMarkup() {
      var b, c;

      if ("input" === this.element.tagName.toLowerCase()) {
        this.config.defaultDate || (this.config.defaultDate = this.element.value), c = this.$element.attr("type", "hidden").wrap('<div class="' + this.config.wrapperClass + '"></div>');
        var d = this.config.submitFieldName !== g.submitFieldName,
            e = this.element.hasAttribute("name");
        e || d ? d && this.$element.attr("name", this.config.submitFieldName) : this.$element.attr("name", g.submitFieldName), b = this.$element.parent();
      } else c = a("<input/>", {
        type: "hidden",
        name: this.config.submitFieldName
      }), this.$element.append(c).addClass(this.config.wrapperClass), b = this.$element;

      return this.internals.objectRefs.pluginWrapper = b, this.internals.objectRefs.hiddenField = c, !0;
    },
    buildDropdowns: function buildDropdowns() {
      var a, b, c;
      return e.message = {
        day: this.config.initialDayMonthYearValues[0],
        month: this.config.initialDayMonthYearValues[1],
        year: this.config.initialDayMonthYearValues[2]
      }, a = this.buildDayDropdown(), this.internals.objectRefs.dayDropdown = a, b = this.buildMonthDropdown(), this.internals.objectRefs.monthDropdown = b, c = this.buildYearDropdown(), this.internals.objectRefs.yearDropdown = c, !0;
    },
    attachDropdowns: function attachDropdowns() {
      var a = this.internals.objectRefs.pluginWrapper,
          b = this.internals.objectRefs.dayDropdown,
          c = this.internals.objectRefs.monthDropdown,
          d = this.internals.objectRefs.yearDropdown;

      switch (this.config.displayFormat) {
        case "mdy":
          a.append(c, b, d);
          break;

        case "ymd":
          a.append(d, c, b);
          break;

        case "dmy":
        default:
          a.append(b, c, d);
      }

      return !0;
    },
    bindChangeEvent: function bindChangeEvent() {
      var a = this.internals.objectRefs.dayDropdown,
          b = this.internals.objectRefs.monthDropdown,
          c = this.internals.objectRefs.yearDropdown,
          d = this,
          e = this.internals.objectRefs;
      e.pluginWrapper.on("change", "select", function () {
        var f,
            g,
            h = a.val(),
            i = b.val(),
            j = c.val();
        return (f = d.checkDate(h, i, j)) ? (e.dayDropdown.addClass("invalid"), !1) : ("00" !== e.dayDropdown.val() && e.dayDropdown.removeClass("invalid"), e.hiddenField.val(""), f || h * i * j === 0 || (g = d.formatSubmitDate(h, i, j), e.hiddenField.val(g)), void e.hiddenField.change());
      });
    },
    populateDefaultDate: function populateDefaultDate() {
      var a = this.config.defaultDate,
          b = [],
          c = "",
          d = "",
          e = "";

      switch (this.config.defaultDateFormat) {
        case "yyyy-mm-dd":
        default:
          b = a.split("-"), c = b[2], d = b[1], e = b[0];
          break;

        case "dd/mm/yyyy":
          b = a.split("/"), c = b[0], d = b[1], e = b[2];
          break;

        case "mm/dd/yyyy":
          b = a.split("/"), c = b[1], d = b[0], e = b[2];
          break;

        case "unix":
          b = new Date(), b.setTime(1e3 * a), c = b.getDate() + "", d = b.getMonth() + 1 + "", e = b.getFullYear(), c.length < 2 && (c = "0" + c), d.length < 2 && (d = "0" + d);
      }

      return this.internals.objectRefs.dayDropdown.val(c), this.internals.objectRefs.monthDropdown.val(d), this.internals.objectRefs.yearDropdown.val(e), this.internals.objectRefs.hiddenField.val(a), !0 === this.checkDate(c, d, e) && this.internals.objectRefs.dayDropdown.addClass("invalid"), !0;
    },
    buildBaseDropdown: function buildBaseDropdown(b) {
      var c = b;
      return this.config.dropdownClass && (c += " " + this.config.dropdownClass), a("<select></select>", {
        "class": c,
        name: this.config.submitFieldName + "_[" + b + "]",
        required: this.config.required
      });
    },
    buildDayDropdown: function buildDayDropdown() {
      var a,
          b = this.buildBaseDropdown("day"),
          d = c.createElement("option");
      d.setAttribute("value", ""), d.appendChild(c.createTextNode(this.config.dayLabel)), b.append(d);

      for (var e = 1; e < 10; e++) {
        a = this.config.daySuffixes ? e + this.getSuffix(e) : "0" + e, d = c.createElement("option"), d.setAttribute("value", "0" + e), d.appendChild(c.createTextNode(a)), b.append(d);
      }

      for (var f = 10; f <= 31; f++) {
        a = f, this.config.daySuffixes && (a = f + this.getSuffix(f)), d = c.createElement("option"), d.setAttribute("value", f), d.appendChild(c.createTextNode(a)), b.append(d);
      }

      return b;
    },
    buildMonthDropdown: function buildMonthDropdown() {
      var a = this.buildBaseDropdown("month"),
          b = c.createElement("option");
      b.setAttribute("value", ""), b.appendChild(c.createTextNode(this.config.monthLabel)), a.append(b);

      for (var d = 1; d <= 12; d++) {
        var e;

        switch (this.config.monthFormat) {
          case "short":
            e = this.config.monthShortValues[d - 1];
            break;

          case "long":
            e = this.config.monthLongValues[d - 1];
            break;

          case "numeric":
            e = d, this.config.monthSuffixes && (e += this.getSuffix(d));
        }

        d < 10 && (d = "0" + d), b = c.createElement("option"), b.setAttribute("value", d), b.appendChild(c.createTextNode(e)), a.append(b);
      }

      return a;
    },
    buildYearDropdown: function buildYearDropdown() {
      var a = this.config.minYear,
          b = this.config.maxYear,
          d = this.buildBaseDropdown("year"),
          e = c.createElement("option");
      e.setAttribute("value", ""), e.appendChild(c.createTextNode(this.config.yearLabel)), d.append(e), a || (a = this.internals.currentYear - (this.config.maxAge + 1)), b || (b = this.internals.currentYear - this.config.minAge);

      for (var f = b; f >= a; f--) {
        e = c.createElement("option"), e.setAttribute("value", f), e.appendChild(c.createTextNode(f)), d.append(e);
      }

      return d;
    },
    getSuffix: function getSuffix(a) {
      var b = "",
          c = this.config.daySuffixValues[0],
          d = this.config.daySuffixValues[1],
          e = this.config.daySuffixValues[2],
          f = this.config.daySuffixValues[3];

      switch (a % 10) {
        case 1:
          b = a % 100 === 11 ? f : c;
          break;

        case 2:
          b = a % 100 === 12 ? f : d;
          break;

        case 3:
          b = a % 100 === 13 ? f : e;
          break;

        default:
          b = "th";
      }

      return b;
    },
    checkDate: function checkDate(a, b, c) {
      var d;

      if ("00" !== b) {
        var e = new Date(c, b, 0).getDate(),
            f = parseInt(a, 10);
        d = this.updateDayOptions(e, f), d && this.internals.objectRefs.hiddenField.val("");
      }

      return d;
    },
    updateDayOptions: function updateDayOptions(a, b) {
      var d = parseInt(this.internals.objectRefs.dayDropdown.children(":last").val(), 10),
          e = "",
          f = "",
          g = !1;

      if (d > a) {
        for (; d > a;) {
          this.internals.objectRefs.dayDropdown.children(":last").remove(), d--;
        }

        b > a && (g = !0);
      } else if (d < a) for (; d < a;) {
        e = ++d, f = e, this.config.daySuffixes && (f += this.getSuffix(d));
        var h = c.createElement("option");
        h.setAttribute("value", e), h.appendChild(c.createTextNode(f)), this.internals.objectRefs.dayDropdown.append(h);
      }

      return g;
    },
    formatSubmitDate: function formatSubmitDate(a, b, c) {
      var d, e;

      switch (this.config.submitFormat) {
        case "unix":
          e = new Date(), e.setDate(a), e.setMonth(b - 1), e.setYear(c), d = Math.round(e.getTime() / 1e3);
          break;

        default:
          d = this.config.submitFormat.replace("dd", a).replace("mm", b).replace("yyyy", c);
      }

      return d;
    },
    destroy: function destroy() {
      var a = this.config.wrapperClass;
      if (this.$element.hasClass(a)) this.$element.empty();else {
        var b = this.$element.parent(),
            c = b.find("select");
        this.$element.unwrap(), c.remove();
      }
    }
  }), a.fn[f] = function (b) {
    return this.each(function () {
      if ("string" == typeof b) {
        var c = Array.prototype.slice.call(arguments, 1),
            d = a.data(this, "plugin_" + f);
        if ("undefined" == typeof d) return a.error("Please initialize the plugin before calling this method."), !1;
        d[b].apply(d, c);
      } else a.data(this, "plugin_" + f) || a.data(this, "plugin_" + f, new e(this, b));
    }), this;
  };
}(jQuery, window, document);
;

(function ($) {
  $.fn.menu = function (opts) {
    // default configuration
    var config = $.extend({}, {
      opt1: null
    }, opts);
    var settingTop; // main function

    function init(obj) {
      var dObj = $(obj);
      var dMenulink = dObj.find('.nav-btn');
      var dAllLink = dObj.find('.nav-menu a');
      var dMenuClose = dObj.find('.nav-close');
      dMenulink.click(function () {
        dObj.toggleClass('nav--active');

        if ($('body').hasClass('_freeze')) {
          $('body').removeClass('_freeze');
          $('html, body').scrollTop(settingTop);
        } else {
          settingTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
          $('body').addClass('_freeze');
        }
      });
      dMenuClose.click(function () {
        dObj.removeClass("nav--active");
        $('body').removeClass('_freeze');
        $('html, body').scrollTop(settingTop);
      });
      dAllLink.click(function () {
        dObj.removeClass('nav--active');
        $('body').removeClass('_freeze');
      });
    } // initialize every element


    return this.each(function () {
      init($(this));
    });
  }; // start

})(jQuery);
/**
 * jQuery Scrolling Parallax v0.1
 * http://jonraasch.com/blog/scrolling-parallax-jquery-plugin
 *
 * Copyright (c) 2009 Jon Raasch (http://jonraasch.com/)
 * Licensed under the FreeBSD License (See terms below)
 *
 * @author Jon Raasch
 *
 * @projectDescription    jQuery plugin to create a parallax effect when the page is scrolled.
 * 
 * @version 0.1.0
 * 
 * @requires jquery.js (v 1.3.2 minimum)
 *
 *
 * TERMS OF USE - jQuery Scrolling Parallax
 * Open source under the FreeBSD License.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY JON RAASCH ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JON RAASCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the authors and should not be interpreted as representing official policies, either expressed or implied, of Jon Raasch, who is the man.
 * 
 *
 * FOR USAGE INSTRUCTIONS SEE THE DOCUMENATION AT: http://dev.jonraasch.com/scrolling-parallax/documentation
 * 
 *
 */


(function ($) {
  $.scrollingParallax = function (box, options) {
    var options = options || {}; // vertical options

    options.enableVertical = typeof options.enableVertical != 'undefined' ? options.enableVertical : true;

    if (options.enableVertical) {
      options.staticSpeed = options.staticSpeed || false;
      options.staticScrollLimit = typeof options.staticScrollLimit != 'undefined' ? options.staticScrollLimit : true;
      options.loopIt = options.loopIt || false;
      options.reverseDirection = options.reverseDirection || false;
    } // horizontal options


    options.enableHorizontal = options.enableHorizontal || false;

    if (options.enableHorizontal) {
      options.staticSpeedX = options.staticSpeedX || false;
      options.staticScrollLimitX = typeof options.staticScrollLimitX != 'undefined' ? options.staticScrollLimitX : true;
      options.loopItX = options.loopItX || false;
      options.reverseDirectionX = options.reverseDirectionX || false;
    } // IE6 options


    options.disableIE6 = options.disableIE6 || false; // disables in IE6 altogether

    options.disableIE6Anim = typeof options.disableIE6Anim != 'undefined' ? options.disableIE6Anim : true; // disables IE6 animation, however background will still append
    // layout options

    options.bgWidth = options.bgWidth || (options.enableHorizontal ? '150%' : '100%');
    options.bgHeight = options.bgHeight || '150%';
    options.bgRepeat = options.bgRepeat || false;
    options.appendInFront = options.appendInFront || false;
    options.parallaxHeight = options.parallaxHeight || false;
    options.parallaxWidth = options.parallaxWidth || false;
    var isIE6 = $.browser.msie && $.browser.version < 7 ? true : false;
    if (options.disableIE6 && isIE6) return false;
    var $document = $(document);
    var $window = $(window);
    var $box;
    var backgroundMode = false;

    if (options.enableVertical) {
      var boxHeight;
      var windowHeight;
      var docHeight;
      var parallaxRoom;
      var maxIE6Move = 0;
      var loopCount = 0;
      var startingPos = 0;
      var tooSmallMode = false;
      var oldMoveIt = null;
    }

    if (options.enableHorizontal) {
      var boxWidth;
      var windowWidth;
      var docWidth;
      var parallaxRoomX;
      var maxIE6MoveX = 0;
      var loopCountX = 0;
      var startingPosX = 0;
      var tooSmallModeX = false;
      var oldMoveItX = null;
    }

    init(box); // init( obj/string box )   :  sets up the parallax and associated events

    function init(box) {
      // if string append image as background, otherwise define as jQuery object
      if (typeof box == 'string') $box = appendBackground(box);else {
        $box = $(box);
        $box.css('position', isIE6 ? 'absolute' : 'fixed');
        if (options.enableVertical) startingPos = parseInt($box.css('top'));
        if (options.enableHorizontal) startingPosX = parseInt($box.css('left'));
      }
      if (options.disableIE6Anim && isIE6) return false;
      defineSizes(); // if in background mode, and reverseDirection, then attch the background to the opposite end to maximize scrolling room

      if (backgroundMode) {
        if (options.reverseDirection && options.enableVertical) {
          startingPos += -1 * parallaxRoom;
          $box.css('top', startingPos);
        }

        if (options.reverseDirectionX && options.enableHorizontal) {
          startingPosX += -1 * parallaxRoomX;
          $box.css('left', startingPosX);
        }
      } // attach scroll and resize events


      $window.scroll(function () {
        ani();
      });
      $window.resize(function () {
        defineSizes();
      });
    } // appendBackground( string theSrc )  :   appends an image to the page as a stretched background


    function appendBackground(theSrc) {
      var bgCss = {
        display: 'block',
        top: 0,
        left: 0,
        width: options.bgWidth,
        height: options.bgHeight,
        zIndex: 0
      };
      bgCss.position = isIE6 ? 'absolute' : 'fixed';

      if (options.bgRepeat) {
        var $obj = options.appendInFront ? $('<div></div>').appendTo($('body')) : $('<div></div>').prependTo($('body'));
        bgCss.backgroundRepeat = 'repeat';
        bgCss.backgroundImage = 'url("' + theSrc + '")';
      } else {
        var $obj = options.appendInFront ? $('<img />').appendTo($('body')) : $('<img />').prependTo($('body'));
        $obj.attr('src', theSrc);
      }

      $obj.css(bgCss);
      backgroundMode = true;
      return $obj;
    } // defineSizes()  :  sets up various constants used by the app - must be set on page load and on screen resize


    function defineSizes() {
      // define vertical vars
      if (options.enableVertical) {
        boxHeight = $box.height();
        windowHeight = $window.height();
        docHeight = $document.height();
        parallaxRoom = (options.parallaxHeight || boxHeight) - windowHeight; // if parallax object is smaller than window size

        if (parallaxRoom < 0) {
          if (options.staticSpeed) parallaxRoom = windowHeight - boxHeight;else parallaxRoom = options.reverseDirection ? windowHeight - startingPos - boxHeight : startingPos;
          tooSmallMode = true;
        }

        if (isIE6 && !maxIE6Move) maxIE6Move = -1 * (docHeight - boxHeight);
        if (options.loopIt) loopCount = parseInt($document.scrollTop() / (tooSmallMode ? windowHeight : boxHeight));
      } // define horizontal vars


      if (options.enableHorizontal) {
        boxWidth = $box.width();
        windowWidth = $window.width();
        docWidth = $document.width();
        parallaxRoomX = (options.parallaxWidth || boxWidth) - windowWidth; // if parallax object is smaller than window size

        if (parallaxRoomX < 0) {
          parallaxRoomX = options.staticSpeedX ? windowWidth - boxWidth : options.reverseDirectionX ? windowWidth - startingPosX - boxWidth : startingPosX;
          tooSmallModeX = true;
        }

        if (isIE6 && !maxIE6MoveX) maxIE6MoveX = -1 * (docWidth - boxWidth);
        if (options.loopItX) loopCountX = parseInt($document.scrollLeft() / (tooSmallModeX ? windowWidth : boxWidth));
      } // make any changes


      ani();
    } // ani()  :  performs the animation of the object


    function ani() {
      // dont let multiple animations queue up
      $box.queue([]);
      var theCss = {}; // vertical

      if (options.enableVertical) {
        var moveIt = calculateMove(true);
        theCss.top = moveIt;
      } // horizontal


      if (options.enableHorizontal) {
        var moveItX = calculateMove(false);
        theCss.left = moveItX;
      } // if large move animate in FF, safari and opera for smoother transition


      if (!$.browser.msie && (Math.abs(oldMoveIt - moveIt) > 100 || Math.abs(oldMoveItX - moveItX) > 100)) $box.animate(theCss, 30);else $box.css(theCss);
      oldMoveIt = moveIt;
      oldMoveItX = moveItX;
    } // calculateMove( boolean vertical ) : determines amount to move whether vertically or horizontally


    function calculateMove(vertical) {
      // establish variables, this is basically a switch between vertical and horizontal modes
      if (vertical) {
        var offset = $document.scrollTop();
        var docSize = docHeight;
        var windowSize = windowHeight;
        var boxSize = boxHeight;
        var parallaxRoom2 = parallaxRoom;
        var loopCount2 = loopCount;
        var startingPos2 = startingPos;
        var parallaxRoom2 = parallaxRoom;
        var tooSmallMode2 = tooSmallMode;
        var maxIE6Move2 = maxIE6Move;
        var opts = {
          reverseDirection: options.reverseDirection,
          staticSpeed: options.staticSpeed,
          loopIt: options.loopIt,
          staticScrollLimit: options.staticScrollLimit
        };
      } else {
        var offset = $document.scrollLeft();
        var docSize = docWidth;
        var windowSize = windowWidth;
        var boxSize = boxWidth;
        var loopCount2 = loopCountX;
        var startingPos2 = startingPosX;
        var parallaxRoom2 = parallaxRoomX;
        var tooSmallMode2 = tooSmallModeX;
        var maxIE6Move2 = maxIE6MoveX;
        var opts = {
          reverseDirection: options.reverseDirectionX,
          staticSpeed: options.staticSpeedX,
          loopIt: options.loopItX,
          staticScrollLimit: options.staticScrollLimitX
        };
      }
      /*** get move amount - static speed ***/


      if (opts.staticSpeed) {
        var move = offset * opts.staticSpeed; // account for number of loops

        move -= parallaxRoom2 * loopCount2;
      }
      /*** get move amount - auto speed ***/
      else {
          // determine percentage of page that has been scrolled down
          var offsetPercent = offset / (docSize - windowSize);
          /*
          var moveIt = ( $.browser.msie && $.browser.version < 7 ) 
              ? -1 * ( offsetParent * parallaxRoom + offsetTop )
              : -1 * offsetPercent * parallaxRoom;
          */

          var move = offsetPercent * parallaxRoom2;
        } // reverse direction


      if (!opts.reverseDirection) move *= -1; // incorporate starting position

      move += startingPos2; // if static speed set, make sure move is within bounds

      if (opts.staticSpeed) move = checkMove(move, vertical, opts, parallaxRoom2, tooSmallMode2); // if in tooSmallMode and looping, add difference of window height and box height, since the box needs to be conceptualized as that much taller ( otherwise it would loop in place rather than over the screen )

      if (tooSmallMode2 && opts.staticSpeed && opts.loopIt) move += windowSize - boxSize;

      if (isIE6) {
        // IE6 fix for fixed positioning
        move += offset;
        move = Math.max(parseInt(move), parseInt(maxIE6Move2));
      }

      return move;
    } // checkMove( int moveIt )  :  checks to ensure that move amount does not exceed established bounds


    function checkMove(move, vertical, opts, parallaxRoom, tooSmallMode) {
      // if overflow limited
      if (!opts.loopIt) {
        if (opts.staticScrollLimit) {
          if (tooSmallMode) {
            if (move < 0) move = 0;
            if (move > parallaxRoom) move = parallaxRoom;
          } else {
            if (move > 0) move = 0;
            if (-1 * move > parallaxRoom) move = -1 * parallaxRoom;
          }
        }
      } // if overflow loops
      else {
          while (move < parallaxRoom) {
            move += parallaxRoom;
            var loopCountChange = opts.reverseDirection ? -1 : 1;
            if (vertical) loopCount += loopCountChange;else loopCountX += loopCountChange;
          }

          while (move > (opts.reverseDirection ? -1 : 0)) {
            move -= parallaxRoom;
            var loopCountChange = opts.reverseDirection ? -1 : 1;
            if (vertical) loopCount -= loopCountChange;else loopCountX -= loopCountChange;
          }
        }

      return move;
    }
  };

  $.fn.scrollingParallax = function (options) {
    this.each(function () {
      new $.scrollingParallax(this, options);
    });
    return this;
  };
})(jQuery);

;

(function ($) {
  $.fn.loadpage = function (action, opts) {
    action = action ? action : "init";
    var progressValue = 0;
    var loadHtml = ['<div class="mdLoading">', '	<div class="loadingBox">', '		<div class="loadarea">', '			<div class="topbg progressBar">', '				<div class="gradual topgrd progress js-bar"></div>', '			</div>', '			<div class="botbg">', '				<div class="gradual botgrd js-bar2"></div>', '			</div>', '			<img class="line2" src="./images/compass2-te.png">', '			<img class="pd" src="./images/compass_pd.png">', '		</div>', '		<h2 class="js-count">LOADING...</h2>', // '       <div class="progressBar">',
    // '           <div class="progress js-bar" style="width:0"></div>',
    // '       </div>',
    '	</div>', '</div>'].join('');
    var dLoad, dCount, dBar, dBar2;
    var config = $.extend({
      async: false
    }, opts);

    function init(obj) {
      $(loadHtml).appendTo('body');
      dLoad = obj.find('.mdLoading');
      dCount = dLoad.find('.js-count');
      dBar = dLoad.find('.js-bar');
      dBar2 = dLoad.find('.js-bar2');
      return new Promise(function (resolve, reject) {
        if (!config.async) {
          var queue = new createjs.LoadQueue();
          queue.setMaxConnections(200);
          var loadArray = [];
          obj.find("img").each(function (i) {
            loadArray.push({
              id: i,
              src: $(this).attr("src")
            });
          });
          queue.loadManifest(loadArray);

          var handleComplete = function handleComplete() {
            $(window).trigger("loadCompleted");
            $('.js-wrap').css({
              'visibility': 'visible'
            });
            TweenMax.fromTo(dLoad, 0.5, {
              opacity: 1
            }, {
              delay: .8,
              opacity: 0,
              ease: Power4.easeOut,
              onComplete: function onComplete() {
                dLoad.remove();
                resolve(true);
              }
            });

            if (window.location.hash) {
              setTimeout(function () {
                $('html, body').animate({
                  scrollTop: $(window.location.hash).offset().top
                }, 500);
              }, 1000);
            }
          };

          queue.on("progress", function () {
            var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
            dCount.text(procValue + '%');
            dBar.css({
              'transform': 'translateX(-' + (100 - procValue) + '%)'
            });
            dBar2.css({
              'transform': 'translateX(' + (100 - procValue) + '%) rotateY(180deg)'
            });
          });
          queue.on("complete", handleComplete, this);
        } else {
          resolve(true);
        }
      });
    }

    if (action == 'init') {
      return init($(this));
    }

    if (action == 'close') {
      dLoad = $(this).find('.mdLoading');
      dCount = dLoad.find('.js-count');
      dBar = dLoad.find('.js-bar');
      dCount.text('100%'); // dBar.css({
      // 	'transform': 'translateX(0%)'
      // });
      // dBar2.css({
      // 	'transform': 'translateX(0%) rotateY(180deg)'
      // });

      TweenMax.fromTo(dLoad, 0.5, {
        opacity: 1
      }, {
        delay: .8,
        opacity: 0,
        ease: Power4.easeOut,
        onComplete: function onComplete() {
          dLoad.remove();
        }
      });
    }
  };
})(jQuery);

"use strict";

!function (l, m) {
  l(function () {
    "use strict";

    function n(v, w) {
      return null != v && null != w && v.toLowerCase() === w.toLowerCase();
    }

    function o(v, w) {
      var x,
          y,
          z = v.length;
      if (!z || !w) return !1;

      for (x = w.toLowerCase(), y = 0; y < z; ++y) {
        if (x === v[y].toLowerCase()) return !0;
      }

      return !1;
    }

    function p(v) {
      for (var w in v) {
        u.call(v, w) && (v[w] = new RegExp(v[w], "i"));
      }
    }

    function q(v) {
      return (v || "").substr(0, 500);
    }

    function r(v, w) {
      this.ua = q(v), this._cache = {}, this.maxPhoneWidth = w || 600;
    }

    var s = {
      mobileDetectRules: {
        phones: {
          iPhone: "\\biPhone\\b|\\biPod\\b",
          BlackBerry: "BlackBerry|\\bBB10\\b|rim[0-9]+",
          HTC: "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",
          Nexus: "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",
          Dell: "Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
          Motorola: "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",
          Samsung: "\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F",
          LG: "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)",
          Sony: "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",
          Asus: "Asus.*Galaxy|PadFone.*Mobile",
          NokiaLumia: "Lumia [0-9]{3,4}",
          Micromax: "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
          Palm: "PalmSource|Palm",
          Vertu: "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
          Pantech: "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
          Fly: "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
          Wiko: "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
          iMobile: "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
          SimValley: "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
          Wolfgang: "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
          Alcatel: "Alcatel",
          Nintendo: "Nintendo (3DS|Switch)",
          Amoi: "Amoi",
          INQ: "INQ",
          GenericPhone: "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
        },
        tablets: {
          iPad: "iPad|iPad.*Mobile",
          NexusTablet: "Android.*Nexus[\\s]+(7|9|10)",
          GoogleTablet: "Android.*Pixel C",
          SamsungTablet: "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708",
          Kindle: "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",
          SurfaceTablet: "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
          HPTablet: "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
          AsusTablet: "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",
          BlackBerryTablet: "PlayBook|RIM Tablet",
          HTCtablet: "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
          MotorolaTablet: "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
          NookTablet: "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
          AcerTablet: "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",
          ToshibaTablet: "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
          LGTablet: "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
          FujitsuTablet: "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
          PrestigioTablet: "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
          LenovoTablet: "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304F|TB-X304L|TB-8703F|Tab2A7-10F",
          DellTablet: "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
          YarvikTablet: "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
          MedionTablet: "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
          ArnovaTablet: "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
          IntensoTablet: "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
          IRUTablet: "M702pro",
          MegafonTablet: "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
          EbodaTablet: "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
          AllViewTablet: "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
          ArchosTablet: "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
          AinolTablet: "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
          NokiaLumiaTablet: "Lumia 2520",
          SonyTablet: "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",
          PhilipsTablet: "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
          CubeTablet: "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
          CobyTablet: "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
          MIDTablet: "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
          MSITablet: "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
          SMiTTablet: "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
          RockChipTablet: "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
          FlyTablet: "IQ310|Fly Vision",
          bqTablet: "Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))|Maxwell.*Lite|Maxwell.*Plus",
          HuaweiTablet: "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09",
          NecTablet: "\\bN-06D|\\bN-08D",
          PantechTablet: "Pantech.*P4100",
          BronchoTablet: "Broncho.*(N701|N708|N802|a710)",
          VersusTablet: "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
          ZyncTablet: "z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",
          PositivoTablet: "TB07STA|TB10STA|TB07FTA|TB10FTA",
          NabiTablet: "Android.*\\bNabi",
          KoboTablet: "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
          DanewTablet: "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
          TexetTablet: "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
          PlaystationTablet: "Playstation.*(Portable|Vita)",
          TrekstorTablet: "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
          PyleAudioTablet: "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
          AdvanTablet: "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
          DanyTechTablet: "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
          GalapadTablet: "Android.*\\bG1\\b",
          MicromaxTablet: "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
          KarbonnTablet: "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
          AllFineTablet: "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
          PROSCANTablet: "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
          YONESTablet: "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
          ChangJiaTablet: "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
          GUTablet: "TX-A1301|TX-M9002|Q702|kf026",
          PointOfViewTablet: "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
          OvermaxTablet: "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",
          HCLTablet: "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
          DPSTablet: "DPS Dream 9|DPS Dual 7",
          VistureTablet: "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
          CrestaTablet: "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
          MediatekTablet: "\\bMT8125|MT8389|MT8135|MT8377\\b",
          ConcordeTablet: "Concorde([ ]+)?Tab|ConCorde ReadMan",
          GoCleverTablet: "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
          ModecomTablet: "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
          VoninoTablet: "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
          ECSTablet: "V07OT2|TM105A|S10OT1|TR10CS1",
          StorexTablet: "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
          VodafoneTablet: "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",
          EssentielBTablet: "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
          RossMoorTablet: "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
          iMobileTablet: "i-mobile i-note",
          TolinoTablet: "tolino tab [0-9.]+|tolino shine",
          AudioSonicTablet: "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
          AMPETablet: "Android.* A78 ",
          SkkTablet: "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
          TecnoTablet: "TECNO P9|TECNO DP8D",
          JXDTablet: "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
          iJoyTablet: "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
          FX2Tablet: "FX2 PAD7|FX2 PAD10",
          XoroTablet: "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
          ViewsonicTablet: "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
          VerizonTablet: "QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",
          OdysTablet: "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
          CaptivaTablet: "CAPTIVA PAD",
          IconbitTablet: "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
          TeclastTablet: "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
          OndaTablet: "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",
          JaytechTablet: "TPC-PA762",
          BlaupunktTablet: "Endeavour 800NG|Endeavour 1010",
          DigmaTablet: "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
          EvolioTablet: "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
          LavaTablet: "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
          AocTablet: "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
          MpmanTablet: "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
          CelkonTablet: "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
          WolderTablet: "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
          MediacomTablet: "M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",
          MiTablet: "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
          NibiruTablet: "Nibiru M1|Nibiru Jupiter One",
          NexoTablet: "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
          LeaderTablet: "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
          UbislateTablet: "UbiSlate[\\s]?7C",
          PocketBookTablet: "Pocketbook",
          KocasoTablet: "\\b(TB-1207)\\b",
          HisenseTablet: "\\b(F5281|E2371)\\b",
          Hudl: "Hudl HT7S3|Hudl 2",
          TelstraTablet: "T-Hub2",
          GenericTablet: "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107"
        },
        oss: {
          AndroidOS: "Android",
          BlackBerryOS: "blackberry|\\bBB10\\b|rim tablet os",
          PalmOS: "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
          SymbianOS: "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
          WindowsMobileOS: "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",
          WindowsPhoneOS: "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
          iOS: "\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",
          MeeGoOS: "MeeGo",
          MaemoOS: "Maemo",
          JavaOS: "J2ME/|\\bMIDP\\b|\\bCLDC\\b",
          webOS: "webOS|hpwOS",
          badaOS: "\\bBada\\b",
          BREWOS: "BREW"
        },
        uas: {
          Chrome: "\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",
          Dolfin: "\\bDolfin\\b",
          Opera: "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",
          Skyfire: "Skyfire",
          Edge: "Mobile Safari/[.0-9]* Edge",
          IE: "IEMobile|MSIEMobile",
          Firefox: "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
          Bolt: "bolt",
          TeaShark: "teashark",
          Blazer: "Blazer",
          Safari: "Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",
          UCBrowser: "UC.*Browser|UCWEB",
          baiduboxapp: "baiduboxapp",
          baidubrowser: "baidubrowser",
          DiigoBrowser: "DiigoBrowser",
          Puffin: "Puffin",
          Mercury: "\\bMercury\\b",
          ObigoBrowser: "Obigo",
          NetFront: "NF-Browser",
          GenericBrowser: "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
          PaleMoon: "Android.*PaleMoon|Mobile.*PaleMoon"
        },
        props: {
          Mobile: "Mobile/[VER]",
          Build: "Build/[VER]",
          Version: "Version/[VER]",
          VendorID: "VendorID/[VER]",
          iPad: "iPad.*CPU[a-z ]+[VER]",
          iPhone: "iPhone.*CPU[a-z ]+[VER]",
          iPod: "iPod.*CPU[a-z ]+[VER]",
          Kindle: "Kindle/[VER]",
          Chrome: ["Chrome/[VER]", "CriOS/[VER]", "CrMo/[VER]"],
          Coast: ["Coast/[VER]"],
          Dolfin: "Dolfin/[VER]",
          Firefox: ["Firefox/[VER]", "FxiOS/[VER]"],
          Fennec: "Fennec/[VER]",
          Edge: "Edge/[VER]",
          IE: ["IEMobile/[VER];", "IEMobile [VER]", "MSIE [VER];", "Trident/[0-9.]+;.*rv:[VER]"],
          NetFront: "NetFront/[VER]",
          NokiaBrowser: "NokiaBrowser/[VER]",
          Opera: [" OPR/[VER]", "Opera Mini/[VER]", "Version/[VER]"],
          "Opera Mini": "Opera Mini/[VER]",
          "Opera Mobi": "Version/[VER]",
          UCBrowser: ["UCWEB[VER]", "UC.*Browser/[VER]"],
          MQQBrowser: "MQQBrowser/[VER]",
          MicroMessenger: "MicroMessenger/[VER]",
          baiduboxapp: "baiduboxapp/[VER]",
          baidubrowser: "baidubrowser/[VER]",
          SamsungBrowser: "SamsungBrowser/[VER]",
          Iron: "Iron/[VER]",
          Safari: ["Version/[VER]", "Safari/[VER]"],
          Skyfire: "Skyfire/[VER]",
          Tizen: "Tizen/[VER]",
          Webkit: "webkit[ /][VER]",
          PaleMoon: "PaleMoon/[VER]",
          Gecko: "Gecko/[VER]",
          Trident: "Trident/[VER]",
          Presto: "Presto/[VER]",
          Goanna: "Goanna/[VER]",
          iOS: " \\bi?OS\\b [VER][ ;]{1}",
          Android: "Android [VER]",
          BlackBerry: ["BlackBerry[\\w]+/[VER]", "BlackBerry.*Version/[VER]", "Version/[VER]"],
          BREW: "BREW [VER]",
          Java: "Java/[VER]",
          "Windows Phone OS": ["Windows Phone OS [VER]", "Windows Phone [VER]"],
          "Windows Phone": "Windows Phone [VER]",
          "Windows CE": "Windows CE/[VER]",
          "Windows NT": "Windows NT [VER]",
          Symbian: ["SymbianOS/[VER]", "Symbian/[VER]"],
          webOS: ["webOS/[VER]", "hpwOS/[VER];"]
        },
        utils: {
          Bot: "Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",
          MobileBot: "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",
          DesktopMode: "WPDesktop",
          TV: "SonyDTV|HbbTV",
          WebKit: "(webkit)[ /]([\\w.]+)",
          Console: "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",
          Watch: "SM-V700"
        }
      },
      detectMobileBrowsers: {
        fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        tabletPattern: /android|ipad|playbook|silk/i
      }
    },
        t,
        u = Object.prototype.hasOwnProperty;
    return s.FALLBACK_PHONE = "UnknownPhone", s.FALLBACK_TABLET = "UnknownTablet", s.FALLBACK_MOBILE = "UnknownMobile", t = "isArray" in Array ? Array.isArray : function (v) {
      return "[object Array]" === Object.prototype.toString.call(v);
    }, function () {
      var v,
          w,
          x,
          y,
          z,
          A,
          B = s.mobileDetectRules;

      for (v in B.props) {
        if (u.call(B.props, v)) {
          for (w = B.props[v], t(w) || (w = [w]), z = w.length, y = 0; y < z; ++y) {
            x = w[y], A = x.indexOf("[VER]"), 0 <= A && (x = x.substring(0, A) + "([\\w._\\+]+)" + x.substring(A + 5)), w[y] = new RegExp(x, "i");
          }

          B.props[v] = w;
        }
      }

      p(B.oss), p(B.phones), p(B.tablets), p(B.uas), p(B.utils), B.oss0 = {
        WindowsPhoneOS: B.oss.WindowsPhoneOS,
        WindowsMobileOS: B.oss.WindowsMobileOS
      };
    }(), s.findMatch = function (v, w) {
      for (var x in v) {
        if (u.call(v, x) && v[x].test(w)) return x;
      }

      return null;
    }, s.findMatches = function (v, w) {
      var x = [];

      for (var y in v) {
        u.call(v, y) && v[y].test(w) && x.push(y);
      }

      return x;
    }, s.getVersionStr = function (v, w) {
      var x,
          y,
          z,
          A,
          B = s.mobileDetectRules.props;
      if (u.call(B, v)) for (x = B[v], z = x.length, y = 0; y < z; ++y) {
        if (A = x[y].exec(w), null !== A) return A[1];
      }
      return null;
    }, s.getVersion = function (v, w) {
      var x = s.getVersionStr(v, w);
      return x ? s.prepareVersionNo(x) : NaN;
    }, s.prepareVersionNo = function (v) {
      var w;
      return w = v.split(/[a-z._ \/\-]/i), 1 === w.length && (v = w[0]), 1 < w.length && (v = w[0] + ".", w.shift(), v += w.join("")), +v;
    }, s.isMobileFallback = function (v) {
      return s.detectMobileBrowsers.fullPattern.test(v) || s.detectMobileBrowsers.shortPattern.test(v.substr(0, 4));
    }, s.isTabletFallback = function (v) {
      return s.detectMobileBrowsers.tabletPattern.test(v);
    }, s.prepareDetectionCache = function (v, w, x) {
      if (v.mobile === m) {
        var y, z, A;
        return (z = s.findMatch(s.mobileDetectRules.tablets, w)) ? (v.mobile = v.tablet = z, void (v.phone = null)) : (y = s.findMatch(s.mobileDetectRules.phones, w)) ? (v.mobile = v.phone = y, void (v.tablet = null)) : void (s.isMobileFallback(w) ? (A = r.isPhoneSized(x), A === m ? (v.mobile = s.FALLBACK_MOBILE, v.tablet = v.phone = null) : A ? (v.mobile = v.phone = s.FALLBACK_PHONE, v.tablet = null) : (v.mobile = v.tablet = s.FALLBACK_TABLET, v.phone = null)) : s.isTabletFallback(w) ? (v.mobile = v.tablet = s.FALLBACK_TABLET, v.phone = null) : v.mobile = v.tablet = v.phone = null);
      }
    }, s.mobileGrade = function (v) {
      var w = null !== v.mobile();
      return v.os("iOS") && 4.3 <= v.version("iPad") || v.os("iOS") && 3.1 <= v.version("iPhone") || v.os("iOS") && 3.1 <= v.version("iPod") || 2.1 < v.version("Android") && v.is("Webkit") || 7 <= v.version("Windows Phone OS") || v.is("BlackBerry") && 6 <= v.version("BlackBerry") || v.match("Playbook.*Tablet") || 1.4 <= v.version("webOS") && v.match("Palm|Pre|Pixi") || v.match("hp.*TouchPad") || v.is("Firefox") && 12 <= v.version("Firefox") || v.is("Chrome") && v.is("AndroidOS") && 4 <= v.version("Android") || v.is("Skyfire") && 4.1 <= v.version("Skyfire") && v.is("AndroidOS") && 2.3 <= v.version("Android") || v.is("Opera") && 11 < v.version("Opera Mobi") && v.is("AndroidOS") || v.is("MeeGoOS") || v.is("Tizen") || v.is("Dolfin") && 2 <= v.version("Bada") || (v.is("UC Browser") || v.is("Dolfin")) && 2.3 <= v.version("Android") || v.match("Kindle Fire") || v.is("Kindle") && 3 <= v.version("Kindle") || v.is("AndroidOS") && v.is("NookTablet") || 11 <= v.version("Chrome") && !w || 5 <= v.version("Safari") && !w || 4 <= v.version("Firefox") && !w || 7 <= v.version("MSIE") && !w || 10 <= v.version("Opera") && !w ? "A" : v.os("iOS") && 4.3 > v.version("iPad") || v.os("iOS") && 3.1 > v.version("iPhone") || v.os("iOS") && 3.1 > v.version("iPod") || v.is("Blackberry") && 5 <= v.version("BlackBerry") && 6 > v.version("BlackBerry") || 5 <= v.version("Opera Mini") && 6.5 >= v.version("Opera Mini") && (2.3 <= v.version("Android") || v.is("iOS")) || v.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") || 11 <= v.version("Opera Mobi") && v.is("SymbianOS") ? "B" : (5 > v.version("BlackBerry") || v.match("MSIEMobile|Windows CE.*Mobile") || 5.2 >= v.version("Windows Mobile"), "C");
    }, s.detectOS = function (v) {
      return s.findMatch(s.mobileDetectRules.oss0, v) || s.findMatch(s.mobileDetectRules.oss, v);
    }, s.getDeviceSmallerSide = function () {
      return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    }, r.prototype = {
      constructor: r,
      mobile: function mobile() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.mobile;
      },
      phone: function phone() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.phone;
      },
      tablet: function tablet() {
        return s.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.tablet;
      },
      userAgent: function userAgent() {
        return this._cache.userAgent === m && (this._cache.userAgent = s.findMatch(s.mobileDetectRules.uas, this.ua)), this._cache.userAgent;
      },
      userAgents: function userAgents() {
        return this._cache.userAgents === m && (this._cache.userAgents = s.findMatches(s.mobileDetectRules.uas, this.ua)), this._cache.userAgents;
      },
      os: function os() {
        return this._cache.os === m && (this._cache.os = s.detectOS(this.ua)), this._cache.os;
      },
      version: function version(v) {
        return s.getVersion(v, this.ua);
      },
      versionStr: function versionStr(v) {
        return s.getVersionStr(v, this.ua);
      },
      is: function is(v) {
        return o(this.userAgents(), v) || n(v, this.os()) || n(v, this.phone()) || n(v, this.tablet()) || o(s.findMatches(s.mobileDetectRules.utils, this.ua), v);
      },
      match: function match(v) {
        return v instanceof RegExp || (v = new RegExp(v, "i")), v.test(this.ua);
      },
      isPhoneSized: function isPhoneSized(v) {
        return r.isPhoneSized(v || this.maxPhoneWidth);
      },
      mobileGrade: function mobileGrade() {
        return this._cache.grade === m && (this._cache.grade = s.mobileGrade(this)), this._cache.grade;
      }
    }, r.isPhoneSized = "undefined" != typeof window && window.screen ? function (v) {
      return 0 > v ? m : s.getDeviceSmallerSide() <= v;
    } : function () {}, r._impl = s, r.version = "1.4.2 2018-06-10", r;
  });
}(function () {
  if ("undefined" != typeof module && module.exports) return function (m) {
    module.exports = m();
  };
  if ("function" == typeof define && define.amd) return define;
  if ("undefined" != typeof window) return function (m) {
    window.MobileDetect = m();
  };
  throw new Error("unknown environment");
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5kYXRlLWRyb3Bkb3ducy5taW4uanMiLCJqcXVlcnkubmF2LmpzIiwianF1ZXJ5LnNjcm9sbGluZy1wYXJhbGxheC5qcyIsImxvYWQuanMiLCJtb2JpbGUtZGV0ZWN0Lm1pbi5qcyJdLCJuYW1lcyI6WyJhIiwiYiIsImMiLCJkIiwiZSIsImVsZW1lbnQiLCIkZWxlbWVudCIsImNvbmZpZyIsImV4dGVuZCIsImciLCJpbnRlcm5hbHMiLCJvYmplY3RSZWZzIiwiaW5pdCIsImYiLCJkZWZhdWx0RGF0ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwiZGlzcGxheUZvcm1hdCIsInN1Ym1pdEZvcm1hdCIsIm1pbkFnZSIsIm1heEFnZSIsIm1pblllYXIiLCJtYXhZZWFyIiwic3VibWl0RmllbGROYW1lIiwid3JhcHBlckNsYXNzIiwiZHJvcGRvd25DbGFzcyIsImRheVN1ZmZpeGVzIiwibW9udGhTdWZmaXhlcyIsIm1vbnRoRm9ybWF0IiwicmVxdWlyZWQiLCJkYXlMYWJlbCIsIm1vbnRoTGFiZWwiLCJ5ZWFyTGFiZWwiLCJtb250aExvbmdWYWx1ZXMiLCJtb250aFNob3J0VmFsdWVzIiwiaW5pdGlhbERheU1vbnRoWWVhclZhbHVlcyIsImRheVN1ZmZpeFZhbHVlcyIsInByb3RvdHlwZSIsImNoZWNrRm9yRHVwbGljYXRlRWxlbWVudCIsInNldEludGVybmFsVmFyaWFibGVzIiwic2V0dXBNYXJrdXAiLCJidWlsZERyb3Bkb3ducyIsImF0dGFjaERyb3Bkb3ducyIsImJpbmRDaGFuZ2VFdmVudCIsInBvcHVsYXRlRGVmYXVsdERhdGUiLCJsZW5ndGgiLCJlcnJvciIsIkRhdGUiLCJjdXJyZW50RGF5IiwiZ2V0RGF0ZSIsImN1cnJlbnRNb250aCIsImdldE1vbnRoIiwiY3VycmVudFllYXIiLCJnZXRGdWxsWWVhciIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiYXR0ciIsIndyYXAiLCJoYXNBdHRyaWJ1dGUiLCJwYXJlbnQiLCJ0eXBlIiwibmFtZSIsImFwcGVuZCIsImFkZENsYXNzIiwicGx1Z2luV3JhcHBlciIsImhpZGRlbkZpZWxkIiwibWVzc2FnZSIsImRheSIsIm1vbnRoIiwieWVhciIsImJ1aWxkRGF5RHJvcGRvd24iLCJkYXlEcm9wZG93biIsImJ1aWxkTW9udGhEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCJidWlsZFllYXJEcm9wZG93biIsInllYXJEcm9wZG93biIsIm9uIiwiaCIsInZhbCIsImkiLCJqIiwiY2hlY2tEYXRlIiwicmVtb3ZlQ2xhc3MiLCJmb3JtYXRTdWJtaXREYXRlIiwiY2hhbmdlIiwic3BsaXQiLCJzZXRUaW1lIiwiYnVpbGRCYXNlRHJvcGRvd24iLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsImdldFN1ZmZpeCIsInBhcnNlSW50IiwidXBkYXRlRGF5T3B0aW9ucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwic2V0RGF0ZSIsInNldE1vbnRoIiwic2V0WWVhciIsIk1hdGgiLCJyb3VuZCIsImdldFRpbWUiLCJyZXBsYWNlIiwiZGVzdHJveSIsImhhc0NsYXNzIiwiZW1wdHkiLCJmaW5kIiwidW53cmFwIiwiZm4iLCJlYWNoIiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJkYXRhIiwiYXBwbHkiLCJqUXVlcnkiLCJ3aW5kb3ciLCJkb2N1bWVudCIsIiQiLCJtZW51Iiwib3B0cyIsIm9wdDEiLCJzZXR0aW5nVG9wIiwib2JqIiwiZE9iaiIsImRNZW51bGluayIsImRBbGxMaW5rIiwiZE1lbnVDbG9zZSIsImNsaWNrIiwidG9nZ2xlQ2xhc3MiLCJzY3JvbGxUb3AiLCJtYXgiLCJwYWdlWU9mZnNldCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJzY3JvbGxpbmdQYXJhbGxheCIsImJveCIsIm9wdGlvbnMiLCJlbmFibGVWZXJ0aWNhbCIsInN0YXRpY1NwZWVkIiwic3RhdGljU2Nyb2xsTGltaXQiLCJsb29wSXQiLCJyZXZlcnNlRGlyZWN0aW9uIiwiZW5hYmxlSG9yaXpvbnRhbCIsInN0YXRpY1NwZWVkWCIsInN0YXRpY1Njcm9sbExpbWl0WCIsImxvb3BJdFgiLCJyZXZlcnNlRGlyZWN0aW9uWCIsImRpc2FibGVJRTYiLCJkaXNhYmxlSUU2QW5pbSIsImJnV2lkdGgiLCJiZ0hlaWdodCIsImJnUmVwZWF0IiwiYXBwZW5kSW5Gcm9udCIsInBhcmFsbGF4SGVpZ2h0IiwicGFyYWxsYXhXaWR0aCIsImlzSUU2IiwiYnJvd3NlciIsIm1zaWUiLCJ2ZXJzaW9uIiwiJGRvY3VtZW50IiwiJHdpbmRvdyIsIiRib3giLCJiYWNrZ3JvdW5kTW9kZSIsImJveEhlaWdodCIsIndpbmRvd0hlaWdodCIsImRvY0hlaWdodCIsInBhcmFsbGF4Um9vbSIsIm1heElFNk1vdmUiLCJsb29wQ291bnQiLCJzdGFydGluZ1BvcyIsInRvb1NtYWxsTW9kZSIsIm9sZE1vdmVJdCIsImJveFdpZHRoIiwid2luZG93V2lkdGgiLCJkb2NXaWR0aCIsInBhcmFsbGF4Um9vbVgiLCJtYXhJRTZNb3ZlWCIsImxvb3BDb3VudFgiLCJzdGFydGluZ1Bvc1giLCJ0b29TbWFsbE1vZGVYIiwib2xkTW92ZUl0WCIsImFwcGVuZEJhY2tncm91bmQiLCJjc3MiLCJkZWZpbmVTaXplcyIsInNjcm9sbCIsImFuaSIsInJlc2l6ZSIsInRoZVNyYyIsImJnQ3NzIiwiZGlzcGxheSIsInRvcCIsImxlZnQiLCJ3aWR0aCIsImhlaWdodCIsInpJbmRleCIsInBvc2l0aW9uIiwiJG9iaiIsImFwcGVuZFRvIiwicHJlcGVuZFRvIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRJbWFnZSIsInNjcm9sbExlZnQiLCJxdWV1ZSIsInRoZUNzcyIsIm1vdmVJdCIsImNhbGN1bGF0ZU1vdmUiLCJtb3ZlSXRYIiwiYWJzIiwiYW5pbWF0ZSIsInZlcnRpY2FsIiwib2Zmc2V0IiwiZG9jU2l6ZSIsIndpbmRvd1NpemUiLCJib3hTaXplIiwicGFyYWxsYXhSb29tMiIsImxvb3BDb3VudDIiLCJzdGFydGluZ1BvczIiLCJ0b29TbWFsbE1vZGUyIiwibWF4SUU2TW92ZTIiLCJtb3ZlIiwib2Zmc2V0UGVyY2VudCIsImNoZWNrTW92ZSIsImxvb3BDb3VudENoYW5nZSIsImxvYWRwYWdlIiwiYWN0aW9uIiwicHJvZ3Jlc3NWYWx1ZSIsImxvYWRIdG1sIiwiam9pbiIsImRMb2FkIiwiZENvdW50IiwiZEJhciIsImRCYXIyIiwiYXN5bmMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNyZWF0ZWpzIiwiTG9hZFF1ZXVlIiwic2V0TWF4Q29ubmVjdGlvbnMiLCJsb2FkQXJyYXkiLCJwdXNoIiwiaWQiLCJzcmMiLCJsb2FkTWFuaWZlc3QiLCJoYW5kbGVDb21wbGV0ZSIsInRyaWdnZXIiLCJUd2Vlbk1heCIsImZyb21UbyIsIm9wYWNpdHkiLCJkZWxheSIsImVhc2UiLCJQb3dlcjQiLCJlYXNlT3V0Iiwib25Db21wbGV0ZSIsImxvY2F0aW9uIiwiaGFzaCIsInNldFRpbWVvdXQiLCJwcm9jVmFsdWUiLCJtaW4iLCJjZWlsIiwicHJvZ3Jlc3MiLCJ0ZXh0IiwibCIsIm0iLCJuIiwidiIsInciLCJvIiwieCIsInkiLCJ6IiwicCIsInUiLCJSZWdFeHAiLCJxIiwic3Vic3RyIiwiciIsInVhIiwiX2NhY2hlIiwibWF4UGhvbmVXaWR0aCIsInMiLCJtb2JpbGVEZXRlY3RSdWxlcyIsInBob25lcyIsImlQaG9uZSIsIkJsYWNrQmVycnkiLCJIVEMiLCJOZXh1cyIsIkRlbGwiLCJNb3Rvcm9sYSIsIlNhbXN1bmciLCJMRyIsIlNvbnkiLCJBc3VzIiwiTm9raWFMdW1pYSIsIk1pY3JvbWF4IiwiUGFsbSIsIlZlcnR1IiwiUGFudGVjaCIsIkZseSIsIldpa28iLCJpTW9iaWxlIiwiU2ltVmFsbGV5IiwiV29sZmdhbmciLCJBbGNhdGVsIiwiTmludGVuZG8iLCJBbW9pIiwiSU5RIiwiR2VuZXJpY1Bob25lIiwidGFibGV0cyIsImlQYWQiLCJOZXh1c1RhYmxldCIsIkdvb2dsZVRhYmxldCIsIlNhbXN1bmdUYWJsZXQiLCJLaW5kbGUiLCJTdXJmYWNlVGFibGV0IiwiSFBUYWJsZXQiLCJBc3VzVGFibGV0IiwiQmxhY2tCZXJyeVRhYmxldCIsIkhUQ3RhYmxldCIsIk1vdG9yb2xhVGFibGV0IiwiTm9va1RhYmxldCIsIkFjZXJUYWJsZXQiLCJUb3NoaWJhVGFibGV0IiwiTEdUYWJsZXQiLCJGdWppdHN1VGFibGV0IiwiUHJlc3RpZ2lvVGFibGV0IiwiTGVub3ZvVGFibGV0IiwiRGVsbFRhYmxldCIsIllhcnZpa1RhYmxldCIsIk1lZGlvblRhYmxldCIsIkFybm92YVRhYmxldCIsIkludGVuc29UYWJsZXQiLCJJUlVUYWJsZXQiLCJNZWdhZm9uVGFibGV0IiwiRWJvZGFUYWJsZXQiLCJBbGxWaWV3VGFibGV0IiwiQXJjaG9zVGFibGV0IiwiQWlub2xUYWJsZXQiLCJOb2tpYUx1bWlhVGFibGV0IiwiU29ueVRhYmxldCIsIlBoaWxpcHNUYWJsZXQiLCJDdWJlVGFibGV0IiwiQ29ieVRhYmxldCIsIk1JRFRhYmxldCIsIk1TSVRhYmxldCIsIlNNaVRUYWJsZXQiLCJSb2NrQ2hpcFRhYmxldCIsIkZseVRhYmxldCIsImJxVGFibGV0IiwiSHVhd2VpVGFibGV0IiwiTmVjVGFibGV0IiwiUGFudGVjaFRhYmxldCIsIkJyb25jaG9UYWJsZXQiLCJWZXJzdXNUYWJsZXQiLCJaeW5jVGFibGV0IiwiUG9zaXRpdm9UYWJsZXQiLCJOYWJpVGFibGV0IiwiS29ib1RhYmxldCIsIkRhbmV3VGFibGV0IiwiVGV4ZXRUYWJsZXQiLCJQbGF5c3RhdGlvblRhYmxldCIsIlRyZWtzdG9yVGFibGV0IiwiUHlsZUF1ZGlvVGFibGV0IiwiQWR2YW5UYWJsZXQiLCJEYW55VGVjaFRhYmxldCIsIkdhbGFwYWRUYWJsZXQiLCJNaWNyb21heFRhYmxldCIsIkthcmJvbm5UYWJsZXQiLCJBbGxGaW5lVGFibGV0IiwiUFJPU0NBTlRhYmxldCIsIllPTkVTVGFibGV0IiwiQ2hhbmdKaWFUYWJsZXQiLCJHVVRhYmxldCIsIlBvaW50T2ZWaWV3VGFibGV0IiwiT3Zlcm1heFRhYmxldCIsIkhDTFRhYmxldCIsIkRQU1RhYmxldCIsIlZpc3R1cmVUYWJsZXQiLCJDcmVzdGFUYWJsZXQiLCJNZWRpYXRla1RhYmxldCIsIkNvbmNvcmRlVGFibGV0IiwiR29DbGV2ZXJUYWJsZXQiLCJNb2RlY29tVGFibGV0IiwiVm9uaW5vVGFibGV0IiwiRUNTVGFibGV0IiwiU3RvcmV4VGFibGV0IiwiVm9kYWZvbmVUYWJsZXQiLCJFc3NlbnRpZWxCVGFibGV0IiwiUm9zc01vb3JUYWJsZXQiLCJpTW9iaWxlVGFibGV0IiwiVG9saW5vVGFibGV0IiwiQXVkaW9Tb25pY1RhYmxldCIsIkFNUEVUYWJsZXQiLCJTa2tUYWJsZXQiLCJUZWNub1RhYmxldCIsIkpYRFRhYmxldCIsImlKb3lUYWJsZXQiLCJGWDJUYWJsZXQiLCJYb3JvVGFibGV0IiwiVmlld3NvbmljVGFibGV0IiwiVmVyaXpvblRhYmxldCIsIk9keXNUYWJsZXQiLCJDYXB0aXZhVGFibGV0IiwiSWNvbmJpdFRhYmxldCIsIlRlY2xhc3RUYWJsZXQiLCJPbmRhVGFibGV0IiwiSmF5dGVjaFRhYmxldCIsIkJsYXVwdW5rdFRhYmxldCIsIkRpZ21hVGFibGV0IiwiRXZvbGlvVGFibGV0IiwiTGF2YVRhYmxldCIsIkFvY1RhYmxldCIsIk1wbWFuVGFibGV0IiwiQ2Vsa29uVGFibGV0IiwiV29sZGVyVGFibGV0IiwiTWVkaWFjb21UYWJsZXQiLCJNaVRhYmxldCIsIk5pYmlydVRhYmxldCIsIk5leG9UYWJsZXQiLCJMZWFkZXJUYWJsZXQiLCJVYmlzbGF0ZVRhYmxldCIsIlBvY2tldEJvb2tUYWJsZXQiLCJLb2Nhc29UYWJsZXQiLCJIaXNlbnNlVGFibGV0IiwiSHVkbCIsIlRlbHN0cmFUYWJsZXQiLCJHZW5lcmljVGFibGV0Iiwib3NzIiwiQW5kcm9pZE9TIiwiQmxhY2tCZXJyeU9TIiwiUGFsbU9TIiwiU3ltYmlhbk9TIiwiV2luZG93c01vYmlsZU9TIiwiV2luZG93c1Bob25lT1MiLCJpT1MiLCJNZWVHb09TIiwiTWFlbW9PUyIsIkphdmFPUyIsIndlYk9TIiwiYmFkYU9TIiwiQlJFV09TIiwidWFzIiwiQ2hyb21lIiwiRG9sZmluIiwiT3BlcmEiLCJTa3lmaXJlIiwiRWRnZSIsIklFIiwiRmlyZWZveCIsIkJvbHQiLCJUZWFTaGFyayIsIkJsYXplciIsIlNhZmFyaSIsIlVDQnJvd3NlciIsImJhaWR1Ym94YXBwIiwiYmFpZHVicm93c2VyIiwiRGlpZ29Ccm93c2VyIiwiUHVmZmluIiwiTWVyY3VyeSIsIk9iaWdvQnJvd3NlciIsIk5ldEZyb250IiwiR2VuZXJpY0Jyb3dzZXIiLCJQYWxlTW9vbiIsInByb3BzIiwiTW9iaWxlIiwiQnVpbGQiLCJWZXJzaW9uIiwiVmVuZG9ySUQiLCJpUG9kIiwiQ29hc3QiLCJGZW5uZWMiLCJOb2tpYUJyb3dzZXIiLCJNUVFCcm93c2VyIiwiTWljcm9NZXNzZW5nZXIiLCJTYW1zdW5nQnJvd3NlciIsIklyb24iLCJUaXplbiIsIldlYmtpdCIsIkdlY2tvIiwiVHJpZGVudCIsIlByZXN0byIsIkdvYW5uYSIsIkFuZHJvaWQiLCJCUkVXIiwiSmF2YSIsIlN5bWJpYW4iLCJ1dGlscyIsIkJvdCIsIk1vYmlsZUJvdCIsIkRlc2t0b3BNb2RlIiwiVFYiLCJXZWJLaXQiLCJDb25zb2xlIiwiV2F0Y2giLCJkZXRlY3RNb2JpbGVCcm93c2VycyIsImZ1bGxQYXR0ZXJuIiwic2hvcnRQYXR0ZXJuIiwidGFibGV0UGF0dGVybiIsInQiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIkZBTExCQUNLX1BIT05FIiwiRkFMTEJBQ0tfVEFCTEVUIiwiRkFMTEJBQ0tfTU9CSUxFIiwiaXNBcnJheSIsInRvU3RyaW5nIiwiQSIsIkIiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwib3NzMCIsImZpbmRNYXRjaCIsInRlc3QiLCJmaW5kTWF0Y2hlcyIsImdldFZlcnNpb25TdHIiLCJleGVjIiwiZ2V0VmVyc2lvbiIsInByZXBhcmVWZXJzaW9uTm8iLCJOYU4iLCJzaGlmdCIsImlzTW9iaWxlRmFsbGJhY2siLCJpc1RhYmxldEZhbGxiYWNrIiwicHJlcGFyZURldGVjdGlvbkNhY2hlIiwibW9iaWxlIiwidGFibGV0IiwicGhvbmUiLCJpc1Bob25lU2l6ZWQiLCJtb2JpbGVHcmFkZSIsIm9zIiwiaXMiLCJtYXRjaCIsImRldGVjdE9TIiwiZ2V0RGV2aWNlU21hbGxlclNpZGUiLCJzY3JlZW4iLCJjb25zdHJ1Y3RvciIsInVzZXJBZ2VudCIsInVzZXJBZ2VudHMiLCJ2ZXJzaW9uU3RyIiwiZ3JhZGUiLCJfaW1wbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiLCJNb2JpbGVEZXRlY3QiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQU9BLENBQUEsVUFBQUEsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUE7O0FBQUEsV0FBQUMsQ0FBQSxDQUFBSCxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFdBQUEsS0FBQUcsT0FBQSxHQUFBSixDQUFBLEVBQUEsS0FBQUssUUFBQSxHQUFBTixDQUFBLENBQUFDLENBQUEsQ0FBQSxFQUFBLEtBQUFNLE1BQUEsR0FBQVAsQ0FBQSxDQUFBUSxNQUFBLENBQUEsRUFBQSxFQUFBQyxDQUFBLEVBQUFQLENBQUEsQ0FBQSxFQUFBLEtBQUFRLFNBQUEsR0FBQTtBQUFBQyxNQUFBQSxVQUFBLEVBQUE7QUFBQSxLQUFBLEVBQUEsS0FBQUMsSUFBQSxFQUFBLEVBQUEsSUFBQTtBQUFBOztBQUFBLE1BQUFDLENBQUEsR0FBQSxlQUFBO0FBQUEsTUFBQUosQ0FBQSxHQUFBO0FBQUFLLElBQUFBLFdBQUEsRUFBQSxJQUFBO0FBQUFDLElBQUFBLGlCQUFBLEVBQUEsWUFBQTtBQUFBQyxJQUFBQSxhQUFBLEVBQUEsS0FBQTtBQUFBQyxJQUFBQSxZQUFBLEVBQUEsWUFBQTtBQUFBQyxJQUFBQSxNQUFBLEVBQUEsQ0FBQTtBQUFBQyxJQUFBQSxNQUFBLEVBQUEsR0FBQTtBQUFBQyxJQUFBQSxPQUFBLEVBQUEsSUFBQTtBQUFBQyxJQUFBQSxPQUFBLEVBQUEsSUFBQTtBQUFBQyxJQUFBQSxlQUFBLEVBQUEsTUFBQTtBQUFBQyxJQUFBQSxZQUFBLEVBQUEsZ0JBQUE7QUFBQUMsSUFBQUEsYUFBQSxFQUFBLElBQUE7QUFBQUMsSUFBQUEsV0FBQSxFQUFBLENBQUEsQ0FBQTtBQUFBQyxJQUFBQSxhQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQUFDLElBQUFBLFdBQUEsRUFBQSxNQUFBO0FBQUFDLElBQUFBLFFBQUEsRUFBQSxDQUFBLENBQUE7QUFBQUMsSUFBQUEsUUFBQSxFQUFBLEtBQUE7QUFBQUMsSUFBQUEsVUFBQSxFQUFBLE9BQUE7QUFBQUMsSUFBQUEsU0FBQSxFQUFBLE1BQUE7QUFBQUMsSUFBQUEsZUFBQSxFQUFBLENBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxVQUFBLENBQUE7QUFBQUMsSUFBQUEsZ0JBQUEsRUFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxDQUFBO0FBQUFDLElBQUFBLHlCQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsQ0FBQTtBQUFBQyxJQUFBQSxlQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBO0FBQUEsR0FBQTtBQUFBbkMsRUFBQUEsQ0FBQSxDQUFBUSxNQUFBLENBQUFKLENBQUEsQ0FBQWdDLFNBQUEsRUFBQTtBQUFBeEIsSUFBQUEsSUFBQSxFQUFBLGdCQUFBO0FBQUEsV0FBQXlCLHdCQUFBLElBQUEsS0FBQUMsb0JBQUEsRUFBQSxFQUFBLEtBQUFDLFdBQUEsRUFBQSxFQUFBLEtBQUFDLGNBQUEsRUFBQSxFQUFBLEtBQUFDLGVBQUEsRUFBQSxFQUFBLEtBQUFDLGVBQUEsRUFBQSxFQUFBLEtBQUFuQyxNQUFBLENBQUFPLFdBQUEsSUFBQSxLQUFBNkIsbUJBQUEsRUFBQTtBQUFBLEtBQUE7QUFBQU4sSUFBQUEsd0JBQUEsRUFBQSxvQ0FBQTtBQUFBLGFBQUEsQ0FBQXJDLENBQUEsQ0FBQSxpQkFBQSxLQUFBTyxNQUFBLENBQUFlLGVBQUEsR0FBQSxJQUFBLENBQUEsQ0FBQXNCLE1BQUEsS0FBQTVDLENBQUEsQ0FBQTZDLEtBQUEsQ0FBQSx5QkFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUFBUCxJQUFBQSxvQkFBQSxFQUFBLGdDQUFBO0FBQUEsVUFBQXRDLENBQUEsR0FBQSxJQUFBOEMsSUFBQSxFQUFBO0FBQUEsV0FBQXBDLFNBQUEsQ0FBQXFDLFVBQUEsR0FBQS9DLENBQUEsQ0FBQWdELE9BQUEsRUFBQSxFQUFBLEtBQUF0QyxTQUFBLENBQUF1QyxZQUFBLEdBQUFqRCxDQUFBLENBQUFrRCxRQUFBLEtBQUEsQ0FBQSxFQUFBLEtBQUF4QyxTQUFBLENBQUF5QyxXQUFBLEdBQUFuRCxDQUFBLENBQUFvRCxXQUFBLEVBQUE7QUFBQSxLQUFBO0FBQUFiLElBQUFBLFdBQUEsRUFBQSx1QkFBQTtBQUFBLFVBQUF0QyxDQUFBLEVBQUFDLENBQUE7O0FBQUEsVUFBQSxZQUFBLEtBQUFHLE9BQUEsQ0FBQWdELE9BQUEsQ0FBQUMsV0FBQSxFQUFBLEVBQUE7QUFBQSxhQUFBL0MsTUFBQSxDQUFBTyxXQUFBLEtBQUEsS0FBQVAsTUFBQSxDQUFBTyxXQUFBLEdBQUEsS0FBQVQsT0FBQSxDQUFBa0QsS0FBQSxHQUFBckQsQ0FBQSxHQUFBLEtBQUFJLFFBQUEsQ0FBQWtELElBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxFQUFBQyxJQUFBLENBQUEsaUJBQUEsS0FBQWxELE1BQUEsQ0FBQWdCLFlBQUEsR0FBQSxVQUFBLENBQUE7QUFBQSxZQUFBcEIsQ0FBQSxHQUFBLEtBQUFJLE1BQUEsQ0FBQWUsZUFBQSxLQUFBYixDQUFBLENBQUFhLGVBQUE7QUFBQSxZQUFBbEIsQ0FBQSxHQUFBLEtBQUFDLE9BQUEsQ0FBQXFELFlBQUEsQ0FBQSxNQUFBLENBQUE7QUFBQXRELFFBQUFBLENBQUEsSUFBQUQsQ0FBQSxHQUFBQSxDQUFBLElBQUEsS0FBQUcsUUFBQSxDQUFBa0QsSUFBQSxDQUFBLE1BQUEsRUFBQSxLQUFBakQsTUFBQSxDQUFBZSxlQUFBLENBQUEsR0FBQSxLQUFBaEIsUUFBQSxDQUFBa0QsSUFBQSxDQUFBLE1BQUEsRUFBQS9DLENBQUEsQ0FBQWEsZUFBQSxDQUFBLEVBQUFyQixDQUFBLEdBQUEsS0FBQUssUUFBQSxDQUFBcUQsTUFBQSxFQUFBO0FBQUEsT0FBQSxNQUFBekQsQ0FBQSxHQUFBRixDQUFBLENBQUEsVUFBQSxFQUFBO0FBQUE0RCxRQUFBQSxJQUFBLEVBQUEsUUFBQTtBQUFBQyxRQUFBQSxJQUFBLEVBQUEsS0FBQXRELE1BQUEsQ0FBQWU7QUFBQSxPQUFBLENBQUEsRUFBQSxLQUFBaEIsUUFBQSxDQUFBd0QsTUFBQSxDQUFBNUQsQ0FBQSxFQUFBNkQsUUFBQSxDQUFBLEtBQUF4RCxNQUFBLENBQUFnQixZQUFBLENBQUEsRUFBQXRCLENBQUEsR0FBQSxLQUFBSyxRQUFBOztBQUFBLGFBQUEsS0FBQUksU0FBQSxDQUFBQyxVQUFBLENBQUFxRCxhQUFBLEdBQUEvRCxDQUFBLEVBQUEsS0FBQVMsU0FBQSxDQUFBQyxVQUFBLENBQUFzRCxXQUFBLEdBQUEvRCxDQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUFBc0MsSUFBQUEsY0FBQSxFQUFBLDBCQUFBO0FBQUEsVUFBQXhDLENBQUEsRUFBQUMsQ0FBQSxFQUFBQyxDQUFBO0FBQUEsYUFBQUUsQ0FBQSxDQUFBOEQsT0FBQSxHQUFBO0FBQUFDLFFBQUFBLEdBQUEsRUFBQSxLQUFBNUQsTUFBQSxDQUFBMkIseUJBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQWtDLFFBQUFBLEtBQUEsRUFBQSxLQUFBN0QsTUFBQSxDQUFBMkIseUJBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQW1DLFFBQUFBLElBQUEsRUFBQSxLQUFBOUQsTUFBQSxDQUFBMkIseUJBQUEsQ0FBQSxDQUFBO0FBQUEsT0FBQSxFQUFBbEMsQ0FBQSxHQUFBLEtBQUFzRSxnQkFBQSxFQUFBLEVBQUEsS0FBQTVELFNBQUEsQ0FBQUMsVUFBQSxDQUFBNEQsV0FBQSxHQUFBdkUsQ0FBQSxFQUFBQyxDQUFBLEdBQUEsS0FBQXVFLGtCQUFBLEVBQUEsRUFBQSxLQUFBOUQsU0FBQSxDQUFBQyxVQUFBLENBQUE4RCxhQUFBLEdBQUF4RSxDQUFBLEVBQUFDLENBQUEsR0FBQSxLQUFBd0UsaUJBQUEsRUFBQSxFQUFBLEtBQUFoRSxTQUFBLENBQUFDLFVBQUEsQ0FBQWdFLFlBQUEsR0FBQXpFLENBQUEsRUFBQSxDQUFBLENBQUE7QUFBQSxLQUFBO0FBQUF1QyxJQUFBQSxlQUFBLEVBQUEsMkJBQUE7QUFBQSxVQUFBekMsQ0FBQSxHQUFBLEtBQUFVLFNBQUEsQ0FBQUMsVUFBQSxDQUFBcUQsYUFBQTtBQUFBLFVBQUEvRCxDQUFBLEdBQUEsS0FBQVMsU0FBQSxDQUFBQyxVQUFBLENBQUE0RCxXQUFBO0FBQUEsVUFBQXJFLENBQUEsR0FBQSxLQUFBUSxTQUFBLENBQUFDLFVBQUEsQ0FBQThELGFBQUE7QUFBQSxVQUFBdEUsQ0FBQSxHQUFBLEtBQUFPLFNBQUEsQ0FBQUMsVUFBQSxDQUFBZ0UsWUFBQTs7QUFBQSxjQUFBLEtBQUFwRSxNQUFBLENBQUFTLGFBQUE7QUFBQSxhQUFBLEtBQUE7QUFBQWhCLFVBQUFBLENBQUEsQ0FBQThELE1BQUEsQ0FBQTVELENBQUEsRUFBQUQsQ0FBQSxFQUFBRSxDQUFBO0FBQUE7O0FBQUEsYUFBQSxLQUFBO0FBQUFILFVBQUFBLENBQUEsQ0FBQThELE1BQUEsQ0FBQTNELENBQUEsRUFBQUQsQ0FBQSxFQUFBRCxDQUFBO0FBQUE7O0FBQUEsYUFBQSxLQUFBO0FBQUE7QUFBQUQsVUFBQUEsQ0FBQSxDQUFBOEQsTUFBQSxDQUFBN0QsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUE7QUFBQTs7QUFBQSxhQUFBLENBQUEsQ0FBQTtBQUFBLEtBQUE7QUFBQXVDLElBQUFBLGVBQUEsRUFBQSwyQkFBQTtBQUFBLFVBQUExQyxDQUFBLEdBQUEsS0FBQVUsU0FBQSxDQUFBQyxVQUFBLENBQUE0RCxXQUFBO0FBQUEsVUFBQXRFLENBQUEsR0FBQSxLQUFBUyxTQUFBLENBQUFDLFVBQUEsQ0FBQThELGFBQUE7QUFBQSxVQUFBdkUsQ0FBQSxHQUFBLEtBQUFRLFNBQUEsQ0FBQUMsVUFBQSxDQUFBZ0UsWUFBQTtBQUFBLFVBQUF4RSxDQUFBLEdBQUEsSUFBQTtBQUFBLFVBQUFDLENBQUEsR0FBQSxLQUFBTSxTQUFBLENBQUFDLFVBQUE7QUFBQVAsTUFBQUEsQ0FBQSxDQUFBNEQsYUFBQSxDQUFBWSxFQUFBLENBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxZQUFBO0FBQUEsWUFBQS9ELENBQUE7QUFBQSxZQUFBSixDQUFBO0FBQUEsWUFBQW9FLENBQUEsR0FBQTdFLENBQUEsQ0FBQThFLEdBQUEsRUFBQTtBQUFBLFlBQUFDLENBQUEsR0FBQTlFLENBQUEsQ0FBQTZFLEdBQUEsRUFBQTtBQUFBLFlBQUFFLENBQUEsR0FBQTlFLENBQUEsQ0FBQTRFLEdBQUEsRUFBQTtBQUFBLGVBQUEsQ0FBQWpFLENBQUEsR0FBQVYsQ0FBQSxDQUFBOEUsU0FBQSxDQUFBSixDQUFBLEVBQUFFLENBQUEsRUFBQUMsQ0FBQSxDQUFBLEtBQUE1RSxDQUFBLENBQUFtRSxXQUFBLENBQUFSLFFBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQTNELENBQUEsQ0FBQW1FLFdBQUEsQ0FBQU8sR0FBQSxFQUFBLElBQUExRSxDQUFBLENBQUFtRSxXQUFBLENBQUFXLFdBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQTlFLENBQUEsQ0FBQTZELFdBQUEsQ0FBQWEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBakUsQ0FBQSxJQUFBZ0UsQ0FBQSxHQUFBRSxDQUFBLEdBQUFDLENBQUEsS0FBQSxDQUFBLEtBQUF2RSxDQUFBLEdBQUFOLENBQUEsQ0FBQWdGLGdCQUFBLENBQUFOLENBQUEsRUFBQUUsQ0FBQSxFQUFBQyxDQUFBLENBQUEsRUFBQTVFLENBQUEsQ0FBQTZELFdBQUEsQ0FBQWEsR0FBQSxDQUFBckUsQ0FBQSxDQUFBLENBQUEsRUFBQSxLQUFBTCxDQUFBLENBQUE2RCxXQUFBLENBQUFtQixNQUFBLEVBQUEsQ0FBQTtBQUFBLE9BQUE7QUFBQSxLQUFBO0FBQUF6QyxJQUFBQSxtQkFBQSxFQUFBLCtCQUFBO0FBQUEsVUFBQTNDLENBQUEsR0FBQSxLQUFBTyxNQUFBLENBQUFPLFdBQUE7QUFBQSxVQUFBYixDQUFBLEdBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUEsR0FBQSxFQUFBO0FBQUEsVUFBQUMsQ0FBQSxHQUFBLEVBQUE7QUFBQSxVQUFBQyxDQUFBLEdBQUEsRUFBQTs7QUFBQSxjQUFBLEtBQUFHLE1BQUEsQ0FBQVEsaUJBQUE7QUFBQSxhQUFBLFlBQUE7QUFBQTtBQUFBZCxVQUFBQSxDQUFBLEdBQUFELENBQUEsQ0FBQXFGLEtBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQW5GLENBQUEsR0FBQUQsQ0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBRSxDQUFBLEdBQUFGLENBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQUcsQ0FBQSxHQUFBSCxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQSxZQUFBO0FBQUFBLFVBQUFBLENBQUEsR0FBQUQsQ0FBQSxDQUFBcUYsS0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBbkYsQ0FBQSxHQUFBRCxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUFFLENBQUEsR0FBQUYsQ0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBRyxDQUFBLEdBQUFILENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBLFlBQUE7QUFBQUEsVUFBQUEsQ0FBQSxHQUFBRCxDQUFBLENBQUFxRixLQUFBLENBQUEsR0FBQSxDQUFBLEVBQUFuRixDQUFBLEdBQUFELENBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQUUsQ0FBQSxHQUFBRixDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUFHLENBQUEsR0FBQUgsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUEsTUFBQTtBQUFBQSxVQUFBQSxDQUFBLEdBQUEsSUFBQTZDLElBQUEsRUFBQSxFQUFBN0MsQ0FBQSxDQUFBcUYsT0FBQSxDQUFBLE1BQUF0RixDQUFBLENBQUEsRUFBQUUsQ0FBQSxHQUFBRCxDQUFBLENBQUErQyxPQUFBLEtBQUEsRUFBQSxFQUFBN0MsQ0FBQSxHQUFBRixDQUFBLENBQUFpRCxRQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQTlDLENBQUEsR0FBQUgsQ0FBQSxDQUFBbUQsV0FBQSxFQUFBLEVBQUFsRCxDQUFBLENBQUEwQyxNQUFBLEdBQUEsQ0FBQSxLQUFBMUMsQ0FBQSxHQUFBLE1BQUFBLENBQUEsQ0FBQSxFQUFBQyxDQUFBLENBQUF5QyxNQUFBLEdBQUEsQ0FBQSxLQUFBekMsQ0FBQSxHQUFBLE1BQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUEsS0FBQU8sU0FBQSxDQUFBQyxVQUFBLENBQUE0RCxXQUFBLENBQUFPLEdBQUEsQ0FBQTVFLENBQUEsR0FBQSxLQUFBUSxTQUFBLENBQUFDLFVBQUEsQ0FBQThELGFBQUEsQ0FBQUssR0FBQSxDQUFBM0UsQ0FBQSxDQUFBLEVBQUEsS0FBQU8sU0FBQSxDQUFBQyxVQUFBLENBQUFnRSxZQUFBLENBQUFHLEdBQUEsQ0FBQTFFLENBQUEsQ0FBQSxFQUFBLEtBQUFNLFNBQUEsQ0FBQUMsVUFBQSxDQUFBc0QsV0FBQSxDQUFBYSxHQUFBLENBQUE5RSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsS0FBQSxLQUFBaUYsU0FBQSxDQUFBL0UsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsQ0FBQSxJQUFBLEtBQUFNLFNBQUEsQ0FBQUMsVUFBQSxDQUFBNEQsV0FBQSxDQUFBUixRQUFBLENBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQUEsS0FBQTtBQUFBd0IsSUFBQUEsaUJBQUEsRUFBQSwyQkFBQXRGLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUEsR0FBQUQsQ0FBQTtBQUFBLGFBQUEsS0FBQU0sTUFBQSxDQUFBaUIsYUFBQSxLQUFBdEIsQ0FBQSxJQUFBLE1BQUEsS0FBQUssTUFBQSxDQUFBaUIsYUFBQSxHQUFBeEIsQ0FBQSxDQUFBLG1CQUFBLEVBQUE7QUFBQSxpQkFBQUUsQ0FBQTtBQUFBMkQsUUFBQUEsSUFBQSxFQUFBLEtBQUF0RCxNQUFBLENBQUFlLGVBQUEsR0FBQSxJQUFBLEdBQUFyQixDQUFBLEdBQUEsR0FBQTtBQUFBMkIsUUFBQUEsUUFBQSxFQUFBLEtBQUFyQixNQUFBLENBQUFxQjtBQUFBLE9BQUEsQ0FBQTtBQUFBLEtBQUE7QUFBQTBDLElBQUFBLGdCQUFBLEVBQUEsNEJBQUE7QUFBQSxVQUFBdEUsQ0FBQTtBQUFBLFVBQUFDLENBQUEsR0FBQSxLQUFBc0YsaUJBQUEsQ0FBQSxLQUFBLENBQUE7QUFBQSxVQUFBcEYsQ0FBQSxHQUFBRCxDQUFBLENBQUFzRixhQUFBLENBQUEsUUFBQSxDQUFBO0FBQUFyRixNQUFBQSxDQUFBLENBQUFzRixZQUFBLENBQUEsT0FBQSxFQUFBLEVBQUEsR0FBQXRGLENBQUEsQ0FBQXVGLFdBQUEsQ0FBQXhGLENBQUEsQ0FBQXlGLGNBQUEsQ0FBQSxLQUFBcEYsTUFBQSxDQUFBc0IsUUFBQSxDQUFBLENBQUEsRUFBQTVCLENBQUEsQ0FBQTZELE1BQUEsQ0FBQTNELENBQUEsQ0FBQTs7QUFBQSxXQUFBLElBQUFDLENBQUEsR0FBQSxDQUFBLEVBQUFBLENBQUEsR0FBQSxFQUFBLEVBQUFBLENBQUEsRUFBQTtBQUFBSixRQUFBQSxDQUFBLEdBQUEsS0FBQU8sTUFBQSxDQUFBa0IsV0FBQSxHQUFBckIsQ0FBQSxHQUFBLEtBQUF3RixTQUFBLENBQUF4RixDQUFBLENBQUEsR0FBQSxNQUFBQSxDQUFBLEVBQUFELENBQUEsR0FBQUQsQ0FBQSxDQUFBc0YsYUFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBckYsQ0FBQSxDQUFBc0YsWUFBQSxDQUFBLE9BQUEsRUFBQSxNQUFBckYsQ0FBQSxDQUFBLEVBQUFELENBQUEsQ0FBQXVGLFdBQUEsQ0FBQXhGLENBQUEsQ0FBQXlGLGNBQUEsQ0FBQTNGLENBQUEsQ0FBQSxDQUFBLEVBQUFDLENBQUEsQ0FBQTZELE1BQUEsQ0FBQTNELENBQUEsQ0FBQTtBQUFBOztBQUFBLFdBQUEsSUFBQVUsQ0FBQSxHQUFBLEVBQUEsRUFBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQUEsQ0FBQSxFQUFBO0FBQUFiLFFBQUFBLENBQUEsR0FBQWEsQ0FBQSxFQUFBLEtBQUFOLE1BQUEsQ0FBQWtCLFdBQUEsS0FBQXpCLENBQUEsR0FBQWEsQ0FBQSxHQUFBLEtBQUErRSxTQUFBLENBQUEvRSxDQUFBLENBQUEsQ0FBQSxFQUFBVixDQUFBLEdBQUFELENBQUEsQ0FBQXNGLGFBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQXJGLENBQUEsQ0FBQXNGLFlBQUEsQ0FBQSxPQUFBLEVBQUE1RSxDQUFBLENBQUEsRUFBQVYsQ0FBQSxDQUFBdUYsV0FBQSxDQUFBeEYsQ0FBQSxDQUFBeUYsY0FBQSxDQUFBM0YsQ0FBQSxDQUFBLENBQUEsRUFBQUMsQ0FBQSxDQUFBNkQsTUFBQSxDQUFBM0QsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQUYsQ0FBQTtBQUFBLEtBQUE7QUFBQXVFLElBQUFBLGtCQUFBLEVBQUEsOEJBQUE7QUFBQSxVQUFBeEUsQ0FBQSxHQUFBLEtBQUF1RixpQkFBQSxDQUFBLE9BQUEsQ0FBQTtBQUFBLFVBQUF0RixDQUFBLEdBQUFDLENBQUEsQ0FBQXNGLGFBQUEsQ0FBQSxRQUFBLENBQUE7QUFBQXZGLE1BQUFBLENBQUEsQ0FBQXdGLFlBQUEsQ0FBQSxPQUFBLEVBQUEsRUFBQSxHQUFBeEYsQ0FBQSxDQUFBeUYsV0FBQSxDQUFBeEYsQ0FBQSxDQUFBeUYsY0FBQSxDQUFBLEtBQUFwRixNQUFBLENBQUF1QixVQUFBLENBQUEsQ0FBQSxFQUFBOUIsQ0FBQSxDQUFBOEQsTUFBQSxDQUFBN0QsQ0FBQSxDQUFBOztBQUFBLFdBQUEsSUFBQUUsQ0FBQSxHQUFBLENBQUEsRUFBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQUEsQ0FBQSxFQUFBLEVBQUE7QUFBQSxZQUFBQyxDQUFBOztBQUFBLGdCQUFBLEtBQUFHLE1BQUEsQ0FBQW9CLFdBQUE7QUFBQSxlQUFBLE9BQUE7QUFBQXZCLFlBQUFBLENBQUEsR0FBQSxLQUFBRyxNQUFBLENBQUEwQixnQkFBQSxDQUFBOUIsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGVBQUEsTUFBQTtBQUFBQyxZQUFBQSxDQUFBLEdBQUEsS0FBQUcsTUFBQSxDQUFBeUIsZUFBQSxDQUFBN0IsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGVBQUEsU0FBQTtBQUFBQyxZQUFBQSxDQUFBLEdBQUFELENBQUEsRUFBQSxLQUFBSSxNQUFBLENBQUFtQixhQUFBLEtBQUF0QixDQUFBLElBQUEsS0FBQXdGLFNBQUEsQ0FBQXpGLENBQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUFBLFFBQUFBLENBQUEsR0FBQSxFQUFBLEtBQUFBLENBQUEsR0FBQSxNQUFBQSxDQUFBLEdBQUFGLENBQUEsR0FBQUMsQ0FBQSxDQUFBc0YsYUFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBdkYsQ0FBQSxDQUFBd0YsWUFBQSxDQUFBLE9BQUEsRUFBQXRGLENBQUEsQ0FBQSxFQUFBRixDQUFBLENBQUF5RixXQUFBLENBQUF4RixDQUFBLENBQUF5RixjQUFBLENBQUF2RixDQUFBLENBQUEsQ0FBQSxFQUFBSixDQUFBLENBQUE4RCxNQUFBLENBQUE3RCxDQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBRCxDQUFBO0FBQUEsS0FBQTtBQUFBMEUsSUFBQUEsaUJBQUEsRUFBQSw2QkFBQTtBQUFBLFVBQUExRSxDQUFBLEdBQUEsS0FBQU8sTUFBQSxDQUFBYSxPQUFBO0FBQUEsVUFBQW5CLENBQUEsR0FBQSxLQUFBTSxNQUFBLENBQUFjLE9BQUE7QUFBQSxVQUFBbEIsQ0FBQSxHQUFBLEtBQUFvRixpQkFBQSxDQUFBLE1BQUEsQ0FBQTtBQUFBLFVBQUFuRixDQUFBLEdBQUFGLENBQUEsQ0FBQXNGLGFBQUEsQ0FBQSxRQUFBLENBQUE7QUFBQXBGLE1BQUFBLENBQUEsQ0FBQXFGLFlBQUEsQ0FBQSxPQUFBLEVBQUEsRUFBQSxHQUFBckYsQ0FBQSxDQUFBc0YsV0FBQSxDQUFBeEYsQ0FBQSxDQUFBeUYsY0FBQSxDQUFBLEtBQUFwRixNQUFBLENBQUF3QixTQUFBLENBQUEsQ0FBQSxFQUFBNUIsQ0FBQSxDQUFBMkQsTUFBQSxDQUFBMUQsQ0FBQSxDQUFBLEVBQUFKLENBQUEsS0FBQUEsQ0FBQSxHQUFBLEtBQUFVLFNBQUEsQ0FBQXlDLFdBQUEsSUFBQSxLQUFBNUMsTUFBQSxDQUFBWSxNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQWxCLENBQUEsS0FBQUEsQ0FBQSxHQUFBLEtBQUFTLFNBQUEsQ0FBQXlDLFdBQUEsR0FBQSxLQUFBNUMsTUFBQSxDQUFBVyxNQUFBLENBQUE7O0FBQUEsV0FBQSxJQUFBTCxDQUFBLEdBQUFaLENBQUEsRUFBQVksQ0FBQSxJQUFBYixDQUFBLEVBQUFhLENBQUEsRUFBQTtBQUFBVCxRQUFBQSxDQUFBLEdBQUFGLENBQUEsQ0FBQXNGLGFBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQXBGLENBQUEsQ0FBQXFGLFlBQUEsQ0FBQSxPQUFBLEVBQUE1RSxDQUFBLENBQUEsRUFBQVQsQ0FBQSxDQUFBc0YsV0FBQSxDQUFBeEYsQ0FBQSxDQUFBeUYsY0FBQSxDQUFBOUUsQ0FBQSxDQUFBLENBQUEsRUFBQVYsQ0FBQSxDQUFBMkQsTUFBQSxDQUFBMUQsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQUQsQ0FBQTtBQUFBLEtBQUE7QUFBQXlGLElBQUFBLFNBQUEsRUFBQSxtQkFBQTVGLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUEsR0FBQSxFQUFBO0FBQUEsVUFBQUMsQ0FBQSxHQUFBLEtBQUFLLE1BQUEsQ0FBQTRCLGVBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUFBaEMsQ0FBQSxHQUFBLEtBQUFJLE1BQUEsQ0FBQTRCLGVBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUFBL0IsQ0FBQSxHQUFBLEtBQUFHLE1BQUEsQ0FBQTRCLGVBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUFBdEIsQ0FBQSxHQUFBLEtBQUFOLE1BQUEsQ0FBQTRCLGVBQUEsQ0FBQSxDQUFBLENBQUE7O0FBQUEsY0FBQW5DLENBQUEsR0FBQSxFQUFBO0FBQUEsYUFBQSxDQUFBO0FBQUFDLFVBQUFBLENBQUEsR0FBQUQsQ0FBQSxHQUFBLEdBQUEsS0FBQSxFQUFBLEdBQUFhLENBQUEsR0FBQVgsQ0FBQTtBQUFBOztBQUFBLGFBQUEsQ0FBQTtBQUFBRCxVQUFBQSxDQUFBLEdBQUFELENBQUEsR0FBQSxHQUFBLEtBQUEsRUFBQSxHQUFBYSxDQUFBLEdBQUFWLENBQUE7QUFBQTs7QUFBQSxhQUFBLENBQUE7QUFBQUYsVUFBQUEsQ0FBQSxHQUFBRCxDQUFBLEdBQUEsR0FBQSxLQUFBLEVBQUEsR0FBQWEsQ0FBQSxHQUFBVCxDQUFBO0FBQUE7O0FBQUE7QUFBQUgsVUFBQUEsQ0FBQSxHQUFBLElBQUE7QUFBQTs7QUFBQSxhQUFBQSxDQUFBO0FBQUEsS0FBQTtBQUFBZ0YsSUFBQUEsU0FBQSxFQUFBLG1CQUFBakYsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUE7O0FBQUEsVUFBQSxTQUFBRixDQUFBLEVBQUE7QUFBQSxZQUFBRyxDQUFBLEdBQUEsSUFBQTBDLElBQUEsQ0FBQTVDLENBQUEsRUFBQUQsQ0FBQSxFQUFBLENBQUEsRUFBQStDLE9BQUEsRUFBQTtBQUFBLFlBQUFuQyxDQUFBLEdBQUFnRixRQUFBLENBQUE3RixDQUFBLEVBQUEsRUFBQSxDQUFBO0FBQUFHLFFBQUFBLENBQUEsR0FBQSxLQUFBMkYsZ0JBQUEsQ0FBQTFGLENBQUEsRUFBQVMsQ0FBQSxDQUFBLEVBQUFWLENBQUEsSUFBQSxLQUFBTyxTQUFBLENBQUFDLFVBQUEsQ0FBQXNELFdBQUEsQ0FBQWEsR0FBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUEzRSxDQUFBO0FBQUEsS0FBQTtBQUFBMkYsSUFBQUEsZ0JBQUEsRUFBQSwwQkFBQTlGLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsVUFBQUUsQ0FBQSxHQUFBMEYsUUFBQSxDQUFBLEtBQUFuRixTQUFBLENBQUFDLFVBQUEsQ0FBQTRELFdBQUEsQ0FBQXdCLFFBQUEsQ0FBQSxPQUFBLEVBQUFqQixHQUFBLEVBQUEsRUFBQSxFQUFBLENBQUE7QUFBQSxVQUFBMUUsQ0FBQSxHQUFBLEVBQUE7QUFBQSxVQUFBUyxDQUFBLEdBQUEsRUFBQTtBQUFBLFVBQUFKLENBQUEsR0FBQSxDQUFBLENBQUE7O0FBQUEsVUFBQU4sQ0FBQSxHQUFBSCxDQUFBLEVBQUE7QUFBQSxlQUFBRyxDQUFBLEdBQUFILENBQUE7QUFBQSxlQUFBVSxTQUFBLENBQUFDLFVBQUEsQ0FBQTRELFdBQUEsQ0FBQXdCLFFBQUEsQ0FBQSxPQUFBLEVBQUFDLE1BQUEsSUFBQTdGLENBQUEsRUFBQTtBQUFBOztBQUFBRixRQUFBQSxDQUFBLEdBQUFELENBQUEsS0FBQVMsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBLE9BQUEsTUFBQSxJQUFBTixDQUFBLEdBQUFILENBQUEsRUFBQSxPQUFBRyxDQUFBLEdBQUFILENBQUEsR0FBQTtBQUFBSSxRQUFBQSxDQUFBLEdBQUEsRUFBQUQsQ0FBQSxFQUFBVSxDQUFBLEdBQUFULENBQUEsRUFBQSxLQUFBRyxNQUFBLENBQUFrQixXQUFBLEtBQUFaLENBQUEsSUFBQSxLQUFBK0UsU0FBQSxDQUFBekYsQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUFBMEUsQ0FBQSxHQUFBM0UsQ0FBQSxDQUFBc0YsYUFBQSxDQUFBLFFBQUEsQ0FBQTtBQUFBWCxRQUFBQSxDQUFBLENBQUFZLFlBQUEsQ0FBQSxPQUFBLEVBQUFyRixDQUFBLEdBQUF5RSxDQUFBLENBQUFhLFdBQUEsQ0FBQXhGLENBQUEsQ0FBQXlGLGNBQUEsQ0FBQTlFLENBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQUgsU0FBQSxDQUFBQyxVQUFBLENBQUE0RCxXQUFBLENBQUFULE1BQUEsQ0FBQWUsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQXBFLENBQUE7QUFBQSxLQUFBO0FBQUEwRSxJQUFBQSxnQkFBQSxFQUFBLDBCQUFBbkYsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUEsRUFBQUMsQ0FBQTs7QUFBQSxjQUFBLEtBQUFHLE1BQUEsQ0FBQVUsWUFBQTtBQUFBLGFBQUEsTUFBQTtBQUFBYixVQUFBQSxDQUFBLEdBQUEsSUFBQTBDLElBQUEsRUFBQSxFQUFBMUMsQ0FBQSxDQUFBNkYsT0FBQSxDQUFBakcsQ0FBQSxDQUFBLEVBQUFJLENBQUEsQ0FBQThGLFFBQUEsQ0FBQWpHLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQUcsQ0FBQSxDQUFBK0YsT0FBQSxDQUFBakcsQ0FBQSxDQUFBLEVBQUFDLENBQUEsR0FBQWlHLElBQUEsQ0FBQUMsS0FBQSxDQUFBakcsQ0FBQSxDQUFBa0csT0FBQSxLQUFBLEdBQUEsQ0FBQTtBQUFBOztBQUFBO0FBQUFuRyxVQUFBQSxDQUFBLEdBQUEsS0FBQUksTUFBQSxDQUFBVSxZQUFBLENBQUFzRixPQUFBLENBQUEsSUFBQSxFQUFBdkcsQ0FBQSxFQUFBdUcsT0FBQSxDQUFBLElBQUEsRUFBQXRHLENBQUEsRUFBQXNHLE9BQUEsQ0FBQSxNQUFBLEVBQUFyRyxDQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBQyxDQUFBO0FBQUEsS0FBQTtBQUFBcUcsSUFBQUEsT0FBQSxFQUFBLG1CQUFBO0FBQUEsVUFBQXhHLENBQUEsR0FBQSxLQUFBTyxNQUFBLENBQUFnQixZQUFBO0FBQUEsVUFBQSxLQUFBakIsUUFBQSxDQUFBbUcsUUFBQSxDQUFBekcsQ0FBQSxDQUFBLEVBQUEsS0FBQU0sUUFBQSxDQUFBb0csS0FBQSxHQUFBLEtBQUE7QUFBQSxZQUFBekcsQ0FBQSxHQUFBLEtBQUFLLFFBQUEsQ0FBQXFELE1BQUEsRUFBQTtBQUFBLFlBQUF6RCxDQUFBLEdBQUFELENBQUEsQ0FBQTBHLElBQUEsQ0FBQSxRQUFBLENBQUE7QUFBQSxhQUFBckcsUUFBQSxDQUFBc0csTUFBQSxJQUFBMUcsQ0FBQSxDQUFBOEYsTUFBQSxFQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUEsR0FBQWhHLENBQUEsQ0FBQTZHLEVBQUEsQ0FBQWhHLENBQUEsSUFBQSxVQUFBWixDQUFBLEVBQUE7QUFBQSxXQUFBLEtBQUE2RyxJQUFBLENBQUEsWUFBQTtBQUFBLFVBQUEsWUFBQSxPQUFBN0csQ0FBQSxFQUFBO0FBQUEsWUFBQUMsQ0FBQSxHQUFBNkcsS0FBQSxDQUFBM0UsU0FBQSxDQUFBNEUsS0FBQSxDQUFBQyxJQUFBLENBQUFDLFNBQUEsRUFBQSxDQUFBLENBQUE7QUFBQSxZQUFBL0csQ0FBQSxHQUFBSCxDQUFBLENBQUFtSCxJQUFBLENBQUEsSUFBQSxFQUFBLFlBQUF0RyxDQUFBLENBQUE7QUFBQSxZQUFBLGVBQUEsT0FBQVYsQ0FBQSxFQUFBLE9BQUFILENBQUEsQ0FBQTZDLEtBQUEsQ0FBQSwwREFBQSxHQUFBLENBQUEsQ0FBQTtBQUFBMUMsUUFBQUEsQ0FBQSxDQUFBRixDQUFBLENBQUEsQ0FBQW1ILEtBQUEsQ0FBQWpILENBQUEsRUFBQUQsQ0FBQTtBQUFBLE9BQUEsTUFBQUYsQ0FBQSxDQUFBbUgsSUFBQSxDQUFBLElBQUEsRUFBQSxZQUFBdEcsQ0FBQSxLQUFBYixDQUFBLENBQUFtSCxJQUFBLENBQUEsSUFBQSxFQUFBLFlBQUF0RyxDQUFBLEVBQUEsSUFBQVQsQ0FBQSxDQUFBLElBQUEsRUFBQUgsQ0FBQSxDQUFBLENBQUE7QUFBQSxLQUFBLEdBQUEsSUFBQTtBQUFBLEdBQUE7QUFBQSxDQUFBLENBQUFvSCxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsUUFBQSxDQUFBO0FDUEE7O0FBQUEsQ0FBQSxVQUFBQyxDQUFBLEVBQUE7QUFDQUEsRUFBQUEsQ0FBQSxDQUFBWCxFQUFBLENBQUFZLElBQUEsR0FBQSxVQUFBQyxJQUFBLEVBQUE7QUFDQTtBQUNBLFFBQUFuSCxNQUFBLEdBQUFpSCxDQUFBLENBQUFoSCxNQUFBLENBQUEsRUFBQSxFQUFBO0FBQ0FtSCxNQUFBQSxJQUFBLEVBQUE7QUFEQSxLQUFBLEVBRUFELElBRkEsQ0FBQTtBQUdBLFFBQUFFLFVBQUEsQ0FMQSxDQU1BOztBQUNBLGFBQUFoSCxJQUFBLENBQUFpSCxHQUFBLEVBQUE7QUFDQSxVQUFBQyxJQUFBLEdBQUFOLENBQUEsQ0FBQUssR0FBQSxDQUFBO0FBQ0EsVUFBQUUsU0FBQSxHQUFBRCxJQUFBLENBQUFuQixJQUFBLENBQUEsVUFBQSxDQUFBO0FBQ0EsVUFBQXFCLFFBQUEsR0FBQUYsSUFBQSxDQUFBbkIsSUFBQSxDQUFBLGFBQUEsQ0FBQTtBQUNBLFVBQUFzQixVQUFBLEdBQUFILElBQUEsQ0FBQW5CLElBQUEsQ0FBQSxZQUFBLENBQUE7QUFDQW9CLE1BQUFBLFNBQUEsQ0FBQUcsS0FBQSxDQUFBLFlBQUE7QUFDQUosUUFBQUEsSUFBQSxDQUFBSyxXQUFBLENBQUEsYUFBQTs7QUFDQSxZQUFBWCxDQUFBLENBQUEsTUFBQSxDQUFBLENBQUFmLFFBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQTtBQUNBZSxVQUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLENBQUF0QyxXQUFBLENBQUEsU0FBQTtBQUNBc0MsVUFBQUEsQ0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBWSxTQUFBLENBQUFSLFVBQUE7QUFDQSxTQUhBLE1BR0E7QUFDQUEsVUFBQUEsVUFBQSxHQUFBeEIsSUFBQSxDQUFBaUMsR0FBQSxDQUFBZixNQUFBLENBQUFnQixXQUFBLEVBQUFmLFFBQUEsQ0FBQWdCLGVBQUEsQ0FBQUgsU0FBQSxFQUFBYixRQUFBLENBQUFpQixJQUFBLENBQUFKLFNBQUEsQ0FBQTtBQUNBWixVQUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLENBQUF6RCxRQUFBLENBQUEsU0FBQTtBQUNBO0FBQ0EsT0FUQTtBQVVBa0UsTUFBQUEsVUFBQSxDQUFBQyxLQUFBLENBQUEsWUFBQTtBQUNBSixRQUFBQSxJQUFBLENBQUE1QyxXQUFBLENBQUEsYUFBQTtBQUNBc0MsUUFBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBdEMsV0FBQSxDQUFBLFNBQUE7QUFDQXNDLFFBQUFBLENBQUEsQ0FBQSxZQUFBLENBQUEsQ0FBQVksU0FBQSxDQUFBUixVQUFBO0FBQ0EsT0FKQTtBQU1BSSxNQUFBQSxRQUFBLENBQUFFLEtBQUEsQ0FBQSxZQUFBO0FBQ0FKLFFBQUFBLElBQUEsQ0FBQTVDLFdBQUEsQ0FBQSxhQUFBO0FBQ0FzQyxRQUFBQSxDQUFBLENBQUEsTUFBQSxDQUFBLENBQUF0QyxXQUFBLENBQUEsU0FBQTtBQUNBLE9BSEE7QUFJQSxLQWhDQSxDQWlDQTs7O0FBQ0EsV0FBQSxLQUFBNEIsSUFBQSxDQUFBLFlBQUE7QUFDQWxHLE1BQUFBLElBQUEsQ0FBQTRHLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtBQUNBLEtBRkEsQ0FBQTtBQUdBLEdBckNBLENBREEsQ0F1Q0E7O0FBRUEsQ0F6Q0EsRUF5Q0FILE1BekNBO0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBLENBQUEsVUFBQUcsQ0FBQSxFQUFBO0FBRUFBLEVBQUFBLENBQUEsQ0FBQWlCLGlCQUFBLEdBQUEsVUFBQUMsR0FBQSxFQUFBQyxPQUFBLEVBQ0E7QUFDQSxRQUFBQSxPQUFBLEdBQUFBLE9BQUEsSUFBQSxFQUFBLENBREEsQ0FHQTs7QUFFQUEsSUFBQUEsT0FBQSxDQUFBQyxjQUFBLEdBQUEsT0FBQUQsT0FBQSxDQUFBQyxjQUFBLElBQUEsV0FBQSxHQUFBRCxPQUFBLENBQUFDLGNBQUEsR0FBQSxJQUFBOztBQUVBLFFBQUFELE9BQUEsQ0FBQUMsY0FBQSxFQUFBO0FBQ0FELE1BQUFBLE9BQUEsQ0FBQUUsV0FBQSxHQUFBRixPQUFBLENBQUFFLFdBQUEsSUFBQSxLQUFBO0FBQ0FGLE1BQUFBLE9BQUEsQ0FBQUcsaUJBQUEsR0FBQSxPQUFBSCxPQUFBLENBQUFHLGlCQUFBLElBQUEsV0FBQSxHQUFBSCxPQUFBLENBQUFHLGlCQUFBLEdBQUEsSUFBQTtBQUVBSCxNQUFBQSxPQUFBLENBQUFJLE1BQUEsR0FBQUosT0FBQSxDQUFBSSxNQUFBLElBQUEsS0FBQTtBQUVBSixNQUFBQSxPQUFBLENBQUFLLGdCQUFBLEdBQUFMLE9BQUEsQ0FBQUssZ0JBQUEsSUFBQSxLQUFBO0FBQ0EsS0FkQSxDQWdCQTs7O0FBRUFMLElBQUFBLE9BQUEsQ0FBQU0sZ0JBQUEsR0FBQU4sT0FBQSxDQUFBTSxnQkFBQSxJQUFBLEtBQUE7O0FBRUEsUUFBQU4sT0FBQSxDQUFBTSxnQkFBQSxFQUFBO0FBQ0FOLE1BQUFBLE9BQUEsQ0FBQU8sWUFBQSxHQUFBUCxPQUFBLENBQUFPLFlBQUEsSUFBQSxLQUFBO0FBQ0FQLE1BQUFBLE9BQUEsQ0FBQVEsa0JBQUEsR0FBQSxPQUFBUixPQUFBLENBQUFRLGtCQUFBLElBQUEsV0FBQSxHQUFBUixPQUFBLENBQUFRLGtCQUFBLEdBQUEsSUFBQTtBQUVBUixNQUFBQSxPQUFBLENBQUFTLE9BQUEsR0FBQVQsT0FBQSxDQUFBUyxPQUFBLElBQUEsS0FBQTtBQUVBVCxNQUFBQSxPQUFBLENBQUFVLGlCQUFBLEdBQUFWLE9BQUEsQ0FBQVUsaUJBQUEsSUFBQSxLQUFBO0FBQ0EsS0EzQkEsQ0E2QkE7OztBQUVBVixJQUFBQSxPQUFBLENBQUFXLFVBQUEsR0FBQVgsT0FBQSxDQUFBVyxVQUFBLElBQUEsS0FBQSxDQS9CQSxDQStCQTs7QUFDQVgsSUFBQUEsT0FBQSxDQUFBWSxjQUFBLEdBQUEsT0FBQVosT0FBQSxDQUFBWSxjQUFBLElBQUEsV0FBQSxHQUFBWixPQUFBLENBQUFZLGNBQUEsR0FBQSxJQUFBLENBaENBLENBZ0NBO0FBRUE7O0FBRUFaLElBQUFBLE9BQUEsQ0FBQWEsT0FBQSxHQUFBYixPQUFBLENBQUFhLE9BQUEsS0FBQWIsT0FBQSxDQUFBTSxnQkFBQSxHQUFBLE1BQUEsR0FBQSxNQUFBLENBQUE7QUFDQU4sSUFBQUEsT0FBQSxDQUFBYyxRQUFBLEdBQUFkLE9BQUEsQ0FBQWMsUUFBQSxJQUFBLE1BQUE7QUFFQWQsSUFBQUEsT0FBQSxDQUFBZSxRQUFBLEdBQUFmLE9BQUEsQ0FBQWUsUUFBQSxJQUFBLEtBQUE7QUFFQWYsSUFBQUEsT0FBQSxDQUFBZ0IsYUFBQSxHQUFBaEIsT0FBQSxDQUFBZ0IsYUFBQSxJQUFBLEtBQUE7QUFFQWhCLElBQUFBLE9BQUEsQ0FBQWlCLGNBQUEsR0FBQWpCLE9BQUEsQ0FBQWlCLGNBQUEsSUFBQSxLQUFBO0FBQ0FqQixJQUFBQSxPQUFBLENBQUFrQixhQUFBLEdBQUFsQixPQUFBLENBQUFrQixhQUFBLElBQUEsS0FBQTtBQUdBLFFBQUFDLEtBQUEsR0FBQXRDLENBQUEsQ0FBQXVDLE9BQUEsQ0FBQUMsSUFBQSxJQUFBeEMsQ0FBQSxDQUFBdUMsT0FBQSxDQUFBRSxPQUFBLEdBQUEsQ0FBQSxHQUFBLElBQUEsR0FBQSxLQUFBO0FBRUEsUUFBQXRCLE9BQUEsQ0FBQVcsVUFBQSxJQUFBUSxLQUFBLEVBQUEsT0FBQSxLQUFBO0FBRUEsUUFBQUksU0FBQSxHQUFBMUMsQ0FBQSxDQUFBRCxRQUFBLENBQUE7QUFDQSxRQUFBNEMsT0FBQSxHQUFBM0MsQ0FBQSxDQUFBRixNQUFBLENBQUE7QUFDQSxRQUFBOEMsSUFBQTtBQUVBLFFBQUFDLGNBQUEsR0FBQSxLQUFBOztBQUVBLFFBQUExQixPQUFBLENBQUFDLGNBQUEsRUFBQTtBQUNBLFVBQUEwQixTQUFBO0FBQ0EsVUFBQUMsWUFBQTtBQUNBLFVBQUFDLFNBQUE7QUFDQSxVQUFBQyxZQUFBO0FBQ0EsVUFBQUMsVUFBQSxHQUFBLENBQUE7QUFDQSxVQUFBQyxTQUFBLEdBQUEsQ0FBQTtBQUNBLFVBQUFDLFdBQUEsR0FBQSxDQUFBO0FBQ0EsVUFBQUMsWUFBQSxHQUFBLEtBQUE7QUFDQSxVQUFBQyxTQUFBLEdBQUEsSUFBQTtBQUNBOztBQUVBLFFBQUFuQyxPQUFBLENBQUFNLGdCQUFBLEVBQUE7QUFDQSxVQUFBOEIsUUFBQTtBQUNBLFVBQUFDLFdBQUE7QUFDQSxVQUFBQyxRQUFBO0FBQ0EsVUFBQUMsYUFBQTtBQUNBLFVBQUFDLFdBQUEsR0FBQSxDQUFBO0FBQ0EsVUFBQUMsVUFBQSxHQUFBLENBQUE7QUFDQSxVQUFBQyxZQUFBLEdBQUEsQ0FBQTtBQUNBLFVBQUFDLGFBQUEsR0FBQSxLQUFBO0FBQ0EsVUFBQUMsVUFBQSxHQUFBLElBQUE7QUFDQTs7QUFFQTNLLElBQUFBLElBQUEsQ0FBQThILEdBQUEsQ0FBQSxDQWpGQSxDQXFGQTs7QUFFQSxhQUFBOUgsSUFBQSxDQUFBOEgsR0FBQSxFQUFBO0FBQ0E7QUFDQSxVQUFBLE9BQUFBLEdBQUEsSUFBQSxRQUFBLEVBQUEwQixJQUFBLEdBQUFvQixnQkFBQSxDQUFBOUMsR0FBQSxDQUFBLENBQUEsS0FDQTtBQUNBMEIsUUFBQUEsSUFBQSxHQUFBNUMsQ0FBQSxDQUFBa0IsR0FBQSxDQUFBO0FBRUEwQixRQUFBQSxJQUFBLENBQUFxQixHQUFBLENBQUEsVUFBQSxFQUFBM0IsS0FBQSxHQUFBLFVBQUEsR0FBQSxPQUFBO0FBRUEsWUFBQW5CLE9BQUEsQ0FBQUMsY0FBQSxFQUFBZ0MsV0FBQSxHQUFBL0UsUUFBQSxDQUFBdUUsSUFBQSxDQUFBcUIsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBRUEsWUFBQTlDLE9BQUEsQ0FBQU0sZ0JBQUEsRUFBQW9DLFlBQUEsR0FBQXhGLFFBQUEsQ0FBQXVFLElBQUEsQ0FBQXFCLEdBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTtBQUNBO0FBRUEsVUFBQTlDLE9BQUEsQ0FBQVksY0FBQSxJQUFBTyxLQUFBLEVBQUEsT0FBQSxLQUFBO0FBRUE0QixNQUFBQSxXQUFBLEdBZkEsQ0FpQkE7O0FBQ0EsVUFBQXJCLGNBQUEsRUFBQTtBQUNBLFlBQUExQixPQUFBLENBQUFLLGdCQUFBLElBQUFMLE9BQUEsQ0FBQUMsY0FBQSxFQUFBO0FBQ0FnQyxVQUFBQSxXQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUFILFlBQUE7QUFDQUwsVUFBQUEsSUFBQSxDQUFBcUIsR0FBQSxDQUFBLEtBQUEsRUFBQWIsV0FBQTtBQUNBOztBQUVBLFlBQUFqQyxPQUFBLENBQUFVLGlCQUFBLElBQUFWLE9BQUEsQ0FBQU0sZ0JBQUEsRUFBQTtBQUNBb0MsVUFBQUEsWUFBQSxJQUFBLENBQUEsQ0FBQSxHQUFBSCxhQUFBO0FBQ0FkLFVBQUFBLElBQUEsQ0FBQXFCLEdBQUEsQ0FBQSxNQUFBLEVBQUFKLFlBQUE7QUFDQTtBQUNBLE9BNUJBLENBOEJBOzs7QUFFQWxCLE1BQUFBLE9BQUEsQ0FBQXdCLE1BQUEsQ0FBQSxZQUFBO0FBQ0FDLFFBQUFBLEdBQUE7QUFDQSxPQUZBO0FBSUF6QixNQUFBQSxPQUFBLENBQUEwQixNQUFBLENBQUEsWUFBQTtBQUNBSCxRQUFBQSxXQUFBO0FBQ0EsT0FGQTtBQUdBLEtBOUhBLENBbUlBOzs7QUFFQSxhQUFBRixnQkFBQSxDQUFBTSxNQUFBLEVBQUE7QUFDQSxVQUFBQyxLQUFBLEdBQUE7QUFDQUMsUUFBQUEsT0FBQSxFQUFBLE9BREE7QUFFQUMsUUFBQUEsR0FBQSxFQUFBLENBRkE7QUFHQUMsUUFBQUEsSUFBQSxFQUFBLENBSEE7QUFJQUMsUUFBQUEsS0FBQSxFQUFBeEQsT0FBQSxDQUFBYSxPQUpBO0FBS0E0QyxRQUFBQSxNQUFBLEVBQUF6RCxPQUFBLENBQUFjLFFBTEE7QUFNQTRDLFFBQUFBLE1BQUEsRUFBQTtBQU5BLE9BQUE7QUFTQU4sTUFBQUEsS0FBQSxDQUFBTyxRQUFBLEdBQUF4QyxLQUFBLEdBQUEsVUFBQSxHQUFBLE9BQUE7O0FBRUEsVUFBQW5CLE9BQUEsQ0FBQWUsUUFBQSxFQUFBO0FBQ0EsWUFBQTZDLElBQUEsR0FBQTVELE9BQUEsQ0FBQWdCLGFBQUEsR0FBQW5DLENBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQWdGLFFBQUEsQ0FBQWhGLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxHQUFBQSxDQUFBLENBQUEsYUFBQSxDQUFBLENBQUFpRixTQUFBLENBQUFqRixDQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7QUFDQXVFLFFBQUFBLEtBQUEsQ0FBQVcsZ0JBQUEsR0FBQSxRQUFBO0FBQ0FYLFFBQUFBLEtBQUEsQ0FBQVksZUFBQSxHQUFBLFVBQUFiLE1BQUEsR0FBQSxJQUFBO0FBQ0EsT0FKQSxNQUtBO0FBQ0EsWUFBQVMsSUFBQSxHQUFBNUQsT0FBQSxDQUFBZ0IsYUFBQSxHQUFBbkMsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBZ0YsUUFBQSxDQUFBaEYsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQWlGLFNBQUEsQ0FBQWpGLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTtBQUNBK0UsUUFBQUEsSUFBQSxDQUFBL0ksSUFBQSxDQUFBLEtBQUEsRUFBQXNJLE1BQUE7QUFDQTs7QUFHQVMsTUFBQUEsSUFBQSxDQUFBZCxHQUFBLENBQUFNLEtBQUE7QUFFQTFCLE1BQUFBLGNBQUEsR0FBQSxJQUFBO0FBRUEsYUFBQWtDLElBQUE7QUFDQSxLQWpLQSxDQXNLQTs7O0FBRUEsYUFBQWIsV0FBQSxHQUFBO0FBRUE7QUFFQSxVQUFBL0MsT0FBQSxDQUFBQyxjQUFBLEVBQUE7QUFDQTBCLFFBQUFBLFNBQUEsR0FBQUYsSUFBQSxDQUFBZ0MsTUFBQSxFQUFBO0FBQ0E3QixRQUFBQSxZQUFBLEdBQUFKLE9BQUEsQ0FBQWlDLE1BQUEsRUFBQTtBQUNBNUIsUUFBQUEsU0FBQSxHQUFBTixTQUFBLENBQUFrQyxNQUFBLEVBQUE7QUFFQTNCLFFBQUFBLFlBQUEsR0FBQSxDQUFBOUIsT0FBQSxDQUFBaUIsY0FBQSxJQUFBVSxTQUFBLElBQUFDLFlBQUEsQ0FMQSxDQU9BOztBQUNBLFlBQUFFLFlBQUEsR0FBQSxDQUFBLEVBQUE7QUFDQSxjQUFBOUIsT0FBQSxDQUFBRSxXQUFBLEVBQUE0QixZQUFBLEdBQUFGLFlBQUEsR0FBQUQsU0FBQSxDQUFBLEtBQ0FHLFlBQUEsR0FBQTlCLE9BQUEsQ0FBQUssZ0JBQUEsR0FBQXVCLFlBQUEsR0FBQUssV0FBQSxHQUFBTixTQUFBLEdBQUFNLFdBQUE7QUFFQUMsVUFBQUEsWUFBQSxHQUFBLElBQUE7QUFDQTs7QUFFQSxZQUFBZixLQUFBLElBQUEsQ0FBQVksVUFBQSxFQUFBQSxVQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUFGLFNBQUEsR0FBQUYsU0FBQSxDQUFBO0FBRUEsWUFBQTNCLE9BQUEsQ0FBQUksTUFBQSxFQUFBNEIsU0FBQSxHQUFBOUUsUUFBQSxDQUFBcUUsU0FBQSxDQUFBOUIsU0FBQSxNQUFBeUMsWUFBQSxHQUFBTixZQUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBO0FBQ0EsT0F0QkEsQ0F3QkE7OztBQUVBLFVBQUEzQixPQUFBLENBQUFNLGdCQUFBLEVBQUE7QUFDQThCLFFBQUFBLFFBQUEsR0FBQVgsSUFBQSxDQUFBK0IsS0FBQSxFQUFBO0FBQ0FuQixRQUFBQSxXQUFBLEdBQUFiLE9BQUEsQ0FBQWdDLEtBQUEsRUFBQTtBQUNBbEIsUUFBQUEsUUFBQSxHQUFBZixTQUFBLENBQUFpQyxLQUFBLEVBQUE7QUFFQWpCLFFBQUFBLGFBQUEsR0FBQSxDQUFBdkMsT0FBQSxDQUFBa0IsYUFBQSxJQUFBa0IsUUFBQSxJQUFBQyxXQUFBLENBTEEsQ0FPQTs7QUFDQSxZQUFBRSxhQUFBLEdBQUEsQ0FBQSxFQUFBO0FBQ0FBLFVBQUFBLGFBQUEsR0FBQXZDLE9BQUEsQ0FBQU8sWUFBQSxHQUFBOEIsV0FBQSxHQUFBRCxRQUFBLEdBQUFwQyxPQUFBLENBQUFVLGlCQUFBLEdBQUEyQixXQUFBLEdBQUFLLFlBQUEsR0FBQU4sUUFBQSxHQUFBTSxZQUFBO0FBRUFDLFVBQUFBLGFBQUEsR0FBQSxJQUFBO0FBQ0E7O0FBRUEsWUFBQXhCLEtBQUEsSUFBQSxDQUFBcUIsV0FBQSxFQUFBQSxXQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUFGLFFBQUEsR0FBQUYsUUFBQSxDQUFBO0FBRUEsWUFBQXBDLE9BQUEsQ0FBQVMsT0FBQSxFQUFBZ0MsVUFBQSxHQUFBdkYsUUFBQSxDQUFBcUUsU0FBQSxDQUFBMEMsVUFBQSxNQUFBdEIsYUFBQSxHQUFBTixXQUFBLEdBQUFELFFBQUEsQ0FBQSxDQUFBO0FBQ0EsT0EzQ0EsQ0E2Q0E7OztBQUNBYSxNQUFBQSxHQUFBO0FBQ0EsS0F2TkEsQ0EyTkE7OztBQUVBLGFBQUFBLEdBQUEsR0FBQTtBQUVBO0FBQ0F4QixNQUFBQSxJQUFBLENBQUF5QyxLQUFBLENBQUEsRUFBQTtBQUVBLFVBQUFDLE1BQUEsR0FBQSxFQUFBLENBTEEsQ0FRQTs7QUFDQSxVQUFBbkUsT0FBQSxDQUFBQyxjQUFBLEVBQUE7QUFFQSxZQUFBbUUsTUFBQSxHQUFBQyxhQUFBLENBQUEsSUFBQSxDQUFBO0FBRUFGLFFBQUFBLE1BQUEsQ0FBQWIsR0FBQSxHQUFBYyxNQUFBO0FBQ0EsT0FkQSxDQWlCQTs7O0FBQ0EsVUFBQXBFLE9BQUEsQ0FBQU0sZ0JBQUEsRUFBQTtBQUVBLFlBQUFnRSxPQUFBLEdBQUFELGFBQUEsQ0FBQSxLQUFBLENBQUE7QUFFQUYsUUFBQUEsTUFBQSxDQUFBWixJQUFBLEdBQUFlLE9BQUE7QUFDQSxPQXZCQSxDQXlCQTs7O0FBQ0EsVUFBQSxDQUFBekYsQ0FBQSxDQUFBdUMsT0FBQSxDQUFBQyxJQUFBLEtBQUE1RCxJQUFBLENBQUE4RyxHQUFBLENBQUFwQyxTQUFBLEdBQUFpQyxNQUFBLElBQUEsR0FBQSxJQUFBM0csSUFBQSxDQUFBOEcsR0FBQSxDQUFBM0IsVUFBQSxHQUFBMEIsT0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBN0MsSUFBQSxDQUFBK0MsT0FBQSxDQUFBTCxNQUFBLEVBQUEsRUFBQSxFQUFBLEtBQ0ExQyxJQUFBLENBQUFxQixHQUFBLENBQUFxQixNQUFBO0FBRUFoQyxNQUFBQSxTQUFBLEdBQUFpQyxNQUFBO0FBQ0F4QixNQUFBQSxVQUFBLEdBQUEwQixPQUFBO0FBRUEsS0E3UEEsQ0FpUUE7OztBQUVBLGFBQUFELGFBQUEsQ0FBQUksUUFBQSxFQUFBO0FBQ0E7QUFDQSxVQUFBQSxRQUFBLEVBQUE7QUFDQSxZQUFBQyxNQUFBLEdBQUFuRCxTQUFBLENBQUE5QixTQUFBLEVBQUE7QUFDQSxZQUFBa0YsT0FBQSxHQUFBOUMsU0FBQTtBQUNBLFlBQUErQyxVQUFBLEdBQUFoRCxZQUFBO0FBQ0EsWUFBQWlELE9BQUEsR0FBQWxELFNBQUE7QUFFQSxZQUFBbUQsYUFBQSxHQUFBaEQsWUFBQTtBQUVBLFlBQUFpRCxVQUFBLEdBQUEvQyxTQUFBO0FBQ0EsWUFBQWdELFlBQUEsR0FBQS9DLFdBQUE7QUFDQSxZQUFBNkMsYUFBQSxHQUFBaEQsWUFBQTtBQUNBLFlBQUFtRCxhQUFBLEdBQUEvQyxZQUFBO0FBQ0EsWUFBQWdELFdBQUEsR0FBQW5ELFVBQUE7QUFFQSxZQUFBaEQsSUFBQSxHQUFBO0FBQ0FzQixVQUFBQSxnQkFBQSxFQUFBTCxPQUFBLENBQUFLLGdCQURBO0FBRUFILFVBQUFBLFdBQUEsRUFBQUYsT0FBQSxDQUFBRSxXQUZBO0FBR0FFLFVBQUFBLE1BQUEsRUFBQUosT0FBQSxDQUFBSSxNQUhBO0FBSUFELFVBQUFBLGlCQUFBLEVBQUFILE9BQUEsQ0FBQUc7QUFKQSxTQUFBO0FBTUEsT0FwQkEsTUFxQkE7QUFDQSxZQUFBdUUsTUFBQSxHQUFBbkQsU0FBQSxDQUFBMEMsVUFBQSxFQUFBO0FBQ0EsWUFBQVUsT0FBQSxHQUFBckMsUUFBQTtBQUNBLFlBQUFzQyxVQUFBLEdBQUF2QyxXQUFBO0FBQ0EsWUFBQXdDLE9BQUEsR0FBQXpDLFFBQUE7QUFFQSxZQUFBMkMsVUFBQSxHQUFBdEMsVUFBQTtBQUNBLFlBQUF1QyxZQUFBLEdBQUF0QyxZQUFBO0FBQ0EsWUFBQW9DLGFBQUEsR0FBQXZDLGFBQUE7QUFDQSxZQUFBMEMsYUFBQSxHQUFBdEMsYUFBQTtBQUNBLFlBQUF1QyxXQUFBLEdBQUExQyxXQUFBO0FBRUEsWUFBQXpELElBQUEsR0FBQTtBQUNBc0IsVUFBQUEsZ0JBQUEsRUFBQUwsT0FBQSxDQUFBVSxpQkFEQTtBQUVBUixVQUFBQSxXQUFBLEVBQUFGLE9BQUEsQ0FBQU8sWUFGQTtBQUdBSCxVQUFBQSxNQUFBLEVBQUFKLE9BQUEsQ0FBQVMsT0FIQTtBQUlBTixVQUFBQSxpQkFBQSxFQUFBSCxPQUFBLENBQUFRO0FBSkEsU0FBQTtBQU1BO0FBRUE7OztBQUVBLFVBQUF6QixJQUFBLENBQUFtQixXQUFBLEVBQUE7QUFDQSxZQUFBaUYsSUFBQSxHQUFBVCxNQUFBLEdBQUEzRixJQUFBLENBQUFtQixXQUFBLENBREEsQ0FHQTs7QUFDQWlGLFFBQUFBLElBQUEsSUFBQUwsYUFBQSxHQUFBQyxVQUFBO0FBQ0E7QUFFQTtBQVBBLFdBU0E7QUFDQTtBQUNBLGNBQUFLLGFBQUEsR0FBQVYsTUFBQSxJQUFBQyxPQUFBLEdBQUFDLFVBQUEsQ0FBQTtBQUVBOzs7Ozs7QUFNQSxjQUFBTyxJQUFBLEdBQUFDLGFBQUEsR0FBQU4sYUFBQTtBQUNBLFNBakVBLENBbUVBOzs7QUFDQSxVQUFBLENBQUEvRixJQUFBLENBQUFzQixnQkFBQSxFQUFBOEUsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQXBFQSxDQXNFQTs7QUFDQUEsTUFBQUEsSUFBQSxJQUFBSCxZQUFBLENBdkVBLENBeUVBOztBQUNBLFVBQUFqRyxJQUFBLENBQUFtQixXQUFBLEVBQUFpRixJQUFBLEdBQUFFLFNBQUEsQ0FBQUYsSUFBQSxFQUFBVixRQUFBLEVBQUExRixJQUFBLEVBQUErRixhQUFBLEVBQUFHLGFBQUEsQ0FBQSxDQTFFQSxDQTZFQTs7QUFDQSxVQUFBQSxhQUFBLElBQUFsRyxJQUFBLENBQUFtQixXQUFBLElBQUFuQixJQUFBLENBQUFxQixNQUFBLEVBQUErRSxJQUFBLElBQUFQLFVBQUEsR0FBQUMsT0FBQTs7QUFFQSxVQUFBMUQsS0FBQSxFQUFBO0FBQ0E7QUFDQWdFLFFBQUFBLElBQUEsSUFBQVQsTUFBQTtBQUNBUyxRQUFBQSxJQUFBLEdBQUExSCxJQUFBLENBQUFpQyxHQUFBLENBQUF4QyxRQUFBLENBQUFpSSxJQUFBLENBQUEsRUFBQWpJLFFBQUEsQ0FBQWdJLFdBQUEsQ0FBQSxDQUFBO0FBQ0E7O0FBRUEsYUFBQUMsSUFBQTtBQUNBLEtBMVZBLENBOFZBOzs7QUFFQSxhQUFBRSxTQUFBLENBQUFGLElBQUEsRUFBQVYsUUFBQSxFQUFBMUYsSUFBQSxFQUFBK0MsWUFBQSxFQUFBSSxZQUFBLEVBQUE7QUFFQTtBQUNBLFVBQUEsQ0FBQW5ELElBQUEsQ0FBQXFCLE1BQUEsRUFBQTtBQUNBLFlBQUFyQixJQUFBLENBQUFvQixpQkFBQSxFQUFBO0FBQ0EsY0FBQStCLFlBQUEsRUFBQTtBQUNBLGdCQUFBaUQsSUFBQSxHQUFBLENBQUEsRUFBQUEsSUFBQSxHQUFBLENBQUE7QUFDQSxnQkFBQUEsSUFBQSxHQUFBckQsWUFBQSxFQUFBcUQsSUFBQSxHQUFBckQsWUFBQTtBQUNBLFdBSEEsTUFJQTtBQUNBLGdCQUFBcUQsSUFBQSxHQUFBLENBQUEsRUFBQUEsSUFBQSxHQUFBLENBQUE7QUFDQSxnQkFBQSxDQUFBLENBQUEsR0FBQUEsSUFBQSxHQUFBckQsWUFBQSxFQUFBcUQsSUFBQSxHQUFBLENBQUEsQ0FBQSxHQUFBckQsWUFBQTtBQUNBO0FBQ0E7QUFDQSxPQVhBLENBYUE7QUFiQSxXQWNBO0FBQ0EsaUJBQUFxRCxJQUFBLEdBQUFyRCxZQUFBLEVBQUE7QUFDQXFELFlBQUFBLElBQUEsSUFBQXJELFlBQUE7QUFFQSxnQkFBQXdELGVBQUEsR0FBQXZHLElBQUEsQ0FBQXNCLGdCQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUVBLGdCQUFBb0UsUUFBQSxFQUFBekMsU0FBQSxJQUFBc0QsZUFBQSxDQUFBLEtBQ0E3QyxVQUFBLElBQUE2QyxlQUFBO0FBQ0E7O0FBRUEsaUJBQUFILElBQUEsSUFBQXBHLElBQUEsQ0FBQXNCLGdCQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQThFLFlBQUFBLElBQUEsSUFBQXJELFlBQUE7QUFFQSxnQkFBQXdELGVBQUEsR0FBQXZHLElBQUEsQ0FBQXNCLGdCQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUVBLGdCQUFBb0UsUUFBQSxFQUFBekMsU0FBQSxJQUFBc0QsZUFBQSxDQUFBLEtBQ0E3QyxVQUFBLElBQUE2QyxlQUFBO0FBQ0E7QUFDQTs7QUFFQSxhQUFBSCxJQUFBO0FBQ0E7QUFDQSxHQXhZQTs7QUEwWUF0RyxFQUFBQSxDQUFBLENBQUFYLEVBQUEsQ0FBQTRCLGlCQUFBLEdBQUEsVUFBQUUsT0FBQSxFQUNBO0FBRUEsU0FBQTdCLElBQUEsQ0FBQSxZQUNBO0FBQ0EsVUFBQVUsQ0FBQSxDQUFBaUIsaUJBQUEsQ0FBQSxJQUFBLEVBQUFFLE9BQUE7QUFDQSxLQUhBO0FBTUEsV0FBQSxJQUFBO0FBQ0EsR0FWQTtBQVdBLENBdlpBLEVBdVpBdEIsTUF2WkE7O0FDbkNBOztBQUFBLENBQUEsVUFBQUcsQ0FBQSxFQUFBO0FBQ0FBLEVBQUFBLENBQUEsQ0FBQVgsRUFBQSxDQUFBcUgsUUFBQSxHQUFBLFVBQUFDLE1BQUEsRUFBQXpHLElBQUEsRUFBQTtBQUNBeUcsSUFBQUEsTUFBQSxHQUFBQSxNQUFBLEdBQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ0EsUUFBQUMsYUFBQSxHQUFBLENBQUE7QUFDQSxRQUFBQyxRQUFBLEdBQUEsQ0FDQSx5QkFEQSxFQUVBLDJCQUZBLEVBR0EsMEJBSEEsRUFJQSxvQ0FKQSxFQUtBLHdEQUxBLEVBTUEsV0FOQSxFQU9BLHdCQVBBLEVBUUEsZ0RBUkEsRUFTQSxXQVRBLEVBVUEsdURBVkEsRUFXQSxtREFYQSxFQVlBLFVBWkEsRUFhQSx3Q0FiQSxFQWNBO0FBQ0E7QUFDQTtBQUNBLGFBakJBLEVBa0JBLFFBbEJBLEVBbUJBQyxJQW5CQSxDQW1CQSxFQW5CQSxDQUFBO0FBb0JBLFFBQUFDLEtBQUEsRUFBQUMsTUFBQSxFQUFBQyxJQUFBLEVBQUFDLEtBQUE7QUFDQSxRQUFBbk8sTUFBQSxHQUFBaUgsQ0FBQSxDQUFBaEgsTUFBQSxDQUFBO0FBQ0FtTyxNQUFBQSxLQUFBLEVBQUE7QUFEQSxLQUFBLEVBRUFqSCxJQUZBLENBQUE7O0FBSUEsYUFBQTlHLElBQUEsQ0FBQWlILEdBQUEsRUFBQTtBQUNBTCxNQUFBQSxDQUFBLENBQUE2RyxRQUFBLENBQUEsQ0FBQTdCLFFBQUEsQ0FBQSxNQUFBO0FBQ0ErQixNQUFBQSxLQUFBLEdBQUExRyxHQUFBLENBQUFsQixJQUFBLENBQUEsWUFBQSxDQUFBO0FBQ0E2SCxNQUFBQSxNQUFBLEdBQUFELEtBQUEsQ0FBQTVILElBQUEsQ0FBQSxXQUFBLENBQUE7QUFDQThILE1BQUFBLElBQUEsR0FBQUYsS0FBQSxDQUFBNUgsSUFBQSxDQUFBLFNBQUEsQ0FBQTtBQUNBK0gsTUFBQUEsS0FBQSxHQUFBSCxLQUFBLENBQUE1SCxJQUFBLENBQUEsVUFBQSxDQUFBO0FBQ0EsYUFBQSxJQUFBaUksT0FBQSxDQUFBLFVBQUFDLE9BQUEsRUFBQUMsTUFBQSxFQUFBO0FBQ0EsWUFBQSxDQUFBdk8sTUFBQSxDQUFBb08sS0FBQSxFQUFBO0FBQ0EsY0FBQTlCLEtBQUEsR0FBQSxJQUFBa0MsUUFBQSxDQUFBQyxTQUFBLEVBQUE7QUFDQW5DLFVBQUFBLEtBQUEsQ0FBQW9DLGlCQUFBLENBQUEsR0FBQTtBQUNBLGNBQUFDLFNBQUEsR0FBQSxFQUFBO0FBQ0FySCxVQUFBQSxHQUFBLENBQUFsQixJQUFBLENBQUEsS0FBQSxFQUFBRyxJQUFBLENBQUEsVUFBQS9CLENBQUEsRUFBQTtBQUNBbUssWUFBQUEsU0FBQSxDQUFBQyxJQUFBLENBQUE7QUFDQUMsY0FBQUEsRUFBQSxFQUFBckssQ0FEQTtBQUVBc0ssY0FBQUEsR0FBQSxFQUFBN0gsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBaEUsSUFBQSxDQUFBLEtBQUE7QUFGQSxhQUFBO0FBSUEsV0FMQTtBQU1BcUosVUFBQUEsS0FBQSxDQUFBeUMsWUFBQSxDQUFBSixTQUFBOztBQUVBLGNBQUFLLGNBQUEsR0FBQSxTQUFBQSxjQUFBLEdBQUE7QUFFQS9ILFlBQUFBLENBQUEsQ0FBQUYsTUFBQSxDQUFBLENBQUFrSSxPQUFBLENBQUEsZUFBQTtBQUNBaEksWUFBQUEsQ0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBaUUsR0FBQSxDQUFBO0FBQUEsNEJBQUE7QUFBQSxhQUFBO0FBQ0FnRSxZQUFBQSxRQUFBLENBQUFDLE1BQUEsQ0FBQW5CLEtBQUEsRUFBQSxHQUFBLEVBQUE7QUFBQW9CLGNBQUFBLE9BQUEsRUFBQTtBQUFBLGFBQUEsRUFBQTtBQUNBQyxjQUFBQSxLQUFBLEVBQUEsRUFEQTtBQUVBRCxjQUFBQSxPQUFBLEVBQUEsQ0FGQTtBQUVBRSxjQUFBQSxJQUFBLEVBQUFDLE1BQUEsQ0FBQUMsT0FGQTtBQUVBQyxjQUFBQSxVQUFBLEVBQUEsc0JBQUE7QUFDQXpCLGdCQUFBQSxLQUFBLENBQUF2SSxNQUFBO0FBQ0E2SSxnQkFBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQTtBQUNBO0FBTEEsYUFBQTs7QUFPQSxnQkFBQXZILE1BQUEsQ0FBQTJJLFFBQUEsQ0FBQUMsSUFBQSxFQUFBO0FBQ0FDLGNBQUFBLFVBQUEsQ0FBQSxZQUFBO0FBQ0EzSSxnQkFBQUEsQ0FBQSxDQUFBLFlBQUEsQ0FBQSxDQUFBMkYsT0FBQSxDQUFBO0FBQUEvRSxrQkFBQUEsU0FBQSxFQUFBWixDQUFBLENBQUFGLE1BQUEsQ0FBQTJJLFFBQUEsQ0FBQUMsSUFBQSxDQUFBLENBQUE3QyxNQUFBLEdBQUFwQjtBQUFBLGlCQUFBLEVBQUEsR0FBQTtBQUNBLGVBRkEsRUFFQSxJQUZBLENBQUE7QUFHQTtBQUNBLFdBaEJBOztBQWtCQVksVUFBQUEsS0FBQSxDQUFBakksRUFBQSxDQUFBLFVBQUEsRUFBQSxZQUFBO0FBQ0EsZ0JBQUF3TCxTQUFBLEdBQUFoSyxJQUFBLENBQUFpSyxHQUFBLENBQUFqSyxJQUFBLENBQUFrSyxJQUFBLENBQUF6RCxLQUFBLENBQUEwRCxRQUFBLEdBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBO0FBQ0EvQixZQUFBQSxNQUFBLENBQUFnQyxJQUFBLENBQUFKLFNBQUEsR0FBQSxHQUFBO0FBRUEzQixZQUFBQSxJQUFBLENBQUFoRCxHQUFBLENBQUE7QUFDQSwyQkFBQSxrQkFBQSxNQUFBMkUsU0FBQSxJQUFBO0FBREEsYUFBQTtBQUlBMUIsWUFBQUEsS0FBQSxDQUFBakQsR0FBQSxDQUFBO0FBQ0EsMkJBQUEsaUJBQUEsTUFBQTJFLFNBQUEsSUFBQTtBQURBLGFBQUE7QUFHQSxXQVhBO0FBYUF2RCxVQUFBQSxLQUFBLENBQUFqSSxFQUFBLENBQUEsVUFBQSxFQUFBMkssY0FBQSxFQUFBLElBQUE7QUFDQSxTQTVDQSxNQTZDQTtBQUNBVixVQUFBQSxPQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0E7QUFDQSxPQWpEQSxDQUFBO0FBa0RBOztBQUNBLFFBQUFWLE1BQUEsSUFBQSxNQUFBLEVBQUE7QUFDQSxhQUFBdk4sSUFBQSxDQUFBNEcsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQ0E7O0FBQ0EsUUFBQTJHLE1BQUEsSUFBQSxPQUFBLEVBQUE7QUFDQUksTUFBQUEsS0FBQSxHQUFBL0csQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBYixJQUFBLENBQUEsWUFBQSxDQUFBO0FBQ0E2SCxNQUFBQSxNQUFBLEdBQUFELEtBQUEsQ0FBQTVILElBQUEsQ0FBQSxXQUFBLENBQUE7QUFDQThILE1BQUFBLElBQUEsR0FBQUYsS0FBQSxDQUFBNUgsSUFBQSxDQUFBLFNBQUEsQ0FBQTtBQUNBNkgsTUFBQUEsTUFBQSxDQUFBZ0MsSUFBQSxDQUFBLE1BQUEsRUFKQSxDQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQWYsTUFBQUEsUUFBQSxDQUFBQyxNQUFBLENBQUFuQixLQUFBLEVBQUEsR0FBQSxFQUFBO0FBQUFvQixRQUFBQSxPQUFBLEVBQUE7QUFBQSxPQUFBLEVBQUE7QUFDQUMsUUFBQUEsS0FBQSxFQUFBLEVBREE7QUFFQUQsUUFBQUEsT0FBQSxFQUFBLENBRkE7QUFFQUUsUUFBQUEsSUFBQSxFQUFBQyxNQUFBLENBQUFDLE9BRkE7QUFFQUMsUUFBQUEsVUFBQSxFQUFBLHNCQUFBO0FBQ0F6QixVQUFBQSxLQUFBLENBQUF2SSxNQUFBO0FBQ0E7QUFKQSxPQUFBO0FBTUE7QUFDQSxHQTFHQTtBQTJHQSxDQTVHQSxFQTRHQXFCLE1BNUdBOztBQ0FBOztBQUFBLENBQUEsVUFBQW9KLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUFELEVBQUFBLENBQUEsQ0FBQSxZQUFBO0FBQUE7O0FBQUEsYUFBQUUsQ0FBQSxDQUFBQyxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLGFBQUEsUUFBQUQsQ0FBQSxJQUFBLFFBQUFDLENBQUEsSUFBQUQsQ0FBQSxDQUFBdE4sV0FBQSxPQUFBdU4sQ0FBQSxDQUFBdk4sV0FBQSxFQUFBO0FBQUE7O0FBQUEsYUFBQXdOLENBQUEsQ0FBQUYsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQSxVQUFBRSxDQUFBO0FBQUEsVUFBQUMsQ0FBQTtBQUFBLFVBQUFDLENBQUEsR0FBQUwsQ0FBQSxDQUFBaE8sTUFBQTtBQUFBLFVBQUEsQ0FBQXFPLENBQUEsSUFBQSxDQUFBSixDQUFBLEVBQUEsT0FBQSxDQUFBLENBQUE7O0FBQUEsV0FBQUUsQ0FBQSxHQUFBRixDQUFBLENBQUF2TixXQUFBLEVBQUEsRUFBQTBOLENBQUEsR0FBQSxDQUFBLEVBQUFBLENBQUEsR0FBQUMsQ0FBQSxFQUFBLEVBQUFELENBQUE7QUFBQSxZQUFBRCxDQUFBLEtBQUFILENBQUEsQ0FBQUksQ0FBQSxDQUFBLENBQUExTixXQUFBLEVBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQTROLENBQUEsQ0FBQU4sQ0FBQSxFQUFBO0FBQUEsV0FBQSxJQUFBQyxDQUFBLElBQUFELENBQUE7QUFBQU8sUUFBQUEsQ0FBQSxDQUFBbEssSUFBQSxDQUFBMkosQ0FBQSxFQUFBQyxDQUFBLE1BQUFELENBQUEsQ0FBQUMsQ0FBQSxDQUFBLEdBQUEsSUFBQU8sTUFBQSxDQUFBUixDQUFBLENBQUFDLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQTtBQUFBO0FBQUE7O0FBQUEsYUFBQVEsQ0FBQSxDQUFBVCxDQUFBLEVBQUE7QUFBQSxhQUFBLENBQUFBLENBQUEsSUFBQSxFQUFBLEVBQUFVLE1BQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQUMsQ0FBQSxDQUFBWCxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFdBQUFXLEVBQUEsR0FBQUgsQ0FBQSxDQUFBVCxDQUFBLENBQUEsRUFBQSxLQUFBYSxNQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUFDLGFBQUEsR0FBQWIsQ0FBQSxJQUFBLEdBQUE7QUFBQTs7QUFBQSxRQUFBYyxDQUFBLEdBQUE7QUFBQUMsTUFBQUEsaUJBQUEsRUFBQTtBQUFBQyxRQUFBQSxNQUFBLEVBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLHlCQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxpQ0FBQTtBQUFBQyxVQUFBQSxHQUFBLEVBQUEsNFJBQUE7QUFBQUMsVUFBQUEsS0FBQSxFQUFBLGdGQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSw0R0FBQTtBQUFBQyxVQUFBQSxRQUFBLEVBQUEsK3FCQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSw4eUtBQUE7QUFBQUMsVUFBQUEsRUFBQSxFQUFBLG1oQkFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsNEhBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLDhCQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxrQkFBQTtBQUFBQyxVQUFBQSxRQUFBLEVBQUEsK0dBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLGlCQUFBO0FBQUFDLFVBQUFBLEtBQUEsRUFBQSwyR0FBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEsd2FBQUE7QUFBQUMsVUFBQUEsR0FBQSxFQUFBLG1IQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSw0T0FBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEscUNBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLHFIQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSxpRUFBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEsU0FBQTtBQUFBQyxVQUFBQSxRQUFBLEVBQUEsdUJBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLE1BQUE7QUFBQUMsVUFBQUEsR0FBQSxFQUFBLEtBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBO0FBQUEsU0FBQTtBQUFBQyxRQUFBQSxPQUFBLEVBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLG1CQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSw4QkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsa0JBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLHN2REFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsdU5BQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDJDQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSw0RkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsc2JBQUE7QUFBQUMsVUFBQUEsZ0JBQUEsRUFBQSxxQkFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsa0ZBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLGtHQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxzR0FBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsa09BQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLHlHQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSw4RUFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsb0RBQUE7QUFBQUMsVUFBQUEsZUFBQSxFQUFBLCtaQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSwyUUFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsdURBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGdmQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSw0REFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsMkdBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGtEQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxTQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSw2Q0FBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsaURBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDBFQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxpTEFBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsb0VBQUE7QUFBQUMsVUFBQUEsZ0JBQUEsRUFBQSxZQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSw0UkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsc0ZBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGdGQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSx5S0FBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEseVFBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLDZJQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSx3RUFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsd0RBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLGtCQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSxzS0FBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsOEhBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLG1CQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxnQkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsZ0NBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGtDQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxnREFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsaUNBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGtCQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSx1REFBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEseUVBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLHltQkFBQTtBQUFBQyxVQUFBQSxpQkFBQSxFQUFBLDhCQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSwwR0FBQTtBQUFBQyxVQUFBQSxlQUFBLEVBQUEsNEdBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLGdJQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSxvSUFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHdFQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxpRUFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsa0ZBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDJYQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSx3R0FBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsMFVBQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLDhCQUFBO0FBQUFDLFVBQUFBLGlCQUFBLEVBQUEsMFVBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDRJQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSwySEFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsd0JBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLDZEQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSwrR0FBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsbUNBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHFDQUFBO0FBQUFDLFVBQUFBLGNBQUEsRUFBQSx1Y0FBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEsaVJBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLCtRQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSw4QkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsaURBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHdEQUFBO0FBQUFDLFVBQUFBLGdCQUFBLEVBQUEsMENBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLDBFQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxpQkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsaUNBQUE7QUFBQUMsVUFBQUEsZ0JBQUEsRUFBQSwrQkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsZ0JBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLG9DQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSxxQkFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsdU9BQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHVmQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxvQkFBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEseVZBQUE7QUFBQUMsVUFBQUEsZUFBQSxFQUFBLDBHQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSwrQ0FBQTtBQUFBQyxVQUFBQSxVQUFBLEVBQUEsc0hBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGFBQUE7QUFBQUMsVUFBQUEsYUFBQSxFQUFBLGdLQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSx5NEJBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLHVUQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxXQUFBO0FBQUFDLFVBQUFBLGVBQUEsRUFBQSxnQ0FBQTtBQUFBQyxVQUFBQSxXQUFBLEVBQUEsbUdBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLHFGQUFBO0FBQUFDLFVBQUFBLFVBQUEsRUFBQSxnREFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsaUVBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLDRRQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxzRkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEseVJBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLGtGQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSwrQkFBQTtBQUFBQyxVQUFBQSxZQUFBLEVBQUEsOEJBQUE7QUFBQUMsVUFBQUEsVUFBQSxFQUFBLGdHQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSw4SUFBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsa0JBQUE7QUFBQUMsVUFBQUEsZ0JBQUEsRUFBQSxZQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxpQkFBQTtBQUFBQyxVQUFBQSxhQUFBLEVBQUEscUJBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLG1CQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQSxRQUFBO0FBQUFDLFVBQUFBLGFBQUEsRUFBQTtBQUFBLFNBQUE7QUFBQUMsUUFBQUEsR0FBQSxFQUFBO0FBQUFDLFVBQUFBLFNBQUEsRUFBQSxTQUFBO0FBQUFDLFVBQUFBLFlBQUEsRUFBQSxxQ0FBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsd0RBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLHVEQUFBO0FBQUFDLFVBQUFBLGVBQUEsRUFBQSxnR0FBQTtBQUFBQyxVQUFBQSxjQUFBLEVBQUEsZ0hBQUE7QUFBQUMsVUFBQUEsR0FBQSxFQUFBLGtEQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxPQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxPQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSw2QkFBQTtBQUFBQyxVQUFBQSxLQUFBLEVBQUEsYUFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsWUFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUE7QUFBQSxTQUFBO0FBQUFDLFFBQUFBLEdBQUEsRUFBQTtBQUFBQyxVQUFBQSxNQUFBLEVBQUEsb0RBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQUMsVUFBQUEsS0FBQSxFQUFBLDBFQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxTQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSw0QkFBQTtBQUFBQyxVQUFBQSxFQUFBLEVBQUEscUJBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLHNFQUFBO0FBQUFDLFVBQUFBLElBQUEsRUFBQSxNQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSxVQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxRQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxxREFBQTtBQUFBQyxVQUFBQSxTQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsV0FBQSxFQUFBLGFBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGNBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLGNBQUE7QUFBQUMsVUFBQUEsTUFBQSxFQUFBLFFBQUE7QUFBQUMsVUFBQUEsT0FBQSxFQUFBLGVBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLE9BQUE7QUFBQUMsVUFBQUEsUUFBQSxFQUFBLFlBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHFJQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQTtBQUFBLFNBQUE7QUFBQUMsUUFBQUEsS0FBQSxFQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxjQUFBO0FBQUFDLFVBQUFBLEtBQUEsRUFBQSxhQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxlQUFBO0FBQUFDLFVBQUFBLFFBQUEsRUFBQSxnQkFBQTtBQUFBOUosVUFBQUEsSUFBQSxFQUFBLHVCQUFBO0FBQUExQixVQUFBQSxNQUFBLEVBQUEseUJBQUE7QUFBQXlMLFVBQUFBLElBQUEsRUFBQSx1QkFBQTtBQUFBM0osVUFBQUEsTUFBQSxFQUFBLGNBQUE7QUFBQWlJLFVBQUFBLE1BQUEsRUFBQSxDQUFBLGNBQUEsRUFBQSxhQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEyQixVQUFBQSxLQUFBLEVBQUEsQ0FBQSxhQUFBLENBQUE7QUFBQTFCLFVBQUFBLE1BQUEsRUFBQSxjQUFBO0FBQUFLLFVBQUFBLE9BQUEsRUFBQSxDQUFBLGVBQUEsRUFBQSxhQUFBLENBQUE7QUFBQXNCLFVBQUFBLE1BQUEsRUFBQSxjQUFBO0FBQUF4QixVQUFBQSxJQUFBLEVBQUEsWUFBQTtBQUFBQyxVQUFBQSxFQUFBLEVBQUEsQ0FBQSxpQkFBQSxFQUFBLGdCQUFBLEVBQUEsYUFBQSxFQUFBLDRCQUFBLENBQUE7QUFBQWEsVUFBQUEsUUFBQSxFQUFBLGdCQUFBO0FBQUFXLFVBQUFBLFlBQUEsRUFBQSxvQkFBQTtBQUFBM0IsVUFBQUEsS0FBQSxFQUFBLENBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQUEsZUFBQSxDQUFBO0FBQUEsd0JBQUEsa0JBQUE7QUFBQSx3QkFBQSxlQUFBO0FBQUFTLFVBQUFBLFNBQUEsRUFBQSxDQUFBLFlBQUEsRUFBQSxtQkFBQSxDQUFBO0FBQUFtQixVQUFBQSxVQUFBLEVBQUEsa0JBQUE7QUFBQUMsVUFBQUEsY0FBQSxFQUFBLHNCQUFBO0FBQUFuQixVQUFBQSxXQUFBLEVBQUEsbUJBQUE7QUFBQUMsVUFBQUEsWUFBQSxFQUFBLG9CQUFBO0FBQUFtQixVQUFBQSxjQUFBLEVBQUEsc0JBQUE7QUFBQUMsVUFBQUEsSUFBQSxFQUFBLFlBQUE7QUFBQXZCLFVBQUFBLE1BQUEsRUFBQSxDQUFBLGVBQUEsRUFBQSxjQUFBLENBQUE7QUFBQVAsVUFBQUEsT0FBQSxFQUFBLGVBQUE7QUFBQStCLFVBQUFBLEtBQUEsRUFBQSxhQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxpQkFBQTtBQUFBZixVQUFBQSxRQUFBLEVBQUEsZ0JBQUE7QUFBQWdCLFVBQUFBLEtBQUEsRUFBQSxhQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxlQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxjQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSxjQUFBO0FBQUEvQyxVQUFBQSxHQUFBLEVBQUEsMEJBQUE7QUFBQWdELFVBQUFBLE9BQUEsRUFBQSxlQUFBO0FBQUF0TSxVQUFBQSxVQUFBLEVBQUEsQ0FBQSx3QkFBQSxFQUFBLDJCQUFBLEVBQUEsZUFBQSxDQUFBO0FBQUF1TSxVQUFBQSxJQUFBLEVBQUEsWUFBQTtBQUFBQyxVQUFBQSxJQUFBLEVBQUEsWUFBQTtBQUFBLDhCQUFBLENBQUEsd0JBQUEsRUFBQSxxQkFBQSxDQUFBO0FBQUEsMkJBQUEscUJBQUE7QUFBQSx3QkFBQSxrQkFBQTtBQUFBLHdCQUFBLGtCQUFBO0FBQUFDLFVBQUFBLE9BQUEsRUFBQSxDQUFBLGlCQUFBLEVBQUEsZUFBQSxDQUFBO0FBQUEvQyxVQUFBQSxLQUFBLEVBQUEsQ0FBQSxhQUFBLEVBQUEsY0FBQTtBQUFBLFNBQUE7QUFBQWdELFFBQUFBLEtBQUEsRUFBQTtBQUFBQyxVQUFBQSxHQUFBLEVBQUEsaVJBQUE7QUFBQUMsVUFBQUEsU0FBQSxFQUFBLDZEQUFBO0FBQUFDLFVBQUFBLFdBQUEsRUFBQSxXQUFBO0FBQUFDLFVBQUFBLEVBQUEsRUFBQSxlQUFBO0FBQUFDLFVBQUFBLE1BQUEsRUFBQSx1QkFBQTtBQUFBQyxVQUFBQSxPQUFBLEVBQUEsOEVBQUE7QUFBQUMsVUFBQUEsS0FBQSxFQUFBO0FBQUE7QUFBQSxPQUFBO0FBQUFDLE1BQUFBLG9CQUFBLEVBQUE7QUFBQUMsUUFBQUEsV0FBQSxFQUFBLDBUQUFBO0FBQUFDLFFBQUFBLFlBQUEsRUFBQSx5a0RBQUE7QUFBQUMsUUFBQUEsYUFBQSxFQUFBO0FBQUE7QUFBQSxLQUFBO0FBQUEsUUFBQUMsQ0FBQTtBQUFBLFFBQUFsTyxDQUFBLEdBQUFtTyxNQUFBLENBQUFsZCxTQUFBLENBQUFtZCxjQUFBO0FBQUEsV0FBQTVOLENBQUEsQ0FBQTZOLGNBQUEsR0FBQSxjQUFBLEVBQUE3TixDQUFBLENBQUE4TixlQUFBLEdBQUEsZUFBQSxFQUFBOU4sQ0FBQSxDQUFBK04sZUFBQSxHQUFBLGVBQUEsRUFBQUwsQ0FBQSxHQUFBLGFBQUF0WSxLQUFBLEdBQUFBLEtBQUEsQ0FBQTRZLE9BQUEsR0FBQSxVQUFBL08sQ0FBQSxFQUFBO0FBQUEsYUFBQSxxQkFBQTBPLE1BQUEsQ0FBQWxkLFNBQUEsQ0FBQXdkLFFBQUEsQ0FBQTNZLElBQUEsQ0FBQTJKLENBQUEsQ0FBQTtBQUFBLEtBQUEsRUFBQSxZQUFBO0FBQUEsVUFBQUEsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBRSxDQUFBO0FBQUEsVUFBQUMsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBNE8sQ0FBQTtBQUFBLFVBQUFDLENBQUEsR0FBQW5PLENBQUEsQ0FBQUMsaUJBQUE7O0FBQUEsV0FBQWhCLENBQUEsSUFBQWtQLENBQUEsQ0FBQTVDLEtBQUE7QUFBQSxZQUFBL0wsQ0FBQSxDQUFBbEssSUFBQSxDQUFBNlksQ0FBQSxDQUFBNUMsS0FBQSxFQUFBdE0sQ0FBQSxDQUFBLEVBQUE7QUFBQSxlQUFBQyxDQUFBLEdBQUFpUCxDQUFBLENBQUE1QyxLQUFBLENBQUF0TSxDQUFBLENBQUEsRUFBQXlPLENBQUEsQ0FBQXhPLENBQUEsQ0FBQSxLQUFBQSxDQUFBLEdBQUEsQ0FBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQUksQ0FBQSxHQUFBSixDQUFBLENBQUFqTyxNQUFBLEVBQUFvTyxDQUFBLEdBQUEsQ0FBQSxFQUFBQSxDQUFBLEdBQUFDLENBQUEsRUFBQSxFQUFBRCxDQUFBO0FBQUFELFlBQUFBLENBQUEsR0FBQUYsQ0FBQSxDQUFBRyxDQUFBLENBQUEsRUFBQTZPLENBQUEsR0FBQTlPLENBQUEsQ0FBQWdQLE9BQUEsQ0FBQSxPQUFBLENBQUEsRUFBQSxLQUFBRixDQUFBLEtBQUE5TyxDQUFBLEdBQUFBLENBQUEsQ0FBQWlQLFNBQUEsQ0FBQSxDQUFBLEVBQUFILENBQUEsSUFBQSxlQUFBLEdBQUE5TyxDQUFBLENBQUFpUCxTQUFBLENBQUFILENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBaFAsQ0FBQSxDQUFBRyxDQUFBLENBQUEsR0FBQSxJQUFBSSxNQUFBLENBQUFMLENBQUEsRUFBQSxHQUFBLENBQUE7QUFBQTs7QUFBQStPLFVBQUFBLENBQUEsQ0FBQTVDLEtBQUEsQ0FBQXRNLENBQUEsSUFBQUMsQ0FBQTtBQUFBO0FBQUE7O0FBQUFLLE1BQUFBLENBQUEsQ0FBQTRPLENBQUEsQ0FBQWhGLEdBQUEsQ0FBQSxFQUFBNUosQ0FBQSxDQUFBNE8sQ0FBQSxDQUFBak8sTUFBQSxDQUFBLEVBQUFYLENBQUEsQ0FBQTRPLENBQUEsQ0FBQXZNLE9BQUEsQ0FBQSxFQUFBckMsQ0FBQSxDQUFBNE8sQ0FBQSxDQUFBbEUsR0FBQSxDQUFBLEVBQUExSyxDQUFBLENBQUE0TyxDQUFBLENBQUFyQixLQUFBLENBQUEsRUFBQXFCLENBQUEsQ0FBQUcsSUFBQSxHQUFBO0FBQUE3RSxRQUFBQSxjQUFBLEVBQUEwRSxDQUFBLENBQUFoRixHQUFBLENBQUFNLGNBQUE7QUFBQUQsUUFBQUEsZUFBQSxFQUFBMkUsQ0FBQSxDQUFBaEYsR0FBQSxDQUFBSztBQUFBLE9BQUE7QUFBQSxLQUFBLEVBQUEsRUFBQXhKLENBQUEsQ0FBQXVPLFNBQUEsR0FBQSxVQUFBdFAsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQSxXQUFBLElBQUFFLENBQUEsSUFBQUgsQ0FBQTtBQUFBLFlBQUFPLENBQUEsQ0FBQWxLLElBQUEsQ0FBQTJKLENBQUEsRUFBQUcsQ0FBQSxLQUFBSCxDQUFBLENBQUFHLENBQUEsQ0FBQSxDQUFBb1AsSUFBQSxDQUFBdFAsQ0FBQSxDQUFBLEVBQUEsT0FBQUUsQ0FBQTtBQUFBOztBQUFBLGFBQUEsSUFBQTtBQUFBLEtBQUEsRUFBQVksQ0FBQSxDQUFBeU8sV0FBQSxHQUFBLFVBQUF4UCxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFVBQUFFLENBQUEsR0FBQSxFQUFBOztBQUFBLFdBQUEsSUFBQUMsQ0FBQSxJQUFBSixDQUFBO0FBQUFPLFFBQUFBLENBQUEsQ0FBQWxLLElBQUEsQ0FBQTJKLENBQUEsRUFBQUksQ0FBQSxLQUFBSixDQUFBLENBQUFJLENBQUEsQ0FBQSxDQUFBbVAsSUFBQSxDQUFBdFAsQ0FBQSxDQUFBLElBQUFFLENBQUEsQ0FBQTVCLElBQUEsQ0FBQTZCLENBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUFELENBQUE7QUFBQSxLQUFBLEVBQUFZLENBQUEsQ0FBQTBPLGFBQUEsR0FBQSxVQUFBelAsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQSxVQUFBRSxDQUFBO0FBQUEsVUFBQUMsQ0FBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxVQUFBNE8sQ0FBQTtBQUFBLFVBQUFDLENBQUEsR0FBQW5PLENBQUEsQ0FBQUMsaUJBQUEsQ0FBQXNMLEtBQUE7QUFBQSxVQUFBL0wsQ0FBQSxDQUFBbEssSUFBQSxDQUFBNlksQ0FBQSxFQUFBbFAsQ0FBQSxDQUFBLEVBQUEsS0FBQUcsQ0FBQSxHQUFBK08sQ0FBQSxDQUFBbFAsQ0FBQSxDQUFBLEVBQUFLLENBQUEsR0FBQUYsQ0FBQSxDQUFBbk8sTUFBQSxFQUFBb08sQ0FBQSxHQUFBLENBQUEsRUFBQUEsQ0FBQSxHQUFBQyxDQUFBLEVBQUEsRUFBQUQsQ0FBQTtBQUFBLFlBQUE2TyxDQUFBLEdBQUE5TyxDQUFBLENBQUFDLENBQUEsQ0FBQSxDQUFBc1AsSUFBQSxDQUFBelAsQ0FBQSxDQUFBLEVBQUEsU0FBQWdQLENBQUEsRUFBQSxPQUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUE7QUFBQSxhQUFBLElBQUE7QUFBQSxLQUFBLEVBQUFsTyxDQUFBLENBQUE0TyxVQUFBLEdBQUEsVUFBQTNQLENBQUEsRUFBQUMsQ0FBQSxFQUFBO0FBQUEsVUFBQUUsQ0FBQSxHQUFBWSxDQUFBLENBQUEwTyxhQUFBLENBQUF6UCxDQUFBLEVBQUFDLENBQUEsQ0FBQTtBQUFBLGFBQUFFLENBQUEsR0FBQVksQ0FBQSxDQUFBNk8sZ0JBQUEsQ0FBQXpQLENBQUEsQ0FBQSxHQUFBMFAsR0FBQTtBQUFBLEtBQUEsRUFBQTlPLENBQUEsQ0FBQTZPLGdCQUFBLEdBQUEsVUFBQTVQLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUE7QUFBQSxhQUFBQSxDQUFBLEdBQUFELENBQUEsQ0FBQXZMLEtBQUEsQ0FBQSxlQUFBLENBQUEsRUFBQSxNQUFBd0wsQ0FBQSxDQUFBak8sTUFBQSxLQUFBZ08sQ0FBQSxHQUFBQyxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBQSxDQUFBLENBQUFqTyxNQUFBLEtBQUFnTyxDQUFBLEdBQUFDLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxHQUFBLEVBQUFBLENBQUEsQ0FBQTZQLEtBQUEsRUFBQSxFQUFBOVAsQ0FBQSxJQUFBQyxDQUFBLENBQUF2QyxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBc0MsQ0FBQTtBQUFBLEtBQUEsRUFBQWUsQ0FBQSxDQUFBZ1AsZ0JBQUEsR0FBQSxVQUFBL1AsQ0FBQSxFQUFBO0FBQUEsYUFBQWUsQ0FBQSxDQUFBc04sb0JBQUEsQ0FBQUMsV0FBQSxDQUFBaUIsSUFBQSxDQUFBdlAsQ0FBQSxLQUFBZSxDQUFBLENBQUFzTixvQkFBQSxDQUFBRSxZQUFBLENBQUFnQixJQUFBLENBQUF2UCxDQUFBLENBQUFVLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxLQUFBLEVBQUFLLENBQUEsQ0FBQWlQLGdCQUFBLEdBQUEsVUFBQWhRLENBQUEsRUFBQTtBQUFBLGFBQUFlLENBQUEsQ0FBQXNOLG9CQUFBLENBQUFHLGFBQUEsQ0FBQWUsSUFBQSxDQUFBdlAsQ0FBQSxDQUFBO0FBQUEsS0FBQSxFQUFBZSxDQUFBLENBQUFrUCxxQkFBQSxHQUFBLFVBQUFqUSxDQUFBLEVBQUFDLENBQUEsRUFBQUUsQ0FBQSxFQUFBO0FBQUEsVUFBQUgsQ0FBQSxDQUFBa1EsTUFBQSxLQUFBcFEsQ0FBQSxFQUFBO0FBQUEsWUFBQU0sQ0FBQSxFQUFBQyxDQUFBLEVBQUE0TyxDQUFBO0FBQUEsZUFBQSxDQUFBNU8sQ0FBQSxHQUFBVSxDQUFBLENBQUF1TyxTQUFBLENBQUF2TyxDQUFBLENBQUFDLGlCQUFBLENBQUEyQixPQUFBLEVBQUExQyxDQUFBLENBQUEsS0FBQUQsQ0FBQSxDQUFBa1EsTUFBQSxHQUFBbFEsQ0FBQSxDQUFBbVEsTUFBQSxHQUFBOVAsQ0FBQSxFQUFBLE1BQUFMLENBQUEsQ0FBQW9RLEtBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBaFEsQ0FBQSxHQUFBVyxDQUFBLENBQUF1TyxTQUFBLENBQUF2TyxDQUFBLENBQUFDLGlCQUFBLENBQUFDLE1BQUEsRUFBQWhCLENBQUEsQ0FBQSxLQUFBRCxDQUFBLENBQUFrUSxNQUFBLEdBQUFsUSxDQUFBLENBQUFvUSxLQUFBLEdBQUFoUSxDQUFBLEVBQUEsTUFBQUosQ0FBQSxDQUFBbVEsTUFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUFwUCxDQUFBLENBQUFnUCxnQkFBQSxDQUFBOVAsQ0FBQSxLQUFBZ1AsQ0FBQSxHQUFBdE8sQ0FBQSxDQUFBMFAsWUFBQSxDQUFBbFEsQ0FBQSxDQUFBLEVBQUE4TyxDQUFBLEtBQUFuUCxDQUFBLElBQUFFLENBQUEsQ0FBQWtRLE1BQUEsR0FBQW5QLENBQUEsQ0FBQStOLGVBQUEsRUFBQTlPLENBQUEsQ0FBQW1RLE1BQUEsR0FBQW5RLENBQUEsQ0FBQW9RLEtBQUEsR0FBQSxJQUFBLElBQUFuQixDQUFBLElBQUFqUCxDQUFBLENBQUFrUSxNQUFBLEdBQUFsUSxDQUFBLENBQUFvUSxLQUFBLEdBQUFyUCxDQUFBLENBQUE2TixjQUFBLEVBQUE1TyxDQUFBLENBQUFtUSxNQUFBLEdBQUEsSUFBQSxLQUFBblEsQ0FBQSxDQUFBa1EsTUFBQSxHQUFBbFEsQ0FBQSxDQUFBbVEsTUFBQSxHQUFBcFAsQ0FBQSxDQUFBOE4sZUFBQSxFQUFBN08sQ0FBQSxDQUFBb1EsS0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBclAsQ0FBQSxDQUFBaVAsZ0JBQUEsQ0FBQS9QLENBQUEsS0FBQUQsQ0FBQSxDQUFBa1EsTUFBQSxHQUFBbFEsQ0FBQSxDQUFBbVEsTUFBQSxHQUFBcFAsQ0FBQSxDQUFBOE4sZUFBQSxFQUFBN08sQ0FBQSxDQUFBb1EsS0FBQSxHQUFBLElBQUEsSUFBQXBRLENBQUEsQ0FBQWtRLE1BQUEsR0FBQWxRLENBQUEsQ0FBQW1RLE1BQUEsR0FBQW5RLENBQUEsQ0FBQW9RLEtBQUEsR0FBQSxJQUFBLENBQUE7QUFBQTtBQUFBLEtBQUEsRUFBQXJQLENBQUEsQ0FBQXVQLFdBQUEsR0FBQSxVQUFBdFEsQ0FBQSxFQUFBO0FBQUEsVUFBQUMsQ0FBQSxHQUFBLFNBQUFELENBQUEsQ0FBQWtRLE1BQUEsRUFBQTtBQUFBLGFBQUFsUSxDQUFBLENBQUF1USxFQUFBLENBQUEsS0FBQSxLQUFBLE9BQUF2USxDQUFBLENBQUEzRyxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF1USxFQUFBLENBQUEsS0FBQSxLQUFBLE9BQUF2USxDQUFBLENBQUEzRyxPQUFBLENBQUEsUUFBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF1USxFQUFBLENBQUEsS0FBQSxLQUFBLE9BQUF2USxDQUFBLENBQUEzRyxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsTUFBQTJHLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxLQUFBeFEsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLGtCQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxZQUFBLEtBQUEsS0FBQXhRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxZQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXlRLEtBQUEsQ0FBQSxrQkFBQSxDQUFBLElBQUEsT0FBQXpRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxPQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXlRLEtBQUEsQ0FBQSxlQUFBLENBQUEsSUFBQXpRLENBQUEsQ0FBQXlRLEtBQUEsQ0FBQSxjQUFBLENBQUEsSUFBQXpRLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxTQUFBLEtBQUEsTUFBQXhRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxRQUFBLEtBQUF4USxDQUFBLENBQUF3USxFQUFBLENBQUEsV0FBQSxDQUFBLElBQUEsS0FBQXhRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxTQUFBLEtBQUEsT0FBQXhRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBeFEsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBMkcsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLE9BQUEsS0FBQSxLQUFBeFEsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBMkcsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBeFEsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBeFEsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBeFEsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLFFBQUEsS0FBQSxLQUFBeFEsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEyRyxDQUFBLENBQUF3USxFQUFBLENBQUEsWUFBQSxLQUFBeFEsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLFFBQUEsQ0FBQSxLQUFBLE9BQUF4USxDQUFBLENBQUEzRyxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF5USxLQUFBLENBQUEsYUFBQSxDQUFBLElBQUF6USxDQUFBLENBQUF3USxFQUFBLENBQUEsUUFBQSxLQUFBLEtBQUF4USxDQUFBLENBQUEzRyxPQUFBLENBQUEsUUFBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF3USxFQUFBLENBQUEsV0FBQSxLQUFBeFEsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBLE1BQUF4USxDQUFBLENBQUEzRyxPQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTRHLENBQUEsSUFBQSxLQUFBRCxDQUFBLENBQUEzRyxPQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTRHLENBQUEsSUFBQSxLQUFBRCxDQUFBLENBQUEzRyxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQTRHLENBQUEsSUFBQSxLQUFBRCxDQUFBLENBQUEzRyxPQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQTRHLENBQUEsSUFBQSxNQUFBRCxDQUFBLENBQUEzRyxPQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQTRHLENBQUEsR0FBQSxHQUFBLEdBQUFELENBQUEsQ0FBQXVRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsTUFBQXZRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXVRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsTUFBQXZRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXVRLEVBQUEsQ0FBQSxLQUFBLEtBQUEsTUFBQXZRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxNQUFBLENBQUEsSUFBQTJHLENBQUEsQ0FBQXdRLEVBQUEsQ0FBQSxZQUFBLEtBQUEsS0FBQXhRLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxZQUFBLENBQUEsSUFBQSxJQUFBMkcsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBLEtBQUEyRyxDQUFBLENBQUEzRyxPQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsT0FBQTJHLENBQUEsQ0FBQTNHLE9BQUEsQ0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBMkcsQ0FBQSxDQUFBM0csT0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBMkcsQ0FBQSxDQUFBd1EsRUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLElBQUF4USxDQUFBLENBQUF5USxLQUFBLENBQUEseUNBQUEsQ0FBQSxJQUFBLE1BQUF6USxDQUFBLENBQUEzRyxPQUFBLENBQUEsWUFBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF3USxFQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLElBQUF4USxDQUFBLENBQUEzRyxPQUFBLENBQUEsWUFBQSxDQUFBLElBQUEyRyxDQUFBLENBQUF5USxLQUFBLENBQUEsK0JBQUEsQ0FBQSxJQUFBLE9BQUF6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QXVQLFdBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxLQUFBelAsTUFBQSxDQUFBb1EsS0FBQTtBQUFBO0FBQUEsS0FBQSxFQUFBdFEsQ0FBQSxDQUFBMFAsWUFBQSxHQUFBLGVBQUEsT0FBQTNaLE1BQUEsSUFBQUEsTUFBQSxDQUFBa2EsTUFBQSxHQUFBLFVBQUE1USxDQUFBLEVBQUE7QUFBQSxhQUFBLElBQUFBLENBQUEsR0FBQUYsQ0FBQSxHQUFBaUIsQ0FBQSxDQUFBNFAsb0JBQUEsTUFBQTNRLENBQUE7QUFBQSxLQUFBLEdBQUEsWUFBQSxDQUFBLENBQUEsRUFBQVcsQ0FBQSxDQUFBdVEsS0FBQSxHQUFBblEsQ0FBQSxFQUFBSixDQUFBLENBQUF0SCxPQUFBLEdBQUEsa0JBQUEsRUFBQXNILENBQUE7QUFBQSxHQUFBLENBQUE7QUFBQSxDQUFBLENBQUEsWUFBQTtBQUFBLE1BQUEsZUFBQSxPQUFBd1EsTUFBQSxJQUFBQSxNQUFBLENBQUFDLE9BQUEsRUFBQSxPQUFBLFVBQUF0UixDQUFBLEVBQUE7QUFBQXFSLElBQUFBLE1BQUEsQ0FBQUMsT0FBQSxHQUFBdFIsQ0FBQSxFQUFBO0FBQUEsR0FBQTtBQUFBLE1BQUEsY0FBQSxPQUFBdVIsTUFBQSxJQUFBQSxNQUFBLENBQUFDLEdBQUEsRUFBQSxPQUFBRCxNQUFBO0FBQUEsTUFBQSxlQUFBLE9BQUEzYSxNQUFBLEVBQUEsT0FBQSxVQUFBb0osQ0FBQSxFQUFBO0FBQUFwSixJQUFBQSxNQUFBLENBQUE2YSxZQUFBLEdBQUF6UixDQUFBLEVBQUE7QUFBQSxHQUFBO0FBQUEsUUFBQSxJQUFBMFIsS0FBQSxDQUFBLHFCQUFBLENBQUE7QUFBQSxDQUFBLEVBQUEsQ0FBQSIsImZpbGUiOiJsaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiAgalF1ZXJ5IERhdGUgRHJvcGRvd25zIC0gdjEuMC4wXHJcbiAqICBBIHNpbXBsZSwgY3VzdG9taXNhYmxlIGRhdGUgc2VsZWN0IHBsdWdpblxyXG4gKlxyXG4gKiAgTWFkZSBieSBDaHJpcyBCcm93blxyXG4gKiAgVW5kZXIgTUlUIExpY2Vuc2VcclxuICovXHJcbiFmdW5jdGlvbihhLGIsYyxkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGIsYyl7cmV0dXJuIHRoaXMuZWxlbWVudD1iLHRoaXMuJGVsZW1lbnQ9YShiKSx0aGlzLmNvbmZpZz1hLmV4dGVuZCh7fSxnLGMpLHRoaXMuaW50ZXJuYWxzPXtvYmplY3RSZWZzOnt9fSx0aGlzLmluaXQoKSx0aGlzfXZhciBmPVwiZGF0ZURyb3Bkb3duc1wiLGc9e2RlZmF1bHREYXRlOm51bGwsZGVmYXVsdERhdGVGb3JtYXQ6XCJ5eXl5LW1tLWRkXCIsZGlzcGxheUZvcm1hdDpcImRteVwiLHN1Ym1pdEZvcm1hdDpcInl5eXktbW0tZGRcIixtaW5BZ2U6MCxtYXhBZ2U6MTIwLG1pblllYXI6bnVsbCxtYXhZZWFyOm51bGwsc3VibWl0RmllbGROYW1lOlwiZGF0ZVwiLHdyYXBwZXJDbGFzczpcImRhdGUtZHJvcGRvd25zXCIsZHJvcGRvd25DbGFzczpudWxsLGRheVN1ZmZpeGVzOiEwLG1vbnRoU3VmZml4ZXM6ITAsbW9udGhGb3JtYXQ6XCJsb25nXCIscmVxdWlyZWQ6ITEsZGF5TGFiZWw6XCJEYXlcIixtb250aExhYmVsOlwiTW9udGhcIix5ZWFyTGFiZWw6XCJZZWFyXCIsbW9udGhMb25nVmFsdWVzOltcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXSxtb250aFNob3J0VmFsdWVzOltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0saW5pdGlhbERheU1vbnRoWWVhclZhbHVlczpbXCJEYXlcIixcIk1vbnRoXCIsXCJZZWFyXCJdLGRheVN1ZmZpeFZhbHVlczpbXCJzdFwiLFwibmRcIixcInJkXCIsXCJ0aFwiXX07YS5leHRlbmQoZS5wcm90b3R5cGUse2luaXQ6ZnVuY3Rpb24oKXt0aGlzLmNoZWNrRm9yRHVwbGljYXRlRWxlbWVudCgpLHRoaXMuc2V0SW50ZXJuYWxWYXJpYWJsZXMoKSx0aGlzLnNldHVwTWFya3VwKCksdGhpcy5idWlsZERyb3Bkb3ducygpLHRoaXMuYXR0YWNoRHJvcGRvd25zKCksdGhpcy5iaW5kQ2hhbmdlRXZlbnQoKSx0aGlzLmNvbmZpZy5kZWZhdWx0RGF0ZSYmdGhpcy5wb3B1bGF0ZURlZmF1bHREYXRlKCl9LGNoZWNrRm9yRHVwbGljYXRlRWxlbWVudDpmdW5jdGlvbigpe3JldHVybiFhKCdpbnB1dFtuYW1lPVwiJyt0aGlzLmNvbmZpZy5zdWJtaXRGaWVsZE5hbWUrJ1wiXScpLmxlbmd0aHx8KGEuZXJyb3IoXCJEdXBsaWNhdGUgZWxlbWVudCBmb3VuZFwiKSwhMSl9LHNldEludGVybmFsVmFyaWFibGVzOmZ1bmN0aW9uKCl7dmFyIGE9bmV3IERhdGU7dGhpcy5pbnRlcm5hbHMuY3VycmVudERheT1hLmdldERhdGUoKSx0aGlzLmludGVybmFscy5jdXJyZW50TW9udGg9YS5nZXRNb250aCgpKzEsdGhpcy5pbnRlcm5hbHMuY3VycmVudFllYXI9YS5nZXRGdWxsWWVhcigpfSxzZXR1cE1hcmt1cDpmdW5jdGlvbigpe3ZhciBiLGM7aWYoXCJpbnB1dFwiPT09dGhpcy5lbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSl7dGhpcy5jb25maWcuZGVmYXVsdERhdGV8fCh0aGlzLmNvbmZpZy5kZWZhdWx0RGF0ZT10aGlzLmVsZW1lbnQudmFsdWUpLGM9dGhpcy4kZWxlbWVudC5hdHRyKFwidHlwZVwiLFwiaGlkZGVuXCIpLndyYXAoJzxkaXYgY2xhc3M9XCInK3RoaXMuY29uZmlnLndyYXBwZXJDbGFzcysnXCI+PC9kaXY+Jyk7dmFyIGQ9dGhpcy5jb25maWcuc3VibWl0RmllbGROYW1lIT09Zy5zdWJtaXRGaWVsZE5hbWUsZT10aGlzLmVsZW1lbnQuaGFzQXR0cmlidXRlKFwibmFtZVwiKTtlfHxkP2QmJnRoaXMuJGVsZW1lbnQuYXR0cihcIm5hbWVcIix0aGlzLmNvbmZpZy5zdWJtaXRGaWVsZE5hbWUpOnRoaXMuJGVsZW1lbnQuYXR0cihcIm5hbWVcIixnLnN1Ym1pdEZpZWxkTmFtZSksYj10aGlzLiRlbGVtZW50LnBhcmVudCgpfWVsc2UgYz1hKFwiPGlucHV0Lz5cIix7dHlwZTpcImhpZGRlblwiLG5hbWU6dGhpcy5jb25maWcuc3VibWl0RmllbGROYW1lfSksdGhpcy4kZWxlbWVudC5hcHBlbmQoYykuYWRkQ2xhc3ModGhpcy5jb25maWcud3JhcHBlckNsYXNzKSxiPXRoaXMuJGVsZW1lbnQ7cmV0dXJuIHRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMucGx1Z2luV3JhcHBlcj1iLHRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMuaGlkZGVuRmllbGQ9YywhMH0sYnVpbGREcm9wZG93bnM6ZnVuY3Rpb24oKXt2YXIgYSxiLGM7cmV0dXJuIGUubWVzc2FnZT17ZGF5OnRoaXMuY29uZmlnLmluaXRpYWxEYXlNb250aFllYXJWYWx1ZXNbMF0sbW9udGg6dGhpcy5jb25maWcuaW5pdGlhbERheU1vbnRoWWVhclZhbHVlc1sxXSx5ZWFyOnRoaXMuY29uZmlnLmluaXRpYWxEYXlNb250aFllYXJWYWx1ZXNbMl19LGE9dGhpcy5idWlsZERheURyb3Bkb3duKCksdGhpcy5pbnRlcm5hbHMub2JqZWN0UmVmcy5kYXlEcm9wZG93bj1hLGI9dGhpcy5idWlsZE1vbnRoRHJvcGRvd24oKSx0aGlzLmludGVybmFscy5vYmplY3RSZWZzLm1vbnRoRHJvcGRvd249YixjPXRoaXMuYnVpbGRZZWFyRHJvcGRvd24oKSx0aGlzLmludGVybmFscy5vYmplY3RSZWZzLnllYXJEcm9wZG93bj1jLCEwfSxhdHRhY2hEcm9wZG93bnM6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmludGVybmFscy5vYmplY3RSZWZzLnBsdWdpbldyYXBwZXIsYj10aGlzLmludGVybmFscy5vYmplY3RSZWZzLmRheURyb3Bkb3duLGM9dGhpcy5pbnRlcm5hbHMub2JqZWN0UmVmcy5tb250aERyb3Bkb3duLGQ9dGhpcy5pbnRlcm5hbHMub2JqZWN0UmVmcy55ZWFyRHJvcGRvd247c3dpdGNoKHRoaXMuY29uZmlnLmRpc3BsYXlGb3JtYXQpe2Nhc2VcIm1keVwiOmEuYXBwZW5kKGMsYixkKTticmVhaztjYXNlXCJ5bWRcIjphLmFwcGVuZChkLGMsYik7YnJlYWs7Y2FzZVwiZG15XCI6ZGVmYXVsdDphLmFwcGVuZChiLGMsZCl9cmV0dXJuITB9LGJpbmRDaGFuZ2VFdmVudDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMuZGF5RHJvcGRvd24sYj10aGlzLmludGVybmFscy5vYmplY3RSZWZzLm1vbnRoRHJvcGRvd24sYz10aGlzLmludGVybmFscy5vYmplY3RSZWZzLnllYXJEcm9wZG93bixkPXRoaXMsZT10aGlzLmludGVybmFscy5vYmplY3RSZWZzO2UucGx1Z2luV3JhcHBlci5vbihcImNoYW5nZVwiLFwic2VsZWN0XCIsZnVuY3Rpb24oKXt2YXIgZixnLGg9YS52YWwoKSxpPWIudmFsKCksaj1jLnZhbCgpO3JldHVybihmPWQuY2hlY2tEYXRlKGgsaSxqKSk/KGUuZGF5RHJvcGRvd24uYWRkQ2xhc3MoXCJpbnZhbGlkXCIpLCExKTooXCIwMFwiIT09ZS5kYXlEcm9wZG93bi52YWwoKSYmZS5kYXlEcm9wZG93bi5yZW1vdmVDbGFzcyhcImludmFsaWRcIiksZS5oaWRkZW5GaWVsZC52YWwoXCJcIiksZnx8aCppKmo9PT0wfHwoZz1kLmZvcm1hdFN1Ym1pdERhdGUoaCxpLGopLGUuaGlkZGVuRmllbGQudmFsKGcpKSx2b2lkIGUuaGlkZGVuRmllbGQuY2hhbmdlKCkpfSl9LHBvcHVsYXRlRGVmYXVsdERhdGU6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmNvbmZpZy5kZWZhdWx0RGF0ZSxiPVtdLGM9XCJcIixkPVwiXCIsZT1cIlwiO3N3aXRjaCh0aGlzLmNvbmZpZy5kZWZhdWx0RGF0ZUZvcm1hdCl7Y2FzZVwieXl5eS1tbS1kZFwiOmRlZmF1bHQ6Yj1hLnNwbGl0KFwiLVwiKSxjPWJbMl0sZD1iWzFdLGU9YlswXTticmVhaztjYXNlXCJkZC9tbS95eXl5XCI6Yj1hLnNwbGl0KFwiL1wiKSxjPWJbMF0sZD1iWzFdLGU9YlsyXTticmVhaztjYXNlXCJtbS9kZC95eXl5XCI6Yj1hLnNwbGl0KFwiL1wiKSxjPWJbMV0sZD1iWzBdLGU9YlsyXTticmVhaztjYXNlXCJ1bml4XCI6Yj1uZXcgRGF0ZSxiLnNldFRpbWUoMWUzKmEpLGM9Yi5nZXREYXRlKCkrXCJcIixkPWIuZ2V0TW9udGgoKSsxK1wiXCIsZT1iLmdldEZ1bGxZZWFyKCksYy5sZW5ndGg8MiYmKGM9XCIwXCIrYyksZC5sZW5ndGg8MiYmKGQ9XCIwXCIrZCl9cmV0dXJuIHRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMuZGF5RHJvcGRvd24udmFsKGMpLHRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMubW9udGhEcm9wZG93bi52YWwoZCksdGhpcy5pbnRlcm5hbHMub2JqZWN0UmVmcy55ZWFyRHJvcGRvd24udmFsKGUpLHRoaXMuaW50ZXJuYWxzLm9iamVjdFJlZnMuaGlkZGVuRmllbGQudmFsKGEpLCEwPT09dGhpcy5jaGVja0RhdGUoYyxkLGUpJiZ0aGlzLmludGVybmFscy5vYmplY3RSZWZzLmRheURyb3Bkb3duLmFkZENsYXNzKFwiaW52YWxpZFwiKSwhMH0sYnVpbGRCYXNlRHJvcGRvd246ZnVuY3Rpb24oYil7dmFyIGM9YjtyZXR1cm4gdGhpcy5jb25maWcuZHJvcGRvd25DbGFzcyYmKGMrPVwiIFwiK3RoaXMuY29uZmlnLmRyb3Bkb3duQ2xhc3MpLGEoXCI8c2VsZWN0Pjwvc2VsZWN0PlwiLHtjbGFzczpjLG5hbWU6dGhpcy5jb25maWcuc3VibWl0RmllbGROYW1lK1wiX1tcIitiK1wiXVwiLHJlcXVpcmVkOnRoaXMuY29uZmlnLnJlcXVpcmVkfSl9LGJ1aWxkRGF5RHJvcGRvd246ZnVuY3Rpb24oKXt2YXIgYSxiPXRoaXMuYnVpbGRCYXNlRHJvcGRvd24oXCJkYXlcIiksZD1jLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7ZC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLFwiXCIpLGQuYXBwZW5kQ2hpbGQoYy5jcmVhdGVUZXh0Tm9kZSh0aGlzLmNvbmZpZy5kYXlMYWJlbCkpLGIuYXBwZW5kKGQpO2Zvcih2YXIgZT0xO2U8MTA7ZSsrKWE9dGhpcy5jb25maWcuZGF5U3VmZml4ZXM/ZSt0aGlzLmdldFN1ZmZpeChlKTpcIjBcIitlLGQ9Yy5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpLGQuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIjBcIitlKSxkLmFwcGVuZENoaWxkKGMuY3JlYXRlVGV4dE5vZGUoYSkpLGIuYXBwZW5kKGQpO2Zvcih2YXIgZj0xMDtmPD0zMTtmKyspYT1mLHRoaXMuY29uZmlnLmRheVN1ZmZpeGVzJiYoYT1mK3RoaXMuZ2V0U3VmZml4KGYpKSxkPWMuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSxkLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsZiksZC5hcHBlbmRDaGlsZChjLmNyZWF0ZVRleHROb2RlKGEpKSxiLmFwcGVuZChkKTtyZXR1cm4gYn0sYnVpbGRNb250aERyb3Bkb3duOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5idWlsZEJhc2VEcm9wZG93bihcIm1vbnRoXCIpLGI9Yy5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO2Iuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiKSxiLmFwcGVuZENoaWxkKGMuY3JlYXRlVGV4dE5vZGUodGhpcy5jb25maWcubW9udGhMYWJlbCkpLGEuYXBwZW5kKGIpO2Zvcih2YXIgZD0xO2Q8PTEyO2QrKyl7dmFyIGU7c3dpdGNoKHRoaXMuY29uZmlnLm1vbnRoRm9ybWF0KXtjYXNlXCJzaG9ydFwiOmU9dGhpcy5jb25maWcubW9udGhTaG9ydFZhbHVlc1tkLTFdO2JyZWFrO2Nhc2VcImxvbmdcIjplPXRoaXMuY29uZmlnLm1vbnRoTG9uZ1ZhbHVlc1tkLTFdO2JyZWFrO2Nhc2VcIm51bWVyaWNcIjplPWQsdGhpcy5jb25maWcubW9udGhTdWZmaXhlcyYmKGUrPXRoaXMuZ2V0U3VmZml4KGQpKX1kPDEwJiYoZD1cIjBcIitkKSxiPWMuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSxiLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsZCksYi5hcHBlbmRDaGlsZChjLmNyZWF0ZVRleHROb2RlKGUpKSxhLmFwcGVuZChiKX1yZXR1cm4gYX0sYnVpbGRZZWFyRHJvcGRvd246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmNvbmZpZy5taW5ZZWFyLGI9dGhpcy5jb25maWcubWF4WWVhcixkPXRoaXMuYnVpbGRCYXNlRHJvcGRvd24oXCJ5ZWFyXCIpLGU9Yy5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO2Uuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiKSxlLmFwcGVuZENoaWxkKGMuY3JlYXRlVGV4dE5vZGUodGhpcy5jb25maWcueWVhckxhYmVsKSksZC5hcHBlbmQoZSksYXx8KGE9dGhpcy5pbnRlcm5hbHMuY3VycmVudFllYXItKHRoaXMuY29uZmlnLm1heEFnZSsxKSksYnx8KGI9dGhpcy5pbnRlcm5hbHMuY3VycmVudFllYXItdGhpcy5jb25maWcubWluQWdlKTtmb3IodmFyIGY9YjtmPj1hO2YtLSllPWMuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSxlLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsZiksZS5hcHBlbmRDaGlsZChjLmNyZWF0ZVRleHROb2RlKGYpKSxkLmFwcGVuZChlKTtyZXR1cm4gZH0sZ2V0U3VmZml4OmZ1bmN0aW9uKGEpe3ZhciBiPVwiXCIsYz10aGlzLmNvbmZpZy5kYXlTdWZmaXhWYWx1ZXNbMF0sZD10aGlzLmNvbmZpZy5kYXlTdWZmaXhWYWx1ZXNbMV0sZT10aGlzLmNvbmZpZy5kYXlTdWZmaXhWYWx1ZXNbMl0sZj10aGlzLmNvbmZpZy5kYXlTdWZmaXhWYWx1ZXNbM107c3dpdGNoKGElMTApe2Nhc2UgMTpiPWElMTAwPT09MTE/ZjpjO2JyZWFrO2Nhc2UgMjpiPWElMTAwPT09MTI/ZjpkO2JyZWFrO2Nhc2UgMzpiPWElMTAwPT09MTM/ZjplO2JyZWFrO2RlZmF1bHQ6Yj1cInRoXCJ9cmV0dXJuIGJ9LGNoZWNrRGF0ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7aWYoXCIwMFwiIT09Yil7dmFyIGU9bmV3IERhdGUoYyxiLDApLmdldERhdGUoKSxmPXBhcnNlSW50KGEsMTApO2Q9dGhpcy51cGRhdGVEYXlPcHRpb25zKGUsZiksZCYmdGhpcy5pbnRlcm5hbHMub2JqZWN0UmVmcy5oaWRkZW5GaWVsZC52YWwoXCJcIil9cmV0dXJuIGR9LHVwZGF0ZURheU9wdGlvbnM6ZnVuY3Rpb24oYSxiKXt2YXIgZD1wYXJzZUludCh0aGlzLmludGVybmFscy5vYmplY3RSZWZzLmRheURyb3Bkb3duLmNoaWxkcmVuKFwiOmxhc3RcIikudmFsKCksMTApLGU9XCJcIixmPVwiXCIsZz0hMTtpZihkPmEpe2Zvcig7ZD5hOyl0aGlzLmludGVybmFscy5vYmplY3RSZWZzLmRheURyb3Bkb3duLmNoaWxkcmVuKFwiOmxhc3RcIikucmVtb3ZlKCksZC0tO2I+YSYmKGc9ITApfWVsc2UgaWYoZDxhKWZvcig7ZDxhOyl7ZT0rK2QsZj1lLHRoaXMuY29uZmlnLmRheVN1ZmZpeGVzJiYoZis9dGhpcy5nZXRTdWZmaXgoZCkpO3ZhciBoPWMuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtoLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsZSksaC5hcHBlbmRDaGlsZChjLmNyZWF0ZVRleHROb2RlKGYpKSx0aGlzLmludGVybmFscy5vYmplY3RSZWZzLmRheURyb3Bkb3duLmFwcGVuZChoKX1yZXR1cm4gZ30sZm9ybWF0U3VibWl0RGF0ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtzd2l0Y2godGhpcy5jb25maWcuc3VibWl0Rm9ybWF0KXtjYXNlXCJ1bml4XCI6ZT1uZXcgRGF0ZSxlLnNldERhdGUoYSksZS5zZXRNb250aChiLTEpLGUuc2V0WWVhcihjKSxkPU1hdGgucm91bmQoZS5nZXRUaW1lKCkvMWUzKTticmVhaztkZWZhdWx0OmQ9dGhpcy5jb25maWcuc3VibWl0Rm9ybWF0LnJlcGxhY2UoXCJkZFwiLGEpLnJlcGxhY2UoXCJtbVwiLGIpLnJlcGxhY2UoXCJ5eXl5XCIsYyl9cmV0dXJuIGR9LGRlc3Ryb3k6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmNvbmZpZy53cmFwcGVyQ2xhc3M7aWYodGhpcy4kZWxlbWVudC5oYXNDbGFzcyhhKSl0aGlzLiRlbGVtZW50LmVtcHR5KCk7ZWxzZXt2YXIgYj10aGlzLiRlbGVtZW50LnBhcmVudCgpLGM9Yi5maW5kKFwic2VsZWN0XCIpO3RoaXMuJGVsZW1lbnQudW53cmFwKCksYy5yZW1vdmUoKX19fSksYS5mbltmXT1mdW5jdGlvbihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxkPWEuZGF0YSh0aGlzLFwicGx1Z2luX1wiK2YpO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBkKXJldHVybiBhLmVycm9yKFwiUGxlYXNlIGluaXRpYWxpemUgdGhlIHBsdWdpbiBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZC5cIiksITE7ZFtiXS5hcHBseShkLGMpfWVsc2UgYS5kYXRhKHRoaXMsXCJwbHVnaW5fXCIrZil8fGEuZGF0YSh0aGlzLFwicGx1Z2luX1wiK2YsbmV3IGUodGhpcyxiKSl9KSx0aGlzfX0oalF1ZXJ5LHdpbmRvdyxkb2N1bWVudCk7IiwiOyhmdW5jdGlvbiAoJCkge1xyXG4gICQuZm4ubWVudSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cclxuICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICBvcHQxOiBudWxsXHJcbiAgICB9LCBvcHRzKTtcclxuICAgIHZhciBzZXR0aW5nVG9wO1xyXG4gICAgLy8gbWFpbiBmdW5jdGlvblxyXG4gICAgZnVuY3Rpb24gaW5pdChvYmopIHtcclxuICAgICAgdmFyIGRPYmogPSAkKG9iaik7XHJcbiAgICAgIHZhciBkTWVudWxpbmsgPSBkT2JqLmZpbmQoJy5uYXYtYnRuJyk7XHJcbiAgICAgIHZhciBkQWxsTGluayA9IGRPYmouZmluZCgnLm5hdi1tZW51IGEnKTtcclxuICAgICAgdmFyIGRNZW51Q2xvc2UgPSBkT2JqLmZpbmQoJy5uYXYtY2xvc2UnKTtcclxuICAgICAgZE1lbnVsaW5rLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkT2JqLnRvZ2dsZUNsYXNzKCduYXYtLWFjdGl2ZScpO1xyXG4gICAgICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ19mcmVlemUnKSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc2Nyb2xsVG9wKHNldHRpbmdUb3ApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXR0aW5nVG9wID0gTWF0aC5tYXgod2luZG93LnBhZ2VZT2Zmc2V0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCk7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ19mcmVlemUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBkTWVudUNsb3NlLmNsaWNrKGZ1bmN0aW9uICgpIHsgXHJcbiAgICAgICAgZE9iai5yZW1vdmVDbGFzcyhcIm5hdi0tYWN0aXZlXCIpO1xyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aoc2V0dGluZ1RvcCk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkQWxsTGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai5yZW1vdmVDbGFzcygnbmF2LS1hY3RpdmUnKVxyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGluaXRpYWxpemUgZXZlcnkgZWxlbWVudFxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGluaXQoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8vIHN0YXJ0XHJcbiAgXHJcbn0pKGpRdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBqUXVlcnkgU2Nyb2xsaW5nIFBhcmFsbGF4IHYwLjFcclxuICogaHR0cDovL2pvbnJhYXNjaC5jb20vYmxvZy9zY3JvbGxpbmctcGFyYWxsYXgtanF1ZXJ5LXBsdWdpblxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgSm9uIFJhYXNjaCAoaHR0cDovL2pvbnJhYXNjaC5jb20vKVxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgRnJlZUJTRCBMaWNlbnNlIChTZWUgdGVybXMgYmVsb3cpXHJcbiAqXHJcbiAqIEBhdXRob3IgSm9uIFJhYXNjaFxyXG4gKlxyXG4gKiBAcHJvamVjdERlc2NyaXB0aW9uICAgIGpRdWVyeSBwbHVnaW4gdG8gY3JlYXRlIGEgcGFyYWxsYXggZWZmZWN0IHdoZW4gdGhlIHBhZ2UgaXMgc2Nyb2xsZWQuXHJcbiAqIFxyXG4gKiBAdmVyc2lvbiAwLjEuMFxyXG4gKiBcclxuICogQHJlcXVpcmVzIGpxdWVyeS5qcyAodiAxLjMuMiBtaW5pbXVtKVxyXG4gKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBqUXVlcnkgU2Nyb2xsaW5nIFBhcmFsbGF4XHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBGcmVlQlNEIExpY2Vuc2UuXHJcbiAqXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICpcclxuICogICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiAgICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgSk9OIFJBQVNDSCBgYEFTIElTJycgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgSk9OIFJBQVNDSCBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqXHJcbiAqIFRoZSB2aWV3cyBhbmQgY29uY2x1c2lvbnMgY29udGFpbmVkIGluIHRoZSBzb2Z0d2FyZSBhbmQgZG9jdW1lbnRhdGlvbiBhcmUgdGhvc2Ugb2YgdGhlIGF1dGhvcnMgYW5kIHNob3VsZCBub3QgYmUgaW50ZXJwcmV0ZWQgYXMgcmVwcmVzZW50aW5nIG9mZmljaWFsIHBvbGljaWVzLCBlaXRoZXIgZXhwcmVzc2VkIG9yIGltcGxpZWQsIG9mIEpvbiBSYWFzY2gsIHdobyBpcyB0aGUgbWFuLlxyXG4gKiBcclxuICpcclxuICogRk9SIFVTQUdFIElOU1RSVUNUSU9OUyBTRUUgVEhFIERPQ1VNRU5BVElPTiBBVDogaHR0cDovL2Rldi5qb25yYWFzY2guY29tL3Njcm9sbGluZy1wYXJhbGxheC9kb2N1bWVudGF0aW9uXHJcbiAqIFxyXG4gKlxyXG4gKi9cclxuXHJcblxyXG4oIGZ1bmN0aW9uKCAkICkge1xyXG4gICAgXHJcbiAgICAkLnNjcm9sbGluZ1BhcmFsbGF4ID0gZnVuY3Rpb24gKCBib3gsIG9wdGlvbnMgKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBcclxuICAgICAgICAvLyB2ZXJ0aWNhbCBvcHRpb25zXHJcbiAgICAgICAgXHJcbiAgICAgICAgb3B0aW9ucy5lbmFibGVWZXJ0aWNhbCA9IHR5cGVvZiggb3B0aW9ucy5lbmFibGVWZXJ0aWNhbCApICE9ICd1bmRlZmluZWQnID8gb3B0aW9ucy5lbmFibGVWZXJ0aWNhbCA6IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCBvcHRpb25zLmVuYWJsZVZlcnRpY2FsICkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnN0YXRpY1NwZWVkID0gb3B0aW9ucy5zdGF0aWNTcGVlZCB8fCBmYWxzZTtcclxuICAgICAgICAgICAgb3B0aW9ucy5zdGF0aWNTY3JvbGxMaW1pdCA9IHR5cGVvZihvcHRpb25zLnN0YXRpY1Njcm9sbExpbWl0KSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc3RhdGljU2Nyb2xsTGltaXQgOiB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb3B0aW9ucy5sb29wSXQgPSBvcHRpb25zLmxvb3BJdCB8fCBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG9wdGlvbnMucmV2ZXJzZURpcmVjdGlvbiA9IG9wdGlvbnMucmV2ZXJzZURpcmVjdGlvbiB8fCBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaG9yaXpvbnRhbCBvcHRpb25zXHJcbiAgICAgICAgXHJcbiAgICAgICAgb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsID0gb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsIHx8IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICggb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsICkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnN0YXRpY1NwZWVkWCA9IG9wdGlvbnMuc3RhdGljU3BlZWRYIHx8IGZhbHNlO1xyXG4gICAgICAgICAgICBvcHRpb25zLnN0YXRpY1Njcm9sbExpbWl0WCA9IHR5cGVvZihvcHRpb25zLnN0YXRpY1Njcm9sbExpbWl0WCkgIT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnN0YXRpY1Njcm9sbExpbWl0WCA6IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvcHRpb25zLmxvb3BJdFggPSBvcHRpb25zLmxvb3BJdFggfHwgZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvcHRpb25zLnJldmVyc2VEaXJlY3Rpb25YID0gb3B0aW9ucy5yZXZlcnNlRGlyZWN0aW9uWCB8fCBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSUU2IG9wdGlvbnNcclxuICAgICAgICBcclxuICAgICAgICBvcHRpb25zLmRpc2FibGVJRTYgPSBvcHRpb25zLmRpc2FibGVJRTYgfHwgZmFsc2U7IC8vIGRpc2FibGVzIGluIElFNiBhbHRvZ2V0aGVyXHJcbiAgICAgICAgb3B0aW9ucy5kaXNhYmxlSUU2QW5pbSA9IHR5cGVvZihvcHRpb25zLmRpc2FibGVJRTZBbmltKSAhPSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuZGlzYWJsZUlFNkFuaW0gOiB0cnVlOyAvLyBkaXNhYmxlcyBJRTYgYW5pbWF0aW9uLCBob3dldmVyIGJhY2tncm91bmQgd2lsbCBzdGlsbCBhcHBlbmRcclxuICAgICAgICBcclxuICAgICAgICAvLyBsYXlvdXQgb3B0aW9uc1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9wdGlvbnMuYmdXaWR0aCA9IG9wdGlvbnMuYmdXaWR0aCB8fCAob3B0aW9ucy5lbmFibGVIb3Jpem9udGFsID8gJzE1MCUnIDogJzEwMCUnICk7XHJcbiAgICAgICAgb3B0aW9ucy5iZ0hlaWdodCA9IG9wdGlvbnMuYmdIZWlnaHQgfHwgJzE1MCUnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9wdGlvbnMuYmdSZXBlYXQgPSBvcHRpb25zLmJnUmVwZWF0IHx8IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG9wdGlvbnMuYXBwZW5kSW5Gcm9udCA9IG9wdGlvbnMuYXBwZW5kSW5Gcm9udCB8fCBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBvcHRpb25zLnBhcmFsbGF4SGVpZ2h0ID0gb3B0aW9ucy5wYXJhbGxheEhlaWdodCB8fCBmYWxzZTtcclxuICAgICAgICBvcHRpb25zLnBhcmFsbGF4V2lkdGggPSBvcHRpb25zLnBhcmFsbGF4V2lkdGggfHwgZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB2YXIgaXNJRTYgPSAkLmJyb3dzZXIubXNpZSAmJiAkLmJyb3dzZXIudmVyc2lvbiA8IDcgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCBvcHRpb25zLmRpc2FibGVJRTYgJiYgaXNJRTYgKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgIHZhciAkd2luZG93ICAgPSAkKHdpbmRvdyk7XHJcbiAgICAgICAgdmFyICRib3g7XHJcblxyXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kTW9kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIG9wdGlvbnMuZW5hYmxlVmVydGljYWwgKSB7XHJcbiAgICAgICAgICAgIHZhciBib3hIZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBkb2NIZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbGxheFJvb207XHJcbiAgICAgICAgICAgIHZhciBtYXhJRTZNb3ZlID0gMDtcclxuICAgICAgICAgICAgdmFyIGxvb3BDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBzdGFydGluZ1BvcyA9IDA7XHJcbiAgICAgICAgICAgIHZhciB0b29TbWFsbE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG9sZE1vdmVJdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICggb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsICkge1xyXG4gICAgICAgICAgICB2YXIgYm94V2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dXaWR0aDtcclxuICAgICAgICAgICAgdmFyIGRvY1dpZHRoO1xyXG4gICAgICAgICAgICB2YXIgcGFyYWxsYXhSb29tWDtcclxuICAgICAgICAgICAgdmFyIG1heElFNk1vdmVYID0gMDtcclxuICAgICAgICAgICAgdmFyIGxvb3BDb3VudFggPSAwO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRpbmdQb3NYID0gMDtcclxuICAgICAgICAgICAgdmFyIHRvb1NtYWxsTW9kZVggPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG9sZE1vdmVJdFggPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpbml0KCBib3ggKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBpbml0KCBvYmovc3RyaW5nIGJveCApICAgOiAgc2V0cyB1cCB0aGUgcGFyYWxsYXggYW5kIGFzc29jaWF0ZWQgZXZlbnRzXHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCggYm94ICkge1xyXG4gICAgICAgICAgICAvLyBpZiBzdHJpbmcgYXBwZW5kIGltYWdlIGFzIGJhY2tncm91bmQsIG90aGVyd2lzZSBkZWZpbmUgYXMgalF1ZXJ5IG9iamVjdFxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiggYm94ICkgPT0gJ3N0cmluZycgKSAkYm94ID0gYXBwZW5kQmFja2dyb3VuZCggYm94ICk7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGJveCA9ICQoIGJveCApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm94LmNzcygncG9zaXRpb24nLCBpc0lFNiA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVuYWJsZVZlcnRpY2FsICkgc3RhcnRpbmdQb3MgPSBwYXJzZUludCggJGJveC5jc3MoJ3RvcCcpICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsICkgc3RhcnRpbmdQb3NYID0gcGFyc2VJbnQoICRib3guY3NzKCdsZWZ0JykgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmRpc2FibGVJRTZBbmltICYmIGlzSUU2ICkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZGVmaW5lU2l6ZXMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGlmIGluIGJhY2tncm91bmQgbW9kZSwgYW5kIHJldmVyc2VEaXJlY3Rpb24sIHRoZW4gYXR0Y2ggdGhlIGJhY2tncm91bmQgdG8gdGhlIG9wcG9zaXRlIGVuZCB0byBtYXhpbWl6ZSBzY3JvbGxpbmcgcm9vbVxyXG4gICAgICAgICAgICBpZiAoIGJhY2tncm91bmRNb2RlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLnJldmVyc2VEaXJlY3Rpb24gJiYgb3B0aW9ucy5lbmFibGVWZXJ0aWNhbCApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZ1BvcyArPSAtMSAqIHBhcmFsbGF4Um9vbTtcclxuICAgICAgICAgICAgICAgICAgICAkYm94LmNzcygndG9wJywgc3RhcnRpbmdQb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMucmV2ZXJzZURpcmVjdGlvblggJiYgb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nUG9zWCArPSAtMSAqIHBhcmFsbGF4Um9vbVg7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJveC5jc3MoJ2xlZnQnLCBzdGFydGluZ1Bvc1gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBhdHRhY2ggc2Nyb2xsIGFuZCByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkd2luZG93LnNjcm9sbCggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhbmkoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkd2luZG93LnJlc2l6ZSggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbmVTaXplcygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYXBwZW5kQmFja2dyb3VuZCggc3RyaW5nIHRoZVNyYyApICA6ICAgYXBwZW5kcyBhbiBpbWFnZSB0byB0aGUgcGFnZSBhcyBhIHN0cmV0Y2hlZCBiYWNrZ3JvdW5kXHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gYXBwZW5kQmFja2dyb3VuZCggdGhlU3JjICkge1xyXG4gICAgICAgICAgICB2YXIgYmdDc3MgPSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAgICdibG9jaycsXHJcbiAgICAgICAgICAgICAgICB0b3A6ICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogICAgIG9wdGlvbnMuYmdXaWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogICAgb3B0aW9ucy5iZ0hlaWdodCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogICAgMFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYmdDc3MucG9zaXRpb24gPSBpc0lFNiA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmJnUmVwZWF0ICkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRvYmogPSBvcHRpb25zLmFwcGVuZEluRnJvbnQgPyAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZFRvKCAkKCdib2R5JykgKSA6ICQoJzxkaXY+PC9kaXY+JykucHJlcGVuZFRvKCAkKCdib2R5JykgKTtcclxuICAgICAgICAgICAgICAgIGJnQ3NzLmJhY2tncm91bmRSZXBlYXQgPSAncmVwZWF0JztcclxuICAgICAgICAgICAgICAgIGJnQ3NzLmJhY2tncm91bmRJbWFnZSAgPSAndXJsKFwiJyArIHRoZVNyYyArICdcIiknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyICRvYmogPSBvcHRpb25zLmFwcGVuZEluRnJvbnQgPyAkKCc8aW1nIC8+JykuYXBwZW5kVG8oICQoJ2JvZHknKSApIDogJCgnPGltZyAvPicpLnByZXBlbmRUbyggJCgnYm9keScpICk7XHJcbiAgICAgICAgICAgICAgICAkb2JqLmF0dHIoJ3NyYycsIHRoZVNyYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkb2JqLmNzcyggYmdDc3MgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRNb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiAkb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBkZWZpbmVTaXplcygpICA6ICBzZXRzIHVwIHZhcmlvdXMgY29uc3RhbnRzIHVzZWQgYnkgdGhlIGFwcCAtIG11c3QgYmUgc2V0IG9uIHBhZ2UgbG9hZCBhbmQgb24gc2NyZWVuIHJlc2l6ZVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVNpemVzKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBkZWZpbmUgdmVydGljYWwgdmFyc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVuYWJsZVZlcnRpY2FsICkge1xyXG4gICAgICAgICAgICAgICAgYm94SGVpZ2h0ID0gJGJveC5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBkb2NIZWlnaHQgPSAkZG9jdW1lbnQuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHBhcmFsbGF4Um9vbSA9ICggb3B0aW9ucy5wYXJhbGxheEhlaWdodCB8fCBib3hIZWlnaHQgKSAtIHdpbmRvd0hlaWdodDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gaWYgcGFyYWxsYXggb2JqZWN0IGlzIHNtYWxsZXIgdGhhbiB3aW5kb3cgc2l6ZVxyXG4gICAgICAgICAgICAgICAgaWYgKCBwYXJhbGxheFJvb20gPCAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5zdGF0aWNTcGVlZCApIHBhcmFsbGF4Um9vbSA9IHdpbmRvd0hlaWdodCAtICBib3hIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBwYXJhbGxheFJvb20gPSBvcHRpb25zLnJldmVyc2VEaXJlY3Rpb24gPyB3aW5kb3dIZWlnaHQgLSBzdGFydGluZ1BvcyAtIGJveEhlaWdodCA6IHN0YXJ0aW5nUG9zO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRvb1NtYWxsTW9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICggaXNJRTYgJiYgIW1heElFNk1vdmUgKSBtYXhJRTZNb3ZlID0gIC0xICogKCBkb2NIZWlnaHQgLSBib3hIZWlnaHQgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmxvb3BJdCApIGxvb3BDb3VudCA9IHBhcnNlSW50KCAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgLyAoIHRvb1NtYWxsTW9kZSA/IHdpbmRvd0hlaWdodCA6IGJveEhlaWdodCApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGRlZmluZSBob3Jpem9udGFsIHZhcnNcclxuXHJcbiAgICAgICAgICAgIGlmICggb3B0aW9ucy5lbmFibGVIb3Jpem9udGFsICkge1xyXG4gICAgICAgICAgICAgICAgYm94V2lkdGggPSAkYm94LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dXaWR0aCA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIGRvY1dpZHRoID0gJGRvY3VtZW50LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHBhcmFsbGF4Um9vbVggPSAoIG9wdGlvbnMucGFyYWxsYXhXaWR0aCB8fCBib3hXaWR0aCApIC0gd2luZG93V2lkdGg7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gaWYgcGFyYWxsYXggb2JqZWN0IGlzIHNtYWxsZXIgdGhhbiB3aW5kb3cgc2l6ZVxyXG4gICAgICAgICAgICAgICAgaWYgKCBwYXJhbGxheFJvb21YIDwgMCApIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbGxheFJvb21YID0gb3B0aW9ucy5zdGF0aWNTcGVlZFggPyB3aW5kb3dXaWR0aCAtIGJveFdpZHRoIDogb3B0aW9ucy5yZXZlcnNlRGlyZWN0aW9uWCA/IHdpbmRvd1dpZHRoIC0gc3RhcnRpbmdQb3NYIC0gYm94V2lkdGggOiBzdGFydGluZ1Bvc1g7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9vU21hbGxNb2RlWCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICggaXNJRTYgJiYgIW1heElFNk1vdmVYICkgbWF4SUU2TW92ZVggPSAgLTEgKiAoIGRvY1dpZHRoIC0gYm94V2lkdGggKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmxvb3BJdFggKSBsb29wQ291bnRYID0gcGFyc2VJbnQoICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLyAoIHRvb1NtYWxsTW9kZVggPyB3aW5kb3dXaWR0aCA6IGJveFdpZHRoICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gbWFrZSBhbnkgY2hhbmdlc1xyXG4gICAgICAgICAgICBhbmkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYW5pKCkgIDogIHBlcmZvcm1zIHRoZSBhbmltYXRpb24gb2YgdGhlIG9iamVjdFxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFuaSgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGRvbnQgbGV0IG11bHRpcGxlIGFuaW1hdGlvbnMgcXVldWUgdXBcclxuICAgICAgICAgICAgJGJveC5xdWV1ZSggWyBdICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdGhlQ3NzID0ge307XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gdmVydGljYWxcclxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVuYWJsZVZlcnRpY2FsICkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBtb3ZlSXQgPSBjYWxjdWxhdGVNb3ZlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGVDc3MudG9wID0gbW92ZUl0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaG9yaXpvbnRhbFxyXG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMuZW5hYmxlSG9yaXpvbnRhbCApIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmVJdFggPSBjYWxjdWxhdGVNb3ZlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhlQ3NzLmxlZnQgPSBtb3ZlSXRYO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpZiBsYXJnZSBtb3ZlIGFuaW1hdGUgaW4gRkYsIHNhZmFyaSBhbmQgb3BlcmEgZm9yIHNtb290aGVyIHRyYW5zaXRpb25cclxuICAgICAgICAgICAgaWYgKCAhJC5icm93c2VyLm1zaWUgJiYgKCBNYXRoLmFicyggb2xkTW92ZUl0IC0gbW92ZUl0ICkgPiAxMDAgfHwgTWF0aC5hYnMoIG9sZE1vdmVJdFggLSBtb3ZlSXRYICkgPiAxMDAgKSApICRib3guYW5pbWF0ZSh0aGVDc3MsIDMwKTtcclxuICAgICAgICAgICAgZWxzZSAkYm94LmNzcyh0aGVDc3MpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb2xkTW92ZUl0ID0gbW92ZUl0O1xyXG4gICAgICAgICAgICBvbGRNb3ZlSXRYID0gbW92ZUl0WDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZU1vdmUoIGJvb2xlYW4gdmVydGljYWwgKSA6IGRldGVybWluZXMgYW1vdW50IHRvIG1vdmUgd2hldGhlciB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU1vdmUoIHZlcnRpY2FsICkge1xyXG4gICAgICAgICAgICAvLyBlc3RhYmxpc2ggdmFyaWFibGVzLCB0aGlzIGlzIGJhc2ljYWxseSBhIHN3aXRjaCBiZXR3ZWVuIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIG1vZGVzXHJcbiAgICAgICAgICAgIGlmICggdmVydGljYWwgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gICRkb2N1bWVudC5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkb2NTaXplID0gZG9jSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdmFyIHdpbmRvd1NpemUgPSB3aW5kb3dIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm94U2l6ZSA9IGJveEhlaWdodDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFsbGF4Um9vbTIgPSBwYXJhbGxheFJvb207XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBsb29wQ291bnQyID0gbG9vcENvdW50O1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0aW5nUG9zMiA9IHN0YXJ0aW5nUG9zO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFsbGF4Um9vbTIgPSBwYXJhbGxheFJvb207XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9vU21hbGxNb2RlMiA9IHRvb1NtYWxsTW9kZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXhJRTZNb3ZlMiA9IG1heElFNk1vdmU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBvcHRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VEaXJlY3Rpb24gOiBvcHRpb25zLnJldmVyc2VEaXJlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGljU3BlZWQgOiBvcHRpb25zLnN0YXRpY1NwZWVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvb3BJdCA6IG9wdGlvbnMubG9vcEl0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRpY1Njcm9sbExpbWl0IDogb3B0aW9ucy5zdGF0aWNTY3JvbGxMaW1pdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9ICRkb2N1bWVudC5zY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9jU2l6ZSA9IGRvY1dpZHRoO1xyXG4gICAgICAgICAgICAgICAgdmFyIHdpbmRvd1NpemUgPSB3aW5kb3dXaWR0aDtcclxuICAgICAgICAgICAgICAgIHZhciBib3hTaXplID0gYm94V2lkdGg7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBsb29wQ291bnQyID0gbG9vcENvdW50WDtcclxuICAgICAgICAgICAgICAgIHZhciBzdGFydGluZ1BvczIgPSBzdGFydGluZ1Bvc1g7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYWxsYXhSb29tMiA9IHBhcmFsbGF4Um9vbVg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9vU21hbGxNb2RlMiA9IHRvb1NtYWxsTW9kZVg7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF4SUU2TW92ZTIgPSBtYXhJRTZNb3ZlWDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIG9wdHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZURpcmVjdGlvbiA6IG9wdGlvbnMucmV2ZXJzZURpcmVjdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGljU3BlZWQgOiBvcHRpb25zLnN0YXRpY1NwZWVkWCxcclxuICAgICAgICAgICAgICAgICAgICBsb29wSXQgOiBvcHRpb25zLmxvb3BJdFgsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGljU2Nyb2xsTGltaXQgOiBvcHRpb25zLnN0YXRpY1Njcm9sbExpbWl0WFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvKioqIGdldCBtb3ZlIGFtb3VudCAtIHN0YXRpYyBzcGVlZCAqKiovXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIG9wdHMuc3RhdGljU3BlZWQgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW92ZSA9IG9mZnNldCAqIG9wdHMuc3RhdGljU3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gYWNjb3VudCBmb3IgbnVtYmVyIG9mIGxvb3BzXHJcbiAgICAgICAgICAgICAgICBtb3ZlIC09IHBhcmFsbGF4Um9vbTIgKiAoIGxvb3BDb3VudDIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLyoqKiBnZXQgbW92ZSBhbW91bnQgLSBhdXRvIHNwZWVkICoqKi9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gZGV0ZXJtaW5lIHBlcmNlbnRhZ2Ugb2YgcGFnZSB0aGF0IGhhcyBiZWVuIHNjcm9sbGVkIGRvd25cclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRQZXJjZW50ID0gb2Zmc2V0IC8gKCBkb2NTaXplIC0gd2luZG93U2l6ZSApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmVJdCA9ICggJC5icm93c2VyLm1zaWUgJiYgJC5icm93c2VyLnZlcnNpb24gPCA3ICkgXHJcbiAgICAgICAgICAgICAgICAgICAgPyAtMSAqICggb2Zmc2V0UGFyZW50ICogcGFyYWxsYXhSb29tICsgb2Zmc2V0VG9wIClcclxuICAgICAgICAgICAgICAgICAgICA6IC0xICogb2Zmc2V0UGVyY2VudCAqIHBhcmFsbGF4Um9vbTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBtb3ZlID0gb2Zmc2V0UGVyY2VudCAqIHBhcmFsbGF4Um9vbTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHJldmVyc2UgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgIGlmICggIW9wdHMucmV2ZXJzZURpcmVjdGlvbiApIG1vdmUgKj0gLTE7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbmNvcnBvcmF0ZSBzdGFydGluZyBwb3NpdGlvblxyXG4gICAgICAgICAgICBtb3ZlICs9IHN0YXJ0aW5nUG9zMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGlmIHN0YXRpYyBzcGVlZCBzZXQsIG1ha2Ugc3VyZSBtb3ZlIGlzIHdpdGhpbiBib3VuZHNcclxuICAgICAgICAgICAgaWYgKCBvcHRzLnN0YXRpY1NwZWVkICkgbW92ZSA9IGNoZWNrTW92ZSggbW92ZSwgdmVydGljYWwsIG9wdHMsIHBhcmFsbGF4Um9vbTIsIHRvb1NtYWxsTW9kZTIgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpZiBpbiB0b29TbWFsbE1vZGUgYW5kIGxvb3BpbmcsIGFkZCBkaWZmZXJlbmNlIG9mIHdpbmRvdyBoZWlnaHQgYW5kIGJveCBoZWlnaHQsIHNpbmNlIHRoZSBib3ggbmVlZHMgdG8gYmUgY29uY2VwdHVhbGl6ZWQgYXMgdGhhdCBtdWNoIHRhbGxlciAoIG90aGVyd2lzZSBpdCB3b3VsZCBsb29wIGluIHBsYWNlIHJhdGhlciB0aGFuIG92ZXIgdGhlIHNjcmVlbiApXHJcbiAgICAgICAgICAgIGlmICggdG9vU21hbGxNb2RlMiAmJiBvcHRzLnN0YXRpY1NwZWVkICYmIG9wdHMubG9vcEl0ICkgbW92ZSArPSB3aW5kb3dTaXplIC0gYm94U2l6ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICggaXNJRTYgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJRTYgZml4IGZvciBmaXhlZCBwb3NpdGlvbmluZ1xyXG4gICAgICAgICAgICAgICAgbW92ZSArPSBvZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBtb3ZlID0gTWF0aC5tYXgoIHBhcnNlSW50KG1vdmUpLCBwYXJzZUludChtYXhJRTZNb3ZlMikgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNoZWNrTW92ZSggaW50IG1vdmVJdCApICA6ICBjaGVja3MgdG8gZW5zdXJlIHRoYXQgbW92ZSBhbW91bnQgZG9lcyBub3QgZXhjZWVkIGVzdGFibGlzaGVkIGJvdW5kc1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTW92ZSggbW92ZSwgdmVydGljYWwsIG9wdHMsIHBhcmFsbGF4Um9vbSwgdG9vU21hbGxNb2RlICkge1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgb3ZlcmZsb3cgbGltaXRlZFxyXG4gICAgICAgICAgICBpZiAoICFvcHRzLmxvb3BJdCApIHtcclxuICAgICAgICAgICAgICAgIGlmICggb3B0cy5zdGF0aWNTY3JvbGxMaW1pdCApe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggdG9vU21hbGxNb2RlICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1vdmUgPCAwICkgbW92ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbW92ZSA+IHBhcmFsbGF4Um9vbSApIG1vdmUgPSBwYXJhbGxheFJvb207XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG1vdmUgPiAwICkgbW92ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggLTEgKiBtb3ZlID4gcGFyYWxsYXhSb29tICkgbW92ZSA9IC0xICogcGFyYWxsYXhSb29tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaWYgb3ZlcmZsb3cgbG9vcHNcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIG1vdmUgPCBwYXJhbGxheFJvb20gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZSArPSBwYXJhbGxheFJvb207XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvb3BDb3VudENoYW5nZSA9IG9wdHMucmV2ZXJzZURpcmVjdGlvbiA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHZlcnRpY2FsICkgbG9vcENvdW50ICs9IGxvb3BDb3VudENoYW5nZTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGxvb3BDb3VudFggKz0gbG9vcENvdW50Q2hhbmdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIG1vdmUgPiAoIG9wdHMucmV2ZXJzZURpcmVjdGlvbiA/IC0xIDogMCApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdmUgLT0gcGFyYWxsYXhSb29tO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb29wQ291bnRDaGFuZ2UgPSBvcHRzLnJldmVyc2VEaXJlY3Rpb24gPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2ZXJ0aWNhbCApIGxvb3BDb3VudCAtPSBsb29wQ291bnRDaGFuZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBsb29wQ291bnRYIC09IGxvb3BDb3VudENoYW5nZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJC5mbi5zY3JvbGxpbmdQYXJhbGxheCA9IGZ1bmN0aW9uICggb3B0aW9ucyApXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5lYWNoKCBmdW5jdGlvbigpIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuZXcgJC5zY3JvbGxpbmdQYXJhbGxheCggdGhpcywgb3B0aW9ucyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbn0pKCBqUXVlcnkgKTsiLCI7IChmdW5jdGlvbiAoJCkge1xyXG5cdCQuZm4ubG9hZHBhZ2UgPSBmdW5jdGlvbiAoYWN0aW9uLCBvcHRzKSB7XHJcblx0XHRhY3Rpb24gPSBhY3Rpb24gPyBhY3Rpb24gOiBcImluaXRcIjtcclxuXHRcdHZhciBwcm9ncmVzc1ZhbHVlID0gMDtcclxuXHRcdHZhciBsb2FkSHRtbCA9IFtcclxuXHRcdFx0JzxkaXYgY2xhc3M9XCJtZExvYWRpbmdcIj4nLFxyXG5cdFx0XHQnXHQ8ZGl2IGNsYXNzPVwibG9hZGluZ0JveFwiPicsXHJcblx0XHRcdCdcdFx0PGRpdiBjbGFzcz1cImxvYWRhcmVhXCI+JyxcclxuXHRcdFx0J1x0XHRcdDxkaXYgY2xhc3M9XCJ0b3BiZyBwcm9ncmVzc0JhclwiPicsXHJcblx0XHRcdCdcdFx0XHRcdDxkaXYgY2xhc3M9XCJncmFkdWFsIHRvcGdyZCBwcm9ncmVzcyBqcy1iYXJcIj48L2Rpdj4nLFxyXG5cdFx0XHQnXHRcdFx0PC9kaXY+JyxcclxuXHRcdFx0J1x0XHRcdDxkaXYgY2xhc3M9XCJib3RiZ1wiPicsXHJcblx0XHRcdCdcdFx0XHRcdDxkaXYgY2xhc3M9XCJncmFkdWFsIGJvdGdyZCBqcy1iYXIyXCI+PC9kaXY+JyxcclxuXHRcdFx0J1x0XHRcdDwvZGl2PicsXHJcblx0XHRcdCdcdFx0XHQ8aW1nIGNsYXNzPVwibGluZTJcIiBzcmM9XCIuL2ltYWdlcy9jb21wYXNzMi10ZS5wbmdcIj4nLFxyXG5cdFx0XHQnXHRcdFx0PGltZyBjbGFzcz1cInBkXCIgc3JjPVwiLi9pbWFnZXMvY29tcGFzc19wZC5wbmdcIj4nLFxyXG5cdFx0XHQnXHRcdDwvZGl2PicsXHJcblx0XHRcdCdcdFx0PGgyIGNsYXNzPVwianMtY291bnRcIj5MT0FESU5HLi4uPC9oMj4nLFxyXG5cdFx0XHQvLyAnICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzc0JhclwiPicsXHJcblx0XHRcdC8vICcgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBqcy1iYXJcIiBzdHlsZT1cIndpZHRoOjBcIj48L2Rpdj4nLFxyXG5cdFx0XHQvLyAnICAgICAgIDwvZGl2PicsXHJcblx0XHRcdCdcdDwvZGl2PicsXHJcblx0XHRcdCc8L2Rpdj4nXHJcblx0XHRdLmpvaW4oJycpO1xyXG5cdFx0dmFyIGRMb2FkLGRDb3VudCxkQmFyLGRCYXIyO1xyXG5cdFx0dmFyIGNvbmZpZyA9ICQuZXh0ZW5kKHtcclxuXHRcdFx0YXN5bmM6ZmFsc2VcclxuXHRcdH0sIG9wdHMpO1xyXG5cdFx0XHJcblx0XHRmdW5jdGlvbiBpbml0KG9iaikge1xyXG5cdFx0XHQkKGxvYWRIdG1sKS5hcHBlbmRUbygnYm9keScpO1xyXG5cdFx0XHRkTG9hZCA9IG9iai5maW5kKCcubWRMb2FkaW5nJyk7XHJcblx0XHRcdGRDb3VudCA9IGRMb2FkLmZpbmQoJy5qcy1jb3VudCcpO1xyXG5cdFx0XHRkQmFyID0gZExvYWQuZmluZCgnLmpzLWJhcicpO1xyXG5cdFx0XHRkQmFyMiA9IGRMb2FkLmZpbmQoJy5qcy1iYXIyJyk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdFx0XHRpZiAoIWNvbmZpZy5hc3luYykge1xyXG5cdFx0XHRcdFx0dmFyIHF1ZXVlID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZSgpO1xyXG5cdFx0XHRcdFx0cXVldWUuc2V0TWF4Q29ubmVjdGlvbnMoMjAwKTtcclxuXHRcdFx0XHRcdHZhciBsb2FkQXJyYXkgPSBbXTtcclxuXHRcdFx0XHRcdG9iai5maW5kKFwiaW1nXCIpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdFx0bG9hZEFycmF5LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBpLFxyXG5cdFx0XHRcdFx0XHRcdHNyYzogJCh0aGlzKS5hdHRyKFwic3JjXCIpXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHF1ZXVlLmxvYWRNYW5pZmVzdChsb2FkQXJyYXkpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgaGFuZGxlQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcihcImxvYWRDb21wbGV0ZWRcIik7XHJcblx0XHRcdFx0XHRcdCQoJy5qcy13cmFwJykuY3NzKHsgJ3Zpc2liaWxpdHknOiAndmlzaWJsZScgfSk7XHJcblx0XHRcdFx0XHRcdFR3ZWVuTWF4LmZyb21UbyhkTG9hZCwgMC41LCB7IG9wYWNpdHk6IDEgfSwge1xyXG5cdFx0XHRcdFx0XHRcdGRlbGF5OiAuOCxcclxuXHRcdFx0XHRcdFx0XHRvcGFjaXR5OiAwLCBlYXNlOiBQb3dlcjQuZWFzZU91dCwgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZExvYWQucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQod2luZG93LmxvY2F0aW9uLmhhc2gpLm9mZnNldCgpLnRvcCB9LCA1MDApO1xyXG5cdFx0XHRcdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdHF1ZXVlLm9uKFwicHJvZ3Jlc3NcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvY1ZhbHVlID0gTWF0aC5taW4oTWF0aC5jZWlsKHF1ZXVlLnByb2dyZXNzICogMTAwKSwgMTAwKTtcclxuXHRcdFx0XHRcdFx0ZENvdW50LnRleHQocHJvY1ZhbHVlICsgJyUnKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGRCYXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLScgKygxMDAtcHJvY1ZhbHVlKSArICclKSdcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0ZEJhcjIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJysgKDEwMC1wcm9jVmFsdWUpICsgJyUpIHJvdGF0ZVkoMTgwZGVnKSdcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRxdWV1ZS5vbihcImNvbXBsZXRlXCIsIGhhbmRsZUNvbXBsZXRlLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZihhY3Rpb24gPT0gJ2luaXQnKXtcclxuXHRcdFx0cmV0dXJuIGluaXQoJCh0aGlzKSk7XHRcclxuXHRcdH1cclxuXHRcdGlmIChhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cdFx0XHRkTG9hZCA9ICQodGhpcykuZmluZCgnLm1kTG9hZGluZycpO1xyXG5cdFx0XHRkQ291bnQgPSBkTG9hZC5maW5kKCcuanMtY291bnQnKTtcclxuXHRcdFx0ZEJhciA9IGRMb2FkLmZpbmQoJy5qcy1iYXInKTtcclxuXHRcdFx0ZENvdW50LnRleHQoJzEwMCUnKTtcclxuXHRcdFx0Ly8gZEJhci5jc3Moe1xyXG5cdFx0XHQvLyBcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgwJSknXHJcblx0XHRcdC8vIH0pO1xyXG5cdFx0XHQvLyBkQmFyMi5jc3Moe1xyXG5cdFx0XHQvLyBcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgwJSkgcm90YXRlWSgxODBkZWcpJ1xyXG5cdFx0XHQvLyB9KTtcclxuXHRcdFx0VHdlZW5NYXguZnJvbVRvKGRMb2FkLCAwLjUsIHsgb3BhY2l0eTogMSB9LCB7XHJcblx0XHRcdFx0ZGVsYXk6IC44LFxyXG5cdFx0XHRcdG9wYWNpdHk6IDAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRkTG9hZC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoalF1ZXJ5KTsiLCJcInVzZSBzdHJpY3RcIjshZnVuY3Rpb24obCxtKXtsKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih2LHcpe3JldHVybiBudWxsIT12JiZudWxsIT13JiZ2LnRvTG93ZXJDYXNlKCk9PT13LnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbyh2LHcpe3ZhciB4LHksej12Lmxlbmd0aDtpZighenx8IXcpcmV0dXJuITE7Zm9yKHg9dy50b0xvd2VyQ2FzZSgpLHk9MDt5PHo7Kyt5KWlmKHg9PT12W3ldLnRvTG93ZXJDYXNlKCkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gcCh2KXtmb3IodmFyIHcgaW4gdil1LmNhbGwodix3KSYmKHZbd109bmV3IFJlZ0V4cCh2W3ddLFwiaVwiKSl9ZnVuY3Rpb24gcSh2KXtyZXR1cm4odnx8XCJcIikuc3Vic3RyKDAsNTAwKX1mdW5jdGlvbiByKHYsdyl7dGhpcy51YT1xKHYpLHRoaXMuX2NhY2hlPXt9LHRoaXMubWF4UGhvbmVXaWR0aD13fHw2MDB9dmFyIHM9e21vYmlsZURldGVjdFJ1bGVzOntwaG9uZXM6e2lQaG9uZTpcIlxcXFxiaVBob25lXFxcXGJ8XFxcXGJpUG9kXFxcXGJcIixCbGFja0JlcnJ5OlwiQmxhY2tCZXJyeXxcXFxcYkJCMTBcXFxcYnxyaW1bMC05XStcIixIVEM6XCJIVEN8SFRDLiooU2Vuc2F0aW9ufEV2b3xWaXNpb258RXhwbG9yZXJ8NjgwMHw4MTAwfDg5MDB8QTcyNzJ8UzUxMGV8QzExMGV8TGVnZW5kfERlc2lyZXxUODI4Mil8QVBYNTE1Q0tUfFF0ZWs5MDkwfEFQQTkyOTJLVHxIRF9taW5pfFNlbnNhdGlvbi4qWjcxMGV8UEc4NjEwMHxaNzE1ZXxEZXNpcmUuKihBODE4MXxIRCl8QURSNjIwMHxBRFI2NDAwTHxBRFI2NDI1fDAwMUhUfEluc3BpcmUgNEd8QW5kcm9pZC4qXFxcXGJFVk9cXFxcYnxULU1vYmlsZSBHMXxaNTIwbXxBbmRyb2lkIFswLTkuXSs7IFBpeGVsXCIsTmV4dXM6XCJOZXh1cyBPbmV8TmV4dXMgU3xHYWxheHkuKk5leHVzfEFuZHJvaWQuKk5leHVzLipNb2JpbGV8TmV4dXMgNHxOZXh1cyA1fE5leHVzIDZcIixEZWxsOlwiRGVsbFs7XT8gKFN0cmVha3xBZXJvfFZlbnVlfFZlbnVlIFByb3xGbGFzaHxTbW9rZXxNaW5pIDNpWCl8WENEMjh8WENEMzV8XFxcXGIwMDFETFxcXFxifFxcXFxiMTAxRExcXFxcYnxcXFxcYkdTMDFcXFxcYlwiLE1vdG9yb2xhOlwiTW90b3JvbGF8RFJPSURYfERST0lEIEJJT05JQ3xcXFxcYkRyb2lkXFxcXGIuKkJ1aWxkfEFuZHJvaWQuKlhvb218SFJJMzl8TU9ULXxBMTI2MHxBMTY4MHxBNTU1fEE4NTN8QTg1NXxBOTUzfEE5NTV8QTk1NnxNb3Rvcm9sYS4qRUxFQ1RSSUZZfE1vdG9yb2xhLippMXxpODY3fGk5NDB8TUIyMDB8TUIzMDB8TUI1MDF8TUI1MDJ8TUI1MDh8TUI1MTF8TUI1MjB8TUI1MjV8TUI1MjZ8TUI2MTF8TUI2MTJ8TUI2MzJ8TUI4MTB8TUI4NTV8TUI4NjB8TUI4NjF8TUI4NjV8TUI4NzB8TUU1MDF8TUU1MDJ8TUU1MTF8TUU1MjV8TUU2MDB8TUU2MzJ8TUU3MjJ8TUU4MTF8TUU4NjB8TUU4NjN8TUU4NjV8TVQ2MjB8TVQ3MTB8TVQ3MTZ8TVQ3MjB8TVQ4MTB8TVQ4NzB8TVQ5MTd8TW90b3JvbGEuKlRJVEFOSVVNfFdYNDM1fFdYNDQ1fFhUMzAwfFhUMzAxfFhUMzExfFhUMzE2fFhUMzE3fFhUMzE5fFhUMzIwfFhUMzkwfFhUNTAyfFhUNTMwfFhUNTMxfFhUNTMyfFhUNTM1fFhUNjAzfFhUNjEwfFhUNjExfFhUNjE1fFhUNjgxfFhUNzAxfFhUNzAyfFhUNzExfFhUNzIwfFhUODAwfFhUODA2fFhUODYwfFhUODYyfFhUODc1fFhUODgyfFhUODgzfFhUODk0fFhUOTAxfFhUOTA3fFhUOTA5fFhUOTEwfFhUOTEyfFhUOTI4fFhUOTI2fFhUOTE1fFhUOTE5fFhUOTI1fFhUMTAyMXxcXFxcYk1vdG8gRVxcXFxifFhUMTA2OHxYVDEwOTJ8WFQxMDUyXCIsU2Ftc3VuZzpcIlxcXFxiU2Ftc3VuZ1xcXFxifFNNLUc5NTBGfFNNLUc5NTVGfFNNLUc5MjUwfEdULTE5MzAwfFNHSC1JMzM3fEJHVC1TNTIzMHxHVC1CMjEwMHxHVC1CMjcwMHxHVC1CMjcxMHxHVC1CMzIxMHxHVC1CMzMxMHxHVC1CMzQxMHxHVC1CMzczMHxHVC1CMzc0MHxHVC1CNTUxMHxHVC1CNTUxMnxHVC1CNTcyMnxHVC1CNjUyMHxHVC1CNzMwMHxHVC1CNzMyMHxHVC1CNzMzMHxHVC1CNzM1MHxHVC1CNzUxMHxHVC1CNzcyMnxHVC1CNzgwMHxHVC1DMzAxMHxHVC1DMzAxMXxHVC1DMzA2MHxHVC1DMzIwMHxHVC1DMzIxMnxHVC1DMzIxMkl8R1QtQzMyNjJ8R1QtQzMyMjJ8R1QtQzMzMDB8R1QtQzMzMDBLfEdULUMzMzAzfEdULUMzMzAzS3xHVC1DMzMxMHxHVC1DMzMyMnxHVC1DMzMzMHxHVC1DMzM1MHxHVC1DMzUwMHxHVC1DMzUxMHxHVC1DMzUzMHxHVC1DMzYzMHxHVC1DMzc4MHxHVC1DNTAxMHxHVC1DNTIxMnxHVC1DNjYyMHxHVC1DNjYyNXxHVC1DNjcxMnxHVC1FMTA1MHxHVC1FMTA3MHxHVC1FMTA3NXxHVC1FMTA4MHxHVC1FMTA4MXxHVC1FMTA4NXxHVC1FMTA4N3xHVC1FMTEwMHxHVC1FMTEwN3xHVC1FMTExMHxHVC1FMTEyMHxHVC1FMTEyNXxHVC1FMTEzMHxHVC1FMTE2MHxHVC1FMTE3MHxHVC1FMTE3NXxHVC1FMTE4MHxHVC1FMTE4MnxHVC1FMTIwMHxHVC1FMTIxMHxHVC1FMTIyNXxHVC1FMTIzMHxHVC1FMTM5MHxHVC1FMjEwMHxHVC1FMjEyMHxHVC1FMjEyMXxHVC1FMjE1MnxHVC1FMjIyMHxHVC1FMjIyMnxHVC1FMjIzMHxHVC1FMjIzMnxHVC1FMjI1MHxHVC1FMjM3MHxHVC1FMjU1MHxHVC1FMjY1MnxHVC1FMzIxMHxHVC1FMzIxM3xHVC1JNTUwMHxHVC1JNTUwM3xHVC1JNTcwMHxHVC1JNTgwMHxHVC1JNTgwMXxHVC1JNjQxMHxHVC1JNjQyMHxHVC1JNzExMHxHVC1JNzQxMHxHVC1JNzUwMHxHVC1JODAwMHxHVC1JODE1MHxHVC1JODE2MHxHVC1JODE5MHxHVC1JODMyMHxHVC1JODMzMHxHVC1JODM1MHxHVC1JODUzMHxHVC1JODcwMHxHVC1JODcwM3xHVC1JODkxMHxHVC1JOTAwMHxHVC1JOTAwMXxHVC1JOTAwM3xHVC1JOTAxMHxHVC1JOTAyMHxHVC1JOTAyM3xHVC1JOTA3MHxHVC1JOTA4MnxHVC1JOTEwMHxHVC1JOTEwM3xHVC1JOTIyMHxHVC1JOTI1MHxHVC1JOTMwMHxHVC1JOTMwNXxHVC1JOTUwMHxHVC1JOTUwNXxHVC1NMzUxMHxHVC1NNTY1MHxHVC1NNzUwMHxHVC1NNzYwMHxHVC1NNzYwM3xHVC1NODgwMHxHVC1NODkxMHxHVC1ONzAwMHxHVC1TMzExMHxHVC1TMzMxMHxHVC1TMzM1MHxHVC1TMzM1M3xHVC1TMzM3MHxHVC1TMzY1MHxHVC1TMzY1M3xHVC1TMzc3MHxHVC1TMzg1MHxHVC1TNTIxMHxHVC1TNTIyMHxHVC1TNTIyOXxHVC1TNTIzMHxHVC1TNTIzM3xHVC1TNTI1MHxHVC1TNTI1M3xHVC1TNTI2MHxHVC1TNTI2M3xHVC1TNTI3MHxHVC1TNTMwMHxHVC1TNTMzMHxHVC1TNTM1MHxHVC1TNTM2MHxHVC1TNTM2M3xHVC1TNTM2OXxHVC1TNTM4MHxHVC1TNTM4MER8R1QtUzU1NjB8R1QtUzU1NzB8R1QtUzU2MDB8R1QtUzU2MDN8R1QtUzU2MTB8R1QtUzU2MjB8R1QtUzU2NjB8R1QtUzU2NzB8R1QtUzU2OTB8R1QtUzU3NTB8R1QtUzU3ODB8R1QtUzU4MzB8R1QtUzU4Mzl8R1QtUzYxMDJ8R1QtUzY1MDB8R1QtUzcwNzB8R1QtUzcyMDB8R1QtUzcyMjB8R1QtUzcyMzB8R1QtUzcyMzN8R1QtUzcyNTB8R1QtUzc1MDB8R1QtUzc1MzB8R1QtUzc1NTB8R1QtUzc1NjJ8R1QtUzc3MTB8R1QtUzgwMDB8R1QtUzgwMDN8R1QtUzg1MDB8R1QtUzg1MzB8R1QtUzg2MDB8U0NILUEzMTB8U0NILUE1MzB8U0NILUE1NzB8U0NILUE2MTB8U0NILUE2MzB8U0NILUE2NTB8U0NILUE3OTB8U0NILUE3OTV8U0NILUE4NTB8U0NILUE4NzB8U0NILUE4OTB8U0NILUE5MzB8U0NILUE5NTB8U0NILUE5NzB8U0NILUE5OTB8U0NILUkxMDB8U0NILUkxMTB8U0NILUk0MDB8U0NILUk0MDV8U0NILUk1MDB8U0NILUk1MTB8U0NILUk1MTV8U0NILUk2MDB8U0NILUk3MzB8U0NILUk3NjB8U0NILUk3NzB8U0NILUk4MzB8U0NILUk5MTB8U0NILUk5MjB8U0NILUk5NTl8U0NILUxDMTF8U0NILU4xNTB8U0NILU4zMDB8U0NILVIxMDB8U0NILVIzMDB8U0NILVIzNTF8U0NILVI0MDB8U0NILVI0MTB8U0NILVQzMDB8U0NILVUzMTB8U0NILVUzMjB8U0NILVUzNTB8U0NILVUzNjB8U0NILVUzNjV8U0NILVUzNzB8U0NILVUzODB8U0NILVU0MTB8U0NILVU0MzB8U0NILVU0NTB8U0NILVU0NjB8U0NILVU0NzB8U0NILVU0OTB8U0NILVU1NDB8U0NILVU1NTB8U0NILVU2MjB8U0NILVU2NDB8U0NILVU2NTB8U0NILVU2NjB8U0NILVU3MDB8U0NILVU3NDB8U0NILVU3NTB8U0NILVU4MTB8U0NILVU4MjB8U0NILVU5MDB8U0NILVU5NDB8U0NILVU5NjB8U0NTLTI2VUN8U0dILUExMDd8U0dILUExMTd8U0dILUExMjd8U0dILUExMzd8U0dILUExNTd8U0dILUExNjd8U0dILUExNzd8U0dILUExODd8U0dILUExOTd8U0dILUEyMjd8U0dILUEyMzd8U0dILUEyNTd8U0dILUE0Mzd8U0dILUE1MTd8U0dILUE1OTd8U0dILUE2Mzd8U0dILUE2NTd8U0dILUE2Njd8U0dILUE2ODd8U0dILUE2OTd8U0dILUE3MDd8U0dILUE3MTd8U0dILUE3Mjd8U0dILUE3Mzd8U0dILUE3NDd8U0dILUE3Njd8U0dILUE3Nzd8U0dILUE3OTd8U0dILUE4MTd8U0dILUE4Mjd8U0dILUE4Mzd8U0dILUE4NDd8U0dILUE4Njd8U0dILUE4Nzd8U0dILUE4ODd8U0dILUE4OTd8U0dILUE5Mjd8U0dILUIxMDB8U0dILUIxMzB8U0dILUIyMDB8U0dILUIyMjB8U0dILUMxMDB8U0dILUMxMTB8U0dILUMxMjB8U0dILUMxMzB8U0dILUMxNDB8U0dILUMxNjB8U0dILUMxNzB8U0dILUMxODB8U0dILUMyMDB8U0dILUMyMDd8U0dILUMyMTB8U0dILUMyMjV8U0dILUMyMzB8U0dILUM0MTd8U0dILUM0NTB8U0dILUQzMDd8U0dILUQzNDd8U0dILUQzNTd8U0dILUQ0MDd8U0dILUQ0MTV8U0dILUQ3ODB8U0dILUQ4MDd8U0dILUQ5ODB8U0dILUUxMDV8U0dILUUyMDB8U0dILUUzMTV8U0dILUUzMTZ8U0dILUUzMTd8U0dILUUzMzV8U0dILUU1OTB8U0dILUU2MzV8U0dILUU3MTV8U0dILUU4OTB8U0dILUYzMDB8U0dILUY0ODB8U0dILUkyMDB8U0dILUkzMDB8U0dILUkzMjB8U0dILUk1NTB8U0dILUk1Nzd8U0dILUk2MDB8U0dILUk2MDd8U0dILUk2MTd8U0dILUk2Mjd8U0dILUk2Mzd8U0dILUk2Nzd8U0dILUk3MDB8U0dILUk3MTd8U0dILUk3Mjd8U0dILWk3NDdNfFNHSC1JNzc3fFNHSC1JNzgwfFNHSC1JODI3fFNHSC1JODQ3fFNHSC1JODU3fFNHSC1JODk2fFNHSC1JODk3fFNHSC1JOTAwfFNHSC1JOTA3fFNHSC1JOTE3fFNHSC1JOTI3fFNHSC1JOTM3fFNHSC1JOTk3fFNHSC1KMTUwfFNHSC1KMjAwfFNHSC1MMTcwfFNHSC1MNzAwfFNHSC1NMTEwfFNHSC1NMTUwfFNHSC1NMjAwfFNHSC1OMTA1fFNHSC1ONTAwfFNHSC1ONjAwfFNHSC1ONjIwfFNHSC1ONjI1fFNHSC1ONzAwfFNHSC1ONzEwfFNHSC1QMTA3fFNHSC1QMjA3fFNHSC1QMzAwfFNHSC1QMzEwfFNHSC1QNTIwfFNHSC1QNzM1fFNHSC1QNzc3fFNHSC1RMTA1fFNHSC1SMjEwfFNHSC1SMjIwfFNHSC1SMjI1fFNHSC1TMTA1fFNHSC1TMzA3fFNHSC1UMTA5fFNHSC1UMTE5fFNHSC1UMTM5fFNHSC1UMjA5fFNHSC1UMjE5fFNHSC1UMjI5fFNHSC1UMjM5fFNHSC1UMjQ5fFNHSC1UMjU5fFNHSC1UMzA5fFNHSC1UMzE5fFNHSC1UMzI5fFNHSC1UMzM5fFNHSC1UMzQ5fFNHSC1UMzU5fFNHSC1UMzY5fFNHSC1UMzc5fFNHSC1UNDA5fFNHSC1UNDI5fFNHSC1UNDM5fFNHSC1UNDU5fFNHSC1UNDY5fFNHSC1UNDc5fFNHSC1UNDk5fFNHSC1UNTA5fFNHSC1UNTE5fFNHSC1UNTM5fFNHSC1UNTU5fFNHSC1UNTg5fFNHSC1UNjA5fFNHSC1UNjE5fFNHSC1UNjI5fFNHSC1UNjM5fFNHSC1UNjU5fFNHSC1UNjY5fFNHSC1UNjc5fFNHSC1UNzA5fFNHSC1UNzE5fFNHSC1UNzI5fFNHSC1UNzM5fFNHSC1UNzQ2fFNHSC1UNzQ5fFNHSC1UNzU5fFNHSC1UNzY5fFNHSC1UODA5fFNHSC1UODE5fFNHSC1UODM5fFNHSC1UOTE5fFNHSC1UOTI5fFNHSC1UOTM5fFNHSC1UOTU5fFNHSC1UOTg5fFNHSC1VMTAwfFNHSC1VMjAwfFNHSC1VODAwfFNHSC1WMjA1fFNHSC1WMjA2fFNHSC1YMTAwfFNHSC1YMTA1fFNHSC1YMTIwfFNHSC1YMTQwfFNHSC1YNDI2fFNHSC1YNDI3fFNHSC1YNDc1fFNHSC1YNDk1fFNHSC1YNDk3fFNHSC1YNTA3fFNHSC1YNjAwfFNHSC1YNjEwfFNHSC1YNjIwfFNHSC1YNjMwfFNHSC1YNzAwfFNHSC1YODIwfFNHSC1YODkwfFNHSC1aMTMwfFNHSC1aMTUwfFNHSC1aMTcwfFNHSC1aWDEwfFNHSC1aWDIwfFNIVy1NMTEwfFNQSC1BMTIwfFNQSC1BNDAwfFNQSC1BNDIwfFNQSC1BNDYwfFNQSC1BNTAwfFNQSC1BNTYwfFNQSC1BNjAwfFNQSC1BNjIwfFNQSC1BNjYwfFNQSC1BNzAwfFNQSC1BNzQwfFNQSC1BNzYwfFNQSC1BNzkwfFNQSC1BODAwfFNQSC1BODIwfFNQSC1BODQwfFNQSC1BODgwfFNQSC1BOTAwfFNQSC1BOTQwfFNQSC1BOTYwfFNQSC1ENjAwfFNQSC1ENzAwfFNQSC1ENzEwfFNQSC1ENzIwfFNQSC1JMzAwfFNQSC1JMzI1fFNQSC1JMzMwfFNQSC1JMzUwfFNQSC1JNTAwfFNQSC1JNjAwfFNQSC1JNzAwfFNQSC1MNzAwfFNQSC1NMTAwfFNQSC1NMjIwfFNQSC1NMjQwfFNQSC1NMzAwfFNQSC1NMzA1fFNQSC1NMzIwfFNQSC1NMzMwfFNQSC1NMzUwfFNQSC1NMzYwfFNQSC1NMzcwfFNQSC1NMzgwfFNQSC1NNTEwfFNQSC1NNTQwfFNQSC1NNTUwfFNQSC1NNTYwfFNQSC1NNTcwfFNQSC1NNTgwfFNQSC1NNjEwfFNQSC1NNjIwfFNQSC1NNjMwfFNQSC1NODAwfFNQSC1NODEwfFNQSC1NODUwfFNQSC1NOTAwfFNQSC1NOTEwfFNQSC1NOTIwfFNQSC1NOTMwfFNQSC1OMTAwfFNQSC1OMjAwfFNQSC1OMjQwfFNQSC1OMzAwfFNQSC1ONDAwfFNQSC1aNDAwfFNXQy1FMTAwfFNDSC1pOTA5fEdULU43MTAwfEdULU43MTA1fFNDSC1JNTM1fFNNLU45MDBBfFNHSC1JMzE3fFNHSC1UOTk5THxHVC1TNTM2MEJ8R1QtSTgyNjJ8R1QtUzY4MDJ8R1QtUzYzMTJ8R1QtUzYzMTB8R1QtUzUzMTJ8R1QtUzUzMTB8R1QtSTkxMDV8R1QtSTg1MTB8R1QtUzY3OTBOfFNNLUc3MTA1fFNNLU45MDA1fEdULVM1MzAxfEdULUk5Mjk1fEdULUk5MTk1fFNNLUMxMDF8R1QtUzczOTJ8R1QtUzc1NjB8R1QtQjc2MTB8R1QtSTU1MTB8R1QtUzc1ODJ8R1QtUzc1MzBFfEdULUk4NzUwfFNNLUc5MDA2VnxTTS1HOTAwOFZ8U00tRzkwMDlEfFNNLUc5MDBBfFNNLUc5MDBEfFNNLUc5MDBGfFNNLUc5MDBIfFNNLUc5MDBJfFNNLUc5MDBKfFNNLUc5MDBLfFNNLUc5MDBMfFNNLUc5MDBNfFNNLUc5MDBQfFNNLUc5MDBSNHxTTS1HOTAwU3xTTS1HOTAwVHxTTS1HOTAwVnxTTS1HOTAwVzh8U0hWLUUxNjBLfFNDSC1QNzA5fFNDSC1QNzI5fFNNLVQyNTU4fEdULUk5MjA1fFNNLUc5MzUwfFNNLUoxMjBGfFNNLUc5MjBGfFNNLUc5MjBWfFNNLUc5MzBGfFNNLU45MTBDfFNNLUEzMTBGfEdULUk5MTkwfFNNLUo1MDBGTnxTTS1HOTAzRnxTTS1KMzMwRlwiLExHOlwiXFxcXGJMR1xcXFxiO3xMR1stIF0/KEM4MDB8QzkwMHxFNDAwfEU2MTB8RTkwMHxFLTkwMHxGMTYwfEYxODBLfEYxODBMfEYxODBTfDczMHw4NTV8TDE2MHxMUzc0MHxMUzg0MHxMUzk3MHxMVTYyMDB8TVM2OTB8TVM2OTV8TVM3NzB8TVM4NDB8TVM4NzB8TVM5MTB8UDUwMHxQNzAwfFA3MDV8Vk02OTZ8QVM2ODB8QVM2OTV8QVg4NDB8QzcyOXxFOTcwfEdTNTA1fDI3MnxDMzk1fEU3MzlCS3xFOTYwfEw1NUN8TDc1Q3xMUzY5NnxMUzg2MHxQNzY5Qkt8UDM1MHxQNTAwfFA1MDl8UDg3MHxVTjI3MnxVUzczMHxWUzg0MHxWUzk1MHxMTjI3MnxMTjUxMHxMUzY3MHxMUzg1NXxMVzY5MHxNTjI3MHxNTjUxMHxQNTA5fFA3Njl8UDkzMHxVTjIwMHxVTjI3MHxVTjUxMHxVTjYxMHxVUzY3MHxVUzc0MHxVUzc2MHxVWDI2NXxVWDg0MHxWTjI3MXxWTjUzMHxWUzY2MHxWUzcwMHxWUzc0MHxWUzc1MHxWUzkxMHxWUzkyMHxWUzkzMHxWWDkyMDB8VlgxMTAwMHxBWDg0MEF8TFc3NzB8UDUwNnxQOTI1fFA5OTl8RTYxMnxEOTU1fEQ4MDJ8TVMzMjN8TTI1NylcIixTb255OlwiU29ueVNUfFNvbnlMVHxTb255RXJpY3Nzb258U29ueUVyaWNzc29uTFQxNWl2fExUMThpfEUxMGl8TFQyOGh8TFQyNnd8U29ueUVyaWNzc29uTVQyN2l8QzUzMDN8QzY5MDJ8QzY5MDN8QzY5MDZ8QzY5NDN8RDI1MzNcIixBc3VzOlwiQXN1cy4qR2FsYXh5fFBhZEZvbmUuKk1vYmlsZVwiLE5va2lhTHVtaWE6XCJMdW1pYSBbMC05XXszLDR9XCIsTWljcm9tYXg6XCJNaWNyb21heC4qXFxcXGIoQTIxMHxBOTJ8QTg4fEE3MnxBMTExfEExMTBRfEExMTV8QTExNnxBMTEwfEE5MFN8QTI2fEE1MXxBMzV8QTU0fEEyNXxBMjd8QTg5fEE2OHxBNjV8QTU3fEE5MClcXFxcYlwiLFBhbG06XCJQYWxtU291cmNlfFBhbG1cIixWZXJ0dTpcIlZlcnR1fFZlcnR1LipMdGR8VmVydHUuKkFzY2VudHxWZXJ0dS4qQXl4dGF8VmVydHUuKkNvbnN0ZWxsYXRpb24oRnxRdWVzdCk/fFZlcnR1LipNb25pa2F8VmVydHUuKlNpZ25hdHVyZVwiLFBhbnRlY2g6XCJQQU5URUNIfElNLUE4NTBTfElNLUE4NDBTfElNLUE4MzBMfElNLUE4MzBLfElNLUE4MzBTfElNLUE4MjBMfElNLUE4MTBLfElNLUE4MTBTfElNLUE4MDBTfElNLVQxMDBLfElNLUE3MjVMfElNLUE3ODBMfElNLUE3NzVDfElNLUE3NzBLfElNLUE3NjBTfElNLUE3NTBLfElNLUE3NDBTfElNLUE3MzBTfElNLUE3MjBMfElNLUE3MTBLfElNLUE2OTBMfElNLUE2OTBTfElNLUE2NTBTfElNLUE2MzBLfElNLUE2MDBTfFZFR0EgUFRMMjF8UFQwMDN8UDgwMTB8QURSOTEwTHxQNjAzMHxQNjAyMHxQOTA3MHxQNDEwMHxQOTA2MHxQNTAwMHxDRE04OTkyfFRYVDgwNDV8QURSODk5NXxJUzExUFR8UDIwMzB8UDYwMTB8UDgwMDB8UFQwMDJ8SVMwNnxDRE04OTk5fFA5MDUwfFBUMDAxfFRYVDgwNDB8UDIwMjB8UDkwMjB8UDIwMDB8UDcwNDB8UDcwMDB8Qzc5MFwiLEZseTpcIklRMjMwfElRNDQ0fElRNDUwfElRNDQwfElRNDQyfElRNDQxfElRMjQ1fElRMjU2fElRMjM2fElRMjU1fElRMjM1fElRMjQ1fElRMjc1fElRMjQwfElRMjg1fElRMjgwfElRMjcwfElRMjYwfElRMjUwXCIsV2lrbzpcIktJVEUgNEd8SElHSFdBWXxHRVRBV0FZfFNUQUlSV0FZfERBUktTSURFfERBUktGVUxMfERBUktOSUdIVHxEQVJLTU9PTnxTTElERXxXQVggNEd8UkFJTkJPV3xCTE9PTXxTVU5TRVR8R09BKD8hbm5hKXxMRU5OWXxCQVJSWXxJR0dZfE9aWll8Q0lOSyBGSVZFfENJTksgUEVBWHxDSU5LIFBFQVggMnxDSU5LIFNMSU18Q0lOSyBTTElNIDJ8Q0lOSyArfENJTksgS0lOR3xDSU5LIFBFQVh8Q0lOSyBTTElNfFNVQkxJTVwiLGlNb2JpbGU6XCJpLW1vYmlsZSAoSVF8aS1TVFlMRXxpZGVhfFpBQXxIaXR6KVwiLFNpbVZhbGxleTpcIlxcXFxiKFNQLTgwfFhULTkzMHxTWC0zNDB8WFQtOTMwfFNYLTMxMHxTUC0zNjB8U1A2MHxTUFQtODAwfFNQLTEyMHxTUFQtODAwfFNQLTE0MHxTUFgtNXxTUFgtOHxTUC0xMDB8U1BYLTh8U1BYLTEyKVxcXFxiXCIsV29sZmdhbmc6XCJBVC1CMjREfEFULUFTNTBIRHxBVC1BUzQwV3xBVC1BUzU1SER8QVQtQVM0NXEyfEFULUIyNkR8QVQtQVM1MFFcIixBbGNhdGVsOlwiQWxjYXRlbFwiLE5pbnRlbmRvOlwiTmludGVuZG8gKDNEU3xTd2l0Y2gpXCIsQW1vaTpcIkFtb2lcIixJTlE6XCJJTlFcIixHZW5lcmljUGhvbmU6XCJUYXBhdGFsa3xQREE7fFNBR0VNfFxcXFxibW1wXFxcXGJ8cG9ja2V0fFxcXFxicHNwXFxcXGJ8c3ltYmlhbnxTbWFydHBob25lfHNtYXJ0Zm9ufHRyZW98dXAuYnJvd3Nlcnx1cC5saW5rfHZvZGFmb25lfFxcXFxid2FwXFxcXGJ8bm9raWF8U2VyaWVzNDB8U2VyaWVzNjB8UzYwfFNvbnlFcmljc3NvbnxOOTAwfE1BVUkuKldBUC4qQnJvd3NlclwifSx0YWJsZXRzOntpUGFkOlwiaVBhZHxpUGFkLipNb2JpbGVcIixOZXh1c1RhYmxldDpcIkFuZHJvaWQuKk5leHVzW1xcXFxzXSsoN3w5fDEwKVwiLEdvb2dsZVRhYmxldDpcIkFuZHJvaWQuKlBpeGVsIENcIixTYW1zdW5nVGFibGV0OlwiU0FNU1VORy4qVGFibGV0fEdhbGF4eS4qVGFifFNDLTAxQ3xHVC1QMTAwMHxHVC1QMTAwM3xHVC1QMTAxMHxHVC1QMzEwNXxHVC1QNjIxMHxHVC1QNjgwMHxHVC1QNjgxMHxHVC1QNzEwMHxHVC1QNzMwMHxHVC1QNzMxMHxHVC1QNzUwMHxHVC1QNzUxMHxTQ0gtSTgwMHxTQ0gtSTgxNXxTQ0gtSTkwNXxTR0gtSTk1N3xTR0gtSTk4N3xTR0gtVDg0OXxTR0gtVDg1OXxTR0gtVDg2OXxTUEgtUDEwMHxHVC1QMzEwMHxHVC1QMzEwOHxHVC1QMzExMHxHVC1QNTEwMHxHVC1QNTExMHxHVC1QNjIwMHxHVC1QNzMyMHxHVC1QNzUxMXxHVC1OODAwMHxHVC1QODUxMHxTR0gtSTQ5N3xTUEgtUDUwMHxTR0gtVDc3OXxTQ0gtSTcwNXxTQ0gtSTkxNXxHVC1OODAxM3xHVC1QMzExM3xHVC1QNTExM3xHVC1QODExMHxHVC1OODAxMHxHVC1OODAwNXxHVC1OODAyMHxHVC1QMTAxM3xHVC1QNjIwMXxHVC1QNzUwMXxHVC1ONTEwMHxHVC1ONTEwNXxHVC1ONTExMHxTSFYtRTE0MEt8U0hWLUUxNDBMfFNIVi1FMTQwU3xTSFYtRTE1MFN8U0hWLUUyMzBLfFNIVi1FMjMwTHxTSFYtRTIzMFN8U0hXLU0xODBLfFNIVy1NMTgwTHxTSFctTTE4MFN8U0hXLU0xODBXfFNIVy1NMzAwV3xTSFctTTMwNVd8U0hXLU0zODBLfFNIVy1NMzgwU3xTSFctTTM4MFd8U0hXLU00MzBXfFNIVy1NNDgwS3xTSFctTTQ4MFN8U0hXLU00ODBXfFNIVy1NNDg1V3xTSFctTTQ4Nld8U0hXLU01MDBXfEdULUk5MjI4fFNDSC1QNzM5fFNDSC1JOTI1fEdULUk5MjAwfEdULVA1MjAwfEdULVA1MjEwfEdULVA1MjEwWHxTTS1UMzExfFNNLVQzMTB8U00tVDMxMFh8U00tVDIxMHxTTS1UMjEwUnxTTS1UMjExfFNNLVA2MDB8U00tUDYwMXxTTS1QNjA1fFNNLVA5MDB8U00tUDkwMXxTTS1UMjE3fFNNLVQyMTdBfFNNLVQyMTdTfFNNLVA2MDAwfFNNLVQzMTAwfFNHSC1JNDY3fFhFNTAwfFNNLVQxMTB8R1QtUDUyMjB8R1QtSTkyMDBYfEdULU41MTEwWHxHVC1ONTEyMHxTTS1QOTA1fFNNLVQxMTF8U00tVDIxMDV8U00tVDMxNXxTTS1UMzIwfFNNLVQzMjBYfFNNLVQzMjF8U00tVDUyMHxTTS1UNTI1fFNNLVQ1MzBOVXxTTS1UMjMwTlV8U00tVDMzME5VfFNNLVQ5MDB8WEU1MDBUMUN8U00tUDYwNVZ8U00tUDkwNVZ8U00tVDMzN1Z8U00tVDUzN1Z8U00tVDcwN1Z8U00tVDgwN1Z8U00tUDYwMFh8U00tUDkwMFh8U00tVDIxMFh8U00tVDIzMHxTTS1UMjMwWHxTTS1UMzI1fEdULVA3NTAzfFNNLVQ1MzF8U00tVDMzMHxTTS1UNTMwfFNNLVQ3MDV8U00tVDcwNUN8U00tVDUzNXxTTS1UMzMxfFNNLVQ4MDB8U00tVDcwMHxTTS1UNTM3fFNNLVQ4MDd8U00tUDkwN0F8U00tVDMzN0F8U00tVDUzN0F8U00tVDcwN0F8U00tVDgwN0F8U00tVDIzN3xTTS1UODA3UHxTTS1QNjA3VHxTTS1UMjE3VHxTTS1UMzM3VHxTTS1UODA3VHxTTS1UMTE2TlF8U00tVDExNkJVfFNNLVA1NTB8U00tVDM1MHxTTS1UNTUwfFNNLVQ5MDAwfFNNLVA5MDAwfFNNLVQ3MDVZfFNNLVQ4MDV8R1QtUDMxMTN8U00tVDcxMHxTTS1UODEwfFNNLVQ4MTV8U00tVDM2MHxTTS1UNTMzfFNNLVQxMTN8U00tVDMzNXxTTS1UNzE1fFNNLVQ1NjB8U00tVDY3MHxTTS1UNjc3fFNNLVQzNzd8U00tVDU2N3xTTS1UMzU3VHxTTS1UNTU1fFNNLVQ1NjF8U00tVDcxM3xTTS1UNzE5fFNNLVQ4MTN8U00tVDgxOXxTTS1UNTgwfFNNLVQzNTVZP3xTTS1UMjgwfFNNLVQ4MTdBfFNNLVQ4MjB8U00tVzcwMHxTTS1QNTgwfFNNLVQ1ODd8U00tUDM1MHxTTS1QNTU1TXxTTS1QMzU1TXxTTS1UMTEzTlV8U00tVDgxNVl8U00tVDU4NXxTTS1UMjg1fFNNLVQ4MjV8U00tVzcwOFwiLEtpbmRsZTpcIktpbmRsZXxTaWxrLipBY2NlbGVyYXRlZHxBbmRyb2lkLipcXFxcYihLRk9UfEtGVFR8S0ZKV0l8S0ZKV0F8S0ZPVEV8S0ZTT1dJfEtGVEhXSXxLRlRIV0F8S0ZBUFdJfEtGQVBXQXxXRkpXQUV8S0ZTQVdBfEtGU0FXSXxLRkFTV0l8S0ZBUldJfEtGRk9XSXxLRkdJV0l8S0ZNRVdJKVxcXFxifEFuZHJvaWQuKlNpbGsvWzAtOS5dKyBsaWtlIENocm9tZS9bMC05Ll0rICg/IU1vYmlsZSlcIixTdXJmYWNlVGFibGV0OlwiV2luZG93cyBOVCBbMC05Ll0rOyBBUk07LiooVGFibGV0fEFSTUJKUylcIixIUFRhYmxldDpcIkhQIFNsYXRlICg3fDh8MTApfEhQIEVsaXRlUGFkIDkwMHxocC10YWJsZXR8RWxpdGVCb29rLipUb3VjaHxIUCA4fFNsYXRlIDIxfEhQIFNsYXRlQm9vayAxMFwiLEFzdXNUYWJsZXQ6XCJeLipQYWRGb25lKCg/IU1vYmlsZSkuKSokfFRyYW5zZm9ybWVyfFRGMTAxfFRGMTAxR3xURjMwMFR8VEYzMDBUR3xURjMwMFRMfFRGNzAwVHxURjcwMEtMfFRGNzAxVHxURjgxMEN8TUUxNzF8TUUzMDFUfE1FMzAyQ3xNRTM3MU1HfE1FMzcwVHxNRTM3Mk1HfE1FMTcyVnxNRTE3M1h8TUU0MDBDfFNsaWRlciBTTDEwMXxcXFxcYkswMEZcXFxcYnxcXFxcYkswMENcXFxcYnxcXFxcYkswMEVcXFxcYnxcXFxcYkswMExcXFxcYnxUWDIwMUxBfE1FMTc2Q3xNRTEwMkF8XFxcXGJNODBUQVxcXFxifE1FMzcyQ0x8TUU1NjBDR3xNRTM3MkNHfE1FMzAyS0x8IEswMTAgfCBLMDExIHwgSzAxNyB8IEswMUUgfE1FNTcyQ3xNRTEwM0t8TUUxNzBDfE1FMTcxQ3xcXFxcYk1FNzBDXFxcXGJ8TUU1ODFDfE1FNTgxQ0x8TUU4NTEwQ3xNRTE4MUN8UDAxWXxQTzFNQXxQMDFafFxcXFxiUDAyN1xcXFxifFxcXFxiUDAyNFxcXFxifFxcXFxiUDAwQ1xcXFxiXCIsQmxhY2tCZXJyeVRhYmxldDpcIlBsYXlCb29rfFJJTSBUYWJsZXRcIixIVEN0YWJsZXQ6XCJIVENfRmx5ZXJfUDUxMnxIVEMgRmx5ZXJ8SFRDIEpldHN0cmVhbXxIVEMtUDcxNWF8SFRDIEVWTyBWaWV3IDRHfFBHNDEyMDB8UEcwOTQxMFwiLE1vdG9yb2xhVGFibGV0OlwieG9vbXxzaG9sZXN0fE1aNjE1fE1aNjA1fE1aNTA1fE1aNjAxfE1aNjAyfE1aNjAzfE1aNjA0fE1aNjA2fE1aNjA3fE1aNjA4fE1aNjA5fE1aNjE1fE1aNjE2fE1aNjE3XCIsTm9va1RhYmxldDpcIkFuZHJvaWQuKk5vb2t8Tm9va0NvbG9yfG5vb2sgYnJvd3NlcnxCTlJWMjAwfEJOUlYyMDBBfEJOVFYyNTB8Qk5UVjI1MEF8Qk5UVjQwMHxCTlRWNjAwfExvZ2ljUEQgWm9vbTJcIixBY2VyVGFibGV0OlwiQW5kcm9pZC4qOyBcXFxcYihBMTAwfEExMDF8QTExMHxBMjAwfEEyMTB8QTIxMXxBNTAwfEE1MDF8QTUxMHxBNTExfEE3MDB8QTcwMXxXNTAwfFc1MDBQfFc1MDF8VzUwMVB8VzUxMHxXNTExfFc3MDB8RzEwMHxHMTAwV3xCMS1BNzF8QjEtNzEwfEIxLTcxMXxBMS04MTB8QTEtODExfEExLTgzMClcXFxcYnxXMy04MTB8XFxcXGJBMy1BMTBcXFxcYnxcXFxcYkEzLUExMVxcXFxifFxcXFxiQTMtQTIwXFxcXGJ8XFxcXGJBMy1BMzBcIixUb3NoaWJhVGFibGV0OlwiQW5kcm9pZC4qKEFUMTAwfEFUMTA1fEFUMjAwfEFUMjA1fEFUMjcwfEFUMjc1fEFUMzAwfEFUMzA1fEFUMVM1fEFUNTAwfEFUNTcwfEFUNzAwfEFUODMwKXxUT1NISUJBLipGT0xJT1wiLExHVGFibGV0OlwiXFxcXGJMLTA2Q3xMRy1WOTA5fExHLVY5MDB8TEctVjcwMHxMRy1WNTEwfExHLVY1MDB8TEctVjQxMHxMRy1WNDAwfExHLVZLODEwXFxcXGJcIixGdWppdHN1VGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoRi0wMUR8Ri0wMkZ8Ri0wNUV8Ri0xMER8TTUzMnxRNTcyKVxcXFxiXCIsUHJlc3RpZ2lvVGFibGV0OlwiUE1QMzE3MEJ8UE1QMzI3MEJ8UE1QMzQ3MEJ8UE1QNzE3MEJ8UE1QMzM3MEJ8UE1QMzU3MEN8UE1QNTg3MEN8UE1QMzY3MEJ8UE1QNTU3MEN8UE1QNTc3MER8UE1QMzk3MEJ8UE1QMzg3MEN8UE1QNTU4MEN8UE1QNTg4MER8UE1QNTc4MER8UE1QNTU4OEN8UE1QNzI4MEN8UE1QNzI4MEMzR3xQTVA3MjgwfFBNUDc4ODBEfFBNUDU1OTdEfFBNUDU1OTd8UE1QNzEwMER8UEVSMzQ2NHxQRVIzMjc0fFBFUjM1NzR8UEVSMzg4NHxQRVI1Mjc0fFBFUjU0NzR8UE1QNTA5N0NQUk98UE1QNTA5N3xQTVA3MzgwRHxQTVA1Mjk3Q3xQTVA1Mjk3Q19RVUFEfFBNUDgxMkV8UE1QODEyRTNHfFBNUDgxMkZ8UE1QODEwRXxQTVA4ODBURHxQTVQzMDE3fFBNVDMwMzd8UE1UMzA0N3xQTVQzMDU3fFBNVDcwMDh8UE1UNTg4N3xQTVQ1MDAxfFBNVDUwMDJcIixMZW5vdm9UYWJsZXQ6XCJMZW5vdm8gVEFCfElkZWEoVGFifFBhZCkoIEExfEExMHwgSzF8KXxUaGlua1BhZChbIF0rKT9UYWJsZXR8WVQzLTg1ME18WVQzLVg5MEx8WVQzLVg5MEZ8WVQzLVg5MFh8TGVub3ZvLiooUzIxMDl8UzIxMTB8UzUwMDB8UzYwMDB8SzMwMTF8QTMwMDB8QTM1MDB8QTEwMDB8QTIxMDd8QTIxMDl8QTExMDd8QTU1MDB8QTc2MDB8QjYwMDB8QjgwMDB8QjgwODApKC18KShGTHxGfEhWfEh8KXxUQi1YMTAzRnxUQi1YMzA0RnxUQi1YMzA0THxUQi04NzAzRnxUYWIyQTctMTBGXCIsRGVsbFRhYmxldDpcIlZlbnVlIDExfFZlbnVlIDh8VmVudWUgN3xEZWxsIFN0cmVhayAxMHxEZWxsIFN0cmVhayA3XCIsWWFydmlrVGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoVEFCMjEwfFRBQjIxMXxUQUIyMjR8VEFCMjUwfFRBQjI2MHxUQUIyNjR8VEFCMzEwfFRBQjM2MHxUQUIzNjR8VEFCNDEwfFRBQjQxMXxUQUI0MjB8VEFCNDI0fFRBQjQ1MHxUQUI0NjB8VEFCNDYxfFRBQjQ2NHxUQUI0NjV8VEFCNDY3fFRBQjQ2OHxUQUIwNy0xMDB8VEFCMDctMTAxfFRBQjA3LTE1MHxUQUIwNy0xNTF8VEFCMDctMTUyfFRBQjA3LTIwMHxUQUIwNy0yMDEtM0d8VEFCMDctMjEwfFRBQjA3LTIxMXxUQUIwNy0yMTJ8VEFCMDctMjE0fFRBQjA3LTIyMHxUQUIwNy00MDB8VEFCMDctNDg1fFRBQjA4LTE1MHxUQUIwOC0yMDB8VEFCMDgtMjAxLTNHfFRBQjA4LTIwMS0zMHxUQUIwOS0xMDB8VEFCMDktMjExfFRBQjA5LTQxMHxUQUIxMC0xNTB8VEFCMTAtMjAxfFRBQjEwLTIxMXxUQUIxMC00MDB8VEFCMTAtNDEwfFRBQjEzLTIwMXxUQUIyNzRFVUt8VEFCMjc1RVVLfFRBQjM3NEVVS3xUQUI0NjJFVUt8VEFCNDc0RVVLfFRBQjktMjAwKVxcXFxiXCIsTWVkaW9uVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJPWU9cXFxcYnxMSUZFLiooUDkyMTJ8UDk1MTR8UDk1MTZ8Uzk1MTIpfExJRkVUQUJcIixBcm5vdmFUYWJsZXQ6XCI5N0c0fEFOMTBHMnxBTjdiRzN8QU43ZkczfEFOOEczfEFOOGNHM3xBTjdHM3xBTjlHM3xBTjdkRzN8QU43ZEczU1R8QU43ZEczQ2hpbGRQYWR8QU4xMGJHM3xBTjEwYkczRFR8QU45RzJcIixJbnRlbnNvVGFibGV0OlwiSU5NODAwMktQfElOTTEwMTBGUHxJTk04MDVORHxJbnRlbnNvIFRhYnxUQUIxMDA0XCIsSVJVVGFibGV0OlwiTTcwMnByb1wiLE1lZ2Fmb25UYWJsZXQ6XCJNZWdhRm9uIFY5fFxcXFxiWlRFIFY5XFxcXGJ8QW5kcm9pZC4qXFxcXGJNVDdBXFxcXGJcIixFYm9kYVRhYmxldDpcIkUtQm9kYSAoU3VwcmVtZXxJbXByZXNzcGVlZHxJenp5Y29tbXxFc3NlbnRpYWwpXCIsQWxsVmlld1RhYmxldDpcIkFsbHZpZXcuKihWaXZhfEFsbGRyb3xDaXR5fFNwZWVkfEFsbCBUVnxGcmVuenl8UXVhc2FyfFNoaW5lfFRYMXxBWDF8QVgyKVwiLEFyY2hvc1RhYmxldDpcIlxcXFxiKDEwMUc5fDgwRzl8QTEwMUlUKVxcXFxifFFpbGl2ZSA5N1J8QXJjaG9zNXxcXFxcYkFSQ0hPUyAoNzB8Nzl8ODB8OTB8OTd8MTAxfEZBTUlMWVBBRHwpKGJ8Y3wpKEcxMHwgQ29iYWx0fCBUSVRBTklVTShIRHwpfCBYZW5vbnwgTmVvbnxYU0t8IDJ8IFhTIDJ8IFBMQVRJTlVNfCBDQVJCT058R0FNRVBBRClcXFxcYlwiLEFpbm9sVGFibGV0OlwiTk9WTzd8Tk9WTzh8Tk9WTzEwfE5vdm83QXVyb3JhfE5vdm83QmFzaWN8Tk9WTzdQQUxBRElOfG5vdm85LVNwYXJrXCIsTm9raWFMdW1pYVRhYmxldDpcIkx1bWlhIDI1MjBcIixTb255VGFibGV0OlwiU29ueS4qVGFibGV0fFhwZXJpYSBUYWJsZXR8U29ueSBUYWJsZXQgU3xTTy0wM0V8U0dQVDEyfFNHUFQxM3xTR1BUMTE0fFNHUFQxMjF8U0dQVDEyMnxTR1BUMTIzfFNHUFQxMTF8U0dQVDExMnxTR1BUMTEzfFNHUFQxMzF8U0dQVDEzMnxTR1BUMTMzfFNHUFQyMTF8U0dQVDIxMnxTR1BUMjEzfFNHUDMxMXxTR1AzMTJ8U0dQMzIxfEVCUkQxMTAxfEVCUkQxMTAyfEVCUkQxMjAxfFNHUDM1MXxTR1AzNDF8U0dQNTExfFNHUDUxMnxTR1A1MjF8U0dQNTQxfFNHUDU1MXxTR1A2MjF8U0dQNjEyfFNPVDMxXCIsUGhpbGlwc1RhYmxldDpcIlxcXFxiKFBJMjAxMHxQSTMwMDB8UEkzMTAwfFBJMzEwNXxQSTMxMTB8UEkzMjA1fFBJMzIxMHxQSTM5MDB8UEk0MDEwfFBJNzAwMHxQSTcxMDApXFxcXGJcIixDdWJlVGFibGV0OlwiQW5kcm9pZC4qKEs4R1R8VTlHVHxVMTBHVHxVMTZHVHxVMTdHVHxVMThHVHxVMTlHVHxVMjBHVHxVMjNHVHxVMzBHVCl8Q1VCRSBVOEdUXCIsQ29ieVRhYmxldDpcIk1JRDEwNDJ8TUlEMTA0NXxNSUQxMTI1fE1JRDExMjZ8TUlENzAxMnxNSUQ3MDE0fE1JRDcwMTV8TUlENzAzNHxNSUQ3MDM1fE1JRDcwMzZ8TUlENzA0MnxNSUQ3MDQ4fE1JRDcxMjd8TUlEODA0MnxNSUQ4MDQ4fE1JRDgxMjd8TUlEOTA0MnxNSUQ5NzQwfE1JRDk3NDJ8TUlENzAyMnxNSUQ3MDEwXCIsTUlEVGFibGV0OlwiTTk3MDF8TTkwMDB8TTkxMDB8TTgwNnxNMTA1MnxNODA2fFQ3MDN8TUlENzAxfE1JRDcxM3xNSUQ3MTB8TUlENzI3fE1JRDc2MHxNSUQ4MzB8TUlENzI4fE1JRDkzM3xNSUQxMjV8TUlEODEwfE1JRDczMnxNSUQxMjB8TUlEOTMwfE1JRDgwMHxNSUQ3MzF8TUlEOTAwfE1JRDEwMHxNSUQ4MjB8TUlENzM1fE1JRDk4MHxNSUQxMzB8TUlEODMzfE1JRDczN3xNSUQ5NjB8TUlEMTM1fE1JRDg2MHxNSUQ3MzZ8TUlEMTQwfE1JRDkzMHxNSUQ4MzV8TUlENzMzfE1JRDRYMTBcIixNU0lUYWJsZXQ6XCJNU0kgXFxcXGIoUHJpbW8gNzNLfFByaW1vIDczTHxQcmltbyA4MUx8UHJpbW8gNzd8UHJpbW8gOTN8UHJpbW8gNzV8UHJpbW8gNzZ8UHJpbW8gNzN8UHJpbW8gODF8UHJpbW8gOTF8UHJpbW8gOTB8RW5qb3kgNzF8RW5qb3kgN3xFbmpveSAxMClcXFxcYlwiLFNNaVRUYWJsZXQ6XCJBbmRyb2lkLiooXFxcXGJNSURcXFxcYnxNSUQtNTYwfE1UVi1UMTIwMHxNVFYtUE5ENTMxfE1UVi1QMTEwMXxNVFYtUE5ENTMwKVwiLFJvY2tDaGlwVGFibGV0OlwiQW5kcm9pZC4qKFJLMjgxOHxSSzI4MDhBfFJLMjkxOHxSSzMwNjYpfFJLMjczOHxSSzI4MDhBXCIsRmx5VGFibGV0OlwiSVEzMTB8Rmx5IFZpc2lvblwiLGJxVGFibGV0OlwiQW5kcm9pZC4qKGJxKT8uKihFbGNhbm98Q3VyaWV8RWRpc29ufE1heHdlbGx8S2VwbGVyfFBhc2NhbHxUZXNsYXxIeXBhdGlhfFBsYXRvbnxOZXd0b258TGl2aW5nc3RvbmV8Q2VydmFudGVzfEF2YW50fEFxdWFyaXMgKFtFfE1dMTB8TTgpKXxNYXh3ZWxsLipMaXRlfE1heHdlbGwuKlBsdXNcIixIdWF3ZWlUYWJsZXQ6XCJNZWRpYVBhZHxNZWRpYVBhZCA3IFlvdXRofElERU9TIFM3fFM3LTIwMWN8UzctMjAydXxTNy0xMDF8UzctMTAzfFM3LTEwNHxTNy0xMDV8UzctMTA2fFM3LTIwMXxTNy1TbGltfE0yLUEwMUx8QkFILUwwOXxCQUgtVzA5XCIsTmVjVGFibGV0OlwiXFxcXGJOLTA2RHxcXFxcYk4tMDhEXCIsUGFudGVjaFRhYmxldDpcIlBhbnRlY2guKlA0MTAwXCIsQnJvbmNob1RhYmxldDpcIkJyb25jaG8uKihONzAxfE43MDh8TjgwMnxhNzEwKVwiLFZlcnN1c1RhYmxldDpcIlRPVUNIUEFELipbNzg5MTBdfFxcXFxiVE9VQ0hUQUJcXFxcYlwiLFp5bmNUYWJsZXQ6XCJ6MTAwMHxaOTkgMkd8ejk5fHo5MzB8ejk5OXx6OTkwfHo5MDl8WjkxOXx6OTAwXCIsUG9zaXRpdm9UYWJsZXQ6XCJUQjA3U1RBfFRCMTBTVEF8VEIwN0ZUQXxUQjEwRlRBXCIsTmFiaVRhYmxldDpcIkFuZHJvaWQuKlxcXFxiTmFiaVwiLEtvYm9UYWJsZXQ6XCJLb2JvIFRvdWNofFxcXFxiSzA4MFxcXFxifFxcXFxiVm94XFxcXGIgQnVpbGR8XFxcXGJBcmNcXFxcYiBCdWlsZFwiLERhbmV3VGFibGV0OlwiRFNsaWRlLipcXFxcYig3MDB8NzAxUnw3MDJ8NzAzUnw3MDR8ODAyfDk3MHw5NzF8OTcyfDk3M3w5NzR8MTAxMHwxMDEyKVxcXFxiXCIsVGV4ZXRUYWJsZXQ6XCJOYXZpUGFkfFRCLTc3MkF8VE0tNzA0NXxUTS03MDU1fFRNLTk3NTB8VE0tNzAxNnxUTS03MDI0fFRNLTcwMjZ8VE0tNzA0MXxUTS03MDQzfFRNLTcwNDd8VE0tODA0MXxUTS05NzQxfFRNLTk3NDd8VE0tOTc0OHxUTS05NzUxfFRNLTcwMjJ8VE0tNzAyMXxUTS03MDIwfFRNLTcwMTF8VE0tNzAxMHxUTS03MDIzfFRNLTcwMjV8VE0tNzAzN1d8VE0tNzAzOFd8VE0tNzAyN1d8VE0tOTcyMHxUTS05NzI1fFRNLTk3MzdXfFRNLTEwMjB8VE0tOTczOFd8VE0tOTc0MHxUTS05NzQzV3xUQi04MDdBfFRCLTc3MUF8VEItNzI3QXxUQi03MjVBfFRCLTcxOUF8VEItODIzQXxUQi04MDVBfFRCLTcyM0F8VEItNzE1QXxUQi03MDdBfFRCLTcwNUF8VEItNzA5QXxUQi03MTFBfFRCLTg5MEhEfFRCLTg4MEhEfFRCLTc5MEhEfFRCLTc4MEhEfFRCLTc3MEhEfFRCLTcyMUhEfFRCLTcxMEhEfFRCLTQzNEhEfFRCLTg2MEhEfFRCLTg0MEhEfFRCLTc2MEhEfFRCLTc1MEhEfFRCLTc0MEhEfFRCLTczMEhEfFRCLTcyMkhEfFRCLTcyMEhEfFRCLTcwMEhEfFRCLTUwMEhEfFRCLTQ3MEhEfFRCLTQzMUhEfFRCLTQzMEhEfFRCLTUwNnxUQi01MDR8VEItNDQ2fFRCLTQzNnxUQi00MTZ8VEItMTQ2U0V8VEItMTI2U0VcIixQbGF5c3RhdGlvblRhYmxldDpcIlBsYXlzdGF0aW9uLiooUG9ydGFibGV8Vml0YSlcIixUcmVrc3RvclRhYmxldDpcIlNUMTA0MTYtMXxWVDEwNDE2LTF8U1Q3MDQwOC0xfFNUNzAyeHgtMXxTVDcwMnh4LTJ8U1Q4MDIwOHxTVDk3MjE2fFNUNzAxMDQtMnxWVDEwNDE2LTJ8U1QxMDIxNi0yQXxTdXJmVGFiXCIsUHlsZUF1ZGlvVGFibGV0OlwiXFxcXGIoUFRCTDEwQ0VVfFBUQkwxMEN8UFRCTDcyQkN8UFRCTDcyQkNFVXxQVEJMN0NFVXxQVEJMN0N8UFRCTDkyQkN8UFRCTDkyQkNFVXxQVEJMOUNFVXxQVEJMOUNVS3xQVEJMOUMpXFxcXGJcIixBZHZhblRhYmxldDpcIkFuZHJvaWQuKiBcXFxcYihFM0F8VDNYfFQ1Q3xUNUJ8VDNFfFQzQ3xUM0J8VDFKfFQxRnxUMkF8VDFIfFQxaXxFMUN8VDEtRXxUNS1BfFQ0fEUxLUJ8VDJDaXxUMS1CfFQxLUR8TzEtQXxFMS1BfFQxLUF8VDNBfFQ0aSlcXFxcYiBcIixEYW55VGVjaFRhYmxldDpcIkdlbml1cyBUYWIgRzN8R2VuaXVzIFRhYiBTMnxHZW5pdXMgVGFiIFEzfEdlbml1cyBUYWIgRzR8R2VuaXVzIFRhYiBRNHxHZW5pdXMgVGFiIEctSUl8R2VuaXVzIFRBQiBHSUl8R2VuaXVzIFRBQiBHSUlJfEdlbml1cyBUYWIgUzFcIixHYWxhcGFkVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJHMVxcXFxiXCIsTWljcm9tYXhUYWJsZXQ6XCJGdW5ib29rfE1pY3JvbWF4LipcXFxcYihQMjUwfFA1NjB8UDM2MHxQMzYyfFA2MDB8UDMwMHxQMzUwfFA1MDB8UDI3NSlcXFxcYlwiLEthcmJvbm5UYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihBMzl8QTM3fEEzNHxTVDh8U1QxMHxTVDd8U21hcnQgVGFiM3xTbWFydCBUYWIyKVxcXFxiXCIsQWxsRmluZVRhYmxldDpcIkZpbmU3IEdlbml1c3xGaW5lNyBTaGluZXxGaW5lNyBBaXJ8RmluZTggU3R5bGV8RmluZTkgTW9yZXxGaW5lMTAgSm95fEZpbmUxMSBXaWRlXCIsUFJPU0NBTlRhYmxldDpcIlxcXFxiKFBFTTYzfFBMVDEwMjNHfFBMVDEwNDF8UExUMTA0NHxQTFQxMDQ0R3xQTFQxMDkxfFBMVDQzMTF8UExUNDMxMVBMfFBMVDQzMTV8UExUNzAzMHxQTFQ3MDMzfFBMVDcwMzNEfFBMVDcwMzV8UExUNzAzNUR8UExUNzA0NEt8UExUNzA0NUt8UExUNzA0NUtCfFBMVDcwNzFLR3xQTFQ3MDcyfFBMVDcyMjNHfFBMVDcyMjVHfFBMVDc3NzdHfFBMVDc4MTBLfFBMVDc4NDlHfFBMVDc4NTFHfFBMVDc4NTJHfFBMVDgwMTV8UExUODAzMXxQTFQ4MDM0fFBMVDgwMzZ8UExUODA4MEt8UExUODA4MnxQTFQ4MDg4fFBMVDgyMjNHfFBMVDgyMzRHfFBMVDgyMzVHfFBMVDg4MTZLfFBMVDkwMTF8UExUOTA0NUt8UExUOTIzM0d8UExUOTczNXxQTFQ5NzYwR3xQTFQ5NzcwRylcXFxcYlwiLFlPTkVTVGFibGV0OlwiQlExMDc4fEJDMTAwM3xCQzEwNzd8Uks5NzAyfEJDOTczMHxCQzkwMDF8SVQ5MDAxfEJDNzAwOHxCQzcwMTB8QkM3MDh8QkM3Mjh8QkM3MDEyfEJDNzAzMHxCQzcwMjd8QkM3MDI2XCIsQ2hhbmdKaWFUYWJsZXQ6XCJUUEM3MTAyfFRQQzcxMDN8VFBDNzEwNXxUUEM3MTA2fFRQQzcxMDd8VFBDNzIwMXxUUEM3MjAzfFRQQzcyMDV8VFBDNzIxMHxUUEM3NzA4fFRQQzc3MDl8VFBDNzcxMnxUUEM3MTEwfFRQQzgxMDF8VFBDODEwM3xUUEM4MTA1fFRQQzgxMDZ8VFBDODIwM3xUUEM4MjA1fFRQQzg1MDN8VFBDOTEwNnxUUEM5NzAxfFRQQzk3MTAxfFRQQzk3MTAzfFRQQzk3MTA1fFRQQzk3MTA2fFRQQzk3MTExfFRQQzk3MTEzfFRQQzk3MjAzfFRQQzk3NjAzfFRQQzk3ODA5fFRQQzk3MjA1fFRQQzEwMTAxfFRQQzEwMTAzfFRQQzEwMTA2fFRQQzEwMTExfFRQQzEwMjAzfFRQQzEwMjA1fFRQQzEwNTAzXCIsR1VUYWJsZXQ6XCJUWC1BMTMwMXxUWC1NOTAwMnxRNzAyfGtmMDI2XCIsUG9pbnRPZlZpZXdUYWJsZXQ6XCJUQUItUDUwNnxUQUItbmF2aS03LTNHLU18VEFCLVA1MTd8VEFCLVAtNTI3fFRBQi1QNzAxfFRBQi1QNzAzfFRBQi1QNzIxfFRBQi1QNzMxTnxUQUItUDc0MXxUQUItUDgyNXxUQUItUDkwNXxUQUItUDkyNXxUQUItUFI5NDV8VEFCLVBMMTAxNXxUQUItUDEwMjV8VEFCLVBJMTA0NXxUQUItUDEzMjV8VEFCLVBST1RBQlswLTldK3xUQUItUFJPVEFCMjV8VEFCLVBST1RBQjI2fFRBQi1QUk9UQUIyN3xUQUItUFJPVEFCMjZYTHxUQUItUFJPVEFCMi1JUFM5fFRBQi1QUk9UQUIzMC1JUFM5fFRBQi1QUk9UQUIyNVhYTHxUQUItUFJPVEFCMjYtSVBTMTB8VEFCLVBST1RBQjMwLUlQUzEwXCIsT3Zlcm1heFRhYmxldDpcIk9WLShTdGVlbENvcmV8TmV3QmFzZXxCYXNlY29yZXxCYXNlb25lfEV4ZWxsZW58UXVhdHRvcnxFZHVUYWJ8U29sdXRpb258QUNUSU9OfEJhc2ljVGFifFRlZGR5VGFifE1hZ2ljVGFifFN0cmVhbXxUQi0wOHxUQi0wOSl8UXVhbGNvcmUgMTAyN1wiLEhDTFRhYmxldDpcIkhDTC4qVGFibGV0fENvbm5lY3QtM0ctMi4wfENvbm5lY3QtMkctMi4wfE1FIFRhYmxldCBVMXxNRSBUYWJsZXQgVTJ8TUUgVGFibGV0IEcxfE1FIFRhYmxldCBYMXxNRSBUYWJsZXQgWTJ8TUUgVGFibGV0IFN5bmNcIixEUFNUYWJsZXQ6XCJEUFMgRHJlYW0gOXxEUFMgRHVhbCA3XCIsVmlzdHVyZVRhYmxldDpcIlY5NyBIRHxpNzUgM0d8VmlzdHVyZSBWNCggSEQpP3xWaXN0dXJlIFY1KCBIRCk/fFZpc3R1cmUgVjEwXCIsQ3Jlc3RhVGFibGV0OlwiQ1RQKC0pPzgxMHxDVFAoLSk/ODE4fENUUCgtKT84Mjh8Q1RQKC0pPzgzOHxDVFAoLSk/ODg4fENUUCgtKT85Nzh8Q1RQKC0pPzk4MHxDVFAoLSk/OTg3fENUUCgtKT85ODh8Q1RQKC0pPzk4OVwiLE1lZGlhdGVrVGFibGV0OlwiXFxcXGJNVDgxMjV8TVQ4Mzg5fE1UODEzNXxNVDgzNzdcXFxcYlwiLENvbmNvcmRlVGFibGV0OlwiQ29uY29yZGUoWyBdKyk/VGFifENvbkNvcmRlIFJlYWRNYW5cIixHb0NsZXZlclRhYmxldDpcIkdPQ0xFVkVSIFRBQnxBN0dPQ0xFVkVSfE0xMDQyfE03ODQxfE03NDJ8UjEwNDJCS3xSMTA0MXxUQUIgQTk3NXxUQUIgQTc4NDJ8VEFCIEE3NDF8VEFCIEE3NDFMfFRBQiBNNzIzR3xUQUIgTTcyMXxUQUIgQTEwMjF8VEFCIEk5MjF8VEFCIFI3MjF8VEFCIEk3MjB8VEFCIFQ3NnxUQUIgUjcwfFRBQiBSNzYuMnxUQUIgUjEwNnxUQUIgUjgzLjJ8VEFCIE04MTNHfFRBQiBJNzIxfEdDVEE3MjJ8VEFCIEk3MHxUQUIgSTcxfFRBQiBTNzN8VEFCIFI3M3xUQUIgUjc0fFRBQiBSOTN8VEFCIFI3NXxUQUIgUjc2LjF8VEFCIEE3M3xUQUIgQTkzfFRBQiBBOTMuMnxUQUIgVDcyfFRBQiBSODN8VEFCIFI5NzR8VEFCIFI5NzN8VEFCIEExMDF8VEFCIEExMDN8VEFCIEExMDR8VEFCIEExMDQuMnxSMTA1Qkt8TTcxM0d8QTk3MkJLfFRBQiBBOTcxfFRBQiBSOTc0LjJ8VEFCIFIxMDR8VEFCIFI4My4zfFRBQiBBMTA0MlwiLE1vZGVjb21UYWJsZXQ6XCJGcmVlVEFCIDkwMDB8RnJlZVRBQiA3LjR8RnJlZVRBQiA3MDA0fEZyZWVUQUIgNzgwMHxGcmVlVEFCIDIwOTZ8RnJlZVRBQiA3LjV8RnJlZVRBQiAxMDE0fEZyZWVUQUIgMTAwMSB8RnJlZVRBQiA4MDAxfEZyZWVUQUIgOTcwNnxGcmVlVEFCIDk3MDJ8RnJlZVRBQiA3MDAzfEZyZWVUQUIgNzAwMnxGcmVlVEFCIDEwMDJ8RnJlZVRBQiA3ODAxfEZyZWVUQUIgMTMzMXxGcmVlVEFCIDEwMDR8RnJlZVRBQiA4MDAyfEZyZWVUQUIgODAxNHxGcmVlVEFCIDk3MDR8RnJlZVRBQiAxMDAzXCIsVm9uaW5vVGFibGV0OlwiXFxcXGIoQXJndXNbIF9dP1N8RGlhbW9uZFsgX10/NzlIRHxFbWVyYWxkWyBfXT83OEV8THVuYVsgX10/NzBDfE9ueXhbIF9dP1N8T255eFsgX10/WnxPcmluWyBfXT9IRHxPcmluWyBfXT9TfE90aXNbIF9dP1N8U3BlZWRTdGFyWyBfXT9TfE1hZ25ldFsgX10/TTl8UHJpbXVzWyBfXT85NFsgX10/M0d8UHJpbXVzWyBfXT85NEhEfFByaW11c1sgX10/UVN8QW5kcm9pZC4qXFxcXGJROFxcXFxifFNpcml1c1sgX10/RVZPWyBfXT9RU3xTaXJpdXNbIF9dP1FTfFNwaXJpdFsgX10/UylcXFxcYlwiLEVDU1RhYmxldDpcIlYwN09UMnxUTTEwNUF8UzEwT1QxfFRSMTBDUzFcIixTdG9yZXhUYWJsZXQ6XCJlWmVlW18nXT8oVGFifEdvKVswLTldK3xUYWJMQzd8TG9vbmV5IFR1bmVzIFRhYlwiLFZvZGFmb25lVGFibGV0OlwiU21hcnRUYWIoWyBdKyk/WzAtOV0rfFNtYXJ0VGFiSUkxMHxTbWFydFRhYklJN3xWRi0xNDk3XCIsRXNzZW50aWVsQlRhYmxldDpcIlNtYXJ0WyAnXT9UQUJbIF0rP1swLTldK3xGYW1pbHlbICddP1RBQjJcIixSb3NzTW9vclRhYmxldDpcIlJNLTc5MHxSTS05OTd8Uk1ELTg3OEd8Uk1ELTk3NFJ8Uk1ULTcwNUF8Uk1ULTcwMXxSTUUtNjAxfFJNVC01MDF8Uk1ULTcxMVwiLGlNb2JpbGVUYWJsZXQ6XCJpLW1vYmlsZSBpLW5vdGVcIixUb2xpbm9UYWJsZXQ6XCJ0b2xpbm8gdGFiIFswLTkuXSt8dG9saW5vIHNoaW5lXCIsQXVkaW9Tb25pY1RhYmxldDpcIlxcXFxiQy0yMlF8VDctUUN8VC0xN0J8VC0xN1BcXFxcYlwiLEFNUEVUYWJsZXQ6XCJBbmRyb2lkLiogQTc4IFwiLFNra1RhYmxldDpcIkFuZHJvaWQuKiAoU0tZUEFEfFBIT0VOSVh8Q1lDTE9QUylcIixUZWNub1RhYmxldDpcIlRFQ05PIFA5fFRFQ05PIERQOERcIixKWERUYWJsZXQ6XCJBbmRyb2lkLiogXFxcXGIoRjMwMDB8QTMzMDB8SlhENTAwMHxKWEQzMDAwfEpYRDIwMDB8SlhEMzAwQnxKWEQzMDB8UzU4MDB8Uzc4MDB8UzYwMmJ8UzUxMTBifFM3MzAwfFM1MzAwfFM2MDJ8UzYwM3xTNTEwMHxTNTExMHxTNjAxfFM3MTAwYXxQMzAwMEZ8UDMwMDBzfFAxMDF8UDIwMHN8UDEwMDBtfFAyMDBtfFA5MTAwfFAxMDAwc3xTNjYwMGJ8UzkwOHxQMTAwMHxQMzAwfFMxOHxTNjYwMHxTOTEwMClcXFxcYlwiLGlKb3lUYWJsZXQ6XCJUYWJsZXQgKFNwaXJpdCA3fEVzc2VudGlhfEdhbGF0ZWF8RnVzaW9ufE9uaXggN3xMYW5kYXxUaXRhbnxTY29vYnl8RGVveHxTdGVsbGF8VGhlbWlzfEFyZ29ufFVuaXF1ZSA3fFN5Z251c3xIZXhlbnxGaW5pdHkgN3xDcmVhbXxDcmVhbSBYMnxKYWRlfE5lb24gN3xOZXJvbiA3fEthbmR5fFNjYXBlfFNhcGh5ciA3fFJlYmVsfEJpb3h8UmViZWx8UmViZWwgOEdCfE15c3R8RHJhY28gN3xNeXN0fFRhYjctMDA0fE15c3R8VGFkZW8gSm9uZXN8VGFibGV0IEJvaW5nfEFycm93fERyYWNvIER1YWwgQ2FtfEF1cml4fE1pbnR8QW1pdHl8UmV2b2x1dGlvbnxGaW5pdHkgOXxOZW9uIDl8VDl3fEFtaXR5IDRHQiBEdWFsIENhbXxTdG9uZSA0R0J8U3RvbmUgOEdCfEFuZHJvbWVkYXxTaWxrZW58WDJ8QW5kcm9tZWRhIElJfEhhbGxleXxGbGFtZXxTYXBoeXIgOSw3fFRvdWNoIDh8UGxhbmV0fFRyaXRvbnxVbmlxdWUgMTB8SGV4ZW4gMTB8TWVtcGhpcyA0R0J8TWVtcGhpcyA4R0J8T25peCAxMClcIixGWDJUYWJsZXQ6XCJGWDIgUEFEN3xGWDIgUEFEMTBcIixYb3JvVGFibGV0OlwiS2lkc1BBRCA3MDF8UEFEWyBdPzcxMnxQQURbIF0/NzE0fFBBRFsgXT83MTZ8UEFEWyBdPzcxN3xQQURbIF0/NzE4fFBBRFsgXT83MjB8UEFEWyBdPzcyMXxQQURbIF0/NzIyfFBBRFsgXT83OTB8UEFEWyBdPzc5MnxQQURbIF0/OTAwfFBBRFsgXT85NzE1RHxQQURbIF0/OTcxNkRSfFBBRFsgXT85NzE4RFJ8UEFEWyBdPzk3MTlRUnxQQURbIF0/OTcyMFFSfFRlbGVQQUQxMDMwfFRlbGVwYWQxMDMyfFRlbGVQQUQ3MzB8VGVsZVBBRDczMXxUZWxlUEFENzMyfFRlbGVQQUQ3MzVRfFRlbGVQQUQ4MzB8VGVsZVBBRDk3MzB8VGVsZVBBRDc5NXxNZWdhUEFEIDEzMzF8TWVnYVBBRCAxODUxfE1lZ2FQQUQgMjE1MVwiLFZpZXdzb25pY1RhYmxldDpcIlZpZXdQYWQgMTBwaXxWaWV3UGFkIDEwZXxWaWV3UGFkIDEwc3xWaWV3UGFkIEU3MnxWaWV3UGFkN3xWaWV3UGFkIEUxMDB8Vmlld1BhZCA3ZXxWaWV3U29uaWMgVkI3MzN8VkIxMDBhXCIsVmVyaXpvblRhYmxldDpcIlFUQVFaM3xRVEFJUjd8UVRBUVRaM3xRVEFTVU4xfFFUQVNVTjJ8UVRBWElBMVwiLE9keXNUYWJsZXQ6XCJMT09YfFhFTk8xMHxPRFlTWyAtXShTcGFjZXxFVk98WHByZXNzfE5PT04pfFxcXFxiWEVMSU9cXFxcYnxYZWxpbzEwUHJvfFhFTElPN1BIT05FVEFCfFhFTElPMTBFWFRSRU1FfFhFTElPUFQyfE5FT19RVUFEMTBcIixDYXB0aXZhVGFibGV0OlwiQ0FQVElWQSBQQURcIixJY29uYml0VGFibGV0OlwiTmV0VEFCfE5ULTM3MDJ8TlQtMzcwMlN8TlQtMzcwMlN8TlQtMzYwM1B8TlQtMzYwM1B8TlQtMDcwNFN8TlQtMDcwNFN8TlQtMzgwNUN8TlQtMzgwNUN8TlQtMDgwNkN8TlQtMDgwNkN8TlQtMDkwOVR8TlQtMDkwOVR8TlQtMDkwN1N8TlQtMDkwN1N8TlQtMDkwMlN8TlQtMDkwMlNcIixUZWNsYXN0VGFibGV0OlwiVDk4IDRHfFxcXFxiUDgwXFxcXGJ8XFxcXGJYOTBIRFxcXFxifFg5OCBBaXJ8WDk4IEFpciAzR3xcXFxcYlg4OVxcXFxifFA4MCAzR3xcXFxcYlg4MGhcXFxcYnxQOTggQWlyfFxcXFxiWDg5SERcXFxcYnxQOTggM0d8XFxcXGJQOTBIRFxcXFxifFA4OSAzR3xYOTggM0d8XFxcXGJQNzBoXFxcXGJ8UDc5SEQgM0d8RzE4ZCAzR3xcXFxcYlA3OUhEXFxcXGJ8XFxcXGJQODlzXFxcXGJ8XFxcXGJBODhcXFxcYnxcXFxcYlAxMEhEXFxcXGJ8XFxcXGJQMTlIRFxcXFxifEcxOCAzR3xcXFxcYlA3OEhEXFxcXGJ8XFxcXGJBNzhcXFxcYnxcXFxcYlA3NVxcXFxifEcxN3MgM0d8RzE3aCAzR3xcXFxcYlA4NXRcXFxcYnxcXFxcYlA5MFxcXFxifFxcXFxiUDExXFxcXGJ8XFxcXGJQOTh0XFxcXGJ8XFxcXGJQOThIRFxcXFxifFxcXFxiRzE4ZFxcXFxifFxcXFxiUDg1c1xcXFxifFxcXFxiUDExSERcXFxcYnxcXFxcYlA4OHNcXFxcYnxcXFxcYkE4MEhEXFxcXGJ8XFxcXGJBODBzZVxcXFxifFxcXFxiQTEwaFxcXFxifFxcXFxiUDg5XFxcXGJ8XFxcXGJQNzhzXFxcXGJ8XFxcXGJHMThcXFxcYnxcXFxcYlA4NVxcXFxifFxcXFxiQTcwaFxcXFxifFxcXFxiQTcwXFxcXGJ8XFxcXGJHMTdcXFxcYnxcXFxcYlAxOFxcXFxifFxcXFxiQTgwc1xcXFxifFxcXFxiQTExc1xcXFxifFxcXFxiUDg4SERcXFxcYnxcXFxcYkE4MGhcXFxcYnxcXFxcYlA3NnNcXFxcYnxcXFxcYlA3NmhcXFxcYnxcXFxcYlA5OFxcXFxifFxcXFxiQTEwSERcXFxcYnxcXFxcYlA3OFxcXFxifFxcXFxiUDg4XFxcXGJ8XFxcXGJBMTFcXFxcYnxcXFxcYkExMHRcXFxcYnxcXFxcYlA3NmFcXFxcYnxcXFxcYlA3NnRcXFxcYnxcXFxcYlA3NmVcXFxcYnxcXFxcYlA4NUhEXFxcXGJ8XFxcXGJQODVhXFxcXGJ8XFxcXGJQODZcXFxcYnxcXFxcYlA3NUhEXFxcXGJ8XFxcXGJQNzZ2XFxcXGJ8XFxcXGJBMTJcXFxcYnxcXFxcYlA3NWFcXFxcYnxcXFxcYkExNVxcXFxifFxcXFxiUDc2VGlcXFxcYnxcXFxcYlA4MUhEXFxcXGJ8XFxcXGJBMTBcXFxcYnxcXFxcYlQ3NjBWRVxcXFxifFxcXFxiVDcyMEhEXFxcXGJ8XFxcXGJQNzZcXFxcYnxcXFxcYlA3M1xcXFxifFxcXFxiUDcxXFxcXGJ8XFxcXGJQNzJcXFxcYnxcXFxcYlQ3MjBTRVxcXFxifFxcXFxiQzUyMFRpXFxcXGJ8XFxcXGJUNzYwXFxcXGJ8XFxcXGJUNzIwVkVcXFxcYnxUNzIwLTNHRXxUNzIwLVdpRmlcIixPbmRhVGFibGV0OlwiXFxcXGIoVjk3NWl8VmkzMHxWWDUzMHxWNzAxfFZpNjB8VjcwMXN8Vmk1MHxWODAxc3xWNzE5fFZ4NjEwd3xWWDYxMFd8VjgxOWl8VmkxMHxWWDU4MFd8VmkxMHxWNzExc3xWODEzfFY4MTF8VjgyMHd8VjgyMHxWaTIwfFY3MTF8VkkzMFd8VjcxMnxWODkxd3xWOTcyfFY4MTl3fFY4MjB3fFZpNjB8VjgyMHd8VjcxMXxWODEzc3xWODAxfFY4MTl8Vjk3NXN8VjgwMXxWODE5fFY4MTl8VjgxOHxWODExfFY3MTJ8Vjk3NW18VjEwMXd8Vjk2MXd8VjgxMnxWODE4fFY5NzF8Vjk3MXN8VjkxOXxWOTg5fFYxMTZ3fFYxMDJ3fFY5NzN8Vmk0MClcXFxcYltcXFxcc10rXCIsSmF5dGVjaFRhYmxldDpcIlRQQy1QQTc2MlwiLEJsYXVwdW5rdFRhYmxldDpcIkVuZGVhdm91ciA4MDBOR3xFbmRlYXZvdXIgMTAxMFwiLERpZ21hVGFibGV0OlwiXFxcXGIoaUR4MTB8aUR4OXxpRHg4fGlEeDd8aUR4RDd8aUR4RDh8aURzUTh8aURzUTd8aURzUTh8aURzRDEwfGlEbkQ3fDNUUzgwNEh8aURzUTExfGlEajd8aURzMTApXFxcXGJcIixFdm9saW9UYWJsZXQ6XCJBUklBX01pbmlfd2lmaXxBcmlhWyBfXU1pbml8RXZvbGlvIFgxMHxFdm9saW8gWDd8RXZvbGlvIFg4fFxcXFxiRXZvdGFiXFxcXGJ8XFxcXGJOZXVyYVxcXFxiXCIsTGF2YVRhYmxldDpcIlFQQUQgRTcwNHxcXFxcYkl2b3J5U1xcXFxifEUtVEFCIElWT1JZfFxcXFxiRS1UQUJcXFxcYlwiLEFvY1RhYmxldDpcIk1XMDgxMXxNVzA4MTJ8TVcwOTIyfE1USzgzODJ8TVcxMDMxfE1XMDgzMXxNVzA4MjF8TVcwOTMxfE1XMDcxMlwiLE1wbWFuVGFibGV0OlwiTVAxMSBPQ1RBfE1QMTAgT0NUQXxNUFFDMTExNHxNUFFDMTAwNHxNUFFDOTk0fE1QUUM5NzR8TVBRQzk3M3xNUFFDODA0fE1QUUM3ODR8TVBRQzc4MHxcXFxcYk1QRzdcXFxcYnxNUERDRzc1fE1QRENHNzF8TVBEQzEwMDZ8TVAxMDFEQ3xNUERDOTAwMHxNUERDOTA1fE1QREM3MDZIRHxNUERDNzA2fE1QREM3MDV8TVBEQzExMHxNUERDMTAwfE1QREM5OXxNUERDOTd8TVBEQzg4fE1QREM4fE1QREM3N3xNUDcwOXxNSUQ3MDF8TUlENzExfE1JRDE3MHxNUERDNzAzfE1QUUMxMDEwXCIsQ2Vsa29uVGFibGV0OlwiQ1Q2OTV8Q1Q4ODh8Q1RbXFxcXHNdPzkxMHxDVDcgVGFifENUOSBUYWJ8Q1QzIFRhYnxDVDIgVGFifENUMSBUYWJ8QzgyMHxDNzIwfFxcXFxiQ1QtMVxcXFxiXCIsV29sZGVyVGFibGV0OlwibWlUYWIgXFxcXGIoRElBTU9ORHxTUEFDRXxCUk9PS0xZTnxORU98RkxZfE1BTkhBVFRBTnxGVU5LfEVWT0xVVElPTnxTS1l8R09DQVJ8SVJPTnxHRU5JVVN8UE9QfE1JTlR8RVBTSUxPTnxCUk9BRFdBWXxKVU1QfEhPUHxMRUdFTkR8TkVXIEFHRXxMSU5FfEFEVkFOQ0V8RkVFTHxGT0xMT1d8TElLRXxMSU5LfExJVkV8VEhJTkt8RlJFRURPTXxDSElDQUdPfENMRVZFTEFORHxCQUxUSU1PUkUtR0h8SU9XQXxCT1NUT058U0VBVFRMRXxQSE9FTklYfERBTExBU3xJTiAxMDF8TWFzdGVyQ2hlZilcXFxcYlwiLE1lZGlhY29tVGFibGV0OlwiTS1NUEkxMEMzR3xNLVNQMTBFR3xNLVNQMTBFR1B8TS1TUDEwSFhBSHxNLVNQN0hYQUh8TS1TUDEwSFhCSHxNLVNQOEhYQUh8TS1TUDhNWEFcIixNaVRhYmxldDpcIlxcXFxiTUkgUEFEXFxcXGJ8XFxcXGJITSBOT1RFIDFXXFxcXGJcIixOaWJpcnVUYWJsZXQ6XCJOaWJpcnUgTTF8TmliaXJ1IEp1cGl0ZXIgT25lXCIsTmV4b1RhYmxldDpcIk5FWE8gTk9WQXxORVhPIDEwfE5FWE8gQVZJT3xORVhPIEZSRUV8TkVYTyBHT3xORVhPIEVWT3xORVhPIDNHfE5FWE8gU01BUlR8TkVYTyBLSURET3xORVhPIE1PQklcIixMZWFkZXJUYWJsZXQ6XCJUQkxUMTBRfFRCTFQxMEl8VEJMLTEwV0RLQnxUQkwtMTBXREtCTzIwMTN8VEJMLVcyMzBWMnxUQkwtVzQ1MHxUQkwtVzUwMHxTVjU3MnxUQkxUN0l8VEJBLUFDNy04R3xUQkxUNzl8VEJMLThXMTZ8VEJMLTEwVzMyfFRCTC0xMFdLQnxUQkwtVzEwMFwiLFViaXNsYXRlVGFibGV0OlwiVWJpU2xhdGVbXFxcXHNdPzdDXCIsUG9ja2V0Qm9va1RhYmxldDpcIlBvY2tldGJvb2tcIixLb2Nhc29UYWJsZXQ6XCJcXFxcYihUQi0xMjA3KVxcXFxiXCIsSGlzZW5zZVRhYmxldDpcIlxcXFxiKEY1MjgxfEUyMzcxKVxcXFxiXCIsSHVkbDpcIkh1ZGwgSFQ3UzN8SHVkbCAyXCIsVGVsc3RyYVRhYmxldDpcIlQtSHViMlwiLEdlbmVyaWNUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYjk3RFxcXFxifFRhYmxldCg/IS4qUEMpfEJOVFYyNTBBfE1JRC1XQ0RNQXxMb2dpY1BEIFpvb20yfFxcXFxiQTdFQlxcXFxifENhdE5vdmE4fEExXzA3fENUNzA0fENUMTAwMnxcXFxcYk03MjFcXFxcYnxyazMwc2RrfFxcXFxiRVZPVEFCXFxcXGJ8TTc1OEF8RVQ5MDR8QUxVTUlVTTEwfFNtYXJ0ZnJlbiBUYWJ8RW5kZWF2b3VyIDEwMTB8VGFibGV0LVBDLTR8VGFnaSBUYWJ8XFxcXGJNNnByb1xcXFxifENUMTAyMFd8YXJjIDEwSER8XFxcXGJUUDc1MFxcXFxifFxcXFxiUVRBUVozXFxcXGJ8V1ZUMTAxfFRNMTA4OHxLVDEwN1wifSxvc3M6e0FuZHJvaWRPUzpcIkFuZHJvaWRcIixCbGFja0JlcnJ5T1M6XCJibGFja2JlcnJ5fFxcXFxiQkIxMFxcXFxifHJpbSB0YWJsZXQgb3NcIixQYWxtT1M6XCJQYWxtT1N8YXZhbnRnb3xibGF6ZXJ8ZWxhaW5lfGhpcHRvcHxwYWxtfHBsdWNrZXJ8eGlpbm9cIixTeW1iaWFuT1M6XCJTeW1iaWFufFN5bWJPU3xTZXJpZXM2MHxTZXJpZXM0MHxTWUItWzAtOV0rfFxcXFxiUzYwXFxcXGJcIixXaW5kb3dzTW9iaWxlT1M6XCJXaW5kb3dzIENFLiooUFBDfFNtYXJ0cGhvbmV8TW9iaWxlfFswLTldezN9eFswLTldezN9KXxXaW5kb3cgTW9iaWxlfFdpbmRvd3MgUGhvbmUgWzAtOS5dK3xXQ0U7XCIsV2luZG93c1Bob25lT1M6XCJXaW5kb3dzIFBob25lIDEwLjB8V2luZG93cyBQaG9uZSA4LjF8V2luZG93cyBQaG9uZSA4LjB8V2luZG93cyBQaG9uZSBPU3xYQkxXUDd8WnVuZVdQN3xXaW5kb3dzIE5UIDYuWzIzXTsgQVJNO1wiLGlPUzpcIlxcXFxiaVBob25lLipNb2JpbGV8XFxcXGJpUG9kfFxcXFxiaVBhZHxBcHBsZUNvcmVNZWRpYVwiLE1lZUdvT1M6XCJNZWVHb1wiLE1hZW1vT1M6XCJNYWVtb1wiLEphdmFPUzpcIkoyTUUvfFxcXFxiTUlEUFxcXFxifFxcXFxiQ0xEQ1xcXFxiXCIsd2ViT1M6XCJ3ZWJPU3xocHdPU1wiLGJhZGFPUzpcIlxcXFxiQmFkYVxcXFxiXCIsQlJFV09TOlwiQlJFV1wifSx1YXM6e0Nocm9tZTpcIlxcXFxiQ3JNb1xcXFxifENyaU9TfEFuZHJvaWQuKkNocm9tZS9bLjAtOV0qIChNb2JpbGUpP1wiLERvbGZpbjpcIlxcXFxiRG9sZmluXFxcXGJcIixPcGVyYTpcIk9wZXJhLipNaW5pfE9wZXJhLipNb2JpfEFuZHJvaWQuKk9wZXJhfE1vYmlsZS4qT1BSL1swLTkuXSt8Q29hc3QvWzAtOS5dK1wiLFNreWZpcmU6XCJTa3lmaXJlXCIsRWRnZTpcIk1vYmlsZSBTYWZhcmkvWy4wLTldKiBFZGdlXCIsSUU6XCJJRU1vYmlsZXxNU0lFTW9iaWxlXCIsRmlyZWZveDpcImZlbm5lY3xmaXJlZm94LiptYWVtb3woTW9iaWxlfFRhYmxldCkuKkZpcmVmb3h8RmlyZWZveC4qTW9iaWxlfEZ4aU9TXCIsQm9sdDpcImJvbHRcIixUZWFTaGFyazpcInRlYXNoYXJrXCIsQmxhemVyOlwiQmxhemVyXCIsU2FmYXJpOlwiVmVyc2lvbi4qTW9iaWxlLipTYWZhcml8U2FmYXJpLipNb2JpbGV8TW9iaWxlU2FmYXJpXCIsVUNCcm93c2VyOlwiVUMuKkJyb3dzZXJ8VUNXRUJcIixiYWlkdWJveGFwcDpcImJhaWR1Ym94YXBwXCIsYmFpZHVicm93c2VyOlwiYmFpZHVicm93c2VyXCIsRGlpZ29Ccm93c2VyOlwiRGlpZ29Ccm93c2VyXCIsUHVmZmluOlwiUHVmZmluXCIsTWVyY3VyeTpcIlxcXFxiTWVyY3VyeVxcXFxiXCIsT2JpZ29Ccm93c2VyOlwiT2JpZ29cIixOZXRGcm9udDpcIk5GLUJyb3dzZXJcIixHZW5lcmljQnJvd3NlcjpcIk5va2lhQnJvd3NlcnxPdmlCcm93c2VyfE9uZUJyb3dzZXJ8VHdvbmt5QmVhbUJyb3dzZXJ8U0VNQy4qQnJvd3NlcnxGbHlGbG93fE1pbmltb3xOZXRGcm9udHxOb3ZhcnJhLVZpc2lvbnxNUVFCcm93c2VyfE1pY3JvTWVzc2VuZ2VyXCIsUGFsZU1vb246XCJBbmRyb2lkLipQYWxlTW9vbnxNb2JpbGUuKlBhbGVNb29uXCJ9LHByb3BzOntNb2JpbGU6XCJNb2JpbGUvW1ZFUl1cIixCdWlsZDpcIkJ1aWxkL1tWRVJdXCIsVmVyc2lvbjpcIlZlcnNpb24vW1ZFUl1cIixWZW5kb3JJRDpcIlZlbmRvcklEL1tWRVJdXCIsaVBhZDpcImlQYWQuKkNQVVthLXogXStbVkVSXVwiLGlQaG9uZTpcImlQaG9uZS4qQ1BVW2EteiBdK1tWRVJdXCIsaVBvZDpcImlQb2QuKkNQVVthLXogXStbVkVSXVwiLEtpbmRsZTpcIktpbmRsZS9bVkVSXVwiLENocm9tZTpbXCJDaHJvbWUvW1ZFUl1cIixcIkNyaU9TL1tWRVJdXCIsXCJDck1vL1tWRVJdXCJdLENvYXN0OltcIkNvYXN0L1tWRVJdXCJdLERvbGZpbjpcIkRvbGZpbi9bVkVSXVwiLEZpcmVmb3g6W1wiRmlyZWZveC9bVkVSXVwiLFwiRnhpT1MvW1ZFUl1cIl0sRmVubmVjOlwiRmVubmVjL1tWRVJdXCIsRWRnZTpcIkVkZ2UvW1ZFUl1cIixJRTpbXCJJRU1vYmlsZS9bVkVSXTtcIixcIklFTW9iaWxlIFtWRVJdXCIsXCJNU0lFIFtWRVJdO1wiLFwiVHJpZGVudC9bMC05Ll0rOy4qcnY6W1ZFUl1cIl0sTmV0RnJvbnQ6XCJOZXRGcm9udC9bVkVSXVwiLE5va2lhQnJvd3NlcjpcIk5va2lhQnJvd3Nlci9bVkVSXVwiLE9wZXJhOltcIiBPUFIvW1ZFUl1cIixcIk9wZXJhIE1pbmkvW1ZFUl1cIixcIlZlcnNpb24vW1ZFUl1cIl0sXCJPcGVyYSBNaW5pXCI6XCJPcGVyYSBNaW5pL1tWRVJdXCIsXCJPcGVyYSBNb2JpXCI6XCJWZXJzaW9uL1tWRVJdXCIsVUNCcm93c2VyOltcIlVDV0VCW1ZFUl1cIixcIlVDLipCcm93c2VyL1tWRVJdXCJdLE1RUUJyb3dzZXI6XCJNUVFCcm93c2VyL1tWRVJdXCIsTWljcm9NZXNzZW5nZXI6XCJNaWNyb01lc3Nlbmdlci9bVkVSXVwiLGJhaWR1Ym94YXBwOlwiYmFpZHVib3hhcHAvW1ZFUl1cIixiYWlkdWJyb3dzZXI6XCJiYWlkdWJyb3dzZXIvW1ZFUl1cIixTYW1zdW5nQnJvd3NlcjpcIlNhbXN1bmdCcm93c2VyL1tWRVJdXCIsSXJvbjpcIklyb24vW1ZFUl1cIixTYWZhcmk6W1wiVmVyc2lvbi9bVkVSXVwiLFwiU2FmYXJpL1tWRVJdXCJdLFNreWZpcmU6XCJTa3lmaXJlL1tWRVJdXCIsVGl6ZW46XCJUaXplbi9bVkVSXVwiLFdlYmtpdDpcIndlYmtpdFsgL11bVkVSXVwiLFBhbGVNb29uOlwiUGFsZU1vb24vW1ZFUl1cIixHZWNrbzpcIkdlY2tvL1tWRVJdXCIsVHJpZGVudDpcIlRyaWRlbnQvW1ZFUl1cIixQcmVzdG86XCJQcmVzdG8vW1ZFUl1cIixHb2FubmE6XCJHb2FubmEvW1ZFUl1cIixpT1M6XCIgXFxcXGJpP09TXFxcXGIgW1ZFUl1bIDtdezF9XCIsQW5kcm9pZDpcIkFuZHJvaWQgW1ZFUl1cIixCbGFja0JlcnJ5OltcIkJsYWNrQmVycnlbXFxcXHddKy9bVkVSXVwiLFwiQmxhY2tCZXJyeS4qVmVyc2lvbi9bVkVSXVwiLFwiVmVyc2lvbi9bVkVSXVwiXSxCUkVXOlwiQlJFVyBbVkVSXVwiLEphdmE6XCJKYXZhL1tWRVJdXCIsXCJXaW5kb3dzIFBob25lIE9TXCI6W1wiV2luZG93cyBQaG9uZSBPUyBbVkVSXVwiLFwiV2luZG93cyBQaG9uZSBbVkVSXVwiXSxcIldpbmRvd3MgUGhvbmVcIjpcIldpbmRvd3MgUGhvbmUgW1ZFUl1cIixcIldpbmRvd3MgQ0VcIjpcIldpbmRvd3MgQ0UvW1ZFUl1cIixcIldpbmRvd3MgTlRcIjpcIldpbmRvd3MgTlQgW1ZFUl1cIixTeW1iaWFuOltcIlN5bWJpYW5PUy9bVkVSXVwiLFwiU3ltYmlhbi9bVkVSXVwiXSx3ZWJPUzpbXCJ3ZWJPUy9bVkVSXVwiLFwiaHB3T1MvW1ZFUl07XCJdfSx1dGlsczp7Qm90OlwiR29vZ2xlYm90fGZhY2Vib29rZXh0ZXJuYWxoaXR8QWRzQm90LUdvb2dsZXxHb29nbGUgS2V5d29yZCBTdWdnZXN0aW9ufEZhY2Vib3R8WWFuZGV4Qm90fFlhbmRleE1vYmlsZUJvdHxiaW5nYm90fGlhX2FyY2hpdmVyfEFocmVmc0JvdHxFem9vbXN8R1NMRmJvdHxXQlNlYXJjaEJvdHxUd2l0dGVyYm90fFR3ZWV0bWVtZUJvdHxUd2lrbGV8UGFwZXJMaUJvdHxXb3Rib3h8VW53aW5kRmV0Y2hvcnxFeGFib3R8TUoxMmJvdHxZYW5kZXhJbWFnZXN8VHVybml0aW5Cb3R8UGluZ2RvbVwiLE1vYmlsZUJvdDpcIkdvb2dsZWJvdC1Nb2JpbGV8QWRzQm90LUdvb2dsZS1Nb2JpbGV8WWFob29TZWVrZXIvTTFBMS1SMkQyXCIsRGVza3RvcE1vZGU6XCJXUERlc2t0b3BcIixUVjpcIlNvbnlEVFZ8SGJiVFZcIixXZWJLaXQ6XCIod2Via2l0KVsgL10oW1xcXFx3Ll0rKVwiLENvbnNvbGU6XCJcXFxcYihOaW50ZW5kb3xOaW50ZW5kbyBXaWlVfE5pbnRlbmRvIDNEU3xOaW50ZW5kbyBTd2l0Y2h8UExBWVNUQVRJT058WGJveClcXFxcYlwiLFdhdGNoOlwiU00tVjcwMFwifX0sZGV0ZWN0TW9iaWxlQnJvd3NlcnM6e2Z1bGxQYXR0ZXJuOi8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaSxzaG9ydFBhdHRlcm46LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2ksdGFibGV0UGF0dGVybjovYW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaX19LHQsdT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O3JldHVybiBzLkZBTExCQUNLX1BIT05FPVwiVW5rbm93blBob25lXCIscy5GQUxMQkFDS19UQUJMRVQ9XCJVbmtub3duVGFibGV0XCIscy5GQUxMQkFDS19NT0JJTEU9XCJVbmtub3duTW9iaWxlXCIsdD1cImlzQXJyYXlcImluIEFycmF5P0FycmF5LmlzQXJyYXk6ZnVuY3Rpb24odil7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpfSxmdW5jdGlvbigpe3ZhciB2LHcseCx5LHosQSxCPXMubW9iaWxlRGV0ZWN0UnVsZXM7Zm9yKHYgaW4gQi5wcm9wcylpZih1LmNhbGwoQi5wcm9wcyx2KSl7Zm9yKHc9Qi5wcm9wc1t2XSx0KHcpfHwodz1bd10pLHo9dy5sZW5ndGgseT0wO3k8ejsrK3kpeD13W3ldLEE9eC5pbmRleE9mKFwiW1ZFUl1cIiksMDw9QSYmKHg9eC5zdWJzdHJpbmcoMCxBKStcIihbXFxcXHcuX1xcXFwrXSspXCIreC5zdWJzdHJpbmcoQSs1KSksd1t5XT1uZXcgUmVnRXhwKHgsXCJpXCIpO0IucHJvcHNbdl09d31wKEIub3NzKSxwKEIucGhvbmVzKSxwKEIudGFibGV0cykscChCLnVhcykscChCLnV0aWxzKSxCLm9zczA9e1dpbmRvd3NQaG9uZU9TOkIub3NzLldpbmRvd3NQaG9uZU9TLFdpbmRvd3NNb2JpbGVPUzpCLm9zcy5XaW5kb3dzTW9iaWxlT1N9fSgpLHMuZmluZE1hdGNoPWZ1bmN0aW9uKHYsdyl7Zm9yKHZhciB4IGluIHYpaWYodS5jYWxsKHYseCkmJnZbeF0udGVzdCh3KSlyZXR1cm4geDtyZXR1cm4gbnVsbH0scy5maW5kTWF0Y2hlcz1mdW5jdGlvbih2LHcpe3ZhciB4PVtdO2Zvcih2YXIgeSBpbiB2KXUuY2FsbCh2LHkpJiZ2W3ldLnRlc3QodykmJngucHVzaCh5KTtyZXR1cm4geH0scy5nZXRWZXJzaW9uU3RyPWZ1bmN0aW9uKHYsdyl7dmFyIHgseSx6LEEsQj1zLm1vYmlsZURldGVjdFJ1bGVzLnByb3BzO2lmKHUuY2FsbChCLHYpKWZvcih4PUJbdl0sej14Lmxlbmd0aCx5PTA7eTx6OysreSlpZihBPXhbeV0uZXhlYyh3KSxudWxsIT09QSlyZXR1cm4gQVsxXTtyZXR1cm4gbnVsbH0scy5nZXRWZXJzaW9uPWZ1bmN0aW9uKHYsdyl7dmFyIHg9cy5nZXRWZXJzaW9uU3RyKHYsdyk7cmV0dXJuIHg/cy5wcmVwYXJlVmVyc2lvbk5vKHgpOk5hTn0scy5wcmVwYXJlVmVyc2lvbk5vPWZ1bmN0aW9uKHYpe3ZhciB3O3JldHVybiB3PXYuc3BsaXQoL1thLXouXyBcXC9cXC1dL2kpLDE9PT13Lmxlbmd0aCYmKHY9d1swXSksMTx3Lmxlbmd0aCYmKHY9d1swXStcIi5cIix3LnNoaWZ0KCksdis9dy5qb2luKFwiXCIpKSwrdn0scy5pc01vYmlsZUZhbGxiYWNrPWZ1bmN0aW9uKHYpe3JldHVybiBzLmRldGVjdE1vYmlsZUJyb3dzZXJzLmZ1bGxQYXR0ZXJuLnRlc3Qodil8fHMuZGV0ZWN0TW9iaWxlQnJvd3NlcnMuc2hvcnRQYXR0ZXJuLnRlc3Qodi5zdWJzdHIoMCw0KSl9LHMuaXNUYWJsZXRGYWxsYmFjaz1mdW5jdGlvbih2KXtyZXR1cm4gcy5kZXRlY3RNb2JpbGVCcm93c2Vycy50YWJsZXRQYXR0ZXJuLnRlc3Qodil9LHMucHJlcGFyZURldGVjdGlvbkNhY2hlPWZ1bmN0aW9uKHYsdyx4KXtpZih2Lm1vYmlsZT09PW0pe3ZhciB5LHosQTtyZXR1cm4oej1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnRhYmxldHMsdykpPyh2Lm1vYmlsZT12LnRhYmxldD16LHZvaWQodi5waG9uZT1udWxsKSk6KHk9cy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5waG9uZXMsdykpPyh2Lm1vYmlsZT12LnBob25lPXksdm9pZCh2LnRhYmxldD1udWxsKSk6dm9pZChzLmlzTW9iaWxlRmFsbGJhY2sodyk/KEE9ci5pc1Bob25lU2l6ZWQoeCksQT09PW0/KHYubW9iaWxlPXMuRkFMTEJBQ0tfTU9CSUxFLHYudGFibGV0PXYucGhvbmU9bnVsbCk6QT8odi5tb2JpbGU9di5waG9uZT1zLkZBTExCQUNLX1BIT05FLHYudGFibGV0PW51bGwpOih2Lm1vYmlsZT12LnRhYmxldD1zLkZBTExCQUNLX1RBQkxFVCx2LnBob25lPW51bGwpKTpzLmlzVGFibGV0RmFsbGJhY2sodyk/KHYubW9iaWxlPXYudGFibGV0PXMuRkFMTEJBQ0tfVEFCTEVULHYucGhvbmU9bnVsbCk6di5tb2JpbGU9di50YWJsZXQ9di5waG9uZT1udWxsKX19LHMubW9iaWxlR3JhZGU9ZnVuY3Rpb24odil7dmFyIHc9bnVsbCE9PXYubW9iaWxlKCk7cmV0dXJuIHYub3MoXCJpT1NcIikmJjQuMzw9di52ZXJzaW9uKFwiaVBhZFwiKXx8di5vcyhcImlPU1wiKSYmMy4xPD12LnZlcnNpb24oXCJpUGhvbmVcIil8fHYub3MoXCJpT1NcIikmJjMuMTw9di52ZXJzaW9uKFwiaVBvZFwiKXx8Mi4xPHYudmVyc2lvbihcIkFuZHJvaWRcIikmJnYuaXMoXCJXZWJraXRcIil8fDc8PXYudmVyc2lvbihcIldpbmRvd3MgUGhvbmUgT1NcIil8fHYuaXMoXCJCbGFja0JlcnJ5XCIpJiY2PD12LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHx2Lm1hdGNoKFwiUGxheWJvb2suKlRhYmxldFwiKXx8MS40PD12LnZlcnNpb24oXCJ3ZWJPU1wiKSYmdi5tYXRjaChcIlBhbG18UHJlfFBpeGlcIil8fHYubWF0Y2goXCJocC4qVG91Y2hQYWRcIil8fHYuaXMoXCJGaXJlZm94XCIpJiYxMjw9di52ZXJzaW9uKFwiRmlyZWZveFwiKXx8di5pcyhcIkNocm9tZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmNDw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5pcyhcIlNreWZpcmVcIikmJjQuMTw9di52ZXJzaW9uKFwiU2t5ZmlyZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiT3BlcmFcIikmJjExPHYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJBbmRyb2lkT1NcIil8fHYuaXMoXCJNZWVHb09TXCIpfHx2LmlzKFwiVGl6ZW5cIil8fHYuaXMoXCJEb2xmaW5cIikmJjI8PXYudmVyc2lvbihcIkJhZGFcIil8fCh2LmlzKFwiVUMgQnJvd3NlclwiKXx8di5pcyhcIkRvbGZpblwiKSkmJjIuMzw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5tYXRjaChcIktpbmRsZSBGaXJlXCIpfHx2LmlzKFwiS2luZGxlXCIpJiYzPD12LnZlcnNpb24oXCJLaW5kbGVcIil8fHYuaXMoXCJBbmRyb2lkT1NcIikmJnYuaXMoXCJOb29rVGFibGV0XCIpfHwxMTw9di52ZXJzaW9uKFwiQ2hyb21lXCIpJiYhd3x8NTw9di52ZXJzaW9uKFwiU2FmYXJpXCIpJiYhd3x8NDw9di52ZXJzaW9uKFwiRmlyZWZveFwiKSYmIXd8fDc8PXYudmVyc2lvbihcIk1TSUVcIikmJiF3fHwxMDw9di52ZXJzaW9uKFwiT3BlcmFcIikmJiF3P1wiQVwiOnYub3MoXCJpT1NcIikmJjQuMz52LnZlcnNpb24oXCJpUGFkXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBob25lXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBvZFwiKXx8di5pcyhcIkJsYWNrYmVycnlcIikmJjU8PXYudmVyc2lvbihcIkJsYWNrQmVycnlcIikmJjY+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8NTw9di52ZXJzaW9uKFwiT3BlcmEgTWluaVwiKSYmNi41Pj12LnZlcnNpb24oXCJPcGVyYSBNaW5pXCIpJiYoMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiaU9TXCIpKXx8di5tYXRjaChcIk5va2lhTjh8Tm9raWFDN3xOOTcuKlNlcmllczYwfFN5bWJpYW4vM1wiKXx8MTE8PXYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJTeW1iaWFuT1NcIik/XCJCXCI6KDU+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8di5tYXRjaChcIk1TSUVNb2JpbGV8V2luZG93cyBDRS4qTW9iaWxlXCIpfHw1LjI+PXYudmVyc2lvbihcIldpbmRvd3MgTW9iaWxlXCIpLFwiQ1wiKX0scy5kZXRlY3RPUz1mdW5jdGlvbih2KXtyZXR1cm4gcy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5vc3MwLHYpfHxzLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLm9zcyx2KX0scy5nZXREZXZpY2VTbWFsbGVyU2lkZT1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cuc2NyZWVuLndpZHRoPHdpbmRvdy5zY3JlZW4uaGVpZ2h0P3dpbmRvdy5zY3JlZW4ud2lkdGg6d2luZG93LnNjcmVlbi5oZWlnaHR9LHIucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpyLG1vYmlsZTpmdW5jdGlvbiBtb2JpbGUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLm1vYmlsZX0scGhvbmU6ZnVuY3Rpb24gcGhvbmUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLnBob25lfSx0YWJsZXQ6ZnVuY3Rpb24gdGFibGV0KCl7cmV0dXJuIHMucHJlcGFyZURldGVjdGlvbkNhY2hlKHRoaXMuX2NhY2hlLHRoaXMudWEsdGhpcy5tYXhQaG9uZVdpZHRoKSx0aGlzLl9jYWNoZS50YWJsZXR9LHVzZXJBZ2VudDpmdW5jdGlvbiB1c2VyQWdlbnQoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50PT09bSYmKHRoaXMuX2NhY2hlLnVzZXJBZ2VudD1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnVhcyx0aGlzLnVhKSksdGhpcy5fY2FjaGUudXNlckFnZW50fSx1c2VyQWdlbnRzOmZ1bmN0aW9uIHVzZXJBZ2VudHMoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50cz09PW0mJih0aGlzLl9jYWNoZS51c2VyQWdlbnRzPXMuZmluZE1hdGNoZXMocy5tb2JpbGVEZXRlY3RSdWxlcy51YXMsdGhpcy51YSkpLHRoaXMuX2NhY2hlLnVzZXJBZ2VudHN9LG9zOmZ1bmN0aW9uIG9zKCl7cmV0dXJuIHRoaXMuX2NhY2hlLm9zPT09bSYmKHRoaXMuX2NhY2hlLm9zPXMuZGV0ZWN0T1ModGhpcy51YSkpLHRoaXMuX2NhY2hlLm9zfSx2ZXJzaW9uOmZ1bmN0aW9uIHZlcnNpb24odil7cmV0dXJuIHMuZ2V0VmVyc2lvbih2LHRoaXMudWEpfSx2ZXJzaW9uU3RyOmZ1bmN0aW9uIHZlcnNpb25TdHIodil7cmV0dXJuIHMuZ2V0VmVyc2lvblN0cih2LHRoaXMudWEpfSxpczpmdW5jdGlvbiBpcyh2KXtyZXR1cm4gbyh0aGlzLnVzZXJBZ2VudHMoKSx2KXx8bih2LHRoaXMub3MoKSl8fG4odix0aGlzLnBob25lKCkpfHxuKHYsdGhpcy50YWJsZXQoKSl8fG8ocy5maW5kTWF0Y2hlcyhzLm1vYmlsZURldGVjdFJ1bGVzLnV0aWxzLHRoaXMudWEpLHYpfSxtYXRjaDpmdW5jdGlvbiBtYXRjaCh2KXtyZXR1cm4gdiBpbnN0YW5jZW9mIFJlZ0V4cHx8KHY9bmV3IFJlZ0V4cCh2LFwiaVwiKSksdi50ZXN0KHRoaXMudWEpfSxpc1Bob25lU2l6ZWQ6ZnVuY3Rpb24gaXNQaG9uZVNpemVkKHYpe3JldHVybiByLmlzUGhvbmVTaXplZCh2fHx0aGlzLm1heFBob25lV2lkdGgpfSxtb2JpbGVHcmFkZTpmdW5jdGlvbiBtb2JpbGVHcmFkZSgpe3JldHVybiB0aGlzLl9jYWNoZS5ncmFkZT09PW0mJih0aGlzLl9jYWNoZS5ncmFkZT1zLm1vYmlsZUdyYWRlKHRoaXMpKSx0aGlzLl9jYWNoZS5ncmFkZX19LHIuaXNQaG9uZVNpemVkPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5zY3JlZW4/ZnVuY3Rpb24odil7cmV0dXJuIDA+dj9tOnMuZ2V0RGV2aWNlU21hbGxlclNpZGUoKTw9dn06ZnVuY3Rpb24oKXt9LHIuX2ltcGw9cyxyLnZlcnNpb249XCIxLjQuMiAyMDE4LTA2LTEwXCIscn0pfShmdW5jdGlvbigpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXJldHVybiBmdW5jdGlvbihtKXttb2R1bGUuZXhwb3J0cz1tKCl9O2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClyZXR1cm4gZGVmaW5lO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cpcmV0dXJuIGZ1bmN0aW9uKG0pe3dpbmRvdy5Nb2JpbGVEZXRlY3Q9bSgpfTt0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGVudmlyb25tZW50XCIpfSgpKTsiXX0=
