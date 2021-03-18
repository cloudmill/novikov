// import {showMore} from './showMore';
import AOS from 'aos';

function filterLogic(value, elem) {
	const list = $('.filter__item--js');
	let filterList;
	list.velocity({
		opacity: 0,
		// translateY: '20px',
	},
	{
		display: 'none'
	}, {duration: 500});

	if (value === '*') {
		list.velocity({
			opacity: 1,
			translateY: '0px',
		},
		{
			display: 'block'
		}, {delay: 300, duration: 500});
	} else {
		filterList = $(list).filter(function(index, item) {
			const getTitle = $(item)[0].dataset.text;
			const regex = getTitle.startsWith(value);
			return regex;
		});
		filterList.velocity({
			opacity: 1,
			translateY: '0px',
		},
		{
			display: 'block'
		}, {delay: 300, duration: 500});
		setTimeout(() => {
			AOS.refresh({
				offset: 50,
			});
		}, 500);
	}
	$('.filter--js li').removeClass('active');
	elem.addClass('active');

}

$('.filter--js').on('click', 'li:not(.last)', function() {
	if ($(this).hasClass('active')) {
		return;
	}
	$('.filter-global li.span').css({'width': `${$(this).width() + 40}px`, 'left': `${$(this).position().left}px`});
	const getCharacter = $(this).data('toggle-target');
	filterLogic(getCharacter, $(this));
});
$('.filter--js').on('click', 'li.last', function() {
	const getFirstEl = $('.filter--js li:first-child');
	if (getFirstEl.hasClass('active')) {
		return;
	}
	const getCharacter = getFirstEl.data('toggle-target');
	filterLogic(getCharacter, getFirstEl);
});


$(document).on('click', '.accordion__item--js', function(event) {
	if ($(event.target).closest('.accordion-body').length === 0) {
		if ($(this).hasClass('active')) {
			$('.accordion__item').removeClass('active');
			$(this).removeClass('active').find('.accordion-body').slideUp();
		} else {
			$('.accordion__item').removeClass('active').find('.accordion-body').slideUp();
			$(this).removeClass('active');
			$(this).addClass('active').find('.accordion-body').slideDown();
		}

		setTimeout(() => {
			AOS.refresh({
				offset: 50,
			});
		}, 400);
	}
});
