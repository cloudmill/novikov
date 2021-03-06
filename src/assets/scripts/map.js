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

export function initMapRest() {
	ymaps.ready(function() {
		const map = new ymaps.Map('restYMaps', {
			center: [66.413923, 94.241914],
			zoom: 3,
			controls: ['zoomControl', 'geolocationControl']
		}, {
      maxZoom: 20,
			suppressMapOpenBlock: true,
		});

		map.behaviors.disable('scrollZoom');

		const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
			'<div style="color: #FFFFFF; font-weight: bold;margin-top: 3px">{{ properties.geoObjects.length }}</div>'
		);
    const clusterer = new ymaps.Clusterer({
			clusterIcons: [
        {
          href: '/local/templates/main/assets/images/icons/navi-e.svg',
          size: [50, 58],
          offset: [-10, -45],
        },
      ],
			clusterIconContentLayout: MyIconContentLayout,
		});

		const locations = [];
		const mapItems = $('[data-type=map-item]');
		const icon = '/local/templates/main/assets/images/icons/navi.svg';
		const iconActive = '/local/templates/main/assets/images/icons/navi-red.svg';
		const placemarks = {};
    const polygonsCollection = new ymaps.GeoObjectCollection();

    let prevSelectPlacemark = null;

		mapItems.each(function() {
			const dataItem = [];
			const coordItem = $(this).attr('data-adr').split(',');
			dataItem.push(Number(coordItem[0]));
			dataItem.push(Number(coordItem[1]));
			dataItem.push($(this).attr('id'));
			dataItem.push($(this).attr('data-name'));
			dataItem.push($(this).attr('data-address'));
			dataItem.push($(this).attr('data-phone'));
			dataItem.push($(this).attr('data-site'));

			locations.push(dataItem);
		});

		locations.forEach((item) => {
      placemarks[item[2]] = new ymaps.Placemark(
				[item[0], item[1]],
				{
					id: item[2],
					balloonContent: `<div class="balloonContent"><h4>${item[3]}</h4><p>${item[4]}</p><a href="tel:">${item[5]}</a><a href="${item[6]}" target="_blank">${item[6]}</a></div>`,
				},
				{
					iconLayout: 'default#image',
					iconImageHref: icon,
					iconImageSize: [50, 58],
					iconImageOffset: [-10, -45],
					balloonCloseButton: false,
					hideIconOnBalloonOpen: false,
				}
			);

			clusterer.add(placemarks[item[2]]);

      polygonsCollection.add(clusterer);

      placemarks[item[2]].events.add('click', function(e) {
        if (prevSelectPlacemark) {
          prevSelectPlacemark.options.set('iconImageHref', icon);
        }

        prevSelectPlacemark = placemarks[item[2]];

        const href = placemarks[item[2]].options._options.iconImageHref;
        const id = e.get('target').properties.get('id');
        if (href === icon) {
          e.get('target').options.set('iconImageHref', iconActive);
        } else {
          e.get('target').options.set('iconImageHref', icon);
        }

        $('#' + id).addClass('active').siblings().removeClass('active');
        $('.scrollContent').mCustomScrollbar('scrollTo', '#' + id);
      });

      map.events.add('click', e => e.get('target').balloon.close());
		});

    map.geoObjects.add(polygonsCollection);

    map.events.add('balloonclose', function() {
      prevSelectPlacemark.options.set('iconImageHref', icon);
    });

    $('[data-type=map-item]').click(function() {
      const coords = $(this).data('adr');
      const latlngStr = coords.split(',', 2);
      const lat = parseFloat(latlngStr[0]);
      const lng = parseFloat(latlngStr[1]);
      const id = $(this).attr('id');

      $(this).addClass('active').siblings().removeClass('active');

      if (prevSelectPlacemark) {
        prevSelectPlacemark.options.set('iconImageHref', icon);
      }

      prevSelectPlacemark = placemarks[id];
      map.setCenter([lat, lng], 20);
      placemarks[id].balloon.open();
    });

    map.setBounds(polygonsCollection.getBounds());
	});
}

function initMapYandex() {
	ymaps.ready(function() {
		const map = new ymaps.Map('yandexMap', {
			center: [55.753220, 37.622513],
			zoom: 14,
			controls: ['zoomControl', 'geolocationControl']
		}, {
			suppressMapOpenBlock: true,
		});

		map.behaviors.disable('scrollZoom');

		// ???? ?????????????????? ??????????????????????... (?????????????????? ???? userAgent ????????????????)
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			// ... ?????????????????? ???????????????????????????? ??????????
			map.behaviors.disable('drag');
		}

		const pointData = JSON.parse($('[data-type=map-data]').val());
		const icon = '/local/templates/main/assets/images/icons/navi.svg';

		for (const key in pointData) {
			const coord = pointData[key].COORDINATES.split(',');
			const address = pointData[key].ADDRESS ? '<p>'+pointData[key].ADDRESS+'</p>' : '';
			const phone = '';
			const site = '';

			if (pointData[key].PHONE) {
        for (const keyPhone in pointData[key].PHONE) {
          phone += '<a href="tel:' + pointData[key].PHONE[keyPhone] + '">'+ pointData[key].PHONE[keyPhone] +'</a>';
        }
      }

			if (pointData[key].SITE) {
        for (const keySite in pointData[key].SITE) {
          site += '<a href="' + pointData[key].SITE[keySite] + '" target="_blank">' + pointData[key].SITE[keySite] + '</a>';
        }
      }

      const marker = new ymaps.Placemark([coord[0], coord[1]], {
				balloonContent: `<div class="balloonContent"><h4>${pointData[key].NAME}</h4>${address + phone + site}</div>`
			}, {
				iconLayout: 'default#image',
				iconImageHref: icon,
				iconImageSize: [50, 58],
				iconImageOffset: [-10, -45],
				balloonCloseButton: false,
				hideIconOnBalloonOpen: false,
			});

			marker.events.add('click', function(e) {
				const href = marker.options._options.iconImageHref;
				if (href === icon) {
					e.get('target').options.set('iconImageHref', '/local/templates/main/assets/images/icons/navi-red.svg');
				} else {
					e.get('target').options.set('iconImageHref', icon);
				}
			});
			map.events.add('balloonclose', function() {
				marker.options.set('iconImageHref', icon);
			});

			map.events.add('click', e => e.get('target').balloon.close());

			map.geoObjects.add(marker);
		}
		const allPoints = ymaps.geoQuery(map.geoObjects);
		map.setBounds(allPoints.getBounds(), {checkZoomRange: true});
	});
}

$(function() {
	if ($('#yandexMap').length) {
		initMapYandex();
	}
	// ?????? ?????? ???????????????????????? ?????????????? ???? ???????????????? restaurants.html. ???????? ???????????? ????????, ??????????????????????!
	// if ($('#restYMaps').length) {
		// initMapRest();
	// }
});
