let map;
let service;
let infowindow;

function initMap(data) {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
  });

  var service = new google.maps.places.PlacesService(map);
  const setMap = (requestData, data) => {
    service.findPlaceFromQuery(requestData, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          createMarker(results[i], data);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  };

  function createMarker(place, data) {
    console.log("data", data);
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(data.name);
      infowindow.open(map, this);
    });
  }

  for (var i = 0; i < data.length; i++) {
    // request.query.push(data[i].name);
    console.log(data[i]);
    const request = {
      query: data[i].street,
      fields: ["formatted_address", "name", "geometry"],
    };
    setMap(request, data[i]);
  }
}
