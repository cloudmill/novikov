import 'devbridge-autocomplete';
// import {mapStyle} from './map';
import {validateField} from './input';
import {myModal} from './popup';

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
let polygon = [];

function initMap() {
  ymaps.ready(function() {
    let strRestGeo = $('[data-type=data-rest-geo]').val(),
      restGeo = [55.753220, 37.622513],
      geocoderUrlApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
      res = null,
      errorTool = $('.error-tool'),
      buttonSuccess = $('.success--js'),
      buttonDisabled = null,
      selectAddress = null;

    if (strRestGeo) {
      restGeo = strRestGeo.split(',').map(Number);
    }

    map = new ymaps.Map('map', {
      center: restGeo,
      zoom: 14
    }, {
      searchControlProvider: 'yandex#search'
    });

    let polygonDataStr = $('[data-type=data-delivery-zones]').val();

    let polygonData = JSON.parse(`[${polygonDataStr}]`);

    polygon = new ymaps.Polygon([polygonData]);

    map.geoObjects.add(polygon);

    polygon.options.setParent(map.options);
    polygon.geometry.setMap(map);

    marker = new ymaps.Placemark(map.getCenter(), {}, {
      iconLayout: 'default#image',
      iconImageHref: '/local/templates/main/assets/images/icons/navi.svg',
      iconImageSize: [30, 42],
      iconImageOffset: [-5, -38]
    });

    map.geoObjects.add(marker);

    map.events.add('click', function (e) {
      marker.geometry.setCoordinates(e.get('coords'));

      fetchDaData({ lat: e.get('coords')[0], lon: e.get('coords')[1] }, geocoderUrlApi)
        .then(response => response.text())
        .then(result => {
          res = JSON.parse(result);
          selectAddress = res.suggestions[0].value;

          if (polygon.geometry.contains(e.get('coords'))) {
            if (errorTool.hasClass('active')) {
              errorTool.removeClass('active');
            }
            buttonDisabled = false;

            buttonSuccess.attr('data-value', selectAddress);
          } else {
            errorTool.addClass('active');
            buttonDisabled = true;
          }
          buttonSuccess.prop('disabled', buttonDisabled);

          $('.autocomplete').val(selectAddress);
        })
        .catch(error => console.log("error", error));
    });
  });
}

function moveMarker(lat, lng) {
  let buttonDisabled = null;

  map.setCenter([lat, lng], 15);
  marker.geometry.setCoordinates([lat, lng]);

  if (!polygon.geometry.contains([lat, lng])) {
    $('.error-tool').addClass('active');
    buttonDisabled = true;
  } else {
    buttonDisabled = false;
  }

  $('.success--js').prop('disabled', buttonDisabled);
}

$('.autocomplete').autocomplete({
  lookup: function(query, done) {
    let res = [],
      queryData = {query: query};
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

  $('.order-delivery, .order-wrapper__item--date, .order-payment').addClass('active');

  if (true) {
    // показать блок даты, если доставка возможна
    $('.order-wrapper__item--date').addClass('active');
  } else {
    // ИЛИ показать блок курьера, если доставка НЕвозможна
    $('.order-wrapper__item--taxi').addClass('active');
  }

  $('.order-delivery-adr p').text($(this).attr('data-value'));

  myModal.close();
  return false;
});

$(function() {
  if ($('#map').length) {
    initMap();
  }
});
