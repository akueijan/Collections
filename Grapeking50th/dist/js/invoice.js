"use strict";var invoive_view=new Vue({el:"#app",data:{step:"invoice",inv_date:"",inv_num:"",inv_random:"",mobile:"",agree:!1},methods:{saveInvo:function(){var i=this;if(!i.loading){i.loading=!0;if(""==i.inv_date)return alert("請選擇發票期別"),void(i.loading=!1);if(""==i.inv_num||!i.inv_num.match(/^[a-zA-Z]{2}[0-9]{8}$/))return alert("請輸入發票正確格式"),void(i.loading=!1);if(""==i.inv_random||!i.inv_random.match(/^[0-9]{4}$/))return alert("請輸入隨機碼正確格式"),void(i.loading=!1);if(""==i.mobile||!i.mobile.match(/^09[0-9]{8}$/))return alert("請輸入手機正確格式"),void(i.loading=!1);if(!i.agree)return alert("請勾選我已詳閱"),void(i.loading=!1);i.getToken().then(function(){i.grecaptcha("invoice").then(function(){i.invoiceSave().then(function(n){n.success?i.step="invSuccess":alert(n.responseMessage),i.loading=!1})})})}},invAgain:function(){var n=this;n.step="invoice",n.inv_date="",n.inv_num="",n.inv_random=""},sampleOpen:function(){this.popup=!0,this.popPage="sample"}},mounted:function(){$(".nav_events").click(function(){location.href="./index.html#events"})}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2UuanMiXSwibmFtZXMiOlsiaW52b2l2ZV92aWV3IiwiVnVlIiwiZWwiLCJzdGVwIiwiaW52X2RhdGUiLCJpbnZfbnVtIiwiaW52X3JhbmRvbSIsIm1ldGhvZHMiLCJzYXZlSW52byIsInZtIiwidGhpcyIsImxvYWRpbmciLCJtb2JpbGVfcnVsZSIsImFsZXJ0IiwicmFuZG9tX3J1bGUiLCJtYXRjaCIsImludl9ydWxlIiwibW9iaWxlIiwiYWdyZWUiLCJnZXRUb2tlbiIsInRoZW4iLCJncmVjYXB0Y2hhIiwiaW52b2ljZVNhdmUiLCJyZXMiLCJzdWNjZXNzIiwicmVzcG9uc2VNZXNzYWdlIiwiaW52QWdhaW4iLCJwb3B1cCIsIm1vdW50ZWQiLCJzYW1wbGVPcGVuIiwiY2xpY2siLCJsb2NhdGlvbiIsImhyZWYiXSwibWFwcGluZ3MiOiJhQUFBLElBQUlBLGFBQWUsSUFBSUMsSUFBSSxDQUN2QkMsR0FBSSxPQURKRixLQUFBQSxDQUNJRyxLQURtQixVQUVqQkMsU0FBQSxHQUNFQyxRQUFFLEdBQ05ELFdBRkUsR0FHRkMsT0FIRSxHQUlGQyxPQUFVLEdBS2RDLFFBQVMsQ0FYY0MsU0FXZCxXQUFBLElBQUFDLEVBQUFDLEtBQUEsSUFBQUQsRUFBQUUsUUFBQSxDQUVRRixFQUFURSxTQUFBLEVBR1FDLEdBQWMsSUFBZEEsRUFBQUEsU0FNQSxPQUxRQyxNQUFHLGdCQUNYQyxFQUFXSCxTQUFHLEdBRVIsR0FBTixJQUFNRixFQUFBSixVQUFOSSxFQUFBSixRQUFBVSxNQU5RLHlCQVNYLE9BRkdGLE1BQWEsa0JBQ2JKLEVBQUFFLFNBQUEsR0FFRU4sR0FBbUIsSUFBbkJBLEVBQUhDLGFBQXVCRCxFQUFRVSxXQUFNQyxNQVR4QyxjQVlJLE9BRk1ILE1BQUEsbUJBQ05KLEVBQWFFLFNBQWIsR0FRSixHQUFlLElBQVpGLEVBQUdRLFNBQWdCUixFQUFHUSxPQUFPRixNQWxCZCxnQkFlZCxPQUZFVCxNQUFILGtCQUNPRyxFQUFBRSxTQUFOLEdBR0gsSUFBQUYsRUFBQVMsTUFFUyxPQUtOTCxNQUFNLGdCQU5KSSxFQUFITixTQUFtQkYsR0FHbEJBLEVBQUFVLFdBQUFDLEtBQUEsV0FDSFgsRUFBQVksV0FBQSxXQUFBRCxLQUFBLFdBUU9YLEVBQUdhLGNBQWNGLEtBQUssU0FBU0csR0FQekJBLEVBQUFDLFFBS0tmLEVBQUFOLEtBQVUsYUFKekJVLE1BQUFVLEVBQUFFLGlCQUtjaEIsRUFBV1csU0FBSyxVQU9sQk0sU0F6Q25CLFdBMENtQmpCLElBQUFBLEVBQUdOLEtBQ0hNLEVBQUFBLEtBQUdFLFVBQ05GLEVBQUFMLFNBQUEsR0FDSkssRUFWREosUUFBQSxHQURKSSxFQUFBSCxXQUFBLElBZ0Jab0IsV0FsREssV0FtRERoQixLQUNBaUIsT0FBVSxFQURWakIsS0FFR04sUUFBSCxXQUlBd0IsUUFBQSxXQUVKQyxFQUFBQSxlQTNES0MsTUFBQSxXQTRES0MsU0FBTkMsS0FBQSIsImZpbGUiOiJpbnZvaWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGludm9pdmVfdmlldyA9IG5ldyBWdWUoe1xyXG4gICAgZWw6IFwiI2FwcFwiLFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHN0ZXA6IFwiaW52b2ljZVwiLFxyXG4gICAgICAgIGludl9kYXRlOiBcIlwiLFxyXG4gICAgICAgIGludl9udW06IFwiXCIsXHJcbiAgICAgICAgaW52X3JhbmRvbTogXCJcIixcclxuICAgICAgICBtb2JpbGU6IFwiXCIsXHJcbiAgICAgICAgYWdyZWU6IGZhbHNlLFxyXG4gICAgICAgIC8vIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBzYXZlSW52bygpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgaWYoIXZtLmxvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vYmlsZV9ydWxlID0gL14wOVswLTldezh9JC87XHJcbiAgICAgICAgICAgICAgICB2YXIgaW52X3J1bGUgPSAvXlthLXpBLVpdezJ9WzAtOV17OH0kLztcclxuICAgICAgICAgICAgICAgIHZhciByYW5kb21fcnVsZSA9IC9eWzAtOV17NH0kLztcclxuICAgICAgICAgICAgICAgIGlmKHZtLmludl9kYXRlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuiri+mBuOaTh+eZvOelqOacn+WIpVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih2bS5pbnZfbnVtID09XCJcIiB8fCAhdm0uaW52X251bS5tYXRjaChpbnZfcnVsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuiri+i8uOWFpeeZvOelqOato+eiuuagvOW8j1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih2bS5pbnZfcmFuZG9tID09XCJcIiB8fCAhdm0uaW52X3JhbmRvbS5tYXRjaChyYW5kb21fcnVsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuiri+i8uOWFpemaqOapn+eivOato+eiuuagvOW8j1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih2bS5tb2JpbGUgPT1cIlwiIHx8ICF2bS5tb2JpbGUubWF0Y2gobW9iaWxlX3J1bGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLoq4vovLjlhaXmiYvmqZ/mraPnorrmoLzlvI9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoIXZtLmFncmVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLoq4vli77pgbjmiJHlt7LoqbPplrFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdm0uZ2V0VG9rZW4oKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZ3JlY2FwdGNoYShcImludm9pY2VcIikudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW52b2ljZVNhdmUoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighcmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChyZXMucmVzcG9uc2VNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KHJlcy5yZXNwb25zZU1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZtLnBvcHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5zdGVwID0gXCJpbnZTdWNjZXNzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW52QWdhaW4oKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZtLnN0ZXAgPSBcImludm9pY2VcIjtcclxuICAgICAgICAgICAgdm0uaW52X2RhdGUgPSBcIlwiO1xyXG4gICAgICAgICAgICB2bS5pbnZfbnVtID0gXCJcIjtcclxuICAgICAgICAgICAgdm0uaW52X3JhbmRvbSA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vIHZtLm1vYmlsZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vIHZtLmFnYXJlID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYW1wbGVPcGVuKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2bS5wb3B1cCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnBvcFBhZ2UgPSBcInNhbXBsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgJChcIi5uYXZfZXZlbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbCNldmVudHNcIlxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pIl19
