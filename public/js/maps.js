var createGeoJSONCircle = function(center, radiusInKm, points) {
  //Source : https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/37794326
  if(!points) points = 64;

  var coords = {
      latitude: center[1],
      longitude: center[0]
  };

  var km = radiusInKm;

  var ret = [];
  var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
  var distanceY = km/110.574;

  var theta, x, y;
  for(var i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);

      ret.push([coords.longitude+x, coords.latitude+y]);
  }
  ret.push(ret[0]);

  return {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [ret]
              }
          }]
      }
  };
};


mapboxgl.accessToken = 'MAPBOX_API_KEY';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: center,
  zoom: zoom
});

map.on('load', function() {
  map.addSource("polygon", createGeoJSONCircle(center, radius));

map.addLayer({
    "id": "polygon",
    "type": "fill",
    "source": "polygon",
    "layout": {},
    "paint": {
        "fill-color": "blue",
        "fill-opacity": 0.2
    }
});
});

posts.forEach((post) => {
  var el = document.createElement('div');
  el.className = 'marker';
  new mapboxgl.Marker(el)
  .setLngLat(post.coordinates.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(
      '<h3>' + post.petname + '</h3><p>'
        + '<img src="'+ post.thumbnail+'" alt="" width="100" height="100"> <br>'
       + '<p>' + post.description + '</p>'
       + '<b> Author: </b>'+ post.username+'<br>'
       + '<b> Phone:</b>'+ post.phone + '<br>'
       + '<b> Mail: </b>' +  post.mail + '<br>'
       + '<b> Date: </b>' + post.date
      ))
  .addTo(map);
});