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
	$('.navbar').toggleClass('active');
	return false;
});
$('.search-block--js').click(function() {
	$('.search-block').removeClass('active');
	return false;
});
$('.vacancy-block--js').click(function() {
	let vacancyName = $(this).attr('data-vacancy-name'),
		vacancyRestaurant = $(this).attr('data-vacancy-restaurant'),
		vacancyRegion = $(this).attr('data-vacancy-region');

	$('.vacancy-block').toggleClass('active');
	$('.overlay').toggleClass('active');

	$('.vacancy-block').attr('data-vacancy-name', vacancyName);
	$('.vacancy-block').attr('data-vacancy-restaurant', vacancyRestaurant);
	$('.vacancy-block').attr('data-vacancy-region', vacancyRegion);
	
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
