import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
var markersArray = new Array();
var polyline = null;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  submitted = false;
  map = null;
 
  @ViewChild('mapCanvas') mapElement: ElementRef;

  constructor(
    public router: Router,

  ) {
    
  }


  async ngAfterViewInit() {
    const googleMaps = await getGoogleMaps(
      'AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw'
    );
    
    var styledMapType = new googleMaps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ],
      {name: 'Styled Map'});
      
      const mapEle = this.mapElement.nativeElement;

       const map = new googleMaps.Map(mapEle, {
        center: {lat: 46.7695547, lng: 23.5949514},
        zoom: 16,
        pitch: 60, 
        bearing: -60,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                  'styled_map']
        }
      });

      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');
     

      this.map = map;
      googleMaps.event.addListener(this.map, 'click', function (event) {
        let marker = new googleMaps.Marker({
          icon     : {
            url     : "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
            size    : new googleMaps.Size( 7, 7 ),
            anchor  : new googleMaps.Point( 4, 4 )
        },
          map: this.map,
          draggable: true,
          animation: googleMaps.Animation.DROP,
          position: event.latLng
        });

      markersArray.push(marker);

       let markersPositionArray = [];
       markersArray.forEach(function(e) {
         markersPositionArray.push(e.getPosition());
       });

       if (polyline !== null) {
         polyline.setMap(null);
       }
       console.log(markersPositionArray);

       this.polyline = new googleMaps.Polyline({
         map: map,
         path: markersPositionArray,
         strokeColor: "#2eac1d",
         strokeOpacity: 1.0,
         strokeWeight: 7
       });

      });

     let marker1 = new googleMaps.Marker({
        map: this.map,
        draggable: true,
        animation: googleMaps.Animation.DROP,
        position: {lat: 46.7695547, lng: 23.5949514}
      });

      var directionsService = new googleMaps.DirectionsService();
      var directionsDisplay = new googleMaps.DirectionsRenderer({
        map: this.map
      });
      directionsDisplay.setOptions({suppressMarkers: true});
      directionsService.route({
        origin: {
          'placeId': 'ChIJObEjxYgOSUcROuiXXeZ3SDU'
        },
        destination: {
          'placeId': 'ChIJ1feHaYYOSUcRx0aGWokmHYA'
        },
        waypoints: [{
          stopover: true,
          location: {
            'placeId': "ChIJSU_16ogOSUcRbucYAQHw8N0"
          }
        }],
        optimizeWaypoints: true,
        travelMode: googleMaps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          setTimeout(function (){
            map.panTo({lat: 46.766701, lng: 23.5694203});
            setTimeout(function (){
              map.panTo({lat: 46.7654517, lng: 23.5702465});
              }, 1000);
          }, 1000);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
      
      directionsDisplay.addListener('click', () => {
        if (directionsDisplay.getAnimation() !== null) {
          directionsDisplay.setAnimation(null);
        } else {
          directionsDisplay.setAnimation(googleMaps.Animation.BOUNCE);
        }

      });


      googleMaps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    
  }

drawPolyline(googleMaps) {

}

}


function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}
