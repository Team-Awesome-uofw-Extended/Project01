// $(document).ready(function(){
//     $('#yelp-modal').leanModal()
// })

var yelpImg = "";

function yelpModal(x) {
  if (x.rating < 1.5) {
    yelpImg = "./assets/images/yelp_stars/1.png";
  } else if (x.rating < 2.0) {
    yelpImg = "./assets/images/yelp_stars/1_5.png";
  } else if (x.rating < 2.5) {
    yelpImg = "./assets/images/yelp_stars/2.png";
  } else if (x.rating < 3.0) {
    yelpImg = "./assets/images/yelp_stars/2_5.png";
  } else if (x.rating < 3.5) {
    yelpImg = "./assets/images/yelp_stars/3.png";
  } else if (x.rating < 4.0) {
    yelpImg = "./assets/images/yelp_stars/3_5.png";
  } else if (x.rating < 4.5) {
    yelpImg = "./assets/images/yelp_stars/4.png";
  } else if (x.rating < 5.0) {
    yelpImg = "./assets/images/yelp_stars/4_5.png";
  } else if (x.rating == 5.0) {
    yelpImg = "./assets/images/yelp_stars/5.png";
  }

  console.log(yelpImg);
  document.getElementById("yelpName").textContent = x.name;

  let phoneOutput = `<a href="tel://+${x.phone}" style="margin-left: 30px">${x.display_phone}</a>`;
  document.getElementById("yelpPic").src = yelpImg;
  document.getElementById("yelpPhone").innerHTML = phoneOutput;
  document.getElementById("yelpURL").setAttribute("href", x.url);

  console.log(x.name);

  const elem = document.getElementById("yelpmodal");
  const instance = M.Modal.init(elem, { dismissible: false });
  instance.open();
}
