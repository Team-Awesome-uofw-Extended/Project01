const rootDir = "https://api.openbrewerydb.org";
const perPage = "&per_page=5";
const pageOffset = 1;
const IdontCareItsFree = "DVuBz9NPzOaxkWYpA8tGNG4ZhrKokozQ";

const imageSourceForNow = "./assets/images/beer.png";

// document.getElementById("idOfNextPageButton").addEventListener("click", () => {
// e.preventDefault()
//   pageCount++;
// });
// document.getElementById("idOfLastPageButton").addEventListener("click", (e) => {
// e.preventDefault()
//   pageCount --;
// });

// !! Call inserData function to insert return into ul on main screen
const ul = document.getElementById("brewList");
const insertData = (data) => {
  for (var i = 0; i < data.length; i++) {
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
    cityState.textContent = `${data[i].city}, ${data[i].state}`;
    li.classList.add("address");
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
    ul.appendChild(li);
  }
};

const byCity = async (city) => {
  try {
    const res = await axios.get(
      `${rootDir}/breweries?by_city=${city}${perPage}`
    );
    console.log("byCity returns", res.data);
    // sendToZach(res.data)
  } catch (error) {
    console.log(error);
  }
};
// byCity("Milwaukee");

const byZip = async (zipCode) => {
  try {
    const res = await axios.get(
      `${rootDir}/breweries?by_postal=${zipCode}${perPage}&page=${pageOffset}`
    );
    console.log("byZip returns", res.data);
    // sendToZach(res.data)
  } catch (error) {
    console.log(error);
  }
};
// byZip(53202);

const cityState = async (city, state) => {
  try {
    const res = await axios.get(
      `${rootDir}/breweries?by_city=${city}&by_state=${state}${perPage}&page=${pageOffset}`
    );
    console.log("cityState returns", res.data);
    insertData(res.data);
  } catch (error) {
    console.log(error);
  }
};
cityState("Milwaukee", "Wisconsin");
