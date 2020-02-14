"use strict";var production="false"===$("#appjs").data("mode"),friendo_url=$("#appjs").data("site"),device=deviceCheck();Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production;var md=new MobileDetect(window.navigator.userAgent),tag=document.createElement("script");function findGetParameter(t){var n=null,o=[];return location.search.substr(1).split("&").forEach(function(e){(o=e.split("="))[0]===t&&(n=decodeURIComponent(o[1]))}),n}function checkCookie(t){var n=null,o=[];return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(o=e.split("="))[0]===t&&(n=o[1])}),n}function deviceCheck(){var e={},t=new MobileDetect(window.navigator.userAgent);return t.match(/android/i)?(e.os="android",e.version=t.version("android")):t.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=t.version("iOS")):(e.os="pc",e.version=t.version("Chrome")),e}$(function(){console.log("v1.0"),console.log(device),$(".nav").menu()}),Vue.mixin({data:function(){return{status:"",startDate:"",endDate:"",projectStatus:null,errorMsg:"",envMode:production?"Started":"Testing",loading:!1,mainToken:""}},computed:{},watch:{errorMsg:function(e){$("body").toggleClass("_freeze")}},methods:{gaEvant:function(e){dataLayer.push({event:e}),console.log("ga:",e)},server_busy:function(){var e=this;e.errorMsg="系統忙碌中，請稍後在試!",e.loading=!1,e.errorCou=6},setCookie:function(e,t,n){var o=new Date;o.setTime(o.getTime()+1e3*n);var i="expires="+o.toUTCString();document.cookie=e+"="+t+";"+i+";"},logger:function(e,t,n){if(production){_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(t),path:window.location.href,tag:n||null,device:device,timestamp:Date.now()})}},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){$("html,body").animate({scrollTop:$(e).offset().top-this.navHeight},500)},getToken:function(){var t=this;return $.ajax({url:"".concat(friendo_url,"auth/login?projectId=66"),headers:{webtoken:"WBqIHc9hTmwyL+g9m0ykfA=="},method:"GET",dataType:"json"}).done(function(e){t.mainToken=e.token,t.startDate=e.startDate,t.endDate=e.endDate,t.projectStatus=e.projectStatus})},grecaptcha:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(n){var o=this;return new Promise(function(t,e){grecaptcha.execute("6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ",{action:n}).then(function(e){o.reCaptcha=e,t()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})})},mounted:function(){}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJwcm9kdWN0aW9uIiwiJCIsImRhdGEiLCJkZXZpY2UiLCJkZXZpY2VDaGVjayIsIlZ1ZSIsImNvbmZpZyIsImRlYnVnIiwic2lsZW50IiwibWQiLCJNb2JpbGVEZXRlY3QiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjb25zb2xlIiwibG9nIiwidG1wIiwicGFyYW1ldGVyTmFtZSIsInJlc3VsdCIsIml0ZW0iLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsImNoZWNrQ29va2llIiwic3BsaXQiLCJkb2N1bWVudCIsImNvb2tpZSIsImZvckVhY2giLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJzdGFydERhdGUiLCJ2ZXJzaW9uIiwib3MiLCJtYXRjaCIsImZpbmRHZXRQYXJhbWV0ZXIiLCJtZW51IiwiZXJyb3JNc2ciLCJlbnZNb2RlIiwibG9hZGluZyIsIm1haW5Ub2tlbiIsImVuZERhdGUiLCJwcm9qZWN0U3RhdHVzIiwidmFsIiwidG9nZ2xlQ2xhc3MiLCJnYUV2YW50Iiwid2F0Y2giLCJtZXRob2RzIiwiZ3RtRGF0YSIsInB1c2giLCJldmVudCIsImVycm9yQ291Iiwic2V0Q29va2llIiwidm0iLCJEYXRlIiwic2V0VGltZSIsImV4cGlyZXMiLCJjbmFtZSIsImxvZ2dlciIsImxldmVsIiwiY29udGVudCIsInRhZyIsImQiLCJnZXRUaW1lIiwidGltZSIsImxldmVsX2luZm8iLCJ0b1VUQ1N0cmluZyIsImN2YWx1ZSIsInN0cmluZ2lmeSIsIl9MVHJhY2tlciIsIkpTT04iLCJwYXRoIiwiaHJlZiIsInRpbWVzdGFtcCIsIm5vdyIsInNjcm9sbFRvIiwib25MaW5lIiwiYWxlcnQiLCJhbmltYXRlIiwiZ2V0VG9rZW4iLCJlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwidGhpcyIsIm5hdkhlaWdodCIsIm1ldGhvZCIsImFqYXgiLCJ1cmwiLCJjb25jYXQiLCJyZXMiLCJ3ZWJ0b2tlbiIsImRhdGFUeXBlIiwiZG9uZSIsInRva2VuIiwiZ3JlY2FwdGNoYSIsIl9ncmVjYXB0Y2hhIiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsInRvU3RyaW5nIiwicGFnZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhlY3V0ZSIsImFjdGlvbiIsInRoZW4iLCJyZUNhcHRjaGEiLCJtb3VudGVkIl0sIm1hcHBpbmdzIjoiYUFBQSxJQUNJQSxXQUEwQyxVQUE3QkMsRUFBRSxVQUFVQyxLQUFLLFFBQTlCRixZQUFjQyxFQUFDLFVBQVVDLEtBQUssUUFHNUJDLE9BQVNDLGNBR2ZDLElBQUlDLE9BQU9DLFVBQVNQLFdBQ3BCSyxJQUFJQyxPQUFPRSxPQUFTUixXQUVwQkssSUFBSUksT0FBS0QsT0FBSUUsV0FJYlQsSUFBRVEsR0FBQSxJQUFBQyxhQUFZQyxPQUFBQyxVQUFBQyxXQUVWQyxJQUFRQyxTQUFJWixjQUFaLFVBYVEsU0FBSWEsaUJBQVdDLEdBTHZCLElBQUFDLEVBQUEsS0FRQUYsRUFBT0UsR0FVS0MsT0FUZkMsU0FBQUMsT0FSUUMsT0FBTyxHQVVQQyxNQUFBQSxLQUNETCxRQUFTLFNBQWJDLElBQ1VILEVBRFZHLEVBQUFLLE1BQUEsTUFFYUMsS0FBU0MsSUFDVFIsRUFDUlMsbUJBQXdCWCxFQUFBLE9BRWJFLEVBRVJGLFNBQUdPLFlBQWNOLEdBQ2pCLElBQUlELEVBQUEsS0FOWkEsRUFBQSxHQWNBLE9BTEFTLFNBQUFDLE9BQ0hGLE1BQUEsS0FUUUcsUUFBUSxTQUFVUixHQVVKLEtBQWRmLEVBQVR3QixPQUF1QixLQUNOVCxFQUFiQSxFQUFBVSxVQUFBLEtBUFFiLEVBQU1HLEVBQUtLLE1BQU0sTUFTWixLQUFiUCxJQUNnQkMsRUFBWkYsRUFBQSxNQUVHRSxFQUVIZixTQUFBQSxjQUZHLElBQUFBLEVBR0EsR0FDSEEsRUFBQSxJQUFZTyxhQUFaQyxPQUFBQyxVQUFBQyxXQVVJaUIsT0FUSjNCLEVBQU80QixNQUFBQSxhQUNWNUIsRUFBQTZCLEdBQUEsVUFQRzdCLEVBQU80QixRQUFVdEIsRUFBR3NCLFFBQVEsWUFRaEN0QixFQUFBd0IsTUFBQSwwQkFDSDlCLEVBQUE2QixHQUFBLE1BTk83QixFQUFPNEIsUUFBVXRCLEVBQUdzQixRQUFRLFNBUzFCNUIsRUFBQTZCLEdBQUEsS0FDRjdCLEVBQU80QixRQUFBdEIsRUFBQXNCLFFBQUEsV0FFSEQsRUFwRFg3QixFQUpELFdBQ0lhLFFBQVFDLElBQUksUUFNaEJELFFBQVNvQixJQUFBQSxRQUNMakMsRUFBSWlCLFFBQU1pQixTQW1ERkMsSUFBQUEsTUFBQUEsQ0FDQUMsS0FBQUEsV0FDQUMsTUFBUyxDQUNUQyxPQUFVLEdBUmRULFVBQUEsR0FGRVUsUUFBQSxHQWFJQyxjQWJKLEtBZUNMLFNBQUEsR0FDS0MsUUFBRXJDLFdBQVUwQyxVQUFLLFVBQ25CSixTQUFRSyxFQUNiSixVQUFBLEtBR0RLLFNBQVMsR0FDV0MsTUFBQSxDQUFoQlQsU0FBQSxTQUFBTSxHQUNBNUIsRUFBUUMsUUFBSTRCLFlBQVosYUFHQUcsUUFBTSxDQUNKRixRQUFGLFNBQWNHLEdBQ1hULFVBQVVVLEtBQWIsQ0FBQUMsTUFBQUYsSUFDR0csUUFBV25DLElBQWQsTUFBQWdDLElBRUpJLFlBQVcsV0FDRixJQUFHQyxFQUFJQyxLQUNWQyxFQUFGbEIsU0FBVSxlQUNObUIsRUFBQUEsU0FBVSxFQUNkOUIsRUFBU0MsU0FBUzhCLEdBRXRCQyxVQUFRLFNBQVVDLEVBQU9DLEVBQVNDLEdBQzFCNUQsSUFBQUEsRUFBSixJQUFnQnFELEtBQ1pRLEVBQUFQLFFBQUFPLEVBQUFDLFVBQUEsSUFBQUMsR0FDSUMsSUFBQUEsRUFBYyxXQUFTSCxFQUFBSSxjQUwvQnhDLFNBQVNDLE9BQVM4QixFQUFRLElBQU1VLEVBQVMsSUFBTVgsRUFBVSxLQU9qREUsT0FBQSxTQUFTTyxFQUFXTixFQURURSxHQUVYLEdBQUE1RCxXQUFnQm1FLENBR2hCQyxVQUxXcEIsS0FBQSxDQU1YVSxNQU5XLENBQUEsUUFBQSxRQUFBLFVBQUEsT0FBQSxPQU1FQSxHQU5qQkMsUUFBQVUsS0FBQUYsVUFBQVIsR0FRSFcsS0FBQTNELE9BQUFTLFNBQUFtRCxLQTdCQVgsSUFBQUEsR0FBQSxLQStCUXpELE9BQUFBLE9BQ0txRSxVQUFTbkIsS0FBQW9CLFVBSzNCQyxZQUFVLFdBQ0c5RCxVQUFUK0QsUUFDRUMsTUFBYUMsOEJBSW5CQyxTQUFVLFNBQUFDLEdBRU45RSxFQUFRLGFBQU00RSxRQUFBLENBQ1ZHLFVBQUEvRSxFQUFBOEUsR0FBQUUsU0FBQUMsSUFGSkMsS0FFSUMsV0FDRyxNQUVDTixTQUFBLFdBSk0sSUFBQTFCLEVBQUErQixLQU1WRSxPQUFRcEYsRUFORXFGLEtBQUEsQ0FRTkMsSUFBQSxHQUFBQyxPQUFVQyxZQUFWLDJCQUNEbEQsUUFBWWtELENBQ2ZDLFNBQW1CNUQsNEJBRWhCVyxPQUFILE1BWkprRCxTQUFBLFNBN0NDQyxLQUFBLFNBQUFILEdBNERLckMsRUFBQWIsVUFBQWtELEVBQUFJLE1BQUF6QyxFQUFBdEIsVUFBQTJELEVBQUEzRCxVQUFBc0IsRUFBQVosUUFBQWlELEVBQUFqRCxRQUFBWSxFQUFBWCxjQUFBZ0QsRUFBQWhELGlCQUFBcUQsV0FBQSxTQUFBQyxHQUFBLFNBQUFELEVBQUFFLEdBQUEsT0FBQUQsRUFBQUUsTUFBQWQsS0FBQWUsV0FBQSxPQUFBSixFQUFBSyxTQUFBLFdBQUEsT0FBQUosRUFBQUksWUFBQUwsRUFBQSxDQUFBLFNBQUFNLEdBQUEsSUFBQWhELEVBQUErQixLQUVOLE9BQU8sSUFBSWtCLFFBQVEsU0FBVUMsRUFBU0MsR0FGaENULFdBQUFVLFFBQUEsMkNBQUEsQ0FBRUMsT0FBZ0JMLElBQ3hCTSxLQUFBLFNBQUFiLEdBQ1dRLEVBQUFBLFVBQWtCQyxFQUNkRSxLQUNDSixXQUNKeEIsTUFBVWlCLHdDQUNYYyxXQUtOQyxRQVJEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0XHJcbiAgICBwcm9kdWN0aW9uID0gJChcIiNhcHBqc1wiKS5kYXRhKFwibW9kZVwiKSA9PT0gXCJmYWxzZVwiLFxyXG4gICAgZnJpZW5kb191cmwgPSAkKFwiI2FwcGpzXCIpLmRhdGEoXCJzaXRlXCIpO1xyXG5cclxuY29uc3QgZGV2aWNlID0gZGV2aWNlQ2hlY2soKTtcclxuXHJcblZ1ZS5jb25maWcuZGV2dG9vbHMgPSAhcHJvZHVjdGlvbjtcclxuVnVlLmNvbmZpZy5kZWJ1ZyA9ICFwcm9kdWN0aW9uO1xyXG5WdWUuY29uZmlnLnNpbGVudCA9IHByb2R1Y3Rpb247XHJcblxyXG52YXIgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbnZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJ2MS4wXCIpO1xyXG4gICAgY29uc29sZS5sb2coZGV2aWNlKTtcclxuICAgICQoXCIubmF2XCIpLm1lbnUoKTtcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gZmluZEdldFBhcmFtZXRlcihwYXJhbWV0ZXJOYW1lKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gbnVsbCxcclxuICAgICAgICB0bXAgPSBbXTtcclxuICAgIGxvY2F0aW9uLnNlYXJjaFxyXG4gICAgICAgIC5zdWJzdHIoMSlcclxuICAgICAgICAuc3BsaXQoXCImXCIpXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdG1wID0gaXRlbS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGlmICh0bXBbMF0gPT09IHBhcmFtZXRlck5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNvZGVVUklDb21wb25lbnQodG1wWzFdKTtcclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQ29va2llKHBhcmFtZXRlck5hbWUpIHtcclxuICAgIHZhciByZXN1bHQgPSBudWxsLFxyXG4gICAgICAgIHRtcCA9IFtdO1xyXG4gICAgdmFyIGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZTtcclxuICAgIGNvb2tpZS5zcGxpdChcIjtcIilcclxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jaGFyQXQoMCkgPT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0bXAgPSBpdGVtLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgaWYgKHRtcFswXSA9PT0gcGFyYW1ldGVyTmFtZSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRtcFsxXTtcclxuICAgICAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5mdW5jdGlvbiBkZXZpY2VDaGVjaygpIHtcclxuICAgIHZhciBkZXZpY2UgPSB7fTtcclxuICAgIHZhciBtZCA9IG5ldyBNb2JpbGVEZXRlY3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgaWYgKG1kLm1hdGNoKC9hbmRyb2lkL2kpKSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJhbmRyb2lkXCI7XHJcbiAgICAgICAgZGV2aWNlLnZlcnNpb24gPSBtZC52ZXJzaW9uKFwiYW5kcm9pZFwiKTtcclxuICAgIH0gZWxzZSBpZiAobWQubWF0Y2goLyhpcGhvbmV8aXBhZHxpcG9kKTs/L2kpKSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJpb3NcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJpT1NcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRldmljZS5vcyA9IFwicGNcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJDaHJvbWVcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV2aWNlO1xyXG59XHJcblxyXG5WdWUubWl4aW4oe1xyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1czogXCJcIixcclxuICAgICAgICAgICAgc3RhcnREYXRlOiBcIlwiLFxyXG4gICAgICAgICAgICBlbmREYXRlOiBcIlwiLFxyXG4gICAgICAgICAgICBwcm9qZWN0U3RhdHVzOiBudWxsLFxyXG4gICAgICAgICAgICBlcnJvck1zZzogXCJcIixcclxuICAgICAgICAgICAgZW52TW9kZTogcHJvZHVjdGlvbiA/IFwiU3RhcnRlZFwiIDogXCJUZXN0aW5nXCIsXHJcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYWluVG9rZW46XCJcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgfSxcclxuICAgIHdhdGNoOiB7XHJcbiAgICAgICAgZXJyb3JNc2c6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBnYUV2YW50OiBmdW5jdGlvbiAoZ3RtRGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZ3RtRGF0YX0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhOlwiLCBndG1EYXRhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZlcl9idXN5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZtLmVycm9yTXNnID0gXCLns7vntbHlv5nnoozkuK3vvIzoq4vnqI3lvozlnKjoqaYhXCI7XHJcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0uZXJyb3JDb3UgPSA2O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Q29va2llOiBmdW5jdGlvbiAoY25hbWUsIGN2YWx1ZSwgdGltZSkge1xyXG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArICh0aW1lICogMTAwMCkpO1xyXG4gICAgICAgICAgICB2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIiArIGQudG9VVENTdHJpbmcoKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyBcIj1cIiArIGN2YWx1ZSArIFwiO1wiICsgZXhwaXJlcyArIFwiO1wiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbG9nZ2VyOiBmdW5jdGlvbiAobGV2ZWwsIGNvbnRlbnQsIHRhZykge1xyXG4gICAgICAgICAgICBpZiAocHJvZHVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy8gbGV2ZWwgOiBbJ0VSUk9SJyA9PiAwLCBERUJVRycgPT4gMSwgJ1dBUk5JTkcnID0+IDIsICdJTkZPJyA9PiAzLCAnQUxMJyA9PiA0XVxyXG4gICAgICAgICAgICAgICAgdmFyIGxldmVsX2luZm8gPSBbJ0VSUk9SJywgJ0RFQlVHJywgJ1dBUk5JTkcnLCAnSU5GTycsICdBTEwnXTtcclxuICAgICAgICAgICAgICAgIF9MVHJhY2tlci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAnbGV2ZWwnOiBsZXZlbF9pbmZvW2xldmVsXSxcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgICdwYXRoJzogd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RhZyc6IHRhZyB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICdkZXZpY2UnOiBkZXZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RpbWVzdGFtcCc6IERhdGUubm93KClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja09ubGluZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiSW50ZXJuZXQg6YCj57ea5bey5pa36ZaL77yM6KuL56K66KqN5oKo55qE57ay6Lev54uA5oWL44CCXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY3JvbGxUbzogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgJChcImh0bWwsYm9keVwiKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJChlKS5vZmZzZXQoKS50b3AgLSB2bS5uYXZIZWlnaHRcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFRva2VuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAvLyB1cmw6IFwiaHR0cHM6Ly9jYXJyZWZvdXIyMDE5Y255LmF6dXJld2Vic2l0ZXMubmV0L2FwaS9hdXRoL2xvZ2luP3Byb2plY3RJZD02MVwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBgJHtmcmllbmRvX3VybH1hdXRoL2xvZ2luP3Byb2plY3RJZD02NmAsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ3ZWJ0b2tlblwiOiBcIldCcUlIYzloVG13eUwrZzltMHlrZkE9PVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiXHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdm0ubWFpblRva2VuID0gcmVzLnRva2VuO1xyXG4gICAgICAgICAgICAgICAgdm0uc3RhcnREYXRlID0gcmVzLnN0YXJ0RGF0ZTtcclxuICAgICAgICAgICAgICAgIHZtLmVuZERhdGUgPSByZXMuZW5kRGF0ZTtcclxuICAgICAgICAgICAgICAgIHZtLnByb2plY3RTdGF0dXMgPSByZXMucHJvamVjdFN0YXR1cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmVjYXB0Y2hhOiBmdW5jdGlvbiAocGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgZ3JlY2FwdGNoYS5leGVjdXRlKCc2TGZVbzdNVUFBQUFBSlFBTUwwOHJ1aFBlWVp2aWhMWWFWdnR1WXJKJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogcGFnZVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5yZUNhcHRjaGEgPSB0b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnR29vZ2xl6amX6K2J5aSx5pWX77yM6KuL5YaN5qyh5ZiX6KmmXFxu5aaC54Sh5rOV5o6S6Zmk5q2k5ZWP6aGM77yM5bu66K2w6YeN5paw5pW055CG5q2k6aCB6Z2iJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgfVxyXG59KVxyXG4iXX0=
