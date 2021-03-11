import Swiper from 'swiper/swiper-bundle.min';


if ($('.main-swiper').length) {
	// eslint-disable-next-line no-unused-vars
	const swiper = new Swiper('.main-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 0,
		loop: true,
		loopedSlides: 13,
		// autoplay: true,
		centeredSlides: true,
		simulateTouch: false,
		pagination: {
			el: '.swiper-pagination',
			type: 'custom',
			renderCustom: function(sw, current, total) {
				return `<span>${current}</span> ` + ' <img src="/local/templates/main/assets/images/icons/line.svg" /> ' + (total - 1);
			}
		},
		navigation: {
			nextEl: '.main-swiper .swiper-button-next',
			prevEl: '.main-swiper .swiper-button-prev',
		},
		breakpoints: {
			1921: {
				// width: 1000,
				spaceBetween: 150,
			}
		}
	});
}


if ($('.slideshow-swiper').length) {
	// eslint-disable-next-line no-unused-vars
	const swiper = new Swiper('.slideshow-swiper', {
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		simulateTouch: false,
		pagination: {
			el: '.swiper-pagination',
			type: 'custom',
			renderCustom: function(sw, current, total) {
				return `<span>${current}</span> ` + ' <img src="/local/templates/main/assets/images/icons/line.svg" /> ' + (total);
			}
		},
		navigation: {
			nextEl: '.slideshow-swiper .swiper-button-next',
			prevEl: '.slideshow-swiper .swiper-button-prev',
		},
	});
}

if ($('.history-slider').length) {
	// eslint-disable-next-line no-unused-vars
	const swiper = new Swiper('.history-slider', {
		slidesPerView: 'auto',
		spaceBetween: 0,
		loop: true,
		simulateTouch: false,
		scrollbar: {
			el: '.history-slider .swiper-scrollbar',
			hide: false,
		},
		navigation: {
			nextEl: '.history-slider .swiper-button-next',
			prevEl: '.history-slider .swiper-button-prev',
		},
	});
}

let carousel;

export function initSwiper() {
	if ($('.carousel-swiper').length) {
		$('.carousel-swiper').each(function() {
			const component = $(this);
			const prev = component.parent().find('.swiper-button-prev');
			const next = component.parent().find('.swiper-button-next');

			carousel = new Swiper(component[0], {
				spaceBetween: 10,
				slidesPerView: 'auto',
				loop: true,
				navigation: {
					nextEl: next[0],
					prevEl: prev[0],
				},
				breakpoints: {
					767: {
						spaceBetween: 20,
						centeredSlides: true,
					}
				}
			});
		});
	}
	if ($('.carousel-swiper-l').length) {
		$('.carousel-swiper-l').each(function() {
			const component = $(this);
			const prev = component.parent().find('.swiper-button-prev');
			const next = component.parent().find('.swiper-button-next');

			carousel = new Swiper(component[0], {
				spaceBetween: 20,
				slidesPerView: 'auto',
				navigation: {
					nextEl: next[0],
					prevEl: prev[0],
				},
			});
		});
	}
	if ($('.carousel-swiper-m').length) {
		const mobile = window.matchMedia('(min-width: 0px) and (max-width: 767px)');
		let carouselM;
		$('.carousel-swiper-m').each(function() {
			const component = $(this);
			if (mobile.matches) {
				carouselM = new Swiper(component[0], {
					slidesPerView: 'auto',
					spaceBetween: 10,
				});
			} else {
				carouselM.destroy();
			}
		});
	}
}

initSwiper();

$('.tab').on('click', function(evt) {
	evt.preventDefault();
	$('.tab').removeClass('active');
	$(this).addClass('active');
	const sel = this.getAttribute('data-toggle-target');
	$('.tab-content').removeClass('active').filter(sel).addClass('active');
	$(this).parent().removeClass('active');
	if (sel === '.map') {
		$(this).parent().addClass('active');
	}
	if (carousel) {
		carousel.destroy();
	}
	initSwiper();
});


