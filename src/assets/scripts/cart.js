const addToCartBtn = $('.cd-add-to-cart');


function updateCartCount() {
	const cartCount = $('.page-header__cart').find('.count');
	cartCount.addClass('update-count');
	setTimeout(function() {
		cartCount.removeClass('update-count');
	}, 200);

	for (let i = 0; i < cartCount.length; i++) {
		const actual = Number($(cartCount[i]).find('span').eq(0).text()) + 1;
		const next = actual + 1;
		setTimeout(function() {
			$(cartCount[i]).find('span').eq(0).text(actual);
		}, 150);
		setTimeout(function() {
			$(cartCount[i]).find('span').eq(1).text(next);
		}, 230);
	}
}


addToCartBtn.on('click', function(event) {
	event.preventDefault();
	updateCartCount();
});

