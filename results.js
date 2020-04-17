var geocoder;
var map;
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
    //This function gets the address from the breweries objects and geocodes them
    const getAddress = address => {
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({address: address}, (results, status) => {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject(status);
                }    
            });    
        });
    };
    //This acts as a callback function to get the info from the breweries objects after the the pins are created
    function makeCallback(brewInfo,map) {
        var geocodeCallBack = function(results, status) {
            var contentString = '<div>' + brewInfo.name + '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
              }); 
            console.log(map)
              var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map
              });
              console.log(results[0])
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
              map.panTo(marker.position);
        }
        return geocodeCallBack;
    }
    //Creates map
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: -34.397, lng: 150.644}
    });
    geocoder = new google.maps.Geocoder();
    setMarkers(geocoder, map);
  }
  // This function sets the markers on the map, and calls the callback to populate the info windows correctly.
  function setMarkers(geocoder, map) {
    for (i =0; i < breweries.length; i++){
        var brewInfo = breweries[i]
        console.log(brewInfo)
        geocoder.geocode( {'address': breweries[i].street + ', ' + breweries[i].city + ', ' + breweries[i].state}, makeCallback(brewInfo,map));
        
    } 
}
