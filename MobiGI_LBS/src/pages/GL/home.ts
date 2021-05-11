import { Component } from '@angular/core';
//Import von Plugin für Geolokalisation
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

//Classe erstellt in welchem die Geolokalisation durchgeführt wird
export class Abfrage {

  //Variablen in welchen die Lat/Long ausgegeben wird
  lat;
  long;

  //Constructor für die Geolocalisation
  constructor(
    private geolocation: Geolocation) {}

  //Koordinaten ist die Funktion in welche diese Abgefragt werden
  Koordinaten() {
    //Bestimmt die Position
    this.geolocation.getCurrentPosition().then((resp) => {
      //Übergibt die Werte an die Variablen
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
    //Kann nie Schaden Fehler zu bestimmen. Hatte zu beginn Probleme und war daher hilfreich
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
export class Geofencing{
  constructor(private geofence: Geofence) {
    // initialize the plugin
    geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    )}
  private addGeofence() {
    //options describing geofence
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude:       37.285951, //center of geofence radius
      longitude:      -121.936650,
      radius:         100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
          id:             1, //any unique ID
          title:          'You crossed a fence', //notification title
            text:           'You just arrived to Gliwice city center.', //notification body
            openAppOnClick: true //open app when notification is tapped
        }
      }
    
  this.geofence.addOrUpdate(fence).then(
      () => console.log('Geofence added'),
      (err) => console.log('Geofence failed to add')
   );
   }
}
