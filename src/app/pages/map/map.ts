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
   gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 91, 0.7)',
    'rgba(127, 0, 91, 0.7)',
    'rgba(127, 0, 91, 0.7)' //255
];
   gradientStep = -1;
   heatmap;

  @ViewChild('mapCanvas') mapElement: ElementRef;

  constructor(
    public router: Router,

  ) {
    
  }

  async ngAfterViewInit() {
    const googleMaps = await getGoogleMaps(
      'AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw'
    );

      const mapEle = this.mapElement.nativeElement;

      var heatMapData = [
        {location: new googleMaps.LatLng(19.305748, 30.455453), weight: 11},
        new googleMaps.LatLng(19.285748, 30.455453),
        {location: new googleMaps.LatLng(19.275748, 30.455453), weight: 21},
        {location: new googleMaps.LatLng(19.265748, 30.455453), weight: 21},
        {location: new googleMaps.LatLng(19.255748, 30.455453), weight: 21},
        new googleMaps.LatLng(19.255748, 30.455453),
        {location: new googleMaps.LatLng(19.235748,30.475453), weight: 12},
      
        {location: new googleMaps.LatLng(19.225748, 30.475453), weight: 15},
        {location: new googleMaps.LatLng(19.215748, 30.485453), weight: 14},
        new googleMaps.LatLng(19.205748, 30.455453),
        {location: new googleMaps.LatLng(19.205748, 30.475453), weight: 10},
        new googleMaps.LatLng(19.195748, 30.485453),
        {location: new googleMaps.LatLng(19.195748, 30.475453), weight: 11},
        {location: new googleMaps.LatLng(19.189547, 30.489442), weight: 10}
      ];

       const map = new googleMaps.Map(mapEle, {
        center: {lat: 19.230551, lng: 30.478903},
        zoom: 12,
        pitch: 60, 
        bearing: -60,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                  'styled_map']
        }
      });

     // map.mapTypes.set('satellite', styledMapType);
      map.setMapTypeId('satellite');

      this.heatmap = new googleMaps.visualization.HeatmapLayer({
        data: heatMapData,
        radius:100
      });

    this.heatmap.set('gradient', this.gradient);

    this.heatmap.setMap(map);
    googleMaps.event.addListenerOnce(map, 'tilesloaded', this.modulateGradient(this.gradient, this.heatmap, this.gradientStep));

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
      /*
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
      */
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

modulateGradient(gradient, heatmap, gradientStep) {
  var modulator = function() {
      var newGradient = gradient.slice(0, heatmap.get('gradient').length + gradientStep);
      
      if (newGradient.length == gradient.length || newGradient.length == 7) {
          gradientStep *= -1;
      }
      
      heatmap.set('gradient', newGradient);
      
      setTimeout(modulator, 100);
  };
  
  setTimeout(modulator, 100);
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31&libraries=visualization`;
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
