const $ = require("jquery");
import { insertData } from "../../index.js";
// const insertData = require("indexJS");

import axios from "axios";

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
  console.log(passingCrawl);
  console.log("Crawlcode" + crawlCode);
  console.log("success?");
  writeCrawl();
  localStorage.setItem("crawlCode", JSON.stringify(crawlCode));
  window.location.pathname = "./confirmation.html";
});

function writeCrawl() {
  firebase.database().ref(`crawl-code/${crawlCode}`).set({
    stops: passingCrawl,
  });
}

const getById = async (id) => {
  try {
    const res = await axios.get(
      `https://api.openbrewerydb.org/breweries/${id}`
    );
    returnedCrawlData.push(res.data);
    insertData(returnedCrawlData);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

if (window.location.pathname === "/confirmation.html") {
  let crawlCode = JSON.parse(window.localStorage.getItem("crawlCode"));
  let crawlData = JSON.parse(window.localStorage.getItem("crawlArray"));
  for (var i = 0; i < crawlData.length; i++) {
    getById(crawlData[i]);
  }
  console.log("returned array", returnedCrawlData);
}
