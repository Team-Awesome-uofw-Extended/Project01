var firebaseConfig = {
    apiKey: "AIzaSyBjS1MGlsOhRi0LHvUCLtoP8yzv46G-YPg",
    authDomain: "brewcrawler-ae0b1.firebaseapp.com",
    databaseURL: "https://brewcrawler-ae0b1.firebaseio.com",
    projectId: "brewcrawler-ae0b1",
    storageBucket: "brewcrawler-ae0b1.appspot.com",
    messagingSenderId: "1058211844569",
    appId: "1:1058211844569:web:03243ecfc694b7bc3989c8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var database = firebase.database();


var crawlCode = 0;
var passingCrawl = [];

$(".crawl-submit").click(function() {
    crawlCode = Math.round(Math.random() * 1000000);
    passingCrawl = sessionStorage.getItem("crawlArray");
    console.log(passingCrawl);
    console.log("Crawlcode" + crawlCode);
    console.log("success?");
    writeCrawl();
    sessionStorage.setItem("Crawl Code", crawlCode)
    window.location.href = "confirmation.html"
})


function writeCrawl() {
    firebase.database().ref(`crawl-code/${crawlCode}`).set({
        stops: passingCrawl
    });
}