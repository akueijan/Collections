/** 
 * Search Toggle
 */

var DoSearch = function () {
	this.trigger = document.querySelector('.search-trigger');
	this.area = document.querySelector('.search-area');
	this.input = this.area.querySelector('input');
	this.recommand = this.area.querySelector('.recommand');
	this.result = this.area.querySelector('.result');

	var $this = this;
	this.trigger.addEventListener('click', function (e) {
		// debugger
		if (this.children[0].className.indexOf('icon-search') > -1) {
			$this.area.classList.add('open');
			setTimeout(() => {
				$this.area.querySelector("input").focus();
			}, 500)
			this.children[0].className = 'icon-close i-20';
		} else {
			$this.area.classList.remove('open');
			this.children[0].className = 'icon-search i-20';
		}
	});

	this.input.onkeypress = function () {
		$this.search(this.value)
	}
}

DoSearch.prototype = {
	search: function () {
		this.recommand.style.display = 'none'
		this.result.style.display = 'block'
	}
}

if (document.querySelector('.search-trigger')) {
	window.searchKeyword = new DoSearch()
}

document.body.addEventListener('scroll', function () {
	var header = document.querySelector('header');
	if (this.scrollTop > header.clientHeight)
		header.classList.add('compact')
	else
		header.classList.remove('compact')
})


/**
 * Sidebar
 */
var sideTrigger = document.querySelector('[data-trigger="sidebar"]')
var sidebar = document.querySelector(".sidebar")
var sideClose = sidebar.querySelector('[data-trigger="close"]')

sideTrigger.addEventListener('click', function () {
	sidebar.classList.add('is-slide-in')
})
sideClose.addEventListener('click', function () {
	sidebar.classList.remove('is-slide-in')
})

const menuTriggers = document.querySelectorAll('[role="accordion"]')
var triggers = {}

Array.from(menuTriggers).forEach(trigger => {
  let targetID = trigger.dataset.target
  let target = document.querySelector('[data-id="'+targetID+'"]')
  
  triggers[targetID] = false

  trigger.addEventListener('click', e => {
    triggers[targetID] = !triggers[targetID]
    
    if (triggers[targetID]) {
      target.parentNode.classList.add('is-open')
    } else {
      target.parentNode.classList.remove('is-open')
    }
  })
})

sidebar.addEventListener('scroll', e => {
  let currentTop = sidebar.scrollTop
  const menus = sidebar.querySelectorAll('li.is-open')
  
  Array.from(menus).forEach((menu, i) => {
    let item = menu.querySelector('a.menu-item')
    if (currentTop >= menu.offsetTop && (menu.offsetTop + menu.clientHeight) - currentTop > 42) {
      item.style.transform = `translateY(${(menu.offsetTop - currentTop) * -1}px)`
    } else if ((menu.offsetTop + menu.clientHeight) - currentTop <= 42) {
      item.style.transform = `translateY(${menu.clientHeight - 42}px)`
    } else {
      item.style.transform = `translateY(0px)`
    }
  })
})



/**
 * Accordion
 */
$('.accordion').find('.accordion-header').click(function (e) {
	var accor = $(this).parent('.accordion')
	accor.toggleClass('is-open')
	if (accor.hasClass('is-open'))
		$(this).next('.accordion-body').slideDown()
	else
		$(this).next('.accordion-body').slideUp()
})