const imageSourceForNow = "./assets/images/beer.png";

const yelpApiKey =
  "IuAyGOEnsbAVEOfh772yr4h5WbKH7nwCmBINkNoHvhY8urogfGa0KFA79Pb8_eiThKsvKyKmIP3k_dATh2CO9KpXLT8D4QWRSsQy91N1weylIVAUHMYAFuGL_6OTXnYx";
const rootDir = "https://api.openbrewerydb.org";
const perPage = "&per_page=5";
// Yes, I know this is kindof cheating
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const byTypeFilter =
  "&by_type=micro&by_type=bar&by_type=brewpub&by_type=large&by_type=proprieter&by_type=regional";
const yelpRoot = "https://api.yelp.com/v3/businesses";
let pageOffset = 1;

let breweriesArray = [];
let ul;
if (
  window.location.pathname === "/index.html" ||
  window.location.pathname === "/"
) {
  ul = document.getElementById("brewList");
} else if (window.location.pathname === "/confirmation.html") {
  ul = document.getElementById("brewConfirmation");
}
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
  } catch (error) {}
};

const returnCrawl = async (data) => {
  try {
    for (var i = 0; i < data.length; i++) {
      const res = await axios.get(
        `https://api.openbrewerydb.org/breweries/${data[i]}`
      );
      breweriesArray.push(res.data);
      console.log("returned from crawl code =>", breweriesArray);
    }
  } catch (error) {}
};
let displayed = [];
let dataHolder = [];

const insertData = (data) => {
  for (var i = 0; i < data.length; i++) {
    if (displayed.indexOf(data[i].id) === -1) {
      displayed.push(data[i].id);

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
      let checkedStatus;
      if (window.localStorage.crawlArray) {
        let temporaryArray = window.localStorage.getItem("crawlArray");
        if (temporaryArray.indexOf(data[i].id) !== -1) {
          checkedStatus = "checked";
          checkBox.setAttribute("checked", checkedStatus);
        } else {
          checkBox.removeAttribute("checked");
        }
      }
      checkBox.setAttribute("value", data[i].id);
      checkBox.addEventListener("click", (e) => {
        setCheckedState(e.target.value);
      });
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
  }
};

const getCrawl = (crawlCode) => {
  return firebase
    .database()
    .ref("crawl-code/" + crawlCode)
    .once("value")
    .then((snapshot) => {
      let crawlReturn = snapshot.val().stops;

      returnCrawl(crawlReturn);
    });
};
const clearCurrentList = () => {
  do {
    displayed.pop();
    ul.removeChild(ul.lastElementChild);
  } while (ul.children.length > 0);
};

const paginateUp = async () => {
  pageOffset = pageOffset + 1;

  try {
    const res = await axios.get(`${lastGetRequest}&page=${pageOffset}`);
    clearCurrentList();
    insertData(res.data);
  } catch (error) {}
};
const paginateDown = async () => {
  pageOffset = pageOffset - 1;
  try {
    const res = await axios.get(`${lastGetRequest}&page=${pageOffset}`);
    clearCurrentList();
    insertData(res.data);
  } catch (error) {}
};

if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html"
) {
  document.getElementById("paginateUp").addEventListener("click", () => {
    displayed = [];
    paginateUp();
  });
  document.getElementById("paginateDown").addEventListener("click", () => {
    displayed = [];
    paginateDown();
  });
}
