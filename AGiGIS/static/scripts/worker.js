// ******ФУНКЦИЯ ДЛЯ РАСКРЫТИЯ СПИСКОВ МЕТОДОВ *********
function showElement(id){
	const element = document.getElementById(id)
	if (element.hidden === true){
		element.hidden = false;
	}
	else{
		element.hidden = true;
	}
};
// ******************************************************
//***************** ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ КАРТЫ *********
var map = L.map('map', {
	center: [55.7124, 37.6080],
	zoom: 16,
	minZoom: 2,
	maxZoom: 22,
	zoomDelta: 1,
	zoomSnap: 1,
	maxNativeZoom: 19, // Увеличил для OSM
	fullscreenControl: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Картографический сервис',
	maxZoom: 19
}).addTo(map);
//**********************************************************
map.addControl(new L.Control.FullScreen({
	title: {
		'false': 'Полноэкранный режим',
		'true': 'Выйти из полноэкранного режима'
	}
}));


// Создание кастомной иконки
function createCustomIcon(color) {
	let url = `../static/icons/icon_${color}.png`;
	return L.icon({
		iconUrl: url,
		iconSize: [20, 20],
		iconAnchor: [10, 30],
		popupAnchor: [0, -30]
	});
}

// Обновление цвета маркера
window.updateMarkerColor = function (color, markerId) {
	const marker = map._layers[markerId];
	if (marker) {
		marker.setIcon(createCustomIcon(color));
	}
};

// Обновление круга (радиус, комментарий, цвет)
window.updateCircle = function (circleId) {
	const circle = map._layers[circleId];
	const radiusInput = document.getElementById(`radiusInput_${circleId}`);
	const commentInput = document.getElementById(`commentInput_${circleId}`);
	const colorInput = document.getElementById(`colorInput_${circleId}`);

	if (circle && radiusInput && commentInput && colorInput) {
		const newRadius = parseInt(radiusInput.value);
		const newComment = commentInput.value;
		const newColor = colorInput.value;

		circle.setRadius(newRadius);
		circle.setStyle({ color: newColor, fillColor: newColor });

		const popupContent = `
			<strong>Комментарий:</strong> ${newComment}<br>
			<button onclick="deleteCircle(${circleId})">Удалить круг</button>
		`;
		circle.bindPopup(popupContent);
	}
};

// Удаление круга
window.deleteCircle = function (circleId) {
	const circle = map._layers[circleId];
	if (circle) {
		map.removeLayer(circle);
	}
};

// Добавление круга к маркеру
window.drawRadius = function (markerId) {
	const marker = map._layers[markerId];
	if (!marker) return;

	const latlng = marker.getLatLng();
	const circleId = Date.now(); // Уникальный ID
	const radius = parseInt(document.getElementById(`radiusValue_${markerId}`).value) || 100;
	const color = document.getElementById(`circleColor_${markerId}`).value || '#00FF00';
	const comment = document.getElementById(`circleComment_${markerId}`).value || '';

	const circle = L.circle(latlng, {
		radius: radius,
		color: color,
		fillColor: color,
		fillOpacity: 0.2
	}).addTo(map);

	const popupContent = `
<strong>Комментарий:</strong> ${comment}<br>
<button onclick="deleteCircle(${circle._leaflet_id})">Удалить круг</button>
`;
	circle.bindPopup(popupContent).openPopup();
};

// Форма для ввода координат
let marker_for_point;
document.getElementById('coordinatesForm').addEventListener('submit', function (e) {
	e.preventDefault();
	const point = document.getElementById('point').value.split(',').map(Number);
	if (marker_for_point) map.removeLayer(marker_for_point);

	marker_for_point = L.marker(point, { icon: createCustomIcon('black') }).addTo(map);
	const markerId = marker_for_point._leaflet_id;

	const popupContent = getMarkerPopupContent(point[0], point[1], markerId);
	marker_for_point.bindPopup(popupContent).openPopup();
	map.setView(point, 8);
});

// Двойной клик по карте
let user_markers = [];
map.on('dblclick', function (e) {
	let marker = new L.Marker(e.latlng, { icon: createCustomIcon('black'), draggable: true }).addTo(map);
	const markerId = marker._leaflet_id;

	const popupContent = getMarkerPopupContent(e.latlng.lat, e.latlng.lng, markerId);
	marker.bindPopup(popupContent).openPopup();
	user_markers.push(marker);
});

map.doubleClickZoom.disable();

// HTML-контент для попапа маркера
function getMarkerPopupContent(lat, lng, markerId) {
	return `
<div>
<strong>Координаты:</strong><br>Широта: ${lat}<br>Долгота: ${lng}<br><br>
<strong>Цвет метки:</strong><br>
<div class="d-flex gap-1">
${['red', 'orange', 'blue', 'green', 'grey', 'black'].map(color =>
	`<div class='rounded-circle' style="width: 25px; height: 25px; background: ${color}; cursor: pointer"
onclick="updateMarkerColor('${color}', ${markerId})"></div>`).join('')}
</div><br>
<label>Цвет круга:</label>
<input type="color" id="circleColor_${markerId}" value="#00FF00" class="form-control form-control-sm mb-1">

<label>Комментарий к кругу:</label>
<input type="text" id="circleComment_${markerId}" class="form-control form-control-sm mb-1">

<label>Радиус (м):</label>
<input type="number" id="radiusValue_${markerId}" min="1" value="100" class="form-control form-control-sm mb-2">

<button onclick="drawRadius(${markerId})" class="btn btn-primary btn-sm">Добавить круг</button>
</div>`;
}
// **************************************************************************ы
// ******ФУНКЦИЯ ДЛЯ ПОСТРОЕНИЯ МАРШРУТА*********
function drawRoute(points) {
	if (points.length === 0) return;

	var latLngs = points.map(p => L.latLng(p[0], p[1]));
	var polyline = L.polyline(latLngs, {color: 'blue', weight: 5}).addTo(map);

	L.marker(latLngs[0], {icon: createCustomIcon('black')}).addTo(map).bindPopup("Старт");
	L.marker(latLngs[latLngs.length-1], {icon: createCustomIcon('black')}).addTo(map).bindPopup("Конец");

	map.fitBounds(polyline.getBounds(), {maxZoom: 4, minZoom: 4});
}


document.addEventListener('DOMContentLoaded', function() {
	drawRoute(routePoints);
});

// ******************************************************
// ******ФУНКЦИЯ ДЛЯ ОБРАБОТКИ ГЕОХЭША*********
const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

document.getElementById('decodeForm').addEventListener('submit', function (e) {
	e.preventDefault();
	const inputValue = document.getElementById('geohash').value;
	const button = e.submitter;
	const action = button.getAttribute('action');
	if (action === 'decodeAction') {
		decode_value = decode(inputValue);
		console.log(inputValue);
		document.getElementById('result_geohash').innerHTML = `
<p>Результат: <br><strong>Широта: ${decode_value.lat} <br>Долгота: ${decode_value.lon}</strong></p>
`;
	} else {
		var encode_value = inputValue.split(',').map(Number);
		encode_value = encode(encode_value[0], encode_value[1]);
		document.getElementById('result_geohash').innerHTML = `
<p>Результат: <strong>${encode_value}</strong></p>
`;
	}
})

// **************************ОТРИСОВКА ОБЛАСТИ ОТ ГЕОХЕША**************************
document.getElementById('areaForm').addEventListener('submit', function (e) {
	e.preventDefault();
	const inputValue = document.getElementById('geohash_for_area').value;
	const geohash = bounds2(inputValue);
	L.rectangle([[geohash.sw.lat, geohash.sw.lon], [geohash.ne.lat, geohash.ne.lon]], {
		color: "#ff0000",
		weight: 10,
		fillOpacity: 0.2
	}).addTo(map);

	map.fitBounds([[geohash.sw.lat, geohash.sw.lon], [geohash.ne.lat, geohash.ne.lon]], {maxZoom: 8, minZoom: 4});
});

// *****************ФУНКЦИЯ КОДИРОВАНИЯ ГЕОХЭША************************
function encode(lat,lon,precision){
	if (typeof precision=='undefined'){
		for (let p=1; p<=12; p++){
			const hash = encode(lat,lon,p);
			const posn = decode(hash);
			if (posn.lat==lat && posn.lon==lon) return hash;
		}
		precision = 12;
	}
	lat = Number(lat);
	lon = Number(lon);
	precision = Number(precision);
	if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');
	let idx = 0;
	let bit = 0;
	let evenBit = true;
	let geohash = '';
	let latMin = -90, latMax = 90;
	let lonMin = -180, lonMax = 180;
	while (geohash.length < precision){
		if (evenBit){
			const lonMid = (lonMin + lonMax) / 2;
			if (lon>=lonMid){
				idx = idx2 + 1;
				lonMin = lonMid;
			}else{
				idx = idx2;
				lonMax = lonMid;
			}
		} else {
			const latMid = (latMin + latMax) /2;
			if (lat >=latMid){
				idx = idx2+1;
				latMin = latMid;
			}else{
				idx = idx2;
				latMax = latMid;
			}
		}
		evenBit = !evenBit;
		if(++bit==5){
			geohash += base32.charAt(idx);
			bit=0;
			idx=0;
		}
	}
	return geohash;
}
// ****************************************************
// ****************ФУНКЦИЯ РАСКОДИРОВАНЯ ГЕОХЭША************************
function decode(geohash){
	const work_bounds = bounds2(geohash);
	const latMin = work_bounds.sw.lat, lonMin = work_bounds.sw.lon;
	const latMax = work_bounds.ne.lat, lonMax = work_bounds.ne.lon;
	let lat = (latMin+latMax)/2;
	let lon = (lonMin+lonMax)/2;
	lat = lat.toFixed(Math.floor(2-Math.log(latMax-latMin)/Math.LN10));
	lon = lon.toFixed(Math.floor(2-Math.log(lonMax-lonMin)/Math.LN10));
	return { lat:Number(lat), lon:Number(lon) };
}
// ****************************************************
// ****************ФУНКЦИЯ ОБЛАСТИ ГЕОХЭША?************************
function bounds2(geohash){
	console.log(geohash);
	if (geohash.length == 0) throw new Error('Invalid geohash')
	geohash = geohash.toLowerCase();
	let evenBit = true;
	let latMin = -90, latMax = 90;
	let lonMin = -180, lonMax = 180;
	for (let i=0; i<geohash.length; i++){
		const chr = geohash.charAt(i);
		const idx = base32.indexOf(chr);
		if (idx == -1) throw new Error('Invalid geohash');
		for (let n=4; n>=0; n--){
			const bitN = idx >> n & 1;
			if (evenBit){
				const lonMid = (lonMin+lonMax)/2;
				if (bitN==1){
					lonMin = lonMid;
				}else{
					lonMax=lonMid;
				}
			}else{
				const latMid = (latMin+latMax)/2;
				if (bitN == 1){
					latMin = latMid;
				}else{
					latMax = latMid;
				}
			}
			evenBit = !evenBit;
		}
	}
	const bounds3 = {
		sw:{ lat:latMin, lon:lonMin },
		ne:{ lat: latMax, lon: lonMax }
	}
	console.log(bounds3);
	return bounds3;
}
// ************************************************************************
function zip(arrays) {
	return arrays[0].map(function (_, i) {
		return arrays.map(function (array) {
			return array[i]
		})
	});
}

function getRandomColor(id) {
	var colors = [
		'red', 'blue', 'green', 'orange', 'purple', 'brown', 'cyan', 'magenta', 'lime', 'yellow'
	];
	return colors[id % colors.length];
}

// Функция декодирования геохеша в диапазон широты и долготы
function decodeGeohash(geohash) {
	var evenBit = true;
	var lat = [-90.0, 90.0];
	var lon = [-180.0, 180.0];
	for (var i = 0; i < geohash.length; i++) {
		var c = geohash[i];
		var cd = base32.indexOf(c);
		if (cd === -1) return null; // неверный символ
		for (var mask = 16; mask > 0; mask = mask >> 1) {
			if (evenBit) {
				// Longitude
				var mid = (lon[0] + lon[1]) / 2;
				if ((cd & mask) != 0) lon[0] = mid;
				else lon[1] = mid;
			} else {
				// Latitude
				var mid = (lat[0] + lat[1]) / 2;
				if ((cd & mask) != 0) lat[0] = mid;
				else lat[1] = mid;
			}
			evenBit = !evenBit;
		}
	}
	return { minLat: lat[0], maxLat: lat[1], minLon: lon[0], maxLon: lon[1] };
}

function loadCSV() {
	const fileInput = document.getElementById('fileInput');
	const file = fileInput.files[0];
	const visualizationType = document.getElementById('visualizationType').value;
	if (!file) {
		alert("Выберите файл!");
		return;
	}
	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		complete: function (results) {
			const data = results.data;
			// Удаляем предыдущие слои
			map.eachLayer(layer => {
				if ( layer instanceof L.Marker || layer instanceof
				L.Polyline || layer instanceof L.HeatLayer || layer instanceof L.Polygon ) {
					map.removeLayer(layer);
				}
			});
			if (visualizationType === "markers") {
				data.forEach(row => {
					if (row.x && row.y) {
						const lat = parseFloat(row.y);
						const lng = parseFloat(row.x);
						if (isNaN(lat) || isNaN(lng)) return;
						const marker = L.marker([lat, lng], { icon: createCustomIcon('black'), draggable: true }).addTo(map);
						const markerId = marker._leaflet_id;
						// Круг из CSV (если есть)
						if (row.circle && row.color) {
							const radius = parseFloat(row.circle);
							const circleColor = row.color.trim();
							if (!isNaN(radius) && circleColor) {
								const circle = L.circle([lat, lng], {
									radius: radius,
									color: circleColor,
									fillColor: circleColor,
									fillOpacity: 0.3
								}).addTo(map);
								const circleId = circle._leaflet_id;
								const circlePopup = `
<strong>Комментарий:</strong> ${row.comment || '(не указан)'}<br>
<label>Изменить радиус:</label
<input type="number" id="radiusInput_${circleId}" value="${radius}" class="form-control form-control-sm mb-1"><br>
<label>Цвет круга:</label>
<input type="color" id="colorInput_${circleId}" value="${circleColor}" class="form-control form-control-sm mb-1"><br>
<label>Комментарий:</label>
<input type="text" id="commentInput_${circleId}" value="${row.comment || ''}" class="form-control form-control-sm mb-1"><br>
<button class="btn btn-sm btn-primary" onclick="updateCircle(${circleId})">Обновить</button>
<button class="btn btn-sm btn-danger" onclick="deleteCircle(${circleId})">Удалить круг</button

`;
								circle.bindPopup(circlePopup);
							}
						}
						// Попап маркера
						const popup = getMarkerPopupContent(lat, lng, markerId);
						marker.bindPopup(popup);
					}
				});
			} else if (visualizationType === "route") {
				const routes = {};
				data.forEach(row => {
					if (row.id && row.x && row.y) {
						const lat = parseFloat(row.y);
						const lng = parseFloat(row.x);
						if (isNaN(lat) || isNaN(lng)) return;
						if (!routes[row.id]) routes[row.id] = [];
						routes[row.id].push([lat, lng]);
					}
				});
				Object.keys(routes).forEach(id => {
					const polyline = L.polyline(routes[id], { color: 'red', weight: 5 }).addTo(map);
					map.fitBounds(polyline.getBounds(), { maxZoom: 4, minZoom: 4 });
				});
			} else if (visualizationType === "heatmap") {
				const maxIntensity = Math.max(...data.map(row => parseFloat(row.weight) || 1));
				const heatData = data.map(row => [
					parseFloat(row.y),
					parseFloat(row.x),
					(parseFloat(row.weight) || 1) / maxIntensity
				]);
				L.heatLayer(heatData, { radius: 25, blur: 15 }).addTo(map);
			} else if (visualizationType === "polygon") {
				const latlngs = data.map(row => [parseFloat(row.y), parseFloat(row.x)]);
				L.polygon(latlngs, { color: 'red' }).addTo(map);
				map.fitBounds(L.polygon(latlngs).getBounds());
			} else if (visualizationType === "geohash") {
				const polygons = [];
				data.forEach(row => {
					if (row.geohash) {
						const bounds = decodeGeohash(row.geohash);
						if (!bounds) return;
						const sw = [bounds.minLat, bounds.minLon];
						const se = [bounds.minLat, bounds.maxLon];
						const ne = [bounds.maxLat, bounds.maxLon];
						const nw = [bounds.maxLat, bounds.minLon];
						const polygon = L.polygon([sw, se, ne, nw], { color: 'blue', weight: 2, fillOpacity: 0.3 }).addTo(map);
						polygons.push(polygon);
					}
				});
				if (polygons.length > 0) {
					const group = L.featureGroup(polygons);
					map.fitBounds(group.getBounds());
				}
			}
		}
	});
}

let currentLayers = []

async function loadGeoJSON(url, color, name) {
	try {
		const response = await fetch(url);
		const geojson = await response.json();
		const layer = L.geoJSON(geojson, {
			style: {
				fillColor: color,
				color: color,
				weight: 2,
				opacity: 0.8,
				fillOpacity: 0.4
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties && feature.properties.name) {
					layer.bindPopup(feature.properties.name);
				} else {
					layer.bindPopup(name);
				}
			}
		}).addTo(map);
		return layer;
	} catch (error) {
		console.error('Ошибка загрузки GeoJSON', error)
	}
}

async function loadRegionsByLayer() {
	clearLayers();
	const layerName = document.getElementById('layerSelector').value
	const yearName = document.getElementById('year_list').value
	const quarterName =
	document.getElementById('quarter_list').value
	try {
		const response = await fetch(`/api/regions/${layerName}/${yearName}/${quarterName}`);
		const regions = await response.json();
		console.log(regions)
		for (const region of regions) {
			const geoJSONUrl = region.geojson_file;
			const layer = await loadGeoJSON(geoJSONUrl, region.color, region.name);
			if (layer) {
				currentLayers.push(layer);
			}
		}
		if (currentLayers.length > 0) {
			const group = new L.featureGroup(currentLayers);
			map.fitBounds(group.getBounds());
		}
	} catch (error) {
		console.error('Ошибка загрузки регионов:', error);
	}
}

// Функция очистки слоев
function clearLayers() {
	currentLayers.forEach(layer => map.removeLayer(layer));
	currentLayers = [];
}

// Обработчик изменения выбора слоя
document.getElementById('layerSelector').addEventListener('change', function(e) {
	const selectedLayer = e.target.value;
	if (selectedLayer) {
		loadRegionsByLayer();
	} else {
		clearLayers();
	}
});

document.getElementById('year_list').addEventListener('change', function(e) {
	loadRegionsByLayer();
});

document.getElementById('quarter_list').addEventListener('change', function(e) {
	loadRegionsByLayer();
});