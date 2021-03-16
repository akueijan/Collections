"use strict";var game_view=new Vue({el:"#app",data:{gameBlock:0,gameSel:0,gameLink:"",gtmdata:"",gameSlide:0},methods:{introAni:function(){var t=this,e=new TimelineMax({delay:.6,onComplete:function(){setTimeout(function(){t.gameBlock=1,setTimeout(function(){var e=new slickUse(".gameslick",t.gameSlide);e.Start(),$(".gamearea .btn-prev").click(function(){e.Prev()}),$(".gamearea .btn-next").click(function(){e.Next()})},50)},2e3)}});e.from(".intro .word",.9,{y:100,opacity:0}),e.from(".intro .word p",.6,{y:50,opacity:0})},selgame:function(e){var t=this;t.eventOpen("toplay"),1==e&&(t.gameLink="https://instagram.com/ar/2667678300175161/",t.gtmdata="挑戰頁_第一招_立即挑戰"),2==e&&(t.gameLink="https://instagram.com/ar/1342910316098878/",t.gtmdata="挑戰頁_第二招_立即挑戰"),3==e&&(t.gameLink="https://instagram.com/ar/551610642194908/",t.gtmdata="挑戰頁_第三招_立即挑戰")}},mounted:function(){var e=this;e.checkPage(),$("body").loadpage("init",{async:!1}),document.querySelector(".nav").style="display: none",document.querySelector(".footer").style="display: none",document.querySelector(".gotop").style="display: none";null!==findGetParameter("game")&&(findGetParameter("game")<4&&0<findGetParameter("game")?e.gameSlide=findGetParameter("game")-1:e.gameSlide=0),e.introAni()}});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWUuanMiXSwibmFtZXMiOlsiZ2FtZV92aWV3IiwiVnVlIiwiZWwiLCJnYW1lQmxvY2siLCJnYW1lU2VsIiwiZ2FtZUxpbmsiLCJnYW1lU2xpZGUiLCJpbnRyb0FuaSIsInZtIiwidGhpcyIsInRsIiwiVGltZWxpbmVNYXgiLCJkZWxheSIsIm9uQ29tcGxldGUiLCJzZXRUaW1lb3V0IiwiZ2FtZVNsaWNrIiwic2xpY2tVc2UiLCJTdGFydCIsIiQiLCJjbGljayIsIlByZXYiLCJOZXh0IiwiZnJvbSIsInkiLCJvcGFjaXR5Iiwic2VsZ2FtZSIsImdhbWUiLCJldmVudE9wZW4iLCJndG1kYXRhIiwiY2hlY2tQYWdlIiwibG9hZHBhZ2UiLCJhc3luYyIsIm1vdW50ZWQiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkb2N1bWVudCIsImZpbmRHZXRQYXJhbWV0ZXIiXSwibWFwcGluZ3MiOiJhQUFBLElBQUlBLFVBQVksSUFBSUMsSUFBSSxDQUNwQkMsR0FBSSxPQURKRixLQUFBQSxDQUNJRyxVQURnQixFQUVkQyxRQUFBLEVBQ0ZELFNBREUsR0FFRkMsUUFGRSxHQUdGQyxVQUhFLEdBS0ZDLFFBQVMsQ0FQT0MsU0FPUCxXQUVKLElBQUFDLEVBQUFDLEtBRVFDLEVBQVQsSUFBQUMsWUFBQSxDQUFBQyxNQUFBLEdBQ1VDLFdBQVYsV0FDYUYsV0FBWSxXQUFBSCxFQUFBTCxVQUFBLEVBQ1RXLFdBQUEsV0FDRyxJQUFBQyxFQUFVLElBQUFDLFNBQUEsYUFBQVIsRUFBQUYsV0FDakJTLEVBQUFFLFFBQ1dDLEVBQUEsdUJBQVVDLE1BQUEsV0FDREosRUFBQUssU0FFZEYsRUFBQSx1QkFBNkJDLE1BQVUsV0FDckNKLEVBQUFNLFVBRUYsS0FDRU4sUUFURkwsRUFZUFksS0FaSCxlQUFBLEdBQUEsQ0FhSEMsRUFBQSxJQWZMQyxRQUFBLElBa0JPZCxFQURzQlksS0FBQSxpQkFBQSxHQUFBLENBRWxCQyxFQUFFLEdBRmJDLFFBQUEsS0FXQUMsUUFsQ0ssU0FrQ0xDLEdBaENDLElBQUFsQixFQUFBQyxLQUFBRCxFQUFBbUIsVUFBQSxVQW1DRCxHQUFTRCxJQUNOQyxFQUFVdEIsU0FBYiw2Q0FHSUcsRUFBR29CLFFBQVUsZ0JBREMsR0FBWHZCLElBQ0F1QixFQUFIdkIsU0FBYSw2Q0FDaEJHLEVBQUFvQixRQUFBLGdCQUNhLEdBQVBGLElBQ0FyQixFQUFIQSxTQUFjLDRDQUNYdUIsRUFBSEEsUUFBYSxrQkFHYnBCLFFBQUdILFdBQ0hHLElBQUdvQixFQUFBQSxLQUNOcEIsRUFBQXFCLFlBQ0pYLEVBQUEsUUFBQVksU0FBQSxPQUFBLENBQUFDLE9BQUEsSUFFTEMsU0FBU0MsY0FBVyxRQUFBQyxNQUFBLGdCQUNaMUIsU0FBSnlCLGNBQUEsV0FBQUMsTUFBQSxnQkFDR0wsU0FBSEksY0FBQSxVQUFBQyxNQUFBLGdCQUdBLE9BQUFDLGlCQUF1QixVQUNkRixpQkFBYyxRQUFXQyxHQUFsQyxFQUEwQ0UsaUJBQTFDLFFBQ1NILEVBQUFBLFVBQWNHLGlCQUFrQixRQUFBLEVBRzlCNUIsRUFBWEYsVUFBQSxHQUVJRSxFQUFBRCIsImZpbGUiOiJnYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdhbWVfdmlldyA9IG5ldyBWdWUoe1xyXG4gICAgZWw6IFwiI2FwcFwiLFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIGdhbWVCbG9jazogMCxcclxuICAgICAgICBnYW1lU2VsOiAwLFxyXG4gICAgICAgIGdhbWVMaW5rOiBcIlwiLFxyXG4gICAgICAgIGd0bWRhdGE6IFwiXCIsXHJcbiAgICAgICAgZ2FtZVNsaWRlOiAwXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIGludHJvQW5pKCkge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgc2VjID0gMC42O1xyXG4gICAgICAgICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoe2RlbGF5OiAwLjYsIFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nYW1lQmxvY2sgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2FtZVNsaWNrID0gbmV3IHNsaWNrVXNlKFwiLmdhbWVzbGlja1wiICx2bS5nYW1lU2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZVNsaWNrLlN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmdhbWVhcmVhIC5idG4tcHJldlwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVTbGljay5QcmV2KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuZ2FtZWFyZWEgLmJ0bi1uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZVNsaWNrLk5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MClcclxuICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGwuZnJvbShcIi5pbnRybyAud29yZFwiLCAwLjksIHtcclxuICAgICAgICAgICAgICAgIHk6IDEwMCxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRsLmZyb20oXCIuaW50cm8gLndvcmQgcFwiLCAwLjYsIHtcclxuICAgICAgICAgICAgICAgIHk6IDUwLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gdGwudG8oXCIuaW50cm8gLndvcmQgcFwiLCAwLjYsIHtcclxuICAgICAgICAgICAgLy8gICAgIHk6IC0xMDAsXHJcbiAgICAgICAgICAgIC8vICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAvLyB9LCBcIis9Mi40XCIpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWxnYW1lKGdhbWUpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdm0uZXZlbnRPcGVuKFwidG9wbGF5XCIpO1xyXG4gICAgICAgICAgICBpZihnYW1lID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZtLmdhbWVMaW5rID0gXCJodHRwczovL2luc3RhZ3JhbS5jb20vYXIvMjY2NzY3ODMwMDE3NTE2MS9cIjtcclxuICAgICAgICAgICAgICAgIHZtLmd0bWRhdGEgPSBcIuaMkeaIsOmggV/nrKzkuIDmi5tf56uL5Y2z5oyR5oiwXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoZ2FtZSA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5nYW1lTGluayA9IFwiaHR0cHM6Ly9pbnN0YWdyYW0uY29tL2FyLzEzNDI5MTAzMTYwOTg4NzgvXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5ndG1kYXRhID0gXCLmjJHmiLDpoIFf56ys5LqM5oubX+eri+WNs+aMkeaIsFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGdhbWUgPT0gMykge1xyXG4gICAgICAgICAgICAgICAgdm0uZ2FtZUxpbmsgPSBcImh0dHBzOi8vaW5zdGFncmFtLmNvbS9hci81NTE2MTA2NDIxOTQ5MDgvXCI7XHJcbiAgICAgICAgICAgICAgICB2bS5ndG1kYXRhID0gXCLmjJHmiLDpoIFf56ys5LiJ5oubX+eri+WNs+aMkeaIsFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBtb3VudGVkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNoZWNrUGFnZSgpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmxvYWRwYWdlKFwiaW5pdFwiLHthc3luYzogZmFsc2V9KTtcclxuICAgICAgICBcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5hdlwiKS5zdHlsZSA9IFwiZGlzcGxheTogbm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9vdGVyXCIpLnN0eWxlID0gXCJkaXNwbGF5OiBub25lXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nb3RvcFwiKS5zdHlsZSA9IFwiZGlzcGxheTogbm9uZVwiO1xyXG5cclxuICAgICAgICAvLyB2YXIgZ2FtZWN1biA9IE1hdGguZmxvb3IoJChcIi5nYW1lYmxvY2tcIikubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgdmFyIGdhbWVjdW4gPSAzO1xyXG4gICAgICAgIGlmKGZpbmRHZXRQYXJhbWV0ZXIoJ2dhbWUnKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZihmaW5kR2V0UGFyYW1ldGVyKCdnYW1lJykgPCBnYW1lY3VuKzEgJiYgZmluZEdldFBhcmFtZXRlcignZ2FtZScpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdm0uZ2FtZVNsaWRlID0gZmluZEdldFBhcmFtZXRlcignZ2FtZScpLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5nYW1lU2xpZGUgPSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZmluZEdldFBhcmFtZXRlcignZ2FtZScpKVxyXG5cclxuICAgICAgICB2bS5pbnRyb0FuaSgpO1xyXG4gICAgICAgIC8vIHZtLmdhbWVTbGljaygpO1xyXG4gICAgfVxyXG59KVxyXG4iXX0=