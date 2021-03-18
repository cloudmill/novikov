import SweetScroll from 'sweet-scroll';

document.addEventListener(
	'DOMContentLoaded',
	() => {
		// eslint-disable-next-line no-unused-vars
		const scroller = new SweetScroll({
			// vertical: true,
			horizontal: true,
			before: (e, nav) => {
			  $('.menu a').removeClass('active');
				$(nav).addClass('active');
			}
		});
	},
	false,
);
