const addToCartBtn = $('.cd-add-to-cart');

$('.cart-block').click(function() {
	$(this).toggleClass('show');
});

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

export function updateCartList(el, productsList, basketProductId, type = 'add') {
	const regexp = /\B(?=(\d{3})+(?!\d))/g;
	const id = el.data('product-id');
	const name = el.data('product-name');
	const price = el.data('price');
  const basePrice = el.data('base-pr');
  const basePriceCalc = el.data('base-pr-calc');
  const discount = basePrice - price;
	const weight = el.data('weight');
	const exist = productsList.find('[data-item-id=' + id + ']');
	const containerSidebar = el.parents('[data-type=body]');
	const curCount = Number(exist.find('.cart-count').text()) + 1;
	const restMinOrder = $('[data-type=rest-min-order]').val();

	if (type == 'delete') {
		productsList.find('[data-type=item-block]').remove();
	}

	if (exist.length) {
		exist.find('.cart-count').text(curCount);
	} else {
		productsList
			.prepend(`
		  <div class="cart-block-item" data-type="item-block" data-item-id="${id}">
		    <div class="cart-block-item-size">
          <div>${name}</div>
          <div class="incDec">
            <div class="cart-id dec--js" data-type="cart" data-product-id="${basketProductId}" data-calculate="-" data-func-type="update">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.0001" cy="12" r="11.5" stroke="#E5E5E5"></circle>
                <path d="M9.55975 13.031H15.4398V12.149H9.55975V13.031Z" fill="black"></path>
              </svg>
            </div>
            <div class="cart-count">1</div>
            <div class="cart-id inc--js" data-type="cart" data-product-id="${basketProductId}" data-calculate="+" data-func-type="update">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11.5" stroke="#E5E5E5"></circle>
                <path d="M11.9648 15.159H12.8468V12.401H15.5978V11.519H12.8468V8.76099H11.9648V11.519H9.20679V12.401H11.9648V15.159Z" fill="black"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="cart-block-item-price">
          <div class="cart-pr" data-pr=${price} data-base-pr=${basePrice} data-base-pr-calc=${basePriceCalc}><span>${price.toString().replace(regexp, ' ')}</span> ???</div>
          <div class="cart-rm cart-rm--js" data-type="cart" data-product-id="${basketProductId}" data-func-type="delete" data-quantity="0">
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

		if (productsList.find('[data-type=item-block]').length == 1) {
			const totalSumm = restMinOrder - basePrice;

			if (type != 'delete') {
				productsList.after('<div class="cart-block-summ" data-type="cart-summ"><div><div>?????????? ????????????</div><div class="card-summ"><b><span data-type="order-price">'+ basePrice +'</span> ???</b></div></div></div>');

        if (discount !== 0) {
          containerSidebar.find('[data-type=cart-summ]').append('<div><div>????????????</div><div className="card-summ"><b><span data-type="discount">'+ discount +'</span> ???</b></div></div>');
        }
			}

			productsList.find('.cart-block-body-null').remove();
			containerSidebar.find('.cart-block-count').removeClass('cart-block-count--null');

			if (restMinOrder && (basePrice < restMinOrder)) {
				containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js disabled" data-type="button-order" href="#" style="display: block" disabled><span>' + totalSumm + '</span> ??? ???? ?????????????????????? ?????????? ????????????</a>');
			} else {
				containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" data-type="button-order" href="/order/">????????????????</a>');
			}
		}
	}

	const pr = exist.find('.cart-pr');
	const prData = pr.data('pr');

	pr.find('span').text((prData * curCount).toString().replace(regexp, ' '));
  pr.attr('data-base-pr-calc', (basePrice * curCount).toString().replace(regexp, ' '));
  let oldPrice = 0;
	let summ = 0;
	let count = 0;
	const items = productsList.find('[data-type=item-block]');

	items.each((index, item) => {
		if($(item).find('.cart-pr span').length) {
      oldPrice += parseInt($(item).find('.cart-pr').attr('data-base-pr-calc').replace(' ', ''), 10);
			summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
			count += parseInt($(item).find('.cart-count').text(), 10);
		}
	});

	const totalDiscount = oldPrice - summ;

	containerSidebar.find('[data-type=order-price]').text(oldPrice.toString().replace(regexp, ' '));
  containerSidebar.find('[data-type=discount]').text(totalDiscount.toString().replace(regexp, ' '));
  containerSidebar.find('[data-type=total]').text(summ.toString().replace(regexp, ' '));

	const totalSumm = restMinOrder - oldPrice;

	if (summ < restMinOrder) {
		containerSidebar.find('[data-type=button-order] span').text(totalSumm);
	} else {
		containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" href="/order/">????????????????</a>');
	}
}


addToCartBtn.on('click', function(event) {
	event.preventDefault();
	// updateCartCount();
	// updateCartList($(this));
});

