import 'devbridge-autocomplete';
import {mapStyle} from './map';
import {validateField} from './input';
import {myModal} from './popup';

const DA_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
const DA_API_KEY = '4ea50958b736a6ac3b71ab59a97b96202ace7e85';

function fetchDaData(query) {
	const options = {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Token ' + DA_API_KEY
		},
		body: JSON.stringify({query: query})
	};

	return fetch(DA_URL, options);
}

let marker = [];
let map = [];

function initMap() {
	const mapOptions = {
		center: new google.maps.LatLng(59.91916157, 30.3251195),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		zoomControl: true,
		scrollwheel: false,
		styles: mapStyle,
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	marker = new google.maps.Marker({
		icon: 'assets/images/icons/navi.svg',
		map: map,
	});

}

function moveMarker(lat, lng) {
	marker.setPosition(new google.maps.LatLng(lat, lng));
	map.panTo(new google.maps.LatLng(lat, lng));
}

$('.autocomplete').autocomplete({
	lookup: function(query, done) {
		let res = [];
		fetchDaData(query)
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
		if (false) {
			$('.error-tool').addClass('active');
		}
	},
	minChars: 3,
	showNoSuggestionNotice: true,
	noSuggestionNotice: 'Извините, ничего не найдено',
});

$('.success--js').click(function() {
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

	$('.order-delivery-adr p').text($(this).data('value'));

	myModal.close();
	return false;
});

$(function() {
	if ($('#map').length) {
		initMap();
	}
});