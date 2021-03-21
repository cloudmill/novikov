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
$('.search-block--js').click(function() {
	$('.search-block').removeClass('active');
	return false;
});
$('.vacancy-block--js').click(function() {
	$(this).parent().toggleClass('active');
	let vacancyName = $(this).attr('data-vacancy-name'),
		vacancyRestaurant = $(this).attr('data-vacancy-restaurant'),
		vacancyRegion = $(this).attr('data-vacancy-region');
	$('.overlay').toggleClass('active');

	$('.vacancy-block').attr('data-vacancy-name', vacancyName);
	$('.vacancy-block').attr('data-vacancy-restaurant', vacancyRestaurant);
	$('.vacancy-block').attr('data-vacancy-region', vacancyRegion);
	
	return false;
});
$('.box--js').click(function() {
	const className = $(this).data('href');
	$('.' + className).toggleClass('active');
	$('.overlay').toggleClass('active');
	return false;
});
$('.page-header__cart').click(function() {
	$('.cart-block').toggleClass('active');
	return false;
});


$(document).click(function(e) {
	const container = $('.navbar.active');
	if (container.has(e.target).length === 0) {
		container.removeClass('active');
	}
});
