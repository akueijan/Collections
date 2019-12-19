"use strict";

var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : window;

(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  _gsScope._gsDefine("easing.CustomEase", ["easing.Ease"], function (m) {
    function D(e, t, n, i, o, s, a, r, h, u, c) {
      var l,
          f = (e + n) / 2,
          g = (t + i) / 2,
          p = (n + o) / 2,
          x = (i + s) / 2,
          d = (o + a) / 2,
          y = (s + r) / 2,
          m = (f + p) / 2,
          S = (g + x) / 2,
          _ = (p + d) / 2,
          w = (x + y) / 2,
          M = (m + _) / 2,
          b = (S + w) / 2,
          v = a - e,
          k = r - t,
          C = Math.abs((n - a) * k - (i - r) * v),
          z = Math.abs((o - a) * k - (s - r) * v);

      return u || (u = [{
        x: e,
        y: t
      }, {
        x: a,
        y: r
      }], c = 1), u.splice(c || u.length - 1, 0, {
        x: M,
        y: b
      }), h * (v * v + k * k) < (C + z) * (C + z) && (l = u.length, D(e, t, f, g, m, S, M, b, h, u, c), D(M, b, _, w, d, y, a, r, h, u, c + 1 + (u.length - l))), u;
    }

    function i(e) {
      var t = this.lookup[e * this.l | 0] || this.lookup[this.l - 1];
      return t.nx < e && (t = t.n), t.y + (e - t.x) / t.cx * t.cy;
    }

    function o(e, t, n) {
      this._calcEnd = !0, (this.id = e) && (m.map[e] = this), this.getRatio = i, this.setData(t, n);
    }

    var x = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        S = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
        _ = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
        d = /[cLlsS]/g,
        w = "CustomEase only accepts Cubic Bezier data.",
        e = o.prototype = new m();
    return e.constructor = o, e.setData = function (e, t) {
      var n,
          i,
          o,
          s,
          a,
          r,
          h,
          u,
          c,
          l,
          f = (e = e || "0,0,1,1").match(x),
          g = 1,
          p = [];
      if (l = (t = t || {}).precision || 1, this.data = e, this.lookup = [], this.points = p, this.fast = l <= 1, (d.test(e) || -1 !== e.indexOf("M") && -1 === e.indexOf("C")) && (f = function (e) {
        var t,
            n,
            i,
            o,
            s,
            a,
            r,
            h,
            u,
            c,
            l,
            f = (e + "").replace(_, function (e) {
          var t = +e;
          return t < 1e-4 && -1e-4 < t ? 0 : t;
        }).match(S) || [],
            g = [],
            p = 0,
            x = 0,
            d = f.length,
            y = 2;

        for (t = 0; t < d; t++) {
          if (u = o, isNaN(f[t]) ? (o = f[t].toUpperCase(), s = o !== f[t]) : t--, n = +f[t + 1], i = +f[t + 2], s && (n += p, i += x), t || (r = n, h = i), "M" === o) a && a.length < 8 && (g.length -= 1, y = 0), p = r = n, x = h = i, a = [n, i], y = 2, g.push(a), t += 2, o = "L";else if ("C" === o) (a = a || [0, 0])[y++] = n, a[y++] = i, s || (p = x = 0), a[y++] = p + 1 * f[t + 3], a[y++] = x + 1 * f[t + 4], a[y++] = p += 1 * f[t + 5], a[y++] = x += 1 * f[t + 6], t += 6;else if ("S" === o) "C" === u || "S" === u ? (c = p - a[y - 4], l = x - a[y - 3], a[y++] = p + c, a[y++] = x + l) : (a[y++] = p, a[y++] = x), a[y++] = n, a[y++] = i, s || (p = x = 0), a[y++] = p += 1 * f[t + 3], a[y++] = x += 1 * f[t + 4], t += 4;else {
            if ("L" !== o && "Z" !== o) throw w;
            "Z" === o && (n = r, i = h, a.closed = !0), ("L" === o || .5 < Math.abs(p - n) || .5 < Math.abs(x - i)) && (a[y++] = p + (n - p) / 3, a[y++] = x + (i - x) / 3, a[y++] = p + 2 * (n - p) / 3, a[y++] = x + 2 * (i - x) / 3, a[y++] = n, a[y++] = i, "L" === o && (t += 2)), p = n, x = i;
          }
        }

        return g[0];
      }(e)), 4 === (n = f.length)) f.unshift(0, 0), f.push(1, 1), n = 8;else if ((n - 2) % 6) throw w;

      for (0 == +f[0] && 1 == +f[n - 2] || function (e, t, n) {
        n || 0 === n || (n = Math.max(+e[e.length - 1], +e[1]));
        var i,
            o = -1 * +e[0],
            s = -n,
            a = e.length,
            r = 1 / (+e[a - 2] + o),
            h = -t || (Math.abs(+e[a - 1] - +e[1]) < .01 * (+e[a - 2] - +e[0]) ? function (e) {
          var t,
              n = e.length,
              i = 999999999999;

          for (t = 1; t < n; t += 6) {
            +e[t] < i && (i = +e[t]);
          }

          return i;
        }(e) + s : +e[a - 1] + s);

        for (h = h ? 1 / h : -r, i = 0; i < a; i += 2) {
          e[i] = (+e[i] + o) * r, e[i + 1] = (+e[i + 1] + s) * h;
        }
      }(f, t.height, t.originY), this.rawBezier = f, s = 2; s < n; s += 6) {
        i = {
          x: +f[s - 2],
          y: +f[s - 1]
        }, o = {
          x: +f[s + 4],
          y: +f[s + 5]
        }, p.push(i, o), D(i.x, i.y, +f[s], +f[s + 1], +f[s + 2], +f[s + 3], o.x, o.y, 1 / (2e5 * l), p, p.length - 1);
      }

      for (n = p.length, s = 0; s < n; s++) {
        h = p[s], u = p[s - 1] || h, h.x > u.x || u.y !== h.y && u.x === h.x || h === u ? (u.cx = h.x - u.x, u.cy = h.y - u.y, u.n = h, u.nx = h.x, this.fast && 1 < s && 2 < Math.abs(u.cy / u.cx - p[s - 2].cy / p[s - 2].cx) && (this.fast = !1), u.cx < g && (u.cx ? g = u.cx : (u.cx = .001, s === n - 1 && (u.x -= .001, g = Math.min(g, .001), this.fast = !1)))) : (p.splice(s--, 1), n--);
      }

      if (n = 1 / g + 1 | 0, a = 1 / (this.l = n), h = p[r = 0], this.fast) {
        for (s = 0; s < n; s++) {
          c = s * a, h.nx < c && (h = p[++r]), i = h.y + (c - h.x) / h.cx * h.cy, this.lookup[s] = {
            x: c,
            cx: a,
            y: i,
            cy: 0,
            nx: 9
          }, s && (this.lookup[s - 1].cy = i - this.lookup[s - 1].y);
        }

        this.lookup[n - 1].cy = p[p.length - 1].y - i;
      } else {
        for (s = 0; s < n; s++) {
          h.nx < s * a && (h = p[++r]), this.lookup[s] = h;
        }

        r < p.length - 1 && (this.lookup[s - 1] = p[p.length - 2]);
      }

      return this._calcEnd = 1 !== p[p.length - 1].y || 0 !== p[0].y, this;
    }, e.getRatio = i, e.getSVGData = function (e) {
      return o.getSVGData(this, e);
    }, o.create = function (e, t, n) {
      return new o(e, t, n);
    }, o.version = "0.2.2", o.bezierToPoints = D, o.get = function (e) {
      return m.map[e];
    }, o.getSVGData = function (e, t) {
      var n,
          i,
          o,
          s,
          a,
          r,
          h,
          u,
          c,
          l,
          f = 1e3,
          g = (t = t || {}).width || 100,
          p = t.height || 100,
          x = t.x || 0,
          d = (t.y || 0) + p,
          y = t.path;

      if (t.invert && (p = -p, d = 0), (e = e.getRatio ? e : m.map[e] || console.log("No ease found: ", e)).rawBezier) {
        for (n = [], h = e.rawBezier.length, o = 0; o < h; o += 2) {
          n.push(((x + e.rawBezier[o] * g) * f | 0) / f + "," + ((d + e.rawBezier[o + 1] * -p) * f | 0) / f);
        }

        n[0] = "M" + n[0], n[1] = "C" + n[1];
      } else for (n = ["M" + x + "," + d], s = 1 / (h = Math.max(5, 200 * (t.precision || 1))), u = 5 / (h += 2), c = ((x + s * g) * f | 0) / f, i = ((l = ((d + e.getRatio(s) * -p) * f | 0) / f) - d) / (c - x), o = 2; o < h; o++) {
        a = ((x + o * s * g) * f | 0) / f, r = ((d + e.getRatio(o * s) * -p) * f | 0) / f, (Math.abs((r - l) / (a - c) - i) > u || o === h - 1) && (n.push(c + "," + l), i = (r - l) / (a - c)), c = a, l = r;
      }

      return y && ("string" == typeof y ? document.querySelector(y) : y).setAttribute("d", n.join(" ")), n.join(" ");
    }, o;
  }, !0);
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(), function () {
  function e() {
    return (_gsScope.GreenSockGlobals || _gsScope).CustomEase;
  }

  "undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = e()) : "function" == typeof define && define.amd && define(["TweenLite"], e);
}();
;

(function ($) {
  $.fn.menu = function (opts) {
    // default configuration
    var config = $.extend({}, {
      opt1: null
    }, opts); // main function

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
    } // initialize every element


    return this.each(function () {
      init($(this));
    });
  }; // start

})(jQuery);

;

(function ($) {
  $.fn.loadpage = function (action, opts) {
    action = action ? action : "init";
    var progressValue = 0;
    var loadHtml = ['<div class="mdLoading">', '    <div class="loadingBox">', '		 <div class="anibg"></div>', '        <img class="line2" src="images/loading-pic.gif">', '        <div class="progressBar">', '        </div>', '        <div class="progress js-bar" style="width:0"></div>', '    </div>', '</div>'].join('');
    var dLoad, dCount, dBar, dAnibg, dBox;
    var config = $.extend({
      async: false
    }, opts);

    function init(obj) {
      $(loadHtml).appendTo('body');
      dLoad = obj.find('.mdLoading');
      dBox = dLoad.find('.loadingBox');
      dCount = dLoad.find('.js-count');
      dBar = dBox.find('.js-bar');
      dAnibg = dLoad.find('.anibg');
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
          };

          queue.on("progress", function () {
            var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
            dCount.text(procValue + '%');

            if (isMobile) {
              if (procValue >= 68) {
                dBar.css({
                  'width': '67%'
                });
              } else {
                dBar.css({
                  'width': procValue - 4 + '%'
                });
              }
            } else {
              dBar.css({
                'width': procValue - 4 + '%'
              });
            } // dAnibg.css({
            // 	'transform':'translateY('+(100-procValue)+'%)'
            // 	// 'transform':'translateY(0%)'
            // });
            // dBox.addClass("loadingBox-active");
            // dBox.css({
            // 	'transform':'translate(-50%,'+(-50+procValue)+'%)'
            // 	// 'transform':'translateY(0%)'
            // });

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
      dBox = dLoad.find('.loadingBox'); // dAnibg = dLoad.find('.anibg');
      // dCount.text('100%');
      // dBar.css({
      // 	'width':'100%'
      // });
      // dAnibg.addClass("anibg-active");
      // dBox.addClass("loadingBox-active");

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

!function (T, G) {
  (function () {
    if ("undefined" != typeof module && module.exports) return function (T) {
      module.exports = T();
    };
    if ("function" == typeof define && define.amd) return define;
    if ("undefined" != typeof window) return function (T) {
      window.MobileDetect = T();
    };
    throw new Error("unknown environment");
  })()(function () {
    function e(T, e) {
      return null != T && null != e && T.toLowerCase() === e.toLowerCase();
    }

    function S(T, e) {
      var S,
          i,
          o = T.length;
      if (!o || !e) return !1;

      for (S = e.toLowerCase(), i = 0; i < o; ++i) {
        if (S === T[i].toLowerCase()) return !0;
      }

      return !1;
    }

    function M(T) {
      for (var e in T) {
        n.call(T, e) && (T[e] = new RegExp(T[e], "i"));
      }
    }

    function a(T, e) {
      this.ua = function (T) {
        return (T || "").substr(0, 500);
      }(T), this._cache = {}, this.maxPhoneWidth = e || 600;
    }

    var A,
        b = {
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
        n = Object.prototype.hasOwnProperty;
    return b.FALLBACK_PHONE = "UnknownPhone", b.FALLBACK_TABLET = "UnknownTablet", b.FALLBACK_MOBILE = "UnknownMobile", A = "isArray" in Array ? Array.isArray : function (T) {
      return "[object Array]" === Object.prototype.toString.call(T);
    }, function () {
      var T,
          e,
          S,
          i,
          o,
          P,
          a = b.mobileDetectRules;

      for (T in a.props) {
        if (n.call(a.props, T)) {
          for (e = a.props[T], A(e) || (e = [e]), o = e.length, i = 0; i < o; ++i) {
            0 <= (P = (S = e[i]).indexOf("[VER]")) && (S = S.substring(0, P) + "([\\w._\\+]+)" + S.substring(P + 5)), e[i] = new RegExp(S, "i");
          }

          a.props[T] = e;
        }
      }

      M(a.oss), M(a.phones), M(a.tablets), M(a.uas), M(a.utils), a.oss0 = {
        WindowsPhoneOS: a.oss.WindowsPhoneOS,
        WindowsMobileOS: a.oss.WindowsMobileOS
      };
    }(), b.findMatch = function (T, e) {
      for (var S in T) {
        if (n.call(T, S) && T[S].test(e)) return S;
      }

      return null;
    }, b.findMatches = function (T, e) {
      var S = [];

      for (var i in T) {
        n.call(T, i) && T[i].test(e) && S.push(i);
      }

      return S;
    }, b.getVersionStr = function (T, e) {
      var S,
          i,
          o,
          P,
          a = b.mobileDetectRules.props;
      if (n.call(a, T)) for (o = (S = a[T]).length, i = 0; i < o; ++i) {
        if (null !== (P = S[i].exec(e))) return P[1];
      }
      return null;
    }, b.getVersion = function (T, e) {
      var S = b.getVersionStr(T, e);
      return S ? b.prepareVersionNo(S) : NaN;
    }, b.prepareVersionNo = function (T) {
      var e;
      return 1 === (e = T.split(/[a-z._ \/\-]/i)).length && (T = e[0]), 1 < e.length && (T = e[0] + ".", e.shift(), T += e.join("")), +T;
    }, b.isMobileFallback = function (T) {
      return b.detectMobileBrowsers.fullPattern.test(T) || b.detectMobileBrowsers.shortPattern.test(T.substr(0, 4));
    }, b.isTabletFallback = function (T) {
      return b.detectMobileBrowsers.tabletPattern.test(T);
    }, b.prepareDetectionCache = function (T, e, S) {
      var i, o, P;
      if (T.mobile === G) return (o = b.findMatch(b.mobileDetectRules.tablets, e)) ? (T.mobile = T.tablet = o, void (T.phone = null)) : (i = b.findMatch(b.mobileDetectRules.phones, e)) ? (T.mobile = T.phone = i, void (T.tablet = null)) : void (b.isMobileFallback(e) ? (P = a.isPhoneSized(S)) === G ? (T.mobile = b.FALLBACK_MOBILE, T.tablet = T.phone = null) : P ? (T.mobile = T.phone = b.FALLBACK_PHONE, T.tablet = null) : (T.mobile = T.tablet = b.FALLBACK_TABLET, T.phone = null) : b.isTabletFallback(e) ? (T.mobile = T.tablet = b.FALLBACK_TABLET, T.phone = null) : T.mobile = T.tablet = T.phone = null);
    }, b.mobileGrade = function (T) {
      var e = null !== T.mobile();
      return T.os("iOS") && 4.3 <= T.version("iPad") || T.os("iOS") && 3.1 <= T.version("iPhone") || T.os("iOS") && 3.1 <= T.version("iPod") || 2.1 < T.version("Android") && T.is("Webkit") || 7 <= T.version("Windows Phone OS") || T.is("BlackBerry") && 6 <= T.version("BlackBerry") || T.match("Playbook.*Tablet") || 1.4 <= T.version("webOS") && T.match("Palm|Pre|Pixi") || T.match("hp.*TouchPad") || T.is("Firefox") && 12 <= T.version("Firefox") || T.is("Chrome") && T.is("AndroidOS") && 4 <= T.version("Android") || T.is("Skyfire") && 4.1 <= T.version("Skyfire") && T.is("AndroidOS") && 2.3 <= T.version("Android") || T.is("Opera") && 11 < T.version("Opera Mobi") && T.is("AndroidOS") || T.is("MeeGoOS") || T.is("Tizen") || T.is("Dolfin") && 2 <= T.version("Bada") || (T.is("UC Browser") || T.is("Dolfin")) && 2.3 <= T.version("Android") || T.match("Kindle Fire") || T.is("Kindle") && 3 <= T.version("Kindle") || T.is("AndroidOS") && T.is("NookTablet") || 11 <= T.version("Chrome") && !e || 5 <= T.version("Safari") && !e || 4 <= T.version("Firefox") && !e || 7 <= T.version("MSIE") && !e || 10 <= T.version("Opera") && !e ? "A" : T.os("iOS") && T.version("iPad") < 4.3 || T.os("iOS") && T.version("iPhone") < 3.1 || T.os("iOS") && T.version("iPod") < 3.1 || T.is("Blackberry") && 5 <= T.version("BlackBerry") && T.version("BlackBerry") < 6 || 5 <= T.version("Opera Mini") && T.version("Opera Mini") <= 6.5 && (2.3 <= T.version("Android") || T.is("iOS")) || T.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") || 11 <= T.version("Opera Mobi") && T.is("SymbianOS") ? "B" : (T.version("BlackBerry") < 5 || T.match("MSIEMobile|Windows CE.*Mobile") || T.version("Windows Mobile"), "C");
    }, b.detectOS = function (T) {
      return b.findMatch(b.mobileDetectRules.oss0, T) || b.findMatch(b.mobileDetectRules.oss, T);
    }, b.getDeviceSmallerSide = function () {
      return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    }, a.prototype = {
      constructor: a,
      mobile: function mobile() {
        return b.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.mobile;
      },
      phone: function phone() {
        return b.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.phone;
      },
      tablet: function tablet() {
        return b.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.tablet;
      },
      userAgent: function userAgent() {
        return this._cache.userAgent === G && (this._cache.userAgent = b.findMatch(b.mobileDetectRules.uas, this.ua)), this._cache.userAgent;
      },
      userAgents: function userAgents() {
        return this._cache.userAgents === G && (this._cache.userAgents = b.findMatches(b.mobileDetectRules.uas, this.ua)), this._cache.userAgents;
      },
      os: function os() {
        return this._cache.os === G && (this._cache.os = b.detectOS(this.ua)), this._cache.os;
      },
      version: function version(T) {
        return b.getVersion(T, this.ua);
      },
      versionStr: function versionStr(T) {
        return b.getVersionStr(T, this.ua);
      },
      is: function is(T) {
        return S(this.userAgents(), T) || e(T, this.os()) || e(T, this.phone()) || e(T, this.tablet()) || S(b.findMatches(b.mobileDetectRules.utils, this.ua), T);
      },
      match: function match(T) {
        return T instanceof RegExp || (T = new RegExp(T, "i")), T.test(this.ua);
      },
      isPhoneSized: function isPhoneSized(T) {
        return a.isPhoneSized(T || this.maxPhoneWidth);
      },
      mobileGrade: function mobileGrade() {
        return this._cache.grade === G && (this._cache.grade = b.mobileGrade(this)), this._cache.grade;
      }
    }, a.isPhoneSized = "undefined" != typeof window && window.screen ? function (T) {
      return T < 0 ? G : b.getDeviceSmallerSide() <= T;
    } : function () {}, a._impl = b, a.version = "1.4.2 2018-06-10", a;
  });
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9tb2JpbGUtZGV0ZWN0Lm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFBQSxJQUFBLFFBQUEsR0FBQSxlQUFBLE9BQUEsTUFBQSxJQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsZUFBQSxPQUFBLE1BQUEsR0FBQSxNQUFBLEdBQUEsTUFBQTs7QUFBQSxDQUFBLFFBQUEsQ0FBQSxRQUFBLEtBQUEsUUFBQSxDQUFBLFFBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFBLFNBQUEsQ0FBQSxtQkFBQSxFQUFBLENBQUEsYUFBQSxDQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUE7QUFBQSxhQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsVUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLENBQUE7O0FBQUEsYUFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEVBQUE7QUFBQSxPQUFBLEVBQUE7QUFBQSxRQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEVBQUE7QUFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxFQUFBO0FBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBOztBQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLEtBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsS0FBQSxNQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUEsYUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUFBOztBQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsV0FBQSxRQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsS0FBQSxRQUFBLEdBQUEsQ0FBQSxFQUFBLEtBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxRQUFBLENBQUEsR0FBQSxnREFBQTtBQUFBLFFBQUEsQ0FBQSxHQUFBLGtEQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUEsK0JBQUE7QUFBQSxRQUFBLENBQUEsR0FBQSxVQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUEsNENBQUE7QUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsU0FBQSxHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQUEsV0FBQSxDQUFBLENBQUEsV0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsT0FBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxTQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxFQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQSxTQUFBLElBQUEsQ0FBQSxFQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxNQUFBLEdBQUEsQ0FBQSxFQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBLEVBQUEsVUFBQSxDQUFBLEVBQUE7QUFBQSxjQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFBQSxpQkFBQSxDQUFBLEdBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLFNBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxLQUFBLEVBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxFQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsS0FBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxJQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBO0FBQUEsZ0JBQUEsUUFBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBO0FBQUEsb0JBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsS0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxLQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBO0FBQUE7O0FBQUEsZUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEtBQUEsSUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQTs7QUFBQSxXQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFFBQUEsQ0FBQSxJQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsVUFBQSxDQUFBLEVBQUE7QUFBQSxjQUFBLENBQUE7QUFBQSxjQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQTtBQUFBLGNBQUEsQ0FBQSxHQUFBLFlBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxhQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBOztBQUFBLGlCQUFBLENBQUE7QUFBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBOztBQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBO0FBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUE7QUFBQSxVQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBO0FBQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsU0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLEVBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBO0FBQUE7O0FBQUEsVUFBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxLQUFBLElBQUEsRUFBQTtBQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxNQUFBLENBQUEsQ0FBQSxJQUFBO0FBQUEsWUFBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFlBQUEsRUFBQSxFQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsWUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUFBLFlBQUEsRUFBQSxFQUFBO0FBQUEsV0FBQSxFQUFBLENBQUEsS0FBQSxLQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsS0FBQSxNQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxhQUFBLE1BQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLE9BQUEsTUFBQTtBQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBOztBQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxLQUFBLEtBQUEsTUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQSxLQUFBLFFBQUEsR0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsSUFBQTtBQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsUUFBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsYUFBQSxDQUFBLENBQUEsVUFBQSxDQUFBLElBQUEsRUFBQSxDQUFBLENBQUE7QUFBQSxLQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsR0FBQSxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsYUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtBQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsT0FBQSxHQUFBLE9BQUEsRUFBQSxDQUFBLENBQUEsY0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsR0FBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsYUFBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLEtBQUEsRUFBQSxDQUFBLENBQUEsVUFBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLEdBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxFQUFBLEtBQUEsSUFBQSxHQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsSUFBQSxHQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUE7O0FBQUEsVUFBQSxDQUFBLENBQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsaUJBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxTQUFBLEVBQUE7QUFBQSxhQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUE7O0FBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsTUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLE9BQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsU0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBO0FBQUE7O0FBQUEsYUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLE9BQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxhQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsS0FBQSxFQUFBLENBQUE7QUFBQSxHQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxTQUFBLElBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxZQUFBO0FBQUEsV0FBQSxDQUFBLEdBQUE7QUFBQSxXQUFBLENBQUEsUUFBQSxDQUFBLGdCQUFBLElBQUEsUUFBQSxFQUFBLFVBQUE7QUFBQTs7QUFBQSxpQkFBQSxPQUFBLE1BQUEsSUFBQSxNQUFBLENBQUEsT0FBQSxJQUFBLE9BQUEsQ0FBQSxxQkFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLE9BQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxjQUFBLE9BQUEsTUFBQSxJQUFBLE1BQUEsQ0FBQSxHQUFBLElBQUEsTUFBQSxDQUFBLENBQUEsV0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQUEsQ0FBQSxFQUFBIiwiZmlsZSI6ImxpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiOyFmdW5jdGlvbihsLG0pe2woZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHYsdyl7cmV0dXJuIG51bGwhPXYmJm51bGwhPXcmJnYudG9Mb3dlckNhc2UoKT09PXcudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBvKHYsdyl7dmFyIHgseSx6PXYubGVuZ3RoO2lmKCF6fHwhdylyZXR1cm4hMTtmb3IoeD13LnRvTG93ZXJDYXNlKCkseT0wO3k8ejsrK3kpaWYoeD09PXZbeV0udG9Mb3dlckNhc2UoKSlyZXR1cm4hMDtyZXR1cm4hMX1mdW5jdGlvbiBwKHYpe2Zvcih2YXIgdyBpbiB2KXUuY2FsbCh2LHcpJiYodlt3XT1uZXcgUmVnRXhwKHZbd10sXCJpXCIpKX1mdW5jdGlvbiBxKHYpe3JldHVybih2fHxcIlwiKS5zdWJzdHIoMCw1MDApfWZ1bmN0aW9uIHIodix3KXt0aGlzLnVhPXEodiksdGhpcy5fY2FjaGU9e30sdGhpcy5tYXhQaG9uZVdpZHRoPXd8fDYwMH12YXIgcz17bW9iaWxlRGV0ZWN0UnVsZXM6e3Bob25lczp7aVBob25lOlwiXFxcXGJpUGhvbmVcXFxcYnxcXFxcYmlQb2RcXFxcYlwiLEJsYWNrQmVycnk6XCJCbGFja0JlcnJ5fFxcXFxiQkIxMFxcXFxifHJpbVswLTldK1wiLEhUQzpcIkhUQ3xIVEMuKihTZW5zYXRpb258RXZvfFZpc2lvbnxFeHBsb3Jlcnw2ODAwfDgxMDB8ODkwMHxBNzI3MnxTNTEwZXxDMTEwZXxMZWdlbmR8RGVzaXJlfFQ4MjgyKXxBUFg1MTVDS1R8UXRlazkwOTB8QVBBOTI5MktUfEhEX21pbml8U2Vuc2F0aW9uLipaNzEwZXxQRzg2MTAwfFo3MTVlfERlc2lyZS4qKEE4MTgxfEhEKXxBRFI2MjAwfEFEUjY0MDBMfEFEUjY0MjV8MDAxSFR8SW5zcGlyZSA0R3xBbmRyb2lkLipcXFxcYkVWT1xcXFxifFQtTW9iaWxlIEcxfFo1MjBtfEFuZHJvaWQgWzAtOS5dKzsgUGl4ZWxcIixOZXh1czpcIk5leHVzIE9uZXxOZXh1cyBTfEdhbGF4eS4qTmV4dXN8QW5kcm9pZC4qTmV4dXMuKk1vYmlsZXxOZXh1cyA0fE5leHVzIDV8TmV4dXMgNlwiLERlbGw6XCJEZWxsWztdPyAoU3RyZWFrfEFlcm98VmVudWV8VmVudWUgUHJvfEZsYXNofFNtb2tlfE1pbmkgM2lYKXxYQ0QyOHxYQ0QzNXxcXFxcYjAwMURMXFxcXGJ8XFxcXGIxMDFETFxcXFxifFxcXFxiR1MwMVxcXFxiXCIsTW90b3JvbGE6XCJNb3Rvcm9sYXxEUk9JRFh8RFJPSUQgQklPTklDfFxcXFxiRHJvaWRcXFxcYi4qQnVpbGR8QW5kcm9pZC4qWG9vbXxIUkkzOXxNT1QtfEExMjYwfEExNjgwfEE1NTV8QTg1M3xBODU1fEE5NTN8QTk1NXxBOTU2fE1vdG9yb2xhLipFTEVDVFJJRll8TW90b3JvbGEuKmkxfGk4Njd8aTk0MHxNQjIwMHxNQjMwMHxNQjUwMXxNQjUwMnxNQjUwOHxNQjUxMXxNQjUyMHxNQjUyNXxNQjUyNnxNQjYxMXxNQjYxMnxNQjYzMnxNQjgxMHxNQjg1NXxNQjg2MHxNQjg2MXxNQjg2NXxNQjg3MHxNRTUwMXxNRTUwMnxNRTUxMXxNRTUyNXxNRTYwMHxNRTYzMnxNRTcyMnxNRTgxMXxNRTg2MHxNRTg2M3xNRTg2NXxNVDYyMHxNVDcxMHxNVDcxNnxNVDcyMHxNVDgxMHxNVDg3MHxNVDkxN3xNb3Rvcm9sYS4qVElUQU5JVU18V1g0MzV8V1g0NDV8WFQzMDB8WFQzMDF8WFQzMTF8WFQzMTZ8WFQzMTd8WFQzMTl8WFQzMjB8WFQzOTB8WFQ1MDJ8WFQ1MzB8WFQ1MzF8WFQ1MzJ8WFQ1MzV8WFQ2MDN8WFQ2MTB8WFQ2MTF8WFQ2MTV8WFQ2ODF8WFQ3MDF8WFQ3MDJ8WFQ3MTF8WFQ3MjB8WFQ4MDB8WFQ4MDZ8WFQ4NjB8WFQ4NjJ8WFQ4NzV8WFQ4ODJ8WFQ4ODN8WFQ4OTR8WFQ5MDF8WFQ5MDd8WFQ5MDl8WFQ5MTB8WFQ5MTJ8WFQ5Mjh8WFQ5MjZ8WFQ5MTV8WFQ5MTl8WFQ5MjV8WFQxMDIxfFxcXFxiTW90byBFXFxcXGJ8WFQxMDY4fFhUMTA5MnxYVDEwNTJcIixTYW1zdW5nOlwiXFxcXGJTYW1zdW5nXFxcXGJ8U00tRzk1MEZ8U00tRzk1NUZ8U00tRzkyNTB8R1QtMTkzMDB8U0dILUkzMzd8QkdULVM1MjMwfEdULUIyMTAwfEdULUIyNzAwfEdULUIyNzEwfEdULUIzMjEwfEdULUIzMzEwfEdULUIzNDEwfEdULUIzNzMwfEdULUIzNzQwfEdULUI1NTEwfEdULUI1NTEyfEdULUI1NzIyfEdULUI2NTIwfEdULUI3MzAwfEdULUI3MzIwfEdULUI3MzMwfEdULUI3MzUwfEdULUI3NTEwfEdULUI3NzIyfEdULUI3ODAwfEdULUMzMDEwfEdULUMzMDExfEdULUMzMDYwfEdULUMzMjAwfEdULUMzMjEyfEdULUMzMjEySXxHVC1DMzI2MnxHVC1DMzIyMnxHVC1DMzMwMHxHVC1DMzMwMEt8R1QtQzMzMDN8R1QtQzMzMDNLfEdULUMzMzEwfEdULUMzMzIyfEdULUMzMzMwfEdULUMzMzUwfEdULUMzNTAwfEdULUMzNTEwfEdULUMzNTMwfEdULUMzNjMwfEdULUMzNzgwfEdULUM1MDEwfEdULUM1MjEyfEdULUM2NjIwfEdULUM2NjI1fEdULUM2NzEyfEdULUUxMDUwfEdULUUxMDcwfEdULUUxMDc1fEdULUUxMDgwfEdULUUxMDgxfEdULUUxMDg1fEdULUUxMDg3fEdULUUxMTAwfEdULUUxMTA3fEdULUUxMTEwfEdULUUxMTIwfEdULUUxMTI1fEdULUUxMTMwfEdULUUxMTYwfEdULUUxMTcwfEdULUUxMTc1fEdULUUxMTgwfEdULUUxMTgyfEdULUUxMjAwfEdULUUxMjEwfEdULUUxMjI1fEdULUUxMjMwfEdULUUxMzkwfEdULUUyMTAwfEdULUUyMTIwfEdULUUyMTIxfEdULUUyMTUyfEdULUUyMjIwfEdULUUyMjIyfEdULUUyMjMwfEdULUUyMjMyfEdULUUyMjUwfEdULUUyMzcwfEdULUUyNTUwfEdULUUyNjUyfEdULUUzMjEwfEdULUUzMjEzfEdULUk1NTAwfEdULUk1NTAzfEdULUk1NzAwfEdULUk1ODAwfEdULUk1ODAxfEdULUk2NDEwfEdULUk2NDIwfEdULUk3MTEwfEdULUk3NDEwfEdULUk3NTAwfEdULUk4MDAwfEdULUk4MTUwfEdULUk4MTYwfEdULUk4MTkwfEdULUk4MzIwfEdULUk4MzMwfEdULUk4MzUwfEdULUk4NTMwfEdULUk4NzAwfEdULUk4NzAzfEdULUk4OTEwfEdULUk5MDAwfEdULUk5MDAxfEdULUk5MDAzfEdULUk5MDEwfEdULUk5MDIwfEdULUk5MDIzfEdULUk5MDcwfEdULUk5MDgyfEdULUk5MTAwfEdULUk5MTAzfEdULUk5MjIwfEdULUk5MjUwfEdULUk5MzAwfEdULUk5MzA1fEdULUk5NTAwfEdULUk5NTA1fEdULU0zNTEwfEdULU01NjUwfEdULU03NTAwfEdULU03NjAwfEdULU03NjAzfEdULU04ODAwfEdULU04OTEwfEdULU43MDAwfEdULVMzMTEwfEdULVMzMzEwfEdULVMzMzUwfEdULVMzMzUzfEdULVMzMzcwfEdULVMzNjUwfEdULVMzNjUzfEdULVMzNzcwfEdULVMzODUwfEdULVM1MjEwfEdULVM1MjIwfEdULVM1MjI5fEdULVM1MjMwfEdULVM1MjMzfEdULVM1MjUwfEdULVM1MjUzfEdULVM1MjYwfEdULVM1MjYzfEdULVM1MjcwfEdULVM1MzAwfEdULVM1MzMwfEdULVM1MzUwfEdULVM1MzYwfEdULVM1MzYzfEdULVM1MzY5fEdULVM1MzgwfEdULVM1MzgwRHxHVC1TNTU2MHxHVC1TNTU3MHxHVC1TNTYwMHxHVC1TNTYwM3xHVC1TNTYxMHxHVC1TNTYyMHxHVC1TNTY2MHxHVC1TNTY3MHxHVC1TNTY5MHxHVC1TNTc1MHxHVC1TNTc4MHxHVC1TNTgzMHxHVC1TNTgzOXxHVC1TNjEwMnxHVC1TNjUwMHxHVC1TNzA3MHxHVC1TNzIwMHxHVC1TNzIyMHxHVC1TNzIzMHxHVC1TNzIzM3xHVC1TNzI1MHxHVC1TNzUwMHxHVC1TNzUzMHxHVC1TNzU1MHxHVC1TNzU2MnxHVC1TNzcxMHxHVC1TODAwMHxHVC1TODAwM3xHVC1TODUwMHxHVC1TODUzMHxHVC1TODYwMHxTQ0gtQTMxMHxTQ0gtQTUzMHxTQ0gtQTU3MHxTQ0gtQTYxMHxTQ0gtQTYzMHxTQ0gtQTY1MHxTQ0gtQTc5MHxTQ0gtQTc5NXxTQ0gtQTg1MHxTQ0gtQTg3MHxTQ0gtQTg5MHxTQ0gtQTkzMHxTQ0gtQTk1MHxTQ0gtQTk3MHxTQ0gtQTk5MHxTQ0gtSTEwMHxTQ0gtSTExMHxTQ0gtSTQwMHxTQ0gtSTQwNXxTQ0gtSTUwMHxTQ0gtSTUxMHxTQ0gtSTUxNXxTQ0gtSTYwMHxTQ0gtSTczMHxTQ0gtSTc2MHxTQ0gtSTc3MHxTQ0gtSTgzMHxTQ0gtSTkxMHxTQ0gtSTkyMHxTQ0gtSTk1OXxTQ0gtTEMxMXxTQ0gtTjE1MHxTQ0gtTjMwMHxTQ0gtUjEwMHxTQ0gtUjMwMHxTQ0gtUjM1MXxTQ0gtUjQwMHxTQ0gtUjQxMHxTQ0gtVDMwMHxTQ0gtVTMxMHxTQ0gtVTMyMHxTQ0gtVTM1MHxTQ0gtVTM2MHxTQ0gtVTM2NXxTQ0gtVTM3MHxTQ0gtVTM4MHxTQ0gtVTQxMHxTQ0gtVTQzMHxTQ0gtVTQ1MHxTQ0gtVTQ2MHxTQ0gtVTQ3MHxTQ0gtVTQ5MHxTQ0gtVTU0MHxTQ0gtVTU1MHxTQ0gtVTYyMHxTQ0gtVTY0MHxTQ0gtVTY1MHxTQ0gtVTY2MHxTQ0gtVTcwMHxTQ0gtVTc0MHxTQ0gtVTc1MHxTQ0gtVTgxMHxTQ0gtVTgyMHxTQ0gtVTkwMHxTQ0gtVTk0MHxTQ0gtVTk2MHxTQ1MtMjZVQ3xTR0gtQTEwN3xTR0gtQTExN3xTR0gtQTEyN3xTR0gtQTEzN3xTR0gtQTE1N3xTR0gtQTE2N3xTR0gtQTE3N3xTR0gtQTE4N3xTR0gtQTE5N3xTR0gtQTIyN3xTR0gtQTIzN3xTR0gtQTI1N3xTR0gtQTQzN3xTR0gtQTUxN3xTR0gtQTU5N3xTR0gtQTYzN3xTR0gtQTY1N3xTR0gtQTY2N3xTR0gtQTY4N3xTR0gtQTY5N3xTR0gtQTcwN3xTR0gtQTcxN3xTR0gtQTcyN3xTR0gtQTczN3xTR0gtQTc0N3xTR0gtQTc2N3xTR0gtQTc3N3xTR0gtQTc5N3xTR0gtQTgxN3xTR0gtQTgyN3xTR0gtQTgzN3xTR0gtQTg0N3xTR0gtQTg2N3xTR0gtQTg3N3xTR0gtQTg4N3xTR0gtQTg5N3xTR0gtQTkyN3xTR0gtQjEwMHxTR0gtQjEzMHxTR0gtQjIwMHxTR0gtQjIyMHxTR0gtQzEwMHxTR0gtQzExMHxTR0gtQzEyMHxTR0gtQzEzMHxTR0gtQzE0MHxTR0gtQzE2MHxTR0gtQzE3MHxTR0gtQzE4MHxTR0gtQzIwMHxTR0gtQzIwN3xTR0gtQzIxMHxTR0gtQzIyNXxTR0gtQzIzMHxTR0gtQzQxN3xTR0gtQzQ1MHxTR0gtRDMwN3xTR0gtRDM0N3xTR0gtRDM1N3xTR0gtRDQwN3xTR0gtRDQxNXxTR0gtRDc4MHxTR0gtRDgwN3xTR0gtRDk4MHxTR0gtRTEwNXxTR0gtRTIwMHxTR0gtRTMxNXxTR0gtRTMxNnxTR0gtRTMxN3xTR0gtRTMzNXxTR0gtRTU5MHxTR0gtRTYzNXxTR0gtRTcxNXxTR0gtRTg5MHxTR0gtRjMwMHxTR0gtRjQ4MHxTR0gtSTIwMHxTR0gtSTMwMHxTR0gtSTMyMHxTR0gtSTU1MHxTR0gtSTU3N3xTR0gtSTYwMHxTR0gtSTYwN3xTR0gtSTYxN3xTR0gtSTYyN3xTR0gtSTYzN3xTR0gtSTY3N3xTR0gtSTcwMHxTR0gtSTcxN3xTR0gtSTcyN3xTR0gtaTc0N018U0dILUk3Nzd8U0dILUk3ODB8U0dILUk4Mjd8U0dILUk4NDd8U0dILUk4NTd8U0dILUk4OTZ8U0dILUk4OTd8U0dILUk5MDB8U0dILUk5MDd8U0dILUk5MTd8U0dILUk5Mjd8U0dILUk5Mzd8U0dILUk5OTd8U0dILUoxNTB8U0dILUoyMDB8U0dILUwxNzB8U0dILUw3MDB8U0dILU0xMTB8U0dILU0xNTB8U0dILU0yMDB8U0dILU4xMDV8U0dILU41MDB8U0dILU42MDB8U0dILU42MjB8U0dILU42MjV8U0dILU43MDB8U0dILU43MTB8U0dILVAxMDd8U0dILVAyMDd8U0dILVAzMDB8U0dILVAzMTB8U0dILVA1MjB8U0dILVA3MzV8U0dILVA3Nzd8U0dILVExMDV8U0dILVIyMTB8U0dILVIyMjB8U0dILVIyMjV8U0dILVMxMDV8U0dILVMzMDd8U0dILVQxMDl8U0dILVQxMTl8U0dILVQxMzl8U0dILVQyMDl8U0dILVQyMTl8U0dILVQyMjl8U0dILVQyMzl8U0dILVQyNDl8U0dILVQyNTl8U0dILVQzMDl8U0dILVQzMTl8U0dILVQzMjl8U0dILVQzMzl8U0dILVQzNDl8U0dILVQzNTl8U0dILVQzNjl8U0dILVQzNzl8U0dILVQ0MDl8U0dILVQ0Mjl8U0dILVQ0Mzl8U0dILVQ0NTl8U0dILVQ0Njl8U0dILVQ0Nzl8U0dILVQ0OTl8U0dILVQ1MDl8U0dILVQ1MTl8U0dILVQ1Mzl8U0dILVQ1NTl8U0dILVQ1ODl8U0dILVQ2MDl8U0dILVQ2MTl8U0dILVQ2Mjl8U0dILVQ2Mzl8U0dILVQ2NTl8U0dILVQ2Njl8U0dILVQ2Nzl8U0dILVQ3MDl8U0dILVQ3MTl8U0dILVQ3Mjl8U0dILVQ3Mzl8U0dILVQ3NDZ8U0dILVQ3NDl8U0dILVQ3NTl8U0dILVQ3Njl8U0dILVQ4MDl8U0dILVQ4MTl8U0dILVQ4Mzl8U0dILVQ5MTl8U0dILVQ5Mjl8U0dILVQ5Mzl8U0dILVQ5NTl8U0dILVQ5ODl8U0dILVUxMDB8U0dILVUyMDB8U0dILVU4MDB8U0dILVYyMDV8U0dILVYyMDZ8U0dILVgxMDB8U0dILVgxMDV8U0dILVgxMjB8U0dILVgxNDB8U0dILVg0MjZ8U0dILVg0Mjd8U0dILVg0NzV8U0dILVg0OTV8U0dILVg0OTd8U0dILVg1MDd8U0dILVg2MDB8U0dILVg2MTB8U0dILVg2MjB8U0dILVg2MzB8U0dILVg3MDB8U0dILVg4MjB8U0dILVg4OTB8U0dILVoxMzB8U0dILVoxNTB8U0dILVoxNzB8U0dILVpYMTB8U0dILVpYMjB8U0hXLU0xMTB8U1BILUExMjB8U1BILUE0MDB8U1BILUE0MjB8U1BILUE0NjB8U1BILUE1MDB8U1BILUE1NjB8U1BILUE2MDB8U1BILUE2MjB8U1BILUE2NjB8U1BILUE3MDB8U1BILUE3NDB8U1BILUE3NjB8U1BILUE3OTB8U1BILUE4MDB8U1BILUE4MjB8U1BILUE4NDB8U1BILUE4ODB8U1BILUE5MDB8U1BILUE5NDB8U1BILUE5NjB8U1BILUQ2MDB8U1BILUQ3MDB8U1BILUQ3MTB8U1BILUQ3MjB8U1BILUkzMDB8U1BILUkzMjV8U1BILUkzMzB8U1BILUkzNTB8U1BILUk1MDB8U1BILUk2MDB8U1BILUk3MDB8U1BILUw3MDB8U1BILU0xMDB8U1BILU0yMjB8U1BILU0yNDB8U1BILU0zMDB8U1BILU0zMDV8U1BILU0zMjB8U1BILU0zMzB8U1BILU0zNTB8U1BILU0zNjB8U1BILU0zNzB8U1BILU0zODB8U1BILU01MTB8U1BILU01NDB8U1BILU01NTB8U1BILU01NjB8U1BILU01NzB8U1BILU01ODB8U1BILU02MTB8U1BILU02MjB8U1BILU02MzB8U1BILU04MDB8U1BILU04MTB8U1BILU04NTB8U1BILU05MDB8U1BILU05MTB8U1BILU05MjB8U1BILU05MzB8U1BILU4xMDB8U1BILU4yMDB8U1BILU4yNDB8U1BILU4zMDB8U1BILU40MDB8U1BILVo0MDB8U1dDLUUxMDB8U0NILWk5MDl8R1QtTjcxMDB8R1QtTjcxMDV8U0NILUk1MzV8U00tTjkwMEF8U0dILUkzMTd8U0dILVQ5OTlMfEdULVM1MzYwQnxHVC1JODI2MnxHVC1TNjgwMnxHVC1TNjMxMnxHVC1TNjMxMHxHVC1TNTMxMnxHVC1TNTMxMHxHVC1JOTEwNXxHVC1JODUxMHxHVC1TNjc5ME58U00tRzcxMDV8U00tTjkwMDV8R1QtUzUzMDF8R1QtSTkyOTV8R1QtSTkxOTV8U00tQzEwMXxHVC1TNzM5MnxHVC1TNzU2MHxHVC1CNzYxMHxHVC1JNTUxMHxHVC1TNzU4MnxHVC1TNzUzMEV8R1QtSTg3NTB8U00tRzkwMDZWfFNNLUc5MDA4VnxTTS1HOTAwOUR8U00tRzkwMEF8U00tRzkwMER8U00tRzkwMEZ8U00tRzkwMEh8U00tRzkwMEl8U00tRzkwMEp8U00tRzkwMEt8U00tRzkwMEx8U00tRzkwME18U00tRzkwMFB8U00tRzkwMFI0fFNNLUc5MDBTfFNNLUc5MDBUfFNNLUc5MDBWfFNNLUc5MDBXOHxTSFYtRTE2MEt8U0NILVA3MDl8U0NILVA3Mjl8U00tVDI1NTh8R1QtSTkyMDV8U00tRzkzNTB8U00tSjEyMEZ8U00tRzkyMEZ8U00tRzkyMFZ8U00tRzkzMEZ8U00tTjkxMEN8U00tQTMxMEZ8R1QtSTkxOTB8U00tSjUwMEZOfFNNLUc5MDNGfFNNLUozMzBGXCIsTEc6XCJcXFxcYkxHXFxcXGI7fExHWy0gXT8oQzgwMHxDOTAwfEU0MDB8RTYxMHxFOTAwfEUtOTAwfEYxNjB8RjE4MEt8RjE4MEx8RjE4MFN8NzMwfDg1NXxMMTYwfExTNzQwfExTODQwfExTOTcwfExVNjIwMHxNUzY5MHxNUzY5NXxNUzc3MHxNUzg0MHxNUzg3MHxNUzkxMHxQNTAwfFA3MDB8UDcwNXxWTTY5NnxBUzY4MHxBUzY5NXxBWDg0MHxDNzI5fEU5NzB8R1M1MDV8MjcyfEMzOTV8RTczOUJLfEU5NjB8TDU1Q3xMNzVDfExTNjk2fExTODYwfFA3NjlCS3xQMzUwfFA1MDB8UDUwOXxQODcwfFVOMjcyfFVTNzMwfFZTODQwfFZTOTUwfExOMjcyfExONTEwfExTNjcwfExTODU1fExXNjkwfE1OMjcwfE1ONTEwfFA1MDl8UDc2OXxQOTMwfFVOMjAwfFVOMjcwfFVONTEwfFVONjEwfFVTNjcwfFVTNzQwfFVTNzYwfFVYMjY1fFVYODQwfFZOMjcxfFZONTMwfFZTNjYwfFZTNzAwfFZTNzQwfFZTNzUwfFZTOTEwfFZTOTIwfFZTOTMwfFZYOTIwMHxWWDExMDAwfEFYODQwQXxMVzc3MHxQNTA2fFA5MjV8UDk5OXxFNjEyfEQ5NTV8RDgwMnxNUzMyM3xNMjU3KVwiLFNvbnk6XCJTb255U1R8U29ueUxUfFNvbnlFcmljc3NvbnxTb255RXJpY3Nzb25MVDE1aXZ8TFQxOGl8RTEwaXxMVDI4aHxMVDI2d3xTb255RXJpY3Nzb25NVDI3aXxDNTMwM3xDNjkwMnxDNjkwM3xDNjkwNnxDNjk0M3xEMjUzM1wiLEFzdXM6XCJBc3VzLipHYWxheHl8UGFkRm9uZS4qTW9iaWxlXCIsTm9raWFMdW1pYTpcIkx1bWlhIFswLTldezMsNH1cIixNaWNyb21heDpcIk1pY3JvbWF4LipcXFxcYihBMjEwfEE5MnxBODh8QTcyfEExMTF8QTExMFF8QTExNXxBMTE2fEExMTB8QTkwU3xBMjZ8QTUxfEEzNXxBNTR8QTI1fEEyN3xBODl8QTY4fEE2NXxBNTd8QTkwKVxcXFxiXCIsUGFsbTpcIlBhbG1Tb3VyY2V8UGFsbVwiLFZlcnR1OlwiVmVydHV8VmVydHUuKkx0ZHxWZXJ0dS4qQXNjZW50fFZlcnR1LipBeXh0YXxWZXJ0dS4qQ29uc3RlbGxhdGlvbihGfFF1ZXN0KT98VmVydHUuKk1vbmlrYXxWZXJ0dS4qU2lnbmF0dXJlXCIsUGFudGVjaDpcIlBBTlRFQ0h8SU0tQTg1MFN8SU0tQTg0MFN8SU0tQTgzMEx8SU0tQTgzMEt8SU0tQTgzMFN8SU0tQTgyMEx8SU0tQTgxMEt8SU0tQTgxMFN8SU0tQTgwMFN8SU0tVDEwMEt8SU0tQTcyNUx8SU0tQTc4MEx8SU0tQTc3NUN8SU0tQTc3MEt8SU0tQTc2MFN8SU0tQTc1MEt8SU0tQTc0MFN8SU0tQTczMFN8SU0tQTcyMEx8SU0tQTcxMEt8SU0tQTY5MEx8SU0tQTY5MFN8SU0tQTY1MFN8SU0tQTYzMEt8SU0tQTYwMFN8VkVHQSBQVEwyMXxQVDAwM3xQODAxMHxBRFI5MTBMfFA2MDMwfFA2MDIwfFA5MDcwfFA0MTAwfFA5MDYwfFA1MDAwfENETTg5OTJ8VFhUODA0NXxBRFI4OTk1fElTMTFQVHxQMjAzMHxQNjAxMHxQODAwMHxQVDAwMnxJUzA2fENETTg5OTl8UDkwNTB8UFQwMDF8VFhUODA0MHxQMjAyMHxQOTAyMHxQMjAwMHxQNzA0MHxQNzAwMHxDNzkwXCIsRmx5OlwiSVEyMzB8SVE0NDR8SVE0NTB8SVE0NDB8SVE0NDJ8SVE0NDF8SVEyNDV8SVEyNTZ8SVEyMzZ8SVEyNTV8SVEyMzV8SVEyNDV8SVEyNzV8SVEyNDB8SVEyODV8SVEyODB8SVEyNzB8SVEyNjB8SVEyNTBcIixXaWtvOlwiS0lURSA0R3xISUdIV0FZfEdFVEFXQVl8U1RBSVJXQVl8REFSS1NJREV8REFSS0ZVTEx8REFSS05JR0hUfERBUktNT09OfFNMSURFfFdBWCA0R3xSQUlOQk9XfEJMT09NfFNVTlNFVHxHT0EoPyFubmEpfExFTk5ZfEJBUlJZfElHR1l8T1paWXxDSU5LIEZJVkV8Q0lOSyBQRUFYfENJTksgUEVBWCAyfENJTksgU0xJTXxDSU5LIFNMSU0gMnxDSU5LICt8Q0lOSyBLSU5HfENJTksgUEVBWHxDSU5LIFNMSU18U1VCTElNXCIsaU1vYmlsZTpcImktbW9iaWxlIChJUXxpLVNUWUxFfGlkZWF8WkFBfEhpdHopXCIsU2ltVmFsbGV5OlwiXFxcXGIoU1AtODB8WFQtOTMwfFNYLTM0MHxYVC05MzB8U1gtMzEwfFNQLTM2MHxTUDYwfFNQVC04MDB8U1AtMTIwfFNQVC04MDB8U1AtMTQwfFNQWC01fFNQWC04fFNQLTEwMHxTUFgtOHxTUFgtMTIpXFxcXGJcIixXb2xmZ2FuZzpcIkFULUIyNER8QVQtQVM1MEhEfEFULUFTNDBXfEFULUFTNTVIRHxBVC1BUzQ1cTJ8QVQtQjI2RHxBVC1BUzUwUVwiLEFsY2F0ZWw6XCJBbGNhdGVsXCIsTmludGVuZG86XCJOaW50ZW5kbyAoM0RTfFN3aXRjaClcIixBbW9pOlwiQW1vaVwiLElOUTpcIklOUVwiLEdlbmVyaWNQaG9uZTpcIlRhcGF0YWxrfFBEQTt8U0FHRU18XFxcXGJtbXBcXFxcYnxwb2NrZXR8XFxcXGJwc3BcXFxcYnxzeW1iaWFufFNtYXJ0cGhvbmV8c21hcnRmb258dHJlb3x1cC5icm93c2VyfHVwLmxpbmt8dm9kYWZvbmV8XFxcXGJ3YXBcXFxcYnxub2tpYXxTZXJpZXM0MHxTZXJpZXM2MHxTNjB8U29ueUVyaWNzc29ufE45MDB8TUFVSS4qV0FQLipCcm93c2VyXCJ9LHRhYmxldHM6e2lQYWQ6XCJpUGFkfGlQYWQuKk1vYmlsZVwiLE5leHVzVGFibGV0OlwiQW5kcm9pZC4qTmV4dXNbXFxcXHNdKyg3fDl8MTApXCIsR29vZ2xlVGFibGV0OlwiQW5kcm9pZC4qUGl4ZWwgQ1wiLFNhbXN1bmdUYWJsZXQ6XCJTQU1TVU5HLipUYWJsZXR8R2FsYXh5LipUYWJ8U0MtMDFDfEdULVAxMDAwfEdULVAxMDAzfEdULVAxMDEwfEdULVAzMTA1fEdULVA2MjEwfEdULVA2ODAwfEdULVA2ODEwfEdULVA3MTAwfEdULVA3MzAwfEdULVA3MzEwfEdULVA3NTAwfEdULVA3NTEwfFNDSC1JODAwfFNDSC1JODE1fFNDSC1JOTA1fFNHSC1JOTU3fFNHSC1JOTg3fFNHSC1UODQ5fFNHSC1UODU5fFNHSC1UODY5fFNQSC1QMTAwfEdULVAzMTAwfEdULVAzMTA4fEdULVAzMTEwfEdULVA1MTAwfEdULVA1MTEwfEdULVA2MjAwfEdULVA3MzIwfEdULVA3NTExfEdULU44MDAwfEdULVA4NTEwfFNHSC1JNDk3fFNQSC1QNTAwfFNHSC1UNzc5fFNDSC1JNzA1fFNDSC1JOTE1fEdULU44MDEzfEdULVAzMTEzfEdULVA1MTEzfEdULVA4MTEwfEdULU44MDEwfEdULU44MDA1fEdULU44MDIwfEdULVAxMDEzfEdULVA2MjAxfEdULVA3NTAxfEdULU41MTAwfEdULU41MTA1fEdULU41MTEwfFNIVi1FMTQwS3xTSFYtRTE0MEx8U0hWLUUxNDBTfFNIVi1FMTUwU3xTSFYtRTIzMEt8U0hWLUUyMzBMfFNIVi1FMjMwU3xTSFctTTE4MEt8U0hXLU0xODBMfFNIVy1NMTgwU3xTSFctTTE4MFd8U0hXLU0zMDBXfFNIVy1NMzA1V3xTSFctTTM4MEt8U0hXLU0zODBTfFNIVy1NMzgwV3xTSFctTTQzMFd8U0hXLU00ODBLfFNIVy1NNDgwU3xTSFctTTQ4MFd8U0hXLU00ODVXfFNIVy1NNDg2V3xTSFctTTUwMFd8R1QtSTkyMjh8U0NILVA3Mzl8U0NILUk5MjV8R1QtSTkyMDB8R1QtUDUyMDB8R1QtUDUyMTB8R1QtUDUyMTBYfFNNLVQzMTF8U00tVDMxMHxTTS1UMzEwWHxTTS1UMjEwfFNNLVQyMTBSfFNNLVQyMTF8U00tUDYwMHxTTS1QNjAxfFNNLVA2MDV8U00tUDkwMHxTTS1QOTAxfFNNLVQyMTd8U00tVDIxN0F8U00tVDIxN1N8U00tUDYwMDB8U00tVDMxMDB8U0dILUk0Njd8WEU1MDB8U00tVDExMHxHVC1QNTIyMHxHVC1JOTIwMFh8R1QtTjUxMTBYfEdULU41MTIwfFNNLVA5MDV8U00tVDExMXxTTS1UMjEwNXxTTS1UMzE1fFNNLVQzMjB8U00tVDMyMFh8U00tVDMyMXxTTS1UNTIwfFNNLVQ1MjV8U00tVDUzME5VfFNNLVQyMzBOVXxTTS1UMzMwTlV8U00tVDkwMHxYRTUwMFQxQ3xTTS1QNjA1VnxTTS1QOTA1VnxTTS1UMzM3VnxTTS1UNTM3VnxTTS1UNzA3VnxTTS1UODA3VnxTTS1QNjAwWHxTTS1QOTAwWHxTTS1UMjEwWHxTTS1UMjMwfFNNLVQyMzBYfFNNLVQzMjV8R1QtUDc1MDN8U00tVDUzMXxTTS1UMzMwfFNNLVQ1MzB8U00tVDcwNXxTTS1UNzA1Q3xTTS1UNTM1fFNNLVQzMzF8U00tVDgwMHxTTS1UNzAwfFNNLVQ1Mzd8U00tVDgwN3xTTS1QOTA3QXxTTS1UMzM3QXxTTS1UNTM3QXxTTS1UNzA3QXxTTS1UODA3QXxTTS1UMjM3fFNNLVQ4MDdQfFNNLVA2MDdUfFNNLVQyMTdUfFNNLVQzMzdUfFNNLVQ4MDdUfFNNLVQxMTZOUXxTTS1UMTE2QlV8U00tUDU1MHxTTS1UMzUwfFNNLVQ1NTB8U00tVDkwMDB8U00tUDkwMDB8U00tVDcwNVl8U00tVDgwNXxHVC1QMzExM3xTTS1UNzEwfFNNLVQ4MTB8U00tVDgxNXxTTS1UMzYwfFNNLVQ1MzN8U00tVDExM3xTTS1UMzM1fFNNLVQ3MTV8U00tVDU2MHxTTS1UNjcwfFNNLVQ2Nzd8U00tVDM3N3xTTS1UNTY3fFNNLVQzNTdUfFNNLVQ1NTV8U00tVDU2MXxTTS1UNzEzfFNNLVQ3MTl8U00tVDgxM3xTTS1UODE5fFNNLVQ1ODB8U00tVDM1NVk/fFNNLVQyODB8U00tVDgxN0F8U00tVDgyMHxTTS1XNzAwfFNNLVA1ODB8U00tVDU4N3xTTS1QMzUwfFNNLVA1NTVNfFNNLVAzNTVNfFNNLVQxMTNOVXxTTS1UODE1WXxTTS1UNTg1fFNNLVQyODV8U00tVDgyNXxTTS1XNzA4XCIsS2luZGxlOlwiS2luZGxlfFNpbGsuKkFjY2VsZXJhdGVkfEFuZHJvaWQuKlxcXFxiKEtGT1R8S0ZUVHxLRkpXSXxLRkpXQXxLRk9URXxLRlNPV0l8S0ZUSFdJfEtGVEhXQXxLRkFQV0l8S0ZBUFdBfFdGSldBRXxLRlNBV0F8S0ZTQVdJfEtGQVNXSXxLRkFSV0l8S0ZGT1dJfEtGR0lXSXxLRk1FV0kpXFxcXGJ8QW5kcm9pZC4qU2lsay9bMC05Ll0rIGxpa2UgQ2hyb21lL1swLTkuXSsgKD8hTW9iaWxlKVwiLFN1cmZhY2VUYWJsZXQ6XCJXaW5kb3dzIE5UIFswLTkuXSs7IEFSTTsuKihUYWJsZXR8QVJNQkpTKVwiLEhQVGFibGV0OlwiSFAgU2xhdGUgKDd8OHwxMCl8SFAgRWxpdGVQYWQgOTAwfGhwLXRhYmxldHxFbGl0ZUJvb2suKlRvdWNofEhQIDh8U2xhdGUgMjF8SFAgU2xhdGVCb29rIDEwXCIsQXN1c1RhYmxldDpcIl4uKlBhZEZvbmUoKD8hTW9iaWxlKS4pKiR8VHJhbnNmb3JtZXJ8VEYxMDF8VEYxMDFHfFRGMzAwVHxURjMwMFRHfFRGMzAwVEx8VEY3MDBUfFRGNzAwS0x8VEY3MDFUfFRGODEwQ3xNRTE3MXxNRTMwMVR8TUUzMDJDfE1FMzcxTUd8TUUzNzBUfE1FMzcyTUd8TUUxNzJWfE1FMTczWHxNRTQwMEN8U2xpZGVyIFNMMTAxfFxcXFxiSzAwRlxcXFxifFxcXFxiSzAwQ1xcXFxifFxcXFxiSzAwRVxcXFxifFxcXFxiSzAwTFxcXFxifFRYMjAxTEF8TUUxNzZDfE1FMTAyQXxcXFxcYk04MFRBXFxcXGJ8TUUzNzJDTHxNRTU2MENHfE1FMzcyQ0d8TUUzMDJLTHwgSzAxMCB8IEswMTEgfCBLMDE3IHwgSzAxRSB8TUU1NzJDfE1FMTAzS3xNRTE3MEN8TUUxNzFDfFxcXFxiTUU3MENcXFxcYnxNRTU4MUN8TUU1ODFDTHxNRTg1MTBDfE1FMTgxQ3xQMDFZfFBPMU1BfFAwMVp8XFxcXGJQMDI3XFxcXGJ8XFxcXGJQMDI0XFxcXGJ8XFxcXGJQMDBDXFxcXGJcIixCbGFja0JlcnJ5VGFibGV0OlwiUGxheUJvb2t8UklNIFRhYmxldFwiLEhUQ3RhYmxldDpcIkhUQ19GbHllcl9QNTEyfEhUQyBGbHllcnxIVEMgSmV0c3RyZWFtfEhUQy1QNzE1YXxIVEMgRVZPIFZpZXcgNEd8UEc0MTIwMHxQRzA5NDEwXCIsTW90b3JvbGFUYWJsZXQ6XCJ4b29tfHNob2xlc3R8TVo2MTV8TVo2MDV8TVo1MDV8TVo2MDF8TVo2MDJ8TVo2MDN8TVo2MDR8TVo2MDZ8TVo2MDd8TVo2MDh8TVo2MDl8TVo2MTV8TVo2MTZ8TVo2MTdcIixOb29rVGFibGV0OlwiQW5kcm9pZC4qTm9va3xOb29rQ29sb3J8bm9vayBicm93c2VyfEJOUlYyMDB8Qk5SVjIwMEF8Qk5UVjI1MHxCTlRWMjUwQXxCTlRWNDAwfEJOVFY2MDB8TG9naWNQRCBab29tMlwiLEFjZXJUYWJsZXQ6XCJBbmRyb2lkLio7IFxcXFxiKEExMDB8QTEwMXxBMTEwfEEyMDB8QTIxMHxBMjExfEE1MDB8QTUwMXxBNTEwfEE1MTF8QTcwMHxBNzAxfFc1MDB8VzUwMFB8VzUwMXxXNTAxUHxXNTEwfFc1MTF8VzcwMHxHMTAwfEcxMDBXfEIxLUE3MXxCMS03MTB8QjEtNzExfEExLTgxMHxBMS04MTF8QTEtODMwKVxcXFxifFczLTgxMHxcXFxcYkEzLUExMFxcXFxifFxcXFxiQTMtQTExXFxcXGJ8XFxcXGJBMy1BMjBcXFxcYnxcXFxcYkEzLUEzMFwiLFRvc2hpYmFUYWJsZXQ6XCJBbmRyb2lkLiooQVQxMDB8QVQxMDV8QVQyMDB8QVQyMDV8QVQyNzB8QVQyNzV8QVQzMDB8QVQzMDV8QVQxUzV8QVQ1MDB8QVQ1NzB8QVQ3MDB8QVQ4MzApfFRPU0hJQkEuKkZPTElPXCIsTEdUYWJsZXQ6XCJcXFxcYkwtMDZDfExHLVY5MDl8TEctVjkwMHxMRy1WNzAwfExHLVY1MTB8TEctVjUwMHxMRy1WNDEwfExHLVY0MDB8TEctVks4MTBcXFxcYlwiLEZ1aml0c3VUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihGLTAxRHxGLTAyRnxGLTA1RXxGLTEwRHxNNTMyfFE1NzIpXFxcXGJcIixQcmVzdGlnaW9UYWJsZXQ6XCJQTVAzMTcwQnxQTVAzMjcwQnxQTVAzNDcwQnxQTVA3MTcwQnxQTVAzMzcwQnxQTVAzNTcwQ3xQTVA1ODcwQ3xQTVAzNjcwQnxQTVA1NTcwQ3xQTVA1NzcwRHxQTVAzOTcwQnxQTVAzODcwQ3xQTVA1NTgwQ3xQTVA1ODgwRHxQTVA1NzgwRHxQTVA1NTg4Q3xQTVA3MjgwQ3xQTVA3MjgwQzNHfFBNUDcyODB8UE1QNzg4MER8UE1QNTU5N0R8UE1QNTU5N3xQTVA3MTAwRHxQRVIzNDY0fFBFUjMyNzR8UEVSMzU3NHxQRVIzODg0fFBFUjUyNzR8UEVSNTQ3NHxQTVA1MDk3Q1BST3xQTVA1MDk3fFBNUDczODBEfFBNUDUyOTdDfFBNUDUyOTdDX1FVQUR8UE1QODEyRXxQTVA4MTJFM0d8UE1QODEyRnxQTVA4MTBFfFBNUDg4MFREfFBNVDMwMTd8UE1UMzAzN3xQTVQzMDQ3fFBNVDMwNTd8UE1UNzAwOHxQTVQ1ODg3fFBNVDUwMDF8UE1UNTAwMlwiLExlbm92b1RhYmxldDpcIkxlbm92byBUQUJ8SWRlYShUYWJ8UGFkKSggQTF8QTEwfCBLMXwpfFRoaW5rUGFkKFsgXSspP1RhYmxldHxZVDMtODUwTXxZVDMtWDkwTHxZVDMtWDkwRnxZVDMtWDkwWHxMZW5vdm8uKihTMjEwOXxTMjExMHxTNTAwMHxTNjAwMHxLMzAxMXxBMzAwMHxBMzUwMHxBMTAwMHxBMjEwN3xBMjEwOXxBMTEwN3xBNTUwMHxBNzYwMHxCNjAwMHxCODAwMHxCODA4MCkoLXwpKEZMfEZ8SFZ8SHwpfFRCLVgxMDNGfFRCLVgzMDRGfFRCLVgzMDRMfFRCLTg3MDNGfFRhYjJBNy0xMEZcIixEZWxsVGFibGV0OlwiVmVudWUgMTF8VmVudWUgOHxWZW51ZSA3fERlbGwgU3RyZWFrIDEwfERlbGwgU3RyZWFrIDdcIixZYXJ2aWtUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihUQUIyMTB8VEFCMjExfFRBQjIyNHxUQUIyNTB8VEFCMjYwfFRBQjI2NHxUQUIzMTB8VEFCMzYwfFRBQjM2NHxUQUI0MTB8VEFCNDExfFRBQjQyMHxUQUI0MjR8VEFCNDUwfFRBQjQ2MHxUQUI0NjF8VEFCNDY0fFRBQjQ2NXxUQUI0Njd8VEFCNDY4fFRBQjA3LTEwMHxUQUIwNy0xMDF8VEFCMDctMTUwfFRBQjA3LTE1MXxUQUIwNy0xNTJ8VEFCMDctMjAwfFRBQjA3LTIwMS0zR3xUQUIwNy0yMTB8VEFCMDctMjExfFRBQjA3LTIxMnxUQUIwNy0yMTR8VEFCMDctMjIwfFRBQjA3LTQwMHxUQUIwNy00ODV8VEFCMDgtMTUwfFRBQjA4LTIwMHxUQUIwOC0yMDEtM0d8VEFCMDgtMjAxLTMwfFRBQjA5LTEwMHxUQUIwOS0yMTF8VEFCMDktNDEwfFRBQjEwLTE1MHxUQUIxMC0yMDF8VEFCMTAtMjExfFRBQjEwLTQwMHxUQUIxMC00MTB8VEFCMTMtMjAxfFRBQjI3NEVVS3xUQUIyNzVFVUt8VEFCMzc0RVVLfFRBQjQ2MkVVS3xUQUI0NzRFVUt8VEFCOS0yMDApXFxcXGJcIixNZWRpb25UYWJsZXQ6XCJBbmRyb2lkLipcXFxcYk9ZT1xcXFxifExJRkUuKihQOTIxMnxQOTUxNHxQOTUxNnxTOTUxMil8TElGRVRBQlwiLEFybm92YVRhYmxldDpcIjk3RzR8QU4xMEcyfEFON2JHM3xBTjdmRzN8QU44RzN8QU44Y0czfEFON0czfEFOOUczfEFON2RHM3xBTjdkRzNTVHxBTjdkRzNDaGlsZFBhZHxBTjEwYkczfEFOMTBiRzNEVHxBTjlHMlwiLEludGVuc29UYWJsZXQ6XCJJTk04MDAyS1B8SU5NMTAxMEZQfElOTTgwNU5EfEludGVuc28gVGFifFRBQjEwMDRcIixJUlVUYWJsZXQ6XCJNNzAycHJvXCIsTWVnYWZvblRhYmxldDpcIk1lZ2FGb24gVjl8XFxcXGJaVEUgVjlcXFxcYnxBbmRyb2lkLipcXFxcYk1UN0FcXFxcYlwiLEVib2RhVGFibGV0OlwiRS1Cb2RhIChTdXByZW1lfEltcHJlc3NwZWVkfEl6enljb21tfEVzc2VudGlhbClcIixBbGxWaWV3VGFibGV0OlwiQWxsdmlldy4qKFZpdmF8QWxsZHJvfENpdHl8U3BlZWR8QWxsIFRWfEZyZW56eXxRdWFzYXJ8U2hpbmV8VFgxfEFYMXxBWDIpXCIsQXJjaG9zVGFibGV0OlwiXFxcXGIoMTAxRzl8ODBHOXxBMTAxSVQpXFxcXGJ8UWlsaXZlIDk3UnxBcmNob3M1fFxcXFxiQVJDSE9TICg3MHw3OXw4MHw5MHw5N3wxMDF8RkFNSUxZUEFEfCkoYnxjfCkoRzEwfCBDb2JhbHR8IFRJVEFOSVVNKEhEfCl8IFhlbm9ufCBOZW9ufFhTS3wgMnwgWFMgMnwgUExBVElOVU18IENBUkJPTnxHQU1FUEFEKVxcXFxiXCIsQWlub2xUYWJsZXQ6XCJOT1ZPN3xOT1ZPOHxOT1ZPMTB8Tm92bzdBdXJvcmF8Tm92bzdCYXNpY3xOT1ZPN1BBTEFESU58bm92bzktU3BhcmtcIixOb2tpYUx1bWlhVGFibGV0OlwiTHVtaWEgMjUyMFwiLFNvbnlUYWJsZXQ6XCJTb255LipUYWJsZXR8WHBlcmlhIFRhYmxldHxTb255IFRhYmxldCBTfFNPLTAzRXxTR1BUMTJ8U0dQVDEzfFNHUFQxMTR8U0dQVDEyMXxTR1BUMTIyfFNHUFQxMjN8U0dQVDExMXxTR1BUMTEyfFNHUFQxMTN8U0dQVDEzMXxTR1BUMTMyfFNHUFQxMzN8U0dQVDIxMXxTR1BUMjEyfFNHUFQyMTN8U0dQMzExfFNHUDMxMnxTR1AzMjF8RUJSRDExMDF8RUJSRDExMDJ8RUJSRDEyMDF8U0dQMzUxfFNHUDM0MXxTR1A1MTF8U0dQNTEyfFNHUDUyMXxTR1A1NDF8U0dQNTUxfFNHUDYyMXxTR1A2MTJ8U09UMzFcIixQaGlsaXBzVGFibGV0OlwiXFxcXGIoUEkyMDEwfFBJMzAwMHxQSTMxMDB8UEkzMTA1fFBJMzExMHxQSTMyMDV8UEkzMjEwfFBJMzkwMHxQSTQwMTB8UEk3MDAwfFBJNzEwMClcXFxcYlwiLEN1YmVUYWJsZXQ6XCJBbmRyb2lkLiooSzhHVHxVOUdUfFUxMEdUfFUxNkdUfFUxN0dUfFUxOEdUfFUxOUdUfFUyMEdUfFUyM0dUfFUzMEdUKXxDVUJFIFU4R1RcIixDb2J5VGFibGV0OlwiTUlEMTA0MnxNSUQxMDQ1fE1JRDExMjV8TUlEMTEyNnxNSUQ3MDEyfE1JRDcwMTR8TUlENzAxNXxNSUQ3MDM0fE1JRDcwMzV8TUlENzAzNnxNSUQ3MDQyfE1JRDcwNDh8TUlENzEyN3xNSUQ4MDQyfE1JRDgwNDh8TUlEODEyN3xNSUQ5MDQyfE1JRDk3NDB8TUlEOTc0MnxNSUQ3MDIyfE1JRDcwMTBcIixNSURUYWJsZXQ6XCJNOTcwMXxNOTAwMHxNOTEwMHxNODA2fE0xMDUyfE04MDZ8VDcwM3xNSUQ3MDF8TUlENzEzfE1JRDcxMHxNSUQ3Mjd8TUlENzYwfE1JRDgzMHxNSUQ3Mjh8TUlEOTMzfE1JRDEyNXxNSUQ4MTB8TUlENzMyfE1JRDEyMHxNSUQ5MzB8TUlEODAwfE1JRDczMXxNSUQ5MDB8TUlEMTAwfE1JRDgyMHxNSUQ3MzV8TUlEOTgwfE1JRDEzMHxNSUQ4MzN8TUlENzM3fE1JRDk2MHxNSUQxMzV8TUlEODYwfE1JRDczNnxNSUQxNDB8TUlEOTMwfE1JRDgzNXxNSUQ3MzN8TUlENFgxMFwiLE1TSVRhYmxldDpcIk1TSSBcXFxcYihQcmltbyA3M0t8UHJpbW8gNzNMfFByaW1vIDgxTHxQcmltbyA3N3xQcmltbyA5M3xQcmltbyA3NXxQcmltbyA3NnxQcmltbyA3M3xQcmltbyA4MXxQcmltbyA5MXxQcmltbyA5MHxFbmpveSA3MXxFbmpveSA3fEVuam95IDEwKVxcXFxiXCIsU01pVFRhYmxldDpcIkFuZHJvaWQuKihcXFxcYk1JRFxcXFxifE1JRC01NjB8TVRWLVQxMjAwfE1UVi1QTkQ1MzF8TVRWLVAxMTAxfE1UVi1QTkQ1MzApXCIsUm9ja0NoaXBUYWJsZXQ6XCJBbmRyb2lkLiooUksyODE4fFJLMjgwOEF8UksyOTE4fFJLMzA2Nil8UksyNzM4fFJLMjgwOEFcIixGbHlUYWJsZXQ6XCJJUTMxMHxGbHkgVmlzaW9uXCIsYnFUYWJsZXQ6XCJBbmRyb2lkLiooYnEpPy4qKEVsY2Fub3xDdXJpZXxFZGlzb258TWF4d2VsbHxLZXBsZXJ8UGFzY2FsfFRlc2xhfEh5cGF0aWF8UGxhdG9ufE5ld3RvbnxMaXZpbmdzdG9uZXxDZXJ2YW50ZXN8QXZhbnR8QXF1YXJpcyAoW0V8TV0xMHxNOCkpfE1heHdlbGwuKkxpdGV8TWF4d2VsbC4qUGx1c1wiLEh1YXdlaVRhYmxldDpcIk1lZGlhUGFkfE1lZGlhUGFkIDcgWW91dGh8SURFT1MgUzd8UzctMjAxY3xTNy0yMDJ1fFM3LTEwMXxTNy0xMDN8UzctMTA0fFM3LTEwNXxTNy0xMDZ8UzctMjAxfFM3LVNsaW18TTItQTAxTHxCQUgtTDA5fEJBSC1XMDlcIixOZWNUYWJsZXQ6XCJcXFxcYk4tMDZEfFxcXFxiTi0wOERcIixQYW50ZWNoVGFibGV0OlwiUGFudGVjaC4qUDQxMDBcIixCcm9uY2hvVGFibGV0OlwiQnJvbmNoby4qKE43MDF8TjcwOHxOODAyfGE3MTApXCIsVmVyc3VzVGFibGV0OlwiVE9VQ0hQQUQuKls3ODkxMF18XFxcXGJUT1VDSFRBQlxcXFxiXCIsWnluY1RhYmxldDpcInoxMDAwfFo5OSAyR3x6OTl8ejkzMHx6OTk5fHo5OTB8ejkwOXxaOTE5fHo5MDBcIixQb3NpdGl2b1RhYmxldDpcIlRCMDdTVEF8VEIxMFNUQXxUQjA3RlRBfFRCMTBGVEFcIixOYWJpVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJOYWJpXCIsS29ib1RhYmxldDpcIktvYm8gVG91Y2h8XFxcXGJLMDgwXFxcXGJ8XFxcXGJWb3hcXFxcYiBCdWlsZHxcXFxcYkFyY1xcXFxiIEJ1aWxkXCIsRGFuZXdUYWJsZXQ6XCJEU2xpZGUuKlxcXFxiKDcwMHw3MDFSfDcwMnw3MDNSfDcwNHw4MDJ8OTcwfDk3MXw5NzJ8OTczfDk3NHwxMDEwfDEwMTIpXFxcXGJcIixUZXhldFRhYmxldDpcIk5hdmlQYWR8VEItNzcyQXxUTS03MDQ1fFRNLTcwNTV8VE0tOTc1MHxUTS03MDE2fFRNLTcwMjR8VE0tNzAyNnxUTS03MDQxfFRNLTcwNDN8VE0tNzA0N3xUTS04MDQxfFRNLTk3NDF8VE0tOTc0N3xUTS05NzQ4fFRNLTk3NTF8VE0tNzAyMnxUTS03MDIxfFRNLTcwMjB8VE0tNzAxMXxUTS03MDEwfFRNLTcwMjN8VE0tNzAyNXxUTS03MDM3V3xUTS03MDM4V3xUTS03MDI3V3xUTS05NzIwfFRNLTk3MjV8VE0tOTczN1d8VE0tMTAyMHxUTS05NzM4V3xUTS05NzQwfFRNLTk3NDNXfFRCLTgwN0F8VEItNzcxQXxUQi03MjdBfFRCLTcyNUF8VEItNzE5QXxUQi04MjNBfFRCLTgwNUF8VEItNzIzQXxUQi03MTVBfFRCLTcwN0F8VEItNzA1QXxUQi03MDlBfFRCLTcxMUF8VEItODkwSER8VEItODgwSER8VEItNzkwSER8VEItNzgwSER8VEItNzcwSER8VEItNzIxSER8VEItNzEwSER8VEItNDM0SER8VEItODYwSER8VEItODQwSER8VEItNzYwSER8VEItNzUwSER8VEItNzQwSER8VEItNzMwSER8VEItNzIySER8VEItNzIwSER8VEItNzAwSER8VEItNTAwSER8VEItNDcwSER8VEItNDMxSER8VEItNDMwSER8VEItNTA2fFRCLTUwNHxUQi00NDZ8VEItNDM2fFRCLTQxNnxUQi0xNDZTRXxUQi0xMjZTRVwiLFBsYXlzdGF0aW9uVGFibGV0OlwiUGxheXN0YXRpb24uKihQb3J0YWJsZXxWaXRhKVwiLFRyZWtzdG9yVGFibGV0OlwiU1QxMDQxNi0xfFZUMTA0MTYtMXxTVDcwNDA4LTF8U1Q3MDJ4eC0xfFNUNzAyeHgtMnxTVDgwMjA4fFNUOTcyMTZ8U1Q3MDEwNC0yfFZUMTA0MTYtMnxTVDEwMjE2LTJBfFN1cmZUYWJcIixQeWxlQXVkaW9UYWJsZXQ6XCJcXFxcYihQVEJMMTBDRVV8UFRCTDEwQ3xQVEJMNzJCQ3xQVEJMNzJCQ0VVfFBUQkw3Q0VVfFBUQkw3Q3xQVEJMOTJCQ3xQVEJMOTJCQ0VVfFBUQkw5Q0VVfFBUQkw5Q1VLfFBUQkw5QylcXFxcYlwiLEFkdmFuVGFibGV0OlwiQW5kcm9pZC4qIFxcXFxiKEUzQXxUM1h8VDVDfFQ1QnxUM0V8VDNDfFQzQnxUMUp8VDFGfFQyQXxUMUh8VDFpfEUxQ3xUMS1FfFQ1LUF8VDR8RTEtQnxUMkNpfFQxLUJ8VDEtRHxPMS1BfEUxLUF8VDEtQXxUM0F8VDRpKVxcXFxiIFwiLERhbnlUZWNoVGFibGV0OlwiR2VuaXVzIFRhYiBHM3xHZW5pdXMgVGFiIFMyfEdlbml1cyBUYWIgUTN8R2VuaXVzIFRhYiBHNHxHZW5pdXMgVGFiIFE0fEdlbml1cyBUYWIgRy1JSXxHZW5pdXMgVEFCIEdJSXxHZW5pdXMgVEFCIEdJSUl8R2VuaXVzIFRhYiBTMVwiLEdhbGFwYWRUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYkcxXFxcXGJcIixNaWNyb21heFRhYmxldDpcIkZ1bmJvb2t8TWljcm9tYXguKlxcXFxiKFAyNTB8UDU2MHxQMzYwfFAzNjJ8UDYwMHxQMzAwfFAzNTB8UDUwMHxQMjc1KVxcXFxiXCIsS2FyYm9ublRhYmxldDpcIkFuZHJvaWQuKlxcXFxiKEEzOXxBMzd8QTM0fFNUOHxTVDEwfFNUN3xTbWFydCBUYWIzfFNtYXJ0IFRhYjIpXFxcXGJcIixBbGxGaW5lVGFibGV0OlwiRmluZTcgR2VuaXVzfEZpbmU3IFNoaW5lfEZpbmU3IEFpcnxGaW5lOCBTdHlsZXxGaW5lOSBNb3JlfEZpbmUxMCBKb3l8RmluZTExIFdpZGVcIixQUk9TQ0FOVGFibGV0OlwiXFxcXGIoUEVNNjN8UExUMTAyM0d8UExUMTA0MXxQTFQxMDQ0fFBMVDEwNDRHfFBMVDEwOTF8UExUNDMxMXxQTFQ0MzExUEx8UExUNDMxNXxQTFQ3MDMwfFBMVDcwMzN8UExUNzAzM0R8UExUNzAzNXxQTFQ3MDM1RHxQTFQ3MDQ0S3xQTFQ3MDQ1S3xQTFQ3MDQ1S0J8UExUNzA3MUtHfFBMVDcwNzJ8UExUNzIyM0d8UExUNzIyNUd8UExUNzc3N0d8UExUNzgxMEt8UExUNzg0OUd8UExUNzg1MUd8UExUNzg1Mkd8UExUODAxNXxQTFQ4MDMxfFBMVDgwMzR8UExUODAzNnxQTFQ4MDgwS3xQTFQ4MDgyfFBMVDgwODh8UExUODIyM0d8UExUODIzNEd8UExUODIzNUd8UExUODgxNkt8UExUOTAxMXxQTFQ5MDQ1S3xQTFQ5MjMzR3xQTFQ5NzM1fFBMVDk3NjBHfFBMVDk3NzBHKVxcXFxiXCIsWU9ORVNUYWJsZXQ6XCJCUTEwNzh8QkMxMDAzfEJDMTA3N3xSSzk3MDJ8QkM5NzMwfEJDOTAwMXxJVDkwMDF8QkM3MDA4fEJDNzAxMHxCQzcwOHxCQzcyOHxCQzcwMTJ8QkM3MDMwfEJDNzAyN3xCQzcwMjZcIixDaGFuZ0ppYVRhYmxldDpcIlRQQzcxMDJ8VFBDNzEwM3xUUEM3MTA1fFRQQzcxMDZ8VFBDNzEwN3xUUEM3MjAxfFRQQzcyMDN8VFBDNzIwNXxUUEM3MjEwfFRQQzc3MDh8VFBDNzcwOXxUUEM3NzEyfFRQQzcxMTB8VFBDODEwMXxUUEM4MTAzfFRQQzgxMDV8VFBDODEwNnxUUEM4MjAzfFRQQzgyMDV8VFBDODUwM3xUUEM5MTA2fFRQQzk3MDF8VFBDOTcxMDF8VFBDOTcxMDN8VFBDOTcxMDV8VFBDOTcxMDZ8VFBDOTcxMTF8VFBDOTcxMTN8VFBDOTcyMDN8VFBDOTc2MDN8VFBDOTc4MDl8VFBDOTcyMDV8VFBDMTAxMDF8VFBDMTAxMDN8VFBDMTAxMDZ8VFBDMTAxMTF8VFBDMTAyMDN8VFBDMTAyMDV8VFBDMTA1MDNcIixHVVRhYmxldDpcIlRYLUExMzAxfFRYLU05MDAyfFE3MDJ8a2YwMjZcIixQb2ludE9mVmlld1RhYmxldDpcIlRBQi1QNTA2fFRBQi1uYXZpLTctM0ctTXxUQUItUDUxN3xUQUItUC01Mjd8VEFCLVA3MDF8VEFCLVA3MDN8VEFCLVA3MjF8VEFCLVA3MzFOfFRBQi1QNzQxfFRBQi1QODI1fFRBQi1QOTA1fFRBQi1QOTI1fFRBQi1QUjk0NXxUQUItUEwxMDE1fFRBQi1QMTAyNXxUQUItUEkxMDQ1fFRBQi1QMTMyNXxUQUItUFJPVEFCWzAtOV0rfFRBQi1QUk9UQUIyNXxUQUItUFJPVEFCMjZ8VEFCLVBST1RBQjI3fFRBQi1QUk9UQUIyNlhMfFRBQi1QUk9UQUIyLUlQUzl8VEFCLVBST1RBQjMwLUlQUzl8VEFCLVBST1RBQjI1WFhMfFRBQi1QUk9UQUIyNi1JUFMxMHxUQUItUFJPVEFCMzAtSVBTMTBcIixPdmVybWF4VGFibGV0OlwiT1YtKFN0ZWVsQ29yZXxOZXdCYXNlfEJhc2Vjb3JlfEJhc2VvbmV8RXhlbGxlbnxRdWF0dG9yfEVkdVRhYnxTb2x1dGlvbnxBQ1RJT058QmFzaWNUYWJ8VGVkZHlUYWJ8TWFnaWNUYWJ8U3RyZWFtfFRCLTA4fFRCLTA5KXxRdWFsY29yZSAxMDI3XCIsSENMVGFibGV0OlwiSENMLipUYWJsZXR8Q29ubmVjdC0zRy0yLjB8Q29ubmVjdC0yRy0yLjB8TUUgVGFibGV0IFUxfE1FIFRhYmxldCBVMnxNRSBUYWJsZXQgRzF8TUUgVGFibGV0IFgxfE1FIFRhYmxldCBZMnxNRSBUYWJsZXQgU3luY1wiLERQU1RhYmxldDpcIkRQUyBEcmVhbSA5fERQUyBEdWFsIDdcIixWaXN0dXJlVGFibGV0OlwiVjk3IEhEfGk3NSAzR3xWaXN0dXJlIFY0KCBIRCk/fFZpc3R1cmUgVjUoIEhEKT98VmlzdHVyZSBWMTBcIixDcmVzdGFUYWJsZXQ6XCJDVFAoLSk/ODEwfENUUCgtKT84MTh8Q1RQKC0pPzgyOHxDVFAoLSk/ODM4fENUUCgtKT84ODh8Q1RQKC0pPzk3OHxDVFAoLSk/OTgwfENUUCgtKT85ODd8Q1RQKC0pPzk4OHxDVFAoLSk/OTg5XCIsTWVkaWF0ZWtUYWJsZXQ6XCJcXFxcYk1UODEyNXxNVDgzODl8TVQ4MTM1fE1UODM3N1xcXFxiXCIsQ29uY29yZGVUYWJsZXQ6XCJDb25jb3JkZShbIF0rKT9UYWJ8Q29uQ29yZGUgUmVhZE1hblwiLEdvQ2xldmVyVGFibGV0OlwiR09DTEVWRVIgVEFCfEE3R09DTEVWRVJ8TTEwNDJ8TTc4NDF8TTc0MnxSMTA0MkJLfFIxMDQxfFRBQiBBOTc1fFRBQiBBNzg0MnxUQUIgQTc0MXxUQUIgQTc0MUx8VEFCIE03MjNHfFRBQiBNNzIxfFRBQiBBMTAyMXxUQUIgSTkyMXxUQUIgUjcyMXxUQUIgSTcyMHxUQUIgVDc2fFRBQiBSNzB8VEFCIFI3Ni4yfFRBQiBSMTA2fFRBQiBSODMuMnxUQUIgTTgxM0d8VEFCIEk3MjF8R0NUQTcyMnxUQUIgSTcwfFRBQiBJNzF8VEFCIFM3M3xUQUIgUjczfFRBQiBSNzR8VEFCIFI5M3xUQUIgUjc1fFRBQiBSNzYuMXxUQUIgQTczfFRBQiBBOTN8VEFCIEE5My4yfFRBQiBUNzJ8VEFCIFI4M3xUQUIgUjk3NHxUQUIgUjk3M3xUQUIgQTEwMXxUQUIgQTEwM3xUQUIgQTEwNHxUQUIgQTEwNC4yfFIxMDVCS3xNNzEzR3xBOTcyQkt8VEFCIEE5NzF8VEFCIFI5NzQuMnxUQUIgUjEwNHxUQUIgUjgzLjN8VEFCIEExMDQyXCIsTW9kZWNvbVRhYmxldDpcIkZyZWVUQUIgOTAwMHxGcmVlVEFCIDcuNHxGcmVlVEFCIDcwMDR8RnJlZVRBQiA3ODAwfEZyZWVUQUIgMjA5NnxGcmVlVEFCIDcuNXxGcmVlVEFCIDEwMTR8RnJlZVRBQiAxMDAxIHxGcmVlVEFCIDgwMDF8RnJlZVRBQiA5NzA2fEZyZWVUQUIgOTcwMnxGcmVlVEFCIDcwMDN8RnJlZVRBQiA3MDAyfEZyZWVUQUIgMTAwMnxGcmVlVEFCIDc4MDF8RnJlZVRBQiAxMzMxfEZyZWVUQUIgMTAwNHxGcmVlVEFCIDgwMDJ8RnJlZVRBQiA4MDE0fEZyZWVUQUIgOTcwNHxGcmVlVEFCIDEwMDNcIixWb25pbm9UYWJsZXQ6XCJcXFxcYihBcmd1c1sgX10/U3xEaWFtb25kWyBfXT83OUhEfEVtZXJhbGRbIF9dPzc4RXxMdW5hWyBfXT83MEN8T255eFsgX10/U3xPbnl4WyBfXT9afE9yaW5bIF9dP0hEfE9yaW5bIF9dP1N8T3Rpc1sgX10/U3xTcGVlZFN0YXJbIF9dP1N8TWFnbmV0WyBfXT9NOXxQcmltdXNbIF9dPzk0WyBfXT8zR3xQcmltdXNbIF9dPzk0SER8UHJpbXVzWyBfXT9RU3xBbmRyb2lkLipcXFxcYlE4XFxcXGJ8U2lyaXVzWyBfXT9FVk9bIF9dP1FTfFNpcml1c1sgX10/UVN8U3Bpcml0WyBfXT9TKVxcXFxiXCIsRUNTVGFibGV0OlwiVjA3T1QyfFRNMTA1QXxTMTBPVDF8VFIxMENTMVwiLFN0b3JleFRhYmxldDpcImVaZWVbXyddPyhUYWJ8R28pWzAtOV0rfFRhYkxDN3xMb29uZXkgVHVuZXMgVGFiXCIsVm9kYWZvbmVUYWJsZXQ6XCJTbWFydFRhYihbIF0rKT9bMC05XSt8U21hcnRUYWJJSTEwfFNtYXJ0VGFiSUk3fFZGLTE0OTdcIixFc3NlbnRpZWxCVGFibGV0OlwiU21hcnRbICddP1RBQlsgXSs/WzAtOV0rfEZhbWlseVsgJ10/VEFCMlwiLFJvc3NNb29yVGFibGV0OlwiUk0tNzkwfFJNLTk5N3xSTUQtODc4R3xSTUQtOTc0UnxSTVQtNzA1QXxSTVQtNzAxfFJNRS02MDF8Uk1ULTUwMXxSTVQtNzExXCIsaU1vYmlsZVRhYmxldDpcImktbW9iaWxlIGktbm90ZVwiLFRvbGlub1RhYmxldDpcInRvbGlubyB0YWIgWzAtOS5dK3x0b2xpbm8gc2hpbmVcIixBdWRpb1NvbmljVGFibGV0OlwiXFxcXGJDLTIyUXxUNy1RQ3xULTE3QnxULTE3UFxcXFxiXCIsQU1QRVRhYmxldDpcIkFuZHJvaWQuKiBBNzggXCIsU2trVGFibGV0OlwiQW5kcm9pZC4qIChTS1lQQUR8UEhPRU5JWHxDWUNMT1BTKVwiLFRlY25vVGFibGV0OlwiVEVDTk8gUDl8VEVDTk8gRFA4RFwiLEpYRFRhYmxldDpcIkFuZHJvaWQuKiBcXFxcYihGMzAwMHxBMzMwMHxKWEQ1MDAwfEpYRDMwMDB8SlhEMjAwMHxKWEQzMDBCfEpYRDMwMHxTNTgwMHxTNzgwMHxTNjAyYnxTNTExMGJ8UzczMDB8UzUzMDB8UzYwMnxTNjAzfFM1MTAwfFM1MTEwfFM2MDF8UzcxMDBhfFAzMDAwRnxQMzAwMHN8UDEwMXxQMjAwc3xQMTAwMG18UDIwMG18UDkxMDB8UDEwMDBzfFM2NjAwYnxTOTA4fFAxMDAwfFAzMDB8UzE4fFM2NjAwfFM5MTAwKVxcXFxiXCIsaUpveVRhYmxldDpcIlRhYmxldCAoU3Bpcml0IDd8RXNzZW50aWF8R2FsYXRlYXxGdXNpb258T25peCA3fExhbmRhfFRpdGFufFNjb29ieXxEZW94fFN0ZWxsYXxUaGVtaXN8QXJnb258VW5pcXVlIDd8U3lnbnVzfEhleGVufEZpbml0eSA3fENyZWFtfENyZWFtIFgyfEphZGV8TmVvbiA3fE5lcm9uIDd8S2FuZHl8U2NhcGV8U2FwaHlyIDd8UmViZWx8QmlveHxSZWJlbHxSZWJlbCA4R0J8TXlzdHxEcmFjbyA3fE15c3R8VGFiNy0wMDR8TXlzdHxUYWRlbyBKb25lc3xUYWJsZXQgQm9pbmd8QXJyb3d8RHJhY28gRHVhbCBDYW18QXVyaXh8TWludHxBbWl0eXxSZXZvbHV0aW9ufEZpbml0eSA5fE5lb24gOXxUOXd8QW1pdHkgNEdCIER1YWwgQ2FtfFN0b25lIDRHQnxTdG9uZSA4R0J8QW5kcm9tZWRhfFNpbGtlbnxYMnxBbmRyb21lZGEgSUl8SGFsbGV5fEZsYW1lfFNhcGh5ciA5LDd8VG91Y2ggOHxQbGFuZXR8VHJpdG9ufFVuaXF1ZSAxMHxIZXhlbiAxMHxNZW1waGlzIDRHQnxNZW1waGlzIDhHQnxPbml4IDEwKVwiLEZYMlRhYmxldDpcIkZYMiBQQUQ3fEZYMiBQQUQxMFwiLFhvcm9UYWJsZXQ6XCJLaWRzUEFEIDcwMXxQQURbIF0/NzEyfFBBRFsgXT83MTR8UEFEWyBdPzcxNnxQQURbIF0/NzE3fFBBRFsgXT83MTh8UEFEWyBdPzcyMHxQQURbIF0/NzIxfFBBRFsgXT83MjJ8UEFEWyBdPzc5MHxQQURbIF0/NzkyfFBBRFsgXT85MDB8UEFEWyBdPzk3MTVEfFBBRFsgXT85NzE2RFJ8UEFEWyBdPzk3MThEUnxQQURbIF0/OTcxOVFSfFBBRFsgXT85NzIwUVJ8VGVsZVBBRDEwMzB8VGVsZXBhZDEwMzJ8VGVsZVBBRDczMHxUZWxlUEFENzMxfFRlbGVQQUQ3MzJ8VGVsZVBBRDczNVF8VGVsZVBBRDgzMHxUZWxlUEFEOTczMHxUZWxlUEFENzk1fE1lZ2FQQUQgMTMzMXxNZWdhUEFEIDE4NTF8TWVnYVBBRCAyMTUxXCIsVmlld3NvbmljVGFibGV0OlwiVmlld1BhZCAxMHBpfFZpZXdQYWQgMTBlfFZpZXdQYWQgMTBzfFZpZXdQYWQgRTcyfFZpZXdQYWQ3fFZpZXdQYWQgRTEwMHxWaWV3UGFkIDdlfFZpZXdTb25pYyBWQjczM3xWQjEwMGFcIixWZXJpem9uVGFibGV0OlwiUVRBUVozfFFUQUlSN3xRVEFRVFozfFFUQVNVTjF8UVRBU1VOMnxRVEFYSUExXCIsT2R5c1RhYmxldDpcIkxPT1h8WEVOTzEwfE9EWVNbIC1dKFNwYWNlfEVWT3xYcHJlc3N8Tk9PTil8XFxcXGJYRUxJT1xcXFxifFhlbGlvMTBQcm98WEVMSU83UEhPTkVUQUJ8WEVMSU8xMEVYVFJFTUV8WEVMSU9QVDJ8TkVPX1FVQUQxMFwiLENhcHRpdmFUYWJsZXQ6XCJDQVBUSVZBIFBBRFwiLEljb25iaXRUYWJsZXQ6XCJOZXRUQUJ8TlQtMzcwMnxOVC0zNzAyU3xOVC0zNzAyU3xOVC0zNjAzUHxOVC0zNjAzUHxOVC0wNzA0U3xOVC0wNzA0U3xOVC0zODA1Q3xOVC0zODA1Q3xOVC0wODA2Q3xOVC0wODA2Q3xOVC0wOTA5VHxOVC0wOTA5VHxOVC0wOTA3U3xOVC0wOTA3U3xOVC0wOTAyU3xOVC0wOTAyU1wiLFRlY2xhc3RUYWJsZXQ6XCJUOTggNEd8XFxcXGJQODBcXFxcYnxcXFxcYlg5MEhEXFxcXGJ8WDk4IEFpcnxYOTggQWlyIDNHfFxcXFxiWDg5XFxcXGJ8UDgwIDNHfFxcXFxiWDgwaFxcXFxifFA5OCBBaXJ8XFxcXGJYODlIRFxcXFxifFA5OCAzR3xcXFxcYlA5MEhEXFxcXGJ8UDg5IDNHfFg5OCAzR3xcXFxcYlA3MGhcXFxcYnxQNzlIRCAzR3xHMThkIDNHfFxcXFxiUDc5SERcXFxcYnxcXFxcYlA4OXNcXFxcYnxcXFxcYkE4OFxcXFxifFxcXFxiUDEwSERcXFxcYnxcXFxcYlAxOUhEXFxcXGJ8RzE4IDNHfFxcXFxiUDc4SERcXFxcYnxcXFxcYkE3OFxcXFxifFxcXFxiUDc1XFxcXGJ8RzE3cyAzR3xHMTdoIDNHfFxcXFxiUDg1dFxcXFxifFxcXFxiUDkwXFxcXGJ8XFxcXGJQMTFcXFxcYnxcXFxcYlA5OHRcXFxcYnxcXFxcYlA5OEhEXFxcXGJ8XFxcXGJHMThkXFxcXGJ8XFxcXGJQODVzXFxcXGJ8XFxcXGJQMTFIRFxcXFxifFxcXFxiUDg4c1xcXFxifFxcXFxiQTgwSERcXFxcYnxcXFxcYkE4MHNlXFxcXGJ8XFxcXGJBMTBoXFxcXGJ8XFxcXGJQODlcXFxcYnxcXFxcYlA3OHNcXFxcYnxcXFxcYkcxOFxcXFxifFxcXFxiUDg1XFxcXGJ8XFxcXGJBNzBoXFxcXGJ8XFxcXGJBNzBcXFxcYnxcXFxcYkcxN1xcXFxifFxcXFxiUDE4XFxcXGJ8XFxcXGJBODBzXFxcXGJ8XFxcXGJBMTFzXFxcXGJ8XFxcXGJQODhIRFxcXFxifFxcXFxiQTgwaFxcXFxifFxcXFxiUDc2c1xcXFxifFxcXFxiUDc2aFxcXFxifFxcXFxiUDk4XFxcXGJ8XFxcXGJBMTBIRFxcXFxifFxcXFxiUDc4XFxcXGJ8XFxcXGJQODhcXFxcYnxcXFxcYkExMVxcXFxifFxcXFxiQTEwdFxcXFxifFxcXFxiUDc2YVxcXFxifFxcXFxiUDc2dFxcXFxifFxcXFxiUDc2ZVxcXFxifFxcXFxiUDg1SERcXFxcYnxcXFxcYlA4NWFcXFxcYnxcXFxcYlA4NlxcXFxifFxcXFxiUDc1SERcXFxcYnxcXFxcYlA3NnZcXFxcYnxcXFxcYkExMlxcXFxifFxcXFxiUDc1YVxcXFxifFxcXFxiQTE1XFxcXGJ8XFxcXGJQNzZUaVxcXFxifFxcXFxiUDgxSERcXFxcYnxcXFxcYkExMFxcXFxifFxcXFxiVDc2MFZFXFxcXGJ8XFxcXGJUNzIwSERcXFxcYnxcXFxcYlA3NlxcXFxifFxcXFxiUDczXFxcXGJ8XFxcXGJQNzFcXFxcYnxcXFxcYlA3MlxcXFxifFxcXFxiVDcyMFNFXFxcXGJ8XFxcXGJDNTIwVGlcXFxcYnxcXFxcYlQ3NjBcXFxcYnxcXFxcYlQ3MjBWRVxcXFxifFQ3MjAtM0dFfFQ3MjAtV2lGaVwiLE9uZGFUYWJsZXQ6XCJcXFxcYihWOTc1aXxWaTMwfFZYNTMwfFY3MDF8Vmk2MHxWNzAxc3xWaTUwfFY4MDFzfFY3MTl8Vng2MTB3fFZYNjEwV3xWODE5aXxWaTEwfFZYNTgwV3xWaTEwfFY3MTFzfFY4MTN8VjgxMXxWODIwd3xWODIwfFZpMjB8VjcxMXxWSTMwV3xWNzEyfFY4OTF3fFY5NzJ8VjgxOXd8VjgyMHd8Vmk2MHxWODIwd3xWNzExfFY4MTNzfFY4MDF8VjgxOXxWOTc1c3xWODAxfFY4MTl8VjgxOXxWODE4fFY4MTF8VjcxMnxWOTc1bXxWMTAxd3xWOTYxd3xWODEyfFY4MTh8Vjk3MXxWOTcxc3xWOTE5fFY5ODl8VjExNnd8VjEwMnd8Vjk3M3xWaTQwKVxcXFxiW1xcXFxzXStcIixKYXl0ZWNoVGFibGV0OlwiVFBDLVBBNzYyXCIsQmxhdXB1bmt0VGFibGV0OlwiRW5kZWF2b3VyIDgwME5HfEVuZGVhdm91ciAxMDEwXCIsRGlnbWFUYWJsZXQ6XCJcXFxcYihpRHgxMHxpRHg5fGlEeDh8aUR4N3xpRHhEN3xpRHhEOHxpRHNROHxpRHNRN3xpRHNROHxpRHNEMTB8aURuRDd8M1RTODA0SHxpRHNRMTF8aURqN3xpRHMxMClcXFxcYlwiLEV2b2xpb1RhYmxldDpcIkFSSUFfTWluaV93aWZpfEFyaWFbIF9dTWluaXxFdm9saW8gWDEwfEV2b2xpbyBYN3xFdm9saW8gWDh8XFxcXGJFdm90YWJcXFxcYnxcXFxcYk5ldXJhXFxcXGJcIixMYXZhVGFibGV0OlwiUVBBRCBFNzA0fFxcXFxiSXZvcnlTXFxcXGJ8RS1UQUIgSVZPUll8XFxcXGJFLVRBQlxcXFxiXCIsQW9jVGFibGV0OlwiTVcwODExfE1XMDgxMnxNVzA5MjJ8TVRLODM4MnxNVzEwMzF8TVcwODMxfE1XMDgyMXxNVzA5MzF8TVcwNzEyXCIsTXBtYW5UYWJsZXQ6XCJNUDExIE9DVEF8TVAxMCBPQ1RBfE1QUUMxMTE0fE1QUUMxMDA0fE1QUUM5OTR8TVBRQzk3NHxNUFFDOTczfE1QUUM4MDR8TVBRQzc4NHxNUFFDNzgwfFxcXFxiTVBHN1xcXFxifE1QRENHNzV8TVBEQ0c3MXxNUERDMTAwNnxNUDEwMURDfE1QREM5MDAwfE1QREM5MDV8TVBEQzcwNkhEfE1QREM3MDZ8TVBEQzcwNXxNUERDMTEwfE1QREMxMDB8TVBEQzk5fE1QREM5N3xNUERDODh8TVBEQzh8TVBEQzc3fE1QNzA5fE1JRDcwMXxNSUQ3MTF8TUlEMTcwfE1QREM3MDN8TVBRQzEwMTBcIixDZWxrb25UYWJsZXQ6XCJDVDY5NXxDVDg4OHxDVFtcXFxcc10/OTEwfENUNyBUYWJ8Q1Q5IFRhYnxDVDMgVGFifENUMiBUYWJ8Q1QxIFRhYnxDODIwfEM3MjB8XFxcXGJDVC0xXFxcXGJcIixXb2xkZXJUYWJsZXQ6XCJtaVRhYiBcXFxcYihESUFNT05EfFNQQUNFfEJST09LTFlOfE5FT3xGTFl8TUFOSEFUVEFOfEZVTkt8RVZPTFVUSU9OfFNLWXxHT0NBUnxJUk9OfEdFTklVU3xQT1B8TUlOVHxFUFNJTE9OfEJST0FEV0FZfEpVTVB8SE9QfExFR0VORHxORVcgQUdFfExJTkV8QURWQU5DRXxGRUVMfEZPTExPV3xMSUtFfExJTkt8TElWRXxUSElOS3xGUkVFRE9NfENISUNBR098Q0xFVkVMQU5EfEJBTFRJTU9SRS1HSHxJT1dBfEJPU1RPTnxTRUFUVExFfFBIT0VOSVh8REFMTEFTfElOIDEwMXxNYXN0ZXJDaGVmKVxcXFxiXCIsTWVkaWFjb21UYWJsZXQ6XCJNLU1QSTEwQzNHfE0tU1AxMEVHfE0tU1AxMEVHUHxNLVNQMTBIWEFIfE0tU1A3SFhBSHxNLVNQMTBIWEJIfE0tU1A4SFhBSHxNLVNQOE1YQVwiLE1pVGFibGV0OlwiXFxcXGJNSSBQQURcXFxcYnxcXFxcYkhNIE5PVEUgMVdcXFxcYlwiLE5pYmlydVRhYmxldDpcIk5pYmlydSBNMXxOaWJpcnUgSnVwaXRlciBPbmVcIixOZXhvVGFibGV0OlwiTkVYTyBOT1ZBfE5FWE8gMTB8TkVYTyBBVklPfE5FWE8gRlJFRXxORVhPIEdPfE5FWE8gRVZPfE5FWE8gM0d8TkVYTyBTTUFSVHxORVhPIEtJRERPfE5FWE8gTU9CSVwiLExlYWRlclRhYmxldDpcIlRCTFQxMFF8VEJMVDEwSXxUQkwtMTBXREtCfFRCTC0xMFdES0JPMjAxM3xUQkwtVzIzMFYyfFRCTC1XNDUwfFRCTC1XNTAwfFNWNTcyfFRCTFQ3SXxUQkEtQUM3LThHfFRCTFQ3OXxUQkwtOFcxNnxUQkwtMTBXMzJ8VEJMLTEwV0tCfFRCTC1XMTAwXCIsVWJpc2xhdGVUYWJsZXQ6XCJVYmlTbGF0ZVtcXFxcc10/N0NcIixQb2NrZXRCb29rVGFibGV0OlwiUG9ja2V0Ym9va1wiLEtvY2Fzb1RhYmxldDpcIlxcXFxiKFRCLTEyMDcpXFxcXGJcIixIaXNlbnNlVGFibGV0OlwiXFxcXGIoRjUyODF8RTIzNzEpXFxcXGJcIixIdWRsOlwiSHVkbCBIVDdTM3xIdWRsIDJcIixUZWxzdHJhVGFibGV0OlwiVC1IdWIyXCIsR2VuZXJpY1RhYmxldDpcIkFuZHJvaWQuKlxcXFxiOTdEXFxcXGJ8VGFibGV0KD8hLipQQyl8Qk5UVjI1MEF8TUlELVdDRE1BfExvZ2ljUEQgWm9vbTJ8XFxcXGJBN0VCXFxcXGJ8Q2F0Tm92YTh8QTFfMDd8Q1Q3MDR8Q1QxMDAyfFxcXFxiTTcyMVxcXFxifHJrMzBzZGt8XFxcXGJFVk9UQUJcXFxcYnxNNzU4QXxFVDkwNHxBTFVNSVVNMTB8U21hcnRmcmVuIFRhYnxFbmRlYXZvdXIgMTAxMHxUYWJsZXQtUEMtNHxUYWdpIFRhYnxcXFxcYk02cHJvXFxcXGJ8Q1QxMDIwV3xhcmMgMTBIRHxcXFxcYlRQNzUwXFxcXGJ8XFxcXGJRVEFRWjNcXFxcYnxXVlQxMDF8VE0xMDg4fEtUMTA3XCJ9LG9zczp7QW5kcm9pZE9TOlwiQW5kcm9pZFwiLEJsYWNrQmVycnlPUzpcImJsYWNrYmVycnl8XFxcXGJCQjEwXFxcXGJ8cmltIHRhYmxldCBvc1wiLFBhbG1PUzpcIlBhbG1PU3xhdmFudGdvfGJsYXplcnxlbGFpbmV8aGlwdG9wfHBhbG18cGx1Y2tlcnx4aWlub1wiLFN5bWJpYW5PUzpcIlN5bWJpYW58U3ltYk9TfFNlcmllczYwfFNlcmllczQwfFNZQi1bMC05XSt8XFxcXGJTNjBcXFxcYlwiLFdpbmRvd3NNb2JpbGVPUzpcIldpbmRvd3MgQ0UuKihQUEN8U21hcnRwaG9uZXxNb2JpbGV8WzAtOV17M314WzAtOV17M30pfFdpbmRvdyBNb2JpbGV8V2luZG93cyBQaG9uZSBbMC05Ll0rfFdDRTtcIixXaW5kb3dzUGhvbmVPUzpcIldpbmRvd3MgUGhvbmUgMTAuMHxXaW5kb3dzIFBob25lIDguMXxXaW5kb3dzIFBob25lIDguMHxXaW5kb3dzIFBob25lIE9TfFhCTFdQN3xadW5lV1A3fFdpbmRvd3MgTlQgNi5bMjNdOyBBUk07XCIsaU9TOlwiXFxcXGJpUGhvbmUuKk1vYmlsZXxcXFxcYmlQb2R8XFxcXGJpUGFkfEFwcGxlQ29yZU1lZGlhXCIsTWVlR29PUzpcIk1lZUdvXCIsTWFlbW9PUzpcIk1hZW1vXCIsSmF2YU9TOlwiSjJNRS98XFxcXGJNSURQXFxcXGJ8XFxcXGJDTERDXFxcXGJcIix3ZWJPUzpcIndlYk9TfGhwd09TXCIsYmFkYU9TOlwiXFxcXGJCYWRhXFxcXGJcIixCUkVXT1M6XCJCUkVXXCJ9LHVhczp7Q2hyb21lOlwiXFxcXGJDck1vXFxcXGJ8Q3JpT1N8QW5kcm9pZC4qQ2hyb21lL1suMC05XSogKE1vYmlsZSk/XCIsRG9sZmluOlwiXFxcXGJEb2xmaW5cXFxcYlwiLE9wZXJhOlwiT3BlcmEuKk1pbml8T3BlcmEuKk1vYml8QW5kcm9pZC4qT3BlcmF8TW9iaWxlLipPUFIvWzAtOS5dK3xDb2FzdC9bMC05Ll0rXCIsU2t5ZmlyZTpcIlNreWZpcmVcIixFZGdlOlwiTW9iaWxlIFNhZmFyaS9bLjAtOV0qIEVkZ2VcIixJRTpcIklFTW9iaWxlfE1TSUVNb2JpbGVcIixGaXJlZm94OlwiZmVubmVjfGZpcmVmb3guKm1hZW1vfChNb2JpbGV8VGFibGV0KS4qRmlyZWZveHxGaXJlZm94LipNb2JpbGV8RnhpT1NcIixCb2x0OlwiYm9sdFwiLFRlYVNoYXJrOlwidGVhc2hhcmtcIixCbGF6ZXI6XCJCbGF6ZXJcIixTYWZhcmk6XCJWZXJzaW9uLipNb2JpbGUuKlNhZmFyaXxTYWZhcmkuKk1vYmlsZXxNb2JpbGVTYWZhcmlcIixVQ0Jyb3dzZXI6XCJVQy4qQnJvd3NlcnxVQ1dFQlwiLGJhaWR1Ym94YXBwOlwiYmFpZHVib3hhcHBcIixiYWlkdWJyb3dzZXI6XCJiYWlkdWJyb3dzZXJcIixEaWlnb0Jyb3dzZXI6XCJEaWlnb0Jyb3dzZXJcIixQdWZmaW46XCJQdWZmaW5cIixNZXJjdXJ5OlwiXFxcXGJNZXJjdXJ5XFxcXGJcIixPYmlnb0Jyb3dzZXI6XCJPYmlnb1wiLE5ldEZyb250OlwiTkYtQnJvd3NlclwiLEdlbmVyaWNCcm93c2VyOlwiTm9raWFCcm93c2VyfE92aUJyb3dzZXJ8T25lQnJvd3NlcnxUd29ua3lCZWFtQnJvd3NlcnxTRU1DLipCcm93c2VyfEZseUZsb3d8TWluaW1vfE5ldEZyb250fE5vdmFycmEtVmlzaW9ufE1RUUJyb3dzZXJ8TWljcm9NZXNzZW5nZXJcIixQYWxlTW9vbjpcIkFuZHJvaWQuKlBhbGVNb29ufE1vYmlsZS4qUGFsZU1vb25cIn0scHJvcHM6e01vYmlsZTpcIk1vYmlsZS9bVkVSXVwiLEJ1aWxkOlwiQnVpbGQvW1ZFUl1cIixWZXJzaW9uOlwiVmVyc2lvbi9bVkVSXVwiLFZlbmRvcklEOlwiVmVuZG9ySUQvW1ZFUl1cIixpUGFkOlwiaVBhZC4qQ1BVW2EteiBdK1tWRVJdXCIsaVBob25lOlwiaVBob25lLipDUFVbYS16IF0rW1ZFUl1cIixpUG9kOlwiaVBvZC4qQ1BVW2EteiBdK1tWRVJdXCIsS2luZGxlOlwiS2luZGxlL1tWRVJdXCIsQ2hyb21lOltcIkNocm9tZS9bVkVSXVwiLFwiQ3JpT1MvW1ZFUl1cIixcIkNyTW8vW1ZFUl1cIl0sQ29hc3Q6W1wiQ29hc3QvW1ZFUl1cIl0sRG9sZmluOlwiRG9sZmluL1tWRVJdXCIsRmlyZWZveDpbXCJGaXJlZm94L1tWRVJdXCIsXCJGeGlPUy9bVkVSXVwiXSxGZW5uZWM6XCJGZW5uZWMvW1ZFUl1cIixFZGdlOlwiRWRnZS9bVkVSXVwiLElFOltcIklFTW9iaWxlL1tWRVJdO1wiLFwiSUVNb2JpbGUgW1ZFUl1cIixcIk1TSUUgW1ZFUl07XCIsXCJUcmlkZW50L1swLTkuXSs7LipydjpbVkVSXVwiXSxOZXRGcm9udDpcIk5ldEZyb250L1tWRVJdXCIsTm9raWFCcm93c2VyOlwiTm9raWFCcm93c2VyL1tWRVJdXCIsT3BlcmE6W1wiIE9QUi9bVkVSXVwiLFwiT3BlcmEgTWluaS9bVkVSXVwiLFwiVmVyc2lvbi9bVkVSXVwiXSxcIk9wZXJhIE1pbmlcIjpcIk9wZXJhIE1pbmkvW1ZFUl1cIixcIk9wZXJhIE1vYmlcIjpcIlZlcnNpb24vW1ZFUl1cIixVQ0Jyb3dzZXI6W1wiVUNXRUJbVkVSXVwiLFwiVUMuKkJyb3dzZXIvW1ZFUl1cIl0sTVFRQnJvd3NlcjpcIk1RUUJyb3dzZXIvW1ZFUl1cIixNaWNyb01lc3NlbmdlcjpcIk1pY3JvTWVzc2VuZ2VyL1tWRVJdXCIsYmFpZHVib3hhcHA6XCJiYWlkdWJveGFwcC9bVkVSXVwiLGJhaWR1YnJvd3NlcjpcImJhaWR1YnJvd3Nlci9bVkVSXVwiLFNhbXN1bmdCcm93c2VyOlwiU2Ftc3VuZ0Jyb3dzZXIvW1ZFUl1cIixJcm9uOlwiSXJvbi9bVkVSXVwiLFNhZmFyaTpbXCJWZXJzaW9uL1tWRVJdXCIsXCJTYWZhcmkvW1ZFUl1cIl0sU2t5ZmlyZTpcIlNreWZpcmUvW1ZFUl1cIixUaXplbjpcIlRpemVuL1tWRVJdXCIsV2Via2l0Olwid2Via2l0WyAvXVtWRVJdXCIsUGFsZU1vb246XCJQYWxlTW9vbi9bVkVSXVwiLEdlY2tvOlwiR2Vja28vW1ZFUl1cIixUcmlkZW50OlwiVHJpZGVudC9bVkVSXVwiLFByZXN0bzpcIlByZXN0by9bVkVSXVwiLEdvYW5uYTpcIkdvYW5uYS9bVkVSXVwiLGlPUzpcIiBcXFxcYmk/T1NcXFxcYiBbVkVSXVsgO117MX1cIixBbmRyb2lkOlwiQW5kcm9pZCBbVkVSXVwiLEJsYWNrQmVycnk6W1wiQmxhY2tCZXJyeVtcXFxcd10rL1tWRVJdXCIsXCJCbGFja0JlcnJ5LipWZXJzaW9uL1tWRVJdXCIsXCJWZXJzaW9uL1tWRVJdXCJdLEJSRVc6XCJCUkVXIFtWRVJdXCIsSmF2YTpcIkphdmEvW1ZFUl1cIixcIldpbmRvd3MgUGhvbmUgT1NcIjpbXCJXaW5kb3dzIFBob25lIE9TIFtWRVJdXCIsXCJXaW5kb3dzIFBob25lIFtWRVJdXCJdLFwiV2luZG93cyBQaG9uZVwiOlwiV2luZG93cyBQaG9uZSBbVkVSXVwiLFwiV2luZG93cyBDRVwiOlwiV2luZG93cyBDRS9bVkVSXVwiLFwiV2luZG93cyBOVFwiOlwiV2luZG93cyBOVCBbVkVSXVwiLFN5bWJpYW46W1wiU3ltYmlhbk9TL1tWRVJdXCIsXCJTeW1iaWFuL1tWRVJdXCJdLHdlYk9TOltcIndlYk9TL1tWRVJdXCIsXCJocHdPUy9bVkVSXTtcIl19LHV0aWxzOntCb3Q6XCJHb29nbGVib3R8ZmFjZWJvb2tleHRlcm5hbGhpdHxBZHNCb3QtR29vZ2xlfEdvb2dsZSBLZXl3b3JkIFN1Z2dlc3Rpb258RmFjZWJvdHxZYW5kZXhCb3R8WWFuZGV4TW9iaWxlQm90fGJpbmdib3R8aWFfYXJjaGl2ZXJ8QWhyZWZzQm90fEV6b29tc3xHU0xGYm90fFdCU2VhcmNoQm90fFR3aXR0ZXJib3R8VHdlZXRtZW1lQm90fFR3aWtsZXxQYXBlckxpQm90fFdvdGJveHxVbndpbmRGZXRjaG9yfEV4YWJvdHxNSjEyYm90fFlhbmRleEltYWdlc3xUdXJuaXRpbkJvdHxQaW5nZG9tXCIsTW9iaWxlQm90OlwiR29vZ2xlYm90LU1vYmlsZXxBZHNCb3QtR29vZ2xlLU1vYmlsZXxZYWhvb1NlZWtlci9NMUExLVIyRDJcIixEZXNrdG9wTW9kZTpcIldQRGVza3RvcFwiLFRWOlwiU29ueURUVnxIYmJUVlwiLFdlYktpdDpcIih3ZWJraXQpWyAvXShbXFxcXHcuXSspXCIsQ29uc29sZTpcIlxcXFxiKE5pbnRlbmRvfE5pbnRlbmRvIFdpaVV8TmludGVuZG8gM0RTfE5pbnRlbmRvIFN3aXRjaHxQTEFZU1RBVElPTnxYYm94KVxcXFxiXCIsV2F0Y2g6XCJTTS1WNzAwXCJ9fSxkZXRlY3RNb2JpbGVCcm93c2Vyczp7ZnVsbFBhdHRlcm46LyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLHNob3J0UGF0dGVybjovMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaSx0YWJsZXRQYXR0ZXJuOi9hbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pfX0sdCx1PU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7cmV0dXJuIHMuRkFMTEJBQ0tfUEhPTkU9XCJVbmtub3duUGhvbmVcIixzLkZBTExCQUNLX1RBQkxFVD1cIlVua25vd25UYWJsZXRcIixzLkZBTExCQUNLX01PQklMRT1cIlVua25vd25Nb2JpbGVcIix0PVwiaXNBcnJheVwiaW4gQXJyYXk/QXJyYXkuaXNBcnJheTpmdW5jdGlvbih2KXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodil9LGZ1bmN0aW9uKCl7dmFyIHYsdyx4LHkseixBLEI9cy5tb2JpbGVEZXRlY3RSdWxlcztmb3IodiBpbiBCLnByb3BzKWlmKHUuY2FsbChCLnByb3BzLHYpKXtmb3Iodz1CLnByb3BzW3ZdLHQodyl8fCh3PVt3XSksej13Lmxlbmd0aCx5PTA7eTx6OysreSl4PXdbeV0sQT14LmluZGV4T2YoXCJbVkVSXVwiKSwwPD1BJiYoeD14LnN1YnN0cmluZygwLEEpK1wiKFtcXFxcdy5fXFxcXCtdKylcIit4LnN1YnN0cmluZyhBKzUpKSx3W3ldPW5ldyBSZWdFeHAoeCxcImlcIik7Qi5wcm9wc1t2XT13fXAoQi5vc3MpLHAoQi5waG9uZXMpLHAoQi50YWJsZXRzKSxwKEIudWFzKSxwKEIudXRpbHMpLEIub3NzMD17V2luZG93c1Bob25lT1M6Qi5vc3MuV2luZG93c1Bob25lT1MsV2luZG93c01vYmlsZU9TOkIub3NzLldpbmRvd3NNb2JpbGVPU319KCkscy5maW5kTWF0Y2g9ZnVuY3Rpb24odix3KXtmb3IodmFyIHggaW4gdilpZih1LmNhbGwodix4KSYmdlt4XS50ZXN0KHcpKXJldHVybiB4O3JldHVybiBudWxsfSxzLmZpbmRNYXRjaGVzPWZ1bmN0aW9uKHYsdyl7dmFyIHg9W107Zm9yKHZhciB5IGluIHYpdS5jYWxsKHYseSkmJnZbeV0udGVzdCh3KSYmeC5wdXNoKHkpO3JldHVybiB4fSxzLmdldFZlcnNpb25TdHI9ZnVuY3Rpb24odix3KXt2YXIgeCx5LHosQSxCPXMubW9iaWxlRGV0ZWN0UnVsZXMucHJvcHM7aWYodS5jYWxsKEIsdikpZm9yKHg9Qlt2XSx6PXgubGVuZ3RoLHk9MDt5PHo7Kyt5KWlmKEE9eFt5XS5leGVjKHcpLG51bGwhPT1BKXJldHVybiBBWzFdO3JldHVybiBudWxsfSxzLmdldFZlcnNpb249ZnVuY3Rpb24odix3KXt2YXIgeD1zLmdldFZlcnNpb25TdHIodix3KTtyZXR1cm4geD9zLnByZXBhcmVWZXJzaW9uTm8oeCk6TmFOfSxzLnByZXBhcmVWZXJzaW9uTm89ZnVuY3Rpb24odil7dmFyIHc7cmV0dXJuIHc9di5zcGxpdCgvW2Etei5fIFxcL1xcLV0vaSksMT09PXcubGVuZ3RoJiYodj13WzBdKSwxPHcubGVuZ3RoJiYodj13WzBdK1wiLlwiLHcuc2hpZnQoKSx2Kz13LmpvaW4oXCJcIikpLCt2fSxzLmlzTW9iaWxlRmFsbGJhY2s9ZnVuY3Rpb24odil7cmV0dXJuIHMuZGV0ZWN0TW9iaWxlQnJvd3NlcnMuZnVsbFBhdHRlcm4udGVzdCh2KXx8cy5kZXRlY3RNb2JpbGVCcm93c2Vycy5zaG9ydFBhdHRlcm4udGVzdCh2LnN1YnN0cigwLDQpKX0scy5pc1RhYmxldEZhbGxiYWNrPWZ1bmN0aW9uKHYpe3JldHVybiBzLmRldGVjdE1vYmlsZUJyb3dzZXJzLnRhYmxldFBhdHRlcm4udGVzdCh2KX0scy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGU9ZnVuY3Rpb24odix3LHgpe2lmKHYubW9iaWxlPT09bSl7dmFyIHkseixBO3JldHVybih6PXMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMudGFibGV0cyx3KSk/KHYubW9iaWxlPXYudGFibGV0PXosdm9pZCh2LnBob25lPW51bGwpKTooeT1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnBob25lcyx3KSk/KHYubW9iaWxlPXYucGhvbmU9eSx2b2lkKHYudGFibGV0PW51bGwpKTp2b2lkKHMuaXNNb2JpbGVGYWxsYmFjayh3KT8oQT1yLmlzUGhvbmVTaXplZCh4KSxBPT09bT8odi5tb2JpbGU9cy5GQUxMQkFDS19NT0JJTEUsdi50YWJsZXQ9di5waG9uZT1udWxsKTpBPyh2Lm1vYmlsZT12LnBob25lPXMuRkFMTEJBQ0tfUEhPTkUsdi50YWJsZXQ9bnVsbCk6KHYubW9iaWxlPXYudGFibGV0PXMuRkFMTEJBQ0tfVEFCTEVULHYucGhvbmU9bnVsbCkpOnMuaXNUYWJsZXRGYWxsYmFjayh3KT8odi5tb2JpbGU9di50YWJsZXQ9cy5GQUxMQkFDS19UQUJMRVQsdi5waG9uZT1udWxsKTp2Lm1vYmlsZT12LnRhYmxldD12LnBob25lPW51bGwpfX0scy5tb2JpbGVHcmFkZT1mdW5jdGlvbih2KXt2YXIgdz1udWxsIT09di5tb2JpbGUoKTtyZXR1cm4gdi5vcyhcImlPU1wiKSYmNC4zPD12LnZlcnNpb24oXCJpUGFkXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE8PXYudmVyc2lvbihcImlQaG9uZVwiKXx8di5vcyhcImlPU1wiKSYmMy4xPD12LnZlcnNpb24oXCJpUG9kXCIpfHwyLjE8di52ZXJzaW9uKFwiQW5kcm9pZFwiKSYmdi5pcyhcIldlYmtpdFwiKXx8Nzw9di52ZXJzaW9uKFwiV2luZG93cyBQaG9uZSBPU1wiKXx8di5pcyhcIkJsYWNrQmVycnlcIikmJjY8PXYudmVyc2lvbihcIkJsYWNrQmVycnlcIil8fHYubWF0Y2goXCJQbGF5Ym9vay4qVGFibGV0XCIpfHwxLjQ8PXYudmVyc2lvbihcIndlYk9TXCIpJiZ2Lm1hdGNoKFwiUGFsbXxQcmV8UGl4aVwiKXx8di5tYXRjaChcImhwLipUb3VjaFBhZFwiKXx8di5pcyhcIkZpcmVmb3hcIikmJjEyPD12LnZlcnNpb24oXCJGaXJlZm94XCIpfHx2LmlzKFwiQ2hyb21lXCIpJiZ2LmlzKFwiQW5kcm9pZE9TXCIpJiY0PD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiU2t5ZmlyZVwiKSYmNC4xPD12LnZlcnNpb24oXCJTa3lmaXJlXCIpJiZ2LmlzKFwiQW5kcm9pZE9TXCIpJiYyLjM8PXYudmVyc2lvbihcIkFuZHJvaWRcIil8fHYuaXMoXCJPcGVyYVwiKSYmMTE8di52ZXJzaW9uKFwiT3BlcmEgTW9iaVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKXx8di5pcyhcIk1lZUdvT1NcIil8fHYuaXMoXCJUaXplblwiKXx8di5pcyhcIkRvbGZpblwiKSYmMjw9di52ZXJzaW9uKFwiQmFkYVwiKXx8KHYuaXMoXCJVQyBCcm93c2VyXCIpfHx2LmlzKFwiRG9sZmluXCIpKSYmMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2Lm1hdGNoKFwiS2luZGxlIEZpcmVcIil8fHYuaXMoXCJLaW5kbGVcIikmJjM8PXYudmVyc2lvbihcIktpbmRsZVwiKXx8di5pcyhcIkFuZHJvaWRPU1wiKSYmdi5pcyhcIk5vb2tUYWJsZXRcIil8fDExPD12LnZlcnNpb24oXCJDaHJvbWVcIikmJiF3fHw1PD12LnZlcnNpb24oXCJTYWZhcmlcIikmJiF3fHw0PD12LnZlcnNpb24oXCJGaXJlZm94XCIpJiYhd3x8Nzw9di52ZXJzaW9uKFwiTVNJRVwiKSYmIXd8fDEwPD12LnZlcnNpb24oXCJPcGVyYVwiKSYmIXc/XCJBXCI6di5vcyhcImlPU1wiKSYmNC4zPnYudmVyc2lvbihcImlQYWRcIil8fHYub3MoXCJpT1NcIikmJjMuMT52LnZlcnNpb24oXCJpUGhvbmVcIil8fHYub3MoXCJpT1NcIikmJjMuMT52LnZlcnNpb24oXCJpUG9kXCIpfHx2LmlzKFwiQmxhY2tiZXJyeVwiKSYmNTw9di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKSYmNj52LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHw1PD12LnZlcnNpb24oXCJPcGVyYSBNaW5pXCIpJiY2LjU+PXYudmVyc2lvbihcIk9wZXJhIE1pbmlcIikmJigyLjM8PXYudmVyc2lvbihcIkFuZHJvaWRcIil8fHYuaXMoXCJpT1NcIikpfHx2Lm1hdGNoKFwiTm9raWFOOHxOb2tpYUM3fE45Ny4qU2VyaWVzNjB8U3ltYmlhbi8zXCIpfHwxMTw9di52ZXJzaW9uKFwiT3BlcmEgTW9iaVwiKSYmdi5pcyhcIlN5bWJpYW5PU1wiKT9cIkJcIjooNT52LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHx2Lm1hdGNoKFwiTVNJRU1vYmlsZXxXaW5kb3dzIENFLipNb2JpbGVcIil8fDUuMj49di52ZXJzaW9uKFwiV2luZG93cyBNb2JpbGVcIiksXCJDXCIpfSxzLmRldGVjdE9TPWZ1bmN0aW9uKHYpe3JldHVybiBzLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLm9zczAsdil8fHMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMub3NzLHYpfSxzLmdldERldmljZVNtYWxsZXJTaWRlPWZ1bmN0aW9uKCl7cmV0dXJuIHdpbmRvdy5zY3JlZW4ud2lkdGg8d2luZG93LnNjcmVlbi5oZWlnaHQ/d2luZG93LnNjcmVlbi53aWR0aDp3aW5kb3cuc2NyZWVuLmhlaWdodH0sci5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOnIsbW9iaWxlOmZ1bmN0aW9uIG1vYmlsZSgpe3JldHVybiBzLnByZXBhcmVEZXRlY3Rpb25DYWNoZSh0aGlzLl9jYWNoZSx0aGlzLnVhLHRoaXMubWF4UGhvbmVXaWR0aCksdGhpcy5fY2FjaGUubW9iaWxlfSxwaG9uZTpmdW5jdGlvbiBwaG9uZSgpe3JldHVybiBzLnByZXBhcmVEZXRlY3Rpb25DYWNoZSh0aGlzLl9jYWNoZSx0aGlzLnVhLHRoaXMubWF4UGhvbmVXaWR0aCksdGhpcy5fY2FjaGUucGhvbmV9LHRhYmxldDpmdW5jdGlvbiB0YWJsZXQoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLnRhYmxldH0sdXNlckFnZW50OmZ1bmN0aW9uIHVzZXJBZ2VudCgpe3JldHVybiB0aGlzLl9jYWNoZS51c2VyQWdlbnQ9PT1tJiYodGhpcy5fY2FjaGUudXNlckFnZW50PXMuZmluZE1hdGNoKHMubW9iaWxlRGV0ZWN0UnVsZXMudWFzLHRoaXMudWEpKSx0aGlzLl9jYWNoZS51c2VyQWdlbnR9LHVzZXJBZ2VudHM6ZnVuY3Rpb24gdXNlckFnZW50cygpe3JldHVybiB0aGlzLl9jYWNoZS51c2VyQWdlbnRzPT09bSYmKHRoaXMuX2NhY2hlLnVzZXJBZ2VudHM9cy5maW5kTWF0Y2hlcyhzLm1vYmlsZURldGVjdFJ1bGVzLnVhcyx0aGlzLnVhKSksdGhpcy5fY2FjaGUudXNlckFnZW50c30sb3M6ZnVuY3Rpb24gb3MoKXtyZXR1cm4gdGhpcy5fY2FjaGUub3M9PT1tJiYodGhpcy5fY2FjaGUub3M9cy5kZXRlY3RPUyh0aGlzLnVhKSksdGhpcy5fY2FjaGUub3N9LHZlcnNpb246ZnVuY3Rpb24gdmVyc2lvbih2KXtyZXR1cm4gcy5nZXRWZXJzaW9uKHYsdGhpcy51YSl9LHZlcnNpb25TdHI6ZnVuY3Rpb24gdmVyc2lvblN0cih2KXtyZXR1cm4gcy5nZXRWZXJzaW9uU3RyKHYsdGhpcy51YSl9LGlzOmZ1bmN0aW9uIGlzKHYpe3JldHVybiBvKHRoaXMudXNlckFnZW50cygpLHYpfHxuKHYsdGhpcy5vcygpKXx8bih2LHRoaXMucGhvbmUoKSl8fG4odix0aGlzLnRhYmxldCgpKXx8byhzLmZpbmRNYXRjaGVzKHMubW9iaWxlRGV0ZWN0UnVsZXMudXRpbHMsdGhpcy51YSksdil9LG1hdGNoOmZ1bmN0aW9uIG1hdGNoKHYpe3JldHVybiB2IGluc3RhbmNlb2YgUmVnRXhwfHwodj1uZXcgUmVnRXhwKHYsXCJpXCIpKSx2LnRlc3QodGhpcy51YSl9LGlzUGhvbmVTaXplZDpmdW5jdGlvbiBpc1Bob25lU2l6ZWQodil7cmV0dXJuIHIuaXNQaG9uZVNpemVkKHZ8fHRoaXMubWF4UGhvbmVXaWR0aCl9LG1vYmlsZUdyYWRlOmZ1bmN0aW9uIG1vYmlsZUdyYWRlKCl7cmV0dXJuIHRoaXMuX2NhY2hlLmdyYWRlPT09bSYmKHRoaXMuX2NhY2hlLmdyYWRlPXMubW9iaWxlR3JhZGUodGhpcykpLHRoaXMuX2NhY2hlLmdyYWRlfX0sci5pc1Bob25lU2l6ZWQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LnNjcmVlbj9mdW5jdGlvbih2KXtyZXR1cm4gMD52P206cy5nZXREZXZpY2VTbWFsbGVyU2lkZSgpPD12fTpmdW5jdGlvbigpe30sci5faW1wbD1zLHIudmVyc2lvbj1cIjEuNC4yIDIwMTgtMDYtMTBcIixyfSl9KGZ1bmN0aW9uKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpcmV0dXJuIGZ1bmN0aW9uKG0pe21vZHVsZS5leHBvcnRzPW0oKX07aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKXJldHVybiBkZWZpbmU7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdylyZXR1cm4gZnVuY3Rpb24obSl7d2luZG93Lk1vYmlsZURldGVjdD1tKCl9O3Rocm93IG5ldyBFcnJvcihcInVua25vd24gZW52aXJvbm1lbnRcIil9KCkpOyJdfQ==
