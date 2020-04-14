

var geocoder;
var map;
var address = "Madison, Wisconsin"
var address2 = "Middleton, Wisconsin"
var centerLoc = {lat: 43.073, lng: -89.401};
var uluru = {lat: -25.344, lng: 132.036};
var breweries = [{
    "id": 7984,
    "name": "Vintage Brewing Co",
    "brewery_type": "brewpub",
    "street": "674 S Whitney Way",
    "city": "Madison",
    "state": "Wisconsin",
    "postal_code": "53711-1035",
    "country": "United States",
    "longitude": "-89.4726634457831",
    "latitude": "43.0517163253012",
    "phone": "6082042739",
    "website_url": "http://www.vintagebrewingco.com",
    "updated_at": "2018-08-24T16:46:19.187Z",
    "tag_list": []
    },
    {
    "id": 7934,
    "name": "Rockhound Brewing Co",
    "brewery_type": "brewpub",
    "street": "444 S Park St",
    "city": "Madison",
    "state": "Wisconsin",
    "postal_code": "53715-1618",
    "country": "United States",
    "longitude": "-89.4006464102564",
    "latitude": "43.0623835512821",
    "phone": "6082859023",
    "website_url": "http://www.rockhoundbrewing.com",
    "updated_at": "2018-08-24T16:45:14.349Z",
    "tag_list": []
    },
    {
    "id": 7903,
    "name": "Next Door Brewing Company",
    "brewery_type": "brewpub",
    "street": "2439 Atwood Ave",
    "city": "Madison",
    "state": "Wisconsin",
    "postal_code": "53704-5604",
    "country": "United States",
    "longitude": "-89.3457201808979",
    "latitude": "43.09371275",
    "phone": "6087293683",
    "website_url": "http://www.nextdoorbrewing.com",
    "updated_at": "2018-08-24T16:44:28.217Z",
    "tag_list": []
    }];
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: -34.397, lng: 150.644}
    });
    geocoder = new google.maps.Geocoder();
    setMarkers(geocoder, map);
  }
  function setMarkers(geocoder, map) {
    for (i =0; i < breweries.length; i++){
        var content = breweries[i].name
        console.log(content)
    geocoder.geocode({'address': breweries[i].street + ', ' + breweries[i].city + ', ' + breweries[i].state}, function(results, status) {
        console.log(content)
      if (status === 'OK') {
        //map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        var infowindow = new google.maps.InfoWindow()
        google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
            return function() {
               infowindow.setContent(content);
               infowindow.open(map,marker);
            };
        })(marker,content,infowindow)); 

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: centerLoc});
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: centerLoc, map: map});
  }
  }
