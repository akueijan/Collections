"use strict";var production=!1===document.getElementById("appjs").dataset.mode,device=deviceCheck(),md=new MobileDetect(window.navigator.userAgent);function findGetParameter(t){var n,o=null;return location.search.substr(1).split("&").forEach(function(e){(n=e.split("="))[0]===t&&(o=decodeURIComponent(n[1]))}),o}function checkCookie(t){var n,o=null;return document.cookie.split(";").forEach(function(e){" "==e.charAt(0)&&(e=e.substring(1)),(n=e.split("="))[0]===t&&(o=n[1])}),o}function deviceCheck(){var e={},t=new MobileDetect(window.navigator.userAgent);return t.match(/android/i)?(e.os="android",e.version=t.version("android")):t.match(/(iphone|ipad|ipod);?/i)?(e.os="ios",e.version=t.version("iOS")):(e.os="pc",e.version=t.version("Chrome")),e}Vue.config.devtools=!production,Vue.config.debug=!production,Vue.config.silent=production,document.addEventListener("DOMContentLoaded",function(){console.log("v1.01"),console.log(device)}),Vue.mixin({data:function(){return{projApi:null,errorMsg:"",envMode:production?"Started":"Testing",loading:!1,friendo_url:document.getElementById("appjs").dataset.site,popup:"",popPage:"",guid:"",haveRichart:!0,isPc:!1,startItem:0,utm:"",sendLoading:!1}},computed:{production:function(){return document.getElementById("appjs").dataset.mode},client_Id:function(){return"true"===this.production?"1511930966":"1515344613"},redirect_Url:function(){return"true"===this.production?"https://tsdib-test.taishinbank.com.tw/TSDIB_RichartWeb_line/RC08/Line10":"https://richart.tw/TSDIB_RichartWeb/RC08/Line10"}},watch:{errorMsg:function(e){document.querySelector("body").classList.toggle("_freeze")}},methods:{gaEvant:function(e){dataLayer.push({event:e}),console.log("ga:",e)},setCookie:function(e,t,n){var o=new Date;o.setTime(o.getTime()+1e3*n);o="expires="+o.toUTCString();document.cookie=e+"="+t+";"+o+";"},logger:function(e,t,n){production&&_LTracker.push({level:["ERROR","DEBUG","WARNING","INFO","ALL"][e],content:JSON.stringify(t),path:window.location.href,tag:n||null,device:device,timestamp:Date.now()})},checkOnline:function(){navigator.onLine||alert("Internet 連線已斷開，請確認您的網路狀態。")},scrollTo:function(e){var t=document.scrollingElement||document.documentElement,n=document.querySelector(e),o=t,i=Math.abs(n.offsetTop-o.scrollTop),r=0;(function e(){Math.easeInOutQuad=function(e,t,n,o){return(e/=o/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t},r+=50;var t=Math.easeInOutQuad(r,o,i,1500);if(o.scrollTop>n.offsetTop){if(o.scrollTop-=parseInt(t),o.scrollTop<=n.offsetTop)return void(o.scrollTop=n.offsetTop)}else o.scrollTop=parseInt(t);r<1500&&requestAnimationFrame(e)})()},grecaptcha:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(n){var o=this;return new Promise(function(t,e){grecaptcha.execute("6LfUo7MUAAAAAJQAML08ruhPeYZvihLYaVvtuYrJ",{action:n}).then(function(e){o.reCaptcha=e,t()},function(){alert("Google驗證失敗，請再次嘗試\n如無法排除此問題，建議重新整理此頁面"),e()})})}),aLink:function(){for(var e=document.querySelectorAll("a"),t=0;t<e.length;t++)e[t].setAttribute("rel","noreferrer noopener")},popOpen:function(e){switch(document.querySelector("body").classList.add("_popfreeze"),e){case"event":this.popup="event";break;case"usersev":this.popup="usersev"}},popupClose:function(){this.popup="",this.popPage="",document.querySelector("body").classList.remove("_popfreeze")},checkbrowser:function(){1e3<window.innerWidth?this.isPc=!0:this.isPc=!1},checkWeek:function(){var e=this,t=new Date;t>new Date("2021/1/8")&&(e.startItem=0),t>new Date("2021/1/15")&&(e.startItem=1,document.querySelector(".event-over1").style.visibility="inherit"),t>new Date("2021/1/22")&&(e.startItem=2,document.querySelector(".event-over2").style.visibility="inherit"),t>new Date("2021/1/29")&&(e.startItem=3,document.querySelector(".event-over3").style.visibility="inherit"),t>new Date("2021/2/5")&&(e.startItem=4,document.querySelector(".event-over4").style.visibility="inherit"),t>new Date("2021/2/12")&&(e.startItem=0,document.querySelector(".event-over5").style.visibility="inherit")},searhUtm:function(){var n=this;return new Promise(function(e){var t=location.href,t=new URL(t);n.utm=t.search.replace("?","&"),e()})},outLink:function(){var e=this,t="utm_source=richart&utm_medium=line&utm_campaign=richart_bcbonbon_20201229&utm_content=textlink_index";e.searhUtm().then(function(){""==e.utm?window.open("https://richart.tw/TSDIB_RichartWeb/RC00/RC000000?".concat(t)):window.open("https://richart.tw/TSDIB_RichartWeb/RC00/RC000000?".concat(e.utm).concat(t))})}},mounted:function(){}});