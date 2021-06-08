import Swiper from 'swiper/swiper-bundle.min';
// import AOS from 'aos';

let iconLine = 'assets/images/icons/line.svg';

if (window.location.host == 'nov.hellem.ru') {
  iconLine = '/local/templates/main/assets/images/icons/line.svg';
}

if ($('.main-swiper').length) {
	let handle;
	// eslint-disable-next-line no-unused-vars
	const sw = new Swiper('.main-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 10,
		loop: true,
		// loopedSlides: 13,
		centeredSlides: true,
		simulateTouch: false,
		pagination: {
			el: '.swiper-pagination',
			type: 'custom',
			renderCustom: function(sl, current, total) {
				return `<span>${current}</span> ` + ' <img src=' + iconLine + ' /> ' + total;
			}
		},
		navigation: {
			nextEl: '.main-swiper .swiper-button-next',
			prevEl: '.main-swiper .swiper-button-prev',
		},
		breakpoints: {
			768: {
				spaceBetween: 50,
			},
			1000: {
				spaceBetween: 160,
			},
			1366: {
				spaceBetween: 200,
			},
			1921: {
				spaceBetween: 200,
			}
		},
		on: {
			init: function(swiper) {
				$(this.slides[swiper.activeIndex + 1]).find('.slide-bgimg--js img').css('transform', 'translateX(50px)'); // next
				$(this.slides[swiper.activeIndex - 1]).find('.slide-bgimg--js img').css('transform', 'translateX(-50px)'); // prev
				$(this.slides[swiper.activeIndex]).find('.slide-bgimg--js img').css('transform', 'translateX(0)');
				setTimeout(() => {
					$('.swiper-title').addClass('show');
				}, 500);
			},
			slideChangeTransitionStart: function(swiper) {
				$('.swiper-title').addClass('hideIt');
				let c = 50;
				let d = 150;
				const transform = $(this.slides[swiper.activeIndex]).find('.slide-bgimg--js img').css('transform');
				const transformN = $(this.slides[swiper.activeIndex + 1]).find('.slide-bgimg--js img').css('transform');
				let getTransformX = transform.split(', ')[4];
				console.log(getTransformX, transformN);
				handle = setInterval(() => {
					getTransformX--;
					c--;
					d--;
					$(this.slides[swiper.activeIndex]).find('.slide-bgimg--js img').css('transform', 'translateX(' + getTransformX + 'px)');
					$(this.slides[swiper.activeIndex - 1]).find('.slide-bgimg--js img').css('transform', 'translateX(' + c + 'px)');
					$(this.slides[swiper.activeIndex + 1]).find('.slide-bgimg--js img').css('transform', 'translateX(' + d + 'px)');
				}, 10);
				setTimeout(() => {
					const activeSlide = this.slides[this.activeIndex];
					if (activeSlide.dataset.title) {
						const titles = JSON.parse(activeSlide.dataset.title);
						let template = '';
						titles.forEach(item => {
							template += `<span class="word-wrap"><span>${item}&nbsp;</span></span>`;
						});
						$('.swiper-title .wrapTitle').html(template);
						$('.swiper-title').removeClass('show');
						$('.swiper-title').removeClass('hideIt');
					}
				}, 500);
			},
			slideChangeTransitionEnd: function() {
				$('.swiper-title').addClass('show');
				clearInterval(handle);
				handle = 0;
			},
			progress: function() {
				// const swiper = this;
				// pr = progress;
				// for (let i = 0; i < swiper.slides.length; i++) {
				// 	// const slideProgress = swiper.slides[i].progress;
				// 	const innerOffset = swiper.width * interleaveOffset;
				// 	const innerTranslate = progress * innerOffset / 2;
				// 	const el = swiper.slides[i].querySelectorAll('.slide-bgimg--js img');
				// 	for (let j = 0; j < el.length; j++) {
				// 		el[j].style.transform =
				//       'translateX(' + innerTranslate + 'px)';
				// 	}
				// }
			},
			touchStart: function() {
				for (let i = 0; i < this.slides.length; i++) {
					this.slides[i].style.transition = '';
				}
			},
			setTransition: function(speed) {
				for (let i = 0; i < this.slides.length; i++) {
					this.slides[i].style.transition = speed + 'ms';

					const el = this.slides[i].querySelectorAll('.slide-bgimg--js img');
					for (let j = 0; j < el.length; j++) {
						el[j].style.transition = 'all ' + speed + 'ms ease 0s';
					}
				}
			}
		}
	});
}


if ($('.vertical-swiper').length) {
	$('.vertical-swiper').each(function() {
		const component = $(this);
		const prev = component.find('.swiper-button-prev');
		const next = component.find('.swiper-button-next');
		const pagin = component.find('.swiper-pagination');
		// eslint-disable-next-line no-unused-vars
		const swiper = new Swiper(component[0], {
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 1000,
			simulateTouch: false,
			watchSlidesProgress: true,
			loop: true,
			pagination: {
				el: pagin[0],
				type: 'custom',
				renderCustom: function(sw, current, total) {
					return `<span>${current}</span> ` + ' <img src=' + iconLine + ' /> ' + total;
				}
			},
			navigation: {
				nextEl: next[0],
				prevEl: prev[0],
			},
			breakpoints: {
				768: {
					direction: 'vertical',
				}
			}
		});
	});
}


if ($('.slideshow-swiper').length) {
	// eslint-disable-next-line no-unused-vars
	let handle;
	$('.slideshow-swiper').each(function() {
		const component = $(this);
		const prev = component.parent().find('.swiper-button-prev');
		const next = component.parent().find('.swiper-button-next');
		const pagin = component.parent().find('.swiper-pagination');
		// eslint-disable-next-line no-unused-vars
		const sw = new Swiper(component[0], {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			speed: 1000,
			simulateTouch: false,
			watchSlidesProgress: true,
			grabCursor: true,
			pagination: {
				el: pagin[0],
				type: 'custom',
				renderCustom: function(swiper, current, total) {
					return `<span>${current}</span> ` + ' <img src=' + iconLine + ' /> ' + total;
				}
			},
			navigation: {
				nextEl: next[0],
				prevEl: prev[0],
			},
			on: {
				progress: function() {
					const swiper = this;
					for (let i = 0; i < swiper.slides.length; i++) {
						const slideProgress = swiper.slides[i].progress;
						const innerOffset = swiper.width * 0.5;
						const innerTranslate = slideProgress * innerOffset;
						swiper.slides[i].querySelector('.slide-bgimg').style.transform =
              'translateX(' + innerTranslate + 'px)';
					}
				},
				touchStart: function() {
					const swiper = this;
					for (let i = 0; i < swiper.slides.length; i++) {
						swiper.slides[i].style.transition = '';
					}
				},
				setTransition: function(slide, speed) {
					const swiper = this;
					for (let i = 0; i < swiper.slides.length; i++) {
						swiper.slides[i].style.transition = speed + 'ms';
						swiper.slides[i].querySelector('.slide-bgimg').style.transition =
              speed + 'ms';
					}
				}
			}
		});
	});
}

let history;
if ($('.history-slider').length) {
	history = new Swiper('.history-slider', {
		effect: 'coverflow',
		slidesPerView: 'auto',
		// slidesPerView: 1.2,
		// centeredSlides: true,
		spaceBetween: 0,
		loop: true,
		simulateTouch: false,
		scrollbar: {
			el: '.swiper-scrollbar',
			hide: false,
		},
		navigation: {
			nextEl: '.history-slider .swiper-button-next',
			prevEl: '.history-slider .swiper-button-prev',
		},
		coverflow: {
			rotate: 0,
			stretch: 0,
			depth: 250,
			modifier: 1,
			slideShadows: false,
		},
		breakpoints: {
			768: {
				direction: 'horizontal',
			}
		}
	});
}

$(window).resize(function() {
	if (history) history.update();
});

let carousel;

export function initSwiper() {
	if ($('.carousel-swiper').length) {
		$('.carousel-swiper').each(function() {
			const component = $(this);
			const prev = component.parent().find('.swiper-button-prev');
			const next = component.parent().find('.swiper-button-next');

			carousel = new Swiper(component[0], {
				spaceBetween: 10,
				slidesPerView: 1,
				loop: true,
				centeredSlides: false,
				navigation: {
					nextEl: next[0],
					prevEl: prev[0],
				},
				breakpoints: {
					500: {
						slidesPerView: 2,
						centeredSlides: false,
					},
					767: {
						slidesPerView: 2,
						centeredSlides: false,
						spaceBetween: 20,
					},
					1280: {
						centeredSlides: true,
						slidesPerView: 3,
					},
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
				simulateTouch: false,
				navigation: {
					nextEl: next[0],
					prevEl: prev[0],
				},
			});
		});
	}
	if ($('.carousel-swiper-two').length) {
		$('.carousel-swiper-two').each(function() {
			const component = $(this);
			const prev = component.parent().find('.swiper-button-prev');
			const next = component.parent().find('.swiper-button-next');

			carousel = new Swiper(component[0], {
				slidesPerView: 'auto',
				spaceBetween: 20,
				simulateTouch: false,
				navigation: {
					nextEl: next[0],
					prevEl: prev[0],
				},
				breakpoints: {
					768: {
						slidesPerView: 2,
					}
				}
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
				if (carouselM) carouselM.destroy();
			}
		});
	}
}

initSwiper();

$('.set-tab .tab').on('click', function(evt) {
	evt.preventDefault();
	$('.set-tab .tab').removeClass('active');
	$(this).addClass('active');
	const sel = this.getAttribute('data-toggle-target');
	$('.set-tab .tab-content').removeClass('active').filter(sel).addClass('active');
	$(this).parent().removeClass('active');
	if (sel === '.map') {
		$(this).parent().addClass('active');
	}
	// if (carousel) {
	// 	carousel.destroy();
	// }
	// setTimeout(() => {
	// 	AOS.refresh({
	// 		offset: 50,
	// 	});
	// }, 500);
	// initSwiper();
});


