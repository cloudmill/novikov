const addToCartBtn = $('.cd-add-to-cart');


export function updateCartCount() {
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

export function updateCartList(el) {
	const regexp = /\B(?=(\d{3})+(?!\d))/g;
	const name = el.data('product-name');
	const price = el.data('price');
	const itemsContainer = $('[data-type=products_list]');
	itemsContainer
		.prepend(`
		  <div class="cart-block-item" data-type="item-block">
		    <div class="cart-block-item-size">
          <div>${name}</div>
          <div class="incDec">
            <div class="cart-id dec--js">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.0001" cy="12" r="11.5" stroke="#E5E5E5"></circle>
                <path d="M9.55975 13.031H15.4398V12.149H9.55975V13.031Z" fill="black"></path>
              </svg>
            </div>
            <div class="cart-count">1</div>
            <div class="cart-id inc--js">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11.5" stroke="#E5E5E5"></circle>
                <path d="M11.9648 15.159H12.8468V12.401H15.5978V11.519H12.8468V8.76099H11.9648V11.519H9.20679V12.401H11.9648V15.159Z" fill="black"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="cart-block-item-price">
          <div class="cart-pr" data-pr=${price}><span>${price.toString().replace(regexp, ' ')}</span> ₽</div>
          <div class="cart-wr"></div>
          <div class="cart-rm cart-rm--js">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="circle" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#F3F3F3"></path>
              <path d="M9.74145 14.1991L10.3651 14.8228L12.3153 12.8726L14.2655 14.8228L14.8892 14.1991L12.939 12.2489L14.8793 10.3086L14.2556 9.68494L12.3153 11.6252L10.3651 9.67504L9.74145 10.2987L11.6917 12.2489L9.74145 14.1991Z" fill="black"></path>
            </svg>
          </div>
        </div>
      </div>
		`);
	const itemFirst = $('[data-type=item-block]:first-child');
	itemFirst.hide();
	itemFirst.velocity({
		scale: 0,
	},
	{duration: 0});
	itemFirst.velocity(
		{
			scale: 1,
		},
		{
			display: 'block'
		}, {duration: 300}
	);
}


addToCartBtn.on('click', function(event) {
	event.preventDefault();
	// updateCartCount();
	// updateCartList($(this));
});

