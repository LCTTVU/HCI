// Initialize the map centered on Madrid
var map = L.map('map').setView([40.417, -3.703], 16); // Madrid coordinates (latitude, longitude) and zoom level

// Add a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

// Function to determine style based on feature properties
function getBuildingStyle(feature,zoom) {
  var properties = feature.properties;
  var fill;
  var border;
  var weight = 1;
  var opacity = 1;

  var id_list = ['4726588','4328975','2614014','16322055','4661214','868885682','1609614','75658','549109296']
  if (id_list.includes(properties.osm_id) || id_list.includes(properties.osm_way_id)) {
    fill = '#f17170';
    border = 'red';
  }
   else if (properties.place) {
    fill = '#60ca8c';
    border = 'green';

  } else if (properties.leisure) {
    fill = '#c2e4cb';
  } else if (properties.historic) {
    fill = '#f17170';
    border = 'red'; 
  } else if (properties.tourism) {
    switch (properties.tourism) {
      case 'museum':
        fill = '#a889c2';
        border = 'purple';
        break;
      case 'attraction':
      case 'artwork':
        fill = '#f17170';
        border = 'red';
        break;
      case 'hotel':
      case 'apartment':
        fill = '#ffdbc5';
        break;
      default:
        fill = '#ededed';
        break;
    }
  } else if (properties.amenity) {
    switch (properties.amenity) {
      case 'monastery':
      case 'theatre':
        fill = '#f17170';
        border = 'red';
        break;
      case 'fountain':
        fill = '#4ac3ff';
        border = 'blue';
        break;
      case 'place_of_worship':
        fill = '#f2d172';
        border = 'orange';
        break;
      case 'community_centre':
      case 'restaurant':
      case 'pub':
      case 'bar':
      case 'nightclub':
        fill = '#fa9b5c';
        break;
      default:
        fill = '#ededed';
        break;
      
    }
  } else if (properties.building == 'retail' || properties.building == 'yes' || properties.building == 'hotel' || properties.shop == 'department_store' || properties.shop == 'gift') {
    fill = '#ffdbc5';
  } else if (properties.shop == 'bakery' || properties.building == 'apartments') {
    fill = '#fa9b5c';
  } else if (properties.landuse == 'grass') {
    fill = '#c2e4cb';
  } 
  else if (properties.natural) {
    fill = '#4ac3ff';
  }
  else {
    fill = '#ededed';
  }

  if (fill == '#fa9b5c' || fill == '#ffdbc5') {
    if (zoom < 16) {
      fill = 'none';
      border = 'none';
      weight = 0;
      opacity = 0;
    }
  }

  return { fillColor: fill, color: border, weight: weight, fillOpacity: opacity };
}

var currentZoom = map.getZoom();
console.log(currentZoom)

// Load GeoJSON data for buildings
fetch('buildings.geojson')
    .then(response => response.json())
    .then(data => {
        // Create a layer for buildings
        var buildingsLayer = L.geoJSON(data, {
            style: function (feature) {
              // Call getBuildingStyle with feature and current zoom level
              return getBuildingStyle(feature, currentZoom);
          },
            onEachFeature: function (feature, layer) {
                if (feature.properties && (feature.properties.osm_way_id || feature.properties.osm_id)) {
                    layer.bindPopup("ID: " + (feature.properties.osm_way_id || feature.properties.osm_id));
                }
            }
        }).addTo(map);

        // Event listener for zoom level change
        map.on('zoom', function () {
            var currentZoom = map.getZoom();
            console.log(currentZoom);
            // Check if zoom level is greater than or equal to the desired level
            buildingsLayer.setStyle(function (feature) {
              return getBuildingStyle(feature, currentZoom);
            });
        });
    });
