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
const polygons = [];

function initMap() {
  ymaps.ready(function() {
    let strRestGeo = $('[data-type=data-rest-geo]').val(),
      restGeo = [55.753220, 37.622513],
      geocoderUrlApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
      res = null,
      selectAddress = null;

    if (strRestGeo) {
      restGeo = strRestGeo.split(',').map(Number);
    }

    map = new ymaps.Map('map', {
      center: restGeo,
      zoom: 14,
      controls: ['zoomControl', 'geolocationControl']
    }, {
      suppressMapOpenBlock: true,
    });
    
    //console debug

    window.debMap = map;

    //console debug

    let polygonDataStr = $('[data-type=data-delivery-zones]').val(),
      polygonDataStrArr = polygonDataStr.split(';'),
      polygonData = null,
      counter = 0;

    for (let key in polygonDataStrArr) {
      polygonData = JSON.parse(`[${polygonDataStrArr[key]}]`);
      let polygon = new ymaps.Polygon([polygonData]);
      polygons.push(polygon);
      map.geoObjects.add(polygons[counter]);
      polygons[counter].options.setParent(map.options);
      polygons[counter].geometry.setMap(map);

      counter++;
    }

    marker = new ymaps.Placemark(map.getCenter(), {}, {
      iconLayout: 'default#image',
      iconImageHref: '/local/templates/main/assets/images/icons/navi.svg',
      iconImageSize: [30, 42],
      iconImageOffset: [-5, -38]
    });

    map.geoObjects.add(marker);

    map.events.add('click', function (e) {
      marker.geometry.setCoordinates(e.get('coords'));

      fetchResult(e, false);
    });

    map.geoObjects.events.add('click', function (e) {
      marker.geometry.setCoordinates(e.get('coords'));

      fetchResult(e, true);
    });

    function fetchResult(e, isPolygonCheck) {
      fetchDaData({ lat: e.get('coords')[0], lon: e.get('coords')[1] }, geocoderUrlApi)
        .then(response => response.text())
        .then(result => {
          res = JSON.parse(result);
          selectAddress = res.suggestions[0].value;

          let buttonDisabled = null;

          if (isPolygonCheck) {
            if ($('.error-tool').hasClass('active')) {
              $('.error-tool').removeClass('active');
            }
            buttonDisabled = false;

            $('.success--js').attr('data-value', selectAddress);
          } else {
            $('.error-tool').addClass('active');
            buttonDisabled = true;
          }

          $('.success--js').prop('disabled', buttonDisabled);

          $('.autocomplete').val(selectAddress);
        })
        .catch(error => console.log("error", error));
    }
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
  $('.order-delivery .input input').val($(this).data('data-value'));
  $('.order-delivery .input').removeClass('error').find('.control-error').text('');

  myModal.close();
  return false;
});

$(function() {
  if ($('#map').length) {
    initMap();
  }
});
