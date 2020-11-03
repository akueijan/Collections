var FloatTargetHeight = $('.float-target').height();
var FloatTop = 0

$(function () {

/** 
 * Dropdown Function
 */

var openDropdowns = []

function closeDropdown () {
	if ($('.dropdown.is-open'))
		$('.dropdown.is-open').removeClass('is-open');
}

function isDropdown (tag, className) {
	return $(tag).parents('.dropdown').length && ($(tag).hasClass(className) || $(tag).parent().hasClass(className))
}

function changeFilter (type) {
	if (type == 'all') {
		$("[data-filter-content]").show()
	} else {
		$('[data-filter-content]').hide();
		$("[data-filter-content='" + type + "']").show();
	}
}

$('.dropdown').each(function () {
	var trigger = $(this).data('trigger')
	if (trigger == 'hover') {
		$(this).mouseover(function (e) {
			$(this).addClass('is-open').siblings().removeClass('is-open')
		});
		$(this).mouseout(function (e) {
			$(this).removeClass('is-open')
		})
	} else {
		$(this).mousedown(function (e) {
			e.preventDefault();
			var isOpen = $(this).hasClass('is-open')
			if (!isOpen) {
				$(this).addClass('is-open').siblings().removeClass('is-open')
			} else {
				$(this).removeClass('is-open')
			}
		})
	}
})

window.addEventListener('click', function (e) {
	if (!isDropdown(e.target, 'dropdown')) {
		closeDropdown();
	}
})

/** 
 * Search Toggle
*/
var DoSearch = function () {
	this.trigger = $('.search-trigger');
	this.area = $('.search-area');
	this.input = this.area.find('input');
	this.recommand = this.area.find('.recommand');
	this.result = this.area.find('.result');
	this.isOpen = false;

	var $this = this;
	$(this.trigger).click(function () {
		if ($this.isOpen) {
			$this.trigger.find('i').removeClass('icon-search').addClass('icon-close')
			$this.area.addClass('open');
			setTimeout(function () {
				$this.input.focus()
			}, 500)
		} else {
			$this.area.removeClass('open');
			$this.trigger.find('i').removeClass('icon-close').addClass('icon-search')
		}

		$this.isOpen = !$this.isOpen;
	})
	
	this.input.keypress(function () {
		$this.search(this.value)
	})
}

DoSearch.prototype = {
	search: function () {
		var x =	this.value;
		this.recommand.style.display = 'none'
		this.result.style.display = 'block'
		
	}
}

if ($('.search-trigger').length) {
	window.searchKeyword = new DoSearch()
}

/** 
 * Tab Function
 * 
*/
$('[role="tab"]').find('a[role="tab-item"]').click(function (e) {
	e.preventDefault()
	var tab = $(this).parents('[role="tab"]')
	var tabId = $(this).data('tabId');
	if($(this).parent('li').length)
		$(this).parent('li').addClass('active').siblings('.active').removeClass('active')
	else 
		$(this).addClass('active').siblings('[role="tab-item"].active').removeClass('active')
		
	var selectTab = $('.tab-content[data-tab-id="' + tabId + '"]');
	selectTab.addClass('active').siblings('.active').removeClass('active')
	
	if(tab.hasClass('is-pill') && window.innerWidth < 768 ) {
		tab.removeClass('open')
	}
})

/**
 * Modal
 */
$('[data-trigger="modal"]').click(function (e) {
	var modalId = $(this).data('modal');
	var modal = $('[data-modal-id="'+modalId+'"]')

	modal.addClass('is-open')
	$('html, body').addClass('overlay-open')
})

$("[role='modal']").click(function(e) {
	if($(e.target).hasClass('modal') ) {
		$(this).removeClass('is-open')
		$('html, body').removeClass('overlay-open')
	}
}).end().find('[role="close"]').click(function () {
	$(this).parents('.modal').removeClass('is-open')
	$('html, body').removeClass('overlay-open')
})

/**
 * Sidebar
 */
var sideTrigger = $('[data-trigger="sidebar"]')
var sidebar = $(".sidebar")
var sideClose = sidebar.find('[data-trigger="close"]')

sideTrigger.click(function () {
	sidebar.addClass('is-slide-in')
	$('html, body').addClass('overlay-open');
})
sideClose.click(function () {
	$('html, body').removeClass('overlay-open');
	sidebar.removeClass('is-slide-in');
})

var triggers = {};

$('ul.menu > li > a.menu-item[role="button"]').click(function () {
	$(this).parent().toggleClass('is-open');
})

sidebar.scroll(function (e) {
	var currentTop = sidebar[0].scrollTop,
		 menus = sidebar.find('li.is-open')

	menus.each(function () {
		var item = $(this).find('a.menu-item[role="accordion"]');
		// console.log(currentTop, $(this).height(), $(this)[0].offsetTop, $(this)[0].offsetTop)
		if (currentTop >= $(this)[0].offsetTop && $(this)[0].offsetTop + $(this)[0].clientHeight - currentTop > 42) {
			item.css({
				transform: 'translateY('+ (($(this)[0].offsetTop - currentTop) * -1 ) +'px)'
			})
		} else if (($(this)[0].offsetTop + $(this)[0].clientHeight) - currentTop <= 42) {
			item.css({
				transform: 'translateY('+ $(this)[0].clientHeight - 42 +'px)'
			})
		} else {
			item.css({
				transform: 'translateY(0px)'
			})
		}
	})
})
/**
 * Select2
 */
$('.select2').each(function() {
	if ($(this).parents('.pop-menu').length|| $(this).parents('.document-menu').length) {
		$(this).select2({minimumResultsForSearch : -1})
		if ($(this).parents('.pop-menu').length&& this.name != 'document-menu') {
			$(this).on('select2:select',function(e) {
				// debugger
				if ($(this).hasClass('filter')) {
									
									changeFilter(this.value)
				} else if ($(this).hasClass('switch-content')) {
									$('.helper-menu .item.active').removeClass('active')
									$('.helper-menu .item[data-target='+ this.value+ ']').addClass('active')
				} else if ($(this).hasClass('anchor')) {
									
									isScrolling = true
									var target = $("[data-id='"+ this.value+ "']");

									$('html, body').animate({scrollTop : target.offset().top - 30},2000,function() {
										isScrolling = false
													})
				} else if ($(this).hasClass('selectInsurance')) {
									
									var selectInsuranceValue = this.value;
									var NewArray = new Array();
									var NewArray = selectInsuranceValue
											.split(",");
									var qaKind = NewArray[0];
									var qaTag = NewArray[1];
									var qaTagName = NewArray[2];
									var qaName = NewArray[3];
									
									getQakind(qaKind,
											qaTag,
											qaTagName,
											qaName);
				} else if ($(this).hasClass('serviceBase')) {
									
									var serviceBaseValue = this.value;
									var serviceBase = "#location"+ serviceBaseValue;
									$(".helper-maintain").hide();
									
									$(serviceBase).show();
				} else if ($(this).hasClass('payment')) {
									
									var paymentValue = this.value;
									if(paymentValue!="other"){															
											$(".allData").hide();
											$("."+paymentValue+"Data").show();
											$(".mainData").show();
											$(".allTabData").removeClass("active");	
											$("."+paymentValue).addClass("active");
											$("#BEAN_NAME").val("PFA3_0110");														      
									}else{
											$(".allData").hide();
											$(".mainData").hide();
											$(".otherData").show();	
											$(".allTabData").removeClass("active");	
											$(".other").addClass("active");
											$("#BEAN_NAME").val("PFA3_0113");															        	
									}
				} else if ($(this).hasClass('manyInsurance')) {
							
							var manyInsuranceValue = this.value;
							$('.alldata').hide();
							$(".data"+manyInsuranceValue).show();
							$(".nav-item").removeClass("active");
							$(".sele"+manyInsuranceValue).addClass("active");
							
				} else if ($(this).hasClass('policyClaim')) {
					
					var policyClaimValue = this.value;
					$(".allData").hide();
					var showData = '.sort' + policyClaimValue;
					$(showData).show();
				} else if ($(this).hasClass('cliam')) {
					
					var ClaimValue = this.value;
					$(".allData").hide();
					var showData = "."+ClaimValue;
					$(showData).show();
} else {
	
	window.location.href = this.value

								}
			})
		}
	} else {
		$(this).select2()
	}
})
/**
 * Accordion
 */
$('body').on('click', '.accordion-header', function (e) {
	// debugger
	var accor = $(this).parent('.accordion')
	accor.toggleClass('is-open')
	if (accor.hasClass('is-open'))
		$(this).next('.accordion-body').slideDown()
	else
		$(this).next('.accordion-body').slideUp()
})

/**
 * Owl Carousel
 */
// debugger
if ($.fn.owlCarousel) {
	$(".owl-carousel.activity-ad").owlCarousel({
		itemElement: 'div.item',
		loop: true,
		nav: true,
		dots: true,
		items: 1,
		touchDrag: true,
		navText: [
			"<i class='icon-chevron-left'></i>", 
			"<i class='icon-chevron-right'></i>"
		]
	})

	$(".owl-carousel.introduce").owlCarousel({
		itemElement: 'section',
		loop: false,
		nav: true,
		dots: true,
		items: 1,
		touchDrag: false,
		navText: [
			"<i class='icon-chevron-left'></i>", 
			"<i class='icon-chevron-right'></i>"
		]
	})

	$(".owl-carousel.insurance-card").owlCarousel({
		itemElement: 'div',
		loop: false,
		nav: true,
		dots: true,
		margin: 20,
		autoHeight: true,
		responsive: {
			0:{
				items: 1
			},
			768:{
				items: 2
			},
			992:{
				items: 3
			}
		},
		navText: [
			"<i class='icon-chevron-left'></i>", 
			"<i class='icon-chevron-right'></i>"
		]
	})

	$(".owl-carousel.known-items").owlCarousel({
		itemElement: 'div',
		loop: false,
		dots: true,
		nav: true,
		responsive: {
			0:{
				items: 1
			},
			768:{
				items: 2
			},
			992:{
				items: 4
			}
		},
		navText: [
			"<i class='icon-chevron-left'></i>", 
			"<i class='icon-chevron-right'></i>"
		]
	})

	$(".owl-carousel.sales-caorusel").owlCarousel({
		itemElement: 'div',
		loop: false,
		dots: true,
		margin: 20,
		nav: true,
		responsive:{
			0:{
				items: 1
			},
			768:{
				items: 2
			},
			992:{
				items: 3
			}
		},
		navText: [
			"<i class='icon-chevron-left'></i>", 
			"<i class='icon-chevron-right'></i>"
		]
	})

	$(".owl-carousel.banner").owlCarousel({
		loop: true,
		nav: false,
		dots: true,
		margin: 0,
		items: 1
	})
}
 if($('.scrolldown').length && $(window).scrollTop() > 100) {
	$('.scrolldown').addClass('slide-out')
}
 if($(window).scrollTop() > $(window).height()) {
	$('.gotop').addClass('is-slide-in')
}

$('.scrolldown').click(function () {
	$('html, body').animate({
		scrollTop: $('section:eq(1)').offset().top
	}, 1000)
})

var isScrolling = false,
	 currentScroll = 0;

$(window).scroll(function () {
	if ($('.scrolldown').length && $(window).scrollTop() > 100)
		$('.scrolldown').addClass('slide-out')
	
	var header = $('header');

	if ($(window).scrollTop() > header.height())
		header.addClass('compact')
	else
		header.removeClass('compact')

	if ($(window).scrollTop() > $(window).height()) {
		$('.gotop').addClass('is-slide-in')
		
		if( $(window).scrollTop() + $('footer:visible .brand-link').height() > $('body').height()-$(window).height() ) {
			$('.gotop, .with-gotop').addClass('more')
		} else {
			$('.gotop, .with-gotop').removeClass('more')
		}
	} else {
		$('.gotop').removeClass('is-slide-in')
	}

	if ($('.subnav').length && $(window).scrollTop() > $(window).height()) {
		$('.subnav').addClass('slide-in')
		$('header:not(.mobile)').addClass('slide-out')
	} else {
		$('.subnav').removeClass('slide-in')
		$('header:not(.mobile)').removeClass('slide-out')
	}

	if ($('.subnav').length && currentScroll > $(window).scrollTop() ) {
		$('.subnav').removeClass('slide-in')
		$('header:not(.mobile)').removeClass('slide-out')
	}

	if ($("[data-anchor]").length && !isScrolling) {
		$("[data-anchor]").each(function (i, item) {
			var id = $(item).data('anchor');
			var target = $("[data-id='" + id + "']");
			if(
				!$(item).hasClass("btn") && !$(item).hasClass("label") && 
				(target[0] &&
				(
					$(window).scrollTop() >= target[0].offsetTop - 100 || 
					(target[0].offsetTop + target.height() + 50) < $(window).scrollTop()
				))
			) {
				$("[data-anchor]").eq(i).addClass('active').siblings('[data-anchor].active').removeClass('active');
			}
		})
	}

	currentScroll = $(window).scrollTop()

	if ($('.float-menu').length && $(window).width() > 768) {
		var top = $('.float-target').offset().top;
		var countTop = (currentScroll - top + 160 + ($('.system.message').length ? $('.system.message').height() : 0))
		
		if(currentScroll < top - (($('.system.message').length ? $('.system.message').height() : 0) + 120)) {
			$('.float-menu').css({
				transform: 'translateY(0px)'
			})
		} else {
			if ( currentScroll + $('.float-menu').height() < top - 160 + $('.float-target').height()) {
				$('.float-menu').css({
					transform: 'translateY('+ countTop +'px)'
				})
			}
		}
	}
 })

 $("[data-anchor]").click(function (e) {
	e.preventDefault();
	isScrolling = true
	var page = $(this).data('page');
	var id = $(this).data('anchor');
	var target = $("[data-id='"+id+"']");
	
	if (!page == false) {
		window.location.href = './' + page + '.html#' + id;
		$('.sidebar.is-slide-in').removeClass('is-slide-in');
	} else {
		if (!$(this).hasClass('btn') && !$(this).hasClass('label'))
			$(this).addClass('active').siblings('[data-anchor].active').removeClass('active')

		$('html, body').animate({
			scrollTop: target.offset().top - 30
		}, 2000, function () {
			isScrolling = false
		})
	}
 })

$(".sidebar form.search input").focus(function () {
	$('.sidebar').scrollTop(0)
})

 /**
  * Index Dropdown
  */
 if ($('.select.index-dropdown').length) {
	$('.select.index-dropdown').find('.dropdown-menu a:eq(0)').addClass('is-selected')
}
$('.select.index-dropdown').find('span.select-render').click(function (e) {
	var select = $(this).parents('.select.index-dropdown');
	select.toggleClass('is-open');
 }).end().find(".dropdown-menu li a").click(function (e) {
	var select = $(this).parents('.select.index-dropdown');
	select.find('.is-selected').removeClass('is-selected');
	$(this).addClass('is-selected');
	select.find('.select-render').html($(this).html());
	select.removeClass('is-open');
});

$('.select.index-dropdown').parents('.form').find('button').click(function () {
	var parent = $(this).parents('.form').find('.select.index-dropdown');
	var select = parent.find('.is-selected');
	var target = select.data('target');
	var link = select.data('action');
	
	 window.location.href = '//' + link + (!target ? '' : '#' + target)
})

 $('.gotop, .with-gotop').click(function () {
	$('html, body').animate({
		scrollTop: 0
	}, 2000)
 })

 $('.message .close').click(function (e) {
	e.preventDefault()
	var isMsg = $(this).parents('.message').hasClass('system')
	$(this).parents('.message').remove()
	
	if (isMsg) {
		$('body > main').css({
			marginTop: '0px'
		});

		$('body > header').css({
			top: '0px'
		});
	}
 })

 $("table.table-collapse").find('a.collapse-trigger').click(function () {
	 $(this).parents('tr').toggleClass('is-open').siblings('tr.is-open').removeClass('is-open')
 })

 $('[data-relate="true"]').change(function () {
	 var val = this.value,
	 	isCheckbox = (this.type =='checkbox' || this.type=='radio'),
	 	 checked = isCheckbox && this.checked,
		 id = $(this).attr('name');
	
	if (isCheckbox) {
		 $("[data-target='"+id+"']").hide()
		if(checked) {
			$("[data-target='"+id+"'][data-value='"+val+"']").show()
		}
	}

	 $('[data-value]').each(function (item) {
		 if (!isCheckbox &&
			(
				(
					(typeof $(this).data('value')== "number" && $(this).data('value') == Number(val)) 
					|| 
					(typeof $(this).data('value')== "string" && $(this).data('value').indexOf(val) > -1)
				)
				&& $(this).data('target') == id
			)
		) {
			$(this).show().siblings('[data-value]').hide()
		}
	 })
 })

 function updateFloatMenu () {
	var currentScroll = $(window).scrollTop()
	var top = $('.float-target').offset().top;
	var countTop = (currentScroll - top + 160 + ($('.system.message').length ? $('.system.message').height() : 0))
	var max = top - 460 + $('.float-target').height() - $('.float-menu').height()
	
	$('.float-menu').css({
		transform: 'translateY('+ (countTop  > max ? max : countTop )+'px)'
	})
 }

function setMessageSize () {
	if (!$(".system.message").length) {
		return;
	}

	var h = $('.system.message').height() + 24; 
	$('body > main').css({
		marginTop: h + 'px'
	});

	$('body > header').css({
		top: h + 'px'
	});
}

$(window).resize(setMessageSize)
setMessageSize()


if ($('.document-items').length) {
	var currentSection = 1;

	$('.document-section').eq(currentSection - 1).show();

	function switchDocSection () {
		$('.document-section').eq(currentSection - 1).show().siblings('.document-section').hide()
	}

	$('.document-items input:radio').each(function () {
		$(this).change(function () {
			if (this.checked) {
				currentSection = this.value;
				$('[name="document-menu"]').val(currentSection)
				switchDocSection()
			}
		})
	})

	$('[name="document-menu"]').on('select2:select', function(e) {
		currentSection = this.value;
		$('.document-items input:radio').each(function () {
			if (this.value == currentSection)
				this.checked = true
		})
		switchDocSection()
	})
}

if ($('.helper-section').legnth) {
	$('.helper-section').eq(0).show();
}

$(".helper-menu .item").click(function () {
	var id = $(this).data('target');
	$('.helper-section[data-id="'+id+'"]').show().siblings('.helper-section').hide();
	$(".helper-menu .item.active").removeClass('active');
	$(this).addClass('active');
	// 幫助中心切換選項
	$('.pop-menu .select2.switch-content').val(id).trigger('change');
})

$('ul.tab.filter').find('a').click(function () {
	var type = $(this).data('filter-type');
	changeFilter(type)
	$(this).parent('li').addClass('active').siblings('li').removeClass('active');
})

$('.collapse-content-trigger').click(function () {
	var content = $(this).prev('.collapse-content')
	content.toggleClass('open')
	if(!content.hasClass('open') && (content.hasClass('float-target') || content.parents('.float-target').length)) {
		updateFloatMenu()
	}
})

if ($('.datepicker').length) $('.datepicker').datepicker();

window.onhashchange = function () {
	var id = window.location.hash.split('#');
	var target = $("[data-id='"+id[1]+"']");

	$('html, body').animate({
		scrollTop: target.offset().top - 30
	}, 2000, function () {
		isScrolling = false
	})
}

if(window.location.hash) {
	var id = window.location.hash.split('#');
	var target = $("[data-id='"+id[1]+"']");

	$('html, body').animate({
		scrollTop: target.offset().top - 30
	}, 2000, function () {
		isScrolling = false
	})
}

$('.card[data-collapse="true"]').find('.more').click(function () {
	var card = $(this).parents(".card");

	if(!card.hasClass('is-open')) {
		card.find('.collapse').slideDown()
	} else {
		card.find('.collapse').slideUp()
	}

	card.toggleClass('is-open')
})

var currentType = null;

$("input[name='ins-prod-type']").change(function (item) {
	var label = $(this).siblings('label')
	$(".selected-label").empty()
	
	if(this.checked && this.value=="all") {
		$('.condition-filter > li').show()
	}
	if(this.checked && this.value!="all") {
		currentType = $(this)
		$(".selected-label").append(
			$("<div/>", {class: 'label'})
				.append($('<span/>').text(label.text()))
				.append($('<a/>', {role: 'close'}).html('<i class="icon-close"></i>'))
		)

		$('.condition-filter > li').hide()
		$('.condition-filter').children('li.' + this.value).show();
	}
})

$('.selected-label').on('click', 'a[role="close"]', function () {
	$(this).parent('.label').remove();
	currentType.removeAttr('checked')
	currentType = null
	$("input#type-1").attr("checked", "checked")
})

/**
 * Parallax setting
 */
var scene = $('.parallax:visible');
if (Parallax && scene.length) {
	var parallaxInstance = new Parallax(scene[0]);
}

});

/* 
 * 理賠專用動態程式
*/

function getPFA4Kind(kind) {
	$(".allData").hide();
	var showData = '.' + kind;
	$(showData).show();
}