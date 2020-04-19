let map;
let service;
let infowindow;

function initMap(data) {
  console.log("running initMap as ", data);
  const setMarkers = (place, status) => {
    console.log("running set markers with ", place);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarker(place);
    }
  };

  const callback = (results, status) => {
    console.log("running callback with ", results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
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
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
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
            // displayWebsite = place.website;
            displayWebsite = `or visit them <a href="${place.website}">${place.website}</a>`;
          }
          if (!place.formatted_phone_number) {
            displayPhone = "No public phone number is listed";
          } else {
            // displayPhone = `place.formatted_phone_number`
            displayPhone = `call them at <a href="tel://+${place.formatted_phone_number}">${place.formatted_phone_number}</a>`;
          }
          if (!place.rating) {
            displayRating =
              "Google doesn't have any reviews, this brewery is likely not open to the public";
          } else {
            displayRating = `${place.name} has an average rating of ${place.rating}`;
          }

          console.log(displayWebsite);
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
    zoom: 13,
  });

  var service = new google.maps.places.PlacesService(map);

  const setMap = (requestData, data) => {
    service.textSearch(requestData, callback);
  };

  //   function createMarker(place, data) {
  //     var marker = new google.maps.Marker({
  //       map: map,
  //       position: place.geometry.location,
  //     });
  //     google.maps.event.addListener(marker, "click", function () {
  //       infowindow.setContent(data.name);
  //       infowindow.open(map, this);
  //     });
  //   }

  for (var i = 0; i < data.length; i++) {
    let addressInput = data[i].street + ", " + data[i].city + data[i].name;
    const request = {
      query: addressInput,
      fields: ["formatted_address", "name", "geometry"],
    };
    setMap(request, data[i]);
  }
}
