"use strict";var production=!1===document.getElementById("appjs").dataset.mode,device=deviceCheck(),md=new MobileDetect(window.navigator.userAgent);function findGetParameter(o){var n,t=null;return location.search.substr(1).split("&").forEach(function(e){(n=e.split("="))[0]===o&&(t=decodeURIComponent(n[1]))}),t}function checkCookie(o){var n,t=null;return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(n=e.split("="))[0]===o&&(t=n[1])}),t}function deviceCheck(){var e={},o=new MobileDetect(window.navigator.userAgent);return o.match(/android/i)?(e.os="android",e.version=o.version("android")):o.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=o.version("iOS")):(e.os="pc",e.version=o.version("Chrome")),e}Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production,document.addEventListener("DOMContentLoaded",function(){console.log("v1.01"),console.log(device)}),Vue.mixin({data:function(){return{projApi:null,errorMsg:"",envMode:production?"Started":"Testing",loading:!1,popup:!1,popPage:"",shareLink:window.location.href.includes("campaign.friendo.com.tw")?"https://campaign.friendo.com.tw/Grapekingbeverage/":"https://release.azureedge.net/Grapekingbeverage/",isIndex:!1}},computed:{},watch:{errorMsg:function(e){document.querySelector("body").classList.toggle("_freeze")}},methods:{gaEvant:function(e){dataLayer.push({event:e}),console.log("ga:",e)},setCookie:function(e,o,n){var t=new Date;t.setTime(t.getTime()+1e3*n);t="expires="+t.toUTCString();document.cookie=e+"="+o+";"+t+";"},logger:function(e,o,n){production&&_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(o),path:window.location.href,tag:n||null,device:device,timestamp:Date.now()})},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){var o=document.scrollingElement||document.documentElement,n=document.querySelector(e),t=1500,i=o,r=Math.abs(n.offsetTop-i.scrollTop),c=0,a=50;(function e(){Math.easeInOutQuad=function(e,o,n,t){return(e/=t/2)<1?n/2*e*e+o:-n/2*(--e*(e-2)-1)+o},c+=a;var o=Math.easeInOutQuad(c,i,r,t);if(i.scrollTop>n.offsetTop){if(i.scrollTop-=parseInt(o),i.scrollTop<=n.offsetTop)return void(i.scrollTop=n.offsetTop)}else i.scrollTop=parseInt(o);c<t&&requestAnimationFrame(e)})()},grecaptcha:function(o){function e(e){return o.apply(this,arguments)}return e.toString=function(){return o.toString()},e}(function(n){var t=this;return new Promise(function(o,e){grecaptcha.execute("6LeP0NAcAAAAAOIFyfCq1Smo-tzpnq7JAQhJfeuz",{action:n}).then(function(e){t.captcha=e,o()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})}),aLink:function(){for(var e=document.querySelectorAll("a"),o=0;o<e.length;o++)e[o].setAttribute("rel","noreferrer noopener")},popOpen:function(e){this.popup=!0,this.popPage=e},popClose:function(){switch(this.popup=!1,this.popPage="",this.ticketOpt){case"invoice":this.gaEvant("電子發票_成功登錄_繼續登錄");break;case"cloud":this.gaEvant("雲端載具_綁定成功_繼續綁定");break;case"tradition":this.gaEvant("傳統發票_成功登錄_繼續登錄")}},checkBroswer:function(){var e=navigator.userAgent;navigator.userAgent.toLowerCase();-1<e.indexOf("Line")&&(window.location.href=window.location.href+"?openExternalBrowser=1")}},created:function(){},mounted:function(){"Started"===this.envMode&&(console.log=function(){})}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJwcm9kdWN0aW9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImRhdGFzZXQiLCJtb2RlIiwiZGV2aWNlIiwiZGV2aWNlQ2hlY2siLCJNb2JpbGVEZXRlY3QiLCJ1c2VyQWdlbnQiLCJmaW5kR2V0UGFyYW1ldGVyIiwicGFyYW1ldGVyTmFtZSIsInRtcCIsInJlc3VsdCIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwic3BsaXQiLCJmb3JFYWNoIiwiaXRlbSIsImRlY29kZVVSSUNvbXBvbmVudCIsImNvb2tpZSIsImNoYXJBdCIsInN1YnN0cmluZyIsIm1hdGNoIiwidmVyc2lvbiIsIm5hdmlnYXRvciIsIm1kIiwib3MiLCJWdWUiLCJkZXZ0b29scyIsImNvbmZpZyIsImRlYnVnIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbnNvbGUiLCJsb2ciLCJwcm9qQXBpIiwiZXJyb3JNc2ciLCJlbnZNb2RlIiwibG9hZGluZyIsInBvcFBhZ2UiLCJwb3B1cCIsInNoYXJlTGluayIsIndpbmRvdyIsImlzSW5kZXgiLCJocmVmIiwiaW5jbHVkZXMiLCJ3YXRjaCIsInZhbCIsInF1ZXJ5U2VsZWN0b3IiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJkYXRhTGF5ZXIiLCJnYUV2YW50IiwiZ3RtRGF0YSIsInB1c2giLCJldmVudCIsInNldENvb2tpZSIsImNuYW1lIiwiY3ZhbHVlIiwiZCIsIkRhdGUiLCJzZXRUaW1lIiwiZ2V0VGltZSIsInRpbWUiLCJleHBpcmVzIiwidG9VVENTdHJpbmciLCJsb2dnZXIiLCJsZXZlbCIsImNvbnRlbnQiLCJ0YWciLCJfTFRyYWNrZXIiLCJsZXZlbF9pbmZvIiwic3RyaW5naWZ5IiwicGF0aCIsIm5vdyIsImNoZWNrT25saW5lIiwib25MaW5lIiwic2Nyb2xsVG8iLCJ0byIsImVsZW1lbnQiLCJzY3JvbGxpbmdFbGVtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwidGFyZ2V0IiwiZHVyYXRpb24iLCJwYWRkaW5nIiwiY2hhbmdlIiwiTWF0aCIsImFicyIsIm9mZnNldFRvcCIsInN0YXJ0RWwiLCJzY3JvbGxUb3AiLCJpbmNyZW1lbnQiLCJjdXJyZW50VGltZSIsImVhc2VJbk91dFF1YWQiLCJ0IiwiYiIsImMiLCJhbmltYXRlU2Nyb2xsIiwicGFyc2VJbnQiLCJncmVjYXB0Y2hhIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJleGVjdXRlIiwiYWN0aW9uIiwicGFnZSIsInRoZW4iLCJ0b2tlbiIsInZtIiwiY2FwdGNoYSIsImFsZXJ0IiwiYUxpbmsiLCJhbGlua3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsInNldEF0dHJpYnV0ZSIsInRoaXMiLCJwb3BDbG9zZSIsInRpY2tldE9wdCIsInUiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJjcmVhdGVkIiwibW91bnRlZCJdLCJtYXBwaW5ncyI6ImFBQUEsSUFBTUEsWUFBK0QsSUFBbERDLFNBQVNDLGVBQWUsU0FBU0MsUUFBUUMsS0FDdERDLE9BQVNDLGNBRFROLEdBQUFBLElBQVVPLGFBQVlMLE9BQUFBLFVBQWVNLFdBYTNDLFNBQVNDLGlCQUFpQkMsR0FDdEIsSUFDSUMsRUFEQUMsRUFBUyxLQWNiLE9BWkFDLFNBQVNDLE9BSUVDLE9BQVFDLEdBQ1BMLE1BQUEsS0FMWk0sUUFBQSxTQUFBQyxJQVFPTixFQUFQTSxFQUFBRixNQUFBLE1BQ0gsS0FBQU4sSUFIZUUsRUFBU08sbUJBQW1CUixFQUFJLE9BTXhDQyxFQUdKUSxTQUFPSixZQUNGQyxHQUNHLElBQ0lDLEVBREFBLEVBQUtHLEtBV2pCLE9BVFNwQixTQUFBbUIsT0FKRkosTUFBTSxLQUtGQyxRQUFRRCxTQUFYRSxHQUVJTixLQURBTSxFQUFXUixPQUFBQSxLQU52QlEsRUFBQUEsRUFBQUksVUFBQSxLQVVIWCxFQUFBTyxFQUFBRixNQUFBLE1BSm1CLEtBQU9OLElBS2xCSixFQUFjSyxFQUFBLE1BRVZDLEVBQ1QsU0FB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QUEsTUFBQUEsS0FBQUEsV0FBQUEsT0FBQUEsRUFBQUEsU0FBQUEsV0FBQUEsT0FBQUEsRUFBQUEsWUFBQUEsRUFBQUEsQ0FBQUEsU0FBY1QsR0FDYmlCLElBQUFBLEVBQUFBLEtBQ0gsT0FBQSxJQUFBQyxRQUFBLFNBQUFDLEVBQUFDLEdBeEJMSixXQUFBSyxRQUFBLDJDQUFBLENBZ0NRQyxPQUFRQyxJQWxGZkMsS0FBQSxTQUFBQyxHQThFS0MsRUFBQUMsUUFBQUYsRUFBQU4sS0FBQSxXQUFBUyxNQUFBLHdDQVdFUixVQUlaUyxNQUFPLFdBZkssSUFBRixJQUFBQyxFQUFBaEgsU0FBQWlILGlCQUFBLEtBQUVDLEVBQWdCLEVBQUFBLEVBQUFGLEVBQUFHLE9BQUFELElBQ2ZGLEVBQVRFLEdBQUFFLGFBQUEsTUFBQSx3QkFHUVosUUFoRlJ0RCxTQWdGY3VELEdBRVRDLEtBQUtuRSxPQUFBLEVBQ0E4RSxLQUFDUixRQUFVRixHQUVoQlcsU0FyRkxwRSxXQStFSSxPQU9JNEQsS0FBTXZFLE9BQUEsRUFDTitELEtBQU1oRSxRQUFBLEdBUlYrRSxLQUFBRSxXQURKLElBQUEsVUFoRkNGLEtBQUFsRSxRQUFBLGtCQTZGRSxNQUNPLElBQUduRCxRQWlCTHFILEtBQUtsRSxRQUFRLGtCQWhCckIsTUFDVSxJQUFJaUUsWUFDYkMsS0FBQWxFLFFBQUEsb0JBTUxtRSxhQXJHSXBFLFdBc0dLWCxJQUFMaUYsRUFBYWhHLFVBQWJqQixVQUNlaUIsVUFBZmpCLFVBQUFrSCxlQWtCcUMsRUFBckJELEVBQUVFLFFBQVEsVUFmYnZFLE9BQVF2QyxTQUFBK0IsS0FBYkYsT0FBQTdCLFNBQUErQixLQUFBLDRCQUdBZ0YsUUFBQSxhQUVKQyxRQUFLLFdBRUQsWUFBQVAsS0FBQWpGLFVBcUJSSixRQUFRQyxJQUFNIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHByb2R1Y3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcGpzXCIpLmRhdGFzZXQubW9kZSA9PT0gZmFsc2U7XHJcbmNvbnN0IGRldmljZSA9IGRldmljZUNoZWNrKCk7XHJcbmNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG5WdWUuY29uZmlnLmRldnRvb2xzID0gIXByb2R1Y3Rpb247XHJcblZ1ZS5jb25maWcuZGVidWcgPSAhcHJvZHVjdGlvbjtcclxuVnVlLmNvbmZpZy5zaWxlbnQgPSBwcm9kdWN0aW9uO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJ2MS4wMVwiKTtcclxuICAgIGNvbnNvbGUubG9nKGRldmljZSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZmluZEdldFBhcmFtZXRlcihwYXJhbWV0ZXJOYW1lKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gbnVsbCxcclxuICAgICAgICB0bXAgPSBbXTtcclxuICAgIGxvY2F0aW9uLnNlYXJjaFxyXG4gICAgICAgIC5zdWJzdHIoMSlcclxuICAgICAgICAuc3BsaXQoXCImXCIpXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdG1wID0gaXRlbS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGlmICh0bXBbMF0gPT09IHBhcmFtZXRlck5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWNvZGVVUklDb21wb25lbnQodG1wWzFdKTtcclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQ29va2llKHBhcmFtZXRlck5hbWUpIHtcclxuICAgIHZhciByZXN1bHQgPSBudWxsLFxyXG4gICAgICAgIHRtcCA9IFtdO1xyXG4gICAgdmFyIGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZTtcclxuICAgIGNvb2tpZS5zcGxpdChcIjtcIilcclxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jaGFyQXQoMCkgPT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0bXAgPSBpdGVtLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgaWYgKHRtcFswXSA9PT0gcGFyYW1ldGVyTmFtZSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRtcFsxXTtcclxuICAgICAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5mdW5jdGlvbiBkZXZpY2VDaGVjaygpIHtcclxuICAgIHZhciBkZXZpY2UgPSB7fTtcclxuICAgIHZhciBtZCA9IG5ldyBNb2JpbGVEZXRlY3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgaWYgKG1kLm1hdGNoKC9hbmRyb2lkL2kpKSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJhbmRyb2lkXCI7XHJcbiAgICAgICAgZGV2aWNlLnZlcnNpb24gPSBtZC52ZXJzaW9uKFwiYW5kcm9pZFwiKTtcclxuICAgIH0gZWxzZSBpZiAobWQubWF0Y2goLyhpcGhvbmV8aXBhZHxpcG9kKTs/L2kpKSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJpb3NcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJpT1NcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRldmljZS5vcyA9IFwicGNcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJDaHJvbWVcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV2aWNlO1xyXG59XHJcblxyXG5cclxuVnVlLm1peGluKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9qQXBpOm51bGwsXHJcbiAgICAgICAgICAgIGVycm9yTXNnOiBcIlwiLFxyXG4gICAgICAgICAgICBlbnZNb2RlOiBwcm9kdWN0aW9uID8gXCJTdGFydGVkXCIgOiBcIlRlc3RpbmdcIiwgLy8gVGVzdGluZ1xyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9wdXA6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb3BQYWdlOiBcIlwiLCAvLyBhd2FyZHBhZ2Ugb29wcyBzaGFyZW92ZXIgaW52b2VuZFxyXG4gICAgICAgICAgICBzaGFyZUxpbms6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdjYW1wYWlnbi5mcmllbmRvLmNvbS50dycpPyAnaHR0cHM6Ly9jYW1wYWlnbi5mcmllbmRvLmNvbS50dy9HcmFwZWtpbmdiZXZlcmFnZS8nIDogJ2h0dHBzOi8vcmVsZWFzZS5henVyZWVkZ2UubmV0L0dyYXBla2luZ2JldmVyYWdlLycsXHJcbiAgICAgICAgICAgIGlzSW5kZXg6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICB9LFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgICBlcnJvck1zZzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2xhc3NMaXN0LnRvZ2dsZSgnX2ZyZWV6ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgZ2FFdmFudDogZnVuY3Rpb24gKGd0bURhdGEpIHtcclxuICAgICAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGd0bURhdGF9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYTpcIiwgZ3RtRGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBzZXJ2ZXJfYnVzeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vICAgICB2bS5lcnJvck1zZyA9IFwi57O757Wx5b+Z56KM5Lit77yM6KuL56iN5b6M5Zyo6KmmIVwiO1xyXG4gICAgICAgIC8vICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgIHZtLmVycm9yQ291ID0gNjtcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHNldENvb2tpZTogZnVuY3Rpb24gKGNuYW1lLCBjdmFsdWUsIHRpbWUpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAodGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvVVRDU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZ2dlcjogZnVuY3Rpb24gKGxldmVsLCBjb250ZW50LCB0YWcpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIGxldmVsIDogWydFUlJPUicgPT4gMCwgREVCVUcnID0+IDEsICdXQVJOSU5HJyA9PiAyLCAnSU5GTycgPT4gMywgJ0FMTCcgPT4gNF1cclxuICAgICAgICAgICAgICAgIHZhciBsZXZlbF9pbmZvID0gWydFUlJPUicsICdERUJVRycsICdXQVJOSU5HJywgJ0lORk8nLCAnQUxMJ107XHJcbiAgICAgICAgICAgICAgICBfTFRyYWNrZXIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xldmVsJzogbGV2ZWxfaW5mb1tsZXZlbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBKU09OLnN0cmluZ2lmeShjb250ZW50KSxcclxuICAgICAgICAgICAgICAgICAgICAncGF0aCc6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICAgICAgICAgICd0YWcnOiB0YWcgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAnZGV2aWNlJzogZGV2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICd0aW1lc3RhbXAnOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hlY2tPbmxpbmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkludGVybmV0IOmAo+e3muW3suaWt+mWi++8jOiri+eiuuiqjeaCqOeahOe2sui3r+eLgOaFi+OAglwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uICh0bykge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAvLyB2YXIgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpO1xyXG4gICAgICAgICAgICAvLyB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0byk7XHJcbiAgICAgICAgICAgIC8vIHZhciBzdGFydEVsID0gKGJvZHkuc2Nyb2xsVG9wID4gMCkgPyBib2R5IDogaHRtbCxcclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gMTUwMDsgLy/mlbTlgIvpgY7nqIvmmYLplpMg5Y+v6Ieq5a6a576pXHJcbiAgICAgICAgICAgIHZhciBwYWRkaW5nID0gMDsgLy/mu5Hli5XlvoznlZnnmb0g5Y+v6Ieq5a6a576pXHJcbiAgICAgICAgICAgIHZhciBzdGFydEVsID0gZWxlbWVudCxcclxuICAgICAgICAgICAgICAgIGNoYW5nZSA9IE1hdGguYWJzKHRhcmdldC5vZmZzZXRUb3AgLSBzdGFydEVsLnNjcm9sbFRvcCAtIHBhZGRpbmcpLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWUgPSAwLFxyXG4gICAgICAgICAgICAgICAgaW5jcmVtZW50ID0gNTA7XHJcbiAgICAgICAgICAgIHZhciBhbmltYXRlU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvL+eul+WHuua7keWLleeahOatpeaVuFxyXG4gICAgICAgICAgICAgICAgTWF0aC5lYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0IC89IGQvMjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IDEpIHJldHVybiBjLzIqdCp0ICsgYjtcclxuICAgICAgICAgICAgICAgICAgICB0LS07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC1jLzIgKiAodCoodC0yKSAtIDEpICsgYjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZSArPSBpbmNyZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gTWF0aC5lYXNlSW5PdXRRdWFkKGN1cnJlbnRUaW1lLCBzdGFydEVsLCBjaGFuZ2UsIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2YWw6Jyx0eXBlb2YodmFsKSlcclxuICAgICAgICAgICAgICAgIGlmKHN0YXJ0RWwuc2Nyb2xsVG9wID4gdGFyZ2V0Lm9mZnNldFRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RWwuc2Nyb2xsVG9wIC09IHBhcnNlSW50KHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnRFbC5zY3JvbGxUb3AgPD0gdGFyZ2V0Lm9mZnNldFRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydEVsLnNjcm9sbFRvcCA9ICB0YXJnZXQub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRFbC5zY3JvbGxUb3AgPSBwYXJzZUludCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhcnRFbC5zY3JvbGxUb3ApXHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50VGltZSA8IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVTY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhbmltYXRlU2Nyb2xsKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmVjYXB0Y2hhOiBmdW5jdGlvbiAocGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgZ3JlY2FwdGNoYS5leGVjdXRlKCc2TGVQME5BY0FBQUFBT0lGeWZDcTFTbW8tdHpwbnE3SkFRaEpmZXV6Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogcGFnZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmNhcHRjaGEgPSB0b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnR29vZ2xl6amX6K2J5aSx5pWX77yM6KuL5YaN5qyh5ZiX6KmmXFxu5aaC54Sh5rOV5o6S6Zmk5q2k5ZWP6aGM77yM5bu66K2w6YeN5paw5pW055CG5q2k6aCB6Z2iJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFMaW5rOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFsaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcclxuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8YWxpbmtzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhbGlua3NbaV0uc2V0QXR0cmlidXRlKCdyZWwnICwnbm9yZWZlcnJlciBub29wZW5lcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3BPcGVuKHBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3B1cCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5wb3BQYWdlID0gcGFnZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9wQ2xvc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdXAgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLnBvcFBhZ2UgPSBcIlwiXHJcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLnRpY2tldE9wdCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImludm9pY2VcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhRXZhbnQoXCLpm7vlrZDnmbznpahf5oiQ5Yqf55m76YyEX+e5vOe6jOeZu+mMhFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2xvdWRcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhRXZhbnQoXCLpm7Lnq6/ovInlhbdf57aB5a6a5oiQ5YqfX+e5vOe6jOe2geWumlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHJhZGl0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYUV2YW50KFwi5YKz57Wx55m856WoX+aIkOWKn+eZu+mMhF/nubznuoznmbvpjIRcIilcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja0Jyb3N3ZXIoKSB7XHJcbiAgICAgICAgICAgIGxldCB1ID0gbmF2aWdhdG9yLnVzZXJBZ2VudFxyXG4gICAgICAgICAgICBsZXQgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgbGV0IGlzTGluZUFwcCA9IHUuaW5kZXhPZihcIkxpbmVcIikgPiAtMVxyXG5cclxuICAgICAgICAgICAgaWYoaXNMaW5lQXBwKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgJz9vcGVuRXh0ZXJuYWxCcm93c2VyPTEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gdGhpcy5wcm9qQXBpID0gbmV3IFByb2plY3RBcGkoOTgsIFwiN1VpOWhhZGxMaGxjWkRqWmhVZ0J5dz09XCIpO1xyXG4gICAgfSxcclxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyB0aGlzLnByb2pBcGkgPSBuZXcgUHJvamVjdEFwaSg5OCwgXCI3VWk5aGFkbExobGNaRGpaaFVnQnl3PT1cIik7ICAvLyBwcm9qZWN0SWQsIHdlYlRvZWtuXHJcbiAgICAgICAgaWYodGhpcy5lbnZNb2RlID09PSBcIlN0YXJ0ZWRcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKCkge31cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiJdfQ==