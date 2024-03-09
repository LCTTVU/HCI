// Initialize the map centered on Madrid
var map = L.map('map').setView([40.4170, -3.7034], 15); // Madrid coordinates (latitude, longitude) and zoom level

// Add a tile layer
L.tileLayer('https://tile.jawg.io/d8548ead-a5fa-44e4-a37d-06b2d8e85a5a/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: 'Cb2BtuigdhHx4pBPWnZgOKgDKxttfBhCJXU1uW2ti7K3qGBfVLzxowk88cHq3tv3'
}).addTo(map);

// Function to determine style based on feature properties
function getBuildingStyle(feature,zoom) {
  var properties = feature.properties;
  var fill = 'none';
  var border = 'none';
  var weight = 0;
  var opacity = 0;

  var special_id_list = ['4726588','4328975','2614014','16322055','4661214','868885682','1609614','75658','549109296','1006252510']
  if (special_id_list.includes(properties.osm_id) || special_id_list.includes(properties.osm_way_id)) {
    fill = '#f17170';
    border = 'red';
  }
   else if (properties.place) {
    fill = '#60ca8c';
    border = 'green';
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
      case 'cafe':
      case 'fast_food':
      case 'ice_cream':
        fill = '#fa9b5c';
        break;
      case 'arts_centre':
      case 'library':
        fill = '#a889c2';
        border = 'purple';
        break;      
    }
  } else if (properties.shop == 'bakery' || properties.building == 'apartments') {
    fill = '#fa9b5c';
  }  
  else if (properties.building || properties.shop) {
    fill = '#ffdbc5';
  }

  weight = 1;
  opacity = 1;

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

var icons = {
  'palacio': [[40.418, -3.7142],'icons/palacio.png', [129, 82], [64.5, 82], "Royal Palace of Madrid"],
  'catedral': [[40.4157, -3.7144],'icons/catedral.png', [96, 100], [48, 100], "Catedral de la Almudena"],
  'plazaEspana': [[40.4234, -3.7122],'icons/plaza_de_espana.png', [100, 85], [50, 85], "Plaza de España"],
  'temploDebod': [[40.4240, -3.7177],'icons/templo_de_debod.png', [114, 82], [57, 82], "Templo de Debod"],
  'puertaSol': [[40.4170, -3.7034],'icons/puerta_de_sol.png', [84, 78], [42, 78], "Puerta de Sol"],
  'plazaMayor': [[40.4157, -3.7073],'icons/plaza_mayor.png', [80, 78], [40, 78], "Plaza Mayor"],
  'bancoEspana': [[40.418, -3.6948],'icons/banco_de_espana.png', [110, 82], [55, 82], "Banco de España"],
  'metropolis': [[40.4188, -3.6974],'icons/edificio_metropolis.png', [110, 78], [55, 78], "Edificio Metrópolis"],
  'palacioCibeles': [[40.4184, -3.6918],'icons/palacio_de_cibeles.png', [110, 80], [55, 80], "Palacio de Cibeles"],
  'fuenteCibeles': [[40.4193, -3.69305],'icons/fuente_de_cibeles.png', [110, 82], [55, 82], "Fuente de Cibeles"],
  'fuenteNeptuno': [[40.4153, -3.6941],'icons/fuente_de_neptuno.png', [118, 82], [59, 82], "Fuente de Neptuno"],
  'museoNacional': [[40.4137, -3.6925],'icons/museo_nacional.png', [100, 96], [50, 96], "Museo Nacional del Prado"],
  'puertaAlcala': [[40.420, -3.68875],'icons/puerta_de_alcala.png', [114, 82], [57, 82], "Puerta de Alcalá"]
};

var routePoint;

function addIcon(coordinates,url,size,anchor,name) {
  var icon = L.icon({iconUrl: url,iconSize: size,iconAnchor: anchor});
  marker = L.marker(coordinates, {icon: icon});
  marker.addTo(map);
  marker.on('click', function() {
    var details = document.getElementById('detail-container');
    details.innerHTML = `<h2>${name}</h2><p>Marker description goes here...</p>`;
    routePoint = coordinates;
  })
}


for (var key in icons) {
  addIcon(icons[key][0], icons[key][1], icons[key][2], icons[key][3], icons[key][4]);
}

var control = L.Routing.control({
  router: L.Routing.mapbox('pk.eyJ1IjoidGxlNjY2NjYiLCJhIjoiY2x0aXJ5dzFvMGJleTJqcXZnZm90am9zcCJ9.mjkQGX5LlnquU31bG2YC4w', {profile: 'mapbox/walking'}),
  waypoints: [
    L.latLng(40.4167, -3.7034) //starting point
  ],
  routeWhileDragging: true,
  lineOptions: {
      styles: [{color: '#000000', opacity: 0.8, weight: 5}]
  }
}).addTo(map);


async function calculateShortestRoute(waypoints) {
  var coordinates = [];
  for (var i = 0; i < waypoints.length; i++) {
    var point = waypoints[i].latLng;
    coordinates.push(point);
  }
  var coords = coordinates.map(coordinates => `${coordinates.lng},${coordinates.lat}`).join(';');

  const baseUrl = 'http://router.project-osrm.org/trip/v1/walking/';
  var url = `${baseUrl}${coords}?source=first&roundtrip=false`;
  const response = await fetch(url);
  const data = await response.json();

  var shortestRoute = [];
  data.waypoints.sort((a, b) => a.waypoint_index - b.waypoint_index);
  for (var j = 0; j < data.waypoints.length; j++) {
    var pnt = data.waypoints[j].location;
    var lat = pnt[1];
    var lng = pnt[0];
    var l = L.latLng(lat,lng);
    shortestRoute.push(l);
  }
  return shortestRoute;
}






document.getElementById('addRouteButton').addEventListener('click', async function () {
  if (routePoint) {
    var point = L.latLng(routePoint[0],routePoint[1]);
    control.spliceWaypoints(control.getWaypoints().length,0,point);
    var waypoints = control.getWaypoints();
    var validWaypoints = waypoints.filter(waypoint => waypoint.latLng !== null);
    var shortestRoute = await calculateShortestRoute(validWaypoints);
    control.setWaypoints(shortestRoute);
  } 
});

fetch('B.geojson')
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

