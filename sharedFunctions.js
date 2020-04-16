const imageSourceForNow = "./assets/images/beer.png";
let ul;
if (
  window.location.pathname === "/index.html" ||
  window.location.pathname === "/"
) {
  ul = document.getElementById("brewList");
} else if (window.location.pathname === "/confirmation.html") {
  ul = document.getElementById("brewConfirmation");
}

let displayed = [];
let dataHolder = [];
const insertData = (data) => {
  console.log("data", data);
  console.log("insert function running");
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
