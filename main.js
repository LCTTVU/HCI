// Initialize the map centered on Madrid
var map = L.map('map').setView([40.417, -3.703], 16); // Madrid coordinates (latitude, longitude) and zoom level

// Add a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

// Function to determine style based on feature properties
function getBuildingStyle(feature) {
  var properties = feature.properties;
  var fill;
  var border;

  var id_list = ['4726588','4328975','2614014','16322055','4661214','868885682','1609614','75658']
  // Check each property sequentially until a match is found
  if (id_list.includes(properties.osm_id) || id_list.includes(properties.osm_way_id)) {
    fill = '#f17170';
    border = 'red';
  }
   else if (properties.place) {
    fill = '#60ca8c';
    border = 'green';

  } else if (properties.leisure) {
    switch (properties.leisure) {
      case 'park':
      case 'garden':
      case 'playground':
        fill = '#c2e4cb';
        break;

      // Add more cases for other types
      default:
        fill = 'gray';
        break;
    }
  } else if (properties.historic) {
    switch (properties.historic) {
      case 'castle':
      case 'memorial':
      case 'monument':
      case 'building':
      case 'monastery':
      case 'archaeological_site':
        fill = '#f17170';
        border = 'red';
        break;
    }

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
        fill = '#ffdbc5';
        border = '#ffdbc5'
        break;
      // Add more cases for other types
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
  } else if (properties.building == 'retail' || properties.shop == 'department_store' || properties.shop == 'gift') {
    fill = '#ffdbc5';
  } else if (properties.shop == 'bakery') {
    fill = '#fa9b5c';
  } else if (properties.landuse == 'grass') {
    fill = '#c2e4cb';
  } 
  else if (properties.building == 'apartments') {
    fill = '#fa9b5c';
  }
  else if (properties.building == 'yes') {
    fill = '#ffdbc5';
  }
  else if (properties.natural) {
    switch (properties.natural) {
      case 'water':
        fill = '#4ac3ff';
    }
  }

  else {
    fill = '#ededed'; // Default color
  }

  return { fillColor: fill, color: border, weight: 1, fillOpacity: 1 };
}

// Load GeoJSON data for buildings
fetch('cleaned6.geojson')
  .then(response => response.json())
  .then(data => {
    // Create a layer for buildings
    L.geoJSON(data, {
      style: getBuildingStyle, // Use the function to determine style
      onEachFeature: function (feature, layer) {
        if (feature.properties && (feature.properties.osm_way_id || feature.properties.osm_id)) {
          layer.bindPopup("ID: " + (feature.properties.osm_way_id || feature.properties.osm_id));
        }
      }
    }).addTo(map);
  });
