import { Component } from '@angular/core';
//Import von Plugin für Geolokalisation
import { Geolocation } from '@ionic-native/geolocation';
// Import für AlertController
import { AlertController } from 'ionic-angular';

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
    private geolocation: Geolocation,
    private alertCtrl: AlertController) {}

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

  showPushMeldung() {
    let alert = this.alertCtrl.create({
      title: 'Kontakt in der nähe',
      subTitle: 'Das ist ein Untertitel',
      message: 'Distanz: 42 Meter',
      buttons: ['OK']
    });
    alert.present();
  }

}
