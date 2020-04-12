const rootDir = "https://api.openbrewerydb.org";
const perPage = "&per_page=5";
const pageOffset = 1;

// document.getElementById("idOfNextPageButton").addEventListener("click", () => {
// e.preventDefault()
//   pageCount++;
// });
// document.getElementById("idOfLastPageButton").addEventListener("click", (e) => {
// e.preventDefault()
//   pageCount --;
// });
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
  } catch (error) {
    console.log(error);
  }
};
cityState("Milwaukee", "Wisconsin");
