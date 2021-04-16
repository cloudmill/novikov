$('.mobile-nav--js').click(function() {
	$('body').toggleClass('activated');
	$('.page-header').toggleClass('active');
	$(this).toggleClass('active');
});

$('.header-search--js').click(function() {
	$('.search-block').addClass('active');
	return false;
});
$('.header-menu--js').click(function() {
	if($('.navbar').hasClass('active')) {
		$('.navbar').addClass('hideIt');
		setTimeout(() => {
			$('.navbar').removeClass('active');
			$('.navbar').removeClass('hideIt');
		}, 1800);
	} else {
		$('.navbar').addClass('active');
	}
	return false;
});
$('.vacancy-block--js').click(function() {
	$(this).parent().toggleClass('active');
	const vacancyName = $(this).attr('data-vacancy-name');
	const vacancyRestaurant = $(this).attr('data-vacancy-restaurant');
	const vacancyRegion = $(this).attr('data-vacancy-region');
	$('.overlay').toggleClass('active');

	$('.vacancy-block').attr('data-vacancy-name', vacancyName);
	$('.vacancy-block').attr('data-vacancy-restaurant', vacancyRestaurant);
	$('.vacancy-block').attr('data-vacancy-region', vacancyRegion);

	return false;
});
$('.hr-block--js').click(function() {
	$('.vacancy-block').toggleClass('active');
	$('.overlay').toggleClass('active');
	return false;
});
$('.box--js').click(function() {
	const className = $(this).data('href');
	const tab = $(this).data('tab');
	$('.' + className).toggleClass('active');
	$('.overlay').toggleClass('active');
	console.log(tab);
	if(tab) {
	  $('.tab-container .tab-content').removeClass('active');
	  $('.tab-container .tabs .tab').removeClass('active');
	  $('.tab-container').find('.' + tab).addClass('active');
	  $('.tab-container .tabs .tab[data-toggle-target=".' + tab + '"]').addClass('active');
	}
	return false;
});
$('.page-header__close--js').click(function() {
	$('.cart-block').removeClass('active');
	return false;
});
$('.page-header__cart--js').click(function() {
	$('.cart-block').toggleClass('active');
	return false;
});
$('.show-popup--js').click(function() {
	$('.cart-popup').addClass('active');
	return false;
});
$('.cart-popup-close__js').click(function() {
	$('.cart-popup').removeClass('active');
	return false;
});
$('.search-block--js').click(function() {
	$('.search-block').removeClass('active');
	return false;
});


$(document).click(function(e) {
	const container = $('.navbar.active');
	if (container.has(e.target).length === 0) {
		container.removeClass('active');
	}
});
