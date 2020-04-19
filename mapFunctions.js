let map;
let service;
let infowindow;

function initMap(data) {
  const setMarkers = (place, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarker(place);
    }
  };

  const callback = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
      console.log("results returns...", results);
      let request = {
        placeId: results[0].place_id,
        fields: [
          "name",
          "rating",
          "formatted_phone_number",
          "url",
          "vicinity",
          "website",
          "geometry",
        ],
      };
      infowindow = new google.maps.InfoWindow();
      service.getDetails(request, (place, status) => {
        //   !! Need to add a setTimeout function on crawlcode retrieval page so google doesn't throw a fit that we're making requests to rapidly
        console.log("request returns => ", request);

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log("place returns ", place);
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
          });
          let displayPhone;
          let displayWebsite;
          let displayRating;
          if (!place.website) {
            displayWebsite = "It doesn't look like a website exists";
          } else {
            displayWebsite = `or visit them <a href="${place.website}">${place.website}</a>`;
          }
          if (!place.formatted_phone_number) {
            displayPhone = "No public phone number is listed";
          } else {
            displayPhone = `call them at <a href="tel://+${place.formatted_phone_number}">${place.formatted_phone_number}</a>`;
          }
          if (!place.rating) {
            displayRating =
              "Google doesn't have any reviews, this brewery is likely not open to the public";
          } else {
            displayRating = `${place.name} has an average rating of ${place.rating}`;
          }

          let displayInfo = `${displayRating}<br> ${displayPhone}<br>
         ${displayWebsite}`;
          google.maps.event.addListener(marker, "click", function () {
            infowindow.setContent(displayInfo);
            infowindow.open(map, this);
          });
        }
      });
    }
  };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
  });

  var service = new google.maps.places.PlacesService(map);

  const setMap = (requestData, data) => {
    service.textSearch(requestData, callback);
  };

  for (var i = 0; i < data.length; i++) {
    // let stateAbbreviated = stateArray[data[i].state];
    let addressInput =
      data[i].name +
      ", " +
      data[i].street +
      ", " +
      data[i].city +
      ", " +
      data[i].state;
    console.log(addressInput);
    const request = {
      query: addressInput,
      fields: ["formatted_address", "name", "geometry"],
    };
    setMap(request, data[i]);
  }
}
