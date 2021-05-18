import { Component } from '@angular/core';
//Import von Plugin für Geolokalisation
import { Geolocation } from '@ionic-native/geolocation';

import { Geofence } from '@ionic-native/geofence';

// Import für AlertController
import { AlertController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { getDistance } from 'geolib';

import {
  IMqttMessage,
  MqttModule,
  MqttService,
  IMqttServiceOptions
} from 'ngx-mqtt';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

//Classe erstellt in welchem die Geolokalisation durchgeführt wird
export class Abfrage {

  //Variablen in welchen die Lat/Long ausgegeben wird
  lat;
  long;
  message;
  distance = 22;
  lat_fremd = 0;
  long_fremd = 0;
  data;

  private subscription: Subscription;


  //Constructor für die Geolocalisation
  constructor(
    private geolocation: Geolocation,
    private _mqttService: MqttService,
    private alertCtrl: AlertController) {


    // Alle Nachrichten im Topic überwachen und bei neuen Nachrichten anzeigen
    this.subscription = this._mqttService.observe('mobigi/#').subscribe((message: IMqttMessage) => {
      var newLocation = JSON.parse(message.payload.toString());
      if (newLocation.clientId != this._mqttService.clientId) {
        this.message = JSON.stringify(newLocation);
        this.lat_fremd = newLocation.lat;
        this.long_fremd = newLocation.long;
        if (this.lat && this.long) {
          this.distance = getDistance(
            { latitude: this.lat, longitude: this.long },
            { latitude: newLocation.lat, longitude: newLocation.long }
          );
        }
      }

    });
    //Koordinaten ist die Funktion in welche diese Abgefragt werden
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.data = data;
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.pushLocation();
    });
  }

  Geofence_neu() {
    if (this.distance < 11) {
      this.showPushMeldung();
    }
  }

  pushLocation() {
    var topic = 'mobigi/' + this._mqttService.clientId;
    this._mqttService.unsafePublish(topic, JSON.stringify({ lat: this.lat, long: this.long, clientId: this._mqttService.clientId }));
  }

  showPushMeldung() {
    let alert = this.alertCtrl.create({
      title: 'Kontakt in der nähe',
      subTitle: 'Das ist ein Untertitel',
      message: 'Distanz: 11 Meter',
      buttons: ['OK']
    });
    alert.present();
  }

}
