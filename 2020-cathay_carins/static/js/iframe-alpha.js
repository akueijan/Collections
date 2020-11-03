
function initial_iframe() {
	setTimeout(function() {
		$('.smart_say').css('display', 'none')
	}, 5000);		
	
	$('.smart_alpha').click(function() {
						var protocol = window.location.protocol;
						var host = window.location.hostname;
						var $this = $(this);
						var iframe_src = $('.smart_box iframe').attr('src');
						
						//判斷開啟方式
						var isSameOrigin = false;
						if ('swww.cathay-ins.com.tw' == host || 'www.cathay-ins.com.tw' == host) {
							isSameOrigin = true;
						}
						
						//判斷阿發網址
						var alphahost = 'swww.cathay-ins.com.tw';
						if ('www.cathay-ins.com.tw' == host || 'w3.bobe.com.tw' == host) {
							alphahost = 'www.cathay-ins.com.tw';
						}
						var cathayUrl = "https://" + alphahost +'/ChatWeb/chat#';
						
						
						if (document.body.clientWidth < 450 || ! isSameOrigin || document.body.clientHeight < 750) {
							window.open(cathayUrl)
						} else {
							if (iframe_src == '') {
								$('.smart_box iframe').attr('src', cathayUrl);
							}
							$this.hasClass('shut') ? $this.addClass('end') : $this.removeClass('end');
							$('.smart_box').toggle();
							$this.toggleClass('shut');
							$('.smart_say').css('display', 'none');
							$('.smart_all').css('z-index', '1000')
						}
					})
}