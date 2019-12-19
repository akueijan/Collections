"use strict";var awards=new Vue({el:"#app",data:{awardList:{firstAward:[],planeAward:[],cashAward:[],movieAward:[],creamAward:[],bookAward:[]},awardName:["台北-沖繩 來回機票一張","現金 NT$888元","雙人威秀電影票","Haagen-Dazs 105元冰品購物金","誠品生活 50元即享券"],awardTitle:""},methods:{GetAwards:function(){return $.ajax({url:apiUrl+"/awardList",method:"GET",error:function(a){alert("系統忙碌中，請稍後再試!")},dataType:"json"})},awardPop:function(a,t){var i=this;console.log(a),a&&(i.awardPopList=a.list,i.popup=!0,i.popuppage="awardlist",i.awardTitle=i.awardName[t-1],i.popupOpen())}},mounted:function(){var t=this;t.cloud_Ani(),$(".fixedbtn").addClass("fixedbtn-active"),$("div.l-bling,div.r-bling").scrollingParallax({staticSpeed:.2,loopIt:!0,staticScrollLimit:!1,bgHeight:"220%",disableIE6:!0}),$.getJSON("./static/list.json",function(a){t.awardList=a.awardList})}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXJkcy5qcyJdLCJuYW1lcyI6WyJhd2FyZHMiLCJWdWUiLCJlbCIsImF3YXJkTGlzdCIsImZpcnN0QXdhcmQiLCJwbGFuZUF3YXJkIiwiY2FzaEF3YXJkIiwibW92aWVBd2FyZCIsImJvb2tBd2FyZCIsImF3YXJkVGl0bGUiLCJHZXRBd2FyZHMiLCIkIiwiYWpheCIsInVybCIsImFwaVVybCIsImUiLCJhbGVydCIsImRhdGFUeXBlIiwiYXdhcmRQb3AiLCJvYmoiLCJudW0iLCJ2bSIsInRoaXMiLCJjb25zb2xlIiwibG9nIiwibGlzdCIsInBvcHVwIiwicG9wdXBwYWdlIiwiYXdhcmRQb3BMaXN0IiwiYXdhcmROYW1lIiwicG9wdXBPcGVuIiwibW91bnRlZCIsImNsb3VkX0FuaSIsImFkZENsYXNzIiwic2Nyb2xsaW5nUGFyYWxsYXgiLCJsb29wSXQiLCJzdGF0aWNTY3JvbGxMaW1pdCIsInN0YXRpY1NwZWVkIiwiZGlzYWJsZUlFNiIsImdldEpTT04iLCJkYXRhIl0sIm1hcHBpbmdzIjoiYUFBQSxJQUFJQSxPQUFTLElBQUlDLElBQUksQ0FDakJDLEdBQUksT0FESkYsS0FBTSxDQUNGRyxVQURhLENBRVhDLFdBQUEsR0FDRkQsV0FBVyxHQUNQQyxVQURPLEdBRVBDLFdBRk8sR0FHUEMsV0FITyxHQUlQQyxVQUpPLElBTVBDLFVBQVcsQ0FBQSxlQUFBLGFBQUEsVUFBQSx3QkFBQSxlQVBiQyxXQUFBLElBVUZBLFFBQUFBLENBWmFDLFVBQUEsV0FlYkEsT0FBV0MsRUFBQUMsS0FBQSxDQUNFQyxJQUFUQyxPQUFBLGFBQ1NGLE9BQUssTUFDTEUsTUFBUyxTQUFBQyxHQUNOQyxNQUZFLGlCQUlBQyxTQUFBLFVBSmRDLFNBQUEsU0FBQUMsRUFBQUMsR0FIQyxJQUFBQyxFQUFBQyxLQVlHQyxRQUFFQyxJQUFBTCxHQUNHQSxJQUNESyxFQUFJTCxhQUFaQSxFQUFBTSxLQUdJSixFQUFHSyxPQUFRLEVBRk5MLEVBQUFNLFVBQUEsWUFDRkMsRUFBQUEsV0FBbUJILEVBQXRCSSxVQUFBVCxFQUFBLEdBQ0FDLEVBQVdTLGVBSWRDLFFBQUEsV0FDSixJQUFBVixFQUFBQyxLQXBDWUQsRUFBQVcsWUFzQ2pCRCxFQUFPLGFBQUVFLFNBQVksbUJBQ2JaLEVBQUUsMkJBQU5hLGtCQUFBLENBQ0dGLFlBQUgsR0FDRUcsUUFBYUYsRUFDYkcsbUJBQUYsRUFDSUMsU0FEMkMsT0FFckNDLFlBRnFDLElBVy9DM0IsRUFBQTRCLFFBQUEscUJBQUEsU0FBQUMsR0FDQW5CLEVBQUFsQixVQUFBcUMsRUFBQXJDIiwiZmlsZSI6ImF3YXJkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhd2FyZHMgPSBuZXcgVnVlKHtcclxuICAgIGVsOiBcIiNhcHBcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBhd2FyZExpc3Q6IHtcclxuICAgICAgICAgICAgZmlyc3RBd2FyZDogW10sXHJcbiAgICAgICAgICAgIHBsYW5lQXdhcmQ6IFtdLFxyXG4gICAgICAgICAgICBjYXNoQXdhcmQ6IFtdLFxyXG4gICAgICAgICAgICBtb3ZpZUF3YXJkOiBbXSxcclxuICAgICAgICAgICAgY3JlYW1Bd2FyZDogW10sXHJcbiAgICAgICAgICAgIGJvb2tBd2FyZDogW10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhd2FyZE5hbWU6IFsn5Y+w5YyXLeaylue5qSDkvoblm57mqZ/npajkuIDlvLUnLCAn54++6YeRIE5UJDg4OOWFgycsICfpm5nkurrlqIHnp4Dpm7vlvbHnpagnLCAnSGFhZ2VuLURhenMgMTA15YWD5Yaw5ZOB6LO854mp6YeRJywgJ+iqoOWTgeeUn+a0uyA1MOWFg+WNs+S6q+WIuCddLFxyXG4gICAgICAgIGF3YXJkVGl0bGU6ICcnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBHZXRBd2FyZHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGFwaVVybCArIFwiL2F3YXJkTGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLns7vntbHlv5nnoozkuK3vvIzoq4vnqI3lvozlho3oqaYhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF3YXJkUG9wOiBmdW5jdGlvbiAob2JqLG51bSkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5hd2FyZFBvcExpc3QgPSBvYmoubGlzdDtcclxuICAgICAgICAgICAgICAgIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZtLnBvcHVwcGFnZSA9IFwiYXdhcmRsaXN0XCI7XHJcbiAgICAgICAgICAgICAgICB2bS5hd2FyZFRpdGxlID0gdm0uYXdhcmROYW1lW251bS0xXTtcclxuICAgICAgICAgICAgICAgIHZtLnBvcHVwT3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNsb3VkX0FuaSgpO1xyXG4gICAgICAgICQoXCIuZml4ZWRidG5cIikuYWRkQ2xhc3MoXCJmaXhlZGJ0bi1hY3RpdmVcIilcclxuICAgICAgICAkKCdkaXYubC1ibGluZyxkaXYuci1ibGluZycpLnNjcm9sbGluZ1BhcmFsbGF4KHtcclxuICAgICAgICAgICAgc3RhdGljU3BlZWQgOiAwLjIsXHJcbiAgICAgICAgICAgIGxvb3BJdCA6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXRpY1Njcm9sbExpbWl0IDogZmFsc2UsXHJcbiAgICAgICAgICAgIGJnSGVpZ2h0OiAnMjIwJScsXHJcbiAgICAgICAgICAgIGRpc2FibGVJRTYgOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gdm0uR2V0QXdhcmRzKCkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgLy8gICAgIGlmIChyZXMuZXJyb3JDb2RlID09PSAyMDAwKSB7IFxyXG4gICAgICAgIC8vICAgICAgICAgdm0uYXdhcmRMaXN0ID0gcmVzLmRhdGEuYXdhcmRMaXN0O1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSlcclxuICAgICAgICAkLmdldEpTT04oXCIuL3N0YXRpYy9saXN0Lmpzb25cIiwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdm0uYXdhcmRMaXN0ID0gZGF0YS5hd2FyZExpc3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pOyJdfQ==
