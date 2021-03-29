const addToCartBtn = $('.cd-add-to-cart');


function updateCartCount() {
	const cartCount = $('.page-header__cart').find('.count');

	const actual = Number(cartCount.find('span').eq(0).text()) + 1;
	const next = actual + 1;
	console.log(cartCount.find('span').length);

	cartCount.addClass('update-count');

	setTimeout(function() {
		cartCount.removeClass('update-count');
	}, 200);

	if (cartCount.find('span').length > 2) {
		setTimeout(function() {
			cartCount.find('span').eq(2).text(actual);
		}, 150);
		setTimeout(function() {
			cartCount.find('span').eq(3).text(next);
		}, 230);
	}
	setTimeout(function() {
		cartCount.find('span').eq(0).text(actual);
	}, 150);
	setTimeout(function() {
		cartCount.find('span').eq(1).text(next);
	}, 230);
}


addToCartBtn.on('click', function(event) {
	event.preventDefault();
	updateCartCount();
});

