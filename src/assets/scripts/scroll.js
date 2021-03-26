import SweetScroll from 'sweet-scroll';

document.addEventListener(
	'DOMContentLoaded',
	() => {
		// eslint-disable-next-line no-unused-vars
		const scroller = new SweetScroll({
			horizontal: true,
			before: (e, nav) => {
			  // console.log($(nav));
			  $('.menu a').removeClass('active');
				$(nav).addClass('active');
			}
		});
	},
	false,
);


let goUp = true;
let end = null;
let interval = null;

function handle(delta) {
	const animationInterval = 20; // lower is faster
	const scrollSpeed = 20; // lower is faster

	if (end === null) {
		end = $(window).scrollTop();
	}
	end -= 20 * delta;
	goUp = delta > 0;

	if (interval === null) {
		interval = setInterval(function() {
			const scrollTop = $(window).scrollTop();
			const step = Math.round((end - scrollTop) / scrollSpeed);
			if (scrollTop <= 0 ||
        scrollTop >= $(window).prop('scrollHeight') - $(window).height() ||
        goUp && step > -1 ||
        !goUp && step < 1 ) {
				clearInterval(interval);
				interval = null;
				end = null;
			}
			$(window).scrollTop(scrollTop + step );
		}, animationInterval);
	}
}

function wheel(event) {
	let delta = 0;
	if (event.wheelDelta) delta = event.wheelDelta / 120;
	else if (event.detail) delta = -event.detail / 3;

	handle(delta);
	if (event.preventDefault) event.preventDefault();
	event.returnValue = false;
}
if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;

