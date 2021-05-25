import Inputmask from 'inputmask';

Inputmask({
	mask: '+7 (999) 999-99-99',
	showMaskOnHover: false,
}).mask('input[name=phone]');
Inputmask({
	mask: '9999 9999 9999 9999',
	greedy: false,
	placeholder: '',
}).mask('input[name=promo]');
Inputmask({
	inputFormat: 'dd/mm/yyyy',
	alias: 'datetime',
	separator: '/',
	greedy: false,
	showMaskOnHover: false,
	placeholder: 'ДД/ММ/ГГГГ',
}).mask('input[name=date]');

// валидация

export function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export function validatePhone(phone) {
	const re = /^(\+7)[\s\-]\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
	return re.test(phone);
}


export function validateField(element, event) {
	const isRequired = element.attr('required');
	const errorBlock = '.control-error';
	const checkbox = element.attr('type') === 'checkbox';
	const radio = element.attr('type') === 'radio';
	const value = event;
	const tmpval = element.val();
	const lang = $('html').attr('lang');

	let inputError;
	let adrError;
	let emptyError;
	let chkError;
	let radioError;
	if (lang === 'en') {
		inputError = 'Wrong field';
		chkError = 'Incorrect checkbox';
		radioError = 'Wrong radio';
		emptyError = 'Empty field';
		adrError = 'Empty address';
	} else {
		inputError = 'Поле заполнено некорректно';
		adrError = 'Не указан адрес доставки';
		emptyError = 'Поле не заполнено';
		chkError = 'Остутствует согласие на обработку персональных данных';
		radioError = 'Не указан способ оплаты';
	}


	let result;

	if (tmpval === '') {
		element.closest('.input').removeClass('input--filled');
		// result = false;
	} else {
		element.closest('.input').addClass('input--filled');
		// result = true;
	}

	// email & phone
	if (value) {
	  if (element.prop('type') === 'email') {
			if (validateEmail(value)) {
				element.closest('.input').removeClass('error');
				element.closest('.input').find(errorBlock).text('');
				result = true;
			} else {
				element.closest('.input').addClass('error');
				element.closest('.input').find(errorBlock).text(inputError);
				result = false;
			}
		} else if (element.prop('name') === 'phone') {
			if (validatePhone(value)) {
				element.closest('.input').removeClass('error');
				element.closest('.input').find(errorBlock).text('');
				result = true;
			} else {
				element.closest('.input').addClass('error');
				element.closest('.input').find(errorBlock).text(inputError);
				result = false;
			}
		} else {
			element.closest('.input').removeClass('error');
			element.closest('.input').find(errorBlock).text('');
			result = true;
		}
	}

	// checkbox
	if (checkbox && isRequired) {
		if (element.prop('checked')) {
			element.closest('.checkbox').find(errorBlock).text('');
			result = true;
		} else {
			element.closest('.checkbox').find(errorBlock).text(chkError);
			result = false;
		}
	}

	// radio
	if (radio) {
		if ('.tab-content.active') {
			if (!$('.tab-content.active input[type=\'radio\']:checked').val()) {
				element.closest('.radio--inline').next().text(radioError);
				result = false;
			} else {
				element.closest('.radio--inline').next().text('');
				result = true;
			}
		}
	}

	// required input
	if (!value && isRequired) {
		element.closest('.input').addClass('error');
		if (element.prop('name') === 'adr') {
			element.closest('.input').find(errorBlock).text(adrError);
		} else {
			element.closest('.input').find(errorBlock).text(emptyError);
		}
		result = false;
	}

	// file
	if (element.prop('type') === 'file') {
		result = true;
	}

	return result;
}


$(document).on('blur', '.input input, .input textarea', function(event) {
	validateField($(this), event.target.value);
});

$('.input__file-js').change(function() {
	$('.input__file-js').each(function() {
		const name = this.value;
		const reWin = /.*\\(.*)/;
		let fileTitle = name.replace(reWin, '$1');
		const reUnix = /.*\/(.*)/;
		fileTitle = fileTitle.replace(reUnix, '$1');
		$(this).parent().parent().find('.input__name-js').val(fileTitle);
		$('.input__text-js').text(fileTitle);
		$('.input__file-close').addClass('show');
	});
});

$('.input__file-close').on('click', function() {
	$('.input__file-js').val('');
	$('.input__text-js').html('Прикрепить файл');
	$(this).removeClass('show');
});

$('.back--js').on('click', function(e) {
	e.preventDefault();
	$(this).closest('form').find('.form-answer').removeClass('shown');
});

$('.order--js').on('click', function(e) {
	e.preventDefault();

	const path = window.location.pathname.split('/');
	const container = $(this).parents('[data-type=container-form]');

	if (document.documentElement.lang === 'en') {
		path.splice(1, 1);
	}

	// валидация каждого поля формы
	const result = [];
	container.find('.order-wrapper__item--all').find('input, textarea').each(function() {
		const input = $(this)[0];
		result.push(validateField($(this), input.value));
	});

	container.find('.tab-content.active').find('input, textarea').each(function() {
		const input = $(this)[0];
		result.push(validateField($(this), input.value));
	});

	// результат валидации формы
	const isNONValid = result.includes(false);
	if (isNONValid) {
		return false;
	}

  let name = container.find('input[name=name]').val(),
    phone = container.find('[data-type=contact-phone]').val(),
    email = container.find('input[name=email]').val(),
    containerDataFilter = container.find('.tab-content.active'),
    address = containerDataFilter.find('[data-type=address]').text(),
    payment = containerDataFilter.find('input[name=payment]:checked').val(),
    data = null;

  data = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    payment: payment,
  }

  if (containerDataFilter.attr('data-delivery-type') == 'delivery') {
    data['datetime'] = containerDataFilter.find('input[name=date]').val() + ' ' + containerDataFilter.find('[data-type=select-time]').val();
  }

  $.ajax({
    type: 'POST',
    url: '/local/templates/main/include/ajax/order.php',
    dataType: 'json',
    data: data,
    success: function(res) {
      if (res.success === true) {
        window.location.replace('/order-finish/?ORDER_ID=' + res.order_id);
      } else {
        console.log('error order');
      }
    }
  });

});

$('.form--js').on('click', function(e) {
	e.preventDefault();

	const path = window.location.pathname.split('/');
	const container = $(this).parents('[data-type=container-form]');

	if (document.documentElement.lang === 'en') {
		path.splice(1, 1);
	}

	// валидация каждого поля формы
	const result = [];
	container.find('input, textarea').each(function() {
		const input = $(this)[0];
		result.push(validateField($(this), input.value));
	});

	// результат валидации формы
	const isNONValid = result.includes(false);
	console.log(isNONValid);
	if (isNONValid) {
		return false;
	}

	// сбор данных формы
	// const form = $(this).closest('form');
	const name = container.find('input[name=name]');
	const email = container.find('input[name=email]');
	const phone = container.find('input[name=phone]');
	const text = container.find('textarea[name=desc]');
	const type = container.attr('data-type-title');
	const file = container.find('input[name=file]');
	const curForm = $(this);

	let url = null;
	let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	let processData = true;
	let data = null;

	if (path[1] === 'vacancies') {
		url = '/local/templates/main/include/ajax/vacancy_form_submit.php';
		contentType = false;
		processData = false;

		data = new FormData();
		data.append('UF_NAME', name.val());
		data.append('UF_MAIL', email.val());
		data.append('UF_TEXT', text.val());
		data.append('UF_PHONE', phone.val());
		data.append('UF_TYPE', type);
		data.append('UF_VACANCY_NAME', container.attr('data-vacancy-name'));
		data.append('UF_VACANCY_RESTAURANT', container.attr('data-vacancy-restaurant'));
		data.append('UF_VACANCY_REGION', container.attr('data-vacancy-region'));
		data.append('file', file[0].files[0]);
	} else if (path[1] === 'contacts') {
		url = '/local/templates/main/include/ajax/contact_form.php';

		data = {
			UF_NAME: name.val(),
			UF_MAIL: email.val(),
			UF_TEXT: text.val(),
			UF_TYPE: type,
		};
	} else if (path[1] === 'restaurants' && type === 'Забронировать стол') {
		url = '/local/templates/main/include/ajax/booking.php';

		data = {
			UF_NAME: name.val(),
			UF_PHONE: phone.val(),
			UF_EMAIL: email.val(),
			UF_PERSONS_NUMBER: container.find('input[name=count]').val(),
			UF_DATE: container.find('input[name=date]').val() + ' ' + container.find('[data-type=select-time').val(),
			UF_WISHES: container.find('input[name=text]').val(),
			UF_TYPE: type,
		};
	}

	if (url !== undefined) {
		$.ajax({
			type: 'POST',
			url: url,
			dataType: 'json',
			data: data,
			contentType: contentType,
			processData: processData,
			success: function(a) {
				if (a.success === true) {
					let classActiveVal = null;
					// открытие формы ответа
					// контакты
					const mediaQuery = matchMedia('(min-width: 1024px)');
					if (mediaQuery.matches) {
						curForm.closest('.form-inner').css('visibility', 'hidden').css('opacity', 0).next().slideDown(500).css('display', 'flex');
					} else {
						curForm.closest('.form-inner').css('display', 'none').next().css('display', 'flex');
					}

					if (path[1] === 'vacancies') {
						classActiveVal = 'active';
					} else if (path[1] === 'contacts') {
						classActiveVal = 'shown';
					}

					container.find('[data-type=response-form]').addClass(classActiveVal);
				}
			}
		});
	}
});

$('.promo--js').change(function() {
	const promo = /^[0-9]{4}[\s ][0-9]{4}[\s ][0-9]{4}[\s ][0-9]{4}$/;
	if (promo.test($(this).val())) {
		$(this).addClass('filled').parent().find('button').removeClass('disabled').attr('disabled', false);
	} else {
		$(this).removeClass('filled').parent().find('button').addClass('disabled').attr('disabled', true);
	}
});
$('.num--js').change(function() {
	const phone = /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
	if (
		$('input[name=number]') && $(this).val().length > 0 &&
    $('input[name=phone]') && phone.test($(this).val())
	) {
		$(this).addClass('filled').parent().find('button').removeClass('disabled').attr('disabled', false);
	} else {
		$(this).removeClass('filled').parent().find('button').addClass('disabled').attr('disabled', true);
	}
	if ($('input[name=phone]')) {
		const data = $(this).val().replace(/[\. ()_-]+/g, '');
		$(this).attr('data-phone', data);
	}
});

const regexp = /\B(?=(\d{3})+(?!\d))/g;


export function deleteProduct(curItem) {
	const itemsContainer = curItem.parents('[data-type=cart-items-container]');
	const itemBlock = curItem.parents('[data-type=item-block]');

	// itemBlock.slideUp(300);
	itemBlock.velocity(
		{
			scale: 0,
		},
		{duration: 300}
	);
	setTimeout(function() {
		itemBlock.remove();
	}, 500);

	const items = itemsContainer.find('[data-type=item-block]');
	let summ = 0;
	let count = 0;

	items.each((index, item) => {
		if ($(item).find('.cart-pr span').length) {
			summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
			count += parseInt($(item).find('.cart-count').text(), 10);
		}
	});

	$('.card-summ b span').text(summ.toString().replace(regexp, ' '));


	const cartCount = $('.page-header__cart').find('.count');
	for (let i = 0; i < cartCount.length; i++) {
		const actual = count;
		$(cartCount[i]).find('span').eq(1).text(actual);
		setTimeout(function() {
			$(cartCount[i]).find('span').eq(0).text(actual);
		}, 350);
	}
	setTimeout(function() {
		cartCount.addClass('update-count');
		setTimeout(function() {
			cartCount.removeClass('update-count');
		}, 200);
	}, 200);
}

export function appendProduct(curItem) {
	const itemsContainer = curItem.parents('[data-type=cart-items-container]');
	const items = itemsContainer.find('[data-type=item-block]');
	const restMinOrder = $('[data-type=rest-min-order]').val();
	const containerSidebar = curItem.parents('[data-type=main_container]');

	const $rooms = curItem.parent().find('.cart-count');
	const pr = curItem.closest('.cart-block-item').find('.cart-pr');
	const prData = pr.data('pr');
	let a = $rooms.text();
	a++;
	$rooms.text(a);
	pr.find('span').text((prData * a).toString().replace(regexp, ' '));
	let summ = 0;
	let count = 0;
	items.each((index, item) => {
		if ($(item).find('.cart-pr span').length) {
			summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
			count += parseInt($(item).find('.cart-count').text(), 10);
		}
	});

	const cartCount = $('.page-header__cart').find('.count');
	for (let i = 0; i < cartCount.length; i++) {
		const actual = count;
		$(cartCount[i]).find('span').eq(1).text(actual);
		setTimeout(function() {
			$(cartCount[i]).find('span').eq(0).text(actual);
		}, 350);
	}
	setTimeout(function() {
		cartCount.addClass('update-count');
		setTimeout(function() {
			cartCount.removeClass('update-count');
		}, 200);
	}, 200);
	$('.card-summ b span').text(summ.toString().replace(regexp, ' '));
	if ($('.summ--js').length) {
		const price = $('.summ--js').data('pr');
		let summ1 = 0;
		summ1 += price * a;
		$('.summ--js span').text(summ1.toString().replace(regexp, ' '));
	}

	const totalSumm = restMinOrder - summ;

	if (summ < restMinOrder) {
		containerSidebar.find('[data-type=button-order] span').text(totalSumm);
	} else {
		containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" data-type="button-order" href="/order/">Заказать</a>');
	}
}

export function removeProduct(curItem) {
	const itemsContainer = curItem.parents('[data-type=cart-items-container]');
	const items = itemsContainer.find('[data-type=item-block]');
	const restMinOrder = $('[data-type=rest-min-order]').val();
	const containerSidebar = curItem.parents('[data-type=main_container]');

	const $rooms = curItem.parent().find('.cart-count');
	const pr = curItem.closest('.cart-block-item').find('.cart-pr');
	const prData = pr.data('pr');
	let b = $rooms.text();
	if (b > 1) {
		b--;
		$rooms.text(b);
		pr.find('span').text((prData * b).toString().replace(regexp, ' '));
		let summ = 0;
		let count = 0;
		items.each((index, item) => {
			if ($(item).find('.cart-pr span').length) {
				summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
				count += parseInt($(item).find('.cart-count').text(), 10);
			}
		});
		const cartCount = $('.page-header__cart').find('.count');
		for (let i = 0; i < cartCount.length; i++) {
			const actual = count;
			$(cartCount[i]).find('span').eq(1).text(actual);
			setTimeout(function() {
				$(cartCount[i]).find('span').eq(0).text(actual);
			}, 350);
		}
		setTimeout(function() {
			cartCount.addClass('update-count');
			setTimeout(function() {
				cartCount.removeClass('update-count');
			}, 200);
		}, 200);
		$('.card-summ b span').text(summ.toString().replace(regexp, ' '));
		if ($('.summ--js').length) {
			const price = $('.summ--js').data('pr');
			let summ1 = 0;
			summ1 += price * b;
			$('.summ--js span').text(summ1.toString().replace(regexp, ' '));
		}

		const totalSumm = restMinOrder - summ;

		if (summ < restMinOrder) {
			containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" data-type="button-order" disabled style="display: block" href="#"><span>' + totalSumm + '</span> ₽ до минимальной суммы заказа</a>');
		}
	}
}
