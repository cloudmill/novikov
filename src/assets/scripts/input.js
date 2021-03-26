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
				element.closest('.input').find(errorBlock).text('Поле заполнено некорректно');
				result = false;
			}
		} else if (element.prop('name') === 'phone') {
			if (validatePhone(value)) {
				element.closest('.input').removeClass('error');
				element.closest('.input').find(errorBlock).text('');
				result = true;
			} else {
				element.closest('.input').addClass('error');
				element.closest('.input').find(errorBlock).text('Поле заполнено некорректно');
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
			element.closest('.checkbox').find(errorBlock).text('Остутствует согласие на обработку персональных данных');
			result = false;
		}
	}

	// radio
	if (radio) {
		if ('.tab-content.active') {
			if (!$('.tab-content.active input[type=\'radio\']:checked').val()) {
				console.log('ss');
				element.closest('.radio--inline').next().text('Не указан способ оплаты');
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
		element.closest('.input').find(errorBlock).text('Поле не заполнено');
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

$('.form--js').on('click', function(e) {
	e.preventDefault();

	const path = window.location.pathname.split('/');
	const container = $(this).parents('[data-type=container_vacancy_form]');

	// валидация каждого поля формы
	const result = [];
	$(this).closest('form').find('input, textarea').each(function() {
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
	const form = $(this).closest('form');
	const name = form.find('input[name=name]');
	const email = form.find('input[name=email]');
	const phone = form.find('input[name=phone]');
	const text = form.find('textarea[name=desc]');
	const type = form.attr('data-type-title');
	const file = form.find('input[name=file]');
	const curForm = $(this);

	let url = null;
	let data = null;

	if (path[1] == 'vacancies') {
		url = '/local/templates/main/include/ajax/vacancy_form_submit.php';
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

		console.log(data);
	}

	if (url !== undefined) {
		$.ajax({
			type: 'POST',
			url: url,
			dataType: 'json',
			data: data,
			contentType: false,
			processData: false,
			success: function(a) {
				if (a.success === true) {
					// открытие формы ответа
					// контакты
					const mediaQuery = matchMedia('(min-width: 1024px)');
					if (mediaQuery.matches) {
						curForm.closest('.form-inner').css('visibility', 'hidden').css('opacity', 0).next().slideDown(500).css('display', 'flex');
					} else {
						curForm.closest('.form-inner').css('display', 'none').next().css('display', 'flex');
					}
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

const regexp = /\B(?=(\d{3})+(?!\d))/g;
$('.cart-rm--js').click(function() {
	$(this).closest('.cart-block-item').addClass('hide').slideUp(300);
	let summ = 0;
	$('.cart-block-item:not(.hide)').each((index, item) => {
		summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
	});
	$('.card-summ b span').text(summ.toString().replace(regexp, ' '));
});

$('.inc--js').click(function() {
	const $rooms = $(this).parent().find('.cart-count');
	const pr = $(this).closest('.cart-block-item').find('.cart-pr');
	const prData = pr.data('pr');
	let a = $rooms.text();
	a++;
	$rooms.text(a);
	pr.find('span').text((prData * a).toString().replace(regexp, ' '));
	let summ = 0;
	$('.cart-block-item').each((index, item) => {
	  if($(item).find('.cart-pr span').length) {
			summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
		}
	});
	$('.card-summ b span').text(summ.toString().replace(regexp, ' '));
	if ($('.summ--js').length) {
		const price = $('.summ--js').data('pr');
		let summ1 = 0;
		summ1 += price * a;
		$('.summ--js span').text(summ1.toString().replace(regexp, ' '));
	}
});

$('.dec--js').click(function() {
	const $rooms = $(this).parent().find('.cart-count');
	const pr = $(this).closest('.cart-block-item').find('.cart-pr');
	const prData = pr.data('pr');
	let b = $rooms.text();
	if (b > 1) {
		b--;
		$rooms.text(b);
		pr.find('span').text((prData * b).toString().replace(regexp, ' '));
		let summ = 0;
		$('.cart-block-item').each((index, item) => {
			if($(item).find('.cart-pr span').length) {
				summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
			}
		});
		$('.card-summ b span').text(summ.toString().replace(regexp, ' '));
		if ($('.summ--js').length) {
			const price = $('.summ--js').data('pr');
			let summ1 = 0;
			summ1 += price * b;
			$('.summ--js span').text(summ1.toString().replace(regexp, ' '));
		}
	}
});
