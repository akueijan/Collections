"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}var production=!1===$("#appjs").data("mode"),friendo_url=$("#appjs").data("site"),device=deviceCheck();Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production;var md=new MobileDetect(window.navigator.userAgent),tag=document.createElement("script");function findGetParameter(t){var n=null,o=[];return location.search.substr(1).split("&").forEach(function(e){(o=e.split("="))[0]===t&&(n=decodeURIComponent(o[1]))}),n}function checkCookie(t){var n=null,o=[];return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(o=e.split("="))[0]===t&&(n=o[1])}),n}function deviceCheck(){var e={},t=new MobileDetect(window.navigator.userAgent);return t.match(/android/i)?(e.os="android",e.version=t.version("android")):t.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=t.version("iOS")):(e.os="pc",e.version=t.version("Chrome")),e}$(function(){console.log("v1.0"),console.log(device),$(".nav").menu()}),Vue.mixin({data:function(){return{status:"",startDate:"",endDate:"",projectStatus:null,errorMsg:"",envMode:production?"Started":"Testing",loading:!1,mainToken:"",isPc:!1,popup:!1,popPage:!1,slickPage:"",utm:""}},computed:{},watch:{errorMsg:function(e){$("body").toggleClass("_freeze")}},methods:{gaEvant:function(e){dataLayer.push({event:e}),console.log("ga:",e)},server_busy:function(){var e=this;e.errorMsg="系統忙碌中，請稍後在試!",e.loading=!1,e.errorCou=6},setCookie:function(e,t,n){var o=new Date;o.setTime(o.getTime()+1e3*n);var i="expires="+o.toUTCString();document.cookie=e+"="+t+";"+i+";"},logger:function(e,t,n){if(production){_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(t),path:window.location.href,tag:n||null,device:device,timestamp:Date.now()})}},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){$("html,body").animate({scrollTop:$(e).offset().top},500)},getToken:function(){var t=this;return $.ajax({url:"".concat(friendo_url,"auth/login?projectId=66"),headers:{webtoken:"WBqIHc9hTmwyL+g9m0ykfA=="},method:"GET",dataType:"json"}).done(function(e){t.mainToken=e.token,t.startDate=e.startDate,t.endDate=e.endDate,t.projectStatus=e.projectStatus})},grecaptcha:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(n){var o=this;return new Promise(function(t,e){grecaptcha.execute("6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ",{action:n}).then(function(e){o.reCaptcha=e,t()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})}),popAni:function(e){var n=this;n.popup=!0,n.popPage=!0,n.slickPage=e,setTimeout(function(){var e=new slickUse(".slickblock",!1);e.Start(),$(".btn-prev").click(function(){e.Prev()}),$(".btn-next").click(function(){e.Next()}),"notice"===n.slickPage&&new slickUse(".slickstep",!0).Start();var t=new TimelineMax({onComplete:function(){n.popPage=!1,$(".popup").css("overflow-y","auto")}});t.from(".anipage .content",1.5,{x:-1590}),t.to(".anipage .door",1.2,{x:-650}),t.to(".anipage .content",1.5,{css:{scale:2,transformOrigin:"27% 30%"}})},50)},popClose:function(){this.popPage="",this.popup=!1},checkBrower:function(e){1e3<window.innerWidth?(this.isPc=!0,document.querySelector("body").style="overflow: hidden","index"!==e&&(window.location="index.html")):this.isPc=!1},searhUtm:function(){var o=this;return new Promise(function(e){var t=location.href,n=new URL(t);o.utm=n.search.replace("?","&"),e()})}},mounted:function(){}});var slickUse=function(){function n(e,t){_classCallCheck(this,n),this.bd=e,this.auto=t}return _createClass(n,[{key:"Start",value:function(){$(this.bd).slick({arrows:!1,autoplay:this.auto})}},{key:"Next",value:function(){$(this.bd).slick("slickNext")}},{key:"Prev",value:function(){$(this.bd).slick("slickPrev")}}]),n}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJwcm9kdWN0aW9uIiwiJCIsImRhdGEiLCJmcmllbmRvX3VybCIsImRldmljZSIsImRldmljZUNoZWNrIiwiVnVlIiwiY29uZmlnIiwiZGV2dG9vbHMiLCJkZWJ1ZyIsIndpbmRvdyIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImZpbmRHZXRQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJOYW1lIiwicmVzdWx0IiwibG9jYXRpb24iLCJzZWFyY2giLCJzcGxpdCIsInRtcCIsIml0ZW0iLCJkZWNvZGVVUklDb21wb25lbnQiLCJjaGVja0Nvb2tpZSIsImNvb2tpZSIsImNoYXJBdCIsInN1YnN0cmluZyIsImZvckVhY2giLCJNb2JpbGVEZXRlY3QiLCJ2ZXJzaW9uIiwib3MiLCJtYXRjaCIsIm1kIiwidGFnIiwiY29uc29sZSIsImxvZyIsIm1lbnUiLCJzdGF0dXMiLCJzdGFydERhdGUiLCJlbmREYXRlIiwicHJvamVjdFN0YXR1cyIsImVycm9yTXNnIiwiZW52TW9kZSIsImxvYWRpbmciLCJtYWluVG9rZW4iLCJpc1BjIiwicG9wUGFnZSIsInNsaWNrUGFnZSIsInV0bSIsImNvbXB1dGVkIiwidG9nZ2xlQ2xhc3MiLCJ2YWwiLCJnYUV2YW50IiwiZGF0YUxheWVyIiwicHVzaCIsImd0bURhdGEiLCJzZXJ2ZXJfYnVzeSIsInZtIiwidGhpcyIsInNldENvb2tpZSIsImNuYW1lIiwiY3ZhbHVlIiwidGltZSIsImQiLCJEYXRlIiwic2V0VGltZSIsImdldFRpbWUiLCJ0b1VUQ1N0cmluZyIsImV4cGlyZXMiLCJsb2dnZXIiLCJsZXZlbCIsImNvbnRlbnQiLCJsZXZlbF9pbmZvIiwiSlNPTiIsInN0cmluZ2lmeSIsImhyZWYiLCJ0aW1lc3RhbXAiLCJub3ciLCJjaGVja09ubGluZSIsIm9uTGluZSIsImFsZXJ0Iiwic2Nyb2xsVG8iLCJlIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImdldFRva2VuIiwiYWpheCIsInVybCIsImNvbmNhdCIsImhlYWRlcnMiLCJ3ZWJ0b2tlbiIsIm1ldGhvZCIsImRhdGFUeXBlIiwicmVzIiwidG9rZW4iLCJncmVjYXB0Y2hhIiwiX2dyZWNhcHRjaGEiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwidG9TdHJpbmciLCJwYWdlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJleGVjdXRlIiwiYWN0aW9uIiwidGhlbiIsInJlQ2FwdGNoYSIsInRlYWNocGFnZSIsImluZGV4U2xpY2siLCJzbGlja1VzZSIsIlN0YXJ0IiwiY2xpY2siLCJOZXh0IiwidGwiLCJUaW1lbGluZU1heCIsIm9uQ29tcGxldGUiLCJjc3MiLCJmcm9tIiwic2VjIiwieCIsInRvIiwic2NhbGUiLCJ0cmFuc2Zvcm1PcmlnaW4iLCJwb3BDbG9zZSIsInBvcHVwIiwiaW5uZXJXaWR0aCIsInF1ZXJ5U2VsZWN0b3IiLCJzdHlsZSIsInNlYXJoVXRtIiwiZ2V0VXJsU3RyaW5nIiwiVVJMIiwicmVwbGFjZSIsIm1vdW50ZWQiLCJiZCIsImF1dG8iLCJfY2xhc3NDYWxsQ2hlY2siLCJzbGljayIsImFycm93cyIsImF1dG9wbGF5Il0sIm1hcHBpbmdzIjoibVpBQUEsSUFDSUEsWUFBMEMsSUFBN0JDLEVBQUUsVUFBVUMsS0FBSyxRQUM5QkMsWUFBY0YsRUFBRSxVQUFVQyxLQUFLLFFBRTdCRSxPQUFTQyxjQUVmQyxJQUFJQyxPQUFPQyxVQUFZUixXQUN2Qk0sSUFBSUMsT0FBT0UsT0FBU1QsV0FQcEJNLElBQ0lOLE9BQUFBLE9BQWVBLFdBR25CLElBQU1JLEdBQUFBLElBQVNDLGFBQWZLLE9BQUFDLFVBQUFDLFdBR0lMLElBQUpNLFNBQW1CQyxjQUFuQixVQWNBLFNBQVNDLGlCQUFpQkMsR0FBMUIsSUFBQUMsRUFBU0YsS0FDREUsRUFBTSxHQWFkLE9BYklDLFNBQ1VDLE9BQ1ZELE9BQVNDLEdBSUVDLE1BQVFBLEtBQ1BDLFFBQUEsU0FBV0wsSUFMdkJLLEVBQUFD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QUNBakMsU0FBQXNILGNBQUEsUUFBQUMsTUFBQSxtQkFDQSxVQUFBNUIsSUFDQTlGLE9BQUFRLFNBQUEsZUFqQndCNkcsS0FvQnhCakYsTUFBQSxHQWFKdUYsU0E5SVMsV0FvSUYzSCxJQUFNZ0QsRUFBQ3dFLEtBRU5ySCxPQUFTc0gsSUFBQUEsUUFBYyxTQUFRQyxHQVkvQixJQUFJRSxFQUFlcEgsU0FBUzBELEtBWHJCYyxFQUFLLElBQVM2QyxJQUFBRCxHQUNYNUUsRUFBQ3hDLElBQVB3RSxFQUFrQnZFLE9BQUFxSCxRQUFsQixJQUFBLEtBQ0g5QixRQUlSK0IsUUE5SUksbUJBcUpHL0Usb0JBQ0FnRCxTQUFBQSxFQUFPZ0MsRUFBQUMsR0FBQUMsZ0JBQUFqRixLQUFBdUQsR0FKWHZELEtBQUErRSxHQUFBQSxFQU1IL0UsS0FBQWdGLEtBQUFBLHVEQWlCRDFJLEVBQUUwRCxLQUFLK0UsSUFBSUcsTUFBTSxDQUNiQyxRQUFRLEVBVGhCQyxTQUFBcEYsS0FBZ0JnRixzQ0FJWjFJLEVBQUEwRCxLQUFBK0UsSUFBQUcsTUFBQSw0Q0FjQTVJLEVBQUUwRCxLQUFLK0UsSUFBSUcsTUFBTSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdFxyXG4gICAgcHJvZHVjdGlvbiA9ICQoXCIjYXBwanNcIikuZGF0YShcIm1vZGVcIikgPT09IGZhbHNlLFxyXG4gICAgZnJpZW5kb191cmwgPSAkKFwiI2FwcGpzXCIpLmRhdGEoXCJzaXRlXCIpO1xyXG5cclxuY29uc3QgZGV2aWNlID0gZGV2aWNlQ2hlY2soKTtcclxuXHJcblZ1ZS5jb25maWcuZGV2dG9vbHMgPSAhcHJvZHVjdGlvbjtcclxuVnVlLmNvbmZpZy5kZWJ1ZyA9ICFwcm9kdWN0aW9uO1xyXG5WdWUuY29uZmlnLnNpbGVudCA9IHByb2R1Y3Rpb247XHJcblxyXG52YXIgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbnZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJ2MS4wXCIpO1xyXG4gICAgY29uc29sZS5sb2coZGV2aWNlKTtcclxuICAgICQoXCIubmF2XCIpLm1lbnUoKTtcclxufSk7IFxyXG5cclxuXHJcbmZ1bmN0aW9uIGZpbmRHZXRQYXJhbWV0ZXIocGFyYW1ldGVyTmFtZSkge1xyXG4gICAgdmFyIHJlc3VsdCA9IG51bGwsXHJcbiAgICAgICAgdG1wID0gW107XHJcbiAgICBsb2NhdGlvbi5zZWFyY2hcclxuICAgICAgICAuc3Vic3RyKDEpXHJcbiAgICAgICAgLnNwbGl0KFwiJlwiKVxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHRtcCA9IGl0ZW0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBpZiAodG1wWzBdID09PSBwYXJhbWV0ZXJOYW1lKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVjb2RlVVJJQ29tcG9uZW50KHRtcFsxXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0Nvb2tpZShwYXJhbWV0ZXJOYW1lKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gbnVsbCxcclxuICAgICAgICB0bXAgPSBbXTtcclxuICAgIHZhciBjb29raWUgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICBjb29raWUuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uY2hhckF0KDApID09IFwiIFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG1wID0gaXRlbS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGlmICh0bXBbMF0gPT09IHBhcmFtZXRlck5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0bXBbMV07XHJcbiAgICAgICAgfSlcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gZGV2aWNlQ2hlY2soKSB7XHJcbiAgICB2YXIgZGV2aWNlID0ge307XHJcbiAgICB2YXIgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuICAgIGlmIChtZC5tYXRjaCgvYW5kcm9pZC9pKSkge1xyXG4gICAgICAgIGRldmljZS5vcyA9IFwiYW5kcm9pZFwiO1xyXG4gICAgICAgIGRldmljZS52ZXJzaW9uID0gbWQudmVyc2lvbihcImFuZHJvaWRcIik7XHJcbiAgICB9IGVsc2UgaWYgKG1kLm1hdGNoKC8oaXBob25lfGlwYWR8aXBvZCk7Py9pKSkge1xyXG4gICAgICAgIGRldmljZS5vcyA9IFwiaW9zXCI7XHJcbiAgICAgICAgZGV2aWNlLnZlcnNpb24gPSBtZC52ZXJzaW9uKFwiaU9TXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSBcInBjXCI7XHJcbiAgICAgICAgZGV2aWNlLnZlcnNpb24gPSBtZC52ZXJzaW9uKFwiQ2hyb21lXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRldmljZTtcclxufVxyXG5cclxuVnVlLm1peGluKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IFwiXCIsXHJcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogXCJcIixcclxuICAgICAgICAgICAgZW5kRGF0ZTogXCJcIixcclxuICAgICAgICAgICAgcHJvamVjdFN0YXR1czogbnVsbCxcclxuICAgICAgICAgICAgZXJyb3JNc2c6IFwiXCIsXHJcbiAgICAgICAgICAgIGVudk1vZGU6IHByb2R1Y3Rpb24gPyBcIlN0YXJ0ZWRcIiA6IFwiVGVzdGluZ1wiLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgbWFpblRva2VuOlwiXCIsXHJcbiAgICAgICAgICAgIGlzUGM6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb3B1cDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvcFBhZ2U6IGZhbHNlLFxyXG4gICAgICAgICAgICBzbGlja1BhZ2U6IFwiXCIsIC8vbm90aWNlIGZpeGVkIGV4Y2hhbmdlXHJcbiAgICAgICAgICAgIHV0bTogXCJcIixcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAgIGVycm9yTXNnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgZ2FFdmFudDogZnVuY3Rpb24gKGd0bURhdGEpIHtcclxuICAgICAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGd0bURhdGF9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYTpcIiwgZ3RtRGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXJ2ZXJfYnVzeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2bS5lcnJvck1zZyA9IFwi57O757Wx5b+Z56KM5Lit77yM6KuL56iN5b6M5Zyo6KmmIVwiO1xyXG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLmVycm9yQ291ID0gNjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldENvb2tpZTogZnVuY3Rpb24gKGNuYW1lLCBjdmFsdWUsIHRpbWUpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAodGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvVVRDU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZ2dlcjogZnVuY3Rpb24gKGxldmVsLCBjb250ZW50LCB0YWcpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIGxldmVsIDogWydFUlJPUicgPT4gMCwgREVCVUcnID0+IDEsICdXQVJOSU5HJyA9PiAyLCAnSU5GTycgPT4gMywgJ0FMTCcgPT4gNF1cclxuICAgICAgICAgICAgICAgIHZhciBsZXZlbF9pbmZvID0gWydFUlJPUicsICdERUJVRycsICdXQVJOSU5HJywgJ0lORk8nLCAnQUxMJ107XHJcbiAgICAgICAgICAgICAgICBfTFRyYWNrZXIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xldmVsJzogbGV2ZWxfaW5mb1tsZXZlbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBKU09OLnN0cmluZ2lmeShjb250ZW50KSxcclxuICAgICAgICAgICAgICAgICAgICAncGF0aCc6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICAgICAgICAgICd0YWcnOiB0YWcgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAnZGV2aWNlJzogZGV2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICd0aW1lc3RhbXAnOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hlY2tPbmxpbmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkludGVybmV0IOmAo+e3muW3suaWt+mWi++8jOiri+eiuuiqjeaCqOeahOe2sui3r+eLgOaFi+OAglwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoZSkub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUb2tlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgLy8gdXJsOiBcImh0dHBzOi8vY2FycmVmb3VyMjAxOWNueS5henVyZXdlYnNpdGVzLm5ldC9hcGkvYXV0aC9sb2dpbj9wcm9qZWN0SWQ9NjFcIixcclxuICAgICAgICAgICAgICAgIHVybDogYCR7ZnJpZW5kb191cmx9YXV0aC9sb2dpbj9wcm9qZWN0SWQ9NjZgLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwid2VidG9rZW5cIjogXCJXQnFJSGM5aFRtd3lMK2c5bTB5a2ZBPT1cIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxyXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1haW5Ub2tlbiA9IHJlcy50b2tlbjtcclxuICAgICAgICAgICAgICAgIHZtLnN0YXJ0RGF0ZSA9IHJlcy5zdGFydERhdGU7XHJcbiAgICAgICAgICAgICAgICB2bS5lbmREYXRlID0gcmVzLmVuZERhdGU7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0U3RhdHVzID0gcmVzLnByb2plY3RTdGF0dXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JlY2FwdGNoYTogZnVuY3Rpb24gKHBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIGdyZWNhcHRjaGEuZXhlY3V0ZSgnNkxmVW83TVVBQUFBQUpRQU1MMDhydWhQZVladmloTFlhVnZ0dVlySicsIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHBhZ2VcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVDYXB0Y2hhID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0dvb2dsZempl+itieWkseaVl++8jOiri+WGjeasoeWYl+ipplxcbuWmgueEoeazleaOkumZpOatpOWVj+mhjO+8jOW7uuitsOmHjeaWsOaVtOeQhuatpOmggemdoicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcG9wQW5pKHRlYWNocGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2bS5wb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2bS5zbGlja1BhZ2UgPSB0ZWFjaHBhZ2U7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4U2xpY2sgPSBuZXcgc2xpY2tVc2UoXCIuc2xpY2tibG9ja1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpbmRleFNsaWNrLlN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmJ0bi1wcmV2XCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4U2xpY2suUHJldigpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICQoXCIuYnRuLW5leHRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhTbGljay5OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHZtLnNsaWNrUGFnZSA9PT0gXCJub3RpY2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGVwU2xpY2sgPSBuZXcgc2xpY2tVc2UoXCIuc2xpY2tzdGVwXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBTbGljay5TdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VjID0gMC42O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KHtcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5wb3B1cFwiKS5jc3MoXCJvdmVyZmxvdy15XCIsXCJhdXRvXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0bC5mcm9tKFwiLmFuaXBhZ2UgLmNvbnRlbnRcIiwgc2VjKjIuNSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IC0xNTkwLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRsLnRvKFwiLmFuaXBhZ2UgLmRvb3JcIiwgc2VjKjIsIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiAtNjUwLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRsLnRvKFwiLmFuaXBhZ2UgLmNvbnRlbnRcIiwgc2VjKjIuNSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNzczoge3NjYWxlOiAyLCB0cmFuc2Zvcm1PcmlnaW46XCIyNyUgMzAlXCJ9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCA1MClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvcENsb3NlKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdm0ucG9wUGFnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZtLnBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja0Jyb3dlcihwYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5pbm5lcldpZHRoICk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgICAgICAgICAvLyBpZighbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgnSW5zdGFncmFtJykpIHtcclxuICAgICAgICAgICAgLy8gICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID4gNzY4KSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdm0uaXNQYyA9IHRydWVcclxuICAgICAgICAgICAgLy8gICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5zdHlsZSA9IFwib3ZlcmZsb3c6IGhpZGRlblwiXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYocGFnZSAhPT0gXCJpbmRleFwiKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IFwiaW5kZXguaHRtbFwiXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCkge1xyXG4gICAgICAgICAgICAgICAgdm0uaXNQYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5zdHlsZSA9IFwib3ZlcmZsb3c6IGhpZGRlblwiXHJcbiAgICAgICAgICAgICAgICBpZihwYWdlICE9PSBcImluZGV4XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBcImluZGV4Lmh0bWxcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0uaXNQYyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyaFV0bSgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2V0VXJsU3RyaW5nID0gbG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBuZXcgVVJMKGdldFVybFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB2bS51dG0gPSB1cmwuc2VhcmNoLnJlcGxhY2UoJz8nLCAnJicpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICB9XHJcbn0pXHJcblxyXG5jbGFzcyBzbGlja1VzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihiZCwgYXV0bykge1xyXG4gICAgICAgIHRoaXMuYmQgPSBiZDtcclxuICAgICAgICB0aGlzLmF1dG8gPSBhdXRvO1xyXG4gICAgICAgIC8vIHRoaXMuU2xpZGUgPSBTbGlkZVxyXG4gICAgICAgIC8vIHRoaXMucHJldiA9IHByZXY7XHJcbiAgICAgICAgLy8gdGhpcy5uZXh0ID0gbmV4dFxyXG4gICAgfVxyXG4gICAgU3RhcnQoKSB7XHJcbiAgICAgICAgJCh0aGlzLmJkKS5zbGljayh7XHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiB0aGlzLmF1dG9cclxuICAgICAgICAgICAgLy8gaW5pdGlhbFNsaWRlOiB0aGlzLlNsaWRlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBOZXh0KCkge1xyXG4gICAgICAgICQodGhpcy5iZCkuc2xpY2soXCJzbGlja05leHRcIik7XHJcbiAgICB9XHJcbiAgICBQcmV2KCkge1xyXG4gICAgICAgICQodGhpcy5iZCkuc2xpY2soXCJzbGlja1ByZXZcIik7XHJcbiAgICB9XHJcbn0iXX0=
