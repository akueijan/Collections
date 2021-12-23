"use strict";Vue.component("lottery-fillin",{template:"#lotteryBackfill",data:function(){return{type:"",mobile:"",userid:"",awardPaper:[{awardName:"現金 NT.99,999",path:"images/《能量不斷電終極大獎 現金99,999》中獎回覆函.doc"},{awardName:"Nintendo Switch",path:"images/《補充能量獎週週抽 Nintendo Switch》中獎回覆函.doc"},{awardName:"SONY PS4",path:"images/《百大鐵人排名獎 SONY PS4》中獎回覆函.doc"}],paper:null,fblogin:!1,fbData:{fbToken:"",fbId:"",fbName:"",fbPic:""},invNumber:"",awardItem:"",name:"",address:"",IdcardFront:null,IdcardBack:null,Bankbook:null,CertificatePhoto:null,agree:!1,imageShow:{IdcardFront:null,IdcardBack:null,Bankbook:null,CertificatePhoto:null},captcha:null}},watch:{IdcardFront:function(){""==!this.IdcardFrontShow&&(document.querySelector("#frontpre p").style.display="none",document.querySelector("#frontpre img").style.opacity="1")},IdcardBack:function(){""==!this.IdcardBackShow&&(document.querySelector("#backpre p").style.display="none",document.querySelector("#backpre img").style.opacity="1")},Bankbook:function(){""==!this.BankbookShow&&(document.querySelector("#bankpre p").style.display="none",document.querySelector("#bankpre img").style.opacity="1")},CertificatePhotoShow:function(){""==!this.CertificatePhotoShow&&(document.querySelector("#certificatepre p").style.display="none",document.querySelector("#certificatepre img").style.opacity="1")}},methods:{readpoto:function(e){var t=this,a=e.target.files.item(0),n=e.target.id,e=new FileReader;e.addEventListener("load",function(e){"front"==n&&(t.imageShow.IdcardFront=e.target.result,t.IdcardFront=a);"back"==n&&(t.imageShow.IdcardBack=e.target.result,t.IdcardBack=a);"bank"==n&&(t.imageShow.Bankbook=e.target.result,t.Bankbook=a);"certificate"==n&&(t.imageShow.CertificatePhoto=e.target.result,t.CertificatePhoto=a)}),e.readAsDataURL(a),console.log(a)},checkData:function(){var t=this;return new Promise(function(e){if(t.name)if(t.address){if("FB"==t.type){if(!t.fbData.fbId)return void alert("請先登入FB")}else if("Invoice"==t.type&&!t.CertificatePhoto)return void alert("請上傳發票正本電子檔");t.agree?(t.loading=!0,e()):alert("請勾選我已詳閱")}else alert("請填入地址");else alert("請填入收件人")})},postback:function(){var e=this;e.checkData().then(function(){e.grecaptcha("fillin").then(function(){e.postRecipientinfo()})})},postRecipientinfo:function(){var t=this,e=new FormData(document.getElementById("fillinform"));e.append("name",t.name),e.append("address",t.address),e.append("idcardFront",t.IdcardFront),e.append("idcardBack",t.IdcardBack),e.append("bankbook",t.Bankbook),e.append("certificate",t.CertificatePhoto),e.append("captcha",t.captcha),e.append("code",t.userid),e.append("referenceInfo",t.invNumber),e.append("campaignId",98),t.projApi.post("Kombucha2021/recipientinfo",e).then(function(e){alert("資料已送出，感謝您的參與！"),window.location.href="./index.html",t.loading=!1})},fbLogin:function(){var t=this;FB.login(function(e){"connected"===e.status&&(t.fbData.fbToken=e.authResponse.accessToken,t.fbData.fbId=e.authResponse.userID,FB.api("/me","GET",{fields:"id,name,picture"},function(e){t.fbData.fbName=e.name,t.fbData.fbPic="http://graph.facebook.com/"+e.id+"/picture?width=140&height=140",t.fblogin=!0}))})},getRecipientinfo:function(){var a=this;return new Promise(function(t){a.projApi.get("Kombucha2021/recipientinfo/".concat(a.userid)).then(function(e){e&&200!==e.code||(a.mobile=e.data.mobile,a.invNumber=e.data.referenceInfo,a.awardItem=e.data.awardName,a.type=e.data.referenceType,t())}).catch(function(e){console.log(e.response.data.message),alert("未找到符合的資料或已填寫過"),window.location.href="index.html"})})},checkPaper:function(){var t=this;t.awardPaper.forEach(function(e){if(t.awardItem==e.awardName)return t.paper=e})}},created:function(){this.userid=findGetParameter("user")},mounted:function(){var e=this;e.getRecipientinfo().then(function(){e.checkPaper()});var t,a,n,o;window.fbAsyncInit=function(){FB.init({appId:"3705614096208882",status:!0,cookie:!0,xfbml:!0,version:"v12.0"})},t=document,a="script",n="facebook-jssdk",o=t.getElementsByTagName(a)[0],t.getElementById(n)||((a=t.createElement(a)).id=n,a.src="https://connect.facebook.net/en_US/sdk.js",o.parentNode.insertBefore(a,o))}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudC9sb3R0ZXJ5RmlsbGluLmpzIl0sIm5hbWVzIjpbIlZ1ZSIsImNvbXBvbmVudCIsInRlbXBsYXRlIiwidHlwZSIsIm1vYmlsZSIsInVzZXJpZCIsImF3YXJkUGFwZXIiLCJhd2FyZE5hbWUiLCJwYXRoIiwicGFwZXIiLCJmYmxvZ2luIiwiZmJUb2tlbiIsImZiSWQiLCJmYk5hbWUiLCJmYlBpYyIsImludk51bWJlciIsImF3YXJkSXRlbSIsImFkZHJlc3MiLCJJZGNhcmRGcm9udCIsIkJhbmtib29rIiwiSWRjYXJkQmFjayIsImFncmVlIiwiQ2VydGlmaWNhdGVQaG90byIsImNhcHRjaGEiLCJ3YXRjaCIsInRoaXMiLCJJZGNhcmRGcm9udFNob3ciLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJzdHlsZSIsImRpc3BsYXkiLCJvcGFjaXR5IiwiSWRjYXJkQmFja1Nob3ciLCJDZXJ0aWZpY2F0ZVBob3RvU2hvdyIsIkJhbmtib29rU2hvdyIsInJlYWRwb3RvIiwiZSIsInZtIiwiaXRlbSIsImlkIiwicmVhZGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImltYWdlU2hvdyIsInRhcmdldCIsInJlc3VsdCIsImZpbGUiLCJGaWxlUmVhZGVyIiwicmVhZEFzRGF0YVVSTCIsImltZ0xvYWQiLCJjb25zb2xlIiwibG9nIiwiY2hlY2tEYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJmYkRhdGEiLCJhbGVydCIsImxvYWRpbmciLCJwb3N0YmFjayIsImdyZWNhcHRjaGEiLCJ0aGVuIiwicG9zdFJlY2lwaWVudGluZm8iLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiZ2V0RWxlbWVudEJ5SWQiLCJhcHBlbmQiLCJuYW1lIiwicmVzIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwic3RhdHVzIiwiYWNjZXNzVG9rZW4iLCJ1c2VySUQiLCJhcGkiLCJmaWVsZHMiLCJhcGlyZXMiLCJnZXRSZWNpcGllbnRpbmZvIiwicHJvakFwaSIsImNvbmNhdCIsImRhdGEiLCJyZWZlcmVuY2VJbmZvIiwicmVmZXJlbmNlVHlwZSIsImdldCIsImVyciIsInJlc3BvbnNlIiwibWVzc2FnZSIsImNvZGUiLCJmb3JFYWNoIiwiY3JlYXRlZCIsIm1vdW50ZWQiLCJjaGVja1BhcGVyIiwiZCIsInMiLCJmYkFwcElkIiwiZmJBc3luY0luaXQiLCJGQiIsImluaXQiLCJhcHBJZCIsInZlcnNpb24iLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImNvb2tpZSIsImNyZWF0ZUVsZW1lbnQiLCJ4ZmJtbCIsInNyYyIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJqcyIsImZqcyJdLCJtYXBwaW5ncyI6ImFBQUFBLElBQUlDLFVBQVUsaUJBQWtCLENBQzVCQyxTQUFVLG1CQURWRCxLQUFBQSxXQUNBQyxNQUFVLENBQ0pDLEtBQUEsR0FDS0MsT0FBQSxHQUNHQyxPQURILEdBQ09DLFdBQUEsQ0FEUCxDQUFBQyxVQUFBLGVBS0NDLEtBQUEsd0NBQ0ksQ0FDUUQsVUFBQSxrQkFDVEMsS0FBQSw4Q0FDQyxDQUNRRCxVQUFBLFdBQ1RDLEtBQUEsdUNBWEpDLE1BQUEsS0FnQkVDLFNBaEJGLEVBaUJIQSxPQWpCRyxDQWtCS0MsUUFBQSxHQUNHQyxLQURILEdBQUFDLE9BQUEsR0FHSUMsTUFISixJQWxCTEMsVUFBQSxHQXdCSEEsVUF4QkcsR0F5QkhDLEtBQVcsR0FDTEMsUUExQkgsR0EyQkhBLFlBM0JHLEtBNEJIQyxXQTVCRyxLQTRCZ0JDLFNBQUEsS0FDbkJDLGlCQTdCRyxLQTZCZUMsT0FBQSxFQUNsQkYsVUE5QkcsQ0E4QmFELFlBQUEsS0FDaEJJLFdBL0JHLEtBK0JxQkgsU0FBQSxLQUNqQkcsaUJBaENKLE1Ba0NDQyxRQUFBLE9BR0FDLE1BQUEsQ0FyQ0ROLFlBQUEsV0FBUCxLQXVDYU8sS0F2Q2JDLGtCQUh3QkMsU0FBQUMsY0FBQSxlQUFBQyxNQUFBQyxRQUFBLE9BNkNyQkgsU0FBQUMsY0FBQSxpQkFBQUMsTUFBQUUsUUFBQSxNQVFIWCxXQUFZLFdBSm1CLEtBRG5CTSxLQUNL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aEIzQixRQUFhLEVBUmxCTSxRQUFtQmpCLEVBQ2YrQixPQUFILEVBREpRLFFBQUEsV0FNWVAsRUFBUmhFLFNBQVFpRSxFQUFSLFNBQVFyRCxFQUFSLGlCQUNpQnNELEVBRFRGLEVBQUFRLHFCQUFBUCxHQUFBLEdBRVNELEVBQUE1QixlQUZUeEIsTUFHSjZELEVBQWFULEVBQUFVLGNBSFRULElBQUFyRCxHQUFBQSxFQUlKK0QsRUFBYUMsSUFKVCw0Q0FLSkwsRUFBT00sV0FBTUMsYUFBQUMsRUFBQUMiLCJmaWxlIjoiY29tcG9uZW50L2xvdHRlcnlGaWxsaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJWdWUuY29tcG9uZW50KCdsb3R0ZXJ5LWZpbGxpbicsIHtcclxuICAgIHRlbXBsYXRlOiBcIiNsb3R0ZXJ5QmFja2ZpbGxcIixcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiBcIlwiLCAvLyBJbnZvaWNlXCIgb3IgRkJcclxuICAgICAgICAgICAgbW9iaWxlOiBcIlwiLFxyXG4gICAgICAgICAgICB1c2VyaWQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGF3YXJkUGFwZXI6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF3YXJkTmFtZVwiOiBcIuePvumHkSBOVC45OSw5OTlcIixcclxuICAgICAgICAgICAgICAgICAgICBcInBhdGhcIjogXCJpbWFnZXMv44CK6IO96YeP5LiN5pa36Zu757WC5qW15aSn542OIOePvumHkTk5LDk5OeOAi+S4reeNjuWbnuimhuWHvS5kb2NcIlxyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXdhcmROYW1lXCI6IFwiTmludGVuZG8gU3dpdGNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiaW1hZ2VzL+OAiuijnOWFheiDvemHj+eNjumAsemAseaKvSBOaW50ZW5kbyBTd2l0Y2jjgIvkuK3njY7lm57opoblh70uZG9jXCJcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF3YXJkTmFtZVwiOiBcIlNPTlkgUFM0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiaW1hZ2VzL+OAiueZvuWkp+mQteS6uuaOkuWQjeeNjiBTT05ZIFBTNOOAi+S4reeNjuWbnuimhuWHvS5kb2NcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcGFwZXI6IG51bGwsXHJcbiAgICAgICAgICAgIGZibG9naW46IGZhbHNlLFxyXG4gICAgICAgICAgICBmYkRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGZiVG9rZW46IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBmYklkOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgZmJOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgZmJQaWM6IFwiXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGludk51bWJlcjogXCJcIixcclxuICAgICAgICAgICAgYXdhcmRJdGVtOiBcIlwiLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBcIlwiLFxyXG4gICAgICAgICAgICBJZGNhcmRGcm9udDogbnVsbCwgLy/mraPpnaJcclxuICAgICAgICAgICAgSWRjYXJkQmFjazogbnVsbCwgLy/lj43pnaJcclxuICAgICAgICAgICAgQmFua2Jvb2s6IG51bGwsIC8v5a2Y5pG6XHJcbiAgICAgICAgICAgIENlcnRpZmljYXRlUGhvdG86IG51bGwsIC8v55m856WoXHJcbiAgICAgICAgICAgIGFncmVlOiBmYWxzZSxcclxuICAgICAgICAgICAgaW1hZ2VTaG93OiB7XHJcbiAgICAgICAgICAgICAgICBcIklkY2FyZEZyb250XCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIklkY2FyZEJhY2tcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwiQmFua2Jvb2tcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwiQ2VydGlmaWNhdGVQaG90b1wiOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhcHRjaGE6IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgICBJZGNhcmRGcm9udDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoIXZtLklkY2FyZEZyb250U2hvdyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnJvbnRwcmUgcCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnJvbnRwcmUgaW1nJykuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgSWRjYXJkQmFjazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoIXZtLklkY2FyZEJhY2tTaG93ID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiYWNrcHJlIHAnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhY2twcmUgaW1nJykuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQmFua2Jvb2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKCF2bS5CYW5rYm9va1Nob3cgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JhbmtwcmUgcCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmFua3ByZSBpbWcnKS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBDZXJ0aWZpY2F0ZVBob3RvU2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoIXZtLkNlcnRpZmljYXRlUGhvdG9TaG93ID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjZXJ0aWZpY2F0ZXByZSBwJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjZXJ0aWZpY2F0ZXByZSBpbWcnKS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgcmVhZHBvdG8oZSkgeyAvL2lucHV0IGZpbGUgb25jaGFuZ2UgZXZlbnRcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBlLnRhcmdldC5maWxlcy5pdGVtKDApO1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW1nTG9hZCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlKVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW1nTG9hZChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPT0gXCJmcm9udFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaW1hZ2VTaG93LklkY2FyZEZyb250ID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLklkY2FyZEZyb250ID0gZmlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBcImJhY2tcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmltYWdlU2hvdy5JZGNhcmRCYWNrID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLklkY2FyZEJhY2sgPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGlkID09IFwiYmFua1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaW1hZ2VTaG93LkJhbmtib29rID0gZS50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLkJhbmtib29rID0gZmlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBcImNlcnRpZmljYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pbWFnZVNob3cuQ2VydGlmaWNhdGVQaG90byA9IGUudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB2bS5DZXJ0aWZpY2F0ZVBob3RvID0gZmlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hlY2tEYXRhKCkge1xyXG4gICAgICAgICAgICBjb25zdCB2bSA9IHRoaXNcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoIXZtLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuiri+Whq+WFpeaUtuS7tuS6ulwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoIXZtLmFkZHJlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuiri+Whq+WFpeWcsOWdgFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHZtLnR5cGUgPT0gXCJGQlwiKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdm0uZmJEYXRhLmZiSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLoq4vlhYjnmbvlhaVGQlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHZtLnR5cGUgPT0gXCJJbnZvaWNlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZtLkNlcnRpZmljYXRlUGhvdG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLoq4vkuIrlgrPnmbznpajmraPmnKzpm7vlrZDmqpRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF2bS5hZ3JlZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi6KuL5Yu+6YG45oiR5bey6Kmz6ZaxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWVcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGJhY2soKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZtID0gdGhpc1xyXG4gICAgICAgICAgICB2bS5jaGVja0RhdGEoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZtLmdyZWNhcHRjaGEoXCJmaWxsaW5cIikudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucG9zdFJlY2lwaWVudGluZm8oKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RSZWNpcGllbnRpbmZvKCkge1xyXG4gICAgICAgICAgICBjb25zdCB2bSA9IHRoaXNcclxuICAgICAgICAgICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxsaW5mb3JtJykpXHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJuYW1lXCIsIHZtLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiYWRkcmVzc1wiLCB2bS5hZGRyZXNzKTtcclxuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImlkY2FyZEZyb250XCIsIHZtLklkY2FyZEZyb250KTtcclxuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImlkY2FyZEJhY2tcIiwgdm0uSWRjYXJkQmFjayk7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJiYW5rYm9va1wiLCB2bS5CYW5rYm9vayk7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJjZXJ0aWZpY2F0ZVwiLCB2bS5DZXJ0aWZpY2F0ZVBob3RvKTtcclxuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImNhcHRjaGFcIiwgdm0uY2FwdGNoYSk7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJjb2RlXCIsIHZtLnVzZXJpZCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJyZWZlcmVuY2VJbmZvXCIsIHZtLmludk51bWJlcik7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJjYW1wYWlnbklkXCIsIDk4KTtcclxuICAgICAgICAgICAgdm0ucHJvakFwaS5wb3N0KFwiS29tYnVjaGEyMDIxL3JlY2lwaWVudGluZm9cIiwgZm9ybURhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi6LOH5paZ5bey6YCB5Ye677yM5oSf6Kyd5oKo55qE5Y+D6IiH77yBXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmJMb2dpbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBGQi5sb2dpbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5mYkRhdGEuZmJUb2tlbiA9IHJlcy5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZmJEYXRhLmZiSWQgPSByZXMuYXV0aFJlc3BvbnNlLnVzZXJJRDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+W5b6XZmLlgIvkurros4fmlplcclxuICAgICAgICAgICAgICAgICAgICBGQi5hcGkoJy9tZScsICdHRVQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZpZWxkc1wiOiBcImlkLG5hbWUscGljdHVyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhcGlyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFwaXJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5mYkRhdGEuZmJOYW1lID0gYXBpcmVzLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2bS5mYkRhdGEuZmJQaWMgPSBhcGlyZXMucGljdHVyZS5kYXRhLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmZiRGF0YS5mYlBpYyA9ICdodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLycgKyBhcGlyZXMuaWQgKyAnL3BpY3R1cmU/d2lkdGg9MTQwJmhlaWdodD0xNDAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uZmJsb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UmVjaXBpZW50aW5mbygpIHtcclxuICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9qQXBpLmdldChgS29tYnVjaGEyMDIxL3JlY2lwaWVudGluZm8vJHt2bS51c2VyaWR9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzICYmIHJlcy5jb2RlICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoJ+mpl+itieeivOW3suWkseaViCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ubW9iaWxlID0gcmVzLmRhdGEubW9iaWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5pbnZOdW1iZXIgPSByZXMuZGF0YS5yZWZlcmVuY2VJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5hd2FyZEl0ZW0gPSByZXMuZGF0YS5hd2FyZE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnR5cGUgPSByZXMuZGF0YS5yZWZlcmVuY2VUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLnJlc3BvbnNlLmRhdGEubWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5pyq5om+5Yiw56ym5ZCI55qE6LOH5paZ5oiW5bey5aGr5a+r6YGOJylcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdpbmRleC5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoZWNrUGFwZXI6IGZ1bmN0aW9uICgpIHsgXHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZtLmF3YXJkUGFwZXIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyBcclxuICAgICAgICAgICAgICAgIGlmICh2bS5hd2FyZEl0ZW0gPT0gaXRlbS5hd2FyZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ucGFwZXIgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXNcclxuXHJcbiAgICAgICAgdm0udXNlcmlkID0gZmluZEdldFBhcmFtZXRlcigndXNlcicpXHJcbiAgICB9LFxyXG4gICAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAvLyB2bS5yZWFkcGljKCk7XHJcbiAgICAgICAgLy8gbG9hZHBhZ2UoJ2luaXQnKTtcclxuICAgICAgICB2bS5nZXRSZWNpcGllbnRpbmZvKCkudGhlbihmdW5jdGlvbiAoKSB7IFxyXG4gICAgICAgICAgICB2bS5jaGVja1BhcGVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmYkFwcElkID0gXCIzNzA1NjE0MDk2MjA4ODgyXCJcclxuICAgICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRkIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgICBhcHBJZCAgICAgIDogZmJBcHBJZCxcclxuICAgICAgICAgICAgICAgIHN0YXR1cyAgICAgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29va2llICAgICA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB4ZmJtbCAgICAgIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZlcnNpb24gICAgOiAndjEyLjAnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIChmdW5jdGlvbihkLCBzLCBpZCl7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7cmV0dXJuO31cclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7IGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IFwiaHR0cHM6Ly9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanNcIjtcclxuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG4gICAgICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XHJcbiAgICB9XHJcbn0pOyJdfQ==
