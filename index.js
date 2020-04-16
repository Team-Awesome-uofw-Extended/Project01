const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";
const yelpApiKey =
  "IuAyGOEnsbAVEOfh772yr4h5WbKH7nwCmBINkNoHvhY8urogfGa0KFA79Pb8_eiThKsvKyKmIP3k_dATh2CO9KpXLT8D4QWRSsQy91N1weylIVAUHMYAFuGL_6OTXnYx";
const rootDir = "https://api.openbrewerydb.org";
// Yes, I know this is kindof cheating
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const getCityDir = "http://open.mapquestapi.com/geocoding/v1/reverse";
const byTypeFilter =
  "&by_type=micro&by_type=bar&by_type=brewpub&by_type=large&by_type=proprieter&by_type=regional";
const yelpRoot = "https://api.yelp.com/v3/businesses";
const perPage = "&per_page=5";
let pageOffset = 1;

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

  document.getElementById("paginateUp").addEventListener("click", () => {
    paginateUp();
  });
  document.getElementById("paginateDown").addEventListener("click", () => {
    paginateDown();
  });

  // Need to change this to filter an array of states for two letter abbreviations to allow other states
  const getYelp = async (name, city, state, street) => {
    state = state.toLowerCase();
    let stateAbbreviated = stateArray[state];

    try {
      const res = await axios.get(`${corsAnywhere}${yelpRoot}/matches`, {
        params: {
          name: name,
          address1: street,
          city: city,
          state: stateAbbreviated,
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

  const setCheckedState = (target) => {
    if (window.localStorage.crawlArray) {
      currentCrawl = JSON.parse(window.localStorage.getItem("crawlArray"));
      if (currentCrawl.indexOf(target) === -1) {
        currentCrawl.push(target);
        window.localStorage.setItem("crawlArray", JSON.stringify(currentCrawl));
      } else {
        currentCrawl = currentCrawl.filter((pubID) => pubID !== target);
        window.localStorage.setItem("crawlArray", JSON.stringify(currentCrawl));
      }
    } else if (!window.localStorage.crawlArray) {
      currentCrawl.push(target);
      window.localStorage.setItem("crawlArray", JSON.stringify(currentCrawl));
    }
  };

  // let ul;
  // if (
  //   window.location.pathname === "/index.html" ||
  //   window.location.pathname === "/"
  // ) {
  //   ul = document.getElementById("brewList");
  // } else if (window.location.pathname === "/confirmation.html") {
  //   ul = document.getElementById("brewConfirmation");
  // }

  // // let displayed = [];
  // const insertData = (data) => {
  //   console.log("data", data);
  //   console.log("insert function running");
  //   for (var i = 0; i < data.length; i++) {
  //     if (displayed.indexOf(data[i].id) === -1) {
  //       displayed.push(data[i].id);
  //       dataHolder.push(data[i]);
  //       let li = document.createElement("li");
  //       li.classList.add("collection-item");
  //       li.classList.add("avatar");
  //       let titleSpan = document.createElement("span");
  //       titleSpan.textContent = data[i].name;
  //       titleSpan.classList.add("title");
  //       titleSpan.classList.add("brewery");
  //       var image = document.createElement("img");
  //       image.src = imageSourceForNow;
  //       image.classList.add("circle");
  //       let address = document.createElement("p");
  //       let cityState = document.createElement("p");
  //       address.classList.add("shorten");
  //       cityState.classList.add("shorten");
  //       cityState.textContent = `${data[i].city}, ${data[i].state}`;
  //       li.classList.add("address");
  //       li.setAttribute("id", data[i].id);
  //       address.textContent = data[i].street;
  //       let checkBoxContainer = document.createElement("p");
  //       checkBoxContainer.classList.add("secondary-content");
  //       let checkBoxLabel = document.createElement("label");
  //       let checkBox = document.createElement("input");
  //       let checkedStatus;
  //       if (window.localStorage.crawlArray) {
  //         let temporaryArray = window.localStorage.getItem("crawlArray");
  //         if (temporaryArray.indexOf(data[i].id) !== -1) {
  //           checkedStatus = "checked";
  //           checkBox.setAttribute("checked", checkedStatus);
  //         } else {
  //           checkBox.removeAttribute("checked");
  //         }
  //       }
  //       checkBox.setAttribute("value", data[i].id);
  //       checkBox.addEventListener("click", (e) => {
  //         console.log(e.target.value);
  //         setCheckedState(e.target.value);
  //       });
  //       checkBox.setAttribute("type", "checkbox");
  //       let emptySpan = document.createElement("span");
  //       checkBoxLabel.appendChild(checkBox);
  //       checkBoxLabel.appendChild(emptySpan);
  //       checkBoxContainer.appendChild(checkBoxLabel);
  //       li.appendChild(image);
  //       li.appendChild(titleSpan);
  //       li.appendChild(address);
  //       li.appendChild(cityState);
  //       li.appendChild(checkBoxContainer);
  //       li.addEventListener("click", (e) => {
  //         let buisID = parseInt(e.target.id);
  //         let filtered = dataHolder.filter((buis) => buis.id === buisID);
  //         let selected = filtered[0];
  //         getYelp(selected.name, selected.city, selected.state, selected.street);
  //       });
  //       ul.appendChild(li);
  //     }
  //   }
  // };

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
  if (location === "/index.html" || location === "/") {
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

$("#crawl-submit").click(function () {
  crawlCode = Math.round(Math.random() * 1000000);
  passingCrawl = JSON.parse(localStorage.getItem("crawlArray"));
  console.log(passingCrawl);
  console.log("crawlCode" + crawlCode);
  console.log("success?");
  writeCrawl();
  localStorage.setItem("crawlCode", JSON.stringify(crawlCode));
  window.location.pathname = "./confirmation.html";
});
