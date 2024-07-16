// API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255 - 80 * feature.properties.mag);
      var b = Math.floor(255 - 80 * feature.properties.mag);
      color = "rgb(" + r + "," + g + "," + b + ")";
      
      var geojsonMarkerOptions = {
        radius: 4 * feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFsaGFodW1heXVuIiwiYSI6ImNseW5wcmNpcjA5YTQyaXBwcmJ0bmVhcWYifQ.bC3otgVZGuBWgjuYP6fIjg", {
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
  });

  // baseMaps object to hold our base layer
  var baseMaps = {
    "Street Map": streetmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create the map
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  function getColor(d) {
    return d < 1 ? 'rgb(255,255,255)' :
          d < 2  ? 'rgb(255,225,225)' :
          d < 3  ? 'rgb(255,195,195)' :
          d < 4  ? 'rgb(255,165,165)' :
          d < 5  ? 'rgb(255,135,135)' :
          d < 6  ? 'rgb(255,105,105)' :
          d < 7  ? 'rgb(255,75,75)' :
          d < 8  ? 'rgb(255,45,45)' :
          d < 9  ? 'rgb(255,15,15)' :
                  'rgb(255,0,0)';
  }

  // displaying information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];

    div.innerHTML += 'Magnitude<br><hr>';

    // generating labels with colors
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
}
