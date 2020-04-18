const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";
const getCityDir = "http://open.mapquestapi.com/geocoding/v1/reverse";
// const rootDir = "https://api.openbrewerydb.org";
// const perPage = "&per_page=5";
// const yelpApiKey =
//   "IuAyGOEnsbAVEOfh772yr4h5WbKH7nwCmBINkNoHvhY8urogfGa0KFA79Pb8_eiThKsvKyKmIP3k_dATh2CO9KpXLT8D4QWRSsQy91N1weylIVAUHMYAFuGL_6OTXnYx";
// const rootDir = "https://api.openbrewerydb.org";
// // Yes, I know this is kindof cheating
// const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
// const byTypeFilter =
//   "&by_type=micro&by_type=bar&by_type=brewpub&by_type=large&by_type=proprieter&by_type=regional";
// const yelpRoot = "https://api.yelp.com/v3/businesses";
// const perPage = "&per_page=5";
// let pageOffset = 1;

// const imageSourceForNow = "./assets/images/beer.png";

const listItem = document.getElementsByClassName("collection-item");
const locationButton = document.getElementById("changeLocationButton");
const stateInput = document.getElementById("stateChange");
const cityInput = document.getElementById("cityChange");
// let dataHolder = [];
let currentCrawl = [];
let activeYelpRequest = {};
let lastGetRequest = "";
// let location = window.location.pathname;
// console.log("location", location);

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
    });
  }
};

//modal trigger for confirmation page
$(window).on("load", function () {
  if (window.location.href.indexOf("confirmation") > -1) {
    $("#crawl-confirmation").modal("open");
  }
});
