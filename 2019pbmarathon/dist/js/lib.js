"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

      dBar.css({
        'width': '96%'
      }); // dAnibg.addClass("anibg-active");
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
/*!
 * pixi-plugin-bump - v1.1.8
 * Compiled Fri, 19 Oct 2018 21:38:37 UTC
 *
 * pixi-plugin-bump is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

!function (t) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var e;
    e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, (e.pixiBump || (e.pixiBump = {})).min = t();
  }
}(function () {
  return function () {
    function t(e, i, r) {
      function o(h, f) {
        if (!i[h]) {
          if (!e[h]) {
            var s = "function" == typeof require && require;
            if (!f && s) return s(h, !0);
            if (n) return n(h, !0);
            var a = new Error("Cannot find module '" + h + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }

          var d = i[h] = {
            exports: {}
          };
          e[h][0].call(d.exports, function (t) {
            return o(e[h][1][t] || t);
          }, d, d.exports, t, e, i, r);
        }

        return i[h].exports;
      }

      for (var n = "function" == typeof require && require, h = 0; h < r.length; h++) {
        o(r[h]);
      }

      return o;
    }

    return t;
  }()({
    1: [function (t, e, i) {
      function r() {
        this.rendererType = "pixi";
      }

      r.prototype = new r(), r.prototype.addCollisionProperties = function (t) {
        "pixi" === this.rendererType && (void 0 === t.gx && Object.defineProperty(t, "gx", {
          get: function get() {
            return t.getGlobalPosition().x;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.gy && Object.defineProperty(t, "gy", {
          get: function get() {
            return t.getGlobalPosition().y;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.centerX && Object.defineProperty(t, "centerX", {
          get: function get() {
            return t.x + t.width / 2;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.centerY && Object.defineProperty(t, "centerY", {
          get: function get() {
            return t.y + t.height / 2;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.halfWidth && Object.defineProperty(t, "halfWidth", {
          get: function get() {
            return t.width / 2;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.halfHeight && Object.defineProperty(t, "halfHeight", {
          get: function get() {
            return t.height / 2;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.xAnchorOffset && Object.defineProperty(t, "xAnchorOffset", {
          get: function get() {
            return void 0 !== t.anchor ? t.width * t.anchor.x : 0;
          },
          enumerable: !0,
          configurable: !0
        }), void 0 === t.yAnchorOffset && Object.defineProperty(t, "yAnchorOffset", {
          get: function get() {
            return void 0 !== t.anchor ? t.height * t.anchor.y : 0;
          },
          enumerable: !0,
          configurable: !0
        }), t.circular && void 0 === t.radius && Object.defineProperty(t, "radius", {
          get: function get() {
            return t.width / 2;
          },
          enumerable: !0,
          configurable: !0
        })), t._bumpPropertiesAdded = !0;
      }, r.prototype.hitTestPoint = function (t, e) {
        e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var i, r, o, n, h, f, s, a, d;
        return i = e.radius ? "circle" : "rectangle", "rectangle" === i && (r = e.x - e.xAnchorOffset, o = e.x + e.width - e.xAnchorOffset, n = e.y - e.yAnchorOffset, h = e.y + e.height - e.yAnchorOffset, d = t.x > r && t.x < o && t.y > n && t.y < h), "circle" === i && (f = t.x - e.x - e.width / 2 + e.xAnchorOffset, s = t.y - e.y - e.height / 2 + e.yAnchorOffset, a = Math.sqrt(f * f + s * s), d = a < e.radius), d;
      }, r.prototype.hitTestCircle = function (t, e, i) {
        t._bumpPropertiesAdded || this.addCollisionProperties(t), e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var r, o, n, h;
        return i ? (r = e.gx + e.width / 2 - e.xAnchorOffset - (t.gx + t.width / 2 - t.xAnchorOffset), o = e.gy + e.width / 2 - e.yAnchorOffset - (t.gy + t.width / 2 - t.yAnchorOffset)) : (r = e.x + e.width / 2 - e.xAnchorOffset - (t.x + t.width / 2 - t.xAnchorOffset), o = e.y + e.width / 2 - e.yAnchorOffset - (t.y + t.width / 2 - t.yAnchorOffset)), n = Math.sqrt(r * r + o * o), h = t.radius + e.radius, n < h;
      }, r.prototype.circleCollision = function (t, e, i, r) {
        t._bumpPropertiesAdded || this.addCollisionProperties(t), e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var o,
            n,
            h,
            f,
            s,
            a,
            d,
            c = {},
            y = !1;

        if (r ? (f = e.gx + e.width / 2 - e.xAnchorOffset - (t.gx + t.width / 2 - t.xAnchorOffset), s = e.gy + e.width / 2 - e.yAnchorOffset - (t.gy + t.width / 2 - t.yAnchorOffset)) : (f = e.x + e.width / 2 - e.xAnchorOffset - (t.x + t.width / 2 - t.xAnchorOffset), s = e.y + e.width / 2 - e.yAnchorOffset - (t.y + t.width / 2 - t.yAnchorOffset)), o = Math.sqrt(f * f + s * s), n = t.radius + e.radius, o < n) {
          y = !0, h = n - o;
          h += .3, a = f / o, d = s / o, t.x -= h * a, t.y -= h * d, i && (c.x = s, c.y = -f, this.bounceOffSurface(t, c));
        }

        return y;
      }, r.prototype.movingCircleCollision = function (t, e, i) {
        t._bumpPropertiesAdded || this.addCollisionProperties(t), e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var r,
            o,
            n,
            h,
            f = {},
            s = {},
            a = {},
            d = {},
            c = {},
            y = !1;

        if (t.mass = t.mass || 1, e.mass = e.mass || 1, i ? (f.vx = e.gx + e.radius - e.xAnchorOffset - (t.gx + t.radius - t.xAnchorOffset), f.vy = e.gy + e.radius - e.yAnchorOffset - (t.gy + t.radius - t.yAnchorOffset)) : (f.vx = e.x + e.radius - e.xAnchorOffset - (t.x + t.radius - t.xAnchorOffset), f.vy = e.y + e.radius - e.yAnchorOffset - (t.y + t.radius - t.yAnchorOffset)), f.magnitude = Math.sqrt(f.vx * f.vx + f.vy * f.vy), r = t.radius + e.radius, f.magnitude < r) {
          y = !0, o = r - f.magnitude, o += .3, f.dx = f.vx / f.magnitude, f.dy = f.vy / f.magnitude, f.vxHalf = Math.abs(f.dx * o / 2), f.vyHalf = Math.abs(f.dy * o / 2), n = t.x > e.x ? 1 : -1, h = t.y > e.y ? 1 : -1, t.x = t.x + f.vxHalf * n, t.y = t.y + f.vyHalf * h, e.x = e.x + f.vxHalf * -n, e.y = e.y + f.vyHalf * -h, f.lx = f.vy, f.ly = -f.vx;
          var l = t.vx * f.dx + t.vy * f.dy;
          s.x = l * f.dx, s.y = l * f.dy;
          var x = t.vx * (f.lx / f.magnitude) + t.vy * (f.ly / f.magnitude);
          a.x = x * (f.lx / f.magnitude), a.y = x * (f.ly / f.magnitude);
          var u = e.vx * f.dx + e.vy * f.dy;
          d.x = u * f.dx, d.y = u * f.dy;
          var p = e.vx * (f.lx / f.magnitude) + e.vy * (f.ly / f.magnitude);
          c.x = p * (f.lx / f.magnitude), c.y = p * (f.ly / f.magnitude), t.bounce = {}, t.bounce.x = a.x + d.x, t.bounce.y = a.y + d.y, e.bounce = {}, e.bounce.x = s.x + c.x, e.bounce.y = s.y + c.y, t.vx = t.bounce.x / t.mass, t.vy = t.bounce.y / t.mass, e.vx = e.bounce.x / e.mass, e.vy = e.bounce.y / e.mass;
        }

        return y;
      }, r.prototype.multipleCircleCollision = function (t, e) {
        for (var i = 0; i < t.length; i++) {
          for (var r = t[i], o = i + 1; o < t.length; o++) {
            var n = t[o];
            this.movingCircleCollision(r, n, e);
          }
        }
      }, r.prototype.checkMultipleCollision = function (t, e, i) {
        for (var r = 0; r < t.length; r++) {
          for (var o = displayObjects[r], n = r + 1; n < t.length; n++) {
            var h = t[n];
            return e ? rectangleCollision(o, h, e, i) : hitTestRectangle(o, h, i);
          }
        }
      }, r.prototype.rectangleCollision = function (t, e, i, r) {
        !1 !== r && (r = !0), t._bumpPropertiesAdded || this.addCollisionProperties(t), e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var o, n, h, f, s, a, d;
        return r ? (a = t.gx + Math.abs(t.halfWidth) - t.xAnchorOffset - (e.gx + Math.abs(e.halfWidth) - e.xAnchorOffset), d = t.gy + Math.abs(t.halfHeight) - t.yAnchorOffset - (e.gy + Math.abs(e.halfHeight) - e.yAnchorOffset)) : (a = t.x + Math.abs(t.halfWidth) - t.xAnchorOffset - (e.x + Math.abs(e.halfWidth) - e.xAnchorOffset), d = t.y + Math.abs(t.halfHeight) - t.yAnchorOffset - (e.y + Math.abs(e.halfHeight) - e.yAnchorOffset)), n = Math.abs(t.halfWidth) + Math.abs(e.halfWidth), h = Math.abs(t.halfHeight) + Math.abs(e.halfHeight), Math.abs(a) < n && Math.abs(d) < h && (f = n - Math.abs(a), s = h - Math.abs(d), f >= s ? (d > 0 ? (o = "top", t.y = t.y + s) : (o = "bottom", t.y = t.y - s), i && (t.vy *= -1)) : (a > 0 ? (o = "left", t.x = t.x + f) : (o = "right", t.x = t.x - f), i && (t.vx *= -1))), o;
      }, r.prototype.hitTestRectangle = function (t, e, i) {
        t._bumpPropertiesAdded || this.addCollisionProperties(t), e._bumpPropertiesAdded || this.addCollisionProperties(e);
        var r, o, n, h;
        return !1, i ? (n = t.gx + Math.abs(t.halfWidth) - t.xAnchorOffset - (e.gx + Math.abs(e.halfWidth) - e.xAnchorOffset), h = t.gy + Math.abs(t.halfHeight) - t.yAnchorOffset - (e.gy + Math.abs(e.halfHeight) - e.yAnchorOffset)) : (n = t.x + Math.abs(t.halfWidth) - t.xAnchorOffset - (e.x + Math.abs(e.halfWidth) - e.xAnchorOffset), h = t.y + Math.abs(t.halfHeight) - t.yAnchorOffset - (e.y + Math.abs(e.halfHeight) - e.yAnchorOffset)), r = Math.abs(t.halfWidth) + Math.abs(e.halfWidth), o = Math.abs(t.halfHeight) + Math.abs(e.halfHeight), Math.abs(n) < r && Math.abs(h) < o;
      }, r.prototype.hitTestCircleRectangle = function (t, e, i) {
        e._bumpPropertiesAdded || this.addCollisionProperties(e), t._bumpPropertiesAdded || this.addCollisionProperties(t);
        var r, o, n, h, f, s;
        if (i ? (n = t.gx, h = t.gy, f = e.gx, s = e.gy) : (n = t.x, h = t.y, f = e.x, s = e.y), "topMiddle" === (r = h - t.yAnchorOffset < s - Math.abs(e.halfHeight) - e.yAnchorOffset ? n - t.xAnchorOffset < f - 1 - Math.abs(e.halfWidth) - e.xAnchorOffset ? "topLeft" : n - t.xAnchorOffset > f + 1 + Math.abs(e.halfWidth) - e.xAnchorOffset ? "topRight" : "topMiddle" : h - t.yAnchorOffset > s + Math.abs(e.halfHeight) - e.yAnchorOffset ? n - t.xAnchorOffset < f - 1 - Math.abs(e.halfWidth) - e.xAnchorOffset ? "bottomLeft" : n - t.xAnchorOffset > f + 1 + Math.abs(e.halfWidth) - e.xAnchorOffset ? "bottomRight" : "bottomMiddle" : n - t.xAnchorOffset < f - Math.abs(e.halfWidth) - e.xAnchorOffset ? "leftMiddle" : "rightMiddle") || "bottomMiddle" === r || "leftMiddle" === r || "rightMiddle" === r) o = this.hitTestRectangle(t, e, i);else {
          var a = {};

          switch (r) {
            case "topLeft":
              a.x = f - e.xAnchorOffset, a.y = s - e.yAnchorOffset;
              break;

            case "topRight":
              a.x = f + e.width - e.xAnchorOffset, a.y = s - e.yAnchorOffset;
              break;

            case "bottomLeft":
              a.x = f - e.xAnchorOffset, a.y = s + e.height - e.yAnchorOffset;
              break;

            case "bottomRight":
              a.x = f + e.width - e.xAnchorOffset, a.y = s + e.height - e.yAnchorOffset;
          }

          o = this.hitTestCirclePoint(t, a, i);
        }
        return o ? r : o;
      }, r.prototype.hitTestCirclePoint = function (t, e, i) {
        return t._bumpPropertiesAdded || this.addCollisionProperties(t), e.diameter = 1, e.width = e.diameter, e.radius = .5, e.centerX = e.x, e.centerY = e.y, e.gx = e.x, e.gy = e.y, e.xAnchorOffset = 0, e.yAnchorOffset = 0, e._bumpPropertiesAdded = !0, this.hitTestCircle(t, e, i);
      }, r.prototype.circleRectangleCollision = function (t, e, i, r) {
        e._bumpPropertiesAdded || this.addCollisionProperties(e), t._bumpPropertiesAdded || this.addCollisionProperties(t);
        var o, n, h, f, s, a;
        if (r ? (h = t.gx, f = t.gy, s = e.gx, a = e.gy) : (h = t.x, f = t.y, s = e.x, a = e.y), "topMiddle" === (o = f - t.yAnchorOffset < a - Math.abs(e.halfHeight) - e.yAnchorOffset ? h - t.xAnchorOffset < s - 1 - Math.abs(e.halfWidth) - e.xAnchorOffset ? "topLeft" : h - t.xAnchorOffset > s + 1 + Math.abs(e.halfWidth) - e.xAnchorOffset ? "topRight" : "topMiddle" : f - t.yAnchorOffset > a + Math.abs(e.halfHeight) - e.yAnchorOffset ? h - t.xAnchorOffset < s - 1 - Math.abs(e.halfWidth) - e.xAnchorOffset ? "bottomLeft" : h - t.xAnchorOffset > s + 1 + Math.abs(e.halfWidth) - e.xAnchorOffset ? "bottomRight" : "bottomMiddle" : h - t.xAnchorOffset < s - Math.abs(e.halfWidth) - e.xAnchorOffset ? "leftMiddle" : "rightMiddle") || "bottomMiddle" === o || "leftMiddle" === o || "rightMiddle" === o) n = this.rectangleCollision(t, e, i, r);else {
          var d = {};

          switch (o) {
            case "topLeft":
              d.x = s - e.xAnchorOffset, d.y = a - e.yAnchorOffset;
              break;

            case "topRight":
              d.x = s + e.width - e.xAnchorOffset, d.y = a - e.yAnchorOffset;
              break;

            case "bottomLeft":
              d.x = s - e.xAnchorOffset, d.y = a + e.height - e.yAnchorOffset;
              break;

            case "bottomRight":
              d.x = s + e.width - e.xAnchorOffset, d.y = a + e.height - e.yAnchorOffset;
          }

          n = this.circlePointCollision(t, d, i, r);
        }
        return n ? o : n;
      }, r.prototype.circlePointCollision = function (t, e, i, r) {
        return t._bumpPropertiesAdded || this.addCollisionProperties(t), e.diameter = 1, e.width = e.diameter, e.radius = .5, e.centerX = e.x, e.centerY = e.y, e.gx = e.x, e.gy = e.y, e.xAnchorOffset = 0, e.yAnchorOffset = 0, e._bumpPropertiesAdded = !0, this.circleCollision(t, e, i, r);
      }, r.prototype.bounceOffSurface = function (t, e) {
        t._bumpPropertiesAdded || this.addCollisionProperties(t);
        var i,
            r,
            o = {},
            n = {},
            h = {},
            f = t.mass || 1;
        e.lx = e.y, e.ly = -e.x, e.magnitude = Math.sqrt(e.x * e.x + e.y * e.y), e.dx = e.x / e.magnitude, e.dy = e.y / e.magnitude, i = t.vx * e.dx + t.vy * e.dy, o.vx = i * e.dx, o.vy = i * e.dy, r = t.vx * (e.lx / e.magnitude) + t.vy * (e.ly / e.magnitude), n.vx = r * (e.lx / e.magnitude), n.vy = r * (e.ly / e.magnitude), n.vx *= -1, n.vy *= -1, h.x = o.vx + n.vx, h.y = o.vy + n.vy, t.vx = h.x / f, t.vy = h.y / f;
      }, r.prototype.contain = function (t, e, i, r) {
        r || (r = void 0), t._bumpPropertiesAdded || this.addCollisionProperties(t), void 0 === e.xAnchorOffset && (e.xAnchorOffset = 0), void 0 === e.yAnchorOffset && (e.yAnchorOffset = 0), void 0 === t.parent.gx && (t.parent.gx = 0), void 0 === t.parent.gy && (t.parent.gy = 0);
        var o = new Set();
        return t.x - t.xAnchorOffset < e.x - t.parent.gx - e.xAnchorOffset && (i && (t.vx *= -1), t.mass && (t.vx /= t.mass), t.x = e.x - t.parent.gx - e.xAnchorOffset + t.xAnchorOffset, o.add("left")), t.y - t.yAnchorOffset < e.y - t.parent.gy - e.yAnchorOffset && (i && (t.vy *= -1), t.mass && (t.vy /= t.mass), t.y = e.y - t.parent.gy - e.yAnchorOffset + t.yAnchorOffset, o.add("top")), t.x - t.xAnchorOffset + t.width > e.width - e.xAnchorOffset && (i && (t.vx *= -1), t.mass && (t.vx /= t.mass), t.x = e.width - t.width - e.xAnchorOffset + t.xAnchorOffset, o.add("right")), t.y - t.yAnchorOffset + t.height > e.height - e.yAnchorOffset && (i && (t.vy *= -1), t.mass && (t.vy /= t.mass), t.y = e.height - t.height - e.yAnchorOffset + t.yAnchorOffset, o.add("bottom")), 0 === o.size && (o = void 0), o && r && r(o), o;
      }, r.prototype.outsideBounds = function (t, e, i) {
        var r = e.x,
            o = e.y,
            n = e.width,
            h = e.height,
            f = new Set();
        return t.x < r - t.width && f.add("left"), t.y < o - t.height && f.add("top"), t.x > n + t.width && f.add("right"), t.y > h + t.height && f.add("bottom"), 0 === f.size && (f = void 0), f && i && i(f), f;
      }, r.prototype._getCenter = function (t, e, i) {
        return void 0 !== t.anchor ? 0 !== t.anchor[i] ? 0 : e / 2 : e;
      }, r.prototype.hit = function (t, e, i, r, o, n) {
        function h(t, e) {
          var i = void 0 !== t.parent,
              r = void 0 !== e.parent;
          if (i && r) return t.diameter && e.diameter ? f(t, e) : t.diameter && !e.diameter ? a(t, e) : s(t, e);
          if (r && void 0 !== t.x && void 0 !== t.y) return c(t, e);
          throw new Error("I'm sorry, " + t + " and " + e + " cannot be use together in a collision test.'");
        }

        function f(t, e) {
          return i ? t.vx + t.vy !== 0 && e.vx + e.vy !== 0 ? x(t, e, o) : u(t, e, r, o) : l(t, e);
        }

        function s(t, e) {
          return i ? g(t, e, r, o) : y(t, e, o);
        }

        function a(t, e) {
          return i ? b(t, e, r, o) : p(t, e, o);
        }

        var d,
            c = this.hitTestPoint.bind(this),
            y = this.hitTestRectangle.bind(this),
            l = this.hitTestCircle.bind(this),
            x = this.movingCircleCollision.bind(this),
            u = this.circleCollision.bind(this),
            p = this.hitTestCircleRectangle.bind(this),
            g = this.rectangleCollision.bind(this),
            b = this.circleRectangleCollision.bind(this),
            A = void 0 !== t.parent,
            O = void 0 !== e.parent;
        return A && e instanceof Array || O && t instanceof Array ? function () {
          if (t instanceof Array) {
            var i = e;
            e = t, t = i;
          }

          for (var r = e.length - 1; r >= 0; r--) {
            var o = e[r];
            (d = h(t, o)) && n && n(d, o);
          }
        }() : d = h(t, e), d;
      }, r.prototype.hitTest = function (t, e) {
        for (var i = {
          top: !1,
          left: !1,
          bottom: !1,
          right: !1
        }, r = e.length - 1; r >= 0; r--) {
          var o = e[r];
          t.x < o.x + o.width && (i.left = !0), t.x + t.width > o.x && (i.right = !0), t.y < o.y + o.height && (i.top = !0), t.height + t.y > o.y && (i.bottom = !0);
        }

        return i;
      }, r.prototype.hitTestDirections = function (t, e, i) {
        var r = this.hitTest(t, e);

        for (var o in r) {
          -1 === i.indexOf(o) && (r[o] = !1);
        }

        return r;
      }, r.prototype.hitTestLeft = function (t, e) {
        for (var i = e.length - 1; i >= 0; i--) {
          var r = e[i];
          if (t.height + t.y > r.y && t.y < r.y + r.height && t.x < r.x + r.width) return !0;
        }
      }, r.prototype.hitTestRight = function (t, e) {
        for (var i = e.length - 1; i >= 0; i--) {
          var r = e[i];
          if (t.height + t.y > r.y && t.y < r.y + r.height && t.x + t.width > r.x) return !0;
        }
      }, r.prototype.hitTestTop = function (t, e) {
        for (var i = e.length - 1; i >= 0; i--) {
          var r = e[i];
          if (t.x + t.width > r.x && t.x < r.x + r.width && t.y < r.y + r.height) return !0;
        }
      }, r.prototype.hitTestBottom = function (t, e) {
        for (var i = e.length - 1; i >= 0; i--) {
          var r = e[i];
          if (t.x + t.width > r.x && t.x < r.x + r.width && t.height + t.y > r.y) return !0;
        }
      }, e.exports = r;
    }, {}],
    2: [function (t, e, i) {
      var r = {
        Bump: t("./Bump")
      };
      Object.assign(PIXI.extras, r), e.exports = r;
    }, {
      "./Bump": 1
    }]
  }, {}, [2])(2);
}); //# sourceMappingURL=pixi-bump.min.js.map

"use strict";

var _extends = Object.assign || function (e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];

    for (var r in n) {
      Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
  }

  return e;
},
    __filters = function (e, d) {
  var t,
      n,
      r = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
      o = ((n = d.Filter) && (w.__proto__ = n), ((w.prototype = Object.create(n && n.prototype)).constructor = w).prototype.apply = function (e, t, n, r) {
    this.uniforms.gamma = Math.max(this.gamma, 1e-4), this.uniforms.saturation = this.saturation, this.uniforms.contrast = this.contrast, this.uniforms.brightness = this.brightness, this.uniforms.red = this.red, this.uniforms.green = this.green, this.uniforms.blue = this.blue, this.uniforms.alpha = this.alpha, e.applyFilter(this, t, n, r);
  }, w),
      h = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = 4), void 0 === t && (t = 3), void 0 === n && (n = !1), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", n ? "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n" : "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}"), this.uniforms.uOffset = new Float32Array(2), this._pixelSize = new d.Point(), this.pixelSize = 1, this._clamp = n, this._kernels = null, Array.isArray(e) ? this.kernels = e : (this._blur = e, this.quality = t);
    }

    r && (e.__proto__ = r);
    var t = {
      kernels: {
        configurable: !0
      },
      clamp: {
        configurable: !0
      },
      pixelSize: {
        configurable: !0
      },
      quality: {
        configurable: !0
      },
      blur: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      var o,
          i = this.pixelSize.x / t.size.width,
          a = this.pixelSize.y / t.size.height;
      if (1 === this._quality || 0 === this._blur) o = this._kernels[0] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * a, e.applyFilter(this, t, n, r);else {
        for (var l, s = e.getRenderTarget(!0), u = t, c = s, f = this._quality - 1, d = 0; d < f; d++) {
          o = this._kernels[d] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * a, e.applyFilter(this, u, c, !0), l = u, u = c, c = l;
        }

        o = this._kernels[f] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * a, e.applyFilter(this, u, n, r), e.returnRenderTarget(s);
      }
    }, e.prototype._generateKernels = function () {
      var e = this._blur,
          t = this._quality,
          n = [e];
      if (0 < e) for (var r = e, o = e / t, i = 1; i < t; i++) {
        r -= o, n.push(r);
      }
      this._kernels = n;
    }, t.kernels.get = function () {
      return this._kernels;
    }, t.kernels.set = function (e) {
      Array.isArray(e) && 0 < e.length ? (this._kernels = e, this._quality = e.length, this._blur = Math.max.apply(Math, e)) : (this._kernels = [0], this._quality = 1);
    }, t.clamp.get = function () {
      return this._clamp;
    }, t.pixelSize.set = function (e) {
      "number" == typeof e ? (this._pixelSize.x = e, this._pixelSize.y = e) : Array.isArray(e) ? (this._pixelSize.x = e[0], this._pixelSize.y = e[1]) : e instanceof d.Point ? (this._pixelSize.x = e.x, this._pixelSize.y = e.y) : (this._pixelSize.x = 1, this._pixelSize.y = 1);
    }, t.pixelSize.get = function () {
      return this._pixelSize;
    }, t.quality.get = function () {
      return this._quality;
    }, t.quality.set = function (e) {
      this._quality = Math.max(1, Math.round(e)), this._generateKernels();
    }, t.blur.get = function () {
      return this._blur;
    }, t.blur.set = function (e) {
      this._blur = e, this._generateKernels();
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      l = r,
      s = function (t) {
    function e(e) {
      void 0 === e && (e = .5), t.call(this, l, "\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n"), this.threshold = e;
    }

    t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e;
    var n = {
      threshold: {
        configurable: !0
      }
    };
    return n.threshold.get = function () {
      return this.uniforms.threshold;
    }, n.threshold.set = function (e) {
      this.uniforms.threshold = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      i = function (a) {
    function e(e) {
      a.call(this, l, "uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n"), "number" == typeof e && (e = {
        threshold: e
      }), e = _extends({
        threshold: .5,
        bloomScale: 1,
        brightness: 1,
        kernels: null,
        blur: 8,
        quality: 4,
        pixelSize: 1,
        resolution: d.settings.RESOLUTION
      }, e), this.bloomScale = e.bloomScale, this.brightness = e.brightness;
      var t = e.kernels,
          n = e.blur,
          r = e.quality,
          o = e.pixelSize,
          i = e.resolution;
      this._extractFilter = new s(e.threshold), this._extractFilter.resolution = i, this._blurFilter = t ? new h(t) : new h(n, r), this.pixelSize = o, this.resolution = i;
    }

    a && (e.__proto__ = a);
    var t = {
      resolution: {
        configurable: !0
      },
      threshold: {
        configurable: !0
      },
      kernels: {
        configurable: !0
      },
      blur: {
        configurable: !0
      },
      quality: {
        configurable: !0
      },
      pixelSize: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(a && a.prototype)).constructor = e).prototype.apply = function (e, t, n, r, o) {
      var i = e.getRenderTarget(!0);

      this._extractFilter.apply(e, t, i, !0, o);

      var a = e.getRenderTarget(!0);
      this._blurFilter.apply(e, i, a, !0, o), this.uniforms.bloomScale = this.bloomScale, this.uniforms.brightness = this.brightness, this.uniforms.bloomTexture = a, e.applyFilter(this, t, n, r), e.returnRenderTarget(a), e.returnRenderTarget(i);
    }, t.resolution.get = function () {
      return this._resolution;
    }, t.resolution.set = function (e) {
      this._resolution = e, this._extractFilter && (this._extractFilter.resolution = e), this._blurFilter && (this._blurFilter.resolution = e);
    }, t.threshold.get = function () {
      return this._extractFilter.threshold;
    }, t.threshold.set = function (e) {
      this._extractFilter.threshold = e;
    }, t.kernels.get = function () {
      return this._blurFilter.kernels;
    }, t.kernels.set = function (e) {
      this._blurFilter.kernels = e;
    }, t.blur.get = function () {
      return this._blurFilter.blur;
    }, t.blur.set = function (e) {
      this._blurFilter.blur = e;
    }, t.quality.get = function () {
      return this._blurFilter.quality;
    }, t.quality.set = function (e) {
      this._blurFilter.quality = e;
    }, t.pixelSize.get = function () {
      return this._blurFilter.pixelSize;
    }, t.pixelSize.set = function (e) {
      this._blurFilter.pixelSize = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      a = function (t) {
    function e(e) {
      void 0 === e && (e = 8), t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}"), this.size = e;
    }

    t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e;
    var n = {
      size: {
        configurable: !0
      }
    };
    return n.size.get = function () {
      return this.uniforms.pixelSize;
    }, n.size.set = function (e) {
      this.uniforms.pixelSize = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      u = function (t) {
    function e(e) {
      void 0 === e && (e = {}), t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float transformX;\nuniform float transformY;\nuniform vec3 lightColor;\nuniform float lightAlpha;\nuniform vec3 shadowColor;\nuniform float shadowAlpha;\n\nvoid main(void) {\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\n\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\n}\n"), this.uniforms.lightColor = new Float32Array(3), this.uniforms.shadowColor = new Float32Array(3), e = _extends({
        rotation: 45,
        thickness: 2,
        lightColor: 16777215,
        lightAlpha: .7,
        shadowColor: 0,
        shadowAlpha: .7
      }, e), this.rotation = e.rotation, this.thickness = e.thickness, this.lightColor = e.lightColor, this.lightAlpha = e.lightAlpha, this.shadowColor = e.shadowColor, this.shadowAlpha = e.shadowAlpha;
    }

    t && (e.__proto__ = t);
    var n = {
      rotation: {
        configurable: !0
      },
      thickness: {
        configurable: !0
      },
      lightColor: {
        configurable: !0
      },
      lightAlpha: {
        configurable: !0
      },
      shadowColor: {
        configurable: !0
      },
      shadowAlpha: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(t && t.prototype)).constructor = e).prototype._updateTransform = function () {
      this.uniforms.transformX = this._thickness * Math.cos(this._angle), this.uniforms.transformY = this._thickness * Math.sin(this._angle);
    }, n.rotation.get = function () {
      return this._angle / d.DEG_TO_RAD;
    }, n.rotation.set = function (e) {
      this._angle = e * d.DEG_TO_RAD, this._updateTransform();
    }, n.thickness.get = function () {
      return this._thickness;
    }, n.thickness.set = function (e) {
      this._thickness = e, this._updateTransform();
    }, n.lightColor.get = function () {
      return d.utils.rgb2hex(this.uniforms.lightColor);
    }, n.lightColor.set = function (e) {
      d.utils.hex2rgb(e, this.uniforms.lightColor);
    }, n.lightAlpha.get = function () {
      return this.uniforms.lightAlpha;
    }, n.lightAlpha.set = function (e) {
      this.uniforms.lightAlpha = e;
    }, n.shadowColor.get = function () {
      return d.utils.rgb2hex(this.uniforms.shadowColor);
    }, n.shadowColor.set = function (e) {
      d.utils.hex2rgb(e, this.uniforms.shadowColor);
    }, n.shadowAlpha.get = function () {
      return this.uniforms.shadowAlpha;
    }, n.shadowAlpha.set = function (e) {
      this.uniforms.shadowAlpha = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      c = d.filters,
      f = c.BlurXFilter,
      m = c.BlurYFilter,
      p = c.AlphaFilter,
      g = function (a) {
    function e(e, t, n, r) {
      var o, i;
      void 0 === e && (e = 2), void 0 === t && (t = 4), void 0 === n && (n = d.settings.RESOLUTION), void 0 === r && (r = 5), a.call(this), "number" == typeof e ? i = o = e : e instanceof d.Point ? (o = e.x, i = e.y) : Array.isArray(e) && (o = e[0], i = e[1]), this.blurXFilter = new f(o, t, n, r), this.blurYFilter = new m(i, t, n, r), this.blurYFilter.blendMode = d.BLEND_MODES.SCREEN, this.defaultFilter = new p();
    }

    a && (e.__proto__ = a);
    var t = {
      blur: {
        configurable: !0
      },
      blurX: {
        configurable: !0
      },
      blurY: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(a && a.prototype)).constructor = e).prototype.apply = function (e, t, n) {
      var r = e.getRenderTarget(!0);
      this.defaultFilter.apply(e, t, n), this.blurXFilter.apply(e, t, r), this.blurYFilter.apply(e, r, n), e.returnRenderTarget(r);
    }, t.blur.get = function () {
      return this.blurXFilter.blur;
    }, t.blur.set = function (e) {
      this.blurXFilter.blur = this.blurYFilter.blur = e;
    }, t.blurX.get = function () {
      return this.blurXFilter.blur;
    }, t.blurX.set = function (e) {
      this.blurXFilter.blur = e;
    }, t.blurY.get = function () {
      return this.blurYFilter.blur;
    }, t.blurY.set = function (e) {
      this.blurYFilter.blur = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      v = function (r) {
    function e(e, t, n) {
      r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    gl_FragColor = color;\n}\n"), this.uniforms.dimensions = new Float32Array(2), this.center = e || [.5, .5], this.radius = "number" == typeof t ? t : 100, this.strength = "number" == typeof n ? n : 1;
    }

    r && (e.__proto__ = r);
    var t = {
      radius: {
        configurable: !0
      },
      strength: {
        configurable: !0
      },
      center: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.dimensions[0] = t.sourceFrame.width, this.uniforms.dimensions[1] = t.sourceFrame.height, e.applyFilter(this, t, n, r);
    }, t.radius.get = function () {
      return this.uniforms.radius;
    }, t.radius.set = function (e) {
      this.uniforms.radius = e;
    }, t.strength.get = function () {
      return this.uniforms.strength;
    }, t.strength.set = function (e) {
      this.uniforms.strength = e;
    }, t.center.get = function () {
      return this.uniforms.center;
    }, t.center.set = function (e) {
      this.uniforms.center = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      x = function (r) {
    function e(e, t, n) {
      void 0 === t && (t = !1), void 0 === n && (n = 1), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D colorMap;\nuniform float _mix;\nuniform float _size;\nuniform float _sliceSize;\nuniform float _slicePixelSize;\nuniform float _sliceInnerSize;\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\n\n    vec4 adjusted;\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n        float innerWidth = _size - 1.0;\n        float zSlice0 = min(floor(color.b * innerWidth), innerWidth);\n        float zSlice1 = min(zSlice0 + 1.0, innerWidth);\n        float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\n        float s0 = xOffset + (zSlice0 * _sliceSize);\n        float s1 = xOffset + (zSlice1 * _sliceSize);\n        float yOffset = _sliceSize * 0.5 + color.g * (1.0 - _sliceSize);\n        vec4 slice0Color = texture2D(colorMap, vec2(s0,yOffset));\n        vec4 slice1Color = texture2D(colorMap, vec2(s1,yOffset));\n        float zOffset = fract(color.b * innerWidth);\n        adjusted = mix(slice0Color, slice1Color, zOffset);\n\n        color.rgb *= color.a;\n    }\n    gl_FragColor = vec4(mix(color, adjusted, _mix).rgb, color.a);\n\n}"), this._size = 0, this._sliceSize = 0, this._slicePixelSize = 0, this._sliceInnerSize = 0, this._scaleMode = null, this._nearest = !1, this.nearest = t, this.mix = n, this.colorMap = e;
    }

    r && (e.__proto__ = r);
    var t = {
      colorSize: {
        configurable: !0
      },
      colorMap: {
        configurable: !0
      },
      nearest: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms._mix = this.mix, e.applyFilter(this, t, n, r);
    }, t.colorSize.get = function () {
      return this._size;
    }, t.colorMap.get = function () {
      return this._colorMap;
    }, t.colorMap.set = function (e) {
      e instanceof d.Texture || (e = d.Texture.from(e)), e && e.baseTexture && (e.baseTexture.scaleMode = this._scaleMode, e.baseTexture.mipmap = !1, this._size = e.height, this._sliceSize = 1 / this._size, this._slicePixelSize = this._sliceSize / this._size, this._sliceInnerSize = this._slicePixelSize * (this._size - 1), this.uniforms._size = this._size, this.uniforms._sliceSize = this._sliceSize, this.uniforms._slicePixelSize = this._slicePixelSize, this.uniforms._sliceInnerSize = this._sliceInnerSize, this.uniforms.colorMap = e), this._colorMap = e;
    }, t.nearest.get = function () {
      return this._nearest;
    }, t.nearest.set = function (e) {
      this._nearest = e, this._scaleMode = e ? d.SCALE_MODES.NEAREST : d.SCALE_MODES.LINEAR;
      var t = this._colorMap;
      t && t.baseTexture && (t.baseTexture._glTextures = {}, t.baseTexture.scaleMode = this._scaleMode, t.baseTexture.mipmap = !1, t._updateID++, t.baseTexture.emit("update", t.baseTexture));
    }, e.prototype.updateColorMap = function () {
      var e = this._colorMap;
      e && e.baseTexture && (e._updateID++, e.baseTexture.emit("update", e.baseTexture), this.colorMap = e);
    }, e.prototype.destroy = function (e) {
      this._colorMap && this._colorMap.destroy(e), r.prototype.destroy.call(this);
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      y = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = 16711680), void 0 === t && (t = 0), void 0 === n && (n = .4), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n"), this.uniforms.originalColor = new Float32Array(3), this.uniforms.newColor = new Float32Array(3), this.originalColor = e, this.newColor = t, this.epsilon = n;
    }

    r && (e.__proto__ = r), (e.prototype = Object.create(r && r.prototype)).constructor = e;
    var t = {
      originalColor: {
        configurable: !0
      },
      newColor: {
        configurable: !0
      },
      epsilon: {
        configurable: !0
      }
    };
    return t.originalColor.set = function (e) {
      var t = this.uniforms.originalColor;
      "number" == typeof e ? (d.utils.hex2rgb(e, t), this._originalColor = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], this._originalColor = d.utils.rgb2hex(t));
    }, t.originalColor.get = function () {
      return this._originalColor;
    }, t.newColor.set = function (e) {
      var t = this.uniforms.newColor;
      "number" == typeof e ? (d.utils.hex2rgb(e, t), this._newColor = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], this._newColor = d.utils.rgb2hex(t));
    }, t.newColor.get = function () {
      return this._newColor;
    }, t.epsilon.set = function (e) {
      this.uniforms.epsilon = e;
    }, t.epsilon.get = function () {
      return this.uniforms.epsilon;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      b = function (r) {
    function e(e, t, n) {
      void 0 === t && (t = 200), void 0 === n && (n = 200), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n"), this.uniforms.texelSize = new Float32Array(2), this.uniforms.matrix = new Float32Array(9), void 0 !== e && (this.matrix = e), this.width = t, this.height = n;
    }

    r && (e.__proto__ = r), (e.prototype = Object.create(r && r.prototype)).constructor = e;
    var t = {
      matrix: {
        configurable: !0
      },
      width: {
        configurable: !0
      },
      height: {
        configurable: !0
      }
    };
    return t.matrix.get = function () {
      return this.uniforms.matrix;
    }, t.matrix.set = function (e) {
      var n = this;
      e.forEach(function (e, t) {
        return n.uniforms.matrix[t] = e;
      });
    }, t.width.get = function () {
      return 1 / this.uniforms.texelSize[0];
    }, t.width.set = function (e) {
      this.uniforms.texelSize[0] = 1 / e;
    }, t.height.get = function () {
      return 1 / this.uniforms.texelSize[1];
    }, t.height.set = function (e) {
      this.uniforms.texelSize[1] = 1 / e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      _ = ((t = d.Filter) && (A.__proto__ = t), (A.prototype = Object.create(t && t.prototype)).constructor = A),
      C = function (t) {
    function e(e) {
      t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    vec2 dir = vec2(coord - vec2(0.5, 0.5));\n\n    float _c = curvature > 0. ? curvature : 1.;\n    float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n    vec2 uv = dir * k;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0) {\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n"), this.uniforms.dimensions = new Float32Array(2), this.time = 0, this.seed = 0, _extends(this, {
        curvature: 1,
        lineWidth: 1,
        lineContrast: .25,
        verticalLine: !1,
        noise: 0,
        noiseSize: 1,
        seed: 0,
        vignetting: .3,
        vignettingAlpha: 1,
        vignettingBlur: .3,
        time: 0
      }, e);
    }

    t && (e.__proto__ = t);
    var n = {
      curvature: {
        configurable: !0
      },
      lineWidth: {
        configurable: !0
      },
      lineContrast: {
        configurable: !0
      },
      verticalLine: {
        configurable: !0
      },
      noise: {
        configurable: !0
      },
      noiseSize: {
        configurable: !0
      },
      vignetting: {
        configurable: !0
      },
      vignettingAlpha: {
        configurable: !0
      },
      vignettingBlur: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(t && t.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.dimensions[0] = t.sourceFrame.width, this.uniforms.dimensions[1] = t.sourceFrame.height, this.uniforms.seed = this.seed, this.uniforms.time = this.time, e.applyFilter(this, t, n, r);
    }, n.curvature.set = function (e) {
      this.uniforms.curvature = e;
    }, n.curvature.get = function () {
      return this.uniforms.curvature;
    }, n.lineWidth.set = function (e) {
      this.uniforms.lineWidth = e;
    }, n.lineWidth.get = function () {
      return this.uniforms.lineWidth;
    }, n.lineContrast.set = function (e) {
      this.uniforms.lineContrast = e;
    }, n.lineContrast.get = function () {
      return this.uniforms.lineContrast;
    }, n.verticalLine.set = function (e) {
      this.uniforms.verticalLine = e;
    }, n.verticalLine.get = function () {
      return this.uniforms.verticalLine;
    }, n.noise.set = function (e) {
      this.uniforms.noise = e;
    }, n.noise.get = function () {
      return this.uniforms.noise;
    }, n.noiseSize.set = function (e) {
      this.uniforms.noiseSize = e;
    }, n.noiseSize.get = function () {
      return this.uniforms.noiseSize;
    }, n.vignetting.set = function (e) {
      this.uniforms.vignetting = e;
    }, n.vignetting.get = function () {
      return this.uniforms.vignetting;
    }, n.vignettingAlpha.set = function (e) {
      this.uniforms.vignettingAlpha = e;
    }, n.vignettingAlpha.get = function () {
      return this.uniforms.vignettingAlpha;
    }, n.vignettingBlur.set = function (e) {
      this.uniforms.vignettingBlur = e;
    }, n.vignettingBlur.get = function () {
      return this.uniforms.vignettingBlur;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      S = function (n) {
    function e(e, t) {
      void 0 === e && (e = 1), void 0 === t && (t = 5), n.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n"), this.scale = e, this.angle = t;
    }

    n && (e.__proto__ = n), (e.prototype = Object.create(n && n.prototype)).constructor = e;
    var t = {
      scale: {
        configurable: !0
      },
      angle: {
        configurable: !0
      }
    };
    return t.scale.get = function () {
      return this.uniforms.scale;
    }, t.scale.set = function (e) {
      this.uniforms.scale = e;
    }, t.angle.get = function () {
      return this.uniforms.angle;
    }, t.angle.set = function (e) {
      this.uniforms.angle = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      T = function (f) {
    function e(e) {
      e && e.constructor !== Object && (console.warn("DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)"), e = {
        rotation: e
      }, void 0 !== arguments[1] && (e.distance = arguments[1]), void 0 !== arguments[2] && (e.blur = arguments[2]), void 0 !== arguments[3] && (e.color = arguments[3]), void 0 !== arguments[4] && (e.alpha = arguments[4])), e = _extends({
        rotation: 45,
        distance: 5,
        color: 0,
        alpha: .5,
        shadowOnly: !1,
        kernels: null,
        blur: 2,
        quality: 3,
        pixelSize: 1,
        resolution: d.settings.RESOLUTION
      }, e), f.call(this);
      var t = e.kernels,
          n = e.blur,
          r = e.quality,
          o = e.pixelSize,
          i = e.resolution;
      this._tintFilter = new d.Filter("attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}"), this._tintFilter.uniforms.color = new Float32Array(4), this._tintFilter.resolution = i, this._blurFilter = t ? new h(t) : new h(n, r), this.pixelSize = o, this.resolution = i, this.targetTransform = new d.Matrix();
      var a = e.shadowOnly,
          l = e.rotation,
          s = e.distance,
          u = e.alpha,
          c = e.color;
      this.shadowOnly = a, this.rotation = l, this.distance = s, this.alpha = u, this.color = c, this._updatePadding();
    }

    f && (e.__proto__ = f);
    var t = {
      resolution: {
        configurable: !0
      },
      distance: {
        configurable: !0
      },
      rotation: {
        configurable: !0
      },
      alpha: {
        configurable: !0
      },
      color: {
        configurable: !0
      },
      kernels: {
        configurable: !0
      },
      blur: {
        configurable: !0
      },
      quality: {
        configurable: !0
      },
      pixelSize: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(f && f.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      var o = e.getRenderTarget();
      o.transform = this.targetTransform, this._tintFilter.apply(e, t, o, !0), o.transform = null, this._blurFilter.apply(e, o, n, r), !0 !== this.shadowOnly && e.applyFilter(this, t, n, !1), e.returnRenderTarget(o);
    }, e.prototype._updatePadding = function () {
      this.padding = this.distance + 2 * this.blur;
    }, e.prototype._updateTargetTransform = function () {
      this.targetTransform.tx = this.distance * Math.cos(this.angle), this.targetTransform.ty = this.distance * Math.sin(this.angle);
    }, t.resolution.get = function () {
      return this._resolution;
    }, t.resolution.set = function (e) {
      this._resolution = e, this._tintFilter && (this._tintFilter.resolution = e), this._blurFilter && (this._blurFilter.resolution = e);
    }, t.distance.get = function () {
      return this._distance;
    }, t.distance.set = function (e) {
      this._distance = e, this._updatePadding(), this._updateTargetTransform();
    }, t.rotation.get = function () {
      return this.angle / d.DEG_TO_RAD;
    }, t.rotation.set = function (e) {
      this.angle = e * d.DEG_TO_RAD, this._updateTargetTransform();
    }, t.alpha.get = function () {
      return this._tintFilter.uniforms.alpha;
    }, t.alpha.set = function (e) {
      this._tintFilter.uniforms.alpha = e;
    }, t.color.get = function () {
      return d.utils.rgb2hex(this._tintFilter.uniforms.color);
    }, t.color.set = function (e) {
      d.utils.hex2rgb(e, this._tintFilter.uniforms.color);
    }, t.kernels.get = function () {
      return this._blurFilter.kernels;
    }, t.kernels.set = function (e) {
      this._blurFilter.kernels = e;
    }, t.blur.get = function () {
      return this._blurFilter.blur;
    }, t.blur.set = function (e) {
      this._blurFilter.blur = e, this._updatePadding();
    }, t.quality.get = function () {
      return this._blurFilter.quality;
    }, t.quality.set = function (e) {
      this._blurFilter.quality = e;
    }, t.pixelSize.get = function () {
      return this._blurFilter.pixelSize;
    }, t.pixelSize.set = function (e) {
      this._blurFilter.pixelSize = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      F = function (t) {
    function e(e) {
      void 0 === e && (e = 5), t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n"), this.strength = e;
    }

    t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e;
    var n = {
      strength: {
        configurable: !0
      }
    };
    return n.strength.get = function () {
      return this.uniforms.strength;
    }, n.strength.set = function (e) {
      this.uniforms.strength = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      z = function (t) {
    function e(e) {
      void 0 === e && (e = {}), t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n"), this.uniforms.dimensions = new Float32Array(2), e = _extends({
        slices: 5,
        offset: 100,
        direction: 0,
        fillMode: 0,
        average: !1,
        seed: 0,
        red: [0, 0],
        green: [0, 0],
        blue: [0, 0],
        minSize: 8,
        sampleSize: 512
      }, e), this.direction = e.direction, this.red = e.red, this.green = e.green, this.blue = e.blue, this.offset = e.offset, this.fillMode = e.fillMode, this.average = e.average, this.seed = e.seed, this.minSize = e.minSize, this.sampleSize = e.sampleSize, this._canvas = document.createElement("canvas"), this._canvas.width = 4, this._canvas.height = this.sampleSize, this.texture = d.Texture.fromCanvas(this._canvas, d.SCALE_MODES.NEAREST), this._slices = 0, this.slices = e.slices;
    }

    t && (e.__proto__ = t);
    var n = {
      sizes: {
        configurable: !0
      },
      offsets: {
        configurable: !0
      },
      slices: {
        configurable: !0
      },
      direction: {
        configurable: !0
      },
      red: {
        configurable: !0
      },
      green: {
        configurable: !0
      },
      blue: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(t && t.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      var o = t.sourceFrame.width,
          i = t.sourceFrame.height;
      this.uniforms.dimensions[0] = o, this.uniforms.dimensions[1] = i, this.uniforms.aspect = i / o, this.uniforms.seed = this.seed, this.uniforms.offset = this.offset, this.uniforms.fillMode = this.fillMode, e.applyFilter(this, t, n, r);
    }, e.prototype._randomizeSizes = function () {
      var e = this._sizes,
          t = this._slices - 1,
          n = this.sampleSize,
          r = Math.min(this.minSize / n, .9 / this._slices);

      if (this.average) {
        for (var o = this._slices, i = 1, a = 0; a < t; a++) {
          var l = i / (o - a),
              s = Math.max(l * (1 - .6 * Math.random()), r);
          i -= e[a] = s;
        }

        e[t] = i;
      } else {
        for (var u = 1, c = Math.sqrt(1 / this._slices), f = 0; f < t; f++) {
          var d = Math.max(c * u * Math.random(), r);
          u -= e[f] = d;
        }

        e[t] = u;
      }

      this.shuffle();
    }, e.prototype.shuffle = function () {
      for (var e = this._sizes, t = this._slices - 1; 0 < t; t--) {
        var n = Math.random() * t >> 0,
            r = e[t];
        e[t] = e[n], e[n] = r;
      }
    }, e.prototype._randomizeOffsets = function () {
      for (var e = 0; e < this._slices; e++) {
        this._offsets[e] = Math.random() * (Math.random() < .5 ? -1 : 1);
      }
    }, e.prototype.refresh = function () {
      this._randomizeSizes(), this._randomizeOffsets(), this.redraw();
    }, e.prototype.redraw = function () {
      var e,
          t = this.sampleSize,
          n = this.texture,
          r = this._canvas.getContext("2d");

      r.clearRect(0, 0, 8, t);

      for (var o = 0, i = 0; i < this._slices; i++) {
        e = Math.floor(256 * this._offsets[i]);
        var a = this._sizes[i] * t,
            l = 0 < e ? e : 0,
            s = e < 0 ? -e : 0;
        r.fillStyle = "rgba(" + l + ", " + s + ", 0, 1)", r.fillRect(0, o >> 0, t, 1 + a >> 0), o += a;
      }

      n.baseTexture.update(), this.uniforms.displacementMap = n;
    }, n.sizes.set = function (e) {
      for (var t = Math.min(this._slices, e.length), n = 0; n < t; n++) {
        this._sizes[n] = e[n];
      }
    }, n.sizes.get = function () {
      return this._sizes;
    }, n.offsets.set = function (e) {
      for (var t = Math.min(this._slices, e.length), n = 0; n < t; n++) {
        this._offsets[n] = e[n];
      }
    }, n.offsets.get = function () {
      return this._offsets;
    }, n.slices.get = function () {
      return this._slices;
    }, n.slices.set = function (e) {
      this._slices !== e && (this._slices = e, this.uniforms.slices = e, this._sizes = this.uniforms.slicesWidth = new Float32Array(e), this._offsets = this.uniforms.slicesOffset = new Float32Array(e), this.refresh());
    }, n.direction.get = function () {
      return this._direction;
    }, n.direction.set = function (e) {
      if (this._direction !== e) {
        var t = (this._direction = e) * d.DEG_TO_RAD;
        this.uniforms.sinDir = Math.sin(t), this.uniforms.cosDir = Math.cos(t);
      }
    }, n.red.get = function () {
      return this.uniforms.red;
    }, n.red.set = function (e) {
      this.uniforms.red = e;
    }, n.green.get = function () {
      return this.uniforms.green;
    }, n.green.set = function (e) {
      this.uniforms.green = e;
    }, n.blue.get = function () {
      return this.uniforms.blue;
    }, n.blue.set = function (e) {
      this.uniforms.blue = e;
    }, e.prototype.destroy = function () {
      this.texture.destroy(!0), this.texture = null, this._canvas = null, this.red = null, this.green = null, this.blue = null, this._sizes = null, this._offsets = null;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter);

  function A() {
    t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n");
  }

  function w(e) {
    n.call(this, r, "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n"), _extends(this, {
      gamma: 1,
      saturation: 1,
      contrast: 1,
      brightness: 1,
      red: 1,
      green: 1,
      blue: 1,
      alpha: 1
    }, e);
  }

  z.TRANSPARENT = 0, z.ORIGINAL = 1, z.LOOP = 2, z.CLAMP = 3, z.MIRROR = 4;

  var P = function (i) {
    function e(e, t, n, r, o) {
      void 0 === e && (e = 10), void 0 === t && (t = 4), void 0 === n && (n = 0), void 0 === r && (r = 16777215), void 0 === o && (o = .1), i.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nconst float PI = 3.14159265358979323846264;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n".replace(/%QUALITY_DIST%/gi, "" + (1 / o / e).toFixed(7)).replace(/%DIST%/gi, "" + e.toFixed(7))), this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]), this.distance = e, this.color = r, this.outerStrength = t, this.innerStrength = n;
    }

    i && (e.__proto__ = i), (e.prototype = Object.create(i && i.prototype)).constructor = e;
    var t = {
      color: {
        configurable: !0
      },
      distance: {
        configurable: !0
      },
      outerStrength: {
        configurable: !0
      },
      innerStrength: {
        configurable: !0
      }
    };
    return t.color.get = function () {
      return d.utils.rgb2hex(this.uniforms.glowColor);
    }, t.color.set = function (e) {
      d.utils.hex2rgb(e, this.uniforms.glowColor);
    }, t.distance.get = function () {
      return this.uniforms.distance;
    }, t.distance.set = function (e) {
      this.uniforms.distance = e;
    }, t.outerStrength.get = function () {
      return this.uniforms.outerStrength;
    }, t.outerStrength.set = function (e) {
      this.uniforms.outerStrength = e;
    }, t.innerStrength.get = function () {
      return this.uniforms.innerStrength;
    }, t.innerStrength.set = function (e) {
      this.uniforms.innerStrength = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      D = function (t) {
    function e(e) {
      t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\n}\n".replace("${perlin}", "vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n")), this.uniforms.dimensions = new Float32Array(2), "number" == typeof e && (console.warn("GodrayFilter now uses options instead of (angle, gain, lacunarity, time)"), e = {
        angle: e
      }, void 0 !== arguments[1] && (e.gain = arguments[1]), void 0 !== arguments[2] && (e.lacunarity = arguments[2]), void 0 !== arguments[3] && (e.time = arguments[3])), e = _extends({
        angle: 30,
        gain: .5,
        lacunarity: 2.5,
        time: 0,
        parallel: !0,
        center: [0, 0]
      }, e), this._angleLight = new d.Point(), this.angle = e.angle, this.gain = e.gain, this.lacunarity = e.lacunarity, this.parallel = e.parallel, this.center = e.center, this.time = e.time;
    }

    t && (e.__proto__ = t);
    var n = {
      angle: {
        configurable: !0
      },
      gain: {
        configurable: !0
      },
      lacunarity: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(t && t.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      var o = t.sourceFrame,
          i = o.width,
          a = o.height;
      this.uniforms.light = this.parallel ? this._angleLight : this.center, this.uniforms.parallel = this.parallel, this.uniforms.dimensions[0] = i, this.uniforms.dimensions[1] = a, this.uniforms.aspect = a / i, this.uniforms.time = this.time, e.applyFilter(this, t, n, r);
    }, n.angle.get = function () {
      return this._angle;
    }, n.angle.set = function (e) {
      var t = (this._angle = e) * d.DEG_TO_RAD;
      this._angleLight.x = Math.cos(t), this._angleLight.y = Math.sin(t);
    }, n.gain.get = function () {
      return this.uniforms.gain;
    }, n.gain.set = function (e) {
      this.uniforms.gain = e;
    }, n.lacunarity.get = function () {
      return this.uniforms.lacunarity;
    }, n.lacunarity.set = function (e) {
      this.uniforms.lacunarity = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      M = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = [0, 0]), void 0 === t && (t = 5), void 0 === n && (n = 0), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\n// Notice:\n// the perfect way:\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    vec2 velocity = uVelocity / filterArea.xy;\n    float offset = -uOffset / length(uVelocity) - 0.5;\n    int k = uKernelSize - 1;\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / float(k) + offset);\n        color += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor = color / float(uKernelSize);\n}\n"), this.uniforms.uVelocity = new Float32Array(2), this._velocity = new d.ObservablePoint(this.velocityChanged, this), this.velocity = e, this.kernelSize = t, this.offset = n;
    }

    r && (e.__proto__ = r);
    var t = {
      velocity: {
        configurable: !0
      },
      offset: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      var o = this.velocity,
          i = o.x,
          a = o.y;
      this.uniforms.uKernelSize = 0 !== i || 0 !== a ? this.kernelSize : 0, e.applyFilter(this, t, n, r);
    }, t.velocity.set = function (e) {
      Array.isArray(e) ? this._velocity.set(e[0], e[1]) : (e instanceof d.Point || e instanceof d.ObservablePoint) && this._velocity.copy(e);
    }, t.velocity.get = function () {
      return this._velocity;
    }, e.prototype.velocityChanged = function () {
      this.uniforms.uVelocity[0] = this._velocity.x, this.uniforms.uVelocity[1] = this._velocity.y;
    }, t.offset.set = function (e) {
      this.uniforms.uOffset = e;
    }, t.offset.get = function () {
      return this.uniforms.uOffset;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      O = function (r) {
    function e(e, t, n) {
      void 0 === t && (t = .05), void 0 === n && (n = null), n = n || e.length, r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n".replace(/%maxColors%/g, n)), this.epsilon = t, this._maxColors = n, this._replacements = null, this.uniforms.originalColors = new Float32Array(3 * n), this.uniforms.targetColors = new Float32Array(3 * n), this.replacements = e;
    }

    r && (e.__proto__ = r), (e.prototype = Object.create(r && r.prototype)).constructor = e;
    var t = {
      replacements: {
        configurable: !0
      },
      maxColors: {
        configurable: !0
      },
      epsilon: {
        configurable: !0
      }
    };
    return t.replacements.set = function (e) {
      var t = this.uniforms.originalColors,
          n = this.uniforms.targetColors,
          r = e.length;
      if (r > this._maxColors) throw "Length of replacements (" + r + ") exceeds the maximum colors length (" + this._maxColors + ")";
      t[3 * r] = -1;

      for (var o = 0; o < r; o++) {
        var i = e[o],
            a = i[0];
        "number" == typeof a ? a = d.utils.hex2rgb(a) : i[0] = d.utils.rgb2hex(a), t[3 * o] = a[0], t[3 * o + 1] = a[1], t[3 * o + 2] = a[2];
        var l = i[1];
        "number" == typeof l ? l = d.utils.hex2rgb(l) : i[1] = d.utils.rgb2hex(l), n[3 * o] = l[0], n[3 * o + 1] = l[1], n[3 * o + 2] = l[2];
      }

      this._replacements = e;
    }, t.replacements.get = function () {
      return this._replacements;
    }, e.prototype.refresh = function () {
      this.replacements = this._replacements;
    }, t.maxColors.get = function () {
      return this._maxColors;
    }, t.epsilon.set = function (e) {
      this.uniforms.epsilon = e;
    }, t.epsilon.get = function () {
      return this.uniforms.epsilon;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      j = function (n) {
    function e(e, t) {
      void 0 === t && (t = 0), n.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n"), this.uniforms.dimensions = new Float32Array(2), "number" == typeof e ? (this.seed = e, e = null) : this.seed = t, _extends(this, {
        sepia: .3,
        noise: .3,
        noiseSize: 1,
        scratch: .5,
        scratchDensity: .3,
        scratchWidth: 1,
        vignetting: .3,
        vignettingAlpha: 1,
        vignettingBlur: .3
      }, e);
    }

    n && (e.__proto__ = n);
    var t = {
      sepia: {
        configurable: !0
      },
      noise: {
        configurable: !0
      },
      noiseSize: {
        configurable: !0
      },
      scratch: {
        configurable: !0
      },
      scratchDensity: {
        configurable: !0
      },
      scratchWidth: {
        configurable: !0
      },
      vignetting: {
        configurable: !0
      },
      vignettingAlpha: {
        configurable: !0
      },
      vignettingBlur: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(n && n.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.dimensions[0] = t.sourceFrame.width, this.uniforms.dimensions[1] = t.sourceFrame.height, this.uniforms.seed = this.seed, e.applyFilter(this, t, n, r);
    }, t.sepia.set = function (e) {
      this.uniforms.sepia = e;
    }, t.sepia.get = function () {
      return this.uniforms.sepia;
    }, t.noise.set = function (e) {
      this.uniforms.noise = e;
    }, t.noise.get = function () {
      return this.uniforms.noise;
    }, t.noiseSize.set = function (e) {
      this.uniforms.noiseSize = e;
    }, t.noiseSize.get = function () {
      return this.uniforms.noiseSize;
    }, t.scratch.set = function (e) {
      this.uniforms.scratch = e;
    }, t.scratch.get = function () {
      return this.uniforms.scratch;
    }, t.scratchDensity.set = function (e) {
      this.uniforms.scratchDensity = e;
    }, t.scratchDensity.get = function () {
      return this.uniforms.scratchDensity;
    }, t.scratchWidth.set = function (e) {
      this.uniforms.scratchWidth = e;
    }, t.scratchWidth.get = function () {
      return this.uniforms.scratchWidth;
    }, t.vignetting.set = function (e) {
      this.uniforms.vignetting = e;
    }, t.vignetting.get = function () {
      return this.uniforms.vignetting;
    }, t.vignettingAlpha.set = function (e) {
      this.uniforms.vignettingAlpha = e;
    }, t.vignettingAlpha.get = function () {
      return this.uniforms.vignettingAlpha;
    }, t.vignettingBlur.set = function (e) {
      this.uniforms.vignettingBlur = e;
    }, t.vignettingBlur.get = function () {
      return this.uniforms.vignettingBlur;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      R = function (i) {
    function a(e, t, n) {
      void 0 === e && (e = 1), void 0 === t && (t = 0), void 0 === n && (n = .1);
      var r = Math.max(n * a.MAX_SAMPLES, a.MIN_SAMPLES),
          o = (2 * Math.PI / r).toFixed(7);
      i.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n".replace(/\$\{angleStep\}/, o)), this.uniforms.thickness = new Float32Array([0, 0]), this.thickness = e, this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]), this.color = t, this.quality = n;
    }

    i && (a.__proto__ = i);
    var e = {
      color: {
        configurable: !0
      }
    };
    return ((a.prototype = Object.create(i && i.prototype)).constructor = a).prototype.apply = function (e, t, n, r) {
      this.uniforms.thickness[0] = this.thickness / t.size.width, this.uniforms.thickness[1] = this.thickness / t.size.height, e.applyFilter(this, t, n, r);
    }, e.color.get = function () {
      return d.utils.rgb2hex(this.uniforms.outlineColor);
    }, e.color.set = function (e) {
      d.utils.hex2rgb(e, this.uniforms.outlineColor);
    }, Object.defineProperties(a.prototype, e), a;
  }(d.Filter);

  R.MIN_SAMPLES = 1, R.MAX_SAMPLES = 100;

  var L,
      k,
      I = function (t) {
    function e(e) {
      void 0 === e && (e = 10), t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n"), this.size = e;
    }

    t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e;
    var n = {
      size: {
        configurable: !0
      }
    };
    return n.size.get = function () {
      return this.uniforms.size;
    }, n.size.set = function (e) {
      "number" == typeof e && (e = [e, e]), this.uniforms.size = e;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      E = function (o) {
    function e(e, t, n, r) {
      void 0 === e && (e = 0), void 0 === t && (t = [0, 0]), void 0 === n && (n = 5), void 0 === r && (r = -1), o.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    float aspect = filterArea.y / filterArea.x;\n    vec2 center = uCenter.xy / filterArea.xy;\n    float gradient = uRadius / filterArea.x * 0.3;\n    float radius = uRadius / filterArea.x - gradient * 0.5;\n    int k = uKernelSize - 1;\n\n    vec2 coord = vTextureCoord;\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep = uRadian;\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            gl_FragColor = color;\n            return;\n        }\n        radianStep *= scale;\n    }\n    radianStep /= float(k);\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample;\n    }\n\n    gl_FragColor = color / float(uKernelSize);\n}\n"), this._angle = 0, this.angle = e, this.center = t, this.kernelSize = n, this.radius = r;
    }

    o && (e.__proto__ = o);
    var t = {
      angle: {
        configurable: !0
      },
      center: {
        configurable: !0
      },
      radius: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(o && o.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.uKernelSize = 0 !== this._angle ? this.kernelSize : 0, e.applyFilter(this, t, n, r);
    }, t.angle.set = function (e) {
      this._angle = e, this.uniforms.uRadian = e * Math.PI / 180;
    }, t.angle.get = function () {
      return this._angle;
    }, t.center.get = function () {
      return this.uniforms.uCenter;
    }, t.center.set = function (e) {
      this.uniforms.uCenter = e;
    }, t.radius.get = function () {
      return this.uniforms.uRadius;
    }, t.radius.set = function (e) {
      (e < 0 || e === 1 / 0) && (e = -1), this.uniforms.uRadius = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      V = function (t) {
    function e(e) {
      t.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n"), this.uniforms.amplitude = new Float32Array(2), this.uniforms.waveLength = new Float32Array(2), this.uniforms.alpha = new Float32Array(2), this.uniforms.dimensions = new Float32Array(2), _extends(this, {
        mirror: !0,
        boundary: .5,
        amplitude: [0, 20],
        waveLength: [30, 100],
        alpha: [1, 1],
        time: 0
      }, e);
    }

    t && (e.__proto__ = t);
    var n = {
      mirror: {
        configurable: !0
      },
      boundary: {
        configurable: !0
      },
      amplitude: {
        configurable: !0
      },
      waveLength: {
        configurable: !0
      },
      alpha: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(t && t.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.dimensions[0] = t.sourceFrame.width, this.uniforms.dimensions[1] = t.sourceFrame.height, this.uniforms.time = this.time, e.applyFilter(this, t, n, r);
    }, n.mirror.set = function (e) {
      this.uniforms.mirror = e;
    }, n.mirror.get = function () {
      return this.uniforms.mirror;
    }, n.boundary.set = function (e) {
      this.uniforms.boundary = e;
    }, n.boundary.get = function () {
      return this.uniforms.boundary;
    }, n.amplitude.set = function (e) {
      this.uniforms.amplitude[0] = e[0], this.uniforms.amplitude[1] = e[1];
    }, n.amplitude.get = function () {
      return this.uniforms.amplitude;
    }, n.waveLength.set = function (e) {
      this.uniforms.waveLength[0] = e[0], this.uniforms.waveLength[1] = e[1];
    }, n.waveLength.get = function () {
      return this.uniforms.waveLength;
    }, n.alpha.set = function (e) {
      this.uniforms.alpha[0] = e[0], this.uniforms.alpha[1] = e[1];
    }, n.alpha.get = function () {
      return this.uniforms.alpha;
    }, Object.defineProperties(e.prototype, n), e;
  }(d.Filter),
      B = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = [-10, 0]), void 0 === t && (t = [0, 10]), void 0 === n && (n = [0, 0]), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n"), this.red = e, this.green = t, this.blue = n;
    }

    r && (e.__proto__ = r), (e.prototype = Object.create(r && r.prototype)).constructor = e;
    var t = {
      red: {
        configurable: !0
      },
      green: {
        configurable: !0
      },
      blue: {
        configurable: !0
      }
    };
    return t.red.get = function () {
      return this.uniforms.red;
    }, t.red.set = function (e) {
      this.uniforms.red = e;
    }, t.green.get = function () {
      return this.uniforms.green;
    }, t.green.set = function (e) {
      this.uniforms.green = e;
    }, t.blue.get = function () {
      return this.uniforms.blue;
    }, t.blue.set = function (e) {
      this.uniforms.blue = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      X = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = [0, 0]), void 0 === t && (t = {}), void 0 === n && (n = 0), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n"), this.center = e, Array.isArray(t) && (console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."), t = {}), t = _extends({
        amplitude: 30,
        wavelength: 160,
        brightness: 1,
        speed: 500,
        radius: -1
      }, t), this.amplitude = t.amplitude, this.wavelength = t.wavelength, this.brightness = t.brightness, this.speed = t.speed, this.radius = t.radius, this.time = n;
    }

    r && (e.__proto__ = r);
    var t = {
      center: {
        configurable: !0
      },
      amplitude: {
        configurable: !0
      },
      wavelength: {
        configurable: !0
      },
      brightness: {
        configurable: !0
      },
      speed: {
        configurable: !0
      },
      radius: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.time = this.time, e.applyFilter(this, t, n, r);
    }, t.center.get = function () {
      return this.uniforms.center;
    }, t.center.set = function (e) {
      this.uniforms.center = e;
    }, t.amplitude.get = function () {
      return this.uniforms.amplitude;
    }, t.amplitude.set = function (e) {
      this.uniforms.amplitude = e;
    }, t.wavelength.get = function () {
      return this.uniforms.wavelength;
    }, t.wavelength.set = function (e) {
      this.uniforms.wavelength = e;
    }, t.brightness.get = function () {
      return this.uniforms.brightness;
    }, t.brightness.set = function (e) {
      this.uniforms.brightness = e;
    }, t.speed.get = function () {
      return this.uniforms.speed;
    }, t.speed.set = function (e) {
      this.uniforms.speed = e;
    }, t.radius.get = function () {
      return this.uniforms.radius;
    }, t.radius.set = function (e) {
      this.uniforms.radius = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      q = function (r) {
    function e(e, t, n) {
      void 0 === t && (t = 0), void 0 === n && (n = 1), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n"), this.uniforms.dimensions = new Float32Array(2), this.uniforms.ambientColor = new Float32Array([0, 0, 0, n]), this.texture = e, this.color = t;
    }

    r && (e.__proto__ = r);
    var t = {
      texture: {
        configurable: !0
      },
      color: {
        configurable: !0
      },
      alpha: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(r && r.prototype)).constructor = e).prototype.apply = function (e, t, n, r) {
      this.uniforms.dimensions[0] = t.sourceFrame.width, this.uniforms.dimensions[1] = t.sourceFrame.height, e.applyFilter(this, t, n, r);
    }, t.texture.get = function () {
      return this.uniforms.uLightmap;
    }, t.texture.set = function (e) {
      this.uniforms.uLightmap = e;
    }, t.color.set = function (e) {
      var t = this.uniforms.ambientColor;
      "number" == typeof e ? (d.utils.hex2rgb(e, t), this._color = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], this._color = d.utils.rgb2hex(t));
    }, t.color.get = function () {
      return this._color;
    }, t.alpha.get = function () {
      return this.uniforms.ambientColor[3];
    }, t.alpha.set = function (e) {
      this.uniforms.ambientColor[3] = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      N = function (o) {
    function e(e, t, n, r) {
      void 0 === e && (e = 100), void 0 === t && (t = 600), void 0 === n && (n = null), void 0 === r && (r = null), o.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n"), this.uniforms.blur = e, this.uniforms.gradientBlur = t, this.uniforms.start = n || new d.Point(0, window.innerHeight / 2), this.uniforms.end = r || new d.Point(600, window.innerHeight / 2), this.uniforms.delta = new d.Point(30, 30), this.uniforms.texSize = new d.Point(window.innerWidth, window.innerHeight), this.updateDelta();
    }

    o && (e.__proto__ = o);
    var t = {
      blur: {
        configurable: !0
      },
      gradientBlur: {
        configurable: !0
      },
      start: {
        configurable: !0
      },
      end: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(o && o.prototype)).constructor = e).prototype.updateDelta = function () {
      this.uniforms.delta.x = 0, this.uniforms.delta.y = 0;
    }, t.blur.get = function () {
      return this.uniforms.blur;
    }, t.blur.set = function (e) {
      this.uniforms.blur = e;
    }, t.gradientBlur.get = function () {
      return this.uniforms.gradientBlur;
    }, t.gradientBlur.set = function (e) {
      this.uniforms.gradientBlur = e;
    }, t.start.get = function () {
      return this.uniforms.start;
    }, t.start.set = function (e) {
      this.uniforms.start = e, this.updateDelta();
    }, t.end.get = function () {
      return this.uniforms.end;
    }, t.end.set = function (e) {
      this.uniforms.end = e, this.updateDelta();
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      W = ((k = N) && (Z.__proto__ = k), ((Z.prototype = Object.create(k && k.prototype)).constructor = Z).prototype.updateDelta = function () {
    var e = this.uniforms.end.x - this.uniforms.start.x,
        t = this.uniforms.end.y - this.uniforms.start.y,
        n = Math.sqrt(e * e + t * t);
    this.uniforms.delta.x = e / n, this.uniforms.delta.y = t / n;
  }, Z),
      G = ((L = N) && (U.__proto__ = L), ((U.prototype = Object.create(L && L.prototype)).constructor = U).prototype.updateDelta = function () {
    var e = this.uniforms.end.x - this.uniforms.start.x,
        t = this.uniforms.end.y - this.uniforms.start.y,
        n = Math.sqrt(e * e + t * t);
    this.uniforms.delta.x = -t / n, this.uniforms.delta.y = e / n;
  }, U),
      K = function (o) {
    function e(e, t, n, r) {
      void 0 === e && (e = 100), void 0 === t && (t = 600), void 0 === n && (n = null), void 0 === r && (r = null), o.call(this), this.tiltShiftXFilter = new W(e, t, n, r), this.tiltShiftYFilter = new G(e, t, n, r);
    }

    o && (e.__proto__ = o);
    var t = {
      blur: {
        configurable: !0
      },
      gradientBlur: {
        configurable: !0
      },
      start: {
        configurable: !0
      },
      end: {
        configurable: !0
      }
    };
    return ((e.prototype = Object.create(o && o.prototype)).constructor = e).prototype.apply = function (e, t, n) {
      var r = e.getRenderTarget(!0);
      this.tiltShiftXFilter.apply(e, t, r), this.tiltShiftYFilter.apply(e, r, n), e.returnRenderTarget(r);
    }, t.blur.get = function () {
      return this.tiltShiftXFilter.blur;
    }, t.blur.set = function (e) {
      this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = e;
    }, t.gradientBlur.get = function () {
      return this.tiltShiftXFilter.gradientBlur;
    }, t.gradientBlur.set = function (e) {
      this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = e;
    }, t.start.get = function () {
      return this.tiltShiftXFilter.start;
    }, t.start.set = function (e) {
      this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = e;
    }, t.end.get = function () {
      return this.tiltShiftXFilter.end;
    }, t.end.set = function (e) {
      this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      Y = function (r) {
    function e(e, t, n) {
      void 0 === e && (e = 200), void 0 === t && (t = 4), void 0 === n && (n = 20), r.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n"), this.radius = e, this.angle = t, this.padding = n;
    }

    r && (e.__proto__ = r), (e.prototype = Object.create(r && r.prototype)).constructor = e;
    var t = {
      offset: {
        configurable: !0
      },
      radius: {
        configurable: !0
      },
      angle: {
        configurable: !0
      }
    };
    return t.offset.get = function () {
      return this.uniforms.offset;
    }, t.offset.set = function (e) {
      this.uniforms.offset = e;
    }, t.radius.get = function () {
      return this.uniforms.radius;
    }, t.radius.set = function (e) {
      this.uniforms.radius = e;
    }, t.angle.get = function () {
      return this.uniforms.angle;
    }, t.angle.set = function (e) {
      this.uniforms.angle = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter),
      Q = function (o) {
    function e(e, t, n, r) {
      void 0 === e && (e = .1), void 0 === t && (t = [0, 0]), void 0 === n && (n = 0), void 0 === r && (r = -1), o.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\n// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand(vec2 co, float seed) {\n    const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);\n    return fract(sin(sn) * c + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = rand(vTextureCoord, 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    // color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n"), this.center = t, this.strength = e, this.innerRadius = n, this.radius = r;
    }

    o && (e.__proto__ = o), (e.prototype = Object.create(o && o.prototype)).constructor = e;
    var t = {
      center: {
        configurable: !0
      },
      strength: {
        configurable: !0
      },
      innerRadius: {
        configurable: !0
      },
      radius: {
        configurable: !0
      }
    };
    return t.center.get = function () {
      return this.uniforms.uCenter;
    }, t.center.set = function (e) {
      this.uniforms.uCenter = e;
    }, t.strength.get = function () {
      return this.uniforms.uStrength;
    }, t.strength.set = function (e) {
      this.uniforms.uStrength = e;
    }, t.innerRadius.get = function () {
      return this.uniforms.uInnerRadius;
    }, t.innerRadius.set = function (e) {
      this.uniforms.uInnerRadius = e;
    }, t.radius.get = function () {
      return this.uniforms.uRadius;
    }, t.radius.set = function (e) {
      (e < 0 || e === 1 / 0) && (e = -1), this.uniforms.uRadius = e;
    }, Object.defineProperties(e.prototype, t), e;
  }(d.Filter);

  function U() {
    L.apply(this, arguments);
  }

  function Z() {
    k.apply(this, arguments);
  }

  return e.AdjustmentFilter = o, e.AdvancedBloomFilter = i, e.AsciiFilter = a, e.BevelFilter = u, e.BloomFilter = g, e.BulgePinchFilter = v, e.ColorMapFilter = x, e.ColorReplaceFilter = y, e.ConvolutionFilter = b, e.CrossHatchFilter = _, e.CRTFilter = C, e.DotFilter = S, e.DropShadowFilter = T, e.EmbossFilter = F, e.GlitchFilter = z, e.GlowFilter = P, e.GodrayFilter = D, e.KawaseBlurFilter = h, e.MotionBlurFilter = M, e.MultiColorReplaceFilter = O, e.OldFilmFilter = j, e.OutlineFilter = R, e.PixelateFilter = I, e.RadialBlurFilter = E, e.ReflectionFilter = V, e.RGBSplitFilter = B, e.ShockwaveFilter = X, e.SimpleLightmapFilter = q, e.TiltShiftFilter = K, e.TiltShiftAxisFilter = N, e.TiltShiftXFilter = W, e.TiltShiftYFilter = G, e.TwistFilter = Y, e.ZoomBlurFilter = Q, e;
}({}, PIXI);

_extends(PIXI.filters, __filters);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9waXhpLWZpbHRlcnMuanMiXSwibmFtZXMiOlsiX19maWx0ZXJzIiwidCIsIm8iLCJGaWx0ZXIiLCJfX3Byb3RvX18iLCJlIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJhcHBseSIsIm4iLCJyIiwidGhpcyIsInVuaWZvcm1zIiwiZ2FtbWEiLCJNYXRoIiwic2F0dXJhdGlvbiIsImNvbnRyYXN0IiwiYnJpZ2h0bmVzcyIsInJlZCIsImdyZWVuIiwiYXBwbHlGaWx0ZXIiLCJ1T2Zmc2V0IiwiRmxvYXQzMkFycmF5IiwiX3BpeGVsU2l6ZSIsIlBvaW50IiwicGl4ZWxTaXplIiwiX2NsYW1wIiwiX2tlcm5lbHMiLCJBcnJheSIsImlzQXJyYXkiLCJrZXJuZWxzIiwicXVhbGl0eSIsImNvbmZpZ3VyYWJsZSIsImNsYW1wIiwiYmx1ciIsIngiLCJzaXplIiwid2lkdGgiLCJsIiwieSIsImhlaWdodCIsIl9xdWFsaXR5IiwiX2JsdXIiLCJpIiwicyIsImEiLCJnZXRSZW5kZXJUYXJnZXQiLCJ1IiwiYyIsImgiLCJmIiwicmV0dXJuUmVuZGVyVGFyZ2V0IiwiX2dlbmVyYXRlS2VybmVscyIsInB1c2giLCJnZXQiLCJsZW5ndGgiLCJtYXgiLCJzZXQiLCJyb3VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztXQU9JQSxTLENBQUFBLG1CLEVBQXFCQyxDQUFBQSxhQUFBQSxDLEVBQXNCLFVBQUEsQ0FBQSxFQUFBO0FBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFVBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBOztBQUFBLGFBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxFQUFBO0FBQUEsT0FBQSxFQUFBO0FBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxFQUFBO0FBQUEsT0FBQSxDQUFBLEVBQW85QkMsQ0FBQUEsR0FBQUEsQ0FBcDlCLENBQUEsRUFBOGhERCxDQUFBQSxDQUFFRSxNQUFGRixDQUFFRSxDQUFBQSxJQUFsYkYsQ0FBQUEsQ0FBRUcsTUFBRkgsR0FBRUcsQ0FBOGFILEVBQTlhRyxDQUE4YUgsRUFBcGFJO0FBQUFBLFFBQUFBLENBQUFBLEVBQUFBLENBQUFBO0FBQUdKLFFBQUFBLENBQUVLLEVBQUFBO0FBQUxELE9BQW9hSixDQUE5aEQsRUFBK25DSyxDQUFBQSxJQUFBQSxDQUFBQSxHQUFVQyxDQUFWRCxHQUFVQyxDQUFBQSxHQUFBQSxDQUFWRCxDQUFBQSxHQUFpQkUsQ0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsS0FBT0gsQ0FBQUEsR0FBQUEsQ0FBUEcsQ0FBakJGLEtBQTZCQSxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxNQUFBQSxFQUF1QkcsQ0FBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBWVIsQ0FBWlEsRUFBZ0JILENBQWhCRyxFQUFnQkgsQ0FBaEJHLEVBQWdCSCxDQUFoQkcsRUFBZ0JILENBQWhCRyxFQUFnQkgsQ0FBaEJHLENBQXZCSCxFQUFpREksQ0FBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBTSxDQUFOQSxFQUFNLENBQU5BLEVBQU0sQ0FBTkEsRUFBTSxDQUFOQSxFQUFlTCxDQUFmSyxFQUFpQlQsQ0FBakJTLEVBQW1CQyxDQUFuQkQsRUFBcUJFLENBQXJCRixFQUFxQkUsQ0FBR0MsR0FBQUEsQ0FBSEQsSUFBR0MsQ0FBS0MsQ0FBQUEsTUFBTEQsR0FBS0MsQ0FBUkYsQ0FBckJGLENBQTlFSixDQUEvbkMsRUFBbXZDUyxDQUFudkM7QUFBeXZDQzs7QUFBQUEsYUFBU0gsQ0FBVEcsQ0FBU0gsQ0FBVEcsRUFBU0g7QUFBS0UsVUFBQUEsQ0FBQUEsR0FBTSxLQUFBLE1BQUEsQ0FBV0QsQ0FBQUEsR0FBQUEsS0FBQUEsQ0FBQUEsR0FBU0csQ0FBcEIsS0FBb0JBLEtBQUFBLE1BQUFBLENBQWdCQSxLQUFBQSxDQUFBQSxHQUFBQSxDQUFoQkEsQ0FBMUJGO0FBQXFERixhQUFLQyxDQUFBQSxDQUFBQSxFQUFBQSxHQUFBQSxDQUFBQSxLQUFTSSxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxDQUFUSixHQUFrQkQsQ0FBQUEsQ0FBQUEsQ0FBQUEsR0FBQUEsQ0FBS0ssQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBQUEsQ0FBTEwsSUFBS0ssQ0FBQUEsQ0FBU0wsRUFBZEEsR0FBY0EsQ0FBQUEsQ0FBS0MsRUFBMUNEO0FBQTBDQzs7QUFBQUEsYUFBU0ssQ0FBVEwsQ0FBU0ssQ0FBVEwsRUFBU0ssQ0FBVEwsRUFBU0ssQ0FBVEwsRUFBb0JEO0FBQUFBLFdBQUtNLFFBQUxOLEdBQUtNLENBQVdOLENBQWhCQSxFQUFnQkEsQ0FBQUEsS0FBS0MsRUFBTEQsR0FBS0MsQ0FBTEQsTUFBY08sQ0FBQUEsQ0FBSVAsR0FBSk8sQ0FBSVAsQ0FBSk8sSUFBU0EsSUFBdkJQLENBQWhCQSxFQUEyQ0EsS0FBS0MsUUFBTEQsR0FBY1EsQ0FBekRSLEVBQStEQSxLQUFLUSxPQUFMUixDQUFXQSxDQUFYQSxFQUFXQSxDQUFYQSxDQUEvREE7QUFBK0VDOztBQUFBQSxRQUFBQSxDQUFBQSxHQUFBQSxnREFBQUE7QUFBQUEsUUFBeURRLENBQUFBLEdBQUFBLGtEQUF6RFI7QUFBQUEsUUFBK3ZESCxDQUFBQSxHQUFFQywrQkFBandERTtBQUFBQSxRQUFpeURGLENBQUFBLEdBQUFBLFVBQWp5REU7QUFBQUEsUUFBdXlELENBQUcsR0FBenNESCw0Q0FBakdHO0FBQUFBLFFBQWlHSCxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxTQUFBQSxHQUFBQSxJQUFBQSxDQUFBQSxFQUFqR0c7QUFBaUdILFdBQUFBLENBQUFBLENBQUFBLFdBQUFBLEdBQUFBLENBQUFBLEVBQUFBLENBQUFBLENBQUFBLE9BQUFBLEdBQUFBLFVBQUFBLENBQUFBLEVBQUFBLENBQUFBLEVBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBLEdBQUFBLENBQUFBLENBQUFBLEdBQUFBLENBQUFBLElBQUFBLFNBQUFBLEVBQUFBLEtBQUFBLENBQUFBLENBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBLEdBQUFBLENBQUFBO0FBQUFBLFVBQUFBLENBQUFBLEdBQUFBLEVBQUFBO0FBQUFBLFVBQUFBLENBQUFBLEdBQUFBLENBQUFBLENBQUFBLEdBQUFBLENBQUFBLElBQUFBLEVBQUFBLEVBQUFBLFNBQUFBLElBQUFBLENBQUFBLEVBQUFBLEtBQUFBLElBQUFBLEdBQUFBLENBQUFBLEVBQUFBLEtBQUFBLE1BQUFBLEdBQUFBLEVBQUFBLEVBQUFBLEtBQUFBLE1BQUFBLEdBQUFBLENBQUFBLEVBQUFBLEtBQUFBLElBQUFBLEdBQUFBLENBQUFBLElBQUFBLENBQUFBLEVBQUFBLENBQUFBLENBQUFBLENBQUFBLElBQUFBLENBQUFBLENBQUFBLEtBQUFBLENBQUFBLENBQUFBLEtBQUFBLENBQUFBLENBQUFBLE9BQUFBLENBQUFBLEdBQUFBLENBQUFBLElBQUFBLENBQUFBLENBQUFBLEtBQUFBLENBQUFBLENBQUFBLE9BQUFBLENBQXl1QixHQUF6dUJBLENBQUFBLE1BQXl1QixDQUFBLEdBQUEsVUFBQSxDQUFBLEVBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsT0FBQSxDQUFBLENBQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUFBLGNBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBLGlCQUFBLENBQUEsR0FBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsU0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBLEtBQUEsRUFBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxjQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsS0FBQSxJQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsUUFBQSxDQUFBLEVBQUEsUUFBQSxDQUFBLElBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLEtBQUE7QUFBQSxnQkFBQSxRQUFBLENBQUEsSUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLENBQUE7QUFBQSxvQkFBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxLQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBO0FBQUE7QUFBQTs7QUFBQSxlQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUFBLENBQUEsQ0FBQSxDQUF6dUJBLENBQUFBLEVBQXl1QixPQUFBLENBQUEsR0FBQSxDQUFBLENBQXJ1QixNQUFxdUIsQ0FBenVCQSxFQUFJLENBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFKQSxLQUFJLElBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxNQUFBLENBQUE7O0FBQUEsV0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxRQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFBQSxZQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsS0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsY0FBQSxDQUFBO0FBQUEsY0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUE7QUFBQSxjQUFBLENBQUEsR0FBQSxZQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQTs7QUFBQSxpQkFBQSxDQUFBO0FBQUEsU0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxJQUFBLENBQUE7QUFBQTtBQUFBLE9BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxHQUFBO0FBQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQTtBQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBO0FBQUEsU0FBQSxFQUFBLENBQUEsR0FBQTtBQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUE7QUFBQSxVQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQUFBLFNBQUEsRUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxLQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxLQUFBLElBQUEsSUFBNnVERSxJQUFLQyxDQUFsdkQsSUFBa3ZEQSxJQUFBQSxJQUFTUyxDQUFBQSxHQUFUVCxDQUFTUyxDQUFBQSxDQUFBQSxFQUFBQSxHQUFRLENBQUEsQ0FBSUMsRUFBWkQsR0FBWUMsQ0FBQUEsQ0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsR0FBYSxDQUFBLENBQUEsQ0FBR1gsR0FBQUEsQ0FBSCxDQUFBLENBQUdBLEVBQXJDQyxDQUFsdkQsS0FBNHhEVyxLQUFBQSxJQUFBQSxHQUFleEIsQ0FBQUEsQ0FBM3lELENBQUEsRUFBNnlEeUIsQ0FBQUEsQ0FBQUEsRUFBQUEsR0FBTWIsQ0FBTmEsS0FBV0MsQ0FBQUEsQ0FBQUEsRUFBQUEsR0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsSUFBWWQsQ0FBQUEsQ0FBQUEsRUFBQUEsR0FBS2UsSUFBTGYsRUFBS2UsQ0FBTzFCLEtBQUVXLENBQUFBLEdBQUFBLENBQVRlLEtBQWNDLENBQUFBLENBQUFBLENBQUFBLElBQUFBLElBQUFBLEVBQVMsQ0FBQSxHQUFLQyxJQUFBQSxDQUFBQSxHQUFBQSxDQUFNQyxDQUFORCxFQUFNQyxJQUFORCxDQUFkRCxFQUErQmhCLEtBQUttQixJQUFMbkIsR0FBS21CLENBQUFBLENBQWxESixDQUFqQkQsQ0FBWEQsQ0FBN3lELEtBQXM0RGIsQ0FBQUEsQ0FBQUEsTUFBQUEsQ0FBV0YsQ0FBQUEsRUFBWEUsRUFBYUEsQ0FBYkEsR0FBa0JvQixDQUFBQSxFQUF4NUQsQ0FBQTtBQUFBOztBQUF3NURBLFVBQVFyQixDQUFBQSxHQUFBQSxJQUFHUCxDQUFITyxHQUFHUCxDQUFITyxHQUFPRCxDQUFQQyxFQUFTUixDQUFBQSxHQUFBQSxLQUFBQSxLQUFVQyxDQUFWRCxHQUFpRixDQUFqRkEsQ0FBVFEsRUFBMEYsQ0FBSUEsR0FBQUEsQ0FBRSxDQUFDb0IsQ0FBQUEsR0FBQUEsQ0FBRCxDQUFoR3BCLEVBQWlHb0IsS0FBU0UsSUFBbEhELEVBQWtIQztBQUFBQSxhQUFBQSxDQUFBQSxHQUFBQSxDQUFBQSxFQUFhLENBQUEsR0FBSUMsQ0FBakJELEVBQWlCQyxDQUFBQSxFQUFqQkQ7QUFBdUIsVUFBQSxDQUFDQSxHQUFBQSxDQUFBQSxHQUFBQSxDQUFELEVBQUNBLENBQUFBLENBQUFBLEVBQUFBLEdBQUFBLENBQUFBLEtBQWEsQ0FBQSxHQUFBLENBQUlQLENBQUFBLEVBQUFBLENBQUFBLENBQWpCTyxDQUFELEVBQWtCUCxDQUFBQSxHQUFBQSxDQUFVLENBQUNPLENBQVhQLEdBQVdPLENBQUFBLENBQUFBLEdBQUFBLENBQUFBLENBQUFBLENBQUFBLElBQUFBLENBQUFBLENBQUFBLEVBQUFBLEdBQWEsQ0FBQSxDQUFJRCxFQUE5QyxFQUE4Q0EsS0FBUSxNQUFSQSxDQUFTQyxDQUFURCxJQUFTQztBQUFBQSxZQUFBQSxDQUFBQSxFQUFBQSxDQUFBQTtBQUFhLFlBQUEsRUFBQSxFQUFJRSxDQUFqQkY7QUFBaUJFLFlBQUFBLENBQUFBLEVBQUFBLENBQWpCRjtBQUF1QkEsWUFBQUEsRUFBQUEsRUFBQUEsQ0FBdkJBO0FBQXVCQSxZQUFBQSxFQUFBQSxFQUFBQTtBQUF2QkEsV0FBdkQsRUFBOEVBLENBQUFBLEtBQWEsS0FBdE12QixNQUFzTSxDQUF0TUEsQ0FBRUwsR0FBQUEsQ0FBb00sRUFBcE1BLEVBQW9NLEdBQXBNQSxDQUFBQSxHQUFBQSxLQUFVQyxNQUFWRCxDQUFpQkUsQ0FBQUEsR0FBQUEsQ0FBakJGLEVBQXdCRCxDQUErSjZCLENBQTlFO0FBQXZCQTs7QUFBckQ1QixhQUFBQSxNQUFBQSxDQUF1QkcsQ0FBQUEsR0FBQUEsQ0FBdkJILEVBQXVCRyxFQUF2QkgsR0FBdUJHLENBQUFBLENBQUFBLENBQUFBLENBQVlFLE1BQVpGLEdBQThKSCxDQUE5SkcsQ0FBQUEsQ0FBOEpILENBQTlKRyxHQUE4SkgsQ0FBckxBO0FBQStMSSxPQUE1UHVCLE1BQTRQdkI7QUFBTSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBU0wsR0FBQUEsQ0FBVCxFQUFXSixDQUFFVSxFQUFiO0FBQWVDLFVBQUFBLENBQUFBLENBQUcsRUFBSEEsR0FBRyxDQUFJVixHQUFBQSxDQUFQVSxLQUFXQyxDQUFBQSxHQUFBQSxDQUFBQSxDQUFLYyxFQUFBQSxDQUFMZCxDQUFYRCxHQUFnQmUsS0FBVVUsTUFBVlYsQ0FBY1csQ0FBZFgsSUFBbUJZLENBQW5DM0I7QUFBZjs7QUFBa0QyQixRQUFBQSxDQUFBQSxHQUFNQyxDQUFBQSxDQUFFM0IsTUFBRjJCLEdBQU9iLENBQWJZLEtBQWFaLEtBQVVjLE1BQVZkLENBQWNXLENBQUtJLEdBQUFBLENBQW5CZixJQUFtQmUsQ0FBQUEsQ0FBQUEsQ0FBTyxDQUFBLE1BQVBBLEdBQWM3QixDQUFkNkIsQ0FBaENIO0FBQW1ESTs7QUFBQUEsYUFBQUEsS0FBVSxRQUFWQSxHQUFtQkMsTUFBTTFDLENBQUFBLENBQUVXLENBQUFBLENBQUFBLE1BQUFBLEdBQUtnQixDQUFQM0IsQ0FBQUEsQ0FBTzJCLENBQWJlLElBQXNCLE1BQUcsQ0FBRy9CLENBQUFBLENBQUFBLENBQUgsQ0FBR0EsQ0FBL0M4QixFQUFvRDdCLElBQXBENkI7QUFBb0Q3QixLQUF2ekVILEVBQXV6RUcsQ0FBQUEsQ0FBU1MsUUFBVFQsR0FBaUIsQ0FBeDBFSCxFQUEyMEVULENBQUFBLENBQUUyQyxVQUFGM0MsR0FBU1ksVUFBU1MsQ0FBVFQsRUFBU1M7QUFBQUEsYUFBYWlCLENBQUVuQyxDQUFBQSxVQUFGbUMsQ0FBSWxCLElBQUprQixFQUFnQjNCLENBQWhCMkIsQ0FBYmpCO0FBQWtDdEIsS0FBLzNFVSxFQUFpNEVBLENBQUFBLENBQUVDLE1BQUZELEdBQVMsVUFBU21DLENBQVQsRUFBV0MsQ0FBWCxFQUFhMUMsQ0FBYixFQUFlMkM7QUFBQUEsYUFBQUEsSUFBQUEsQ0FBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsQ0FBQUEsRUFBZ0IsQ0FBaEJBLENBQUFBO0FBQW9CQyxLQUE3NkV0QyxFQUErNkVWLENBQUFBLENBQUVpRCxPQUFGakQsR0FBUVksT0FBdjdFRixFQUE0N0VnQyxDQUFBQSxDQUFBQSxjQUFBQSxHQUFtQlEsQ0FBLzhFeEMsRUFBbTlFVCxDQUFFVyxDQUFBQSxHQUFGWCxHQUFPMkIsVUFBU3NCLENBQVR0QixFQUFTc0I7QUFBRyxhQUFHdEMsQ0FBS0MsQ0FBQUEsR0FBTEQsQ0FBS0MsQ0FBTEQsQ0FBSDtBQUFRQyxLQUE5K0VILEVBQXUvRVksQ0FBQUEsQ0FBQUEsVUFBQUEsR0FBYXNCLFVBQU8vQixDQUFQK0IsRUFBTy9CLENBQVArQixFQUFPL0I7QUFBQUEsVUFBU1MsQ0FBVFQ7QUFBQUEsVUFBU1MsQ0FBVFQ7QUFBQUEsVUFBU1MsQ0FBVFQ7QUFBQUEsVUFBaUIsQ0FBakJBO0FBQUFBLFVBQWlCLENBQWpCQTtBQUFBQSxVQUFvQlosQ0FBcEJZO0FBQUFBLFVBQXNCMEIsQ0FBdEIxQjtBQUFBQSxVQUF3QlQsQ0FBeEJTO0FBQUFBLFVBQTBCUSxDQUExQlI7QUFBQUEsVUFBMEJRLENBQTFCUjtBQUFBQSxVQUEwQlEsQ0FBQUEsR0FBQUEsR0FBMUJSO0FBQUFBLFVBQTBCUSxDQUFZVCxHQUFBQSxDQUFBQSxDQUFBQSxHQUFBQSxDQUFLb0MsSUFBRUMsRUFBUHJDLEVBQVMsS0FBVEEsSUFBaUJvQyxHQUF2RG5DO0FBQUFBLFVBQTJEb0MsQ0FBRUosR0FBQUEsQ0FBRTVDLENBQUFBLE1BQUY0QyxJQUFTakIsR0FBdEVmO0FBQUFBLFVBQXNFZSxDQUFBQSxHQUFBQSxDQUFTdUIsQ0FBQUEsQ0FBVHZCLElBQVksQ0FBbEZmO0FBQUFBLFVBQXFGRCxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxDQUFLQyxDQUFMRCxJQUFLQyxDQUFMRCxJQUFLQyxDQUExRkE7QUFBQUEsVUFBMEZBLENBQVNTLEdBQUFBLENBQUFBLENBQUFBLElBQW5HVDs7QUFBMkcsVUFBR1osQ0FBQUEsQ0FBRTJDLE1BQUYzQyxLQUFTWSxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxFQUFBQSxDQUFBQSxHQUFTUyxDQUFsQnJCLEdBQWtCcUIsQ0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBUSxRQUFSQSxHQUFpQkQsQ0FBakJDLEdBQWlCRCxDQUFBQSxDQUFBQSxHQUFBQSxDQUFBQSxDQUFBQSxLQUFZVCxPQUFPRixDQUFBQSxHQUFQRSxDQUFZUixpQkFBWlEsRUFBY3dDLENBQWR4QyxDQUE3QlUsRUFBOER3QixTQUFuRixFQUEwRnpDO0FBQUFBLGFBQUFBLENBQVVnRCxHQUFBQSxFQUFWaEQsRUFBVWdELENBQUFBLEdBQUFBLENBQUFBLENBQUFBLFNBQUFBLENBQWlCLE1BQTNCaEQsRUFBMkIsQ0FBQSxHQUFBLENBQTNCQSxFQUFzQyxDQUFBLEdBQUEsQ0FBdENBLEVBQTBDRCxDQUFFUSxJQUFBQSxDQUE1Q1A7QUFBNENPLFVBQUFBLENBQUsrQixDQUFBQSxJQUFML0IsQ0FBV1osQ0FBQUEsQ0FBRVksQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBQUEsU0FBQUEsQ0FBY0YsQ0FBZEUsSUFBaUJSLENBQW5CSixJQUFzQixDQUF0QkEsR0FBc0IsQ0FBdEJBLElBQXlCSSxDQUF6QkosR0FBNkIsR0FBN0JBLEdBQWlDLENBQUEsQ0FBQSxDQUFBLEdBQUlXLENBQUFBLENBQUVQLFNBQUZPLENBQVksQ0FBQSxHQUFFaUMsQ0FBZGpDLElBQWdCWCxDQUFFNEMsQ0FBdEIsSUFBc0JBLENBQXRCLEdBQTBCakMsQ0FBMUIsSUFBNkJWLENBQXpFVztBQUE1Q1A7O0FBQXlIaUQsUUFBQUEsQ0FBQUEsQ0FBQUEsQ0FBQUEsQ0FBQUEsR0FBSzNDLE1BQUdDLENBQUFBLENBQUFBLENBQUFBLENBQVIwQyxFQUFhMUIsQ0FBQUEsQ0FBQUEsQ0FBQUEsQ0FBQUEsR0FBQUEsTUFBU2xCLENBQUFBLENBQUdDLENBQUhELENBQXRCNEM7QUFBMkJ2QixPQUE5TyxNQUE4T0EsS0FBUXdCLENBQUFBLEdBQUksQ0FBQSxNQUFBLENBQUEsR0FBQSxHQUFBLEdBQVcsQ0FBWCxDQUFKQSxFQUFlLENBQUEsR0FBQSxLQUFPM0MsQ0FBQUEsR0FBQUEsSUFBS2dCLENBQUFBLEdBQUxoQixDQUFLZ0IsQ0FBTGhCLEVBQUtnQixPQUFZRyxDQUFBQSxDQUFBQSxTQUFBQSxJQUFZLENBQXhCSCxDQUFMaEIsQ0FBUCxDQUFmMkMsRUFBbUQsQ0FBU25ELEdBQUFBLEtBQUd5QixDQUFBQSxJQUFBQSxDQUFIekIsQ0FBNURtRCxFQUFxRXpCLENBQUFBLEdBQUFBLENBQUFBLENBQUFBLENBQUFBLEdBQUFBLENBQVExQixHQUFBQSxDQUFSMEIsSUFBcUIsQ0FBckJBLEdBQVkxQixDQUFaMEIsSUFBYzBCLENBQW5GRCxFQUFtRkMsQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBQUEsQ0FBVTVDLEdBQUFBLENBQUFBLENBQUFBLENBQUFBLEdBQUtnQixDQUFBQSxDQUFBQSxRQUFBQSxDQUFXaEIsQ0FBWGdCLElBQVdoQixDQUFBQSxDQUFoQkEsSUFBcUI4QixDQUFyQjlCLEdBQXFCOEIsQ0FBckI5QixJQUFxQjhCLENBQS9CYyxJQUF3Q3BELENBQXhDb0QsS0FBMENBLENBQUFBLEdBQUFBLENBQTFDQSxDQUFuRkQsRUFBb0kzQyxDQUFBQSxHQUFBQSxDQUE1SW1CLEVBQWlKWSxDQUFBQSxHQUFBQSxDQUFqSlosRUFBaUpZLENBQUFBLEVBQWpKWjtBQUF1SmhCLFFBQUFBLENBQUFBLEdBQUFBLENBQUswQyxDQUFBQSxDQUFBQSxHQUFBQSxDQUFJaEQsR0FBQUEsQ0FBSmdELEdBQUloRCxDQUFKZ0QsSUFBVTFDLENBQVYwQyxHQUFVMUMsQ0FBZkEsSUFBb0JYLENBQXBCVyxFQUFvQlgsQ0FBQUEsR0FBQUEsQ0FBS1EsQ0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsQ0FBS2dCLFFBQUxoQixDQUFjLENBQUMsR0FBQSxDQUFmQSxJQUFrQkEsQ0FBQUEsQ0FBbEJBLElBQXVCOEIsQ0FBdkI5QixHQUF1QjhCLENBQTVCdEMsSUFBNEJzQyxDQUFoRDNCLEVBQWdEMkIsQ0FBQUEsSUFBUyxDQUFJL0IsR0FBYitCLENBQWVSLENBQUFBLENBQUFBLEdBQUFBLENBQUFBLEtBQU1xQixDQUFJLEdBQUEsQ0FBVnJCLElBQVUsQ0FBekJRLElBQXlCLENBQXpCQSxJQUF5QixDQUFXLEtBQUEsQ0FBQSxHQUFBLENBQXBDQSxNQUEyQzlCLENBQUFBLENBQUtlLElBQUxmLENBQUtlLENBQUFBLEdBQUFBLEdBQUFBLEdBQVVELENBQWZkLEdBQWVjLENBQUFBLEdBQUFBLENBQUFBLENBQUFBLEdBQUFBLENBQUFBLEtBQVVnQyxDQUFJLEdBQUEsQ0FBZGhDLENBQTFEZ0IsQ0FBaEQzQixFQUF3SCxDQUFBLEdBQUEsQ0FBeEhBLEVBQWlJWCxDQUFBQSxHQUFBQSxDQUFqSVc7QUFBdkpnQjs7QUFBMlIsYUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFvQm5CLE9BQUtZLENBQXpCLEdBQXlCQSxRQUFhcEIsQ0FBRVEsYUFBZlksQ0FBb0JBLENBQXBCQSxDQUF6QixHQUF3RGdCLENBQXhELEVBQTBEcEMsWUFBMUQsQ0FBbUUwQixHQUFuRSxFQUEyRTFCLENBQUFBLENBQUlRLElBQUpSLENBQVNvQixHQUFUcEIsQ0FBM0UsQ0FBQSxFQUFvRm9CLENBQUFBLENBQUFBLElBQUFBLENBQWFwQixHQUFib0IsQ0FBcEY7QUFBc0daLEtBQXJ1R0YsRUFBcXVHRSxDQUFydUdGO0FBQXF1R0UsRyxFQUFBQSxDQUFLWSxDO0FBQUFBLEMsR0FBQUEsUUFBYXBCLENBQUFBLFNBQWJvQixJQUFtQnBCLFFBQWFKLENBQUV5QixRQUFmckIsQ0FBc0JRLEdBQXRCUixJLEVBQTJCb0IsWUFBZVk7QUFBQUEsV0FBT1osQ0FBUFksR0FBT1o7QUFBQUEsV0FBYXBCLENBQUFBLFFBQU1RLENBQUFBLGdCQUFOUixJQUEwQlEsUUFBMUJSLEVBQStCb0IsVUFBNUNBO0FBQTZEYjs7QUFBQUEsaUJBQVk0QyxPQUFJLE1BQWhCNUMsSUFBMkIsTUFBT0MsQ0FBQUEsT0FBbENELElBQXVDYSxPQUFZYixDQUFFcUIscUJBQUZyQixDQUFaYSxFQUFxQyxNQUFBLENBQU9aLE9BQVAsR0FBWThCLENBQUFBLEVBQXhGL0IsSUFBd0YrQixjQUFvQmdCLE9BQUksTUFBeEJoQixJQUFpQ3RDLE1BQVFzQyxDQUFBQSxHQUF6Q0EsSUFBeUNBLE1BQVMzQixDQUFBQSxDQUFLMEMsV0FBTDFDLENBQUFBLEVBQWdCNEMsQ0FBaEI1QyxDQUExSUo7QUFBdDdKLENBQW0ySmEsRSIsImZpbGUiOiJsaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIHBpeGktZmlsdGVycyAtIHYyLjcuMFxuICogQ29tcGlsZWQgU3VuLCAxMyBKYW4gMjAxOSAyMjo1MTo1MiBVVENcbiAqXG4gKiBwaXhpLWZpbHRlcnMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG52YXIgX19maWx0ZXJzPWZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgZ2FtbWE7XFxudW5pZm9ybSBmbG9hdCBjb250cmFzdDtcXG51bmlmb3JtIGZsb2F0IHNhdHVyYXRpb247XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcbnVuaWZvcm0gZmxvYXQgcmVkO1xcbnVuaWZvcm0gZmxvYXQgZ3JlZW47XFxudW5pZm9ybSBmbG9hdCBibHVlO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWM0IGMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBpZiAoYy5hID4gMC4wKSB7XFxuICAgICAgICBjLnJnYiAvPSBjLmE7XFxuXFxuICAgICAgICB2ZWMzIHJnYiA9IHBvdyhjLnJnYiwgdmVjMygxLiAvIGdhbW1hKSk7XFxuICAgICAgICByZ2IgPSBtaXgodmVjMyguNSksIG1peCh2ZWMzKGRvdCh2ZWMzKC4yMTI1LCAuNzE1NCwgLjA3MjEpLCByZ2IpKSwgcmdiLCBzYXR1cmF0aW9uKSwgY29udHJhc3QpO1xcbiAgICAgICAgcmdiLnIgKj0gcmVkO1xcbiAgICAgICAgcmdiLmcgKj0gZ3JlZW47XFxuICAgICAgICByZ2IuYiAqPSBibHVlO1xcbiAgICAgICAgYy5yZ2IgPSByZ2IgKiBicmlnaHRuZXNzO1xcblxcbiAgICAgICAgYy5yZ2IgKj0gYy5hO1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGMgKiBhbHBoYTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe2UuY2FsbCh0aGlzLG4sciksT2JqZWN0LmFzc2lnbih0aGlzLHtnYW1tYToxLHNhdHVyYXRpb246MSxjb250cmFzdDoxLGJyaWdodG5lc3M6MSxyZWQ6MSxncmVlbjoxLGJsdWU6MSxhbHBoYToxfSx0KX1yZXR1cm4gZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy5nYW1tYT1NYXRoLm1heCh0aGlzLmdhbW1hLDFlLTQpLHRoaXMudW5pZm9ybXMuc2F0dXJhdGlvbj10aGlzLnNhdHVyYXRpb24sdGhpcy51bmlmb3Jtcy5jb250cmFzdD10aGlzLmNvbnRyYXN0LHRoaXMudW5pZm9ybXMuYnJpZ2h0bmVzcz10aGlzLmJyaWdodG5lc3MsdGhpcy51bmlmb3Jtcy5yZWQ9dGhpcy5yZWQsdGhpcy51bmlmb3Jtcy5ncmVlbj10aGlzLmdyZWVuLHRoaXMudW5pZm9ybXMuYmx1ZT10aGlzLmJsdWUsdGhpcy51bmlmb3Jtcy5hbHBoYT10aGlzLmFscGhhLGUuYXBwbHlGaWx0ZXIodGhpcyx0LG4scil9LHR9KHQuRmlsdGVyKSxpPW4sbD1cIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gdmVjMiB1T2Zmc2V0O1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG5cXG4gICAgLy8gU2FtcGxlIHRvcCBsZWZ0IHBpeGVsXFxuICAgIGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB1T2Zmc2V0LngsIHZUZXh0dXJlQ29vcmQueSArIHVPZmZzZXQueSkpO1xcblxcbiAgICAvLyBTYW1wbGUgdG9wIHJpZ2h0IHBpeGVsXFxuICAgIGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyB1T2Zmc2V0LngsIHZUZXh0dXJlQ29vcmQueSArIHVPZmZzZXQueSkpO1xcblxcbiAgICAvLyBTYW1wbGUgYm90dG9tIHJpZ2h0IHBpeGVsXFxuICAgIGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyB1T2Zmc2V0LngsIHZUZXh0dXJlQ29vcmQueSAtIHVPZmZzZXQueSkpO1xcblxcbiAgICAvLyBTYW1wbGUgYm90dG9tIGxlZnQgcGl4ZWxcXG4gICAgY29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHVPZmZzZXQueCwgdlRleHR1cmVDb29yZC55IC0gdU9mZnNldC55KSk7XFxuXFxuICAgIC8vIEF2ZXJhZ2VcXG4gICAgY29sb3IgKj0gMC4yNTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XFxufVwiLHM9XCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzIgdU9mZnNldDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWM0IGNvbG9yID0gdmVjNCgwLjApO1xcblxcbiAgICAvLyBTYW1wbGUgdG9wIGxlZnQgcGl4ZWxcXG4gICAgY29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcCh2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHVPZmZzZXQueCwgdlRleHR1cmVDb29yZC55ICsgdU9mZnNldC55KSwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuXFxuICAgIC8vIFNhbXBsZSB0b3AgcmlnaHQgcGl4ZWxcXG4gICAgY29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcCh2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHVPZmZzZXQueCwgdlRleHR1cmVDb29yZC55ICsgdU9mZnNldC55KSwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuXFxuICAgIC8vIFNhbXBsZSBib3R0b20gcmlnaHQgcGl4ZWxcXG4gICAgY29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcCh2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHVPZmZzZXQueCwgdlRleHR1cmVDb29yZC55IC0gdU9mZnNldC55KSwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuXFxuICAgIC8vIFNhbXBsZSBib3R0b20gbGVmdCBwaXhlbFxcbiAgICBjb2xvciArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKHZlYzIodlRleHR1cmVDb29yZC54IC0gdU9mZnNldC54LCB2VGV4dHVyZUNvb3JkLnkgLSB1T2Zmc2V0LnkpLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpKTtcXG5cXG4gICAgLy8gQXZlcmFnZVxcbiAgICBjb2xvciAqPSAwLjI1O1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjtcXG59XFxuXCIsYT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4scixvKXt2b2lkIDA9PT1uJiYobj00KSx2b2lkIDA9PT1yJiYocj0zKSx2b2lkIDA9PT1vJiYobz0hMSksZS5jYWxsKHRoaXMsaSxvP3M6bCksdGhpcy51bmlmb3Jtcy51T2Zmc2V0PW5ldyBGbG9hdDMyQXJyYXkoMiksdGhpcy5fcGl4ZWxTaXplPW5ldyB0LlBvaW50LHRoaXMucGl4ZWxTaXplPTEsdGhpcy5fY2xhbXA9byx0aGlzLl9rZXJuZWxzPW51bGwsQXJyYXkuaXNBcnJheShuKT90aGlzLmtlcm5lbHM9bjoodGhpcy5fYmx1cj1uLHRoaXMucXVhbGl0eT1yKX1lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17a2VybmVsczp7Y29uZmlndXJhYmxlOiEwfSxjbGFtcDp7Y29uZmlndXJhYmxlOiEwfSxwaXhlbFNpemU6e2NvbmZpZ3VyYWJsZTohMH0scXVhbGl0eTp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dmFyIG8saT10aGlzLnBpeGVsU2l6ZS54L3Quc2l6ZS53aWR0aCxsPXRoaXMucGl4ZWxTaXplLnkvdC5zaXplLmhlaWdodDtpZigxPT09dGhpcy5fcXVhbGl0eXx8MD09PXRoaXMuX2JsdXIpbz10aGlzLl9rZXJuZWxzWzBdKy41LHRoaXMudW5pZm9ybXMudU9mZnNldFswXT1vKmksdGhpcy51bmlmb3Jtcy51T2Zmc2V0WzFdPW8qbCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpO2Vsc2V7Zm9yKHZhciBzLGE9ZS5nZXRSZW5kZXJUYXJnZXQoITApLHU9dCxjPWEsZj10aGlzLl9xdWFsaXR5LTEsaD0wO2g8ZjtoKyspbz10aGlzLl9rZXJuZWxzW2hdKy41LHRoaXMudW5pZm9ybXMudU9mZnNldFswXT1vKmksdGhpcy51bmlmb3Jtcy51T2Zmc2V0WzFdPW8qbCxlLmFwcGx5RmlsdGVyKHRoaXMsdSxjLCEwKSxzPXUsdT1jLGM9cztvPXRoaXMuX2tlcm5lbHNbZl0rLjUsdGhpcy51bmlmb3Jtcy51T2Zmc2V0WzBdPW8qaSx0aGlzLnVuaWZvcm1zLnVPZmZzZXRbMV09bypsLGUuYXBwbHlGaWx0ZXIodGhpcyx1LG4sciksZS5yZXR1cm5SZW5kZXJUYXJnZXQoYSl9fSxuLnByb3RvdHlwZS5fZ2VuZXJhdGVLZXJuZWxzPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fYmx1cix0PXRoaXMuX3F1YWxpdHksbj1bZV07aWYoZT4wKWZvcih2YXIgcj1lLG89ZS90LGk9MTtpPHQ7aSsrKXItPW8sbi5wdXNoKHIpO3RoaXMuX2tlcm5lbHM9bn0sci5rZXJuZWxzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9rZXJuZWxzfSxyLmtlcm5lbHMuc2V0PWZ1bmN0aW9uKGUpe0FycmF5LmlzQXJyYXkoZSkmJmUubGVuZ3RoPjA/KHRoaXMuX2tlcm5lbHM9ZSx0aGlzLl9xdWFsaXR5PWUubGVuZ3RoLHRoaXMuX2JsdXI9TWF0aC5tYXguYXBwbHkoTWF0aCxlKSk6KHRoaXMuX2tlcm5lbHM9WzBdLHRoaXMuX3F1YWxpdHk9MSl9LHIuY2xhbXAuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NsYW1wfSxyLnBpeGVsU2l6ZS5zZXQ9ZnVuY3Rpb24oZSl7XCJudW1iZXJcIj09dHlwZW9mIGU/KHRoaXMuX3BpeGVsU2l6ZS54PWUsdGhpcy5fcGl4ZWxTaXplLnk9ZSk6QXJyYXkuaXNBcnJheShlKT8odGhpcy5fcGl4ZWxTaXplLng9ZVswXSx0aGlzLl9waXhlbFNpemUueT1lWzFdKTplIGluc3RhbmNlb2YgdC5Qb2ludD8odGhpcy5fcGl4ZWxTaXplLng9ZS54LHRoaXMuX3BpeGVsU2l6ZS55PWUueSk6KHRoaXMuX3BpeGVsU2l6ZS54PTEsdGhpcy5fcGl4ZWxTaXplLnk9MSl9LHIucGl4ZWxTaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9waXhlbFNpemV9LHIucXVhbGl0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcXVhbGl0eX0sci5xdWFsaXR5LnNldD1mdW5jdGlvbihlKXt0aGlzLl9xdWFsaXR5PU1hdGgubWF4KDEsTWF0aC5yb3VuZChlKSksdGhpcy5fZ2VuZXJhdGVLZXJuZWxzKCl9LHIuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1cn0sci5ibHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLl9ibHVyPWUsdGhpcy5fZ2VuZXJhdGVLZXJuZWxzKCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSx1PW4sYz1cIlxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gZmxvYXQgdGhyZXNob2xkO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIEEgc2ltcGxlICYgZmFzdCBhbGdvcml0aG0gZm9yIGdldHRpbmcgYnJpZ2h0bmVzcy5cXG4gICAgLy8gSXQncyBpbmFjY3VyYWN5ICwgYnV0IGdvb2QgZW5vdWdodCBmb3IgdGhpcyBmZWF0dXJlLlxcbiAgICBmbG9hdCBfbWF4ID0gbWF4KG1heChjb2xvci5yLCBjb2xvci5nKSwgY29sb3IuYik7XFxuICAgIGZsb2F0IF9taW4gPSBtaW4obWluKGNvbG9yLnIsIGNvbG9yLmcpLCBjb2xvci5iKTtcXG4gICAgZmxvYXQgYnJpZ2h0bmVzcyA9IChfbWF4ICsgX21pbikgKiAwLjU7XFxuXFxuICAgIGlmKGJyaWdodG5lc3MgPiB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAwLjApO1xcbiAgICB9XFxufVxcblwiLGY9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2b2lkIDA9PT10JiYodD0uNSksZS5jYWxsKHRoaXMsdSxjKSx0aGlzLnRocmVzaG9sZD10fWUmJih0Ll9fcHJvdG9fXz1lKSx0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10O3ZhciBuPXt0aHJlc2hvbGQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnRocmVzaG9sZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy50aHJlc2hvbGR9LG4udGhyZXNob2xkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRocmVzaG9sZD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksaD1cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIGJsb29tVGV4dHVyZTtcXG51bmlmb3JtIGZsb2F0IGJsb29tU2NhbGU7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIGNvbG9yLnJnYiAqPSBicmlnaHRuZXNzO1xcbiAgICB2ZWM0IGJsb29tQ29sb3IgPSB2ZWM0KHRleHR1cmUyRChibG9vbVRleHR1cmUsIHZUZXh0dXJlQ29vcmQpLnJnYiwgMC4wKTtcXG4gICAgYmxvb21Db2xvci5yZ2IgKj0gYmxvb21TY2FsZTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgKyBibG9vbUNvbG9yO1xcbn1cXG5cIixwPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obil7ZS5jYWxsKHRoaXMsdSxoKSxcIm51bWJlclwiPT10eXBlb2YgbiYmKG49e3RocmVzaG9sZDpufSksbj1PYmplY3QuYXNzaWduKHt0aHJlc2hvbGQ6LjUsYmxvb21TY2FsZToxLGJyaWdodG5lc3M6MSxrZXJuZWxzOm51bGwsYmx1cjo4LHF1YWxpdHk6NCxwaXhlbFNpemU6MSxyZXNvbHV0aW9uOnQuc2V0dGluZ3MuUkVTT0xVVElPTn0sbiksdGhpcy5ibG9vbVNjYWxlPW4uYmxvb21TY2FsZSx0aGlzLmJyaWdodG5lc3M9bi5icmlnaHRuZXNzO3ZhciByPW4ua2VybmVscyxvPW4uYmx1cixpPW4ucXVhbGl0eSxsPW4ucGl4ZWxTaXplLHM9bi5yZXNvbHV0aW9uO3RoaXMuX2V4dHJhY3RGaWx0ZXI9bmV3IGYobi50aHJlc2hvbGQpLHRoaXMuX2V4dHJhY3RGaWx0ZXIucmVzb2x1dGlvbj1zLHRoaXMuX2JsdXJGaWx0ZXI9cj9uZXcgYShyKTpuZXcgYShvLGkpLHRoaXMucGl4ZWxTaXplPWwsdGhpcy5yZXNvbHV0aW9uPXN9ZSYmKG4uX19wcm90b19fPWUpLG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yPW47dmFyIHI9e3Jlc29sdXRpb246e2NvbmZpZ3VyYWJsZTohMH0sdGhyZXNob2xkOntjb25maWd1cmFibGU6ITB9LGtlcm5lbHM6e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxxdWFsaXR5Ontjb25maWd1cmFibGU6ITB9LHBpeGVsU2l6ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4ucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuLHIsbyl7dmFyIGk9ZS5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuX2V4dHJhY3RGaWx0ZXIuYXBwbHkoZSx0LGksITAsbyk7dmFyIGw9ZS5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuX2JsdXJGaWx0ZXIuYXBwbHkoZSxpLGwsITAsbyksdGhpcy51bmlmb3Jtcy5ibG9vbVNjYWxlPXRoaXMuYmxvb21TY2FsZSx0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3M9dGhpcy5icmlnaHRuZXNzLHRoaXMudW5pZm9ybXMuYmxvb21UZXh0dXJlPWwsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKSxlLnJldHVyblJlbmRlclRhcmdldChsKSxlLnJldHVyblJlbmRlclRhcmdldChpKX0sci5yZXNvbHV0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXNvbHV0aW9ufSxyLnJlc29sdXRpb24uc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX3Jlc29sdXRpb249ZSx0aGlzLl9leHRyYWN0RmlsdGVyJiYodGhpcy5fZXh0cmFjdEZpbHRlci5yZXNvbHV0aW9uPWUpLHRoaXMuX2JsdXJGaWx0ZXImJih0aGlzLl9ibHVyRmlsdGVyLnJlc29sdXRpb249ZSl9LHIudGhyZXNob2xkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9leHRyYWN0RmlsdGVyLnRocmVzaG9sZH0sci50aHJlc2hvbGQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2V4dHJhY3RGaWx0ZXIudGhyZXNob2xkPWV9LHIua2VybmVscy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1ckZpbHRlci5rZXJuZWxzfSxyLmtlcm5lbHMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJGaWx0ZXIua2VybmVscz1lfSxyLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JsdXJGaWx0ZXIuYmx1cn0sci5ibHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLl9ibHVyRmlsdGVyLmJsdXI9ZX0sci5xdWFsaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ibHVyRmlsdGVyLnF1YWxpdHl9LHIucXVhbGl0eS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fYmx1ckZpbHRlci5xdWFsaXR5PWV9LHIucGl4ZWxTaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ibHVyRmlsdGVyLnBpeGVsU2l6ZX0sci5waXhlbFNpemUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJGaWx0ZXIucGl4ZWxTaXplPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSxkPW4sbT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gZmxvYXQgcGl4ZWxTaXplO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHBpeGVsYXRlKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuICAgIHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52ZWMyIGdldE1vZCh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcbiAgICByZXR1cm4gbW9kKCBjb29yZCAsIHNpemUpIC8gc2l6ZTtcXG59XFxuXFxuZmxvYXQgY2hhcmFjdGVyKGZsb2F0IG4sIHZlYzIgcClcXG57XFxuICAgIHAgPSBmbG9vcihwKnZlYzIoNC4wLCAtNC4wKSArIDIuNSk7XFxuICAgIGlmIChjbGFtcChwLngsIDAuMCwgNC4wKSA9PSBwLnggJiYgY2xhbXAocC55LCAwLjAsIDQuMCkgPT0gcC55KVxcbiAgICB7XFxuICAgICAgICBpZiAoaW50KG1vZChuL2V4cDIocC54ICsgNS4wKnAueSksIDIuMCkpID09IDEpIHJldHVybiAxLjA7XFxuICAgIH1cXG4gICAgcmV0dXJuIDAuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gZ2V0IHRoZSByb3VuZGVkIGNvbG9yLi5cXG4gICAgdmVjMiBwaXhDb29yZCA9IHBpeGVsYXRlKGNvb3JkLCB2ZWMyKHBpeGVsU2l6ZSkpO1xcbiAgICBwaXhDb29yZCA9IHVubWFwQ29vcmQocGl4Q29vcmQpO1xcblxcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBwaXhDb29yZCk7XFxuXFxuICAgIC8vIGRldGVybWluZSB0aGUgY2hhcmFjdGVyIHRvIHVzZVxcbiAgICBmbG9hdCBncmF5ID0gKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjA7XFxuXFxuICAgIGZsb2F0IG4gPSAgNjU1MzYuMDsgICAgICAgICAgICAgLy8gLlxcbiAgICBpZiAoZ3JheSA+IDAuMikgbiA9IDY1NjAwLjA7ICAgIC8vIDpcXG4gICAgaWYgKGdyYXkgPiAwLjMpIG4gPSAzMzI3NzIuMDsgICAvLyAqXFxuICAgIGlmIChncmF5ID4gMC40KSBuID0gMTUyNTUwODYuMDsgLy8gb1xcbiAgICBpZiAoZ3JheSA+IDAuNSkgbiA9IDIzMzg1MTY0LjA7IC8vICZcXG4gICAgaWYgKGdyYXkgPiAwLjYpIG4gPSAxNTI1MjAxNC4wOyAvLyA4XFxuICAgIGlmIChncmF5ID4gMC43KSBuID0gMTMxOTk0NTIuMDsgLy8gQFxcbiAgICBpZiAoZ3JheSA+IDAuOCkgbiA9IDExNTEyODEwLjA7IC8vICNcXG5cXG4gICAgLy8gZ2V0IHRoZSBtb2QuLlxcbiAgICB2ZWMyIG1vZGQgPSBnZXRNb2QoY29vcmQsIHZlYzIocGl4ZWxTaXplKSk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICogY2hhcmFjdGVyKCBuLCB2ZWMyKC0xLjApICsgbW9kZCAqIDIuMCk7XFxuXFxufVwiLGc9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2b2lkIDA9PT10JiYodD04KSxlLmNhbGwodGhpcyxkLG0pLHRoaXMuc2l6ZT10fWUmJih0Ll9fcHJvdG9fXz1lKSx0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10O3ZhciBuPXtzaXplOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5zaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZX0sbi5zaXplLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksdj1uLHg9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIGZsb2F0IHRyYW5zZm9ybVg7XFxudW5pZm9ybSBmbG9hdCB0cmFuc2Zvcm1ZO1xcbnVuaWZvcm0gdmVjMyBsaWdodENvbG9yO1xcbnVuaWZvcm0gZmxvYXQgbGlnaHRBbHBoYTtcXG51bmlmb3JtIHZlYzMgc2hhZG93Q29sb3I7XFxudW5pZm9ybSBmbG9hdCBzaGFkb3dBbHBoYTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICB2ZWMyIHRyYW5zZm9ybSA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYSkgKiB2ZWMyKHRyYW5zZm9ybVgsIHRyYW5zZm9ybVkpO1xcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgZmxvYXQgbGlnaHQgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSB0cmFuc2Zvcm0pLmE7XFxuICAgIGZsb2F0IHNoYWRvdyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHRyYW5zZm9ybSkuYTtcXG5cXG4gICAgY29sb3IucmdiID0gbWl4KGNvbG9yLnJnYiwgbGlnaHRDb2xvciwgY2xhbXAoKGNvbG9yLmEgLSBsaWdodCkgKiBsaWdodEFscGhhLCAwLjAsIDEuMCkpO1xcbiAgICBjb2xvci5yZ2IgPSBtaXgoY29sb3IucmdiLCBzaGFkb3dDb2xvciwgY2xhbXAoKGNvbG9yLmEgLSBzaGFkb3cpICogc2hhZG93QWxwaGEsIDAuMCwgMS4wKSk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiICogY29sb3IuYSwgY29sb3IuYSk7XFxufVxcblwiLHk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD17fSksZS5jYWxsKHRoaXMsdix4KSx0aGlzLnVuaWZvcm1zLmxpZ2h0Q29sb3I9bmV3IEZsb2F0MzJBcnJheSgzKSx0aGlzLnVuaWZvcm1zLnNoYWRvd0NvbG9yPW5ldyBGbG9hdDMyQXJyYXkoMyksdD1PYmplY3QuYXNzaWduKHtyb3RhdGlvbjo0NSx0aGlja25lc3M6MixsaWdodENvbG9yOjE2Nzc3MjE1LGxpZ2h0QWxwaGE6Ljcsc2hhZG93Q29sb3I6MCxzaGFkb3dBbHBoYTouN30sdCksdGhpcy5yb3RhdGlvbj10LnJvdGF0aW9uLHRoaXMudGhpY2tuZXNzPXQudGhpY2tuZXNzLHRoaXMubGlnaHRDb2xvcj10LmxpZ2h0Q29sb3IsdGhpcy5saWdodEFscGhhPXQubGlnaHRBbHBoYSx0aGlzLnNoYWRvd0NvbG9yPXQuc2hhZG93Q29sb3IsdGhpcy5zaGFkb3dBbHBoYT10LnNoYWRvd0FscGhhfWUmJihuLl9fcHJvdG9fXz1lKSxuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXtyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSx0aGlja25lc3M6e2NvbmZpZ3VyYWJsZTohMH0sbGlnaHRDb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxsaWdodEFscGhhOntjb25maWd1cmFibGU6ITB9LHNoYWRvd0NvbG9yOntjb25maWd1cmFibGU6ITB9LHNoYWRvd0FscGhhOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuX3VwZGF0ZVRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudW5pZm9ybXMudHJhbnNmb3JtWD10aGlzLl90aGlja25lc3MqTWF0aC5jb3ModGhpcy5fYW5nbGUpLHRoaXMudW5pZm9ybXMudHJhbnNmb3JtWT10aGlzLl90aGlja25lc3MqTWF0aC5zaW4odGhpcy5fYW5nbGUpfSxyLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZS90LkRFR19UT19SQUR9LHIucm90YXRpb24uc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2FuZ2xlPWUqdC5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRyYW5zZm9ybSgpfSxyLnRoaWNrbmVzcy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdGhpY2tuZXNzfSxyLnRoaWNrbmVzcy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fdGhpY2tuZXNzPWUsdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCl9LHIubGlnaHRDb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdC51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMubGlnaHRDb2xvcil9LHIubGlnaHRDb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dC51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5saWdodENvbG9yKX0sci5saWdodEFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxpZ2h0QWxwaGF9LHIubGlnaHRBbHBoYS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5saWdodEFscGhhPWV9LHIuc2hhZG93Q29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHQudXRpbHMucmdiMmhleCh0aGlzLnVuaWZvcm1zLnNoYWRvd0NvbG9yKX0sci5zaGFkb3dDb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dC51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5zaGFkb3dDb2xvcil9LHIuc2hhZG93QWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2hhZG93QWxwaGF9LHIuc2hhZG93QWxwaGEuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc2hhZG93QWxwaGE9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsciksbn0odC5GaWx0ZXIpLGI9dC5maWx0ZXJzLF89Yi5CbHVyWEZpbHRlcixDPWIuQmx1cllGaWx0ZXIsUz1iLkFscGhhRmlsdGVyLEY9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLHIsbyxpKXt2YXIgbCxzO3ZvaWQgMD09PW4mJihuPTIpLHZvaWQgMD09PXImJihyPTQpLHZvaWQgMD09PW8mJihvPXQuc2V0dGluZ3MuUkVTT0xVVElPTiksdm9pZCAwPT09aSYmKGk9NSksZS5jYWxsKHRoaXMpLFwibnVtYmVyXCI9PXR5cGVvZiBuPyhsPW4scz1uKTpuIGluc3RhbmNlb2YgdC5Qb2ludD8obD1uLngscz1uLnkpOkFycmF5LmlzQXJyYXkobikmJihsPW5bMF0scz1uWzFdKSx0aGlzLmJsdXJYRmlsdGVyPW5ldyBfKGwscixvLGkpLHRoaXMuYmx1cllGaWx0ZXI9bmV3IEMocyxyLG8saSksdGhpcy5ibHVyWUZpbHRlci5ibGVuZE1vZGU9dC5CTEVORF9NT0RFUy5TQ1JFRU4sdGhpcy5kZWZhdWx0RmlsdGVyPW5ldyBTfWUmJihuLl9fcHJvdG9fXz1lKSxuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXtibHVyOntjb25maWd1cmFibGU6ITB9LGJsdXJYOntjb25maWd1cmFibGU6ITB9LGJsdXJZOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4pe3ZhciByPWUuZ2V0UmVuZGVyVGFyZ2V0KCEwKTt0aGlzLmRlZmF1bHRGaWx0ZXIuYXBwbHkoZSx0LG4pLHRoaXMuYmx1clhGaWx0ZXIuYXBwbHkoZSx0LHIpLHRoaXMuYmx1cllGaWx0ZXIuYXBwbHkoZSxyLG4pLGUucmV0dXJuUmVuZGVyVGFyZ2V0KHIpfSxyLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1clhGaWx0ZXIuYmx1cn0sci5ibHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLmJsdXJYRmlsdGVyLmJsdXI9dGhpcy5ibHVyWUZpbHRlci5ibHVyPWV9LHIuYmx1clguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1clhGaWx0ZXIuYmx1cn0sci5ibHVyWC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPWV9LHIuYmx1clkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1cllGaWx0ZXIuYmx1cn0sci5ibHVyWS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5ibHVyWUZpbHRlci5ibHVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSx6PW4sQT1cInVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxudW5pZm9ybSB2ZWMyIGNlbnRlcjtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgLT0gY2VudGVyICogZGltZW5zaW9ucy54eTtcXG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoY29vcmQpO1xcbiAgICBpZiAoZGlzdGFuY2UgPCByYWRpdXMpIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSBkaXN0YW5jZSAvIHJhZGl1cztcXG4gICAgICAgIGlmIChzdHJlbmd0aCA+IDAuMCkge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHNtb290aHN0ZXAoMC4wLCByYWRpdXMgLyBkaXN0YW5jZSwgcGVyY2VudCksIHN0cmVuZ3RoICogMC43NSk7XFxuICAgICAgICB9IGVsc2Uge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHBvdyhwZXJjZW50LCAxLjAgKyBzdHJlbmd0aCAqIDAuNzUpICogcmFkaXVzIC8gZGlzdGFuY2UsIDEuMCAtIHBlcmNlbnQpO1xcbiAgICAgICAgfVxcbiAgICB9XFxuICAgIGNvb3JkICs9IGNlbnRlciAqIGRpbWVuc2lvbnMueHk7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuICAgIHZlYzIgY2xhbXBlZENvb3JkID0gY2xhbXAoY29vcmQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dyk7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wZWRDb29yZCk7XFxuICAgIGlmIChjb29yZCAhPSBjbGFtcGVkQ29vcmQpIHtcXG4gICAgICAgIGNvbG9yICo9IG1heCgwLjAsIDEuMCAtIGxlbmd0aChjb29yZCAtIGNsYW1wZWRDb29yZCkpO1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbn1cXG5cIix3PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCxuLHIpe2UuY2FsbCh0aGlzLHosQSksdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zPW5ldyBGbG9hdDMyQXJyYXkoMiksdGhpcy5jZW50ZXI9dHx8Wy41LC41XSx0aGlzLnJhZGl1cz1cIm51bWJlclwiPT10eXBlb2Ygbj9uOjEwMCx0aGlzLnN0cmVuZ3RoPVwibnVtYmVyXCI9PXR5cGVvZiByP3I6MX1lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17cmFkaXVzOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuLHIpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxuLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LG4ucmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1lfSxuLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxuLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LG4uY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmNlbnRlcn0sbi5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY2VudGVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSxUPW4sRD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gc2FtcGxlcjJEIGNvbG9yTWFwO1xcbnVuaWZvcm0gZmxvYXQgX21peDtcXG51bmlmb3JtIGZsb2F0IF9zaXplO1xcbnVuaWZvcm0gZmxvYXQgX3NsaWNlU2l6ZTtcXG51bmlmb3JtIGZsb2F0IF9zbGljZVBpeGVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IF9zbGljZUlubmVyU2l6ZTtcXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQueHkpO1xcblxcbiAgICB2ZWM0IGFkanVzdGVkO1xcbiAgICBpZiAoY29sb3IuYSA+IDAuMCkge1xcbiAgICAgICAgY29sb3IucmdiIC89IGNvbG9yLmE7XFxuICAgICAgICBmbG9hdCBpbm5lcldpZHRoID0gX3NpemUgLSAxLjA7XFxuICAgICAgICBmbG9hdCB6U2xpY2UwID0gbWluKGZsb29yKGNvbG9yLmIgKiBpbm5lcldpZHRoKSwgaW5uZXJXaWR0aCk7XFxuICAgICAgICBmbG9hdCB6U2xpY2UxID0gbWluKHpTbGljZTAgKyAxLjAsIGlubmVyV2lkdGgpO1xcbiAgICAgICAgZmxvYXQgeE9mZnNldCA9IF9zbGljZVBpeGVsU2l6ZSAqIDAuNSArIGNvbG9yLnIgKiBfc2xpY2VJbm5lclNpemU7XFxuICAgICAgICBmbG9hdCBzMCA9IHhPZmZzZXQgKyAoelNsaWNlMCAqIF9zbGljZVNpemUpO1xcbiAgICAgICAgZmxvYXQgczEgPSB4T2Zmc2V0ICsgKHpTbGljZTEgKiBfc2xpY2VTaXplKTtcXG4gICAgICAgIGZsb2F0IHlPZmZzZXQgPSBfc2xpY2VTaXplICogMC41ICsgY29sb3IuZyAqICgxLjAgLSBfc2xpY2VTaXplKTtcXG4gICAgICAgIHZlYzQgc2xpY2UwQ29sb3IgPSB0ZXh0dXJlMkQoY29sb3JNYXAsIHZlYzIoczAseU9mZnNldCkpO1xcbiAgICAgICAgdmVjNCBzbGljZTFDb2xvciA9IHRleHR1cmUyRChjb2xvck1hcCwgdmVjMihzMSx5T2Zmc2V0KSk7XFxuICAgICAgICBmbG9hdCB6T2Zmc2V0ID0gZnJhY3QoY29sb3IuYiAqIGlubmVyV2lkdGgpO1xcbiAgICAgICAgYWRqdXN0ZWQgPSBtaXgoc2xpY2UwQ29sb3IsIHNsaWNlMUNvbG9yLCB6T2Zmc2V0KTtcXG5cXG4gICAgICAgIGNvbG9yLnJnYiAqPSBjb2xvci5hO1xcbiAgICB9XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KGNvbG9yLCBhZGp1c3RlZCwgX21peCkucmdiLCBjb2xvci5hKTtcXG5cXG59XCIsTz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbixyKXt2b2lkIDA9PT1uJiYobj0hMSksdm9pZCAwPT09ciYmKHI9MSksZS5jYWxsKHRoaXMsVCxEKSx0aGlzLl9zaXplPTAsdGhpcy5fc2xpY2VTaXplPTAsdGhpcy5fc2xpY2VQaXhlbFNpemU9MCx0aGlzLl9zbGljZUlubmVyU2l6ZT0wLHRoaXMuX3NjYWxlTW9kZT1udWxsLHRoaXMuX25lYXJlc3Q9ITEsdGhpcy5uZWFyZXN0PW4sdGhpcy5taXg9cix0aGlzLmNvbG9yTWFwPXR9ZSYmKG4uX19wcm90b19fPWUpLG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yPW47dmFyIHI9e2NvbG9yU2l6ZTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvck1hcDp7Y29uZmlndXJhYmxlOiEwfSxuZWFyZXN0Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy5fbWl4PXRoaXMubWl4LGUuYXBwbHlGaWx0ZXIodGhpcyx0LG4scil9LHIuY29sb3JTaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zaXplfSxyLmNvbG9yTWFwLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb2xvck1hcH0sci5jb2xvck1hcC5zZXQ9ZnVuY3Rpb24oZSl7ZSBpbnN0YW5jZW9mIHQuVGV4dHVyZXx8KGU9dC5UZXh0dXJlLmZyb20oZSkpLGUmJmUuYmFzZVRleHR1cmUmJihlLmJhc2VUZXh0dXJlLnNjYWxlTW9kZT10aGlzLl9zY2FsZU1vZGUsZS5iYXNlVGV4dHVyZS5taXBtYXA9ITEsdGhpcy5fc2l6ZT1lLmhlaWdodCx0aGlzLl9zbGljZVNpemU9MS90aGlzLl9zaXplLHRoaXMuX3NsaWNlUGl4ZWxTaXplPXRoaXMuX3NsaWNlU2l6ZS90aGlzLl9zaXplLHRoaXMuX3NsaWNlSW5uZXJTaXplPXRoaXMuX3NsaWNlUGl4ZWxTaXplKih0aGlzLl9zaXplLTEpLHRoaXMudW5pZm9ybXMuX3NpemU9dGhpcy5fc2l6ZSx0aGlzLnVuaWZvcm1zLl9zbGljZVNpemU9dGhpcy5fc2xpY2VTaXplLHRoaXMudW5pZm9ybXMuX3NsaWNlUGl4ZWxTaXplPXRoaXMuX3NsaWNlUGl4ZWxTaXplLHRoaXMudW5pZm9ybXMuX3NsaWNlSW5uZXJTaXplPXRoaXMuX3NsaWNlSW5uZXJTaXplLHRoaXMudW5pZm9ybXMuY29sb3JNYXA9ZSksdGhpcy5fY29sb3JNYXA9ZX0sci5uZWFyZXN0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9uZWFyZXN0fSxyLm5lYXJlc3Quc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX25lYXJlc3Q9ZSx0aGlzLl9zY2FsZU1vZGU9ZT90LlNDQUxFX01PREVTLk5FQVJFU1Q6dC5TQ0FMRV9NT0RFUy5MSU5FQVI7dmFyIG49dGhpcy5fY29sb3JNYXA7biYmbi5iYXNlVGV4dHVyZSYmKG4uYmFzZVRleHR1cmUuX2dsVGV4dHVyZXM9e30sbi5iYXNlVGV4dHVyZS5zY2FsZU1vZGU9dGhpcy5fc2NhbGVNb2RlLG4uYmFzZVRleHR1cmUubWlwbWFwPSExLG4uX3VwZGF0ZUlEKyssbi5iYXNlVGV4dHVyZS5lbWl0KFwidXBkYXRlXCIsbi5iYXNlVGV4dHVyZSkpfSxuLnByb3RvdHlwZS51cGRhdGVDb2xvck1hcD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX2NvbG9yTWFwO2UmJmUuYmFzZVRleHR1cmUmJihlLl91cGRhdGVJRCsrLGUuYmFzZVRleHR1cmUuZW1pdChcInVwZGF0ZVwiLGUuYmFzZVRleHR1cmUpLHRoaXMuY29sb3JNYXA9ZSl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24odCl7dGhpcy5fY29sb3JNYXAmJnRoaXMuX2NvbG9yTWFwLmRlc3Ryb3kodCksZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufSh0LkZpbHRlciksUD1uLE09XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzMgb3JpZ2luYWxDb2xvcjtcXG51bmlmb3JtIHZlYzMgbmV3Q29sb3I7XFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIHZlYzQgY3VycmVudENvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMyBjb2xvckRpZmYgPSBvcmlnaW5hbENvbG9yIC0gKGN1cnJlbnRDb2xvci5yZ2IgLyBtYXgoY3VycmVudENvbG9yLmEsIDAuMDAwMDAwMDAwMSkpO1xcbiAgICBmbG9hdCBjb2xvckRpc3RhbmNlID0gbGVuZ3RoKGNvbG9yRGlmZik7XFxuICAgIGZsb2F0IGRvUmVwbGFjZSA9IHN0ZXAoY29sb3JEaXN0YW5jZSwgZXBzaWxvbik7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KGN1cnJlbnRDb2xvci5yZ2IsIChuZXdDb2xvciArIGNvbG9yRGlmZikgKiBjdXJyZW50Q29sb3IuYSwgZG9SZXBsYWNlKSwgY3VycmVudENvbG9yLmEpO1xcbn1cXG5cIixSPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuLHIpe3ZvaWQgMD09PXQmJih0PTE2NzExNjgwKSx2b2lkIDA9PT1uJiYobj0wKSx2b2lkIDA9PT1yJiYocj0uNCksZS5jYWxsKHRoaXMsUCxNKSx0aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3I9bmV3IEZsb2F0MzJBcnJheSgzKSx0aGlzLnVuaWZvcm1zLm5ld0NvbG9yPW5ldyBGbG9hdDMyQXJyYXkoMyksdGhpcy5vcmlnaW5hbENvbG9yPXQsdGhpcy5uZXdDb2xvcj1uLHRoaXMuZXBzaWxvbj1yfWUmJihuLl9fcHJvdG9fXz1lKSxuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXtvcmlnaW5hbENvbG9yOntjb25maWd1cmFibGU6ITB9LG5ld0NvbG9yOntjb25maWd1cmFibGU6ITB9LGVwc2lsb246e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLm9yaWdpbmFsQ29sb3Iuc2V0PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcjtcIm51bWJlclwiPT10eXBlb2YgZT8odC51dGlscy5oZXgycmdiKGUsbiksdGhpcy5fb3JpZ2luYWxDb2xvcj1lKTooblswXT1lWzBdLG5bMV09ZVsxXSxuWzJdPWVbMl0sdGhpcy5fb3JpZ2luYWxDb2xvcj10LnV0aWxzLnJnYjJoZXgobikpfSxyLm9yaWdpbmFsQ29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29yaWdpbmFsQ29sb3J9LHIubmV3Q29sb3Iuc2V0PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMudW5pZm9ybXMubmV3Q29sb3I7XCJudW1iZXJcIj09dHlwZW9mIGU/KHQudXRpbHMuaGV4MnJnYihlLG4pLHRoaXMuX25ld0NvbG9yPWUpOihuWzBdPWVbMF0sblsxXT1lWzFdLG5bMl09ZVsyXSx0aGlzLl9uZXdDb2xvcj10LnV0aWxzLnJnYjJoZXgobikpfSxyLm5ld0NvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9uZXdDb2xvcn0sci5lcHNpbG9uLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmVwc2lsb249ZX0sci5lcHNpbG9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVwc2lsb259LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSxqPW4sTD1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWMyIHRleGVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IG1hdHJpeFs5XTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgdmVjNCBjMTEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSB0ZXhlbFNpemUpOyAvLyB0b3AgbGVmdFxcbiAgIHZlYzQgYzEyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gdGV4ZWxTaXplLnkpKTsgLy8gdG9wIGNlbnRlclxcbiAgIHZlYzQgYzEzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkgLSB0ZXhlbFNpemUueSkpOyAvLyB0b3AgcmlnaHRcXG5cXG4gICB2ZWM0IGMyMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55KSk7IC8vIG1pZCBsZWZ0XFxuICAgdmVjNCBjMjIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyAvLyBtaWQgY2VudGVyXFxuICAgdmVjNCBjMjMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSkpOyAvLyBtaWQgcmlnaHRcXG5cXG4gICB2ZWM0IGMzMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55ICsgdGV4ZWxTaXplLnkpKTsgLy8gYm90dG9tIGxlZnRcXG4gICB2ZWM0IGMzMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIHRleGVsU2l6ZS55KSk7IC8vIGJvdHRvbSBjZW50ZXJcXG4gICB2ZWM0IGMzMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHRleGVsU2l6ZSk7IC8vIGJvdHRvbSByaWdodFxcblxcbiAgIGdsX0ZyYWdDb2xvciA9XFxuICAgICAgIGMxMSAqIG1hdHJpeFswXSArIGMxMiAqIG1hdHJpeFsxXSArIGMxMyAqIG1hdHJpeFsyXSArXFxuICAgICAgIGMyMSAqIG1hdHJpeFszXSArIGMyMiAqIG1hdHJpeFs0XSArIGMyMyAqIG1hdHJpeFs1XSArXFxuICAgICAgIGMzMSAqIG1hdHJpeFs2XSArIGMzMiAqIG1hdHJpeFs3XSArIGMzMyAqIG1hdHJpeFs4XTtcXG5cXG4gICBnbF9GcmFnQ29sb3IuYSA9IGMyMi5hO1xcbn1cXG5cIixrPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCxuLHIpe3ZvaWQgMD09PW4mJihuPTIwMCksdm9pZCAwPT09ciYmKHI9MjAwKSxlLmNhbGwodGhpcyxqLEwpLHRoaXMudW5pZm9ybXMudGV4ZWxTaXplPW5ldyBGbG9hdDMyQXJyYXkoMiksdGhpcy51bmlmb3Jtcy5tYXRyaXg9bmV3IEZsb2F0MzJBcnJheSg5KSx2b2lkIDAhPT10JiYodGhpcy5tYXRyaXg9dCksdGhpcy53aWR0aD1uLHRoaXMuaGVpZ2h0PXJ9ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e21hdHJpeDp7Y29uZmlndXJhYmxlOiEwfSx3aWR0aDp7Y29uZmlndXJhYmxlOiEwfSxoZWlnaHQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLm1hdHJpeC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5tYXRyaXh9LG4ubWF0cml4LnNldD1mdW5jdGlvbihlKXt2YXIgdD10aGlzO2UuZm9yRWFjaChmdW5jdGlvbihlLG4pe3JldHVybiB0LnVuaWZvcm1zLm1hdHJpeFtuXT1lfSl9LG4ud2lkdGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIDEvdGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMF19LG4ud2lkdGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzBdPTEvZX0sbi5oZWlnaHQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIDEvdGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMV19LG4uaGVpZ2h0LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVsxXT0xL2V9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSxJPW4sRT1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZmxvYXQgbHVtID0gbGVuZ3RoKHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZC54eSkucmdiKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xcblxcbiAgICBpZiAobHVtIDwgMS4wMClcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCArIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjc1KVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnksIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuNTApXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSAtIDUuMCwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC4zKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG59XFxuXCIsQj1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KCl7ZS5jYWxsKHRoaXMsSSxFKX1yZXR1cm4gZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdH0odC5GaWx0ZXIpLFg9bixxPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxuY29uc3QgZmxvYXQgU1FSVF8yID0gMS40MTQyMTM7XFxuXFxuY29uc3QgZmxvYXQgbGlnaHQgPSAxLjA7XFxuXFxudW5pZm9ybSBmbG9hdCBjdXJ2YXR1cmU7XFxudW5pZm9ybSBmbG9hdCBsaW5lV2lkdGg7XFxudW5pZm9ybSBmbG9hdCBsaW5lQ29udHJhc3Q7XFxudW5pZm9ybSBib29sIHZlcnRpY2FsTGluZTtcXG51bmlmb3JtIGZsb2F0IG5vaXNlO1xcbnVuaWZvcm0gZmxvYXQgbm9pc2VTaXplO1xcblxcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZztcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdBbHBoYTtcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdCbHVyO1xcblxcbnVuaWZvcm0gZmxvYXQgc2VlZDtcXG51bmlmb3JtIGZsb2F0IHRpbWU7XFxuXFxuZmxvYXQgcmFuZCh2ZWMyIGNvKSB7XFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGNvLnh5LCB2ZWMyKDEyLjk4OTgsIDc4LjIzMykpKSAqIDQzNzU4LjU0NTMpO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgcGl4ZWxDb29yZCA9IHZUZXh0dXJlQ29vcmQueHkgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgICB2ZWMyIGNvb3JkID0gcGl4ZWxDb29yZCAvIGRpbWVuc2lvbnM7XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMihjb29yZCAtIHZlYzIoMC41LCAwLjUpKTtcXG5cXG4gICAgZmxvYXQgX2MgPSBjdXJ2YXR1cmUgPiAwLiA/IGN1cnZhdHVyZSA6IDEuO1xcbiAgICBmbG9hdCBrID0gY3VydmF0dXJlID4gMC4gPyhsZW5ndGgoZGlyICogZGlyKSAqIDAuMjUgKiBfYyAqIF9jICsgMC45MzUgKiBfYykgOiAxLjtcXG4gICAgdmVjMiB1diA9IGRpciAqIGs7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzMgcmdiID0gZ2xfRnJhZ0NvbG9yLnJnYjtcXG5cXG5cXG4gICAgaWYgKG5vaXNlID4gMC4wICYmIG5vaXNlU2l6ZSA+IDAuMClcXG4gICAge1xcbiAgICAgICAgcGl4ZWxDb29yZC54ID0gZmxvb3IocGl4ZWxDb29yZC54IC8gbm9pc2VTaXplKTtcXG4gICAgICAgIHBpeGVsQ29vcmQueSA9IGZsb29yKHBpeGVsQ29vcmQueSAvIG5vaXNlU2l6ZSk7XFxuICAgICAgICBmbG9hdCBfbm9pc2UgPSByYW5kKHBpeGVsQ29vcmQgKiBub2lzZVNpemUgKiBzZWVkKSAtIDAuNTtcXG4gICAgICAgIHJnYiArPSBfbm9pc2UgKiBub2lzZTtcXG4gICAgfVxcblxcbiAgICBpZiAobGluZVdpZHRoID4gMC4wKSB7XFxuICAgICAgICBmbG9hdCB2ID0gKHZlcnRpY2FsTGluZSA/IHV2LnggKiBkaW1lbnNpb25zLnggOiB1di55ICogZGltZW5zaW9ucy55KSAqIG1pbigxLjAsIDIuMCAvIGxpbmVXaWR0aCApIC8gX2M7XFxuICAgICAgICBmbG9hdCBqID0gMS4gKyBjb3ModiAqIDEuMiAtIHRpbWUpICogMC41ICogbGluZUNvbnRyYXN0O1xcbiAgICAgICAgcmdiICo9IGo7XFxuICAgICAgICBmbG9hdCBzZWdtZW50ID0gdmVydGljYWxMaW5lID8gbW9kKChkaXIueCArIC41KSAqIGRpbWVuc2lvbnMueCwgNC4pIDogbW9kKChkaXIueSArIC41KSAqIGRpbWVuc2lvbnMueSwgNC4pO1xcbiAgICAgICAgcmdiICo9IDAuOTkgKyBjZWlsKHNlZ21lbnQpICogMC4wMTU7XFxuICAgIH1cXG5cXG4gICAgaWYgKHZpZ25ldHRpbmcgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IG91dHRlciA9IFNRUlRfMiAtIHZpZ25ldHRpbmcgKiBTUVJUXzI7XFxuICAgICAgICBmbG9hdCBkYXJrZXIgPSBjbGFtcCgob3V0dGVyIC0gbGVuZ3RoKGRpcikgKiBTUVJUXzIpIC8gKCAwLjAwMDAxICsgdmlnbmV0dGluZ0JsdXIgKiBTUVJUXzIpLCAwLjAsIDEuMCk7XFxuICAgICAgICByZ2IgKj0gZGFya2VyICsgKDEuMCAtIGRhcmtlcikgKiAoMS4wIC0gdmlnbmV0dGluZ0FscGhhKTtcXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IucmdiID0gcmdiO1xcbn1cXG5cIixOPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7ZS5jYWxsKHRoaXMsWCxxKSx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnM9bmV3IEZsb2F0MzJBcnJheSgyKSx0aGlzLnRpbWU9MCx0aGlzLnNlZWQ9MCxPYmplY3QuYXNzaWduKHRoaXMse2N1cnZhdHVyZToxLGxpbmVXaWR0aDoxLGxpbmVDb250cmFzdDouMjUsdmVydGljYWxMaW5lOiExLG5vaXNlOjAsbm9pc2VTaXplOjEsc2VlZDowLHZpZ25ldHRpbmc6LjMsdmlnbmV0dGluZ0FscGhhOjEsdmlnbmV0dGluZ0JsdXI6LjMsdGltZTowfSx0KX1lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17Y3VydmF0dXJlOntjb25maWd1cmFibGU6ITB9LGxpbmVXaWR0aDp7Y29uZmlndXJhYmxlOiEwfSxsaW5lQ29udHJhc3Q6e2NvbmZpZ3VyYWJsZTohMH0sdmVydGljYWxMaW5lOntjb25maWd1cmFibGU6ITB9LG5vaXNlOntjb25maWd1cmFibGU6ITB9LG5vaXNlU2l6ZTp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdBbHBoYTp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nQmx1cjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuLHIpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCx0aGlzLnVuaWZvcm1zLnNlZWQ9dGhpcy5zZWVkLHRoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sbi5jdXJ2YXR1cmUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY3VydmF0dXJlPWV9LG4uY3VydmF0dXJlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmN1cnZhdHVyZX0sbi5saW5lV2lkdGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMubGluZVdpZHRoPWV9LG4ubGluZVdpZHRoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxpbmVXaWR0aH0sbi5saW5lQ29udHJhc3Quc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMubGluZUNvbnRyYXN0PWV9LG4ubGluZUNvbnRyYXN0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxpbmVDb250cmFzdH0sbi52ZXJ0aWNhbExpbmUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudmVydGljYWxMaW5lPWV9LG4udmVydGljYWxMaW5lLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZlcnRpY2FsTGluZX0sbi5ub2lzZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ub2lzZT1lfSxuLm5vaXNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm5vaXNlfSxuLm5vaXNlU2l6ZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ub2lzZVNpemU9ZX0sbi5ub2lzZVNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2VTaXplfSxuLnZpZ25ldHRpbmcuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZz1lfSxuLnZpZ25ldHRpbmcuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ30sbi52aWduZXR0aW5nQWxwaGEuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhPWV9LG4udmlnbmV0dGluZ0FscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdBbHBoYX0sbi52aWduZXR0aW5nQmx1ci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQmx1cj1lfSxuLnZpZ25ldHRpbmdCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksVz1uLEc9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSBmbG9hdCBzY2FsZTtcXG5cXG5mbG9hdCBwYXR0ZXJuKClcXG57XFxuICAgZmxvYXQgcyA9IHNpbihhbmdsZSksIGMgPSBjb3MoYW5nbGUpO1xcbiAgIHZlYzIgdGV4ID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHk7XFxuICAgdmVjMiBwb2ludCA9IHZlYzIoXFxuICAgICAgIGMgKiB0ZXgueCAtIHMgKiB0ZXgueSxcXG4gICAgICAgcyAqIHRleC54ICsgYyAqIHRleC55XFxuICAgKSAqIHNjYWxlO1xcbiAgIHJldHVybiAoc2luKHBvaW50LngpICogc2luKHBvaW50LnkpKSAqIDQuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgZmxvYXQgYXZlcmFnZSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xcbiAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhhdmVyYWdlICogMTAuMCAtIDUuMCArIHBhdHRlcm4oKSksIGNvbG9yLmEpO1xcbn1cXG5cIixLPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCxuKXt2b2lkIDA9PT10JiYodD0xKSx2b2lkIDA9PT1uJiYobj01KSxlLmNhbGwodGhpcyxXLEcpLHRoaXMuc2NhbGU9dCx0aGlzLmFuZ2xlPW59ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e3NjYWxlOntjb25maWd1cmFibGU6ITB9LGFuZ2xlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5zY2FsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY2FsZX0sbi5zY2FsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zY2FsZT1lfSxuLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFuZ2xlfSxuLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFuZ2xlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSxZPW4sUT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLFU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuKXtuJiZuLmNvbnN0cnVjdG9yIT09T2JqZWN0JiYoY29uc29sZS53YXJuKFwiRHJvcFNoYWRvd0ZpbHRlciBub3cgdXNlcyBvcHRpb25zIGluc3RlYWQgb2YgKHJvdGF0aW9uLCBkaXN0YW5jZSwgYmx1ciwgY29sb3IsIGFscGhhKVwiKSxuPXtyb3RhdGlvbjpufSx2b2lkIDAhPT1hcmd1bWVudHNbMV0mJihuLmRpc3RhbmNlPWFyZ3VtZW50c1sxXSksdm9pZCAwIT09YXJndW1lbnRzWzJdJiYobi5ibHVyPWFyZ3VtZW50c1syXSksdm9pZCAwIT09YXJndW1lbnRzWzNdJiYobi5jb2xvcj1hcmd1bWVudHNbM10pLHZvaWQgMCE9PWFyZ3VtZW50c1s0XSYmKG4uYWxwaGE9YXJndW1lbnRzWzRdKSksbj1PYmplY3QuYXNzaWduKHtyb3RhdGlvbjo0NSxkaXN0YW5jZTo1LGNvbG9yOjAsYWxwaGE6LjUsc2hhZG93T25seTohMSxrZXJuZWxzOm51bGwsYmx1cjoyLHF1YWxpdHk6MyxwaXhlbFNpemU6MSxyZXNvbHV0aW9uOnQuc2V0dGluZ3MuUkVTT0xVVElPTn0sbiksZS5jYWxsKHRoaXMpO3ZhciByPW4ua2VybmVscyxvPW4uYmx1cixpPW4ucXVhbGl0eSxsPW4ucGl4ZWxTaXplLHM9bi5yZXNvbHV0aW9uO3RoaXMuX3RpbnRGaWx0ZXI9bmV3IHQuRmlsdGVyKFksUSksdGhpcy5fdGludEZpbHRlci51bmlmb3Jtcy5jb2xvcj1uZXcgRmxvYXQzMkFycmF5KDQpLHRoaXMuX3RpbnRGaWx0ZXIucmVzb2x1dGlvbj1zLHRoaXMuX2JsdXJGaWx0ZXI9cj9uZXcgYShyKTpuZXcgYShvLGkpLHRoaXMucGl4ZWxTaXplPWwsdGhpcy5yZXNvbHV0aW9uPXMsdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IHQuTWF0cml4O3ZhciB1PW4uc2hhZG93T25seSxjPW4ucm90YXRpb24sZj1uLmRpc3RhbmNlLGg9bi5hbHBoYSxwPW4uY29sb3I7dGhpcy5zaGFkb3dPbmx5PXUsdGhpcy5yb3RhdGlvbj1jLHRoaXMuZGlzdGFuY2U9Zix0aGlzLmFscGhhPWgsdGhpcy5jb2xvcj1wLHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX1lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17cmVzb2x1dGlvbjp7Y29uZmlndXJhYmxlOiEwfSxkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxrZXJuZWxzOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH0scXVhbGl0eTp7Y29uZmlndXJhYmxlOiEwfSxwaXhlbFNpemU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt2YXIgbz1lLmdldFJlbmRlclRhcmdldCgpO28udHJhbnNmb3JtPXRoaXMudGFyZ2V0VHJhbnNmb3JtLHRoaXMuX3RpbnRGaWx0ZXIuYXBwbHkoZSx0LG8sITApLG8udHJhbnNmb3JtPW51bGwsdGhpcy5fYmx1ckZpbHRlci5hcHBseShlLG8sbixyKSwhMCE9PXRoaXMuc2hhZG93T25seSYmZS5hcHBseUZpbHRlcih0aGlzLHQsbiwhMSksZS5yZXR1cm5SZW5kZXJUYXJnZXQobyl9LG4ucHJvdG90eXBlLl91cGRhdGVQYWRkaW5nPWZ1bmN0aW9uKCl7dGhpcy5wYWRkaW5nPXRoaXMuZGlzdGFuY2UrMip0aGlzLmJsdXJ9LG4ucHJvdG90eXBlLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnRhcmdldFRyYW5zZm9ybS50eD10aGlzLmRpc3RhbmNlKk1hdGguY29zKHRoaXMuYW5nbGUpLHRoaXMudGFyZ2V0VHJhbnNmb3JtLnR5PXRoaXMuZGlzdGFuY2UqTWF0aC5zaW4odGhpcy5hbmdsZSl9LHIucmVzb2x1dGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVzb2x1dGlvbn0sci5yZXNvbHV0aW9uLnNldD1mdW5jdGlvbihlKXt0aGlzLl9yZXNvbHV0aW9uPWUsdGhpcy5fdGludEZpbHRlciYmKHRoaXMuX3RpbnRGaWx0ZXIucmVzb2x1dGlvbj1lKSx0aGlzLl9ibHVyRmlsdGVyJiYodGhpcy5fYmx1ckZpbHRlci5yZXNvbHV0aW9uPWUpfSxyLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sci5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fZGlzdGFuY2U9ZSx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LHIucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvdC5ERUdfVE9fUkFEfSxyLnJvdGF0aW9uLnNldD1mdW5jdGlvbihlKXt0aGlzLmFuZ2xlPWUqdC5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxyLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxyLmFscGhhLnNldD1mdW5jdGlvbihlKXt0aGlzLl90aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhPWV9LHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHQudXRpbHMucmdiMmhleCh0aGlzLl90aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dC51dGlscy5oZXgycmdiKGUsdGhpcy5fdGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LHIua2VybmVscy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1ckZpbHRlci5rZXJuZWxzfSxyLmtlcm5lbHMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJGaWx0ZXIua2VybmVscz1lfSxyLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JsdXJGaWx0ZXIuYmx1cn0sci5ibHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLl9ibHVyRmlsdGVyLmJsdXI9ZSx0aGlzLl91cGRhdGVQYWRkaW5nKCl9LHIucXVhbGl0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1ckZpbHRlci5xdWFsaXR5fSxyLnF1YWxpdHkuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJGaWx0ZXIucXVhbGl0eT1lfSxyLnBpeGVsU2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1ckZpbHRlci5waXhlbFNpemV9LHIucGl4ZWxTaXplLnNldD1mdW5jdGlvbihlKXt0aGlzLl9ibHVyRmlsdGVyLnBpeGVsU2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufSh0LkZpbHRlciksWj1uLFY9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IHN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXHR2ZWMyIG9uZVBpeGVsID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhKTtcXG5cXG5cXHR2ZWM0IGNvbG9yO1xcblxcblxcdGNvbG9yLnJnYiA9IHZlYzMoMC41KTtcXG5cXG5cXHRjb2xvciAtPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSBvbmVQaXhlbCkgKiBzdHJlbmd0aDtcXG5cXHRjb2xvciArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBvbmVQaXhlbCkgKiBzdHJlbmd0aDtcXG5cXG5cXHRjb2xvci5yZ2IgPSB2ZWMzKChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wKTtcXG5cXG5cXHRmbG9hdCBhbHBoYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG5cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiAqIGFscGhhLCBhbHBoYSk7XFxufVxcblwiLEg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXt2b2lkIDA9PT10JiYodD01KSxlLmNhbGwodGhpcyxaLFYpLHRoaXMuc3RyZW5ndGg9dH1lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17c3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxuLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSwkPW4sSj1cIi8vIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxudW5pZm9ybSBmbG9hdCBhc3BlY3Q7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgZGlzcGxhY2VtZW50TWFwO1xcbnVuaWZvcm0gZmxvYXQgb2Zmc2V0O1xcbnVuaWZvcm0gZmxvYXQgc2luRGlyO1xcbnVuaWZvcm0gZmxvYXQgY29zRGlyO1xcbnVuaWZvcm0gaW50IGZpbGxNb2RlO1xcblxcbnVuaWZvcm0gZmxvYXQgc2VlZDtcXG51bmlmb3JtIHZlYzIgcmVkO1xcbnVuaWZvcm0gdmVjMiBncmVlbjtcXG51bmlmb3JtIHZlYzIgYmx1ZTtcXG5cXG5jb25zdCBpbnQgVFJBTlNQQVJFTlQgPSAwO1xcbmNvbnN0IGludCBPUklHSU5BTCA9IDE7XFxuY29uc3QgaW50IExPT1AgPSAyO1xcbmNvbnN0IGludCBDTEFNUCA9IDM7XFxuY29uc3QgaW50IE1JUlJPUiA9IDQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gKHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5KSAvIGRpbWVuc2lvbnM7XFxuXFxuICAgIGlmIChjb29yZC54ID4gMS4wIHx8IGNvb3JkLnkgPiAxLjApIHtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICBmbG9hdCBjeCA9IGNvb3JkLnggLSAwLjU7XFxuICAgIGZsb2F0IGN5ID0gKGNvb3JkLnkgLSAwLjUpICogYXNwZWN0O1xcbiAgICBmbG9hdCBueSA9ICgtc2luRGlyICogY3ggKyBjb3NEaXIgKiBjeSkgLyBhc3BlY3QgKyAwLjU7XFxuXFxuICAgIC8vIGRpc3BsYWNlbWVudE1hcDogcmVwZWF0XFxuICAgIC8vIG55ID0gbnkgPiAxLjAgPyBueSAtIDEuMCA6IChueSA8IDAuMCA/IDEuMCArIG55IDogbnkpO1xcblxcbiAgICAvLyBkaXNwbGFjZW1lbnRNYXA6IG1pcnJvclxcbiAgICBueSA9IG55ID4gMS4wID8gMi4wIC0gbnkgOiAobnkgPCAwLjAgPyAtbnkgOiBueSk7XFxuXFxuICAgIHZlYzQgZGMgPSB0ZXh0dXJlMkQoZGlzcGxhY2VtZW50TWFwLCB2ZWMyKDAuNSwgbnkpKTtcXG5cXG4gICAgZmxvYXQgZGlzcGxhY2VtZW50ID0gKGRjLnIgLSBkYy5nKSAqIChvZmZzZXQgLyBmaWx0ZXJBcmVhLngpO1xcblxcbiAgICBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKyB2ZWMyKGNvc0RpciAqIGRpc3BsYWNlbWVudCwgc2luRGlyICogZGlzcGxhY2VtZW50ICogYXNwZWN0KTtcXG5cXG4gICAgaWYgKGZpbGxNb2RlID09IENMQU1QKSB7XFxuICAgICAgICBjb29yZCA9IGNsYW1wKGNvb3JkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgaWYoIGNvb3JkLnggPiBmaWx0ZXJDbGFtcC56ICkge1xcbiAgICAgICAgICAgIGlmIChmaWxsTW9kZSA9PSBPUklHSU5BTCkge1xcbiAgICAgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PSBMT09QKSB7XFxuICAgICAgICAgICAgICAgIGNvb3JkLnggLT0gZmlsdGVyQ2xhbXAuejtcXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGxNb2RlID09IE1JUlJPUikge1xcbiAgICAgICAgICAgICAgICBjb29yZC54ID0gZmlsdGVyQ2xhbXAueiAqIDIuMCAtIGNvb3JkLng7XFxuICAgICAgICAgICAgfSBlbHNlIHtcXG4gICAgICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLiwgMC4sIDAuLCAwLik7XFxuICAgICAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9IGVsc2UgaWYoIGNvb3JkLnggPCBmaWx0ZXJDbGFtcC54ICkge1xcbiAgICAgICAgICAgIGlmIChmaWxsTW9kZSA9PSBPUklHSU5BTCkge1xcbiAgICAgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PSBMT09QKSB7XFxuICAgICAgICAgICAgICAgIGNvb3JkLnggKz0gZmlsdGVyQ2xhbXAuejtcXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGxNb2RlID09IE1JUlJPUikge1xcbiAgICAgICAgICAgICAgICBjb29yZC54ICo9IC1maWx0ZXJDbGFtcC56O1xcbiAgICAgICAgICAgIH0gZWxzZSB7XFxuICAgICAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4sIDAuLCAwLiwgMC4pO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcblxcbiAgICAgICAgaWYoIGNvb3JkLnkgPiBmaWx0ZXJDbGFtcC53ICkge1xcbiAgICAgICAgICAgIGlmIChmaWxsTW9kZSA9PSBPUklHSU5BTCkge1xcbiAgICAgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PSBMT09QKSB7XFxuICAgICAgICAgICAgICAgIGNvb3JkLnkgLT0gZmlsdGVyQ2xhbXAudztcXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGxNb2RlID09IE1JUlJPUikge1xcbiAgICAgICAgICAgICAgICBjb29yZC55ID0gZmlsdGVyQ2xhbXAudyAqIDIuMCAtIGNvb3JkLnk7XFxuICAgICAgICAgICAgfSBlbHNlIHtcXG4gICAgICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLiwgMC4sIDAuLCAwLik7XFxuICAgICAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9IGVsc2UgaWYoIGNvb3JkLnkgPCBmaWx0ZXJDbGFtcC55ICkge1xcbiAgICAgICAgICAgIGlmIChmaWxsTW9kZSA9PSBPUklHSU5BTCkge1xcbiAgICAgICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PSBMT09QKSB7XFxuICAgICAgICAgICAgICAgIGNvb3JkLnkgKz0gZmlsdGVyQ2xhbXAudztcXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGxNb2RlID09IE1JUlJPUikge1xcbiAgICAgICAgICAgICAgICBjb29yZC55ICo9IC1maWx0ZXJDbGFtcC53O1xcbiAgICAgICAgICAgIH0gZWxzZSB7XFxuICAgICAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4sIDAuLCAwLiwgMC4pO1xcbiAgICAgICAgICAgICAgICByZXR1cm47XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvci5yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCArIHJlZCAqICgxLjAgLSBzZWVkICogMC40KSAvIGZpbHRlckFyZWEueHkpLnI7XFxuICAgIGdsX0ZyYWdDb2xvci5nID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCArIGdyZWVuICogKDEuMCAtIHNlZWQgKiAwLjMpIC8gZmlsdGVyQXJlYS54eSkuZztcXG4gICAgZ2xfRnJhZ0NvbG9yLmIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNvb3JkICsgYmx1ZSAqICgxLjAgLSBzZWVkICogMC4yKSAvIGZpbHRlckFyZWEueHkpLmI7XFxuICAgIGdsX0ZyYWdDb2xvci5hID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCkuYTtcXG59XFxuXCIsZWU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuKXt2b2lkIDA9PT1uJiYobj17fSksZS5jYWxsKHRoaXMsJCxKKSx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnM9bmV3IEZsb2F0MzJBcnJheSgyKSxuPU9iamVjdC5hc3NpZ24oe3NsaWNlczo1LG9mZnNldDoxMDAsZGlyZWN0aW9uOjAsZmlsbE1vZGU6MCxhdmVyYWdlOiExLHNlZWQ6MCxyZWQ6WzAsMF0sZ3JlZW46WzAsMF0sYmx1ZTpbMCwwXSxtaW5TaXplOjgsc2FtcGxlU2l6ZTo1MTJ9LG4pLHRoaXMuZGlyZWN0aW9uPW4uZGlyZWN0aW9uLHRoaXMucmVkPW4ucmVkLHRoaXMuZ3JlZW49bi5ncmVlbix0aGlzLmJsdWU9bi5ibHVlLHRoaXMub2Zmc2V0PW4ub2Zmc2V0LHRoaXMuZmlsbE1vZGU9bi5maWxsTW9kZSx0aGlzLmF2ZXJhZ2U9bi5hdmVyYWdlLHRoaXMuc2VlZD1uLnNlZWQsdGhpcy5taW5TaXplPW4ubWluU2l6ZSx0aGlzLnNhbXBsZVNpemU9bi5zYW1wbGVTaXplLHRoaXMuX2NhbnZhcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuX2NhbnZhcy53aWR0aD00LHRoaXMuX2NhbnZhcy5oZWlnaHQ9dGhpcy5zYW1wbGVTaXplLHRoaXMudGV4dHVyZT10LlRleHR1cmUuZnJvbUNhbnZhcyh0aGlzLl9jYW52YXMsdC5TQ0FMRV9NT0RFUy5ORUFSRVNUKSx0aGlzLl9zbGljZXM9MCx0aGlzLnNsaWNlcz1uLnNsaWNlc31lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17c2l6ZXM6e2NvbmZpZ3VyYWJsZTohMH0sb2Zmc2V0czp7Y29uZmlndXJhYmxlOiEwfSxzbGljZXM6e2NvbmZpZ3VyYWJsZTohMH0sZGlyZWN0aW9uOntjb25maWd1cmFibGU6ITB9LHJlZDp7Y29uZmlndXJhYmxlOiEwfSxncmVlbjp7Y29uZmlndXJhYmxlOiEwfSxibHVlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dmFyIG89dC5zb3VyY2VGcmFtZS53aWR0aCxpPXQuc291cmNlRnJhbWUuaGVpZ2h0O3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT1vLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT1pLHRoaXMudW5pZm9ybXMuYXNwZWN0PWkvbyx0aGlzLnVuaWZvcm1zLnNlZWQ9dGhpcy5zZWVkLHRoaXMudW5pZm9ybXMub2Zmc2V0PXRoaXMub2Zmc2V0LHRoaXMudW5pZm9ybXMuZmlsbE1vZGU9dGhpcy5maWxsTW9kZSxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxuLnByb3RvdHlwZS5fcmFuZG9taXplU2l6ZXM9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9zaXplcyx0PXRoaXMuX3NsaWNlcy0xLG49dGhpcy5zYW1wbGVTaXplLHI9TWF0aC5taW4odGhpcy5taW5TaXplL24sLjkvdGhpcy5fc2xpY2VzKTtpZih0aGlzLmF2ZXJhZ2Upe2Zvcih2YXIgbz10aGlzLl9zbGljZXMsaT0xLGw9MDtsPHQ7bCsrKXt2YXIgcz1pLyhvLWwpLGE9TWF0aC5tYXgocyooMS0uNipNYXRoLnJhbmRvbSgpKSxyKTtlW2xdPWEsaS09YX1lW3RdPWl9ZWxzZXtmb3IodmFyIHU9MSxjPU1hdGguc3FydCgxL3RoaXMuX3NsaWNlcyksZj0wO2Y8dDtmKyspe3ZhciBoPU1hdGgubWF4KGMqdSpNYXRoLnJhbmRvbSgpLHIpO2VbZl09aCx1LT1ofWVbdF09dX10aGlzLnNodWZmbGUoKX0sbi5wcm90b3R5cGUuc2h1ZmZsZT1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9zaXplcyx0PXRoaXMuX3NsaWNlcy0xO3Q+MDt0LS0pe3ZhciBuPU1hdGgucmFuZG9tKCkqdD4+MCxyPWVbdF07ZVt0XT1lW25dLGVbbl09cn19LG4ucHJvdG90eXBlLl9yYW5kb21pemVPZmZzZXRzPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPTA7ZTx0aGlzLl9zbGljZXM7ZSsrKXRoaXMuX29mZnNldHNbZV09TWF0aC5yYW5kb20oKSooTWF0aC5yYW5kb20oKTwuNT8tMToxKX0sbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuX3JhbmRvbWl6ZVNpemVzKCksdGhpcy5fcmFuZG9taXplT2Zmc2V0cygpLHRoaXMucmVkcmF3KCl9LG4ucHJvdG90eXBlLnJlZHJhdz1mdW5jdGlvbigpe3ZhciBlLHQ9dGhpcy5zYW1wbGVTaXplLG49dGhpcy50ZXh0dXJlLHI9dGhpcy5fY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtyLmNsZWFyUmVjdCgwLDAsOCx0KTtmb3IodmFyIG89MCxpPTA7aTx0aGlzLl9zbGljZXM7aSsrKXtlPU1hdGguZmxvb3IoMjU2KnRoaXMuX29mZnNldHNbaV0pO3ZhciBsPXRoaXMuX3NpemVzW2ldKnQscz1lPjA/ZTowLGE9ZTwwPy1lOjA7ci5maWxsU3R5bGU9XCJyZ2JhKFwiK3MrXCIsIFwiK2ErXCIsIDAsIDEpXCIsci5maWxsUmVjdCgwLG8+PjAsdCxsKzE+PjApLG8rPWx9bi5iYXNlVGV4dHVyZS51cGRhdGUoKSx0aGlzLnVuaWZvcm1zLmRpc3BsYWNlbWVudE1hcD1ufSxyLnNpemVzLnNldD1mdW5jdGlvbihlKXtmb3IodmFyIHQ9TWF0aC5taW4odGhpcy5fc2xpY2VzLGUubGVuZ3RoKSxuPTA7bjx0O24rKyl0aGlzLl9zaXplc1tuXT1lW25dfSxyLnNpemVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9zaXplc30sci5vZmZzZXRzLnNldD1mdW5jdGlvbihlKXtmb3IodmFyIHQ9TWF0aC5taW4odGhpcy5fc2xpY2VzLGUubGVuZ3RoKSxuPTA7bjx0O24rKyl0aGlzLl9vZmZzZXRzW25dPWVbbl19LHIub2Zmc2V0cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb2Zmc2V0c30sci5zbGljZXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NsaWNlc30sci5zbGljZXMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX3NsaWNlcyE9PWUmJih0aGlzLl9zbGljZXM9ZSx0aGlzLnVuaWZvcm1zLnNsaWNlcz1lLHRoaXMuX3NpemVzPXRoaXMudW5pZm9ybXMuc2xpY2VzV2lkdGg9bmV3IEZsb2F0MzJBcnJheShlKSx0aGlzLl9vZmZzZXRzPXRoaXMudW5pZm9ybXMuc2xpY2VzT2Zmc2V0PW5ldyBGbG9hdDMyQXJyYXkoZSksdGhpcy5yZWZyZXNoKCkpfSxyLmRpcmVjdGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlyZWN0aW9ufSxyLmRpcmVjdGlvbi5zZXQ9ZnVuY3Rpb24oZSl7aWYodGhpcy5fZGlyZWN0aW9uIT09ZSl7dGhpcy5fZGlyZWN0aW9uPWU7dmFyIG49ZSp0LkRFR19UT19SQUQ7dGhpcy51bmlmb3Jtcy5zaW5EaXI9TWF0aC5zaW4obiksdGhpcy51bmlmb3Jtcy5jb3NEaXI9TWF0aC5jb3Mobil9fSxyLnJlZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yZWR9LHIucmVkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJlZD1lfSxyLmdyZWVuLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyZWVufSxyLmdyZWVuLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmdyZWVuPWV9LHIuYmx1ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVlfSxyLmJsdWUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYmx1ZT1lfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy50ZXh0dXJlLmRlc3Ryb3koITApLHRoaXMudGV4dHVyZT1udWxsLHRoaXMuX2NhbnZhcz1udWxsLHRoaXMucmVkPW51bGwsdGhpcy5ncmVlbj1udWxsLHRoaXMuYmx1ZT1udWxsLHRoaXMuX3NpemVzPW51bGwsdGhpcy5fb2Zmc2V0cz1udWxsfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufSh0LkZpbHRlcik7ZWUuVFJBTlNQQVJFTlQ9MCxlZS5PUklHSU5BTD0xLGVlLkxPT1A9MixlZS5DTEFNUD0zLGVlLk1JUlJPUj00O3ZhciB0ZT1uLG5lPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGRpc3RhbmNlO1xcbnVuaWZvcm0gZmxvYXQgb3V0ZXJTdHJlbmd0aDtcXG51bmlmb3JtIGZsb2F0IGlubmVyU3RyZW5ndGg7XFxudW5pZm9ybSB2ZWM0IGdsb3dDb2xvcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxuY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0O1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIHZlYzIgcHggPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEueCwgMS4wIC8gZmlsdGVyQXJlYS55KTtcXG4gICAgdmVjNCBvd25Db2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgY3VyQ29sb3I7XFxuICAgIGZsb2F0IHRvdGFsQWxwaGEgPSAwLjA7XFxuICAgIGZsb2F0IG1heFRvdGFsQWxwaGEgPSAwLjA7XFxuICAgIGZsb2F0IGNvc0FuZ2xlO1xcbiAgICBmbG9hdCBzaW5BbmdsZTtcXG4gICAgdmVjMiBkaXNwbGFjZWQ7XFxuICAgIGZvciAoZmxvYXQgYW5nbGUgPSAwLjA7IGFuZ2xlIDw9IFBJICogMi4wOyBhbmdsZSArPSAlUVVBTElUWV9ESVNUJSkge1xcbiAgICAgICBjb3NBbmdsZSA9IGNvcyhhbmdsZSk7XFxuICAgICAgIHNpbkFuZ2xlID0gc2luKGFuZ2xlKTtcXG4gICAgICAgZm9yIChmbG9hdCBjdXJEaXN0YW5jZSA9IDEuMDsgY3VyRGlzdGFuY2UgPD0gJURJU1QlOyBjdXJEaXN0YW5jZSsrKSB7XFxuICAgICAgICAgICBkaXNwbGFjZWQueCA9IHZUZXh0dXJlQ29vcmQueCArIGNvc0FuZ2xlICogY3VyRGlzdGFuY2UgKiBweC54O1xcbiAgICAgICAgICAgZGlzcGxhY2VkLnkgPSB2VGV4dHVyZUNvb3JkLnkgKyBzaW5BbmdsZSAqIGN1ckRpc3RhbmNlICogcHgueTtcXG4gICAgICAgICAgIGN1ckNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcChkaXNwbGFjZWQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dykpO1xcbiAgICAgICAgICAgdG90YWxBbHBoYSArPSAoZGlzdGFuY2UgLSBjdXJEaXN0YW5jZSkgKiBjdXJDb2xvci5hO1xcbiAgICAgICAgICAgbWF4VG90YWxBbHBoYSArPSAoZGlzdGFuY2UgLSBjdXJEaXN0YW5jZSk7XFxuICAgICAgIH1cXG4gICAgfVxcbiAgICBtYXhUb3RhbEFscGhhID0gbWF4KG1heFRvdGFsQWxwaGEsIDAuMDAwMSk7XFxuXFxuICAgIG93bkNvbG9yLmEgPSBtYXgob3duQ29sb3IuYSwgMC4wMDAxKTtcXG4gICAgb3duQ29sb3IucmdiID0gb3duQ29sb3IucmdiIC8gb3duQ29sb3IuYTtcXG4gICAgZmxvYXQgb3V0ZXJHbG93QWxwaGEgPSAodG90YWxBbHBoYSAvIG1heFRvdGFsQWxwaGEpICAqIG91dGVyU3RyZW5ndGggKiAoMS4gLSBvd25Db2xvci5hKTtcXG4gICAgZmxvYXQgaW5uZXJHbG93QWxwaGEgPSAoKG1heFRvdGFsQWxwaGEgLSB0b3RhbEFscGhhKSAvIG1heFRvdGFsQWxwaGEpICogaW5uZXJTdHJlbmd0aCAqIG93bkNvbG9yLmE7XFxuICAgIGZsb2F0IHJlc3VsdEFscGhhID0gKG93bkNvbG9yLmEgKyBvdXRlckdsb3dBbHBoYSk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KG1peChvd25Db2xvci5yZ2IsIGdsb3dDb2xvci5yZ2IsIGlubmVyR2xvd0FscGhhIC8gb3duQ29sb3IuYSksIGdsb3dDb2xvci5yZ2IsIG91dGVyR2xvd0FscGhhIC8gcmVzdWx0QWxwaGEpICogcmVzdWx0QWxwaGEsIHJlc3VsdEFscGhhKTtcXG59XFxuXCIscmU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4scixvLGkpe3ZvaWQgMD09PXQmJih0PTEwKSx2b2lkIDA9PT1uJiYobj00KSx2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1vJiYobz0xNjc3NzIxNSksdm9pZCAwPT09aSYmKGk9LjEpLGUuY2FsbCh0aGlzLHRlLG5lLnJlcGxhY2UoLyVRVUFMSVRZX0RJU1QlL2dpLFwiXCIrKDEvaS90KS50b0ZpeGVkKDcpKS5yZXBsYWNlKC8lRElTVCUvZ2ksXCJcIit0LnRvRml4ZWQoNykpKSx0aGlzLnVuaWZvcm1zLmdsb3dDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCwxXSksdGhpcy5kaXN0YW5jZT10LHRoaXMuY29sb3I9byx0aGlzLm91dGVyU3RyZW5ndGg9bix0aGlzLmlubmVyU3RyZW5ndGg9cn1lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17Y29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0sb3V0ZXJTdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxpbm5lclN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdC51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dC51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5nbG93Q29sb3IpfSxyLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmRpc3RhbmNlfSxyLmRpc3RhbmNlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmRpc3RhbmNlPWV9LHIub3V0ZXJTdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vdXRlclN0cmVuZ3RofSxyLm91dGVyU3RyZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMub3V0ZXJTdHJlbmd0aD1lfSxyLmlubmVyU3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuaW5uZXJTdHJlbmd0aH0sci5pbm5lclN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmlubmVyU3RyZW5ndGg9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsciksbn0odC5GaWx0ZXIpLG9lPW4saWU9XCJ2ZWMzIG1vZDI4OSh2ZWMzIHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IG1vZDI4OSh2ZWM0IHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IHBlcm11dGUodmVjNCB4KVxcbntcXG4gICAgcmV0dXJuIG1vZDI4OSgoKHggKiAzNC4wKSArIDEuMCkgKiB4KTtcXG59XFxudmVjNCB0YXlsb3JJbnZTcXJ0KHZlYzQgcilcXG57XFxuICAgIHJldHVybiAxLjc5Mjg0MjkxNDAwMTU5IC0gMC44NTM3MzQ3MjA5NTMxNCAqIHI7XFxufVxcbnZlYzMgZmFkZSh2ZWMzIHQpXFxue1xcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYuMCAtIDE1LjApICsgMTAuMCk7XFxufVxcbi8vIENsYXNzaWMgUGVybGluIG5vaXNlLCBwZXJpb2RpYyB2YXJpYW50XFxuZmxvYXQgcG5vaXNlKHZlYzMgUCwgdmVjMyByZXApXFxue1xcbiAgICB2ZWMzIFBpMCA9IG1vZChmbG9vcihQKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0LCBtb2R1bG8gcGVyaW9kXFxuICAgIHZlYzMgUGkxID0gbW9kKFBpMCArIHZlYzMoMS4wKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0ICsgMSwgbW9kIHBlcmlvZFxcbiAgICBQaTAgPSBtb2QyODkoUGkwKTtcXG4gICAgUGkxID0gbW9kMjg5KFBpMSk7XFxuICAgIHZlYzMgUGYwID0gZnJhY3QoUCk7IC8vIEZyYWN0aW9uYWwgcGFydCBmb3IgaW50ZXJwb2xhdGlvblxcbiAgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgLy8gRnJhY3Rpb25hbCBwYXJ0IC0gMS4wXFxuICAgIHZlYzQgaXggPSB2ZWM0KFBpMC54LCBQaTEueCwgUGkwLngsIFBpMS54KTtcXG4gICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpO1xcbiAgICB2ZWM0IGl6MCA9IFBpMC56enp6O1xcbiAgICB2ZWM0IGl6MSA9IFBpMS56enp6O1xcbiAgICB2ZWM0IGl4eSA9IHBlcm11dGUocGVybXV0ZShpeCkgKyBpeSk7XFxuICAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTtcXG4gICAgdmVjNCBpeHkxID0gcGVybXV0ZShpeHkgKyBpejEpO1xcbiAgICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTtcXG4gICAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41O1xcbiAgICBneDAgPSBmcmFjdChneDApO1xcbiAgICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7XFxuICAgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7XFxuICAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpO1xcbiAgICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTtcXG4gICAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7XFxuICAgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTtcXG4gICAgZ3gxID0gZnJhY3QoZ3gxKTtcXG4gICAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpO1xcbiAgICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpO1xcbiAgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTtcXG4gICAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7XFxuICAgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsIGd5MC54LCBnejAueCk7XFxuICAgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksIGd5MC55LCBnejAueSk7XFxuICAgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosIGd5MC56LCBnejAueik7XFxuICAgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsIGd5MC53LCBnejAudyk7XFxuICAgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsIGd5MS54LCBnejEueCk7XFxuICAgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksIGd5MS55LCBnejEueSk7XFxuICAgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosIGd5MS56LCBnejEueik7XFxuICAgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsIGd5MS53LCBnejEudyk7XFxuICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7XFxuICAgIGcwMDAgKj0gbm9ybTAueDtcXG4gICAgZzAxMCAqPSBub3JtMC55O1xcbiAgICBnMTAwICo9IG5vcm0wLno7XFxuICAgIGcxMTAgKj0gbm9ybTAudztcXG4gICAgdmVjNCBub3JtMSA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMSwgZzAwMSksIGRvdChnMDExLCBnMDExKSwgZG90KGcxMDEsIGcxMDEpLCBkb3QoZzExMSwgZzExMSkpKTtcXG4gICAgZzAwMSAqPSBub3JtMS54O1xcbiAgICBnMDExICo9IG5vcm0xLnk7XFxuICAgIGcxMDEgKj0gbm9ybTEuejtcXG4gICAgZzExMSAqPSBub3JtMS53O1xcbiAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7XFxuICAgIGZsb2F0IG4xMDAgPSBkb3QoZzEwMCwgdmVjMyhQZjEueCwgUGYwLnl6KSk7XFxuICAgIGZsb2F0IG4wMTAgPSBkb3QoZzAxMCwgdmVjMyhQZjAueCwgUGYxLnksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4wMDEgPSBkb3QoZzAwMSwgdmVjMyhQZjAueHksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4xMDEgPSBkb3QoZzEwMSwgdmVjMyhQZjEueCwgUGYwLnksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7XFxuICAgIGZsb2F0IG4xMTEgPSBkb3QoZzExMSwgUGYxKTtcXG4gICAgdmVjMyBmYWRlX3h5eiA9IGZhZGUoUGYwKTtcXG4gICAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7XFxuICAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7XFxuICAgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTtcXG4gICAgcmV0dXJuIDIuMiAqIG5feHl6O1xcbn1cXG5mbG9hdCB0dXJiKHZlYzMgUCwgdmVjMyByZXAsIGZsb2F0IGxhY3VuYXJpdHksIGZsb2F0IGdhaW4pXFxue1xcbiAgICBmbG9hdCBzdW0gPSAwLjA7XFxuICAgIGZsb2F0IHNjID0gMS4wO1xcbiAgICBmbG9hdCB0b3RhbGdhaW4gPSAxLjA7XFxuICAgIGZvciAoZmxvYXQgaSA9IDAuMDsgaSA8IDYuMDsgaSsrKVxcbiAgICB7XFxuICAgICAgICBzdW0gKz0gdG90YWxnYWluICogcG5vaXNlKFAgKiBzYywgcmVwKTtcXG4gICAgICAgIHNjICo9IGxhY3VuYXJpdHk7XFxuICAgICAgICB0b3RhbGdhaW4gKj0gZ2FpbjtcXG4gICAgfVxcbiAgICByZXR1cm4gYWJzKHN1bSk7XFxufVxcblwiLGxlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudW5pZm9ybSB2ZWMyIGxpZ2h0O1xcbnVuaWZvcm0gYm9vbCBwYXJhbGxlbDtcXG51bmlmb3JtIGZsb2F0IGFzcGVjdDtcXG5cXG51bmlmb3JtIGZsb2F0IGdhaW47XFxudW5pZm9ybSBmbG9hdCBsYWN1bmFyaXR5O1xcbnVuaWZvcm0gZmxvYXQgdGltZTtcXG5cXG4ke3Blcmxpbn1cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkgLyBkaW1lbnNpb25zLnh5O1xcblxcbiAgICBmbG9hdCBkO1xcblxcbiAgICBpZiAocGFyYWxsZWwpIHtcXG4gICAgICAgIGZsb2F0IF9jb3MgPSBsaWdodC54O1xcbiAgICAgICAgZmxvYXQgX3NpbiA9IGxpZ2h0Lnk7XFxuICAgICAgICBkID0gKF9jb3MgKiBjb29yZC54KSArIChfc2luICogY29vcmQueSAqIGFzcGVjdCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICBmbG9hdCBkeCA9IGNvb3JkLnggLSBsaWdodC54IC8gZGltZW5zaW9ucy54O1xcbiAgICAgICAgZmxvYXQgZHkgPSAoY29vcmQueSAtIGxpZ2h0LnkgLyBkaW1lbnNpb25zLnkpICogYXNwZWN0O1xcbiAgICAgICAgZmxvYXQgZGlzID0gc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgKyAwLjAwMDAxO1xcbiAgICAgICAgZCA9IGR5IC8gZGlzO1xcbiAgICB9XFxuXFxuICAgIHZlYzMgZGlyID0gdmVjMyhkLCBkLCAwLjApO1xcblxcbiAgICBmbG9hdCBub2lzZSA9IHR1cmIoZGlyICsgdmVjMyh0aW1lLCAwLjAsIDYyLjEgKyB0aW1lKSAqIDAuMDUsIHZlYzMoNDgwLjAsIDMyMC4wLCA0ODAuMCksIGxhY3VuYXJpdHksIGdhaW4pO1xcbiAgICBub2lzZSA9IG1peChub2lzZSwgMC4wLCAwLjMpO1xcbiAgICAvL2ZhZGUgdmVydGljYWxseS5cXG4gICAgdmVjNCBtaXN0ID0gdmVjNChub2lzZSwgbm9pc2UsIG5vaXNlLCAxLjApICogKDEuMCAtIGNvb3JkLnkpO1xcbiAgICBtaXN0LmEgPSAxLjA7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKyBtaXN0O1xcbn1cXG5cIixzZT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4pe2UuY2FsbCh0aGlzLG9lLGxlLnJlcGxhY2UoXCIke3Blcmxpbn1cIixpZSkpLHRoaXMudW5pZm9ybXMuZGltZW5zaW9ucz1uZXcgRmxvYXQzMkFycmF5KDIpLFwibnVtYmVyXCI9PXR5cGVvZiBuJiYoY29uc29sZS53YXJuKFwiR29kcmF5RmlsdGVyIG5vdyB1c2VzIG9wdGlvbnMgaW5zdGVhZCBvZiAoYW5nbGUsIGdhaW4sIGxhY3VuYXJpdHksIHRpbWUpXCIpLG49e2FuZ2xlOm59LHZvaWQgMCE9PWFyZ3VtZW50c1sxXSYmKG4uZ2Fpbj1hcmd1bWVudHNbMV0pLHZvaWQgMCE9PWFyZ3VtZW50c1syXSYmKG4ubGFjdW5hcml0eT1hcmd1bWVudHNbMl0pLHZvaWQgMCE9PWFyZ3VtZW50c1szXSYmKG4udGltZT1hcmd1bWVudHNbM10pKSxuPU9iamVjdC5hc3NpZ24oe2FuZ2xlOjMwLGdhaW46LjUsbGFjdW5hcml0eToyLjUsdGltZTowLHBhcmFsbGVsOiEwLGNlbnRlcjpbMCwwXX0sbiksdGhpcy5fYW5nbGVMaWdodD1uZXcgdC5Qb2ludCx0aGlzLmFuZ2xlPW4uYW5nbGUsdGhpcy5nYWluPW4uZ2Fpbix0aGlzLmxhY3VuYXJpdHk9bi5sYWN1bmFyaXR5LHRoaXMucGFyYWxsZWw9bi5wYXJhbGxlbCx0aGlzLmNlbnRlcj1uLmNlbnRlcix0aGlzLnRpbWU9bi50aW1lfWUmJihuLl9fcHJvdG9fXz1lKSxuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXthbmdsZTp7Y29uZmlndXJhYmxlOiEwfSxnYWluOntjb25maWd1cmFibGU6ITB9LGxhY3VuYXJpdHk6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt2YXIgbz10LnNvdXJjZUZyYW1lLGk9by53aWR0aCxsPW8uaGVpZ2h0O3RoaXMudW5pZm9ybXMubGlnaHQ9dGhpcy5wYXJhbGxlbD90aGlzLl9hbmdsZUxpZ2h0OnRoaXMuY2VudGVyLHRoaXMudW5pZm9ybXMucGFyYWxsZWw9dGhpcy5wYXJhbGxlbCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09aSx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09bCx0aGlzLnVuaWZvcm1zLmFzcGVjdD1sL2ksdGhpcy51bmlmb3Jtcy50aW1lPXRoaXMudGltZSxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxyLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0sci5hbmdsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fYW5nbGU9ZTt2YXIgbj1lKnQuREVHX1RPX1JBRDt0aGlzLl9hbmdsZUxpZ2h0Lng9TWF0aC5jb3MobiksdGhpcy5fYW5nbGVMaWdodC55PU1hdGguc2luKG4pfSxyLmdhaW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ2Fpbn0sci5nYWluLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmdhaW49ZX0sci5sYWN1bmFyaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxhY3VuYXJpdHl9LHIubGFjdW5hcml0eS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5sYWN1bmFyaXR5PWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSxhZT1uLHVlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSB2ZWMyIHVWZWxvY2l0eTtcXG51bmlmb3JtIGludCB1S2VybmVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHVPZmZzZXQ7XFxuXFxuY29uc3QgaW50IE1BWF9LRVJORUxfU0laRSA9IDIwNDg7XFxuXFxuLy8gTm90aWNlOlxcbi8vIHRoZSBwZXJmZWN0IHdheTpcXG4vLyAgICBpbnQga2VybmVsU2l6ZSA9IG1pbih1S2VybmVsU2l6ZSwgTUFYX0tFUk5FTFNJWkUpO1xcbi8vIEJVVCBpbiByZWFsIHVzZS1jYXNlICwgdUtlcm5lbFNpemUgPCBNQVhfS0VSTkVMU0laRSBhbG1vc3QgYWx3YXlzLlxcbi8vIFNvIHVzZSB1S2VybmVsU2l6ZSBkaXJlY3RseS5cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBpZiAodUtlcm5lbFNpemUgPT0gMClcXG4gICAge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiB2ZWxvY2l0eSA9IHVWZWxvY2l0eSAvIGZpbHRlckFyZWEueHk7XFxuICAgIGZsb2F0IG9mZnNldCA9IC11T2Zmc2V0IC8gbGVuZ3RoKHVWZWxvY2l0eSkgLSAwLjU7XFxuICAgIGludCBrID0gdUtlcm5lbFNpemUgLSAxO1xcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgTUFYX0tFUk5FTF9TSVpFIC0gMTsgaSsrKSB7XFxuICAgICAgICBpZiAoaSA9PSBrKSB7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICB9XFxuICAgICAgICB2ZWMyIGJpYXMgPSB2ZWxvY2l0eSAqIChmbG9hdChpKSAvIGZsb2F0KGspICsgb2Zmc2V0KTtcXG4gICAgICAgIGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGJpYXMpO1xcbiAgICB9XFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yIC8gZmxvYXQodUtlcm5lbFNpemUpO1xcbn1cXG5cIixjZT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4scixvKXt2b2lkIDA9PT1uJiYobj1bMCwwXSksdm9pZCAwPT09ciYmKHI9NSksdm9pZCAwPT09byYmKG89MCksZS5jYWxsKHRoaXMsYWUsdWUpLHRoaXMudW5pZm9ybXMudVZlbG9jaXR5PW5ldyBGbG9hdDMyQXJyYXkoMiksdGhpcy5fdmVsb2NpdHk9bmV3IHQuT2JzZXJ2YWJsZVBvaW50KHRoaXMudmVsb2NpdHlDaGFuZ2VkLHRoaXMpLHRoaXMudmVsb2NpdHk9bix0aGlzLmtlcm5lbFNpemU9cix0aGlzLm9mZnNldD1vfWUmJihuLl9fcHJvdG9fXz1lKSxuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXt2ZWxvY2l0eTp7Y29uZmlndXJhYmxlOiEwfSxvZmZzZXQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt2YXIgbz10aGlzLnZlbG9jaXR5LGk9by54LGw9by55O3RoaXMudW5pZm9ybXMudUtlcm5lbFNpemU9MCE9PWl8fDAhPT1sP3RoaXMua2VybmVsU2l6ZTowLGUuYXBwbHlGaWx0ZXIodGhpcyx0LG4scil9LHIudmVsb2NpdHkuc2V0PWZ1bmN0aW9uKGUpe0FycmF5LmlzQXJyYXkoZSk/dGhpcy5fdmVsb2NpdHkuc2V0KGVbMF0sZVsxXSk6KGUgaW5zdGFuY2VvZiB0LlBvaW50fHxlIGluc3RhbmNlb2YgdC5PYnNlcnZhYmxlUG9pbnQpJiZ0aGlzLl92ZWxvY2l0eS5jb3B5KGUpfSxyLnZlbG9jaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZWxvY2l0eX0sbi5wcm90b3R5cGUudmVsb2NpdHlDaGFuZ2VkPWZ1bmN0aW9uKCl7dGhpcy51bmlmb3Jtcy51VmVsb2NpdHlbMF09dGhpcy5fdmVsb2NpdHkueCx0aGlzLnVuaWZvcm1zLnVWZWxvY2l0eVsxXT10aGlzLl92ZWxvY2l0eS55fSxyLm9mZnNldC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy51T2Zmc2V0PWV9LHIub2Zmc2V0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVPZmZzZXR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSxmZT1uLGhlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcblxcbmNvbnN0IGludCBNQVhfQ09MT1JTID0gJW1heENvbG9ycyU7XFxuXFxudW5pZm9ybSB2ZWMzIG9yaWdpbmFsQ29sb3JzW01BWF9DT0xPUlNdO1xcbnVuaWZvcm0gdmVjMyB0YXJnZXRDb2xvcnNbTUFYX0NPTE9SU107XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBmbG9hdCBhbHBoYSA9IGdsX0ZyYWdDb2xvci5hO1xcbiAgICBpZiAoYWxwaGEgPCAwLjAwMDEpXFxuICAgIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMyBjb2xvciA9IGdsX0ZyYWdDb2xvci5yZ2IgLyBhbHBoYTtcXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IE1BWF9DT0xPUlM7IGkrKylcXG4gICAge1xcbiAgICAgIHZlYzMgb3JpZ0NvbG9yID0gb3JpZ2luYWxDb2xvcnNbaV07XFxuICAgICAgaWYgKG9yaWdDb2xvci5yIDwgMC4wKVxcbiAgICAgIHtcXG4gICAgICAgIGJyZWFrO1xcbiAgICAgIH1cXG4gICAgICB2ZWMzIGNvbG9yRGlmZiA9IG9yaWdDb2xvciAtIGNvbG9yO1xcbiAgICAgIGlmIChsZW5ndGgoY29sb3JEaWZmKSA8IGVwc2lsb24pXFxuICAgICAge1xcbiAgICAgICAgdmVjMyB0YXJnZXRDb2xvciA9IHRhcmdldENvbG9yc1tpXTtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoKHRhcmdldENvbG9yICsgY29sb3JEaWZmKSAqIGFscGhhLCBhbHBoYSk7XFxuICAgICAgICByZXR1cm47XFxuICAgICAgfVxcbiAgICB9XFxufVxcblwiLHBlPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuLHIpe3ZvaWQgMD09PW4mJihuPS4wNSksdm9pZCAwPT09ciYmKHI9bnVsbCkscj1yfHx0Lmxlbmd0aCxlLmNhbGwodGhpcyxmZSxoZS5yZXBsYWNlKC8lbWF4Q29sb3JzJS9nLHIpKSx0aGlzLmVwc2lsb249bix0aGlzLl9tYXhDb2xvcnM9cix0aGlzLl9yZXBsYWNlbWVudHM9bnVsbCx0aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3JzPW5ldyBGbG9hdDMyQXJyYXkoMypyKSx0aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycz1uZXcgRmxvYXQzMkFycmF5KDMqciksdGhpcy5yZXBsYWNlbWVudHM9dH1lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17cmVwbGFjZW1lbnRzOntjb25maWd1cmFibGU6ITB9LG1heENvbG9yczp7Y29uZmlndXJhYmxlOiEwfSxlcHNpbG9uOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5yZXBsYWNlbWVudHMuc2V0PWZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcnMscj10aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycyxvPWUubGVuZ3RoO2lmKG8+dGhpcy5fbWF4Q29sb3JzKXRocm93XCJMZW5ndGggb2YgcmVwbGFjZW1lbnRzIChcIitvK1wiKSBleGNlZWRzIHRoZSBtYXhpbXVtIGNvbG9ycyBsZW5ndGggKFwiK3RoaXMuX21heENvbG9ycytcIilcIjtuWzMqb109LTE7Zm9yKHZhciBpPTA7aTxvO2krKyl7dmFyIGw9ZVtpXSxzPWxbMF07XCJudW1iZXJcIj09dHlwZW9mIHM/cz10LnV0aWxzLmhleDJyZ2Iocyk6bFswXT10LnV0aWxzLnJnYjJoZXgocyksblszKmldPXNbMF0sblszKmkrMV09c1sxXSxuWzMqaSsyXT1zWzJdO3ZhciBhPWxbMV07XCJudW1iZXJcIj09dHlwZW9mIGE/YT10LnV0aWxzLmhleDJyZ2IoYSk6bFsxXT10LnV0aWxzLnJnYjJoZXgoYSksclszKmldPWFbMF0sclszKmkrMV09YVsxXSxyWzMqaSsyXT1hWzJdfXRoaXMuX3JlcGxhY2VtZW50cz1lfSxyLnJlcGxhY2VtZW50cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVwbGFjZW1lbnRzfSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5yZXBsYWNlbWVudHM9dGhpcy5fcmVwbGFjZW1lbnRzfSxyLm1heENvbG9ycy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWF4Q29sb3JzfSxyLmVwc2lsb24uc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZXBzaWxvbj1lfSxyLmVwc2lsb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZXBzaWxvbn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsciksbn0odC5GaWx0ZXIpLGRlPW4sbWU9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG5cXG51bmlmb3JtIGZsb2F0IHNlcGlhO1xcbnVuaWZvcm0gZmxvYXQgbm9pc2U7XFxudW5pZm9ybSBmbG9hdCBub2lzZVNpemU7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoO1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaERlbnNpdHk7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoV2lkdGg7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZ0FscGhhO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZ0JsdXI7XFxudW5pZm9ybSBmbG9hdCBzZWVkO1xcblxcbmNvbnN0IGZsb2F0IFNRUlRfMiA9IDEuNDE0MjEzO1xcbmNvbnN0IHZlYzMgU0VQSUFfUkdCID0gdmVjMygxMTIuMCAvIDI1NS4wLCA2Ni4wIC8gMjU1LjAsIDIwLjAgLyAyNTUuMCk7XFxuXFxuZmxvYXQgcmFuZCh2ZWMyIGNvKSB7XFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGNvLnh5LCB2ZWMyKDEyLjk4OTgsIDc4LjIzMykpKSAqIDQzNzU4LjU0NTMpO1xcbn1cXG5cXG52ZWMzIE92ZXJsYXkodmVjMyBzcmMsIHZlYzMgZHN0KVxcbntcXG4gICAgLy8gaWYgKGRzdCA8PSAwLjUpIHRoZW46IDIgKiBzcmMgKiBkc3RcXG4gICAgLy8gaWYgKGRzdCA+IDAuNSkgdGhlbjogMSAtIDIgKiAoMSAtIGRzdCkgKiAoMSAtIHNyYylcXG4gICAgcmV0dXJuIHZlYzMoKGRzdC54IDw9IDAuNSkgPyAoMi4wICogc3JjLnggKiBkc3QueCkgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC54KSAqICgxLjAgLSBzcmMueCkpLFxcbiAgICAgICAgICAgICAgICAoZHN0LnkgPD0gMC41KSA/ICgyLjAgKiBzcmMueSAqIGRzdC55KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LnkpICogKDEuMCAtIHNyYy55KSksXFxuICAgICAgICAgICAgICAgIChkc3QueiA8PSAwLjUpID8gKDIuMCAqIHNyYy56ICogZHN0LnopIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueikgKiAoMS4wIC0gc3JjLnopKSk7XFxufVxcblxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMzIGNvbG9yID0gZ2xfRnJhZ0NvbG9yLnJnYjtcXG5cXG4gICAgaWYgKHNlcGlhID4gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBncmF5ID0gKGNvbG9yLnggKyBjb2xvci55ICsgY29sb3IueikgLyAzLjA7XFxuICAgICAgICB2ZWMzIGdyYXlzY2FsZSA9IHZlYzMoZ3JheSk7XFxuXFxuICAgICAgICBjb2xvciA9IE92ZXJsYXkoU0VQSUFfUkdCLCBncmF5c2NhbGUpO1xcblxcbiAgICAgICAgY29sb3IgPSBncmF5c2NhbGUgKyBzZXBpYSAqIChjb2xvciAtIGdyYXlzY2FsZSk7XFxuICAgIH1cXG5cXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5IC8gZGltZW5zaW9ucy54eTtcXG5cXG4gICAgaWYgKHZpZ25ldHRpbmcgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IG91dHRlciA9IFNRUlRfMiAtIHZpZ25ldHRpbmcgKiBTUVJUXzI7XFxuICAgICAgICB2ZWMyIGRpciA9IHZlYzIodmVjMigwLjUsIDAuNSkgLSBjb29yZCk7XFxuICAgICAgICBkaXIueSAqPSBkaW1lbnNpb25zLnkgLyBkaW1lbnNpb25zLng7XFxuICAgICAgICBmbG9hdCBkYXJrZXIgPSBjbGFtcCgob3V0dGVyIC0gbGVuZ3RoKGRpcikgKiBTUVJUXzIpIC8gKCAwLjAwMDAxICsgdmlnbmV0dGluZ0JsdXIgKiBTUVJUXzIpLCAwLjAsIDEuMCk7XFxuICAgICAgICBjb2xvci5yZ2IgKj0gZGFya2VyICsgKDEuMCAtIGRhcmtlcikgKiAoMS4wIC0gdmlnbmV0dGluZ0FscGhhKTtcXG4gICAgfVxcblxcbiAgICBpZiAoc2NyYXRjaERlbnNpdHkgPiBzZWVkICYmIHNjcmF0Y2ggIT0gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBwaGFzZSA9IHNlZWQgKiAyNTYuMDtcXG4gICAgICAgIGZsb2F0IHMgPSBtb2QoZmxvb3IocGhhc2UpLCAyLjApO1xcbiAgICAgICAgZmxvYXQgZGlzdCA9IDEuMCAvIHNjcmF0Y2hEZW5zaXR5O1xcbiAgICAgICAgZmxvYXQgZCA9IGRpc3RhbmNlKGNvb3JkLCB2ZWMyKHNlZWQgKiBkaXN0LCBhYnMocyAtIHNlZWQgKiBkaXN0KSkpO1xcbiAgICAgICAgaWYgKGQgPCBzZWVkICogMC42ICsgMC40KVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGhpZ2hwIGZsb2F0IHBlcmlvZCA9IHNjcmF0Y2hEZW5zaXR5ICogMTAuMDtcXG5cXG4gICAgICAgICAgICBmbG9hdCB4eCA9IGNvb3JkLnggKiBwZXJpb2QgKyBwaGFzZTtcXG4gICAgICAgICAgICBmbG9hdCBhYSA9IGFicyhtb2QoeHgsIDAuNSkgKiA0LjApO1xcbiAgICAgICAgICAgIGZsb2F0IGJiID0gbW9kKGZsb29yKHh4IC8gMC41KSwgMi4wKTtcXG4gICAgICAgICAgICBmbG9hdCB5eSA9ICgxLjAgLSBiYikgKiBhYSArIGJiICogKDIuMCAtIGFhKTtcXG5cXG4gICAgICAgICAgICBmbG9hdCBrayA9IDIuMCAqIHBlcmlvZDtcXG4gICAgICAgICAgICBmbG9hdCBkdyA9IHNjcmF0Y2hXaWR0aCAvIGRpbWVuc2lvbnMueCAqICgwLjc1ICsgc2VlZCk7XFxuICAgICAgICAgICAgZmxvYXQgZGggPSBkdyAqIGtrO1xcblxcbiAgICAgICAgICAgIGZsb2F0IHRpbmUgPSAoeXkgLSAoMi4wIC0gZGgpKTtcXG5cXG4gICAgICAgICAgICBpZiAodGluZSA+IDAuMCkge1xcbiAgICAgICAgICAgICAgICBmbG9hdCBfc2lnbiA9IHNpZ24oc2NyYXRjaCk7XFxuXFxuICAgICAgICAgICAgICAgIHRpbmUgPSBzICogdGluZSAvIHBlcmlvZCArIHNjcmF0Y2ggKyAwLjE7XFxuICAgICAgICAgICAgICAgIHRpbmUgPSBjbGFtcCh0aW5lICsgMS4wLCAwLjUgKyBfc2lnbiAqIDAuNSwgMS41ICsgX3NpZ24gKiAwLjUpO1xcblxcbiAgICAgICAgICAgICAgICBjb2xvci5yZ2IgKj0gdGluZTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKG5vaXNlID4gMC4wICYmIG5vaXNlU2l6ZSA+IDAuMClcXG4gICAge1xcbiAgICAgICAgdmVjMiBwaXhlbENvb3JkID0gdlRleHR1cmVDb29yZC54eSAqIGZpbHRlckFyZWEueHk7XFxuICAgICAgICBwaXhlbENvb3JkLnggPSBmbG9vcihwaXhlbENvb3JkLnggLyBub2lzZVNpemUpO1xcbiAgICAgICAgcGl4ZWxDb29yZC55ID0gZmxvb3IocGl4ZWxDb29yZC55IC8gbm9pc2VTaXplKTtcXG4gICAgICAgIC8vIHZlYzIgZCA9IHBpeGVsQ29vcmQgKiBub2lzZVNpemUgKiB2ZWMyKDEwMjQuMCArIHNlZWQgKiA1MTIuMCwgMTAyNC4wIC0gc2VlZCAqIDUxMi4wKTtcXG4gICAgICAgIC8vIGZsb2F0IF9ub2lzZSA9IHNub2lzZShkKSAqIDAuNTtcXG4gICAgICAgIGZsb2F0IF9ub2lzZSA9IHJhbmQocGl4ZWxDb29yZCAqIG5vaXNlU2l6ZSAqIHNlZWQpIC0gMC41O1xcbiAgICAgICAgY29sb3IgKz0gX25vaXNlICogbm9pc2U7XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiA9IGNvbG9yO1xcbn1cXG5cIixnZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQsbil7dm9pZCAwPT09biYmKG49MCksZS5jYWxsKHRoaXMsZGUsbWUpLHRoaXMudW5pZm9ybXMuZGltZW5zaW9ucz1uZXcgRmxvYXQzMkFycmF5KDIpLFwibnVtYmVyXCI9PXR5cGVvZiB0Pyh0aGlzLnNlZWQ9dCx0PW51bGwpOnRoaXMuc2VlZD1uLE9iamVjdC5hc3NpZ24odGhpcyx7c2VwaWE6LjMsbm9pc2U6LjMsbm9pc2VTaXplOjEsc2NyYXRjaDouNSxzY3JhdGNoRGVuc2l0eTouMyxzY3JhdGNoV2lkdGg6MSx2aWduZXR0aW5nOi4zLHZpZ25ldHRpbmdBbHBoYToxLHZpZ25ldHRpbmdCbHVyOi4zfSx0KX1lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17c2VwaWE6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2U6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2VTaXplOntjb25maWd1cmFibGU6ITB9LHNjcmF0Y2g6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaERlbnNpdHk6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaFdpZHRoOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmc6e2NvbmZpZ3VyYWJsZTohMH0sdmlnbmV0dGluZ0FscGhhOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdCbHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPXQuc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXQuc291cmNlRnJhbWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMuc2VlZD10aGlzLnNlZWQsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sbi5zZXBpYS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zZXBpYT1lfSxuLnNlcGlhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNlcGlhfSxuLm5vaXNlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLm5vaXNlPWV9LG4ubm9pc2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2V9LG4ubm9pc2VTaXplLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLm5vaXNlU2l6ZT1lfSxuLm5vaXNlU2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZVNpemV9LG4uc2NyYXRjaC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zY3JhdGNoPWV9LG4uc2NyYXRjaC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNofSxuLnNjcmF0Y2hEZW5zaXR5LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hEZW5zaXR5PWV9LG4uc2NyYXRjaERlbnNpdHkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaERlbnNpdHl9LG4uc2NyYXRjaFdpZHRoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hXaWR0aD1lfSxuLnNjcmF0Y2hXaWR0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNoV2lkdGh9LG4udmlnbmV0dGluZy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nPWV9LG4udmlnbmV0dGluZy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy52aWduZXR0aW5nfSxuLnZpZ25ldHRpbmdBbHBoYS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQWxwaGE9ZX0sbi52aWduZXR0aW5nQWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhfSxuLnZpZ25ldHRpbmdCbHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyPWV9LG4udmlnbmV0dGluZ0JsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0JsdXJ9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSx2ZT1uLHhlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSB2ZWMyIHRoaWNrbmVzcztcXG51bmlmb3JtIHZlYzQgb3V0bGluZUNvbG9yO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG5cXG5jb25zdCBmbG9hdCBET1VCTEVfUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0ICogMi47XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgdmVjNCBvd25Db2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgY3VyQ29sb3I7XFxuICAgIGZsb2F0IG1heEFscGhhID0gMC47XFxuICAgIHZlYzIgZGlzcGxhY2VkO1xcbiAgICBmb3IgKGZsb2F0IGFuZ2xlID0gMC47IGFuZ2xlIDw9IERPVUJMRV9QSTsgYW5nbGUgKz0gJHthbmdsZVN0ZXB9KSB7XFxuICAgICAgICBkaXNwbGFjZWQueCA9IHZUZXh0dXJlQ29vcmQueCArIHRoaWNrbmVzcy54ICogY29zKGFuZ2xlKTtcXG4gICAgICAgIGRpc3BsYWNlZC55ID0gdlRleHR1cmVDb29yZC55ICsgdGhpY2tuZXNzLnkgKiBzaW4oYW5nbGUpO1xcbiAgICAgICAgY3VyQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKGRpc3BsYWNlZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuICAgICAgICBtYXhBbHBoYSA9IG1heChtYXhBbHBoYSwgY3VyQ29sb3IuYSk7XFxuICAgIH1cXG4gICAgZmxvYXQgcmVzdWx0QWxwaGEgPSBtYXgobWF4QWxwaGEsIG93bkNvbG9yLmEpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KChvd25Db2xvci5yZ2IgKyBvdXRsaW5lQ29sb3IucmdiICogKDEuIC0gb3duQ29sb3IuYSkpICogcmVzdWx0QWxwaGEsIHJlc3VsdEFscGhhKTtcXG59XFxuXCIseWU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LHIsbyl7dm9pZCAwPT09dCYmKHQ9MSksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09byYmKG89LjEpO3ZhciBpPU1hdGgubWF4KG8qbi5NQVhfU0FNUExFUyxuLk1JTl9TQU1QTEVTKSxsPSgyKk1hdGguUEkvaSkudG9GaXhlZCg3KTtlLmNhbGwodGhpcyx2ZSx4ZS5yZXBsYWNlKC9cXCRcXHthbmdsZVN0ZXBcXH0vLGwpKSx0aGlzLnVuaWZvcm1zLnRoaWNrbmVzcz1uZXcgRmxvYXQzMkFycmF5KFswLDBdKSx0aGlzLnRoaWNrbmVzcz10LHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKSx0aGlzLmNvbG9yPXIsdGhpcy5xdWFsaXR5PW99ZSYmKG4uX19wcm90b19fPWUpLG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yPW47dmFyIHI9e2NvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy50aGlja25lc3NbMF09dGhpcy50aGlja25lc3MvdC5zaXplLndpZHRoLHRoaXMudW5pZm9ybXMudGhpY2tuZXNzWzFdPXRoaXMudGhpY2tuZXNzL3Quc2l6ZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdC51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dC51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5vdXRsaW5lQ29sb3IpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufSh0LkZpbHRlcik7eWUuTUlOX1NBTVBMRVM9MSx5ZS5NQVhfU0FNUExFUz0xMDA7dmFyIGJlPW4sX2U9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzIgc2l6ZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiBwaXhlbGF0ZSh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcblxcdHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSBwaXhlbGF0ZShjb29yZCwgc2l6ZSk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcbn1cXG5cIixDZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe3ZvaWQgMD09PXQmJih0PTEwKSxlLmNhbGwodGhpcyxiZSxfZSksdGhpcy5zaXplPXR9ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e3NpemU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2l6ZX0sbi5zaXplLnNldD1mdW5jdGlvbihlKXtcIm51bWJlclwiPT10eXBlb2YgZSYmKGU9W2UsZV0pLHRoaXMudW5pZm9ybXMuc2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksU2U9bixGZT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gZmxvYXQgdVJhZGlhbjtcXG51bmlmb3JtIHZlYzIgdUNlbnRlcjtcXG51bmlmb3JtIGZsb2F0IHVSYWRpdXM7XFxudW5pZm9ybSBpbnQgdUtlcm5lbFNpemU7XFxuXFxuY29uc3QgaW50IE1BWF9LRVJORUxfU0laRSA9IDIwNDg7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgaWYgKHVLZXJuZWxTaXplID09IDApXFxuICAgIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIGZsb2F0IGFzcGVjdCA9IGZpbHRlckFyZWEueSAvIGZpbHRlckFyZWEueDtcXG4gICAgdmVjMiBjZW50ZXIgPSB1Q2VudGVyLnh5IC8gZmlsdGVyQXJlYS54eTtcXG4gICAgZmxvYXQgZ3JhZGllbnQgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54ICogMC4zO1xcbiAgICBmbG9hdCByYWRpdXMgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54IC0gZ3JhZGllbnQgKiAwLjU7XFxuICAgIGludCBrID0gdUtlcm5lbFNpemUgLSAxO1xcblxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZDtcXG4gICAgdmVjMiBkaXIgPSB2ZWMyKGNlbnRlciAtIGNvb3JkKTtcXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aCh2ZWMyKGRpci54LCBkaXIueSAqIGFzcGVjdCkpO1xcblxcbiAgICBmbG9hdCByYWRpYW5TdGVwID0gdVJhZGlhbjtcXG4gICAgaWYgKHJhZGl1cyA+PSAwLjAgJiYgZGlzdCA+IHJhZGl1cykge1xcbiAgICAgICAgZmxvYXQgZGVsdGEgPSBkaXN0IC0gcmFkaXVzO1xcbiAgICAgICAgZmxvYXQgZ2FwID0gZ3JhZGllbnQ7XFxuICAgICAgICBmbG9hdCBzY2FsZSA9IDEuMCAtIGFicyhkZWx0YSAvIGdhcCk7XFxuICAgICAgICBpZiAoc2NhbGUgPD0gMC4wKSB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICAgICAgcmFkaWFuU3RlcCAqPSBzY2FsZTtcXG4gICAgfVxcbiAgICByYWRpYW5TdGVwIC89IGZsb2F0KGspO1xcblxcbiAgICBmbG9hdCBzID0gc2luKHJhZGlhblN0ZXApO1xcbiAgICBmbG9hdCBjID0gY29zKHJhZGlhblN0ZXApO1xcbiAgICBtYXQyIHJvdGF0aW9uTWF0cml4ID0gbWF0Mih2ZWMyKGMsIC1zKSwgdmVjMihzLCBjKSk7XFxuXFxuICAgIGZvcihpbnQgaSA9IDA7IGkgPCBNQVhfS0VSTkVMX1NJWkUgLSAxOyBpKyspIHtcXG4gICAgICAgIGlmIChpID09IGspIHtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGNvb3JkIC09IGNlbnRlcjtcXG4gICAgICAgIGNvb3JkLnkgKj0gYXNwZWN0O1xcbiAgICAgICAgY29vcmQgPSByb3RhdGlvbk1hdHJpeCAqIGNvb3JkO1xcbiAgICAgICAgY29vcmQueSAvPSBhc3BlY3Q7XFxuICAgICAgICBjb29yZCArPSBjZW50ZXI7XFxuXFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcblxcbiAgICAgICAgLy8gc3dpdGNoIHRvIHByZS1tdWx0aXBsaWVkIGFscGhhIHRvIGNvcnJlY3RseSBibHVyIHRyYW5zcGFyZW50IGltYWdlc1xcbiAgICAgICAgLy8gc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG5cXG4gICAgICAgIGNvbG9yICs9IHNhbXBsZTtcXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAvIGZsb2F0KHVLZXJuZWxTaXplKTtcXG59XFxuXCIsemU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0LG4scixvKXt2b2lkIDA9PT10JiYodD0wKSx2b2lkIDA9PT1uJiYobj1bMCwwXSksdm9pZCAwPT09ciYmKHI9NSksdm9pZCAwPT09byYmKG89LTEpLGUuY2FsbCh0aGlzLFNlLEZlKSx0aGlzLl9hbmdsZT0wLHRoaXMuYW5nbGU9dCx0aGlzLmNlbnRlcj1uLHRoaXMua2VybmVsU2l6ZT1yLHRoaXMucmFkaXVzPW99ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e2FuZ2xlOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0LnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt0aGlzLnVuaWZvcm1zLnVLZXJuZWxTaXplPTAhPT10aGlzLl9hbmdsZT90aGlzLmtlcm5lbFNpemU6MCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxuLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLl9hbmdsZT1lLHRoaXMudW5pZm9ybXMudVJhZGlhbj1lKk1hdGguUEkvMTgwfSxuLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0sbi5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUNlbnRlcn0sbi5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudUNlbnRlcj1lfSxuLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxuLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7KGU8MHx8ZT09PTEvMCkmJihlPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXModC5wcm90b3R5cGUsbiksdH0odC5GaWx0ZXIpLEFlPW4sd2U9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudW5pZm9ybSBib29sIG1pcnJvcjtcXG51bmlmb3JtIGZsb2F0IGJvdW5kYXJ5O1xcbnVuaWZvcm0gdmVjMiBhbXBsaXR1ZGU7XFxudW5pZm9ybSB2ZWMyIHdhdmVMZW5ndGg7XFxudW5pZm9ybSB2ZWMyIGFscGhhO1xcbnVuaWZvcm0gZmxvYXQgdGltZTtcXG5cXG5mbG9hdCByYW5kKHZlYzIgY28pIHtcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoY28ueHksIHZlYzIoMTIuOTg5OCwgNzguMjMzKSkpICogNDM3NTguNTQ1Myk7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiBwaXhlbENvb3JkID0gdlRleHR1cmVDb29yZC54eSAqIGZpbHRlckFyZWEueHk7XFxuICAgIHZlYzIgY29vcmQgPSBwaXhlbENvb3JkIC8gZGltZW5zaW9ucztcXG5cXG4gICAgaWYgKGNvb3JkLnkgPCBib3VuZGFyeSkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICBmbG9hdCBrID0gKGNvb3JkLnkgLSBib3VuZGFyeSkgLyAoMS4gLSBib3VuZGFyeSArIDAuMDAwMSk7XFxuICAgIGZsb2F0IGFyZWFZID0gYm91bmRhcnkgKiBkaW1lbnNpb25zLnkgLyBmaWx0ZXJBcmVhLnk7XFxuICAgIGZsb2F0IHYgPSBhcmVhWSArIGFyZWFZIC0gdlRleHR1cmVDb29yZC55O1xcbiAgICBmbG9hdCB5ID0gbWlycm9yID8gdiA6IHZUZXh0dXJlQ29vcmQueTtcXG5cXG4gICAgZmxvYXQgX2FtcGxpdHVkZSA9ICgoYW1wbGl0dWRlLnkgLSBhbXBsaXR1ZGUueCkgKiBrICsgYW1wbGl0dWRlLnggKSAvIGZpbHRlckFyZWEueDtcXG4gICAgZmxvYXQgX3dhdmVMZW5ndGggPSAoKHdhdmVMZW5ndGgueSAtIHdhdmVMZW5ndGgueCkgKiBrICsgd2F2ZUxlbmd0aC54KSAvIGZpbHRlckFyZWEueTtcXG4gICAgZmxvYXQgX2FscGhhID0gKGFscGhhLnkgLSBhbHBoYS54KSAqIGsgKyBhbHBoYS54O1xcblxcbiAgICBmbG9hdCB4ID0gdlRleHR1cmVDb29yZC54ICsgY29zKHYgKiA2LjI4IC8gX3dhdmVMZW5ndGggLSB0aW1lKSAqIF9hbXBsaXR1ZGU7XFxuICAgIHggPSBjbGFtcCh4LCBmaWx0ZXJDbGFtcC54LCBmaWx0ZXJDbGFtcC56KTtcXG5cXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih4LCB5KSk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICogX2FscGhhO1xcbn1cXG5cIixUZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe2UuY2FsbCh0aGlzLEFlLHdlKSx0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZT1uZXcgRmxvYXQzMkFycmF5KDIpLHRoaXMudW5pZm9ybXMud2F2ZUxlbmd0aD1uZXcgRmxvYXQzMkFycmF5KDIpLHRoaXMudW5pZm9ybXMuYWxwaGE9bmV3IEZsb2F0MzJBcnJheSgyKSx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnM9bmV3IEZsb2F0MzJBcnJheSgyKSxPYmplY3QuYXNzaWduKHRoaXMse21pcnJvcjohMCxib3VuZGFyeTouNSxhbXBsaXR1ZGU6WzAsMjBdLHdhdmVMZW5ndGg6WzMwLDEwMF0sYWxwaGE6WzEsMV0sdGltZTowfSx0KX1lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17bWlycm9yOntjb25maWd1cmFibGU6ITB9LGJvdW5kYXJ5Ontjb25maWd1cmFibGU6ITB9LGFtcGxpdHVkZTp7Y29uZmlndXJhYmxlOiEwfSx3YXZlTGVuZ3RoOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPXQuc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXQuc291cmNlRnJhbWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sbi5taXJyb3Iuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMubWlycm9yPWV9LG4ubWlycm9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm1pcnJvcn0sbi5ib3VuZGFyeS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ib3VuZGFyeT1lfSxuLmJvdW5kYXJ5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJvdW5kYXJ5fSxuLmFtcGxpdHVkZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGVbMF09ZVswXSx0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZVsxXT1lWzFdfSxuLmFtcGxpdHVkZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGV9LG4ud2F2ZUxlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy53YXZlTGVuZ3RoWzBdPWVbMF0sdGhpcy51bmlmb3Jtcy53YXZlTGVuZ3RoWzFdPWVbMV19LG4ud2F2ZUxlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy53YXZlTGVuZ3RofSxuLmFscGhhLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFscGhhWzBdPWVbMF0sdGhpcy51bmlmb3Jtcy5hbHBoYVsxXT1lWzFdfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFscGhhfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksRGU9bixPZT1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiByZWQ7XFxudW5pZm9ybSB2ZWMyIGdyZWVuO1xcbnVuaWZvcm0gdmVjMiBibHVlO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICBnbF9GcmFnQ29sb3IuciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHJlZC9maWx0ZXJBcmVhLnh5KS5yO1xcbiAgIGdsX0ZyYWdDb2xvci5nID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZ3JlZW4vZmlsdGVyQXJlYS54eSkuZztcXG4gICBnbF9GcmFnQ29sb3IuYiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGJsdWUvZmlsdGVyQXJlYS54eSkuYjtcXG4gICBnbF9GcmFnQ29sb3IuYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG59XFxuXCIsUGU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0LG4scil7dm9pZCAwPT09dCYmKHQ9Wy0xMCwwXSksdm9pZCAwPT09biYmKG49WzAsMTBdKSx2b2lkIDA9PT1yJiYocj1bMCwwXSksZS5jYWxsKHRoaXMsRGUsT2UpLHRoaXMucmVkPXQsdGhpcy5ncmVlbj1uLHRoaXMuYmx1ZT1yfWUmJih0Ll9fcHJvdG9fXz1lKSx0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10O3ZhciBuPXtyZWQ6e2NvbmZpZ3VyYWJsZTohMH0sZ3JlZW46e2NvbmZpZ3VyYWJsZTohMH0sYmx1ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4ucmVkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJlZH0sbi5yZWQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmVkPWV9LG4uZ3JlZW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ3JlZW59LG4uZ3JlZW4uc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZ3JlZW49ZX0sbi5ibHVlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdWV9LG4uYmx1ZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ibHVlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSxNZT1uLFJlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcblxcbnVuaWZvcm0gdmVjMiBjZW50ZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBhbXBsaXR1ZGU7XFxudW5pZm9ybSBmbG9hdCB3YXZlbGVuZ3RoO1xcbi8vIHVuaWZvcm0gZmxvYXQgcG93ZXI7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcbnVuaWZvcm0gZmxvYXQgc3BlZWQ7XFxudW5pZm9ybSBmbG9hdCByYWRpdXM7XFxuXFxudW5pZm9ybSBmbG9hdCB0aW1lO1xcblxcbmNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTtcXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgZmxvYXQgaGFsZldhdmVsZW5ndGggPSB3YXZlbGVuZ3RoICogMC41IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBtYXhSYWRpdXMgPSByYWRpdXMgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IGN1cnJlbnRSYWRpdXMgPSB0aW1lICogc3BlZWQgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGZhZGUgPSAxLjA7XFxuXFxuICAgIGlmIChtYXhSYWRpdXMgPiAwLjApIHtcXG4gICAgICAgIGlmIChjdXJyZW50UmFkaXVzID4gbWF4UmFkaXVzKSB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgICAgICBmYWRlID0gMS4wIC0gcG93KGN1cnJlbnRSYWRpdXMgLyBtYXhSYWRpdXMsIDIuMCk7XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKHZUZXh0dXJlQ29vcmQgLSBjZW50ZXIgLyBmaWx0ZXJBcmVhLnh5KTtcXG4gICAgZGlyLnkgKj0gZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGRpcik7XFxuXFxuICAgIGlmIChkaXN0IDw9IDAuMCB8fCBkaXN0IDwgY3VycmVudFJhZGl1cyAtIGhhbGZXYXZlbGVuZ3RoIHx8IGRpc3QgPiBjdXJyZW50UmFkaXVzICsgaGFsZldhdmVsZW5ndGgpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaWZmVVYgPSBub3JtYWxpemUoZGlyKTtcXG5cXG4gICAgZmxvYXQgZGlmZiA9IChkaXN0IC0gY3VycmVudFJhZGl1cykgLyBoYWxmV2F2ZWxlbmd0aDtcXG5cXG4gICAgZmxvYXQgcCA9IDEuMCAtIHBvdyhhYnMoZGlmZiksIDIuMCk7XFxuXFxuICAgIC8vIGZsb2F0IHBvd0RpZmYgPSBkaWZmICogcG93KHAsIDIuMCkgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG4gICAgZmxvYXQgcG93RGlmZiA9IDEuMjUgKiBzaW4oZGlmZiAqIFBJKSAqIHAgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG5cXG4gICAgdmVjMiBvZmZzZXQgPSBkaWZmVVYgKiBwb3dEaWZmIC8gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgLy8gRG8gY2xhbXAgOlxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCArIG9mZnNldDtcXG4gICAgdmVjMiBjbGFtcGVkQ29vcmQgPSBjbGFtcChjb29yZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KTtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXBlZENvb3JkKTtcXG4gICAgaWYgKGNvb3JkICE9IGNsYW1wZWRDb29yZCkge1xcbiAgICAgICAgY29sb3IgKj0gbWF4KDAuMCwgMS4wIC0gbGVuZ3RoKGNvb3JkIC0gY2xhbXBlZENvb3JkKSk7XFxuICAgIH1cXG5cXG4gICAgLy8gTm8gY2xhbXAgOlxcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBvZmZzZXQpO1xcblxcbiAgICBjb2xvci5yZ2IgKj0gMS4wICsgKGJyaWdodG5lc3MgLSAxLjApICogcCAqIGZhZGU7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbn1cXG5cIixqZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQsbixyKXt2b2lkIDA9PT10JiYodD1bMCwwXSksdm9pZCAwPT09biYmKG49e30pLHZvaWQgMD09PXImJihyPTApLGUuY2FsbCh0aGlzLE1lLFJlKSx0aGlzLmNlbnRlcj10LEFycmF5LmlzQXJyYXkobikmJihjb25zb2xlLndhcm4oXCJEZXByZWNhdGVkIFdhcm5pbmc6IFNob2Nrd2F2ZUZpbHRlciBwYXJhbXMgQXJyYXkgaGFzIGJlZW4gY2hhbmdlZCB0byBvcHRpb25zIE9iamVjdC5cIiksbj17fSksbj1PYmplY3QuYXNzaWduKHthbXBsaXR1ZGU6MzAsd2F2ZWxlbmd0aDoxNjAsYnJpZ2h0bmVzczoxLHNwZWVkOjUwMCxyYWRpdXM6LTF9LG4pLHRoaXMuYW1wbGl0dWRlPW4uYW1wbGl0dWRlLHRoaXMud2F2ZWxlbmd0aD1uLndhdmVsZW5ndGgsdGhpcy5icmlnaHRuZXNzPW4uYnJpZ2h0bmVzcyx0aGlzLnNwZWVkPW4uc3BlZWQsdGhpcy5yYWRpdXM9bi5yYWRpdXMsdGhpcy50aW1lPXJ9ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e2NlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxhbXBsaXR1ZGU6e2NvbmZpZ3VyYWJsZTohMH0sd2F2ZWxlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxicmlnaHRuZXNzOntjb25maWd1cmFibGU6ITB9LHNwZWVkOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuLHIpe3RoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sbi5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuY2VudGVyfSxuLmNlbnRlci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5jZW50ZXI9ZX0sbi5hbXBsaXR1ZGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW1wbGl0dWRlfSxuLmFtcGxpdHVkZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGU9ZX0sbi53YXZlbGVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLndhdmVsZW5ndGh9LG4ud2F2ZWxlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy53YXZlbGVuZ3RoPWV9LG4uYnJpZ2h0bmVzcy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5icmlnaHRuZXNzfSxuLmJyaWdodG5lc3Muc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYnJpZ2h0bmVzcz1lfSxuLnNwZWVkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNwZWVkfSxuLnNwZWVkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNwZWVkPWV9LG4ucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1c30sbi5yYWRpdXMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmFkaXVzPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLG4pLHR9KHQuRmlsdGVyKSxMZT1uLGtlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBzYW1wbGVyMkQgdUxpZ2h0bWFwO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjNCBhbWJpZW50Q29sb3I7XFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGRpZmZ1c2VDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzIgbGlnaHRDb29yZCA9ICh2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSkgLyBkaW1lbnNpb25zO1xcbiAgICB2ZWM0IGxpZ2h0ID0gdGV4dHVyZTJEKHVMaWdodG1hcCwgbGlnaHRDb29yZCk7XFxuICAgIHZlYzMgYW1iaWVudCA9IGFtYmllbnRDb2xvci5yZ2IgKiBhbWJpZW50Q29sb3IuYTtcXG4gICAgdmVjMyBpbnRlbnNpdHkgPSBhbWJpZW50ICsgbGlnaHQucmdiO1xcbiAgICB2ZWMzIGZpbmFsQ29sb3IgPSBkaWZmdXNlQ29sb3IucmdiICogaW50ZW5zaXR5O1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGZpbmFsQ29sb3IsIGRpZmZ1c2VDb2xvci5hKTtcXG59XFxuXCIsSWU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4scil7dm9pZCAwPT09biYmKG49MCksdm9pZCAwPT09ciYmKHI9MSksZS5jYWxsKHRoaXMsTGUsa2UpLHRoaXMudW5pZm9ybXMuZGltZW5zaW9ucz1uZXcgRmxvYXQzMkFycmF5KDIpLHRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLHJdKSx0aGlzLnRleHR1cmU9dCx0aGlzLmNvbG9yPW59ZSYmKG4uX19wcm90b19fPWUpLG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yPW47dmFyIHI9e3RleHR1cmU6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09dC5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09dC5zb3VyY2VGcmFtZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0sci50ZXh0dXJlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVMaWdodG1hcH0sci50ZXh0dXJlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVMaWdodG1hcD1lfSxyLmNvbG9yLnNldD1mdW5jdGlvbihlKXt2YXIgbj10aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvcjtcIm51bWJlclwiPT10eXBlb2YgZT8odC51dGlscy5oZXgycmdiKGUsbiksdGhpcy5fY29sb3I9ZSk6KG5bMF09ZVswXSxuWzFdPWVbMV0sblsyXT1lWzJdLG5bM109ZVszXSx0aGlzLl9jb2xvcj10LnV0aWxzLnJnYjJoZXgobikpfSxyLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb2xvcn0sci5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3JbM119LHIuYWxwaGEuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yWzNdPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KHQuRmlsdGVyKSxFZT1uLEJlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBibHVyO1xcbnVuaWZvcm0gZmxvYXQgZ3JhZGllbnRCbHVyO1xcbnVuaWZvcm0gdmVjMiBzdGFydDtcXG51bmlmb3JtIHZlYzIgZW5kO1xcbnVuaWZvcm0gdmVjMiBkZWx0YTtcXG51bmlmb3JtIHZlYzIgdGV4U2l6ZTtcXG5cXG5mbG9hdCByYW5kb20odmVjMyBzY2FsZSwgZmxvYXQgc2VlZClcXG57XFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSkpICogNDM3NTguNTQ1MyArIHNlZWQpO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzQgY29sb3IgPSB2ZWM0KDAuMCk7XFxuICAgIGZsb2F0IHRvdGFsID0gMC4wO1xcblxcbiAgICBmbG9hdCBvZmZzZXQgPSByYW5kb20odmVjMygxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyKSwgMC4wKTtcXG4gICAgdmVjMiBub3JtYWwgPSBub3JtYWxpemUodmVjMihzdGFydC55IC0gZW5kLnksIGVuZC54IC0gc3RhcnQueCkpO1xcbiAgICBmbG9hdCByYWRpdXMgPSBzbW9vdGhzdGVwKDAuMCwgMS4wLCBhYnMoZG90KHZUZXh0dXJlQ29vcmQgKiB0ZXhTaXplIC0gc3RhcnQsIG5vcm1hbCkpIC8gZ3JhZGllbnRCbHVyKSAqIGJsdXI7XFxuXFxuICAgIGZvciAoZmxvYXQgdCA9IC0zMC4wOyB0IDw9IDMwLjA7IHQrKylcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9ICh0ICsgb2Zmc2V0IC0gMC41KSAvIDMwLjA7XFxuICAgICAgICBmbG9hdCB3ZWlnaHQgPSAxLjAgLSBhYnMocGVyY2VudCk7XFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGRlbHRhIC8gdGV4U2l6ZSAqIHBlcmNlbnQgKiByYWRpdXMpO1xcbiAgICAgICAgc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG4gICAgICAgIGNvbG9yICs9IHNhbXBsZSAqIHdlaWdodDtcXG4gICAgICAgIHRvdGFsICs9IHdlaWdodDtcXG4gICAgfVxcblxcbiAgICBjb2xvciAvPSB0b3RhbDtcXG4gICAgY29sb3IucmdiIC89IGNvbG9yLmEgKyAwLjAwMDAxO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjtcXG59XFxuXCIsWGU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLHIsbyxpKXt2b2lkIDA9PT1uJiYobj0xMDApLHZvaWQgMD09PXImJihyPTYwMCksdm9pZCAwPT09byYmKG89bnVsbCksdm9pZCAwPT09aSYmKGk9bnVsbCksZS5jYWxsKHRoaXMsRWUsQmUpLHRoaXMudW5pZm9ybXMuYmx1cj1uLHRoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyPXIsdGhpcy51bmlmb3Jtcy5zdGFydD1vfHxuZXcgdC5Qb2ludCgwLHdpbmRvdy5pbm5lckhlaWdodC8yKSx0aGlzLnVuaWZvcm1zLmVuZD1pfHxuZXcgdC5Qb2ludCg2MDAsd2luZG93LmlubmVySGVpZ2h0LzIpLHRoaXMudW5pZm9ybXMuZGVsdGE9bmV3IHQuUG9pbnQoMzAsMzApLHRoaXMudW5pZm9ybXMudGV4U2l6ZT1uZXcgdC5Qb2ludCh3aW5kb3cuaW5uZXJXaWR0aCx3aW5kb3cuaW5uZXJIZWlnaHQpLHRoaXMudXBkYXRlRGVsdGEoKX1lJiYobi5fX3Byb3RvX189ZSksbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksbi5wcm90b3R5cGUuY29uc3RydWN0b3I9bjt2YXIgcj17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxncmFkaWVudEJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RhcnQ6e2NvbmZpZ3VyYWJsZTohMH0sZW5kOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt0aGlzLnVuaWZvcm1zLmRlbHRhLng9MCx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9MH0sci5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXJ9LHIuYmx1ci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ibHVyPWV9LHIuZ3JhZGllbnRCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cn0sci5ncmFkaWVudEJsdXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyPWV9LHIuc3RhcnQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RhcnR9LHIuc3RhcnQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc3RhcnQ9ZSx0aGlzLnVwZGF0ZURlbHRhKCl9LHIuZW5kLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVuZH0sci5lbmQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZW5kPWUsdGhpcy51cGRhdGVEZWx0YSgpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufSh0LkZpbHRlcikscWU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCgpe2UuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBlJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0LnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciBlPXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LHQ9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0Lnksbj1NYXRoLnNxcnQoZSplK3QqdCk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PWUvbix0aGlzLnVuaWZvcm1zLmRlbHRhLnk9dC9ufSx0fShYZSksTmU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCgpe2UuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBlJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0LnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciBlPXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LHQ9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0Lnksbj1NYXRoLnNxcnQoZSplK3QqdCk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PS10L24sdGhpcy51bmlmb3Jtcy5kZWx0YS55PWUvbn0sdH0oWGUpLFdlPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCxuLHIsbyl7dm9pZCAwPT09dCYmKHQ9MTAwKSx2b2lkIDA9PT1uJiYobj02MDApLHZvaWQgMD09PXImJihyPW51bGwpLHZvaWQgMD09PW8mJihvPW51bGwpLGUuY2FsbCh0aGlzKSx0aGlzLnRpbHRTaGlmdFhGaWx0ZXI9bmV3IHFlKHQsbixyLG8pLHRoaXMudGlsdFNoaWZ0WUZpbHRlcj1uZXcgTmUodCxuLHIsbyl9ZSYmKHQuX19wcm90b19fPWUpLHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQ7dmFyIG49e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sZ3JhZGllbnRCbHVyOntjb25maWd1cmFibGU6ITB9LHN0YXJ0Ontjb25maWd1cmFibGU6ITB9LGVuZDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuKXt2YXIgcj1lLmdldFJlbmRlclRhcmdldCghMCk7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmFwcGx5KGUsdCxyKSx0aGlzLnRpbHRTaGlmdFlGaWx0ZXIuYXBwbHkoZSxyLG4pLGUucmV0dXJuUmVuZGVyVGFyZ2V0KHIpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5ibHVyPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5ibHVyPWV9LG4uZ3JhZGllbnRCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZ3JhZGllbnRCbHVyfSxuLmdyYWRpZW50Qmx1ci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmdyYWRpZW50Qmx1cj10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuZ3JhZGllbnRCbHVyPWV9LG4uc3RhcnQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5zdGFydH0sbi5zdGFydC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLnN0YXJ0PXRoaXMudGlsdFNoaWZ0WUZpbHRlci5zdGFydD1lfSxuLmVuZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmVuZH0sbi5lbmQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5lbmQ9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmVuZD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksR2U9bixLZT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSB2ZWMyIG9mZnNldDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB0d2lzdCh2ZWMyIGNvb3JkKVxcbntcXG4gICAgY29vcmQgLT0gb2Zmc2V0O1xcblxcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGNvb3JkKTtcXG5cXG4gICAgaWYgKGRpc3QgPCByYWRpdXMpXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHJhdGlvRGlzdCA9IChyYWRpdXMgLSBkaXN0KSAvIHJhZGl1cztcXG4gICAgICAgIGZsb2F0IGFuZ2xlTW9kID0gcmF0aW9EaXN0ICogcmF0aW9EaXN0ICogYW5nbGU7XFxuICAgICAgICBmbG9hdCBzID0gc2luKGFuZ2xlTW9kKTtcXG4gICAgICAgIGZsb2F0IGMgPSBjb3MoYW5nbGVNb2QpO1xcbiAgICAgICAgY29vcmQgPSB2ZWMyKGNvb3JkLnggKiBjIC0gY29vcmQueSAqIHMsIGNvb3JkLnggKiBzICsgY29vcmQueSAqIGMpO1xcbiAgICB9XFxuXFxuICAgIGNvb3JkICs9IG9mZnNldDtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSB0d2lzdChjb29yZCk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQgKTtcXG5cXG59XFxuXCIsWWU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0LG4scil7dm9pZCAwPT09dCYmKHQ9MjAwKSx2b2lkIDA9PT1uJiYobj00KSx2b2lkIDA9PT1yJiYocj0yMCksZS5jYWxsKHRoaXMsR2UsS2UpLHRoaXMucmFkaXVzPXQsdGhpcy5hbmdsZT1uLHRoaXMucGFkZGluZz1yfWUmJih0Ll9fcHJvdG9fXz1lKSx0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10O3ZhciBuPXtvZmZzZXQ6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9LGFuZ2xlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5vZmZzZXQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub2Zmc2V0fSxuLm9mZnNldC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5vZmZzZXQ9ZX0sbi5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSxuLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9ZX0sbi5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbmdsZX0sbi5hbmdsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbmdsZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxuKSx0fSh0LkZpbHRlciksUWU9bixVZT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gdmVjMiB1Q2VudGVyO1xcbnVuaWZvcm0gZmxvYXQgdVN0cmVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgdUlubmVyUmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgdVJhZGl1cztcXG5cXG5jb25zdCBmbG9hdCBNQVhfS0VSTkVMX1NJWkUgPSAzMi4wO1xcblxcbi8vIGF1dGhvcjogaHR0cDovL2J5dGVibGFja3NtaXRoLmNvbS9pbXByb3ZlbWVudHMtdG8tdGhlLWNhbm9uaWNhbC1vbmUtbGluZXItZ2xzbC1yYW5kLWZvci1vcGVuZ2wtZXMtMi0wL1xcbmhpZ2hwIGZsb2F0IHJhbmQodmVjMiBjbywgZmxvYXQgc2VlZCkge1xcbiAgICBjb25zdCBoaWdocCBmbG9hdCBhID0gMTIuOTg5OCwgYiA9IDc4LjIzMywgYyA9IDQzNzU4LjU0NTM7XFxuICAgIGhpZ2hwIGZsb2F0IGR0ID0gZG90KGNvICsgc2VlZCwgdmVjMihhLCBiKSksIHNuID0gbW9kKGR0LCAzLjE0MTU5KTtcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihzbikgKiBjICsgc2VlZCk7XFxufVxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gICAgZmxvYXQgbWluR3JhZGllbnQgPSB1SW5uZXJSYWRpdXMgKiAwLjM7XFxuICAgIGZsb2F0IGlubmVyUmFkaXVzID0gKHVJbm5lclJhZGl1cyArIG1pbkdyYWRpZW50ICogMC41KSAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgZ3JhZGllbnQgPSB1UmFkaXVzICogMC4zO1xcbiAgICBmbG9hdCByYWRpdXMgPSAodVJhZGl1cyAtIGdyYWRpZW50ICogMC41KSAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgY291bnRMaW1pdCA9IE1BWF9LRVJORUxfU0laRTtcXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKHVDZW50ZXIueHkgLyBmaWx0ZXJBcmVhLnh5IC0gdlRleHR1cmVDb29yZCk7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgodmVjMihkaXIueCwgZGlyLnkgKiBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLngpKTtcXG5cXG4gICAgZmxvYXQgc3RyZW5ndGggPSB1U3RyZW5ndGg7XFxuXFxuICAgIGZsb2F0IGRlbHRhID0gMC4wO1xcbiAgICBmbG9hdCBnYXA7XFxuICAgIGlmIChkaXN0IDwgaW5uZXJSYWRpdXMpIHtcXG4gICAgICAgIGRlbHRhID0gaW5uZXJSYWRpdXMgLSBkaXN0O1xcbiAgICAgICAgZ2FwID0gbWluR3JhZGllbnQ7XFxuICAgIH0gZWxzZSBpZiAocmFkaXVzID49IDAuMCAmJiBkaXN0ID4gcmFkaXVzKSB7IC8vIHJhZGl1cyA8IDAgbWVhbnMgaXQncyBpbmZpbml0eVxcbiAgICAgICAgZGVsdGEgPSBkaXN0IC0gcmFkaXVzO1xcbiAgICAgICAgZ2FwID0gZ3JhZGllbnQ7XFxuICAgIH1cXG5cXG4gICAgaWYgKGRlbHRhID4gMC4wKSB7XFxuICAgICAgICBmbG9hdCBub3JtYWxDb3VudCA9IGdhcCAvIGZpbHRlckFyZWEueDtcXG4gICAgICAgIGRlbHRhID0gKG5vcm1hbENvdW50IC0gZGVsdGEpIC8gbm9ybWFsQ291bnQ7XFxuICAgICAgICBjb3VudExpbWl0ICo9IGRlbHRhO1xcbiAgICAgICAgc3RyZW5ndGggKj0gZGVsdGE7XFxuICAgICAgICBpZiAoY291bnRMaW1pdCA8IDEuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAvLyByYW5kb21pemUgdGhlIGxvb2t1cCB2YWx1ZXMgdG8gaGlkZSB0aGUgZml4ZWQgbnVtYmVyIG9mIHNhbXBsZXNcXG4gICAgZmxvYXQgb2Zmc2V0ID0gcmFuZCh2VGV4dHVyZUNvb3JkLCAwLjApO1xcblxcbiAgICBmbG9hdCB0b3RhbCA9IDAuMDtcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG5cXG4gICAgZGlyICo9IHN0cmVuZ3RoO1xcblxcbiAgICBmb3IgKGZsb2F0IHQgPSAwLjA7IHQgPCBNQVhfS0VSTkVMX1NJWkU7IHQrKykge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9ICh0ICsgb2Zmc2V0KSAvIE1BWF9LRVJORUxfU0laRTtcXG4gICAgICAgIGZsb2F0IHdlaWdodCA9IDQuMCAqIChwZXJjZW50IC0gcGVyY2VudCAqIHBlcmNlbnQpO1xcbiAgICAgICAgdmVjMiBwID0gdlRleHR1cmVDb29yZCArIGRpciAqIHBlcmNlbnQ7XFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgcCk7XFxuXFxuICAgICAgICAvLyBzd2l0Y2ggdG8gcHJlLW11bHRpcGxpZWQgYWxwaGEgdG8gY29ycmVjdGx5IGJsdXIgdHJhbnNwYXJlbnQgaW1hZ2VzXFxuICAgICAgICAvLyBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcblxcbiAgICAgICAgY29sb3IgKz0gc2FtcGxlICogd2VpZ2h0O1xcbiAgICAgICAgdG90YWwgKz0gd2VpZ2h0O1xcblxcbiAgICAgICAgaWYgKHQgPiBjb3VudExpbWl0KXtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBjb2xvciAvPSB0b3RhbDtcXG4gICAgLy8gc3dpdGNoIGJhY2sgZnJvbSBwcmUtbXVsdGlwbGllZCBhbHBoYVxcbiAgICAvLyBjb2xvci5yZ2IgLz0gY29sb3IuYSArIDAuMDAwMDE7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbn1cXG5cIixaZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQsbixyLG8pe3ZvaWQgMD09PXQmJih0PS4xKSx2b2lkIDA9PT1uJiYobj1bMCwwXSksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09byYmKG89LTEpLGUuY2FsbCh0aGlzLFFlLFVlKSx0aGlzLmNlbnRlcj1uLHRoaXMuc3RyZW5ndGg9dCx0aGlzLmlubmVyUmFkaXVzPXIsdGhpcy5yYWRpdXM9b31lJiYodC5fX3Byb3RvX189ZSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dDt2YXIgbj17Y2VudGVyOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGlubmVyUmFkaXVzOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4uY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVDZW50ZXJ9LG4uY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVDZW50ZXI9ZX0sbi5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51U3RyZW5ndGh9LG4uc3RyZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudVN0cmVuZ3RoPWV9LG4uaW5uZXJSYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUlubmVyUmFkaXVzfSxuLmlubmVyUmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVJbm5lclJhZGl1cz1lfSxuLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxuLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7KGU8MHx8ZT09PTEvMCkmJihlPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXModC5wcm90b3R5cGUsbiksdH0odC5GaWx0ZXIpO3JldHVybiBlLkFkanVzdG1lbnRGaWx0ZXI9byxlLkFkdmFuY2VkQmxvb21GaWx0ZXI9cCxlLkFzY2lpRmlsdGVyPWcsZS5CZXZlbEZpbHRlcj15LGUuQmxvb21GaWx0ZXI9RixlLkJ1bGdlUGluY2hGaWx0ZXI9dyxlLkNvbG9yTWFwRmlsdGVyPU8sZS5Db2xvclJlcGxhY2VGaWx0ZXI9UixlLkNvbnZvbHV0aW9uRmlsdGVyPWssZS5Dcm9zc0hhdGNoRmlsdGVyPUIsZS5DUlRGaWx0ZXI9TixlLkRvdEZpbHRlcj1LLGUuRHJvcFNoYWRvd0ZpbHRlcj1VLGUuRW1ib3NzRmlsdGVyPUgsZS5HbGl0Y2hGaWx0ZXI9ZWUsZS5HbG93RmlsdGVyPXJlLGUuR29kcmF5RmlsdGVyPXNlLGUuS2F3YXNlQmx1ckZpbHRlcj1hLGUuTW90aW9uQmx1ckZpbHRlcj1jZSxlLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPXBlLGUuT2xkRmlsbUZpbHRlcj1nZSxlLk91dGxpbmVGaWx0ZXI9eWUsZS5QaXhlbGF0ZUZpbHRlcj1DZSxlLlJhZGlhbEJsdXJGaWx0ZXI9emUsZS5SZWZsZWN0aW9uRmlsdGVyPVRlLGUuUkdCU3BsaXRGaWx0ZXI9UGUsZS5TaG9ja3dhdmVGaWx0ZXI9amUsZS5TaW1wbGVMaWdodG1hcEZpbHRlcj1JZSxlLlRpbHRTaGlmdEZpbHRlcj1XZSxlLlRpbHRTaGlmdEF4aXNGaWx0ZXI9WGUsZS5UaWx0U2hpZnRYRmlsdGVyPXFlLGUuVGlsdFNoaWZ0WUZpbHRlcj1OZSxlLlR3aXN0RmlsdGVyPVllLGUuWm9vbUJsdXJGaWx0ZXI9WmUsZX0oe30sUElYSSk7T2JqZWN0LmFzc2lnbihQSVhJLmZpbHRlcnMsdGhpcz90aGlzLl9fZmlsdGVyczpfX2ZpbHRlcnMpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1maWx0ZXJzLmpzLm1hcFxuIl19
