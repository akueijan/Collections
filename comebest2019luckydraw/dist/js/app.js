"use strict";var production="false"===$("#appjs").data("mode"),apiUrl=$("#appjs").data("site"),device=deviceCheck();Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=!production;var md=new MobileDetect(window.navigator.userAgent),isMobile=null!=md.phone()||null!=md.tablet();function findGetParameter(e){var t=null,n=[];return location.search.substr(1).split("&").forEach(function(o){(n=o.split("="))[0]===e&&(t=decodeURIComponent(n[1]))}),t}function checkCookie(e){var t=null,n=[];return document.cookie.split(";").forEach(function(o){" "==o.charAt(0)&&(o=o.substring(1)),(n=o.split("="))[0]===e&&(t=n[1])}),t}function deviceCheck(){var o={},e=new MobileDetect(window.navigator.userAgent);return e.match(/android/i)?(o.os="android",o.version=e.version("android")):e.match(/(iphone|ipad|ipod);?/i)?(o.os="ios",o.version=e.version("iOS")):(o.os="pc",o.version=e.version("Chrome")),o}$(function(){console.log("v1",device.os,device.version),$(".nav").menu()}),Vue.mixin({data:function(){return{status:"",start_date:"2100/08/09 12:09:10",error_msg:"",mode:production?"Started":"Testing",loading:!0,popuptop:"",popup:!1,popuppage:"",awardPopList:[]}},computed:{openCome:function(){return!("Testing"==this.mode||start_date<=0)}},watch:{error_msg:function(o){$("body").toggleClass("_freeze")}},methods:{gaEvant:function(o){dataLayer.push({event:o}),console.log("ga:",o)},server_busy:function(){var o=this;o.error_msg="系統忙碌中，請稍後在試!",o.loading=!1,o.error_cou=6},setCookie:function(o,e,t){var n=new Date;n.setTime(n.getTime()+1e3*t);var a="expires="+n.toUTCString();document.cookie=o+"="+e+";"+a+";"},logger:function(o,e,t){if(production){_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][o],content:JSON.stringify(e),path:window.location.href,tag:t||null,device:device,timestamp:Date.now()})}},errorDone:function(){this.error_msg=""},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},state_check:function(){var t=this;return $.ajax({method:"GET",url:"".concat(friendo_url,"GetProjectInfo"),success:function(o){var e=o.Data;t.start_date=e.StartDateTime,t.mode=e.Status}})},scrollTo:function(o){$("html,body").animate({scrollTop:$(o).offset().top},500)},popupOpen:function(){var o=this;o.popuptop&&0!==o.popuptop||(o.popuptop=Math.max(window.pageYOffset,document.documentElement.scrollTop,document.body.scrollTop)),$("body").addClass("_freeze")},popupClose:function(){var o=this;$("body").removeClass("_freeze"),o.popup=!1,o.popuppage="",$("html, body").scrollTop(o.popuptop),o.popuptop=0},birthClose:function(){"birthday"===this.popuppage&&this.gaEvant("發票登錄_關閉")},fixbtn:function(){$(window).scroll(function(){(0<$("body").scrollTop()?$("body").scrollTop():$("html, body").scrollTop())>$(".index .events").offset().top?$(".fixedbtn").addClass("fixedbtn-active"):$(".fixedbtn").removeClass("fixedbtn-active")})},cloud_Ani:function(){(new TimelineMax).set(".randomcloud1",{className:"+=cloud0"},"-=0.3").set(".randomcloud2",{className:"+=cloud1"},"-=0.3").set(".randomcloud3",{className:"+=cloud2"},"-=0.3").set(".randomcloud4",{className:"+=cloud3"},"-=0.3").set(".randomcloud5",{className:"+=cloud4"},"-=0.3")},vAlert:function(){alert("活動已結束，下一波能量敬請期待！")}},components:{comingsoon:comingsoon}}),Vue.component("comingsoon",{template:"#comingsoon",props:["StartDate","mode"],data:function(){return{comingsoon:!1,date:{total:0,days:0,hours:0,minutes:0,seconds:0}}},mounted:function(){function i(o,e){return(o=""+o).length>=e?o:i("0"+o,e)}var r=this,s=setInterval(function(){var o=Date.parse(new Date(r.StartDate))-Date.parse(new Date),e=Math.floor(o/1e3%60),t=Math.floor(o/1e3/60%60),n=Math.floor(o/36e5%24),a=Math.floor(o/864e5);r.date={total:o,days:i(a,2),hours:i(n,2),minutes:i(t,2),seconds:i(e,2)},r.date.total<=0||"Testing"==r.mode?(clearInterval(s),r.comingsoon=!1):r.comingsoon=!0},1e3)}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJwcm9kdWN0aW9uIiwiJCIsImRhdGEiLCJkZXZpY2UiLCJkZXZpY2VDaGVjayIsIlZ1ZSIsImNvbmZpZyIsImRlYnVnIiwic2lsZW50IiwibWQiLCJNb2JpbGVEZXRlY3QiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjb25zb2xlIiwicGhvbmUiLCJ2ZXJzaW9uIiwibG9jYXRpb24iLCJwYXJhbWV0ZXJOYW1lIiwidG1wIiwicmVzdWx0Iiwic3BsaXQiLCJjb29raWUiLCJzZWFyY2giLCJmb3JFYWNoIiwiaXRlbSIsImNoZWNrQ29va2llIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZG9jdW1lbnQiLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJvcyIsInN0YXR1cyIsIm1hdGNoIiwibWl4aW4iLCJsb2ciLCJmaW5kR2V0UGFyYW1ldGVyIiwibW9kZSIsImxvYWRpbmciLCJwb3B1cHRvcCIsInBvcHVwcGFnZSIsImF3YXJkUG9wTGlzdCIsInBvcHVwIiwiZXJyb3JfbXNnIiwib3BlbkNvbWUiLCJ0b2dnbGVDbGFzcyIsInRoaXMiLCJzdGFydF9kYXRlIiwiZ2FFdmFudCIsImRhdGFMYXllciIsInB1c2giLCJ2YWwiLCJndG1EYXRhIiwibWV0aG9kcyIsInNlcnZlcl9idXN5IiwiZXZlbnQiLCJ2bSIsInNldENvb2tpZSIsInNldFRpbWUiLCJlcnJvcl9jb3UiLCJjbmFtZSIsImN2YWx1ZSIsInRpbWUiLCJkIiwiRGF0ZSIsImdldFRpbWUiLCJ0YWciLCJjb250ZW50IiwidG9VVENTdHJpbmciLCJleHBpcmVzIiwibG9nZ2VyIiwibGV2ZWwiLCJfTFRyYWNrZXIiLCJzdHJpbmdpZnkiLCJKU09OIiwicGF0aCIsIm5vdyIsImhyZWYiLCJ0aW1lc3RhbXAiLCJjaGVja09ubGluZSIsIm9uTGluZSIsImFsZXJ0IiwidXJsIiwic3VjY2VzcyIsImFqYXgiLCJmcmllbmRvX3VybCIsIlN0YXR1cyIsInJlcyIsIkRhdGEiLCJTdGFydERhdGVUaW1lIiwic2Nyb2xsVG8iLCJlIiwicG9wdXBPcGVuIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImFkZENsYXNzIiwiTWF0aCIsIm1heCIsInBhZ2VZT2Zmc2V0IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsInBvcHVwQ2xvc2UiLCJyZW1vdmVDbGFzcyIsImJpcnRoQ2xvc2UiLCJmaXhidG4iLCJ3aW5kb3dTY3JvbGxUb3AiLCJjbG91ZF9BbmkiLCJUaW1lbGluZU1heCIsInNldCIsImNsYXNzTmFtZSIsImNvbXBvbmVudHMiLCJjb21pbmdzb29uIiwiY29tcG9uZW50IiwidGVtcGxhdGUiLCJkYXRlIiwidG90YWwiLCJkYXlzIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kcyIsIm1vdW50ZWQiLCJwYWRMZWZ0Iiwic3RyIiwibGVuIiwibGVuZ3RoIiwiZmxvb3IiLCJ0IiwiU3RhcnREYXRlIiwicGFyc2UiLCJjbGVhckludGVydmFsIiwidGltZWludGVydmFsIl0sIm1hcHBpbmdzIjoiYUFBQSxJQUNJQSxXQUEwQyxVQUE3QkMsRUFBRSxVQUFVQyxLQUFLLFFBQTlCRixPQUFBQSxFQUFVLFVBQUtFLEtBQVVBLFFBR3ZCQyxPQUFTQyxjQUdmQyxJQUFJQyxPQUFPQyxVQUFTUCxXQUNwQkssSUFBSUMsT0FBT0UsT0FBU1IsV0FFcEJLLElBQUlJLE9BQUtELFFBQUlFLFdBR2JULElBQUVRLEdBQUEsSUFBQUMsYUFBWUMsT0FBQUMsVUFBQUMsV0FDVkMsU0FBQSxNQUFZTCxHQUFaTSxTQUFBLE1BQW1DTixHQUFDTyxTQU9wQ0MsU0FBQUEsaUJBQUFDLEdBSVFDLElBQUdDLEVBQVFDLEtBQ1BGLEVBQUEsR0FVWkcsT0FmQUwsU0FBQU0sT0FRT0gsT0FBUCxHQUNIQyxNQUFBLEtBTlFHLFFBQVEsU0FBVUMsSUFRbEJDLEVBQUFBLEVBQVlSLE1BQUFBLE1BQ2pCLEtBQUFBLElBQUFFLEVBQUFPLG1CQUFBUixFQUFBLE9BR09FLEVBSUUsU0FBQUssWUFBQVIs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QUFBRCxFQU5MRCxFQVNBRCxFQUFBLElBQUFDLEVBQUFDLEdBUEksSUFNQXJFLEVBQUtWLEtBT0QwRSxFQUFlTyxZQUFPLFdBQ3RCUixJQUFLUyxFQUFHOUIsS0FBSzZCLE1BQVEsSUFBSS9ELEtBQUFSLEVBQUF5RSxZQUE3QmpFLEtBQUFrRSxNQUFBLElBQUFsRSxNQUNReUQsRUFBUU0sS0FBT0EsTUFBSUMsRUFBQSxJQUFpQixJQUNsQ1IsRUFBQXRCLEtBQUE2QixNQUFBQyxFQUFBLElBQUEsR0FBQSxJQUNOVCxFQURNckIsS0FBQTZCLE1BQUFDLEVBQUEsS0FBQSxJQUVFTCxFQUFPekIsS0FBQTZCLE1BRlRDLEVBQUEsT0FHTnhFLEVBQUE0RCxLQUFTTyxDQUNUTixNQUFXTSxFQUNYTCxLQUFXSyxFQUFRRixFQUFELEdBTHRCRixNQUFBSSxFQUFBSixFQUFBLEdBSUlDLFFBQVdHLEVBQVFILEVBQVMsR0FHekJKLFFBQWNPLEVBQVF0RixFQUFRLElBRTlCNEUsRUFBQUEsS0FBYUksT0FBaEIsR0FBQSxXQUFBN0QsRUFBQW5CLE1BQ0c4RixjQUFBQyxHQUNBbkIsRUFBQUEsWUFBSCxHQUdSekQsRUFBQXlELFlBQUEsR0FoRFIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3RcclxuICAgIHByb2R1Y3Rpb24gPSAkKFwiI2FwcGpzXCIpLmRhdGEoXCJtb2RlXCIpID09PSBcImZhbHNlXCIsXHJcbiAgICBhcGlVcmwgPSAkKFwiI2FwcGpzXCIpLmRhdGEoXCJzaXRlXCIpO1xyXG5cclxuY29uc3QgZGV2aWNlID0gZGV2aWNlQ2hlY2soKTtcclxuXHJcblZ1ZS5jb25maWcuZGV2dG9vbHMgPSAhcHJvZHVjdGlvbjtcclxuVnVlLmNvbmZpZy5kZWJ1ZyA9ICFwcm9kdWN0aW9uO1xyXG5WdWUuY29uZmlnLnNpbGVudCA9ICFwcm9kdWN0aW9uO1xyXG5cclxudmFyIG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbnZhciBpc01vYmlsZSA9IG1kLnBob25lKCkgIT0gbnVsbCB8fCBtZC50YWJsZXQoKSAhPSBudWxsO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInYxXCIsIGRldmljZS5vcywgZGV2aWNlLnZlcnNpb24pO1xyXG4gICAgJChcIi5uYXZcIikubWVudSgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGZpbmRHZXRQYXJhbWV0ZXIocGFyYW1ldGVyTmFtZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG51bGwsXHJcbiAgICAgICAgdG1wID0gW107XHJcbiAgICBsb2NhdGlvbi5zZWFyY2hcclxuICAgICAgICAuc3Vic3RyKDEpXHJcbiAgICAgICAgLnNwbGl0KFwiJlwiKVxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHRtcCA9IGl0ZW0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBpZiAodG1wWzBdID09PSBwYXJhbWV0ZXJOYW1lKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVjb2RlVVJJQ29tcG9uZW50KHRtcFsxXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0Nvb2tpZShwYXJhbWV0ZXJOYW1lKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbnVsbCxcclxuICAgICAgICB0bXAgPSBbXTtcclxuICAgIGxldCBjb29raWUgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICBjb29raWUuc3BsaXQoXCI7XCIpXHJcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uY2hhckF0KDApID09IFwiIFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG1wID0gaXRlbS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGlmICh0bXBbMF0gPT09IHBhcmFtZXRlck5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0bXBbMV07XHJcbiAgICAgICAgfSlcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldmljZUNoZWNrKCkge1xyXG4gICAgbGV0IGRldmljZSA9IHt9O1xyXG4gICAgbGV0IG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICBpZiAobWQubWF0Y2goL2FuZHJvaWQvaSkpIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSBcImFuZHJvaWRcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJhbmRyb2lkXCIpO1xyXG4gICAgfSBlbHNlIGlmIChtZC5tYXRjaCgvKGlwaG9uZXxpcGFkfGlwb2QpOz8vaSkpIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSBcImlvc1wiO1xyXG4gICAgICAgIGRldmljZS52ZXJzaW9uID0gbWQudmVyc2lvbihcImlPU1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJwY1wiO1xyXG4gICAgICAgIGRldmljZS52ZXJzaW9uID0gbWQudmVyc2lvbihcIkNocm9tZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXZpY2U7XHJcbn1cclxuXHJcblZ1ZS5taXhpbih7XHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICAgICAgICBzdGFydF9kYXRlOiBcIjIxMDAvMDgvMDkgMTI6MDk6MTBcIixcclxuICAgICAgICAgICAgZXJyb3JfbXNnOiBcIlwiLFxyXG4gICAgICAgICAgICBtb2RlOiBwcm9kdWN0aW9uID8gXCJTdGFydGVkXCIgOiBcIlRlc3RpbmdcIixcclxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgcG9wdXB0b3A6ICcnLFxyXG4gICAgICAgICAgICBwb3B1cDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBvcHVwcGFnZTogXCJcIixcclxuICAgICAgICAgICAgYXdhcmRQb3BMaXN0OiBbXSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBvcGVuQ29tZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gISh0aGlzLm1vZGUgPT0gXCJUZXN0aW5nXCIgfHwgc3RhcnRfZGF0ZSA8PSAwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBnYUV2YW50OiBmdW5jdGlvbiAoZ3RtRGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7ICdldmVudCc6IGd0bURhdGEgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2E6XCIsIGd0bURhdGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VydmVyX2J1c3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgdm0uZXJyb3JfbXNnID0gXCLns7vntbHlv5nnoozkuK3vvIzoq4vnqI3lvozlnKjoqaYhXCI7XHJcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0uZXJyb3JfY291ID0gNjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldENvb2tpZTogZnVuY3Rpb24gKGNuYW1lLCBjdmFsdWUsIHRpbWUpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAodGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvVVRDU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZ2dlcjogZnVuY3Rpb24gKGxldmVsLCBjb250ZW50LCB0YWcpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIGxldmVsIDogWydFUlJPUicgPT4gMCwgREVCVUcnID0+IDEsICdXQVJOSU5HJyA9PiAyLCAnSU5GTycgPT4gMywgJ0FMTCcgPT4gNF1cclxuICAgICAgICAgICAgICAgIGxldCBsZXZlbF9pbmZvID0gWydFUlJPUicsICdERUJVRycsICdXQVJOSU5HJywgJ0lORk8nLCAnQUxMJ107XHJcbiAgICAgICAgICAgICAgICBfTFRyYWNrZXIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xldmVsJzogbGV2ZWxfaW5mb1tsZXZlbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBKU09OLnN0cmluZ2lmeShjb250ZW50KSxcclxuICAgICAgICAgICAgICAgICAgICAncGF0aCc6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICAgICAgICAgICd0YWcnOiB0YWcgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAnZGV2aWNlJzogZGV2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICd0aW1lc3RhbXAnOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JEb25lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JfbXNnID0gXCJcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoZWNrT25saW5lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJbnRlcm5ldCDpgKPnt5rlt7LmlrfplovvvIzoq4vnorroqo3mgqjnmoTntrLot6/ni4DmhYvjgIJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0YXRlX2NoZWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBgJHtmcmllbmRvX3VybH1HZXRQcm9qZWN0SW5mb2AsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlcy5EYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXJ0X2RhdGUgPSBkYXRhLlN0YXJ0RGF0ZVRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubW9kZSA9IGRhdGEuU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoZSkub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3B1cE9wZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKCF2bS5wb3B1cHRvcCB8fCB2bS5wb3B1cHRvcCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucG9wdXB0b3AgPSBNYXRoLm1heCh3aW5kb3cucGFnZVlPZmZzZXQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ19mcmVlemUnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHBvcHVwQ2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAvLyAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgICAgLy8gICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aodm0ucG9wdXB0b3ApO1xyXG4gICAgICAgIC8vICAgICB2bS5wb3B1cHRvcCA9IDA7XHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBwb3B1cENsb3NlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgICAgICAgIHZtLnBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLnBvcHVwcGFnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aodm0ucG9wdXB0b3ApO1xyXG4gICAgICAgICAgICB2bS5wb3B1cHRvcCA9IDA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBiaXJ0aENsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh2bS5wb3B1cHBhZ2UgPT09ICdiaXJ0aGRheScpIHtcclxuICAgICAgICAgICAgICAgIHZtLmdhRXZhbnQoJ+eZvOelqOeZu+mMhF/pl5zploknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZml4YnRuKCkge1xyXG4gICAgICAgICAgICAvLyAkKFwiYm9keSxodG1sXCIpLnNjcm9sbChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2luZG93U2Nyb2xsVG9wID0gJChcImJvZHlcIikuc2Nyb2xsVG9wKCk+MD8kKFwiYm9keVwiKS5zY3JvbGxUb3AoKTokKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmKHdpbmRvd1Njcm9sbFRvcCA+ICQoXCIuaW5kZXggLmV2ZW50c1wiKS5vZmZzZXQoKS50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZpeGVkYnRuXCIpLmFkZENsYXNzKFwiZml4ZWRidG4tYWN0aXZlXCIpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuZml4ZWRidG5cIikucmVtb3ZlQ2xhc3MoXCJmaXhlZGJ0bi1hY3RpdmVcIilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3VkX0FuaSgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHNlYyA9IDAuM1xyXG4gICAgICAgICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcclxuICAgICAgICAgICAgdGwuc2V0KFwiLnJhbmRvbWNsb3VkMVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiKz1jbG91ZDBcIlxyXG4gICAgICAgICAgICB9LFwiLT0wLjNcIilcclxuICAgICAgICAgICAgLnNldChcIi5yYW5kb21jbG91ZDJcIiwge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcIis9Y2xvdWQxXCJcclxuICAgICAgICAgICAgfSxcIi09MC4zXCIpXHJcbiAgICAgICAgICAgIC5zZXQoXCIucmFuZG9tY2xvdWQzXCIsIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCIrPWNsb3VkMlwiXHJcbiAgICAgICAgICAgIH0sXCItPTAuM1wiKVxyXG4gICAgICAgICAgICAuc2V0KFwiLnJhbmRvbWNsb3VkNFwiLCB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiKz1jbG91ZDNcIlxyXG4gICAgICAgICAgICB9LFwiLT0wLjNcIilcclxuICAgICAgICAgICAgLnNldChcIi5yYW5kb21jbG91ZDVcIiwge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcIis9Y2xvdWQ0XCJcclxuICAgICAgICAgICAgfSxcIi09MC4zXCIpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB2QWxlcnQoKXtcclxuICAgICAgICAgICAgYWxlcnQoJ+a0u+WLleW3sue1kOadn++8jOS4i+S4gOazouiDvemHj+aVrOiri+acn+W+he+8gScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgY29taW5nc29vbjogY29taW5nc29vblxyXG4gICAgfSxcclxufSlcclxuXHJcblZ1ZS5jb21wb25lbnQoJ2NvbWluZ3Nvb24nLCB7XHJcbiAgICB0ZW1wbGF0ZTogXCIjY29taW5nc29vblwiLFxyXG4gICAgcHJvcHM6IFsnU3RhcnREYXRlJywgJ21vZGUnXSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjb21pbmdzb29uOiBmYWxzZSxcclxuICAgICAgICAgICAgZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgICAgICBkYXlzOiAwLFxyXG4gICAgICAgICAgICAgICAgaG91cnM6IDAsXHJcbiAgICAgICAgICAgICAgICBtaW51dGVzOiAwLFxyXG4gICAgICAgICAgICAgICAgc2Vjb25kczogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGFkTGVmdCA9IGZ1bmN0aW9uIChzdHIsIGxlbikge1xyXG4gICAgICAgICAgICBzdHIgPSAnJyArIHN0cjtcclxuICAgICAgICAgICAgaWYgKHN0ci5sZW5ndGggPj0gbGVuKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZExlZnQoXCIwXCIgKyBzdHIsIGxlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy8gdm0uc3RhdGVfY2hlY2soKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAvLyAgICAgdmFyIGRhdGEgPSByZXMuRGF0YTtcclxuICAgICAgICAvLyAgICAgdm0uc3RhcnRfZGF0ZSA9IGRhdGEuU3RhcnREYXRlVGltZTtcclxuICAgICAgICB2YXIgdGltZWludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdCA9IERhdGUucGFyc2UobmV3IERhdGUodm0uU3RhcnREYXRlKSkgLSBEYXRlLnBhcnNlKG5ldyBEYXRlKCkpO1xyXG4gICAgICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKHQgLyAxMDAwKSAlIDYwKTtcclxuICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBNYXRoLmZsb29yKCh0IC8gMTAwMCAvIDYwKSAlIDYwKTtcclxuICAgICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcigodCAvICgxMDAwICogNjAgKiA2MCkpICUgMjQpO1xyXG4gICAgICAgICAgICB2YXIgZGF5cyA9IE1hdGguZmxvb3IodCAvICgxMDAwICogNjAgKiA2MCAqIDI0KSk7XHJcbiAgICAgICAgICAgIHZtLmRhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICAndG90YWwnOiB0LFxyXG4gICAgICAgICAgICAgICAgJ2RheXMnOiBwYWRMZWZ0KGRheXMsIDIpLFxyXG4gICAgICAgICAgICAgICAgJ2hvdXJzJzogcGFkTGVmdChob3VycywgMiksXHJcbiAgICAgICAgICAgICAgICAnbWludXRlcyc6IHBhZExlZnQobWludXRlcywgMiksXHJcbiAgICAgICAgICAgICAgICAnc2Vjb25kcyc6IHBhZExlZnQoc2Vjb25kcywgMilcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHZtLmRhdGUudG90YWwgPD0gMCB8fCB2bS5tb2RlID09IFwiVGVzdGluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB2bS5jb21pbmdzb29uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jb21pbmdzb29uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfSxcclxufSkiXX0=
