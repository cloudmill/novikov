import Inputmask from 'inputmask';

Inputmask({
  mask: '+7 (999) 999-99-99',
  showMaskOnHover: false,
}).mask('input[name=phone]');
// Inputmask({
// 	mask: '9999 9999 9999 9999',
// 	greedy: false,
// 	placeholder: '',
// }).mask('input[name=promo]');
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

  const name = container.find('input[name=name]').val();
  const phone = container.find('[data-type=contact-phone]').val();
  const email = container.find('input[name=email]').val();
  const containerDataFilter = container.find('.tab-content.active');
  const address = containerDataFilter.find('[data-type=address]').text();
  const payment = containerDataFilter.find('input[name=payment]:checked').val();
  let data = null;

  data = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    payment: payment,
  };

  if (containerDataFilter.attr('data-delivery-type') == 'delivery') {
    data.datetime = containerDataFilter.find('input[name=date]').val() + ' ' + containerDataFilter.find('[data-type=select-time]').val();
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

$('.promos--js').change(function() {
  // const promo = /^[0-9]{4}[\s ][0-9]{4}[\s ][0-9]{4}[\s ][0-9]{4}$/;
  if (
    $('input[name=promo]') && $(this).val().length > 0 &&
    ($('input[name=chk]') && $(this).prop('checked')) || ($('input[name=chk]').prop('checked'))
  ) {
    $(this).addClass('filled').parent().find('button').removeClass('disabled').attr('disabled', false);
  } else {
    $(this).removeClass('filled').parent().find('button').addClass('disabled').attr('disabled', true);
  }
});

$('.num--js').change(function() {
  const phone = /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
  if (
    $('.num--js.phone[name=phone]') && phone.test($('.num--js[name=phone]').val()) &&
    $('.num--js[name=number]') && $('.num--js[name=number]').val().length > 0 &&
    $('.num--js[name=chk]') && $('.num--js[name=chk]').prop('checked')
  ) {
    $(this).addClass('filled').closest('.tab-content').find('button').removeClass('disabled').attr('disabled', false);
  } else {
    $(this).removeClass('filled').closest('.tab-content').find('button').addClass('disabled').attr('disabled', true);
  }
  if ($('.num--js.phone[name=phone]')) {
    const data = $(this).val().replace(/[\. ()_-]+/g, '');
    $(this).attr('data-phone', data);
  }
});


const regexp = /\B(?=(\d{3})+(?!\d))/g;

function discountAccepted(isPromo, disc) {
  $('.cart-block-img').addClass('accepted');

  if (isPromo) {
    $('.cart-block-img').text('Промокод применен');
  } else {
    $('.cart-block-img').html('Карта лояльности <br /> применена');
  }
  const getTotal = $('.cart-block-bottom .card-summ').data('summ');
  const discount  = getTotal * parseInt(disc, 10) / 100;
  const actual = getTotal - discount;
  $('[data-type=container-form] .cart-block-summ').append(`<div>
    <div>Скидка ${disc}%</div>
    <div class="card-summ"><b><span>-${discount.toString().replace(regexp, ' ')}</span> ₽</b></div>
    </div>`
  );
  $('[data-type=container-form] .cart-block-count .card-summ span').text(actual.toString().replace(regexp, ' '));
}

$('.promo-test--js').click(function() {
  let obj = $(this),
    tabContainer = obj.parents('[data-type=tab-content]'),
    stepContainer = tabContainer.find('[data-type=step]').filter('.active'),
    data = {},
    codeEntering = obj.attr('code-entering'),
    type = obj.attr('data-discount-type'),
    url = null,
    headers = null;

  if (codeEntering == 'true') {
    url = '/local/templates/main/include/ajax/valid_sms_code.php';
    headers = {};
  } else {
    url = 'http://209.250.245.217:3000/site/discountcards/check';
    headers = {
      Authorization: 'Bearer b52c96bea30646abf8170f333bbd42b9',
    };
  }

  stepContainer.find('[data-type=get-field]').each(function () {
    data[$(this).attr('data-type-field')] = $(this).val();
  });

  if (data) {
    $.ajax({
      type: 'POST',
      url: url,
      headers: headers,
      dataType: 'json',
      data: data,
      success: function(r) {
        if (codeEntering == 'true') {
          if (r.success) {
            // applyDiscount(type, obj.find('[data-type=cart-items-container]'));
          }
        } else {
          if (r.is_valid) {
            sms(data['phone'].replace(/[^\d]/g, ''), obj);
          } else {
            tabContainer.find('[data-type=promo-card-error]').addClass('active').text(r.comment);
          }
          console.log(r);
        }
      }
    });
  }
});

function applyDiscount(type, cartItemsContainer) {
  $.ajax({
    type: 'POST',
    url: window.location.href,
    dataType: 'html',
    data: {
      discount: type + '-' + r.discount_percent,
    },
    success: function(data) {
      cartItemsContainer.empty();

      cartItemsContainer.append($(data));
    }
  });
}

function sms(phone, obj) {
  $.ajax({
    type: 'POST',
    url: '/local/templates/main/include/ajax/sms-service-api.php',
    dataType: 'json',
    data: {
      phone: phone,
    },
    success: function(r) {
      if (r.success === true) {
        steps(obj);
        obj.attr('code-entering', 'true');
      }
    }
  });
}

function steps(item) {
  if (item.closest('.tab-content').find('.step--third').hasClass('active')) {
    $('.success-block--promo').addClass('active').find('span').text('10%');
    discountAccepted(true, 10);
  }
  if (item.closest('.tab-content').find('.step--second').hasClass('active')) {
    item.closest('.tab-content').find('.step').removeClass('active');
    item.closest('.tab-content').find('.step--first').addClass('active');
    item.closest('.tab-content').find('.promo-counter').removeClass('active');
    item.closest('.tab-content').find('.promo-card-error').removeClass('active');
    $('.success-block--card').addClass('active').find('span').text('11%');
    discountAccepted(false, 11);
  }
  if (item.closest('.tab-content').find('.step--first').hasClass('active')) {
    item.closest('.tab-content').find('.step').removeClass('active');
    item.closest('.tab-content').find('.step--second').addClass('active');
    item.closest('.tab-content').find('.promo-counter').addClass('active');

    let timer2 = '2:00';
    const interval = setInterval(function() {
      const timer = timer2.split(':');
      let minutes = parseInt(timer[0], 10);
      let seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      seconds = (seconds < 0) ? 59 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      $('.countdown').html(minutes + ':' + seconds);
      if (minutes < 0) clearInterval(interval);
      if ((seconds <= 0) && (minutes <= 0)) {
        clearInterval(interval);
        $('.promo-card-error').addClass('active');
      }
      timer2 = minutes + ':' + seconds;
    }, 1000);
  }

  item.addClass('disabled').attr('disabled', true);
}

export function deleteProduct(curItem) {
  const itemsContainer = curItem.parents('[data-type=cart-items-container]');
  const itemBlock = curItem.parents('[data-type=item-block]');
  const productsList = itemsContainer.find('[data-type=products_list]');

  // itemBlock.slideUp(300);
  itemBlock.velocity(
    {
      scale: 0,
    },
    {duration: 300}
  );
  setTimeout(function() {
    itemBlock.remove();

    const items = itemsContainer.find('[data-type=item-block]');
    let summ = 0;
    let count = 0;

    if (items.length < 1) {
      productsList.append('<div class="cart-block-body-null"><img src="/local/templates/main/assets/images/icons/null.svg" alt="" /></div>');
      itemsContainer.find('[data-type=cart-summ]').remove();
      itemsContainer.find('[data-type=cart-total-summ]').addClass('cart-block-count--null');
      itemsContainer.find('.btn--primary').addClass('disabled');
    }

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
  }, 500);
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
