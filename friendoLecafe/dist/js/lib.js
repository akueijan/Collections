"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*!
 * VERSION: 0.2.2
 * DATE: 2017-06-19
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : undefined || window;(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  "use strict";
  _gsScope._gsDefine("easing.CustomEase", ["easing.Ease"], function (a) {
    var b = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        c = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        d = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
        e = /[cLlsS]/g,
        f = "CustomEase only accepts Cubic Bezier data.",
        g = function g(a, b, c, d, e, f, h, i, j, k, l) {
      var m,
          n = (a + c) / 2,
          o = (b + d) / 2,
          p = (c + e) / 2,
          q = (d + f) / 2,
          r = (e + h) / 2,
          s = (f + i) / 2,
          t = (n + p) / 2,
          u = (o + q) / 2,
          v = (p + r) / 2,
          w = (q + s) / 2,
          x = (t + v) / 2,
          y = (u + w) / 2,
          z = h - a,
          A = i - b,
          B = Math.abs((c - h) * A - (d - i) * z),
          C = Math.abs((e - h) * A - (f - i) * z);return k || (k = [{ x: a, y: b }, { x: h, y: i }], l = 1), k.splice(l || k.length - 1, 0, { x: x, y: y }), (B + C) * (B + C) > j * (z * z + A * A) && (m = k.length, g(a, b, n, o, t, u, x, y, j, k, l), g(x, y, v, w, r, s, h, i, j, k, l + 1 + (k.length - m))), k;
    },
        h = function h(a) {
      var b,
          e,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p = (a + "").replace(d, function (a) {
        var b = +a;return 1e-4 > b && b > -1e-4 ? 0 : b;
      }).match(c) || [],
          q = [],
          r = 0,
          s = 0,
          t = p.length,
          u = 2;for (b = 0; t > b; b++) {
        if (m = h, isNaN(p[b]) ? (h = p[b].toUpperCase(), i = h !== p[b]) : b--, e = +p[b + 1], g = +p[b + 2], i && (e += r, g += s), b || (k = e, l = g), "M" === h) j && j.length < 8 && (q.length -= 1, u = 0), r = k = e, s = l = g, j = [e, g], u = 2, q.push(j), b += 2, h = "L";else if ("C" === h) j || (j = [0, 0]), j[u++] = e, j[u++] = g, i || (r = s = 0), j[u++] = r + 1 * p[b + 3], j[u++] = s + 1 * p[b + 4], j[u++] = r += 1 * p[b + 5], j[u++] = s += 1 * p[b + 6], b += 6;else if ("S" === h) "C" === m || "S" === m ? (n = r - j[u - 4], o = s - j[u - 3], j[u++] = r + n, j[u++] = s + o) : (j[u++] = r, j[u++] = s), j[u++] = e, j[u++] = g, i || (r = s = 0), j[u++] = r += 1 * p[b + 3], j[u++] = s += 1 * p[b + 4], b += 4;else {
          if ("L" !== h && "Z" !== h) throw f;"Z" === h && (e = k, g = l, j.closed = !0), ("L" === h || Math.abs(r - e) > .5 || Math.abs(s - g) > .5) && (j[u++] = r + (e - r) / 3, j[u++] = s + (g - s) / 3, j[u++] = r + 2 * (e - r) / 3, j[u++] = s + 2 * (g - s) / 3, j[u++] = e, j[u++] = g, "L" === h && (b += 2)), r = e, s = g;
        }
      }return q[0];
    },
        i = function i(a) {
      var b,
          c = a.length,
          d = 999999999999;for (b = 1; c > b; b += 6) {
        +a[b] < d && (d = +a[b]);
      }return d;
    },
        j = function j(a, b, c) {
      c || 0 === c || (c = Math.max(+a[a.length - 1], +a[1]));var d,
          e = -1 * +a[0],
          f = -c,
          g = a.length,
          h = 1 / (+a[g - 2] + e),
          j = -b || (Math.abs(+a[g - 1] - +a[1]) < .01 * (+a[g - 2] - +a[0]) ? i(a) + f : +a[g - 1] + f);for (j = j ? 1 / j : -h, d = 0; g > d; d += 2) {
        a[d] = (+a[d] + e) * h, a[d + 1] = (+a[d + 1] + f) * j;
      }
    },
        k = function k(a) {
      var b = this.lookup[a * this.l | 0] || this.lookup[this.l - 1];return b.nx < a && (b = b.n), b.y + (a - b.x) / b.cx * b.cy;
    },
        l = function l(b, c, d) {
      this._calcEnd = !0, this.id = b, b && (a.map[b] = this), this.getRatio = k, this.setData(c, d);
    },
        m = l.prototype = new a();return m.constructor = l, m.setData = function (a, c) {
      a = a || "0,0,1,1";var d,
          i,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s = a.match(b),
          t = 1,
          u = [];if (c = c || {}, r = c.precision || 1, this.data = a, this.lookup = [], this.points = u, this.fast = 1 >= r, (e.test(a) || -1 !== a.indexOf("M") && -1 === a.indexOf("C")) && (s = h(a)), d = s.length, 4 === d) s.unshift(0, 0), s.push(1, 1), d = 8;else if ((d - 2) % 6) throw f;for ((0 !== +s[0] || 1 !== +s[d - 2]) && j(s, c.height, c.originY), this.rawBezier = s, l = 2; d > l; l += 6) {
        i = { x: +s[l - 2], y: +s[l - 1] }, k = { x: +s[l + 4], y: +s[l + 5] }, u.push(i, k), g(i.x, i.y, +s[l], +s[l + 1], +s[l + 2], +s[l + 3], k.x, k.y, 1 / (2e5 * r), u, u.length - 1);
      }for (d = u.length, l = 0; d > l; l++) {
        o = u[l], p = u[l - 1] || o, o.x > p.x || p.y !== o.y && p.x === o.x || o === p ? (p.cx = o.x - p.x, p.cy = o.y - p.y, p.n = o, p.nx = o.x, this.fast && l > 1 && Math.abs(p.cy / p.cx - u[l - 2].cy / u[l - 2].cx) > 2 && (this.fast = !1), p.cx < t && (p.cx ? t = p.cx : (p.cx = .001, l === d - 1 && (p.x -= .001, t = Math.min(t, .001), this.fast = !1)))) : (u.splice(l--, 1), d--);
      }if (d = 1 / t + 1 | 0, this.l = d, m = 1 / d, n = 0, o = u[0], this.fast) {
        for (l = 0; d > l; l++) {
          q = l * m, o.nx < q && (o = u[++n]), i = o.y + (q - o.x) / o.cx * o.cy, this.lookup[l] = { x: q, cx: m, y: i, cy: 0, nx: 9 }, l && (this.lookup[l - 1].cy = i - this.lookup[l - 1].y);
        }this.lookup[d - 1].cy = u[u.length - 1].y - i;
      } else {
        for (l = 0; d > l; l++) {
          o.nx < l * m && (o = u[++n]), this.lookup[l] = o;
        }n < u.length - 1 && (this.lookup[l - 1] = u[u.length - 2]);
      }return this._calcEnd = 1 !== u[u.length - 1].y || 0 !== u[0].y, this;
    }, m.getRatio = k, m.getSVGData = function (a) {
      return l.getSVGData(this, a);
    }, l.create = function (a, b, c) {
      return new l(a, b, c);
    }, l.version = "0.2.2", l.bezierToPoints = g, l.get = function (b) {
      return a.map[b];
    }, l.getSVGData = function (b, c) {
      c = c || {};var d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n = 1e3,
          o = c.width || 100,
          p = c.height || 100,
          q = c.x || 0,
          r = (c.y || 0) + p,
          s = c.path;if (c.invert && (p = -p, r = 0), b = b.getRatio ? b : a.map[b] || console.log("No ease found: ", b), b.rawBezier) {
        for (d = [], j = b.rawBezier.length, f = 0; j > f; f += 2) {
          d.push(((q + b.rawBezier[f] * o) * n | 0) / n + "," + ((r + b.rawBezier[f + 1] * -p) * n | 0) / n);
        }d[0] = "M" + d[0], d[1] = "C" + d[1];
      } else for (d = ["M" + q + "," + r], j = Math.max(5, 200 * (c.precision || 1)), g = 1 / j, j += 2, k = 5 / j, l = ((q + g * o) * n | 0) / n, m = ((r + b.getRatio(g) * -p) * n | 0) / n, e = (m - r) / (l - q), f = 2; j > f; f++) {
        h = ((q + f * g * o) * n | 0) / n, i = ((r + b.getRatio(f * g) * -p) * n | 0) / n, (Math.abs((i - m) / (h - l) - e) > k || f === j - 1) && (d.push(l + "," + m), e = (i - m) / (h - l)), l = h, m = i;
      }return s && ("string" == typeof s ? document.querySelector(s) : s).setAttribute("d", d.join(" ")), d.join(" ");
    }, l;
  }, !0);
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(), function (a) {
  "use strict";
  var b = function b() {
    return (_gsScope.GreenSockGlobals || _gsScope)[a];
  };"undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = b()) : "function" == typeof define && define.amd && define(["TweenLite"], b);
}("CustomEase");
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
        $('body').toggleClass('_freeze');
      });
      dMenuClose.click(function () {
        dObj.removeClass("nav--active");
        $('body').removeClass('_freeze');
      });

      dAllLink.click(function () {
        dObj.removeClass('nav--active');
        $('body').removeClass('_freeze');
      });
    }
    // initialize every element
    return this.each(function () {
      init($(this));
    });
  };
  // start
})(jQuery);

;(function ($) {
  $.fn.loadpage = function (action, opts) {
    action = action ? action : "init";
    var progressValue = 0;
    var loadHtml = ['<div class="mdLoading">', '    <div class="loadingBox">', '        <img class="line2" src="images/load-pic.png">', '        <div class="progressBar">', '            <div class="progress js-bar" style="width:0"></div>', '        </div>', '    </div>', '</div>'].join('');
    var dLoad, dCount, dBar;
    var config = $.extend({
      async: false
    }, opts);

    function init(obj) {
      var _this = this;

      $(loadHtml).appendTo('body');
      dLoad = obj.find('.mdLoading');
      dCount = dLoad.find('.js-count');
      dBar = dLoad.find('.js-bar');
      return new Promise(function (resolve, reject) {
        if (!config.async) {
          var queue = new createjs.LoadQueue();
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
            $('.js-wrap').css({ 'visibility': 'visible' });
            TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
              delay: .8,
              opacity: 0, ease: Power4.easeOut, onComplete: function onComplete() {
                dLoad.remove();
                resolve(true);
              }
            });
          };

          queue.on("progress", function () {
            var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
            dCount.text(procValue + '%');
            dBar.css({
              'width': procValue + '%'
            });
          });

          queue.on("complete", handleComplete, _this);
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
      dCount.text('100%');
      dBar.css({
        'width': '100%'
      });
      TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
        delay: .8,
        opacity: 0, ease: Power4.easeOut, onComplete: function onComplete() {
          dLoad.remove();
        }
      });
    }
  };
})(jQuery);
'user strict';

function ScratchCard(selector, options) {
  var defaultOptions = {
    width: "300",
    height: "300",
    imageForwardSrc: null,
    colorForward: "gray",
    imageBackgroundSrc: null,
    colorBackground: "red",
    clearRadius: 50,
    percentToFinish: null,
    callback: function callback() {
      console.log("card clear");
    },
    open: function open() {
      console.log("card open");
    }
  };
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext('2d');
  this.progress = 0;
  this.old = { x: 0, Y: 0 };
  this.feedback = false;
  this.options = _extends({}, defaultOptions, options);
  this.init(selector);
}
ScratchCard.prototype.init = function (selector) {
  var self = this,
      bgc = "";
  selector.appendChild(self.canvas);
  self.canvas.width = self.options.width;
  self.canvas.height = self.options.height;
  new Promise(function (resolve) {
    if (self.options.imageForwardSrc) {
      var img = new Image();
      img.onload = function () {
        self.ctx.drawImage(img, 0, 0, self.options.width, self.options.height);
        resolve(true);
      };
      img.src = self.options.imageForwardSrc;
    } else {
      self.ctx.fillStyle = self.options.colorForward;
      self.ctx.fillRect(0, 0, self.options.width, self.options.height);
      resolve(true);
    }
  }).then(function () {
    if (self.options.imageBackgroundSrc) {
      selector.style.background = "url(" + self.options.imageBackgroundSrc + ")";
      // bgc += "background:url(" + self.options.imageBackgroundSrc + ");";
    } else {
      selector.style.background = self.options.colorBackground;
      // bgc += "background:" + self.options.colorBackground + ";";
    }
    // bgc += "background-size: cover;font-size: 0;display:inline-block;";
    selector.style.backgroundSize = "cover";
    selector.style.fontSize = "0";
    selector.style.display = "inline-block";
    // selector.style = bgc;
  });
  this.drawSet();
};
ScratchCard.prototype.drawSet = function () {
  var self = this,
      isPress = false,
      eventDown = ['mousedown', 'touchstart'],
      eventMove = ['mousemove', 'touchmove'],
      eventUp = ['mouseup', 'touchend'];
  function getProgress() {
    var pix = self.options.width * self.options.height;
    var holes = 0;
    var data = self.ctx.getImageData(0, 0, self.options.width, self.options.height).data;
    for (var index = 3, count = data.length; index < count; index += 4) {
      if (data[index] >= 255) {
        holes++;
      }
    }
    var percent = Math.round((pix - holes) / pix * 100 * Math.pow(10, 2)) / Math.pow(10, 2);
    return percent;
  }
  function onMouseDown(e) {
    var boundingRect = self.canvas.getBoundingClientRect();
    isPress = true;
    self.old = { x: e.clientX || e.targetTouches[0].clientX, y: e.clientY || e.targetTouches[0].clientY };
    self.old.x -= boundingRect.left;
    self.old.y -= boundingRect.top;
    self.ctx.globalCompositeOperation = 'destination-out';
    self.ctx.beginPath();
    self.ctx.arc(self.old.x, self.old.y, self.options.clearRadius / 2, 0, 2 * Math.PI);
    self.ctx.fill();
  }

  function onMouseMove(e) {
    e.preventDefault();
    if (isPress) {
      var boundingRect = self.canvas.getBoundingClientRect();
      var x = e.clientX || e.targetTouches[0].clientX;
      var y = e.clientY || e.targetTouches[0].clientY;
      x -= boundingRect.left;
      y -= boundingRect.top;
      self.ctx.beginPath();
      self.ctx.arc(self.old.x, self.old.y, self.options.clearRadius / 2, 0, 2 * Math.PI);
      self.ctx.fill();
      self.ctx.lineWidth = self.options.clearRadius;
      self.ctx.beginPath();
      self.ctx.moveTo(self.old.x, self.old.y);
      self.ctx.lineTo(x, y);
      self.ctx.stroke();
      self.old = { x: x, y: y };
      self.progress = getProgress();
      if (self.options.percentToFinish && self.progress >= self.options.percentToFinish) {
        finish();
      }
    }
  }
  function onMouseUp(e) {
    isPress = false;
  }
  // finish。
  function finish() {
    eventDown.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseDown, true);
    });
    eventMove.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseMove, true);
    });
    eventUp.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseUp, true);
    });
    self.ctx.clearRect(0, 0, self.options.width, self.options.height);
    return self.options.callback();
  }
  function onOpenOnce(e) {
    if (!self.feedback) {
      self.feedback = true;
      return self.options.open();
    }
  }

  eventDown.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseDown, true);
    self.canvas.addEventListener(event, onOpenOnce, { "once": true, "capture": true });
  });
  eventMove.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseMove, true);
  });
  eventUp.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseUp, true);
  });
};