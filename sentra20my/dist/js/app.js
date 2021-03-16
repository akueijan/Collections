"use strict";var production=!1===$("#appjs").data("mode"),friendo_url=$("#appjs").data("site"),device=deviceCheck();Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production;var md=new MobileDetect(window.navigator.userAgent),tag=document.createElement("script");function findGetParameter(n){var t=null,i=[];return location.search.substr(1).split("&").forEach(function(e){(i=e.split("="))[0]===n&&(t=decodeURIComponent(i[1]))}),t}function checkCookie(n){var t=null,i=[];return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(i=e.split("="))[0]===n&&(t=i[1])}),t}function deviceCheck(){var e={},n=new MobileDetect(window.navigator.userAgent);return n.match(/android/i)?(e.os="android",e.version=n.version("android")):n.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=n.version("iOS")):(e.os="pc",e.version=n.version("Chrome")),e}$(function(){console.log("v1.0"),console.log(device),$(".nav").menu()}),Vue.mixin({data:function(){return{status:"",startDate:"",endDate:"",projectStatus:null,errorMsg:"",envMode:production?"Started":"Testing",loading:!1,mainToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY4NjM3MTNjYmU5MDI0NmY2MWY3NWFjNTY0NzA5ZjdiMjdiNjdkNDc1ZWI2YmNmNmFmZmIwYzBmNjUzOThiMzg4YjhiYTBjYTNlM2RmMzkwIn0.eyJhdWQiOiIxIiwianRpIjoiNjg2MzcxM2NiZTkwMjQ2ZjYxZjc1YWM1NjQ3MDlmN2IyN2I2N2Q0NzVlYjZiY2Y2YWZmYjBjMGY2NTM5OGIzODhiOGJhMGNhM2UzZGYzOTAiLCJpYXQiOjE1OTI3OTgyMDksIm5iZiI6MTU5Mjc5ODIwOSwiZXhwIjoxNjI0MzM0MjA5LCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.VxHy-ndisZgLasdYZ79lkvrupv-S5gkbz3xOEPeMAv-jWlTE_YQnhu7Uhasc6DfkRNRUUMudPEBOJFF-2t6mtxivr0Rchfq8DKFWI_iXL9hZc3AGdFQGzG3nRcQbnwG0gWmzNjTv5aVwHFYU3wNE4jsR53-1ubHyd8cTEK8T7oPTvSlZPaUhgPnYjw-NSZ4U5Wd2JGH5CDligslSBAS3K6SHB4i2dYVhfrxhCDVbe2FTk6AgaqmndDB-8_FZzcuR6h1kjxzQ5dVA915YqqleZWl7vNCa6W0yZLAVNBmrTO-xkTuEsBN3k4rwz-UhAwmE2VjZ7J6fZLO_Mem1ZelHzX4vUCHuSmSY-8gkUpYgXSSz362ucLipShJj9Cy5BXflXcEUIz2xdqfmFH1R9uwe3Yjn3GaeM1dG1l8lS-rgPGfHX1eIqrE7V423ZnTBznk_GW5LgsGuRB31DNXkT1fzKOblvdV6Fdlf5HzKc7ByHp9uCjmi0JYcc4xZOxNeAy1TQpM02wH7cDOScX9m-6ssns_OKJZGrvifwD2IVpzKl-SBmFGMcDwmWjDu9TSCrntebyc0mwMQ3KiyTtRsJ2D6dO7cex2i8Y0wDIRVdpnoEwhDzT7Fq4rUpprsAI917-o-YAdrxvgkVZxQL3TV0w6TmA2x2Znrqqgr7x5MxZwfSjc",apiUrl:"https://nissanlinebc.nissan.com.tw/",entId:"1",lineId:"",popup:!1,popPage:"",evtpopup:!1,userArr:[]}},computed:{},watch:{errorMsg:function(e){$("body").toggleClass("_freeze")}},methods:{gaEvant:function(e){dataLayer.push({event:e}),console.log("ga:",e)},server_busy:function(){var e=this;e.errorMsg="系統忙碌中，請稍後在試!",e.loading=!1,e.errorCou=6},setCookie:function(e,n,t){var i=new Date;i.setTime(i.getTime()+1e3*t);var o="expires="+i.toUTCString();document.cookie=e+"="+n+";"+o+";"},logger:function(e,n,t){if(production){_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(n),path:window.location.href,tag:t||null,device:device,timestamp:Date.now()})}},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){$("html,body").animate({scrollTop:$(e).offset().top},500)},getToken:function(){var n=this;return $.ajax({url:"".concat(friendo_url,"auth/login?projectId=66"),headers:{webtoken:"WBqIHc9hTmwyL+g9m0ykfA=="},method:"GET",dataType:"json"}).done(function(e){n.mainToken=e.token,n.startDate=e.startDate,n.endDate=e.endDate,n.projectStatus=e.projectStatus})},grecaptcha:function(n){function e(e){return n.apply(this,arguments)}return e.toString=function(){return n.toString()},e}(function(t){var i=this;return new Promise(function(n,e){grecaptcha.execute("6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ",{action:t}).then(function(e){i.reCaptcha=e,n()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})}),initLiff:function(e){var n=this;liff.init({liffId:e}).then(function(){liff.ready.then(function(){liff.isLoggedIn()&&liff.getProfile().then(function(e){n.linePic=e.pictureUrl,n.lineName=e.displayName,n.lineId=e.userId}).catch(function(e){})})}).catch(function(e){})},openPop:function(e){var n=this;n.popup=!0,"popleader"==(n.popPage=e)&&n.showArr()},closePop:function(){this.popup=!1,this.popPage=""},eventShare:function(){var e=encodeURIComponent("https://event.nissan.com.tw/sentra_line");window.location="http://line.naver.jp/R/msg/text/?欸~這超~~~難的！你要不要玩玩看~還可以抽 Switch 和 LINE POINTS 點數哦！%0D%0A《ALL NEW SENTRA 先潮耐力賽》%0D%0A".concat(e)},checkAward:function(){var e=this;""==e.awardName||null==e.awardName?(e.popup=!0,e.popPage="noAward"):(e.step="useraward",e.isGame=!1)},noticketShare:function(){this.eventShare(),this.ticketCount+=1,this.popup=!1,this.popPage=""}},mounted:function(){}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJwcm9kdWN0aW9uIiwiJCIsImRhdGEiLCJkZXZpY2UiLCJkZXZpY2VDaGVjayIsIlZ1ZSIsImNvbmZpZyIsImRlYnVnIiwic2lsZW50IiwibWQiLCJNb2JpbGVEZXRlY3QiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjb25zb2xlIiwibG9nIiwidG1wIiwicGFyYW1ldGVyTmFtZSIsInJlc3VsdCIsIml0ZW0iLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsImNoZWNrQ29va2llIiwic3BsaXQiLCJkb2N1bWVudCIsImNvb2tpZSIsImZvckVhY2giLCJjaGFyQXQiLCJzdWJzdHJpbmciLCJzdGFydERhdGUiLCJ2ZXJzaW9uIiwib3MiLCJtYXRjaCIsImZpbmRHZXRQYXJhbWV0ZXIiLCJtZW51IiwiZXJyb3JNc2ciLCJlbnZNb2RlIiwibG9hZGluZyIsIm1haW5Ub2tlbiIsImVuZERhdGUiLCJwcm9qZWN0U3RhdHVzIiwicG9wUGFnZSIsImV2dHBvcHVwIiwidXNlckFyciIsImxpbmVJZCIsInBvcHVwIiwidG9nZ2xlQ2xhc3MiLCJtZXRob2RzIiwiZGF0YUxheWVyIiwiZ3RtRGF0YSIsInNlcnZlcl9idXN5IiwiZ2FFdmFudCIsInB1c2giLCJldmVudCIsInNldENvb2tpZSIsInZtIiwidGhpcyIsInNldFRpbWUiLCJleHBpcmVzIiwiY25hbWUiLCJjdmFsdWUiLCJ0aW1lIiwiZCIsIkRhdGUiLCJnZXRUaW1lIiwidG9VVENTdHJpbmciLCJsZXZlbF9pbmZvIiwiX0xUcmFja2VyIiwibGV2ZWwiLCJjb250ZW50IiwidGFnIiwiaHJlZiIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXRoIiwidGltZXN0YW1wIiwibm93IiwiY2hlY2tPbmxpbmUiLCJvbkxpbmUiLCJhbGVydCIsInNjcm9sbFRvIiwiZSIsImFuaW1hdGUiLCJhamF4Iiwib2Zmc2V0IiwidG9wIiwiaGVhZGVycyIsInVybCIsImNvbmNhdCIsImZyaWVuZG9fdXJsIiwicmVzIiwid2VidG9rZW4iLCJkb25lIiwidG9rZW4iLCJncmVjYXB0Y2hhIiwiX2dyZWNhcHRjaGEiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwidG9TdHJpbmciLCJwYWdlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJleGVjdXRlIiwiYWN0aW9uIiwicmVDYXB0Y2hhIiwibXlsaWZmSWQiLCJsaWZmIiwiaW5pdCIsImxpZmZJZCIsInRoZW4iLCJpc0xvZ2dlZEluIiwiZ2V0UHJvZmlsZSIsInByb2ZpbGUiLCJsaW5lUGljIiwicGljdHVyZVVybCIsImxpbmVOYW1lIiwiZGlzcGxheU5hbWUiLCJ1c2VySWQiLCJlcnIiLCJvcGVuUG9wIiwic2hvd0FyciIsImNsb3NlUG9wIiwic1VybCIsImVuY29kZVVSSUNvbXBvbmVudCIsImNoZWNrQXdhcmQiLCJhd2FyZE5hbWUiLCJzdGVwIiwiaXNHYW1lIiwibm90aWNrZXRTaGFyZSIsInRpY2tldENvdW50IiwibW91bnRlZCJdLCJtYXBwaW5ncyI6ImFBQUEsSUFDSUEsWUFBMEMsSUFBN0JDLEVBQUUsVUFBVUMsS0FBSyxRQUE5QkYsWUFBY0MsRUFBQyxVQUFVQyxLQUFLLFFBRzVCQyxPQUFTQyxjQUdmQyxJQUFJQyxPQUFPQyxVQUFTUCxXQUNwQkssSUFBSUMsT0FBT0UsT0FBU1IsV0FFcEJLLElBQUlJLE9BQUtELE9BQUlFLFdBSWJULElBQUVRLEdBQUEsSUFBQUMsYUFBWUMsT0FBQUMsVUFBQUMsV0FFVkMsSUFBUUMsU0FBSVosY0FBWixVQWFRLFNBQUlhLGlCQUFXQyxHQUx2QixJQUFBQyxFQUFBLEtBUUFGLEVBQU9FLEdBVUtDLE9BVGZDLFNBQUFDLE9BUlFDLE9BQU8sR0FVUEMsTUFBQUEsS0FDREwsUUFBUyxTQUFiQyxJQUNVSCxFQURWRyxFQUFBSyxNQUFBLE1BRWFDLEtBQVNDLElBQ1RSLEVBQ1JTLG1CQUF3QlgsRUFBQSxPQUViRSxFQUVSRixTQUFHTyxZQUFjTixHQUNqQixJQUFJRCxFQUFBLEtBTlpB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S2JYLE9BQUEsRUF1S2FXLEtBSVZmLFFBQUEsS0EzS2IyRixRQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0XHJcbiAgICBwcm9kdWN0aW9uID0gJChcIiNhcHBqc1wiKS5kYXRhKFwibW9kZVwiKSA9PT0gZmFsc2UsXHJcbiAgICBmcmllbmRvX3VybCA9ICQoXCIjYXBwanNcIikuZGF0YShcInNpdGVcIik7XHJcblxyXG5jb25zdCBkZXZpY2UgPSBkZXZpY2VDaGVjaygpO1xyXG5cclxuVnVlLmNvbmZpZy5kZXZ0b29scyA9ICFwcm9kdWN0aW9uO1xyXG5WdWUuY29uZmlnLmRlYnVnID0gIXByb2R1Y3Rpb247XHJcblZ1ZS5jb25maWcuc2lsZW50ID0gcHJvZHVjdGlvbjtcclxuXHJcbnZhciBtZCA9IG5ldyBNb2JpbGVEZXRlY3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxudmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInYxLjBcIik7XHJcbiAgICBjb25zb2xlLmxvZyhkZXZpY2UpO1xyXG4gICAgJChcIi5uYXZcIikubWVudSgpO1xyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiBmaW5kR2V0UGFyYW1ldGVyKHBhcmFtZXRlck5hbWUpIHtcclxuICAgIHZhciByZXN1bHQgPSBudWxsLFxyXG4gICAgICAgIHRtcCA9IFtdO1xyXG4gICAgbG9jYXRpb24uc2VhcmNoXHJcbiAgICAgICAgLnN1YnN0cigxKVxyXG4gICAgICAgIC5zcGxpdChcIiZcIilcclxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB0bXAgPSBpdGVtLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgaWYgKHRtcFswXSA9PT0gcGFyYW1ldGVyTmFtZSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGRlY29kZVVSSUNvbXBvbmVudCh0bXBbMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb29raWUocGFyYW1ldGVyTmFtZSkge1xyXG4gICAgdmFyIHJlc3VsdCA9IG51bGwsXHJcbiAgICAgICAgdG1wID0gW107XHJcbiAgICB2YXIgY29va2llID0gZG9jdW1lbnQuY29va2llO1xyXG4gICAgY29va2llLnNwbGl0KFwiO1wiKVxyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmNoYXJBdCgwKSA9PSBcIiBcIikge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0uc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRtcCA9IGl0ZW0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBpZiAodG1wWzBdID09PSBwYXJhbWV0ZXJOYW1lKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdG1wWzFdO1xyXG4gICAgICAgIH0pXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGRldmljZUNoZWNrKCkge1xyXG4gICAgdmFyIGRldmljZSA9IHt9O1xyXG4gICAgdmFyIG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICBpZiAobWQubWF0Y2goL2FuZHJvaWQvaSkpIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSBcImFuZHJvaWRcIjtcclxuICAgICAgICBkZXZpY2UudmVyc2lvbiA9IG1kLnZlcnNpb24oXCJhbmRyb2lkXCIpO1xyXG4gICAgfSBlbHNlIGlmIChtZC5tYXRjaCgvKGlwaG9uZXxpcGFkfGlwb2QpOz8vaSkpIHtcclxuICAgICAgICBkZXZpY2Uub3MgPSBcImlvc1wiO1xyXG4gICAgICAgIGRldmljZS52ZXJzaW9uID0gbWQudmVyc2lvbihcImlPU1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGV2aWNlLm9zID0gXCJwY1wiO1xyXG4gICAgICAgIGRldmljZS52ZXJzaW9uID0gbWQudmVyc2lvbihcIkNocm9tZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXZpY2U7XHJcbn1cclxuXHJcblZ1ZS5taXhpbih7XHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICAgICAgICBzdGFydERhdGU6IFwiXCIsXHJcbiAgICAgICAgICAgIGVuZERhdGU6IFwiXCIsXHJcbiAgICAgICAgICAgIHByb2plY3RTdGF0dXM6IG51bGwsXHJcbiAgICAgICAgICAgIGVycm9yTXNnOiBcIlwiLFxyXG4gICAgICAgICAgICBlbnZNb2RlOiBwcm9kdWN0aW9uID8gXCJTdGFydGVkXCIgOiBcIlRlc3RpbmdcIixcclxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1haW5Ub2tlbjpcImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSlNVekkxTmlJc0ltcDBhU0k2SWpZNE5qTTNNVE5qWW1VNU1ESTBObVkyTVdZM05XRmpOVFkwTnpBNVpqZGlNamRpTmpka05EYzFaV0kyWW1ObU5tRm1abUl3WXpCbU5qVXpPVGhpTXpnNFlqaGlZVEJqWVRObE0yUm1Nemt3SW4wLmV5SmhkV1FpT2lJeElpd2lhblJwSWpvaU5qZzJNemN4TTJOaVpUa3dNalEyWmpZeFpqYzFZV00xTmpRM01EbG1OMkl5TjJJMk4yUTBOelZsWWpaaVkyWTJZV1ptWWpCak1HWTJOVE01T0dJek9EaGlPR0poTUdOaE0yVXpaR1l6T1RBaUxDSnBZWFFpT2pFMU9USTNPVGd5TURrc0ltNWlaaUk2TVRVNU1qYzVPREl3T1N3aVpYaHdJam94TmpJME16TTBNakE1TENKemRXSWlPaUkySWl3aWMyTnZjR1Z6SWpwYlhYMC5WeEh5LW5kaXNaZ0xhc2RZWjc5bGt2cnVwdi1TNWdrYnozeE9FUGVNQXYtaldsVEVfWVFuaHU3VWhhc2M2RGZrUk5SVVVNdWRQRUJPSkZGLTJ0Nm10eGl2cjBSY2hmcThES0ZXSV9pWEw5aFpjM0FHZEZRR3pHM25SY1FibndHMGdXbXpOalR2NWFWd0hGWVUzd05FNGpzUjUzLTF1Ykh5ZDhjVEVLOFQ3b1BUdlNsWlBhVWhnUG5ZanctTlNaNFU1V2QySkdINUNEbGlnc2xTQkFTM0s2U0hCNGkyZFlWaGZyeGhDRFZiZTJGVGs2QWdhcW1uZERCLThfRlp6Y3VSNmgxa2p4elE1ZFZBOTE1WXFxbGVaV2w3dk5DYTZXMHlaTEFWTkJtclRPLXhrVHVFc0JOM2s0cnd6LVVoQXdtRTJWalo3SjZmWkxPX01lbTFaZWxIelg0dlVDSHVTbVNZLThna1VwWWdYU1N6MzYydWNMaXBTaEpqOUN5NUJYZmxYY0VVSXoyeGRxZm1GSDFSOXV3ZTNZam4zR2FlTTFkRzFsOGxTLXJnUEdmSFgxZUlxckU3VjQyM1puVEJ6bmtfR1c1TGdzR3VSQjMxRE5Ya1QxZnpLT2JsdmRWNkZkbGY1SHpLYzdCeUhwOXVDam1pMEpZY2M0eFpPeE5lQXkxVFFwTTAyd0g3Y0RPU2NYOW0tNnNzbnNfT0tKWkdydmlmd0QySVZwektsLVNCbUZHTWNEd21XakR1OVRTQ3JudGVieWMwbXdNUTNLaXlUdFJzSjJENmRPN2NleDJpOFkwd0RJUlZkcG5vRXdoRHpUN0ZxNHJVcHByc0FJOTE3LW8tWUFkcnh2Z2tWWnhRTDNUVjB3NlRtQTJ4MlpucnFxZ3I3eDVNeFp3ZlNqY1wiLFxyXG4gICAgICAgICAgICBhcGlVcmw6ICdodHRwczovL25pc3NhbmxpbmViYy5uaXNzYW4uY29tLnR3LycsXHJcbiAgICAgICAgICAgIGVudElkOiAnMScsXHJcbiAgICAgICAgICAgIC8vIGxpbmVJZDogJ1U1NzEwYzZmODkxNmYzNGU2OGNkODNkMGRlZGVjYjA3YycsXHJcbiAgICAgICAgICAgIGxpbmVJZDogJycsXHJcbiAgICAgICAgICAgIHBvcHVwOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9wUGFnZTogJycsIC8vcmVhZG1lIGdhbWVzdGFydCBnYW1lb3ZlciBwb3BsZWFkZXIgZXZlbnRzIG5vQXdhcmQgYXdhcmRyZWFkbWUgbG9hZGluZyBub3RpY2tldGNvdW50XHJcbiAgICAgICAgICAgIGV2dHBvcHVwOiBmYWxzZSxcclxuICAgICAgICAgICAgdXNlckFycjogW11cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgIH0sXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICAgIGVycm9yTXNnOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgZ2FFdmFudDogZnVuY3Rpb24gKGd0bURhdGEpIHtcclxuICAgICAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGd0bURhdGF9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYTpcIiwgZ3RtRGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXJ2ZXJfYnVzeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2bS5lcnJvck1zZyA9IFwi57O757Wx5b+Z56KM5Lit77yM6KuL56iN5b6M5Zyo6KmmIVwiO1xyXG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLmVycm9yQ291ID0gNjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldENvb2tpZTogZnVuY3Rpb24gKGNuYW1lLCBjdmFsdWUsIHRpbWUpIHtcclxuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAodGltZSAqIDEwMDApKTtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIgKyBkLnRvVVRDU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvZ2dlcjogZnVuY3Rpb24gKGxldmVsLCBjb250ZW50LCB0YWcpIHtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIGxldmVsIDogWydFUlJPUicgPT4gMCwgREVCVUcnID0+IDEsICdXQVJOSU5HJyA9PiAyLCAnSU5GTycgPT4gMywgJ0FMTCcgPT4gNF1cclxuICAgICAgICAgICAgICAgIHZhciBsZXZlbF9pbmZvID0gWydFUlJPUicsICdERUJVRycsICdXQVJOSU5HJywgJ0lORk8nLCAnQUxMJ107XHJcbiAgICAgICAgICAgICAgICBfTFRyYWNrZXIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2xldmVsJzogbGV2ZWxfaW5mb1tsZXZlbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBKU09OLnN0cmluZ2lmeShjb250ZW50KSxcclxuICAgICAgICAgICAgICAgICAgICAncGF0aCc6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICAgICAgICAgICd0YWcnOiB0YWcgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAnZGV2aWNlJzogZGV2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICd0aW1lc3RhbXAnOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hlY2tPbmxpbmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkludGVybmV0IOmAo+e3muW3suaWt+mWi++8jOiri+eiuuiqjeaCqOeahOe2sui3r+eLgOaFi+OAglwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoZSkub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUb2tlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgLy8gdXJsOiBcImh0dHBzOi8vY2FycmVmb3VyMjAxOWNueS5henVyZXdlYnNpdGVzLm5ldC9hcGkvYXV0aC9sb2dpbj9wcm9qZWN0SWQ9NjFcIixcclxuICAgICAgICAgICAgICAgIHVybDogYCR7ZnJpZW5kb191cmx9YXV0aC9sb2dpbj9wcm9qZWN0SWQ9NjZgLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwid2VidG9rZW5cIjogXCJXQnFJSGM5aFRtd3lMK2c5bTB5a2ZBPT1cIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxyXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1haW5Ub2tlbiA9IHJlcy50b2tlbjtcclxuICAgICAgICAgICAgICAgIHZtLnN0YXJ0RGF0ZSA9IHJlcy5zdGFydERhdGU7XHJcbiAgICAgICAgICAgICAgICB2bS5lbmREYXRlID0gcmVzLmVuZERhdGU7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0U3RhdHVzID0gcmVzLnByb2plY3RTdGF0dXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JlY2FwdGNoYTogZnVuY3Rpb24gKHBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIGdyZWNhcHRjaGEuZXhlY3V0ZSgnNkxmVW83TVVBQUFBQUpRQU1MMDhydWhQZVladmloTFlhVnZ0dVlySicsIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHBhZ2VcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVDYXB0Y2hhID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0dvb2dsZempl+itieWkseaVl++8jOiri+WGjeasoeWYl+ipplxcbuWmgueEoeazleaOkumZpOatpOWVj+mhjO+8jOW7uuitsOmHjeaWsOaVtOeQhuatpOmggemdoicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0TGlmZihteWxpZmZJZCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBsaWZmXHJcbiAgICAgICAgICAgICAgICAuaW5pdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlmZklkOiBteWxpZmZJZFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsaWZmLmlzTG9nZ2VkSW4oKSlcclxuICAgICAgICAgICAgICAgICAgICBsaWZmLnJlYWR5LnRoZW4oKCk9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWFkeScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxpZmYuaXNMb2dnZWRJbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuYW1lID0gcHJvZmlsZS5kaXNwbGF5TmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlmZi5nZXRQcm9maWxlKCkudGhlbihwcm9maWxlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwcm9maWxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxpbmVQaWMgPSBwcm9maWxlLnBpY3R1cmVVcmxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5saW5lTmFtZSA9IHByb2ZpbGUuZGlzcGxheU5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5saW5lSWQgPSBwcm9maWxlLnVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZtLnNhdmVMZWFkZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2Vycm9yJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uID0gXCJodHRwczovL2xpbi5lZS93TFZra205XCIgLy8g5oeJ5Yqg5YWlbmlzc2Fu55qE5aW95Y+LXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSBcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlcnI6ICcsIGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBvcGVuUG9wKHBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpc1xyXG4gICAgICAgICAgICB2bS5wb3B1cCA9IHRydWVcclxuICAgICAgICAgICAgdm0ucG9wUGFnZSA9IHBhZ2VcclxuICAgICAgICAgICAgaWYocGFnZT09J3BvcGxlYWRlcicpIHtcclxuICAgICAgICAgICAgICAgIHZtLnNob3dBcnIoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZVBvcCgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpc1xyXG4gICAgICAgICAgICB2bS5wb3B1cCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSAnJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXZlbnRTaGFyZSgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpc1xyXG4gICAgICAgICAgICB2YXIgc1VybCA9IGVuY29kZVVSSUNvbXBvbmVudChgaHR0cHM6Ly9ldmVudC5uaXNzYW4uY29tLnR3L3NlbnRyYV9saW5lYClcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYGh0dHA6Ly9saW5lLm5hdmVyLmpwL1IvbXNnL3RleHQvP+asuH7pgJnotoV+fn7pm6PnmoTvvIHkvaDopoHkuI3opoHnjqnnjqnnnIt+6YKE5Y+v5Lul5oq9IFN3aXRjaCDlkowgTElORSBQT0lOVFMg6bue5pW45ZOm77yBJTBEJTBB44CKQUxMIE5FVyBTRU5UUkEg5YWI5r2u6ICQ5Yqb6LO944CLJTBEJTBBJHtzVXJsfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja0F3YXJkKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzXHJcbiAgICAgICAgICAgIGlmKHZtLmF3YXJkTmFtZSA9PSAnJyB8fCB2bS5hd2FyZE5hbWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucG9wdXAgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB2bS5wb3BQYWdlID0gJ25vQXdhcmQnXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zdGVwID0gJ3VzZXJhd2FyZCdcclxuICAgICAgICAgICAgICAgIHZtLmlzR2FtZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAvLyB2bS5oYXZlQXdhcmQgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG5vdGlja2V0U2hhcmUoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXNcclxuICAgICAgICAgICAgdm0uZXZlbnRTaGFyZSgpXHJcbiAgICAgICAgICAgIHZtLnRpY2tldENvdW50ICs9IDFcclxuICAgICAgICAgICAgdm0ucG9wdXAgPSBmYWxzZVxyXG4gICAgICAgICAgICB2bS5wb3BQYWdlID0gJydcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB9XHJcbn0pXHJcbiJdfQ==