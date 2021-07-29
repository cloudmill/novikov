import 'devbridge-autocomplete';
// import {mapStyle} from './map';
import {validateField} from './input';
import {myModal} from './popup';
import {initSwiper} from "./sliders";

const DA_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
const DA_API_KEY = '4ea50958b736a6ac3b71ab59a97b96202ace7e85';

function fetchDaData(query, url) {
	const options = {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Token ' + DA_API_KEY
		},
		body: JSON.stringify(query)
	};

	return fetch(url, options);
}

let marker = [];
let map = [];
const polygons = [];

function initMap() {
	ymaps.ready(function() {
    const geocoderUrlApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';
		const strRestGeo = $('[data-type=data-rest-geo]').val();
		let restGeo = [55.753220, 37.622513],
      res = null,
      selectDeliveryId = null,
      selectDeliveryPrice = null,
      selectDeliveryRkId = null,
      outsideDelivery = $('[data-type=data-delivery-outside]').val();

		if (strRestGeo) {
			restGeo = strRestGeo.split(',').map(Number);
		}

		map = new ymaps.Map('map', {
			center: restGeo,
			zoom: 9,
			controls: ['zoomControl', 'geolocationControl']
		}, {
			suppressMapOpenBlock: true,
		});

		const polygonDataStr = JSON.parse($('[data-type=data-delivery-zones]').val());
		let polygonData = null;

		for (const key in polygonDataStr) {
			polygonData = JSON.parse(polygonDataStr[key].POLYGON);

			const polygon = new ymaps.Polygon(
				[polygonData],
				{
					hintContent: polygonDataStr[key].PRICE > 0 ? 'Стоимость доставки составит: ' + polygonDataStr[key].PRICE + ' руб.' : 'Бесплатная доставка',
					deliveryId: polygonDataStr[key].DELIVERY_ID,
          deliveryRkId: polygonDataStr[key].DELIVERY_RK_ID,
          deliveryPrice: polygonDataStr[key].PRICE,
				}
			);
			polygons.push(polygon);
		}

    ymaps.geoQuery(polygons).addToMap(map);

		marker = new ymaps.Placemark(map.getCenter(), {}, {
			iconLayout: 'default#image',
			iconImageHref: '/local/templates/main/assets/images/icons/navi.svg',
			iconImageSize: [30, 42],
			iconImageOffset: [-5, -38]
		});

		map.geoObjects.add(marker);

		map.events.add('click', function(e) {
			marker.geometry.setCoordinates(e.get('coords'));

			let isPolygonCheck = outsideDelivery ? true : false;

			fetchResult(e, isPolygonCheck, isPolygonCheck);
		});

		map.geoObjects.events.add('click', function(e) {
			marker.geometry.setCoordinates(e.get('coords'));

			fetchResult(e, true);
		});

		function fetchResult(e, isPolygonCheck, isOutsideDelivery = false) {
			fetchDaData({ lat: e.get('coords')[0], lon: e.get('coords')[1] }, geocoderUrlApi)
				.then(response => response.text())
				.then(result => {
					res = JSON.parse(result);
					let selectAddress = res.suggestions.length ? res.suggestions[0].value : null,
            buttonDisabled = null,
            errorBlock = $('.error-tool'),
            buttonSuccess = $('.success--js'),
            inputSearch = $('.autocomplete'),
            inputBlock = $('[data-type=input-block]'),
            deliveryTextInfo = $('[data-type=delivery-text-info]').length ? $('[data-type=delivery-text-info]').val() : 'Выбранный адрес не входит в зону доставки. Сумма доставки фиксируется менеджером';

					if (isPolygonCheck) {
            buttonDisabled = false;
            buttonSuccess.attr('data-value', selectAddress);
            if (isOutsideDelivery) {
              errorBlock.addClass('active').text(deliveryTextInfo);
              selectDeliveryId = outsideDelivery;
              selectDeliveryPrice = null;
              selectDeliveryRkId = null;
            } else {
              if (errorBlock.hasClass('active')) {
                errorBlock.removeClass('active');
              }
              selectDeliveryId = e.get('target').properties.get('deliveryId');
              selectDeliveryRkId = e.get('target').properties.get('deliveryRkId');
              selectDeliveryPrice = e.get('target').properties.get('deliveryPrice');
            }
					} else {
            errorBlock.addClass('active').text('Выбранный адрес не входит в зону доставки');
						buttonDisabled = true;
					}

          inputSearch.val(selectAddress);

          if (!selectAddress) {
            if (!errorBlock.hasClass('active')) {
              errorBlock.addClass('active');
            }

            if (inputBlock.hasClass('input--filled')) {
              inputBlock.removeClass('input--filled');
            }

            errorBlock.text('Серверу не удается определить выбранное местоположение');

            inputSearch.val('');
            buttonDisabled = true;
          }

          buttonSuccess.prop('disabled', buttonDisabled);
          inputBlock.addClass('input--filled');


          console.log(selectDeliveryId);
          console.log(selectDeliveryRkId);
				})
				.catch(error => console.log('error', error));
		}

    $(document).on('click', '.success--js', function() {
      const result = [];
      $(this).closest('.popup-inner').find('input').each(function() {
        const input = $(this)[0];
        result.push(validateField($(this), input.value));
      });
      const isNONValid = result.includes(false);
      if (isNONValid) {
        return false;
      }

      let thisObj = $(this),
        deliveryVal = thisObj.attr('data-value');

      if (selectDeliveryId) {
        $.ajax({
          type: 'POST',
          url: '/local/templates/main/include/ajax/selectDelivery.php',
          dataType: 'json',
          data: {
            deliveryId: selectDeliveryRkId,
          },
          success: function(r) {
            if (r.success === true) {
              let basePriceBlock = $('[data-type=order-price]'),
                totalPriceBlock = $('[data-type=total]'),
                calcBasePrice = basePriceBlock.attr('data-price'),
                calcTotalPrice = totalPriceBlock.attr('data-price'),
                currency = ' ₽';

              if (selectDeliveryPrice && (selectDeliveryPrice > 0)) {
                calcBasePrice = Number(basePriceBlock.attr('data-price')) + Number(selectDeliveryPrice);
                calcTotalPrice = Number(totalPriceBlock.attr('data-price')) + Number(selectDeliveryPrice);
              } else {
                selectDeliveryPrice = selectDeliveryPrice !== null ? 'Бесплатно' : 'Индивидуально';
                currency = '';
              }

              if ($('[data-type=container-delivery-price]').length) {
                $('[data-type=container-delivery-price]').replaceWith('<div data-type="container-delivery-price"><div>Доставка</div><div class="card-summ"><b><span data-type="delivery-price">' + selectDeliveryPrice + '</span>' + currency + '</b></div></div>');
              } else {
                $('[data-type=container-base-price]').append('<div data-type="container-delivery-price"><div>Доставка</div><div class="card-summ"><b><span data-type="delivery-price">' + selectDeliveryPrice + '</span>' + currency + '</b></div></div>');
              }

              basePriceBlock.text(calcBasePrice);
              totalPriceBlock.text(calcTotalPrice);

              $('.order-delivery, .order-wrapper__item--date, .order-payment').addClass('active');
              $('.tab-content.active').attr('data-delivery-id', selectDeliveryId);

              if (true) {
                // показать блок даты, если доставка возможна
                $('.order-wrapper__item--date').addClass('active');
              } else {
                // ИЛИ показать блок курьера, если доставка НЕвозможна
                $('.order-wrapper__item--taxi').addClass('active');
              }

              $('.order-delivery-adr p').text(deliveryVal);
              $('.order-delivery .input input').val(deliveryVal);
              $('.order-delivery .input').removeClass('error').find('.control-error').text('');

              myModal.close();
              return false;
            } else {
              console.log(r.errors);
            }
          }
        });
      }
    });
	});
}

function moveMarker(lat, lng) {
	let buttonDisabled = null;

	map.setCenter([lat, lng], 15);
	marker.geometry.setCoordinates([lat, lng]);

	const isContains = polygons.some((polygon) => polygon.geometry.contains([lat, lng]));

	if (!isContains) {
		$('.error-tool').addClass('active');
		buttonDisabled = true;
	} else {
		buttonDisabled = false;
	}

	$('.success--js').prop('disabled', buttonDisabled);
}

$('.autocomplete').autocomplete({
	lookup: function(query, done) {
		let res = [];
		const queryData = {query: query};
		fetchDaData(queryData, DA_URL)
			.then(response => response.text())
			.then(result => {
				res = JSON.parse(result);
				done(res);
			})
			.catch(error => console.log('error', error));
	},
	onSelect: function(suggestion) {
		$('.error-tool').removeClass('active');
		$('.success--js').attr('data-value', suggestion.value);
		moveMarker(suggestion.data.geo_lat, suggestion.data.geo_lon);

		// TODO: проверка на доступность адреса. Бэку допилить
		// if (false) {
		// 	$('.error-tool').addClass('active');
		// }
	},
	minChars: 3,
	showNoSuggestionNotice: true,
	noSuggestionNotice: 'Извините, ничего не найдено',
});

$(function() {
	if ($('#map').length) {
		initMap();
	}
});
