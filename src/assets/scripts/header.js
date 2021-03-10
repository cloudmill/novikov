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
	$('.vacancy-block').toggleClass('active');
	$('.overlay').toggleClass('active');
	return false;
});


$(document).click(function(e) {
	const container = $('.navbar.active');
	if (container.has(e.target).length === 0) {
		container.removeClass('active');
	}
});
