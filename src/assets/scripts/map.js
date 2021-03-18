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
	  url: 'assets/images/icons/bubble.svg',
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

		// marker.setPosition(new google.maps.LatLng(lat, lng));
		map.panTo(new google.maps.LatLng(lat, lng));
	});
}

function initMapRest() {
	const markers = [];
	const mapOptions = {
		center: new google.maps.LatLng(59.91916157, 30.3251195),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		zoomControl: true,
		scrollwheel: false,
		styles: mapStyle,
	};
	const map = new google.maps.Map(document.getElementById('pvz_map'), mapOptions);

	const content = [];
	const locations = [
		[59.91701049, 30.31812429, 'assets/images/icons/bubble-1.svg'],
		[59.91916157, 30.3251195, 'assets/images/icons/bubble-2.svg'],
		[59.91756978, 30.31812429, 'assets/images/icons/bubble-3.svg'],
		[59.92049517, 30.33250093, 'assets/images/icons/bubble-1.svg'],
		[59.91701049, 30.3276515, 'assets/images/icons/bubble-2.svg'],
		[59.91831049, 30.31812429, 'assets/images/icons/bubble-3.svg'],
		[59.91836157, 30.3251195, 'assets/images/icons/bubble-1.svg'],
		[59.91836978, 30.31812429, 'assets/images/icons/bubble-2.svg'],
		[59.92839517, 30.33250093, 'assets/images/icons/bubble-3.svg'],
		[59.91831049, 30.3276515, 'assets/images/icons/bubble-1.svg'],
	];
	const hrefId = [
		'section11',
		'section21',
		'section31',
		'section41',
		'section51',
		'section12',
		'section22',
		'section32',
		'section42',
		'section52',
	];

	const list = $('.pvz_list');
	const items = list.find('span');
	// const pvz_price = $('input[name=pvz_price]').val();
	// const pvz_time = $('input[name=pvz_time]').val();
	const itemRadio = [];

	items.each(function() {
		const item = $(this);
		const id = item.attr('data-id');
		const name = item.attr('data-name');
		const phone = item.attr('data-phone');
		const adr = item.attr('data-adr');
		const time = item.attr('data-time');
		let coord = item.attr('data-map');

		coord = coord.split(',');
		coord['0'] = parseFloat(coord['0']);
		coord['1'] = parseFloat(coord['1']);

		locations[locations.length] = coord;
		content.push('<h6>' + name + '</h6> <p>' + phone + '  <br /> ' + adr + '  <br /> ' + time + '</p>');

		itemRadio.push('<div class="radio"><input class="city" type="radio" id="point' + itemRadio.length + '" name="pvz_radio" value="' + id + '"><label class="label" for="point' + itemRadio.length + '"><b>' + name + '</b><br/>' + adr + '</label></div>');
	});


	let marker;
	locations.forEach((item, i) => {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(item[0], item[1]),
			icon: item[2],
			map: map,
			id: i
		});
		marker.set('data-href', hrefId[i]);
		markers.push(marker);

		google.maps.event.addListener(marker, 'click', (function() {
			return function() {
			  $('.mapList-item').removeClass('active');
			  $('#' + hrefId[i]).addClass('active');
				$('.scrollContent').mCustomScrollbar('scrollTo', '#' + hrefId[i]);
				return false;
			};
		})(marker));
	});

	const markerCluster = new MarkerClusterer(map, markers, mcOptions);

	if (locations.length) {
		map.setCenter({
			lat: locations['0']['0'],
			lng: locations['0']['1']
		});
	}

	if (parseFloat(list.attr('data-zoom')) > 0) {
		map.setZoom(parseFloat(list.attr('data-zoom')));
	}

	moveMarker(map);
}

function initMap() {
	const markers = [];
	const mapOptions = {
		center: new google.maps.LatLng(59.91916157, 30.3251195),
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		zoomControl: true,
		scrollwheel: false,
		styles: mapStyle,
	};
	const map = new google.maps.Map(document.getElementById('oneMap'), mapOptions);
	const locations = [
		[59.91701049, 30.31812429, 'assets/images/icons/bubble-1.svg'],
	];
	let marker;
	locations.forEach((item, i) => {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(item[0], item[1]),
			icon: item[2],
			map: map,
			id: i
		});
		markers.push(marker);
	});
}

$(function() {
	if ($('#pvz_map').length) {
		initMapRest();
	}
	if ($('#oneMap').length) {
		initMap();
	}
});
