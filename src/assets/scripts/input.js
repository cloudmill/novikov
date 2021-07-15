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
  $(this).closest('form').find('.form-inner').css('visibility', 'visible').css('opacity', 1);
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

  let data = {};

  container.find('[data-type=container-contact-data]').find('input:not([type=checkbox])').each(function () {
    data[$(this).attr('data-field')] = $(this).val();
  });

  const containerDataFilter = container.find('.tab-content.active');
  const payment = containerDataFilter.find('input[name=payment]:checked').val();
  const paymentTitle = containerDataFilter.find('input[name=payment]:checked').attr('data-title');

  data.payment = payment;
  data.paymentTitle = paymentTitle;
  data.deliveryId = containerDataFilter.attr('data-delivery-id');
  data.address = containerDataFilter.find('[data-type=address]').text() + (containerDataFilter.find('input[name=number]').val() ? ', квартира № ' + containerDataFilter.find('input[name=number]').val() : '');

  if (containerDataFilter.attr('data-delivery-type') == 'delivery') {
    data.datetime = containerDataFilter.find('input[name=date]').val() + ' ' + containerDataFilter.find('[data-type=select-time]').val();
  } else {
    data.isPickup = true;
  }

  $.ajax({
    type: 'POST',
    url: '/local/templates/main/include/ajax/order.php',
    dataType: 'json',
    data: data,
    success: function(res) {
      if (res.success === true) {
        window.location.replace(res.url);
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

  if (isNONValid) {
    return false;
  }

  let thisObj = $(this),
    formContainer = thisObj.parents('[data-type=form-container]'),
    dataContainer = formContainer.find('.tab-content.active').length > 0 ? formContainer.find('.tab-content.active') : formContainer,
    url = formContainer.attr('data-url'),
    contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
    processData = true,
    data = {},
    file = formContainer.find('[data-type=file]').length > 0 ? formContainer.find('[data-type=file]') : null;

  if (file) {
    data = new FormData();
    contentType = false;
    processData = false;
    data.append('file', file[0].files[0]);
  }

  dataContainer
    .find(
      '[data-type=get-field]'
    )
    .each(function () {
      let field = $(this).attr('data-field'),
        val = $(this).val();

      file ? data.append(field, val) : (data[field] = val);
    });

  if (url !== undefined) {
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      data: data,
      contentType: contentType,
      processData: processData,
      success: function(r) {
        if (r.success === true) {
          let classActiveVal = 'active';
          // открытие формы ответа
          // контакты
          const mediaQuery = matchMedia('(min-width: 1024px)');
          if (mediaQuery.matches) {
            thisObj.closest('.form-inner').css('visibility', 'hidden').css('opacity', 0).next().slideDown(500).css('display', 'flex');
          } else {
            thisObj.closest('.form-inner').css('display', 'none').next().css('display', 'flex');
          }

          if (path[1] === 'contacts') {
            classActiveVal = 'shown';
          }

          formContainer.find('[data-type=response-form]').addClass(classActiveVal);
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

$('.promo-test--js').click(function() {
  let obj = $(this),
    tabContainer = obj.parents('[data-type=tab-content]'),
    stepContainer = tabContainer.find('[data-type=step]').filter('.active'),
    data = {},
    codeEntering = obj.attr('code-entering'),
    url = codeEntering == 'true' ? '/local/templates/main/include/ajax/valid_sms_code.php' : '/local/templates/main/include/ajax/discount.php';

  stepContainer.find('[data-type=get-field]').each(function () {
    data[$(this).attr('data-type-field')] = $(this).val();
  });

  if (codeEntering == 'true') {
    if (localStorage.getItem('percent_discount')) {
      data['percent_discount'] = localStorage.getItem('percent_discount');
    };
  };

  if (data) {
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      data: data,
      success: function(r) {
        let errorBlock = tabContainer.find('[data-type=promo-card-error]');

        if (codeEntering == 'false') {
          if (r.success) {
            if (r.percent_discount) {
              localStorage.setItem('percent_discount', r.percent_discount);
            }

            if (errorBlock.hasClass('active')) {
              errorBlock.removeClass('active');
            }

            steps(obj);
            obj.attr('code-entering', 'true');
          } else {
            errorBlock.addClass('active').text(r.comment);
          }
        } else {
          if (r.success) {
            let container = $('[data-type=cart-items-container]');

            steps(obj, data['percent_discount']);

            $.ajax({
              type: 'POST',
              url: window.location.href,
              dataType: 'html',
              data: {
                discountApplied: true,
              },
              success: function(r) {
                container.empty();

                container.append($(r));
              }
            });

            localStorage.removeItem('percent_discount');
          } else {
            errorBlock.addClass('active').text(r.comment);
          }
        }
      }
    });
  }
});

function steps(item, discount) {
  if (item.closest('.tab-content').find('.step--third').hasClass('active')) {
    $('.success-block--promo').addClass('active').find('span').text(discount + '%');
    $('.cart-block-img').addClass('accepted');
    $('.cart-block-img').text('Промокод применен');
  }
  if (item.closest('.tab-content').find('.step--second').hasClass('active')) {
    item.closest('.tab-content').find('.step').removeClass('active');
    item.closest('.tab-content').find('.step--first').addClass('active');
    item.closest('.tab-content').find('.promo-counter').removeClass('active');
    item.closest('.tab-content').find('.promo-card-error').removeClass('active');
    $('.success-block--card').addClass('active').find('span').text(discount + '%');
    $('.cart-block-img').addClass('accepted');
    $('.cart-block-img').html('Карта лояльности <br /> применена');
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
  const containerSidebar = curItem.parents('[data-type=main_container]');
  const restMinOrder = $('[data-type=rest-min-order]').val();

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
    let basePrice = 0;
    let summ = 0;
    let count = 0;

    if (items.length < 1) {
      productsList.append('<div class="cart-block-body-null"><img src="/local/templates/main/assets/images/icons/null.svg" alt="" /></div>');
      itemsContainer.find('[data-type=cart-summ]').remove();
      itemsContainer.find('[data-type=cart-total-summ]').addClass('cart-block-count--null');
      itemsContainer.find('[data-type=total]').text(0);
      itemsContainer.find('.btn--primary').addClass('disabled');
      containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" data-type="button-order" disabled style="display: block" href="#"><span>Заказать</span></a>');
    } else {
      items.each((index, item) => {
        if ($(item).find('.cart-pr span').length) {
          basePrice += parseInt($(item).find('.cart-pr').attr('data-base-pr-calc').replace(' ', ''), 10);
          summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
          count += parseInt($(item).find('.cart-count').text(), 10);
        }
      });

      let discount = basePrice - summ;

      $('[data-type=order-price]').text(basePrice.toString().replace(regexp, ' '));
      $('[data-type=total]').text(summ.toString().replace(regexp, ' '));
      $('[data-type=discount]').text(discount);

      const totalSumm = restMinOrder - summ;

      if (summ < restMinOrder) {
        containerSidebar.find('[data-type=button-order]').replaceWith('<a class="btn btn--full btn--primary form--js" data-type="button-order" disabled style="display: block" href="#"><span>' + totalSumm + '</span> ₽ до минимальной суммы заказа</a>');
      }
    }

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
  const basePrData = pr.attr('data-base-pr');
  let a = $rooms.text();
  a++;
  $rooms.text(a);
  pr.find('span').text((prData * a).toString().replace(regexp, ' '));
  pr.attr('data-base-pr-calc', (basePrData * a).toString().replace(regexp, ' '));
  let basePrice = 0;
  let summ = 0;
  let count = 0;
  items.each((index, item) => {
    if ($(item).find('.cart-pr span').length) {
      basePrice += parseInt($(item).find('.cart-pr').attr('data-base-pr-calc').replace(' ', ''), 10);
      summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
      count += parseInt($(item).find('.cart-count').text(), 10);
    }
  });

  let discount = basePrice - summ;

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
  $('[data-type=order-price]').text(basePrice.toString().replace(regexp, ' '));
  $('[data-type=total]').text(summ.toString().replace(regexp, ' '));
  $('[data-type=discount]').text(discount);

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
  const basePrData = pr.attr('data-base-pr');
  let b = $rooms.text();
  if (b > 1) {
    b--;
    $rooms.text(b);
    pr.find('span').text((prData * b).toString().replace(regexp, ' '));
    pr.attr('data-base-pr-calc', (basePrData * b).toString().replace(regexp, ' '));
    let basePrice = 0;
    let summ = 0;
    let count = 0;
    items.each((index, item) => {
      if ($(item).find('.cart-pr span').length) {
        basePrice += parseInt($(item).find('.cart-pr').attr('data-base-pr-calc').replace(' ', ''), 10);
        summ += parseInt($(item).find('.cart-pr span').text().replace(' ', ''), 10);
        count += parseInt($(item).find('.cart-count').text(), 10);
      }
    });

    let discount = basePrice - summ;

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
    $('[data-type=order-price]').text(basePrice.toString().replace(regexp, ' '));
    $('[data-type=total]').text(summ.toString().replace(regexp, ' '));
    $('[data-type=discount]').text(discount);
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
