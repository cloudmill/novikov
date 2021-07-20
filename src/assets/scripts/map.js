export const mapStyle = [
	{
		elementType: 'geometry',
		stylers: [{
			color: '#f5f5f5'
		}]
	},
	{
		elementType: 'labels.icon',
		stylers: [{
			visibility: 'off'
		}]
	},
	{
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#616161'
		}]
	},
	{
		elementType: 'labels.text.stroke',
		stylers: [{
			color: '#f5f5f5'
		}]
	},
	{
		featureType: 'administrative.land_parcel',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#bdbdbd'
		}]
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [{
			color: '#eeeeee'
		}]
	},
	{
		featureType: 'poi',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#757575'
		}]
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [{
			color: '#e5e5e5'
		}]
	},
	{
		featureType: 'poi.park',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#9e9e9e'
		}]
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{
			color: '#ffffff'
		}]
	},
	{
		featureType: 'road.arterial',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#757575'
		}]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry',
		stylers: [{
			color: '#dadada'
		}]
	},
	{
		featureType: 'road.highway',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#616161'
		}]
	},
	{
		featureType: 'road.local',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#9e9e9e'
		}]
	},
	{
		featureType: 'transit.line',
		elementType: 'geometry',
		stylers: [{
			color: '#e5e5e5'
		}]
	},
	{
		featureType: 'transit.station',
		elementType: 'geometry',
		stylers: [{
			color: '#eeeeee'
		}]
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{
			color: '#c9c9c9'
		}]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [{
			color: '#9e9e9e'
		}]
	}
];
const mcOptions = {
	styles: [{
		url: '/local/templates/main/assets/images/icons/bubble.svg',
		width: 60,
		height: 60,
		fontFamily: 'Manrope',
		textSize: 16,
		textColor: 'black',
	}]
};

function moveMarker(map) {
	$('.mapList-item').click(function() {
		const coords = $(this).data('adr');
		const latlngStr = coords.split(',', 2);
		const lat = parseFloat(latlngStr[0]);
		const lng = parseFloat(latlngStr[1]);

		map.setCenter([lat, lng], 17);
	});
}

export function initMapRest() {
	ymaps.ready(function() {
		const map = new ymaps.Map('restYMaps', {
			center: [55.753220, 37.622513],
			zoom: 14,
			controls: ['zoomControl', 'geolocationControl']
		}, {
			suppressMapOpenBlock: true,
		});

		map.behaviors.disable('scrollZoom');

		const locations = [];
		const mapItems = $('[data-type=map-item]');
    const defaultIcon = '/local/templates/main/assets/images/icons/navi.svg';

		mapItems.each(function() {
			const dataItem = [];
			const coordItem = $(this).attr('data-adr').split(',');
			const icon = $(this).attr('data-map-icon') ? $(this).attr('data-map-icon') : defaultIcon;

			dataItem.push(Number(coordItem[0]));
			dataItem.push(Number(coordItem[1]));
			dataItem.push(icon);
			dataItem.push($(this).attr('id'));

			locations.push(dataItem);
		});

		locations.forEach((item, i) => {
			const marker = new ymaps.Placemark(
				[item[0], item[1]],
				{
					id: item[3],
				},
				{
					iconLayout: 'default#image',
					iconImageHref: item[2],
					iconImageSize: [30, 42],
					iconImageOffset: [-5, -38]
				});

			map.geoObjects.add(marker);
		});

    map.geoObjects.events.add('click', function(e) {
      let id = e.get('target').properties.get('id');
      $('#' + id).addClass('active').siblings().removeClass('active');
      $('.scrollContent').mCustomScrollbar('scrollTo', '#' + id);
    });

		const allPoints = ymaps.geoQuery(map.geoObjects);
		map.setBounds(allPoints.getBounds(), { checkZoomRange: true });

		moveMarker(map);
	});
}

function initMapYandex() {
	ymaps.ready(function() {
		const name = $('#yandexMap').data('name');
		const adr = $('#yandexMap').data('adr');
		const phone = $('#yandexMap').data('phone');
		const url = $('#yandexMap').data('url');
		const map = new ymaps.Map('yandexMap', {
			center: [55.753220, 37.622513],
			zoom: 14,
			controls: ['zoomControl', 'geolocationControl']
		}, {
			suppressMapOpenBlock: true,
		});

		map.behaviors.disable('scrollZoom');

		// на мобильных устройствах... (проверяем по userAgent браузера)
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			// ... отключаем перетаскивание карты
			map.behaviors.disable('drag');
		}

		const dataCoordStr = $('[data-type=map-data]').val();
		const dataCoordinates = dataCoordStr && JSON.parse(`${dataCoordStr}`);
		const itemIcon = $('[data-type=map-icon]').val();
		const icon = itemIcon ? itemIcon : '/local/templates/main/assets/images/icons/navi.svg';

		for (const key in dataCoordinates) {
			const coord = dataCoordinates[key].split(',');
			const marker = new ymaps.Placemark([coord[0], coord[1]], {
				balloonContent: `<div class="balloonContent"><h4>${name}</h4><p>${adr}</p><a href="tel:${phone}">${phone}</a><a href="${url}" target="_blank">${url}</a></div>`
			}, {
				iconLayout: 'default#image',
				iconImageHref: icon,
				iconImageSize: [30, 42],
				iconImageOffset: [-5, -38],
				balloonCloseButton: false,
				hideIconOnBalloonOpen: false
			});

			marker.events.add('click', function(e) {
				const href = marker.options._options.iconImageHref;
				if (href === icon) {
					e.get('target').options.set('iconImageHref', '/local/templates/main/assets/images/icons/navi-red.svg');
				} else {
					e.get('target').options.set('iconImageHref', icon);
				}
			});

			map.geoObjects.add(marker);
		}
		const allPoints = ymaps.geoQuery(map.geoObjects);
		map.setBounds(allPoints.getBounds(), { checkZoomRange: true });
	});
}

$(function() {
	if ($('#yandexMap').length) {
		initMapYandex();
	}
});
