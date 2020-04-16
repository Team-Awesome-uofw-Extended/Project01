const imageSourceForNow = "./assets/images/beer.png";
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

const returnCrawl = async (data) => {
  console.log("running get by id");
  try {
    for (var i = 0; i < data.length; i++) {
      const res = await axios.get(
        `https://api.openbrewerydb.org/breweries/${data[i]}`
      );
      breweriesArray.push(res.data);
      console.log("For you Zach", res.data);
    }
    console.log(breweriesArray);
  } catch (error) {
    console.error(error);
  }
};
let displayed = [];
let dataHolder = [];

const insertData = (data) => {
  console.log("data", data);
  console.log("insert function running");
  for (var i = 0; i < data.length; i++) {
    if (displayed.indexOf(data[i].id) === -1) {
      displayed.push(data[i].id);
      console.log("displayed", displayed);
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
        console.log(e.target.value);
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
      console.log("crawl returns", crawlReturn);
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
  displayed = [];
  paginateUp();
});
document.getElementById("paginateDown").addEventListener("click", () => {
  displayed = [];
  paginateDown();
});
