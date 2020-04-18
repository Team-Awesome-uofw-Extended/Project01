var firebaseConfig = {
  apiKey: "AIzaSyBjS1MGlsOhRi0LHvUCLtoP8yzv46G-YPg",
  authDomain: "brewcrawler-ae0b1.firebaseapp.com",
  databaseURL: "https://brewcrawler-ae0b1.firebaseio.com",
  projectId: "brewcrawler-ae0b1",
  storageBucket: "brewcrawler-ae0b1.appspot.com",
  messagingSenderId: "1058211844569",
  appId: "1:1058211844569:web:03243ecfc694b7bc3989c8",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
let returnedCrawlData = [];
var crawlCode = 0;
var passingCrawl = [];

$("#crawl-submit").click(function () {
  crawlCode = Math.round(Math.random() * 1000000);
  passingCrawl = JSON.parse(localStorage.getItem("crawlArray"));
  localStorage.setItem("crawlCode", JSON.stringify(crawlCode));
  window.location.pathname = "./confirmation.html";
  writeCrawl();
});

function writeCrawl() {
  console.log("running write crawl");
  firebase.database().ref(`crawl-code/${crawlCode}`).set({
    stops: passingCrawl,
  });

  let displayArray = [];
  const getById = async (id) => {
    try {
      {
        const res = await axios.get(
          `https://api.openbrewerydb.org/breweries/${id}`
        );
        returnedCrawlData.push(res.data);
      }
      insertData(returnedCrawlData);
    } catch (error) {}
  };

  if (window.location.pathname === "/confirmation.html") {
    window.onload = () => {
      let crawlCode = JSON.parse(window.localStorage.getItem("crawlCode"));
      let crawlData = JSON.parse(window.localStorage.getItem("crawlArray"));
      for (var i = 0; i < crawlData.length; i++) {
        getById(crawlData[i]);
      }

      $("#confirmation-code").append(crawlCode);
    };
  }

  document.getElementById("submitCrawlCode").addEventListener("click", () => {
    let input = document.getElementById("codeInput").value;
    getCrawl(input);
  });
}
