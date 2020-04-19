//firbase js for the confirmation page

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

// var crawlCodeConfirm = sessionStorage.getItem("Crawl Code");
var crawlStops = database.ref('crawl-code/7085/');

console.log(crawlStops);

var thisCrawl = database().ref('crawl-code/'+crawlCode+"/stops');
	thisCrawl.on('value', function(snapshot) {