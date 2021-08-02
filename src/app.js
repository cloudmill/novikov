/* src/app.js */

// Styles
import 'Styles/_app.scss';
import AOS from 'aos';
import Rellax from 'rellax';
import 'velocity-animate';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min';
import 'jquery-mousewheel';
import Sticky from 'sticky-js';
import browser from 'browser-detect';

const result = browser();

let clicked = false;

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
const isMobile = window.matchMedia('only screen and (max-width: 767px)').matches;

function scrollX() {

	if (!isMobile) {
		$('.scrollContentX').mCustomScrollbar({
			axis: 'x',
			advanced: { updateOnContentResize: false, updateOnImageLoad: false },
			callbacks: {
				whileScrolling: function() {
					const getL = this.mcs.leftPct > 80;
					const containerPos = $('.mCSB_container').width() - window.innerWidth - window.innerWidth;
					if (getL) {
						$('.page-card .card-bottom').css('left', `${this.mcs.left + containerPos}px`);
						$('.page-card .mCSB_container').css('overflow', 'visible');
					} else {
						$('.page-card .card-bottom').css('left', '0');
						$('.page-card .mCSB_container').css('overflow', 'hidden');
					}

					const d = -this.mcs.left;
					const x = this.mcs.content.find('.aos-init-left');
					const sections = this.mcs.content.find('.section');

					sections.each(function() {
						const leftOffset = $(this).offset().left - $('.mCSB_container').offset().left + $('.mCSB_container').scrollLeft();
						if (leftOffset < document.body.clientWidth) {
							$('.menu li a').removeClass('active');
							$('.menu li a[href="#' + $(this).attr('id') + '"]').addClass('active');
						}
					});

					x.each(function() {
						const leftOffset = $(this).offset().left - $('.mCSB_container').offset().left + $('.mCSB_container').scrollLeft();
						if (d > Math.round(leftOffset) - window.innerWidth) {
							$(this).addClass('aos-animate');
						} else {
							$(this).removeClass('aos-animate');
						}
					});
				},
			}
		});

		$('.scroll-to--js a').click(function() {
			const id = $(this).attr('href');
			$('.scrollContentX').mCustomScrollbar('scrollTo', id);
			setTimeout(() => {
				$('.scroll-to--js a').removeClass('active');
				$(this).addClass('active');
			}, 1000);
			return false;
		});

	} else {
		$('.scrollContentX').mCustomScrollbar('destroy');

		// $(window).scroll(function() {
		// 	const sections = $('.section');
		//
		// 	if (!clicked) {
		// 		sections.each(function() {
		// 			const leftOffset = $(this).offset().top - $('.mCSB_container').offset().top + $('.mCSB_container').scrollTop();
		// 			if (leftOffset < -10) {
		// 				$('.menu li a').removeClass('active');
		// 				$('.menu li a[href="#' + $(this).attr('id') + '"]').addClass('active');
		// 			}
		// 		});
		// 	}
		// });

		$.fn.isInViewportS = function() {
			const elementTop = $(this).offset().top;
			const elementBottom = elementTop + $(this).outerHeight();

			const viewportTop = $(window).scrollTop();
			const viewportBottom = viewportTop + $(window).height();

			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		$(window).on('resize scroll', function() {
			$('.section').each(function() {
				const activeColor = $(this).attr('id');
				if (!clicked) {
					if ($(this).isInViewportS()) {
						$('.menu li a').removeClass('active');
						$('.menu li a[href="#' + activeColor + '"]').addClass('active');
						if (activeColor === 'footer') {
							$('.menu li a[href="#maps"]').addClass('active');
						}
					}
				}
			});
		});
	}
}

export function scrollContent() {
  const rellax = new Rellax('.rellax', {
    center: true
  });
  let counter = 0;

  let scrollAmount = 'auto';
  if (result.os === 'Windows 10') {
    scrollAmount = 100;
  }
  $('.scrollContent').mCustomScrollbar({
    mouseWheel: {
      scrollAmount: scrollAmount,
    },
    callbacks: {
      whileScrolling: function() {
        // AOS.refresh();
        const x = this.mcs.content.find('.aos-init');
        const d = -this.mcs.top;
        x.each(function() {
          const topOffset = $(this).offset().top - $('.mCSB_container').offset().top + $('.mCSB_container').scrollTop();
          if (d > Math.round(topOffset) - window.innerHeight) {
            $(this).addClass('aos-animate');
          } else {
            $(this).removeClass('aos-animate');
          }
        });
        if ($('.rellax').length) {
          rellax.refresh();
        }

        if (screenWidth > 1150 && $('.sticky').length) {
          // eslint-disable-next-line no-unused-vars
          const sticky = new Sticky('.sticky');
        }

        if ($('.page-order-menu').length) {
          const scrollContent = this.mcs.content;
          const pageNav = scrollContent.find('[data-type=url-page-nav]');
          const url = pageNav.val();
          const sectId = pageNav.attr('data-sect-id');
          const data = {
            ajaxPaginate: true,
          };

          if (sectId) {
            data['sectId'] = sectId;
          }

          if (url) {
            const itemsContainer = scrollContent.find('[data-type=items_container]');
            const last = scrollContent.find('.order-menu-menu__item');
            const offset = $(last[last.length - 1]).offset().top - $('.mCSB_container').offset().top + $('.mCSB_container').scrollTop();
            const setHeight = $(last[last.length - 1]).height() / 2; // тут значение КОГДА сработает условие. В начале блока, в конце и т.д.

            if (d > Math.round(offset) - window.innerHeight + setHeight) {
              counter++;

              if (counter < 2) {
                $.ajax({
                  url: url,
                  type: 'POST',
                  data: data,
                  success: function(data) {
                    const urlResponse = $(data).filter('[data-type=url-page-nav]').val();
                    const itemsResponse = $(data).find('[data-type=item]');

                    if (urlResponse) {
                      scrollContent.find('[data-type=url-page-nav]').val(urlResponse);
                    } else {
                      scrollContent.find('[data-type=url-page-nav]').remove();
                    }

                    itemsContainer.append(itemsResponse);
                    counter = 0;
                  }
                });
              }
            }
          }
        }
      },
    }
  });
}

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

	scrollContent();

	scrollX();

	if ($('[data-type=container-form] .cart-block-body').length) {
		if (!isMobile) {
			$('.cart-block-body').mCustomScrollbar();
		}
	}

	document.body.classList.add(result.name);


	if (screenWidth > 1150 && $('.sticky').length) {
		// eslint-disable-next-line no-unused-vars
		const sticky = new Sticky('.sticky');
	}

	$('.tooltip-name')
		.hover(function() {
			$('.tooltip-desc').fadeIn(500);
		}, function() {
			$('.tooltip-desc').fadeOut(500);
		});

	if (screenWidth < 768) {
		const $root = $('html, body');

		$('.scroll-to--js a[href^="#"]').click(function() {
			clicked = true;
			$('.menu li a').removeClass('active');
			$root.animate({
				scrollTop: $($.attr(this, 'href')).offset().top - 100
			}, 500);

			$(this).addClass('active');
			setTimeout(() => {
				clicked = false;
			}, 1000);

			return false;
		});
	}

});

$(window).resize(scrollX);


if ('ontouchstart' in document.documentElement && $('#about').length && screenWidth > 767) {
	document.querySelectorAll('.menu a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();

			$('.menu a[href^="#"]').removeClass('active');
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
		}, 3000);
	} else {
		setTimeout(() => {
			$('.loading').addClass('hideIt');
			$('body').css('overflow', 'visible');

			AOS.init({offset: 50});

			if (process.env.NODE_ENV === 'production') {
				window.scrollTo(0, 0);
			}
		}, 800);
	}
});
