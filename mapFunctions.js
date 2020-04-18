let map;
let service;
let infowindow;

function initMap(data) {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
  });

  var service = new google.maps.places.PlacesService(map);
  const setMap = (requestData) => {
    service.findPlaceFromQuery(requestData, (results, status) => {
      console.log("request returns", requestData);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  };

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  for (var i = 0; i < data.length; i++) {
    // request.query.push(data[i].name);
    // console.log(request.query);
    const request = {
      query: data[i].name,
      fields: ["name", "geometry"],
    };
    setMap(request);
  }
}
