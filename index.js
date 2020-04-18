const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";
const getCityDir = "http://open.mapquestapi.com/geocoding/v1/reverse";

const listItem = document.getElementsByClassName("collection-item");
const locationButton = document.getElementById("changeLocationButton");
const stateInput = document.getElementById("stateChange");
const cityInput = document.getElementById("cityChange");
// let dataHolder = [];
let currentCrawl = [];
let activeYelpRequest = {};
let lastGetRequest = "";

window.onload = () => {
  const setDefaultLocation = (city) => {
    byCity(city);
  };

  // !! Get location for initial load, probably better to query googlemaps API later
  let cityFromNavigator;
  const cityFromCoords = async (lat, long) => {
    const res = await axios.get(
      `${getCityDir}?key=${IdontCareItsFree}&location=${lat},${long}`
    );
    let locationData = res.data.results[0].locations[0];
    cityFromNavigator = locationData.adminArea5;
    setDefaultLocation(cityFromNavigator);
  };
  let lat, long;
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  console.log("running by location");
  console.log(window.location.pathname);
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    console.log("running getCurrentLocation");
    const success = (location) => {
      console.log("location returns", location);
      lat = location.coords.latitude;
      long = location.coords.longitude;
      cityFromCoords(lat, long);
    };
    const error = (error) => console.log("error returned as", error);
    console.log(navigator.geolocation.getCurrentPosition);
    navigator.geolocation.getCurrentPosition(success, error);
  }

  const clearCurrentList = () => {
    do {
      ul.removeChild(ul.lastElementChild);
    } while (ul.children.length > 0);
  };

  const byCity = async (city) => {
    try {
      let byCityRef = `${rootDir}/breweries?by_city=${city}${perPage}`;
      lastGetRequest = byCityRef;
      const res = await axios.get(byCityRef);
      console.log("byCity returns", res.data);

      insertData(res.data);
      // sendToZach(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  // byCity("Milwaukee");

  const byZip = async (zipCode) => {
    try {
      const byZipRef = `${rootDir}/breweries?by_postal=${zipCode}${perPage}&page=${pageOffset}`;
      lastGetRequest = byZipRef;
      const res = await axios.get(byZipRef);
      console.log("byZip returns", res.data);

      insertData(res.data);
      // sendToZach(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  // byZip(53202);

  const cityState = async (city, state) => {
    try {
      const cityStateRef = `${rootDir}/breweries?by_city=${city}&by_state=${state}${perPage}`;
      lastGetRequest = cityStateRef;
      const res = await axios.get(cityStateRef);
      console.log("cityState returns", res.data);

      insertData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // cityState("Milwaukee", "Wisconsin");

  // Gets input from change location modal
  let newState = "";
  let newCity = "";
  if (
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/"
  ) {
    locationButton.addEventListener("click", (e) => {
      console.log("running change location");
      e.preventDefault();
      newCity = cityInput.value;
      newState = stateInput.value;
      if (newState === "" && newCity === "") {
        return M.toast({ html: "Please fill this out completely" });
      } else if (newState === "" || newState === null) {
        clearCurrentList();
        byCity(newCity);
      }
      clearCurrentList();
      cityState(newCity, newState);
      //Move map to new current city
      function initMap_CL() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: 39.8283,lng: -98.5795}
        });
        //Does geocoding of new city and state
        function codeAddress() {
          var address = newCity + ', ' + newState;
          geocoder = new google.maps.Geocoder();
          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == 'OK') {
              map.setCenter(results[0].geometry.location);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
        codeAddress();
    };
    initMap_CL();
    
  })
};

//modal trigger for confirmation page
$(window).on("load", function () {
  if (window.location.href.indexOf("confirmation") > -1) {
    $("#crawl-confirmation").modal("open");
  }
});

   //This function gets the address from the breweriesArray objects and geocodes them
   
/*
const getAddress = address => {
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({address: address}, (results, status) => {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject(status);
                }    
            });    
        });
    };
function initMap(latitude, longitude) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {S
      lat: latitude,
      lng: longitude,
    },
    zoom: 8,
  });
} */
}