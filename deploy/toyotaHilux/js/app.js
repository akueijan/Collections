"use strict";var production=!1===$("#appjs").data("mode"),friendo_url=$("#appjs").data("site"),device=deviceCheck();Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production;var md=new MobileDetect(window.navigator.userAgent),tag=document.createElement("script");function findGetParameter(t){var n=null,o=[];return location.search.substr(1).split("&").forEach(function(e){(o=e.split("="))[0]===t&&(n=decodeURIComponent(o[1]))}),n}function checkCookie(t){var n=null,o=[];return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(o=e.split("="))[0]===t&&(n=o[1])}),n}function deviceCheck(){var e={},t=new MobileDetect(window.navigator.userAgent);return t.match(/android/i)?(e.os="android",e.version=t.version("android")):t.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=t.version("iOS")):(e.os="pc",e.version=t.version("Chrome")),e}$(function(){console.log("v1.0"),console.log(device),$(".nav").menu()}),Vue.mixin({data:function(){return{status:"",startDate:"",endDate:"",projectStatus:null,errorMsg:"",envMode:production?"Started":"Testing",mainToken:"",reCaptcha:"",isPc:!1,popup:!1,popPage:"",alertPopup:!1,alertPage:"",eventPopup:!1,loading:!1,loadPage:"",warning:0,savecheck:{q1:0,q2:0,q3:0},gameAns:{txt:"",keyword:""}}},computed:{},watch:{errorMsg:function(e){$("body").toggleClass("_freeze")}},methods:{gtmEvent:function(e){dataLayer.push({event:e})},gaEvent:function(e,t){ga("send",{hitType:"event",eventCategory:"202007_HILUXMC",eventAction:t,eventLabel:e})},gtagEvent:function(e,t){gtag("event",t,{event_category:"202007_HILUXMC",event_label:e})},server_busy:function(){var e=this;e.errorMsg="系統忙碌中，請稍後在試!",e.loading=!1,e.errorCou=6},setCookie:function(e,t,n){var o=new Date;o.setTime(o.getTime()+1e3*n);var i="expires="+o.toUTCString();document.cookie=e+"="+t+";"+i+";"},logger:function(e,t,n){if(production){_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(t),path:window.location.href,tag:n||null,device:device,timestamp:Date.now()})}},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){$("html,body").animate({scrollTop:$(e).offset().top-this.navHeight},500)},getToken:function(){var t=this;return $.ajax({url:"".concat(friendo_url,"token"),headers:{webToken:"Y7LpsA6d5VDRjqeWB1F6cA=="},method:"POST"}).done(function(e){t.mainToken=e.token,t.startDate=e.startDate,t.endDate=e.endDate,t.projectStatus=e.projectStatus})},grecaptcha:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(n){var o=this;return new Promise(function(t,e){grecaptcha.execute("6LfXybAZAAAAAAIVaOzEtaP-N1m_Zh3tX7ftaIxp",{action:n}).then(function(e){o.reCaptcha=e,t()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})}),popClose:function(e){var t=this;t.eventPopup=!1,"fb"!=e&&(t.popup=!1,t.popPage=""),t.alertPopup=!1,t.alertPage=""},eventOpen:function(){this.eventPopup=!0},checkBrower:function(e){var t=navigator.userAgent,n=(navigator.userAgent.toLowerCase(),-1<t.indexOf("Line"));t.indexOf("FBAV");n&&(-1==window.location.href.indexOf("?")?window.location.href+="?openExternalBrowser=1":window.location.href+="&openExternalBrowser=1"),1e3<window.innerWidth?(this.isPc=!0,document.querySelector("body").style="overflow: hidden","index"!==e&&(window.location="index.html")):this.isPc=!1}},mounted:function(){}});