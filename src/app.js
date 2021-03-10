/* src/app.js */

// Styles
import 'Styles/_app.scss';
import AOS from 'aos';
import Rellax from 'rellax';
import 'velocity-animate';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min';

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

	require('Scripts/backend');

	$('.scrollContent').mCustomScrollbar();
});


const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
if (screenWidth <= 767) {
	console.log(screenWidth);
}


$(window).on('load', () => {
	$('body').css('overflow', 'hidden');

	setTimeout(() => {
		$('.loading').addClass('hideIt');
		$('body').css('overflow', 'visible');

		AOS.init({ offset: 50 });

		if(process.env.NODE_ENV === 'production') {
			window.scrollTo(0, 0);
		}

		if ($('.rellax').length) {
			// eslint-disable-next-line no-new
			new Rellax('.rellax');
		}
	}, 800);
});
