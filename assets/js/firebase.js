var firebaseConfig = {
    apiKey: "AIzaSyC5xOrnUb8u8nAyD0gQvyDylQWsMQOo0Gk",
    authDomain: "brewcrawler-64bc1.firebaseapp.com",
    databaseURL: "https://brewcrawler-64bc1.firebaseio.com",
    projectId: "brewcrawler-64bc1",
    storageBucket: "brewcrawler-64bc1.appspot.com",
    messagingSenderId: "982432305908",
    appId: "1:982432305908:web:40dceddedaaed9f83644a1",
    measurementId: "G-66M9T4ETQS"
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var crawlCode
var 

$(".crawl-submit").click(function() {
    crawlCode = Math.round(Math.random() * 1000000);
    window.sessionStorage.getItem(crawlArray);
    console.log("success?")
    writeCrawl();
})


function writeCrawl(crawlCode, crawlArray) {
    firebase.database().ref(`crawl-code/` + crawlCode).set({
        stops: crawlArray;
    })
}