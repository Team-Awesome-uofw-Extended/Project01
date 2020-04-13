const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";
const yelpApiKey =
  "IuAyGOEnsbAVEOfh772yr4h5WbKH7nwCmBINkNoHvhY8urogfGa0KFA79Pb8_eiThKsvKyKmIP3k_dATh2CO9KpXLT8D4QWRSsQy91N1weylIVAUHMYAFuGL_6OTXnYx";
const rootDir = "https://api.openbrewerydb.org";
// Yes, I know this is kindof cheating
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const getCityDir = "http://open.mapquestapi.com/geocoding/v1/reverse";
const yelpRoot = "https://api.yelp.com/v3/businesses";
const perPage = "&per_page=5";
let pageOffset = 1;

const imageSourceForNow = "./assets/images/beer.png";

const listItem = document.getElementsByClassName("collection-item");
const locationButton = document.getElementById("changeLocationButton");
const stateInput = document.getElementById("stateChange");
const cityInput = document.getElementById("cityChange");
let dataHolder = [];
let activeYelpRequest = {};
let lastGetRequest = "";

const setDefaultLocation = (city) => {
  byCity(city);
};

// !! Get location for initial load, probably better to query googlemaps API later
let cityFromNavigator;
const cityFromCoords = async (lat, long) => {
  const res = await axios.get(
    `${getCityDir}?key=${IdontCareItsFree}&location=${lat},${long}`
  );
  locationData = res.data.results[0].locations[0];
  cityFromNavigator = locationData.adminArea5;
  setDefaultLocation(cityFromNavigator);
};
let lat, long;
window.onload = () => {
  const success = (location) => {
    lat = location.coords.latitude;
    long = location.coords.longitude;
    cityFromCoords(lat, long);
  };
  const error = (error) => console.log(error);
  navigator.geolocation.getCurrentPosition(success, error);
};

const paginateUp = async () => {
  pageOffset = pageOffset + 1;
  try {
    const res = await axios.get(`${lastGetRequest}&page=${pageOffset}`);
    clearCurrentList();

    insertData(res.data);
  } catch (error) {
    console.error(error);
  }
};
const paginateDown = async () => {
  pageOffset = pageOffset - 1;
  try {
    const res = await axios.get(`${lastGetRequest}&page=${pageOffset}`);
    clearCurrentList();

    insertData(res.data);
  } catch (error) {
    console.error(error);
  }
};
// Need to change this to filter an array of states for two letter abbreviations to allow other states
const getYelp = async (name, city, state, street) => {
  try {
    const res = await axios.get(`${corsAnywhere}${yelpRoot}/matches`, {
      params: {
        name: name,
        address1: street,
        city: city,
        state: "WI",
        country: "US",
      },
      headers: {
        Authorization: `Bearer ${yelpApiKey}`,
      },
    });
    activeYelpRequest = res.data.businesses[0];

    let queryDetailID = res.data.businesses[0].id;
    const detailRes = await axios.get(
      `${corsAnywhere}${yelpRoot}/${queryDetailID}`,
      {
        headers: {
          Authorization: `Bearer ${yelpApiKey}`,
        },
      }
    );
    activeYelpRequest = detailRes.data;
    console.log("Rob... make this look pretty", activeYelpRequest);
  } catch (error) {
    console.error(error);
  }
};

// !! Call insertData function to insert return into ul on main screen
const ul = document.getElementById("brewList");
const insertData = (data) => {
  for (var i = 0; i < data.length; i++) {
    dataHolder.push(data[i]);
    let li = document.createElement("li");
    li.classList.add("collection-item");
    li.classList.add("avatar");
    let titleSpan = document.createElement("span");
    titleSpan.textContent = data[i].name;
    titleSpan.classList.add("title");
    titleSpan.classList.add("brewery");
    var image = document.createElement("img");
    image.src = imageSourceForNow;
    image.classList.add("circle");
    let address = document.createElement("p");
    let cityState = document.createElement("p");
    address.classList.add("shorten");
    cityState.classList.add("shorten");
    cityState.textContent = `${data[i].city}, ${data[i].state}`;
    li.classList.add("address");
    li.setAttribute("id", data[i].id);
    address.textContent = data[i].street;
    let checkBoxContainer = document.createElement("p");
    checkBoxContainer.classList.add("secondary-content");
    let checkBoxLabel = document.createElement("label");
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    let emptySpan = document.createElement("span");
    checkBoxLabel.appendChild(checkBox);
    checkBoxLabel.appendChild(emptySpan);
    checkBoxContainer.appendChild(checkBoxLabel);
    li.appendChild(image);
    li.appendChild(titleSpan);
    li.appendChild(address);
    li.appendChild(cityState);
    li.appendChild(checkBoxContainer);
    li.addEventListener("click", (e) => {
      let buisID = parseInt(e.target.id);
      let filtered = dataHolder.filter((buis) => buis.id === buisID);

      let selected = filtered[0];
      getYelp(selected.name, selected.city, selected.state, selected.street);
    });
    ul.appendChild(li);
  }
};

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
