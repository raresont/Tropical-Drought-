import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
var markersArray = new Array();
var polyline = null;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements AfterViewInit {
  submitted = false;
  map = null;

   gradientStep = -1;
   heatmap;
   infoWindow;

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

       const map = new googleMaps.Map(mapEle, {
        center: {lat: 19.230551, lng: 30.478903},
        zoom: 12,
        pitch: 60, 
        bearing: -60,
        disableDefaultUI: true,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                  'styled_map']
        }
      });

     // map.mapTypes.set('satellite', styledMapType);
      map.setMapTypeId('satellite');

      var triangleCoords = [
        {lat: 19.255748, lng: 30.455453},
        {lat: 19.205748, lng: 30.435453},
        {lat: 19.185748, lng: 30.415453},
        {lat: 19.205748, lng: 30.385453},
        {lat: 19.215748, lng: 30.425453}
    ];

    // Construct the polygon.
    var bermudaTriangle = new googleMaps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
   // bermudaTriangle.setMap(map);



    var triangleCoords2 = [
      {lat: 19.255748, lng: 30.455453},
      {lat: 19.205748, lng: 30.385453},
      {lat: 19.215748, lng: 30.425453},
      {lat: 19.295748, lng: 30.385453},
      {lat: 19.305748, lng: 30.425453}
  ];

  // Construct the polygon.
  var bermudaTriangle2 = new googleMaps.Polygon({
    paths: triangleCoords2,
    strokeColor: '#123df0',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#123df0',
    fillOpacity: 0.35
  });
 // bermudaTriangle2.setMap(map);

    this.infoWindow = new googleMaps.InfoWindow;

    // Add a listener for the click event.
    bermudaTriangle.addListener('click', this.showArrays(map, bermudaTriangle.getPath(), this.infoWindow));


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

showArrays(map,vertices,infoWindow) {
  // Since this polygon has only one path, we can call getPath() to return the
  // MVCArray of LatLngs.
  var vertices = vertices; //this.getPath();

  var contentString = '<b>Bermuda Triangle polygon</b><br>' +
    //  'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
      '<br>';

  // Iterate over the vertices.
  for (var i =0; i < vertices.getLength(); i++) {
    var xy = vertices.getAt(i);
    contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
        xy.lng();
  }

  // Replace the info window's content and position.
  infoWindow.setContent(contentString);
  //this.infoWindow.setPosition(event.latLng);

  infoWindow.open(map);
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
