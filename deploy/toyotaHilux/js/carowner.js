"use strict";var carowner_view=new Vue({el:"#app",data:{page:"carowner"},methods:{openAni:function(){var e=new TimelineMax({delay:1.2,onComplete:function(){$(".carowner").css("overflow-x","auto"),$(".carowner").animate({scrollLeft:750},900),setTimeout(function(){$(".btn-totry").css("opacity","1")},1200)}});e.from(".carowner .car",.3*3,{x:-350}),e.to(".carowner .bg",3,{x:-1924},"-=0.2"),e.from(".carowner .title",.3,{opacity:0}),e.from(".carowner .more",.3,{opacity:0})},scrollW_ga:function(){var r=this,n=!1,t=!1,a=!1,c=!1;$(".carowner").scroll(function(){var e=$(".carowner").scrollLeft(),o=$(".ownerbox").width();.25*o<e&&(n||(r.gaEvent("車主證言_25%","scroll"),n=!0)),.5*o<e&&(t||(r.gaEvent("車主證言_50%","scroll"),t=!0)),.75*o<e&&(a||(r.gaEvent("車主證言_75%","scroll"),a=!0)),o<=e&&(c||(r.gaEvent("車主證言_100%","scroll"),c=!0))})},checkFb:function(){var e=navigator.userAgent;navigator.userAgent.toLowerCase();-1<e.indexOf("FB")&&document.querySelector("body").classList.add("fbweb")}},created:function(){$("body").loadpage("init",{async:!1})},mounted:function(){var e=this;e.checkBrower(""),e.openAni(),e.checkFb()}});