const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";
const getCityDir = "https://open.mapquestapi.com/geocoding/v1/reverse";

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
  let stateFromNavigator;
  const cityFromCoords = async (lat, long) => {
    const res = await axios.get(
      `${getCityDir}?key=${IdontCareItsFree}&location=${lat},${long}`
    );
    let locationData = res.data.results[0].locations[0];
    cityFromNavigator = locationData.adminArea5;
    stateFromNavigator = locationData.adminArea3;
    // debugger;
    let stateInput = stateArray.filter(
      (st) => st.abbreviated == stateFromNavigator
    );
    stateInput = stateInput[0].name;

    cityState(cityFromNavigator, stateInput);
    // setDefaultLocation(cityFromNavigator);
  };
  let lat, long;
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/Project01/" ||
    window.location.pathname === "/Project01/index.html"
  ) {
    const success = (location) => {
      lat = location.coords.latitude;
      long = location.coords.longitude;

      cityFromCoords(lat, long);
    };
    const error = (error) => console.error(error);
    navigator.geolocation.getCurrentPosition(success, error);
  }

  const clearCurrentList = () => {
    if (ul.children.length > 0) {
      do {
        ul.removeChild(ul.lastElementChild);
      } while (ul.children.length > 0);
    } else {
    }
  };

  const byCity = async (city) => {
    try {
      let byCityRef = `${rootDir}/breweries?by_city=${city}${perPage}`;
      lastGetRequest = byCityRef;
      const res = await axios.get(byCityRef);

      insertData(res.data);
      // sendToZach(res.data)
    } catch (error) {}
  };
  // byCity("Milwaukee");

  const byZip = async (zipCode) => {
    try {
      const byZipRef = `${rootDir}/breweries?by_postal=${zipCode}${perPage}&page=${pageOffset}`;
      lastGetRequest = byZipRef;
      const res = await axios.get(byZipRef);

      insertData(res.data);
      // sendToZach(res.data)
    } catch (error) {}
  };
  // byZip(53202);

  const cityState = async (city, state) => {
    console.log("Set location as", city, state);
    try {
      const cityStateRef = `${rootDir}/breweries?by_city=${city}&by_state=${state}${perPage}`;
      lastGetRequest = cityStateRef;
      const res = await axios.get(cityStateRef);

      insertData(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  // cityState("Milwaukee", "Wisconsin");

  // Gets input from change location modal
  let newState = "";
  let newCity = "";
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/Project01/" ||
    window.location.pathname === "/Project01/index.html"
  ) {
    locationButton.addEventListener("click", (e) => {
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
