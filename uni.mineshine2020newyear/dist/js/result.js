"use strict";var result_view=new Vue({el:"#app",data:{step:2,code:"",name:"",friendName:"",address:"",mobile:"",text:"",textImg:"",serialNumber:"",agree:!1,link:"",savedata:!1,user:{shareImg:"",userImg1:"",userImg2:"",userImg3:""},keyWord:{word1:"",word2:"",word3:""}},methods:{getImg:function(){var t=this;return $.ajax({url:"".concat(friendo_url,"MineShine/image/").concat(t.code),headers:{Authorization:"Bearer "+t.gToken},method:"GET"}).done(function(e){t.serialNumber=e.data.serialNumber,t.user.shareImg=e.data.shareImg,t.toDataURL(e.data.userImg1,function(e){t.user.userImg1=e}),t.toDataURL(e.data.userImg2,function(e){t.user.userImg2=e}),t.toDataURL(e.data.userImg3,function(e){t.user.userImg3=e}),t.toDataURL(e.data.shareImg,function(e){t.user.shareImg=e}),t.keyWord.word1=e.data.keyword1,t.keyWord.word2=e.data.keyword2,t.keyWord.word3=e.data.keyword3,t.link=e.data.link,t.savedata=e.data.saveData,$("body").loadpage("close")})},saveData:function(){var t=this,e=new FormData;return e.append("code",t.code),e.append("name",t.name),e.append("friendName",t.friendName),e.append("address",t.address),e.append("mobile",t.mobile),e.append("textImg",t.textImg),e.append("serialNumber",t.serialNumber),e.append("reCaptcha",t.reCaptcha),$.ajax({url:"".concat(friendo_url,"MineShine/data"),headers:{Authorization:"Bearer "+t.gToken},data:e,method:"POST",processData:!1,contentType:!1}).done(function(e){e.success?(t.resultLoad=!1,t.popup=!0,t.popEvent="type",t.popPage="suc"):(alert("您已填過表單 感謝您的參與"),window.location.href="index.html")})},downloadImg:function(){var e=document.getElementById("dl1"),t=document.getElementById("dl2"),a=document.getElementById("dl3"),n=document.getElementById("dl4"),o=Date.now();e.setAttribute("download","img"+o),t.setAttribute("download","img"+o+1),a.setAttribute("download","img"+o+2),n.setAttribute("download","img"+o+3),setTimeout(function(){e.click(),t.click(),a.click(),n.click()},500)},giftput:function(){var t=this;if(!t.loading){if(""==t.name)return t.popup=!0,t.popEvent="type",void(t.popPage="dataerr");if(""==t.mobile||!t.mobile.match(/^09[0-9]{8}$/))return t.popup=!0,t.popEvent="type",void(t.popPage="dataerr");if(""==t.friendName)return t.popup=!0,t.popEvent="type",void(t.popPage="dataerr");if(""==t.text)return t.popup=!0,t.popEvent="type",void(t.popPage="dataerr");if(0==t.agree)return t.popup=!0,t.popEvent="type",void(t.popPage="dataerr");t.popup=!0,t.resultLoad=!0;var e=document.getElementById("giftbox"),a=e.getContext("2d");e.width=2835,e.height=2421,a.clearRect(0,0,e.width,e.height),a.font="50px Arial";var n=new Image,o=new Image,r=new Image,i=new Image,d=new Image,p=new Image,s=new Image,u=new Promise(function(e){n.addEventListener("load",function(){e()}),n.src="./images/giftboxbg.jpg"}),m=new Promise(function(e){o.addEventListener("load",function(){e()}),o.src=t.user.userImg1}),c=new Promise(function(e){r.addEventListener("load",function(){e()}),r.src=t.user.userImg2}),g=new Promise(function(e){i.addEventListener("load",function(){e()}),i.src=t.user.userImg3}),l=new Promise(function(e){d.addEventListener("load",function(){e()}),d.src=t.keyWord.word1}),h=new Promise(function(e){p.addEventListener("load",function(){e()}),p.src=t.keyWord.word2}),w=new Promise(function(e){s.addEventListener("load",function(){e()}),s.src=t.keyWord.word3});Promise.all([u,m,c,g,l,h,w]).then(function(){a.drawImage(n,0,0,n.width,n.height,0,0,e.width,e.height),a.drawImage(o,0,0,300,300,398,1487,346,333),a.drawImage(r,0,0,300,300,923,1523,346,333),a.drawImage(i,0,0,300,300,1413,1482,346,333),a.fillText(t.serialNumber,320,385),a.rotate(-9*Math.PI/180),a.drawImage(d,0,0,d.width,d.height,240,1340,1.2*d.width,1.2*d.height),a.font="bold 50px Noto Sans TC",a.fillStyle="#f2dc24",a.textAlign="start",a.fillText("To: "+t.friendName,850,1170),a.textAlign="center",a.fillText(t.text,1100,1220),a.rotate(9*Math.PI/180),a.rotate(-1*Math.PI/180),a.drawImage(p,0,0,p.width,p.height,920,1300,1.2*p.width,1.2*p.height),a.rotate(1*Math.PI/180),a.rotate(8*Math.PI/180),a.drawImage(s,0,0,s.width,s.height,1610,1040,1.2*s.width,1.2*s.height),a.rotate(-8*Math.PI/180),t.textImg=e.toDataURL("image/jpeg",1),t.getToken().then(function(){t.grecaptcha("result").then(function(){t.saveData()})})})}},toFb:function(){var t=this;return new Promise(function(e){t.popup=!0,t.popEvent="type",t.popPage="tip",e()})},fbshare:function(){var e=this,t=e.link;window.ActiveXObject||window;return e.popupClose(),e.step=3,window.open("https://www.facebook.com/sharer/sharer.php?u="+t+"&hashtag=%23麥香曬友情"),!1},toDataURL:function(e,t){var a=new XMLHttpRequest;a.onload=function(){var e=new FileReader;e.onloadend=function(){t(e.result)},e.readAsDataURL(a.response)},a.open("GET",e),a.responseType="blob",a.send()},checkBrowser:function(){var e=this,t=new MobileDetect(window.navigator.userAgent),a=-1<navigator.userAgent.indexOf("FBAV");t.match(/android/i)?a?(e.popup=!0,e.popEvent="fbapp"):e.downloadImg():t.match(/(iphone|ipad|ipod);?/i)?(e.popup=!0,e.popEvent="type",e.popPage="ios"):e.downloadImg()}},created:function(){this.code=findGetParameter("user")},mounted:function(){var e=this;$("body").loadpage("init",{async:!0}),e.getToken().then(function(){e.getImg()})}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3VsdC5qcyJdLCJuYW1lcyI6WyJyZXN1bHRfdmlldyIsIlZ1ZSIsImVsIiwic3RlcCIsImNvZGUiLCJuYW1lIiwiZnJpZW5kTmFtZSIsImFkZHJlc3MiLCJtb2JpbGUiLCJhZ3JlZSIsInRleHRJbWciLCJzZXJpYWxOdW1iZXIiLCJzaGFyZUltZyIsInVzZXJJbWcxIiwidXNlckltZzIiLCJ1c2VySW1nMyIsIndvcmQyIiwid29yZDMiLCJnZXRJbWciLCJ2bSIsInRoaXMiLCIkIiwiYWpheCIsInVybCIsImNvbmNhdCIsImZyaWVuZG9fdXJsIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJnVG9rZW4iLCJtZXRob2QiLCJkb25lIiwicmVzIiwiZGF0YSIsInVzZXIiLCJ0b0RhdGFVUkwiLCJVcmwiLCJrZXlXb3JkIiwid29yZDEiLCJrZXl3b3JkMSIsImtleXdvcmQyIiwia2V5d29yZDMiLCJsaW5rIiwibG9hZHBhZ2UiLCJwb3N0X2RhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsInJlQ2FwdGNoYSIsInByb2Nlc3NEYXRhIiwic3VjY2VzcyIsInJlc3VsdExvYWQiLCJwb3B1cCIsInBvcEV2ZW50IiwicG9wUGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImRvd25sb2FkSW1nIiwiZGwxIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImRsMiIsImRsMyIsInRpbWUiLCJkbDQiLCJzZXRBdHRyaWJ1dGUiLCJjbGljayIsImdpZnRwdXQiLCJsb2FkaW5nIiwibW9iaWxlX3J1bGUiLCJtYXRjaCIsInRleHQiLCJnaWZ0Y2FuIiwiZ2NjIiwiZ2V0Q29udGV4dCIsIndpZHRoIiwiaGVpZ2h0IiwiY2xlYXJSZWN0IiwiSW1hZ2UiLCJ1c2VyaW1nMSIsInVzZXJpbWcyIiwicHJiZyIsInJlc29sdmUiLCJnaWZ0QmciLCJQcm9taXNlIiwicHJpbWcxIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNyYyIsInByaW1nMyIsInVzZXJpbWczIiwicHJrdzEiLCJwcmt3MyIsInByaW1nMiIsImRyYXdJbWFnZSIsInBya3cyIiwidGhlbiIsImZpbGxUZXh0IiwiZmlsbFN0eWxlIiwicm90YXRlIiwiTWF0aCIsIlBJIiwidGV4dEFsaWduIiwiZm9udCIsImdldFRva2VuIiwiZ3JlY2FwdGNoYSIsInNhdmVEYXRhIiwiZmJzaGFyZSIsIm9wZW4iLCJBY3RpdmVYT2JqZWN0IiwicG9wdXBDbG9zZSIsImZiaHRtbF91cmwiLCJ4aHIiLCJjYWxsYmFjayIsInJlYWRlciIsIlhNTEh0dHBSZXF1ZXN0Iiwib25sb2FkZW5kIiwicmVzdWx0IiwiRmlsZVJlYWRlciIsInJlYWRBc0RhdGFVUkwiLCJyZXNwb25zZSIsInJlc3BvbnNlVHlwZSIsInNlbmQiLCJjaGVja0Jyb3dzZXIiLCJtZCIsIk1vYmlsZURldGVjdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImlzRmJBcHAiLCJpbmRleE9mIiwiY3JlYXRlZCIsImZpbmRHZXRQYXJhbWV0ZXIiLCJtb3VudGVkIiwiYXN5bmMiXSwibWFwcGluZ3MiOiJhQUFBLElBQUlBLFlBQWMsSUFBSUMsSUFBSSxDQUN0QkMsR0FBSSxPQURKRixLQUFBQSxDQUNJRyxLQURrQixFQUVoQkMsS0FBQSxHQUNFQyxLQURGLEdBQ09DLFdBQUEsR0FDTEMsUUFGRixHQUdFQyxPQUhGLEdBSUZGLEtBQVUsR0FDVkMsUUFMRSxHQU1GQyxhQU5FLEdBT0VDLE9BUEYsRUFRRkMsS0FBUyxHQUNUQyxVQUFjLEVBQ2RGLEtBQU8sQ0FWTEcsU0FBQSxHQVlNQyxTQVpOLEdBYUlDLFNBQUEsR0FDRkYsU0FERSxJQUdGRSxRQUFVLENBQ1ZDLE1BQVUsR0FqQlpDLE1BQUEsR0FtQktDLE1BQUUsS0FHTEEsUUFBTyxDQUhGQyxPQUdFLFdBeEJPLElBQUFDLEVBQUFDLEtBMkJiLE9BQUFDLEVBQUFDLEtBQUEsQ0FBQUMsSUFBQSxHQUFBQyxPQUFBQyxZQUFBLG9CQUFBRCxPQUNJTCxFQUFBZixNQUNJc0IsUUFBVCxDQUNjQyxjQUFBLFVBQUFSLEVBQUFT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SUFGSkYsRUFBTSxJQUFJRyxlQUdWRCxFQUFPRSxPQUFQLFdBQ0lILElBQVNDLEVBQU9HLElBQWhCQyxXQURKSixFQUFBRSxVQUFBLFdBQ0lILEVBQVNDLEVBQU9HLFNBSHhCSCxFQUFBSyxjQUFBUCxFQUFBUSxXQU9JWixFQUFLQSxLQUFULE1BQUFuRixHQUNJZ0csRUFBQUEsYUFBSixPQUNJQyxFQUFKQSxRQUVKQyxhQTVRVyxXQTZRRCxJQUFHdEcsRUFBVEMsS0FFU3NHLEVBQUlDLElBQUFBLGFBQW1CdEUsT0FBQ3VFLFVBQVVDLFdBRXZDQyxHQUFrQyxFQUQ5QkYsVUFBVUMsVUFDRkUsUUFBRixRQUNYTCxFQUFHckQsTUFBTSxZQUFBeUQsR0FDUjNHLEVBQVkrQixPQUFBLEVBQ1IvQixFQUFXZ0MsU0FBWCxTQUVHaEMsRUFBQXFDLGNBRU5rRSxFQUFBckQsTUFBQSwwQkFDRWxELEVBQUsrQixPQUFPLEVBQ2YvQixFQUFXZ0MsU0FBWCxPQUNHQSxFQUFIQyxRQUFBLE9BRUdqQyxFQUFBcUMsZ0JBclRPd0UsUUFBQSxXQTBUYjVHLEtBQ0NoQixLQUFONkgsaUJBQUEsU0EzVGtCQyxRQUFBLFdBOFR0QkEsSUFBUy9HLEVBQUFDLEtBQ0RELEVBQUUsUUFBTnVCLFNBQUEsT0FBQSxDQUFBeUYsT0FBQSxJQUNFaEgsRUFBQW1GLFdBQUZSLEtBQW1CLFdBQWEzRSxFQUFHRCIsImZpbGUiOiJyZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcmVzdWx0X3ZpZXcgPSBuZXcgVnVlKHtcclxuICAgIGVsOiBcIiNhcHBcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBzdGVwOiAyLCAvLzIsM1xyXG4gICAgICAgIGNvZGU6XCJcIixcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIGZyaWVuZE5hbWU6IFwiXCIsXHJcbiAgICAgICAgYWRkcmVzczogXCJcIixcclxuICAgICAgICBtb2JpbGU6IFwiXCIsXHJcbiAgICAgICAgdGV4dDogXCJcIixcclxuICAgICAgICB0ZXh0SW1nOiBcIlwiLFxyXG4gICAgICAgIHNlcmlhbE51bWJlcjogXCJcIixcclxuICAgICAgICBhZ3JlZTogZmFsc2UsXHJcbiAgICAgICAgbGluazogXCJcIixcclxuICAgICAgICBzYXZlZGF0YTogZmFsc2UsXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgICBzaGFyZUltZzogXCJcIixcclxuICAgICAgICAgICAgdXNlckltZzE6IFwiXCIsXHJcbiAgICAgICAgICAgIHVzZXJJbWcyOiBcIlwiLFxyXG4gICAgICAgICAgICB1c2VySW1nMzogXCJcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGtleVdvcmQ6IHtcclxuICAgICAgICAgICAgd29yZDE6IFwiXCIsXHJcbiAgICAgICAgICAgIHdvcmQyOiBcIlwiLFxyXG4gICAgICAgICAgICB3b3JkMzogXCJcIlxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIGdldEltZygpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGAke2ZyaWVuZG9fdXJsfU1pbmVTaGluZS9pbWFnZS8ke3ZtLmNvZGV9YCxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIrIHZtLmdUb2tlbixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldEltZzpcIixyZXMpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2VyaWFsTnVtYmVyID0gcmVzLmRhdGEuc2VyaWFsTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgdm0udXNlci5zaGFyZUltZyA9IHJlcy5kYXRhLnNoYXJlSW1nO1xyXG4gICAgICAgICAgICAgICAgdm0udG9EYXRhVVJMKHJlcy5kYXRhLnVzZXJJbWcxLGZ1bmN0aW9uKFVybCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlci51c2VySW1nMSA9IFVybDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0udG9EYXRhVVJMKHJlcy5kYXRhLnVzZXJJbWcyLGZ1bmN0aW9uKFVybCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlci51c2VySW1nMiA9IFVybDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0udG9EYXRhVVJMKHJlcy5kYXRhLnVzZXJJbWczLGZ1bmN0aW9uKFVybCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlci51c2VySW1nMyA9IFVybDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0udG9EYXRhVVJMKHJlcy5kYXRhLnNoYXJlSW1nLGZ1bmN0aW9uKFVybCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlci5zaGFyZUltZyA9IFVybDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0udXNlci51c2VySW1nMSA9IHJlcy5kYXRhLnVzZXJJbWcxO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0udXNlci51c2VySW1nMiA9IHJlcy5kYXRhLnVzZXJJbWcyO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0udXNlci51c2VySW1nMyA9IHJlcy5kYXRhLnVzZXJJbWczO1xyXG4gICAgICAgICAgICAgICAgdm0ua2V5V29yZC53b3JkMSA9IHJlcy5kYXRhLmtleXdvcmQxO1xyXG4gICAgICAgICAgICAgICAgdm0ua2V5V29yZC53b3JkMiA9IHJlcy5kYXRhLmtleXdvcmQyO1xyXG4gICAgICAgICAgICAgICAgdm0ua2V5V29yZC53b3JkMyA9IHJlcy5kYXRhLmtleXdvcmQzO1xyXG4gICAgICAgICAgICAgICAgdm0ubGluayA9IHJlcy5kYXRhLmxpbms7XHJcbiAgICAgICAgICAgICAgICB2bS5zYXZlZGF0YSA9IHJlcy5kYXRhLnNhdmVEYXRhO1xyXG4gICAgICAgICAgICAgICAgJChcImJvZHlcIikubG9hZHBhZ2UoXCJjbG9zZVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYXZlRGF0YSgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHBvc3RfZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBwb3N0X2RhdGEuYXBwZW5kKFwiY29kZVwiLHZtLmNvZGUpO1xyXG4gICAgICAgICAgICBwb3N0X2RhdGEuYXBwZW5kKFwibmFtZVwiLHZtLm5hbWUpO1xyXG4gICAgICAgICAgICBwb3N0X2RhdGEuYXBwZW5kKFwiZnJpZW5kTmFtZVwiLHZtLmZyaWVuZE5hbWUpO1xyXG4gICAgICAgICAgICBwb3N0X2RhdGEuYXBwZW5kKFwiYWRkcmVzc1wiLHZtLmFkZHJlc3MpO1xyXG4gICAgICAgICAgICBwb3N0X2RhdGEuYXBwZW5kKFwibW9iaWxlXCIsdm0ubW9iaWxlKTtcclxuICAgICAgICAgICAgcG9zdF9kYXRhLmFwcGVuZChcInRleHRJbWdcIix2bS50ZXh0SW1nKTtcclxuICAgICAgICAgICAgcG9zdF9kYXRhLmFwcGVuZChcInNlcmlhbE51bWJlclwiLHZtLnNlcmlhbE51bWJlcik7XHJcbiAgICAgICAgICAgIHBvc3RfZGF0YS5hcHBlbmQoXCJyZUNhcHRjaGFcIix2bS5yZUNhcHRjaGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogYCR7ZnJpZW5kb191cmx9TWluZVNoaW5lL2RhdGFgLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIisgdm0uZ1Rva2VuLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHBvc3RfZGF0YSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBkYXRhVHlwZTogXCJqc29uXCJcclxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2F2ZURhdGE6XCIscmVzKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVzdWx0TG9hZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3BFdmVudCA9IFwidHlwZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSBcInN1Y1wiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuaCqOW3suWhq+mBjuihqOWWriDmhJ/orJ3mgqjnmoTlj4PoiIdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImluZGV4Lmh0bWxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkb3dubG9hZEltZygpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGRsMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGwxXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGwyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkbDJcIik7XHJcbiAgICAgICAgICAgIHZhciBkbDMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRsM1wiKTtcclxuICAgICAgICAgICAgdmFyIGRsNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGw0XCIpO1xyXG4gICAgICAgICAgICB2YXIgdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgIGRsMS5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLFwiaW1nXCIrdGltZSk7XHJcbiAgICAgICAgICAgIGRsMi5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLFwiaW1nXCIrdGltZSsxKTtcclxuICAgICAgICAgICAgZGwzLnNldEF0dHJpYnV0ZShcImRvd25sb2FkXCIsXCJpbWdcIit0aW1lKzIpO1xyXG4gICAgICAgICAgICBkbDQuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIixcImltZ1wiK3RpbWUrMyk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGwxLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICBkbDIuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIGRsMy5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgZGw0LmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnaWZ0cHV0KCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAvL2NoZWNrIOihqOWWrlxyXG4gICAgICAgICAgICBpZighdm0ubG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vYmlsZV9ydWxlID0gL14wOVswLTldezh9JC87XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hfcnVsZSA9IC9eW1xcdTRlMDAtXFx1OWZhNV17MSwxMH0kLzsgLy/pmZDlrprkuK3mlodcclxuICAgICAgICAgICAgICAgIGlmKHZtLm5hbWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3BFdmVudCA9IFwidHlwZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSBcImRhdGFlcnJcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHZtLm1vYmlsZSA9PSBcIlwiIHx8ICF2bS5tb2JpbGUubWF0Y2gobW9iaWxlX3J1bGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wdXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcEV2ZW50ID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wUGFnZSA9IFwiZGF0YWVyclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodm0uZnJpZW5kTmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wdXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcEV2ZW50ID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wUGFnZSA9IFwiZGF0YWVyclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodm0udGV4dCA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wdXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnBvcEV2ZW50ID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wUGFnZSA9IFwiZGF0YWVyclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodm0uYWdyZWUgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wRXZlbnQgPSBcInR5cGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3BQYWdlID0gXCJkYXRhZXJyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2bS5wb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZtLnJlc3VsdExvYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gJChcImJvZHlcIikubG9hZHBhZ2UoXCJpbml0XCIse2FzeW5jIDogdHJ1ZX0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY2FudmFzIGdpZnRib3hcclxuICAgICAgICAgICAgICAgIHZhciBnaWZ0Y2FuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnaWZ0Ym94XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdjYyA9IGdpZnRjYW4uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZ2lmdGNhbi53aWR0aCA9IDI4MzU7XHJcbiAgICAgICAgICAgICAgICBnaWZ0Y2FuLmhlaWdodCA9IDI0MjE7XHJcbiAgICAgICAgICAgICAgICAvLyBnaWZ0Y2FuLndpZHRoID0gODM1O1xyXG4gICAgICAgICAgICAgICAgLy8gZ2lmdGNhbi5oZWlnaHQgPSA0MjE7XHJcbiAgICAgICAgICAgICAgICBnY2MuY2xlYXJSZWN0KDAsMCxnaWZ0Y2FuLndpZHRoLGdpZnRjYW4uaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGdjYy5mb250ID0gXCI1MHB4IEFyaWFsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdpZnRCZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJpbWcxID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcmltZzIgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIHZhciB1c2VyaW1nMyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXdvcmQxID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5d29yZDIgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIHZhciBrZXl3b3JkMyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmJnID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2lmdEJnLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBnaWZ0Qmcuc3JjPVwiLi9pbWFnZXMvZ2lmdGJveGJnLmpwZ1wiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHByaW1nMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJpbWcxLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyaW1nMS5zcmM9IHZtLnVzZXIudXNlckltZzE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJpbWcyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcmltZzIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJpbWcyLnNyYz0gdm0udXNlci51c2VySW1nMjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmltZzMgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyaW1nMy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcmltZzMuc3JjPSB2bS51c2VyLnVzZXJJbWczXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJrdzEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcclxuICAgICAgICAgICAgICAgICAgICBrZXl3b3JkMS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5d29yZDEuc3JjPSB2bS5rZXlXb3JkLndvcmQxO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBya3cyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5d29yZDIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmQyLnNyYz0gdm0ua2V5V29yZC53b3JkMjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwcmt3MyA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmQzLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBrZXl3b3JkMy5zcmM9IHZtLmtleVdvcmQud29yZDM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChbcHJiZyxwcmltZzEscHJpbWcyLHByaW1nMyxwcmt3MSxwcmt3Mixwcmt3M10pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZHJhd0ltYWdlKGdpZnRCZywwLDAsZ2lmdEJnLndpZHRoLGdpZnRCZy5oZWlnaHQsMCwwLGdpZnRjYW4ud2lkdGgsZ2lmdGNhbi5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdjYy5kcmF3SW1hZ2UodXNlcmltZzEsMCwwLDMwMCwzMDAsMzk4LDE0ODcsMzQ2LDMzMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2NjLmRyYXdJbWFnZSh1c2VyaW1nMiwwLDAsMzAwLDMwMCw5MjMsMTUyMywzNDYsMzMzKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZHJhd0ltYWdlKHVzZXJpbWczLDAsMCwzMDAsMzAwLDE0MTMsMTQ4MiwzNDYsMzMzKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZmlsbFRleHQodm0uc2VyaWFsTnVtYmVyLDMyMCwzODUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdjYy5yb3RhdGUoLTkgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZHJhd0ltYWdlKGtleXdvcmQxLDAsMCxrZXl3b3JkMS53aWR0aCxrZXl3b3JkMS5oZWlnaHQsMjQwLDEzNDAsa2V5d29yZDEud2lkdGgqMS4yLGtleXdvcmQxLmhlaWdodCoxLjIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdjYy5mb250ID0gXCJib2xkIDUwcHggTm90byBTYW5zIFRDXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2NjLmZpbGxTdHlsZSA9IFwiI2YyZGMyNFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGdjYy50ZXh0QWxpZ24gPSBcInN0YXJ0XCJcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZmlsbFRleHQoXCJUbzogXCIrIHZtLmZyaWVuZE5hbWUsODUwLDExNzApO1xyXG4gICAgICAgICAgICAgICAgICAgIGdjYy50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgZ2NjLmZpbGxUZXh0KHZtLnRleHQsMTEwMCwxMjIwKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2Mucm90YXRlKDkgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2Mucm90YXRlKC0xICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2NjLmRyYXdJbWFnZShrZXl3b3JkMiwwLDAsa2V5d29yZDIud2lkdGgsa2V5d29yZDIuaGVpZ2h0LDkyMCwxMzAwLGtleXdvcmQyLndpZHRoKjEuMixrZXl3b3JkMi5oZWlnaHQqMS4yKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2Mucm90YXRlKDEgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2Mucm90YXRlKDggKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2MuZHJhd0ltYWdlKGtleXdvcmQzLDAsMCxrZXl3b3JkMy53aWR0aCxrZXl3b3JkMy5oZWlnaHQsMTYxMCwxMDQwLGtleXdvcmQzLndpZHRoKjEuMixrZXl3b3JkMy5oZWlnaHQqMS4yKTtcclxuICAgICAgICAgICAgICAgICAgICBnY2Mucm90YXRlKC04ICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udGV4dEltZyA9IGdpZnRjYW4udG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5nZXRUb2tlbigpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZ3JlY2FwdGNoYShcInJlc3VsdFwiKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zYXZlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvRmIoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcclxuICAgICAgICAgICAgICAgIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZtLnBvcEV2ZW50ID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5wb3BQYWdlID0gXCJ0aXBcIjtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZic2hhcmUoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBmYmh0bWxfdXJsPSB2bS5saW5rO1xyXG4gICAgICAgICAgICB2YXIgaXNJRT13aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3c7XHJcbiAgICAgICAgICAgIHZtLnBvcHVwQ2xvc2UoKTtcclxuICAgICAgICAgICAgdm0uc3RlcCA9IDM7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT0nK2ZiaHRtbF91cmwrJyZoYXNodGFnPSUyM+m6pemmmeabrOWPi+aDhScpO3JldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgLy8gaWYoaXNJRSkge1xyXG4gICAgICAgICAgICAvLyAgICAgd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScrZmJodG1sX3VybCk7cmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PScrZmJodG1sX3VybCsnJmhhc2h0YWc9JTIz6bql6aaZ5pus5Y+L5oOFJyk7cmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b0RhdGFVUkwodXJsLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja0Jyb3dzZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBkZXZpY2UgPSB7fTtcclxuICAgICAgICAgICAgdmFyIG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgICAgIHZhciB1ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgICAgICAgdmFyIGlzRmJBcHAgPSB1LmluZGV4T2YoXCJGQkFWXCIpID4gLTE7IC8vIEZCIEFwcCDlhaflu7rngI/opr3lmahcclxuICAgICAgICAgICAgaWYobWQubWF0Y2goL2FuZHJvaWQvaSkpIHtcclxuICAgICAgICAgICAgICAgIGlmKGlzRmJBcHApIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9wRXZlbnQgPSBcImZiYXBwXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmRvd25sb2FkSW1nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihtZC5tYXRjaCgvKGlwaG9uZXxpcGFkfGlwb2QpOz8vaSkpIHtcclxuICAgICAgICAgICAgICAgIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZtLnBvcEV2ZW50ID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5wb3BQYWdlID0gXCJpb3NcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLmRvd25sb2FkSW1nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5jb2RlID0gZmluZEdldFBhcmFtZXRlcihcInVzZXJcIik7XHJcbiAgICB9LFxyXG4gICAgbW91bnRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAkKFwiYm9keVwiKS5sb2FkcGFnZShcImluaXRcIix7YXN5bmMgOiB0cnVlfSk7XHJcbiAgICAgICAgdm0uZ2V0VG9rZW4oKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZtLmdldEltZygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gdm0uY2hlY2tCcm93c2VyKCk7XHJcbiAgICB9XHJcbn0pIl19