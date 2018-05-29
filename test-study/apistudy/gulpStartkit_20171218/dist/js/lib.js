(function(){
	var progressValue = 0;

	var loadHtml = [
	    '<div class="mdLoading">',
	    '    <div class="loadingBox">',
	    '        <div class="title">',
	    '            <div class="titleBox">',
	    '                <img class="line2" src="images/logo.png">',
	    '            </div>',
	    '        </div>',
	    '        <p class="percentage js-count">100%</p>',
	    '        <div class="progressBar">',
	    '            <div class="progress js-bar" style="width:0"></div>',
	    '        </div>',
	    '    </div>',
	    '</div>'
	].join('');
	var dLoad = $(loadHtml);
	var dCount = dLoad.find('.js-count');
	var dBar = dLoad.find('.js-bar');
	var queue = new createjs.LoadQueue();
	var md = new MobileDetect(window.navigator.userAgent);
	var isMobile = md.phone() != null || md.tablet() != null  || window.innerWidth <= 640;
	var loadArray = [];

	for(i=0; i < 32 ; i++){
		loadArray.push({
			id: i+1, 
			src:"/images/d"+ (i+1) + '.png'
		});
	}

	queue.loadManifest(loadArray);

	var handleComplete = function() {

    	$( window ).trigger( "loadCompleted");
        $('.js-wrap').css({'visibility':'visible'}); 
 		
	    TweenMax.to(dLoad,1,{opacity:0,ease:Power4.easeOut,onComplete:function(){
	        dLoad.remove();
	    }});
	   
	};

	$(document).ready(function() {
		dLoad.appendTo('body');	
	});

	queue.on("complete", handleComplete, this);
	queue.on("progress", function(){
	    var procValue = Math.min(Math.ceil(queue.progress*100),100);
	    dCount.text(procValue+'%');
	    dBar.css({
	        'width': procValue+'%'
	    });


	});
	
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJsaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHR2YXIgcHJvZ3Jlc3NWYWx1ZSA9IDA7XHJcblxyXG5cdHZhciBsb2FkSHRtbCA9IFtcclxuXHQgICAgJzxkaXYgY2xhc3M9XCJtZExvYWRpbmdcIj4nLFxyXG5cdCAgICAnICAgIDxkaXYgY2xhc3M9XCJsb2FkaW5nQm94XCI+JyxcclxuXHQgICAgJyAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+JyxcclxuXHQgICAgJyAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZUJveFwiPicsXHJcblx0ICAgICcgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImxpbmUyXCIgc3JjPVwiaW1hZ2VzL2xvZ28ucG5nXCI+JyxcclxuXHQgICAgJyAgICAgICAgICAgIDwvZGl2PicsXHJcblx0ICAgICcgICAgICAgIDwvZGl2PicsXHJcblx0ICAgICcgICAgICAgIDxwIGNsYXNzPVwicGVyY2VudGFnZSBqcy1jb3VudFwiPjEwMCU8L3A+JyxcclxuXHQgICAgJyAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzQmFyXCI+JyxcclxuXHQgICAgJyAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBqcy1iYXJcIiBzdHlsZT1cIndpZHRoOjBcIj48L2Rpdj4nLFxyXG5cdCAgICAnICAgICAgICA8L2Rpdj4nLFxyXG5cdCAgICAnICAgIDwvZGl2PicsXHJcblx0ICAgICc8L2Rpdj4nXHJcblx0XS5qb2luKCcnKTtcclxuXHR2YXIgZExvYWQgPSAkKGxvYWRIdG1sKTtcclxuXHR2YXIgZENvdW50ID0gZExvYWQuZmluZCgnLmpzLWNvdW50Jyk7XHJcblx0dmFyIGRCYXIgPSBkTG9hZC5maW5kKCcuanMtYmFyJyk7XHJcblx0dmFyIHF1ZXVlID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZSgpO1xyXG5cdHZhciBtZCA9IG5ldyBNb2JpbGVEZXRlY3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cdHZhciBpc01vYmlsZSA9IG1kLnBob25lKCkgIT0gbnVsbCB8fCBtZC50YWJsZXQoKSAhPSBudWxsICB8fCB3aW5kb3cuaW5uZXJXaWR0aCA8PSA2NDA7XHJcblx0dmFyIGxvYWRBcnJheSA9IFtdO1xyXG5cclxuXHRmb3IoaT0wOyBpIDwgMzIgOyBpKyspe1xyXG5cdFx0bG9hZEFycmF5LnB1c2goe1xyXG5cdFx0XHRpZDogaSsxLCBcclxuXHRcdFx0c3JjOlwiL2ltYWdlcy9kXCIrIChpKzEpICsgJy5wbmcnXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHF1ZXVlLmxvYWRNYW5pZmVzdChsb2FkQXJyYXkpO1xyXG5cclxuXHR2YXIgaGFuZGxlQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcdCQoIHdpbmRvdyApLnRyaWdnZXIoIFwibG9hZENvbXBsZXRlZFwiKTtcclxuICAgICAgICAkKCcuanMtd3JhcCcpLmNzcyh7J3Zpc2liaWxpdHknOid2aXNpYmxlJ30pOyBcclxuIFx0XHRcclxuXHQgICAgVHdlZW5NYXgudG8oZExvYWQsMSx7b3BhY2l0eTowLGVhc2U6UG93ZXI0LmVhc2VPdXQsb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG5cdCAgICAgICAgZExvYWQucmVtb3ZlKCk7XHJcblx0ICAgIH19KTtcclxuXHQgICBcclxuXHR9O1xyXG5cclxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRcdGRMb2FkLmFwcGVuZFRvKCdib2R5Jyk7XHRcclxuXHR9KTtcclxuXHJcblx0cXVldWUub24oXCJjb21wbGV0ZVwiLCBoYW5kbGVDb21wbGV0ZSwgdGhpcyk7XHJcblx0cXVldWUub24oXCJwcm9ncmVzc1wiLCBmdW5jdGlvbigpe1xyXG5cdCAgICB2YXIgcHJvY1ZhbHVlID0gTWF0aC5taW4oTWF0aC5jZWlsKHF1ZXVlLnByb2dyZXNzKjEwMCksMTAwKTtcclxuXHQgICAgZENvdW50LnRleHQocHJvY1ZhbHVlKyclJyk7XHJcblx0ICAgIGRCYXIuY3NzKHtcclxuXHQgICAgICAgICd3aWR0aCc6IHByb2NWYWx1ZSsnJSdcclxuXHQgICAgfSk7XHJcblxyXG5cclxuXHR9KTtcclxuXHRcclxufSkoKTsiXX0=
