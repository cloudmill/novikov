/* src/app.js */

// Styles
import 'Styles/_app.scss';
import AOS from 'aos';
import Rellax from 'rellax';
import 'velocity-animate';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min';
import 'jquery-mousewheel';
import Sticky from 'sticky-js';
// import skrollr from 'skrollr';

$.fn.isInViewport = function() {
	if ($(this).offset()) {
		const elementStart = $(this).offset().left;
		const elementEnd = elementStart + $(this).outerWidth();

		const viewportStart = $(document).scrollLeft();
		const viewportEnd = viewportStart + document.body.offsetWidth;

		return elementEnd > viewportStart && elementStart < viewportEnd;
	}
	return true;
};

const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

$(document).ready(() => {
	require('Scripts/header');

	require('Scripts/filtering');
	require('Scripts/input');
	require('Scripts/map');
	require('Scripts/popup');
	require('Scripts/search');
	require('Scripts/select');
	require('Scripts/sliders');
	require('Scripts/video');
	require('Scripts/menuMore');
	require('Scripts/cart');

	require('Scripts/backend');

	$('.scrollContent').mCustomScrollbar();


	if (screenWidth > 1150 && $('.sticky').length) {
		// eslint-disable-next-line no-unused-vars
		const sticky = new Sticky('.sticky');
	}

	$('.swiper-button-prev').mouseover(function() {
		for (let i = 101; i > 55; i--) {
			$(this).find('line')[0].x1.baseVal.value = i;
		}
	});

	// const s = skrollr.init({
	// 	smoothScrolling: true,
	// 	smoothScrollingDuration: 1800
	// });

});


(function() {
	function scrollHorizontally(e) {
		e = window.event || e;
		const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		const el = document.querySelector('.section-item--vert');
		const widthPure = document.body.scrollWidth - document.body.offsetWidth;
		if (
			!$('.vacancy-block').hasClass('active') &&
      (window.pageXOffset < widthPure || (window.pageXOffset === widthPure && delta > 0 && el.scrollTop < 10))
		) {
			if ($('#about').isInViewport() && !$('.menu a[href=\'#about\']').hasClass('active')) {
				$('.menu a').removeClass('active');
				$('.menu a[href=\'#about\']').addClass('active');
			}
			if ($('#chief').isInViewport() && !$('.menu a[href=\'#chief\']').hasClass('active')) {
				$('.menu a').removeClass('active');
				$('.menu a[href=\'#chief\']').addClass('active');
			}
			if ($('#banket').isInViewport() && !$('.menu a[href=\'#banket\']').hasClass('active')) {
				$('.menu a').removeClass('active');
				$('.menu a[href=\'#banket\']').addClass('active');
			}
			if ($('#event').isInViewport() && !$('.menu a[href=\'#event\']').hasClass('active')) {
				$('.menu a').removeClass('active');
				$('.menu a[href=\'#event\']').addClass('active');
			}
			if ($('#maps').isInViewport() && !$('.menu a[href=\'#maps\']').hasClass('active')) {
				$('.menu a').removeClass('active');
				$('.menu a[href=\'#maps\']').addClass('active');
			}
			document.documentElement.scrollLeft -= (delta * 40);
			document.body.scrollLeft -= (delta * 40);
			// e.preventDefault();
		} else {
			$('.aos-init:not(.aos-animate)').addClass('aos-animate');
		}
	}

	if (screenWidth > 767 && $('.card.card-scroller').length) {
		window.addEventListener('mousewheel', scrollHorizontally, false);
		window.addEventListener('DOMMouseScroll', scrollHorizontally, false);
	}
	if (screenWidth > 767 && !$('.card.card-scroller').length) {
		// $(document).mousewheel(function(e, delta) {
		//   console.log('1');
		// 	const otstup = $(document).scrollTop() - (delta * 100);
		// 	$('html').stop().animate({scrollTop: otstup}, 15); // Скролим в FF и IE
		// 	$(document.body).stop().animate({scrollTop: otstup}, 15); // Скролим в webkit
		// 	return false;
		// } );
	}
})();


if ('ontouchstart' in document.documentElement && $('#about').length) {
	document.querySelectorAll('ul.menu a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();

			$('ul.menu a[href^="#"]').removeClass('active');
			this.classList.add('active');
			if (screenWidth > 767) {
				document.querySelector(this.getAttribute('href')).scrollIntoView({
					behavior: 'smooth'
				});
			} else {
				const y = document.querySelector(this.getAttribute('href')).getBoundingClientRect().top - 100;
				window.scrollTo({top: y, behavior: 'smooth'});
			}
		});
	});

	document.addEventListener('touchend', function() {
		if ($('#about').isInViewport() && !$('.menu a[href=\'#about\']').hasClass('active')) {
			$('.menu a').removeClass('active');
			$('.menu a[href=\'#about\']').addClass('active');
		}
		if ($('#chief').isInViewport() && !$('.menu a[href=\'#chief\']').hasClass('active')) {
			$('.menu a').removeClass('active');
			$('.menu a[href=\'#chief\']').addClass('active');
		}
		if ($('#banket').isInViewport() && !$('.menu a[href=\'#banket\']').hasClass('active')) {
			$('.menu a').removeClass('active');
			$('.menu a[href=\'#banket\']').addClass('active');
		}
		if ($('#event').isInViewport() && !$('.menu a[href=\'#event\']').hasClass('active')) {
			$('.menu a').removeClass('active');
			$('.menu a[href=\'#event\']').addClass('active');
		}
		if ($('#maps').isInViewport() && !$('.menu a[href=\'#maps\']').hasClass('active')) {
			$('.menu a').removeClass('active');
			$('.menu a[href=\'#maps\']').addClass('active');
		}
	}, false);
} else {
	require('Scripts/scroll');
}

$(window).on('load', () => {
	$('body').css('overflow', 'hidden');

	if ($('main.page-main').length) {
		$('.main-loader').addClass('hideIt');
		setTimeout(() => {
			$('body').css('overflow', 'visible');
			AOS.init({offset: 50});

			if (process.env.NODE_ENV === 'production') {
				window.scrollTo(0, 0);
			}
			if ($('.rellax').length) {
				// eslint-disable-next-line no-new
				new Rellax('.rellax', {
					center: true
				});
			}
		}, 3000);
	} else {
		setTimeout(() => {
			$('.loading').addClass('hideIt');
			$('body').css('overflow', 'visible');

			AOS.init({offset: 50});

			if (process.env.NODE_ENV === 'production') {
				window.scrollTo(0, 0);
			}

			if ($('.rellax').length) {
				// eslint-disable-next-line no-new
				new Rellax('.rellax', {
					center: true
				});
			}
		}, 800);
	}
});
