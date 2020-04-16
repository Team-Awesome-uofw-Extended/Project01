

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

           /* var i = addressIndex; 
            alert(address[i].name + " " + results[0].formatted_address);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                // use address[i].name
                title: results[0].formatted_address
            }); */
        }
        return geocodeCallBack;
    }
    
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
        var brewInfo = breweries[i]
        console.log(brewInfo)
        //var contentString = '<div>' + brewInfo + '</div>';
        //let location = await getAddress(breweries[i].street + ', ' + breweries[i].city + ', ' + breweries[i].state);
        geocoder.geocode( {'address': breweries[i].street + ', ' + breweries[i].city + ', ' + breweries[i].state}, makeCallback(brewInfo,map));
        //geocoder.geocode({'address': breweries[i].street + ', ' + breweries[i].city + ', ' + breweries[i].state}, function(results, status) {
        //map.setCenter(results[0].geometry.location);
        /*After the geocoder function runs only the last instance of the for loop is available to write to infowindows.  not sure why.
        Consider using simplier ways to get info windows to show. learn more about geocoder function and why it might do this.  Bug Shankar*/
        //console.log(content)
        
        /*var infowindow = new google.maps.InfoWindow({
            content: contentString
          }); 
        
          var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
          });
          console.log(results[0])
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          }); */
        
        //console.log(location)
        /*var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        var infowindow = new google.maps.InfoWindow()
        google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
            return function() {
               infowindow.setContent(brewInfo);
               infowindow.open(map,marker);
            };
        })(marker,brewInfo,infowindow));  */
    } 
    //)};
    //var map = new google.maps.Map(
        //document.getElementById('map'), {zoom: 12, center: centerLoc});
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: centerLoc, map: map});
  }
