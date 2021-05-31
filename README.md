# MobiGI_LBS
Dies ist der Code welcher im Rahmen einer Projektarbeit im Modul GIT-Mobil_Gi entstanden ist.



## Build APK
* Mit dem Befehl `ionic capacitor build android` die Code-Basis in Android-App umwandeln (Android-Studio sollte sich automatisch öffnen)
* Für die Kommunikation mit dem MQTT-Broker muss in der Datei AndroidManifest.xml (unter *app/manifests/AndroidManifest.xml*) auf Zeile 12 folgendes ergänzt werden: `android:usesCleartextTraffic="true"`
* In Android-Studio kann unter *Build > Build Bundle(s) / APK(s)* die APK erstellt werden.

## Austausch der aktuellen Position über MQTT
MQTT bietet die Möglichkeit, Nachrichten über einen Broker in einem Kanal anderen Nutzern zur Verfügung zu stellen. Durch Abpnnieren des Kanals wird eine Funktion immer dann aufgerufen, wenn eine neue Nachricht im Kanal verfügbar ist. In unserem Fall publizieren wir über eine Nachricht die Position des Geräts (lat / lon) sowie eine von MQTT generierte clientID. Die clientID benötigen wir um die Nachrichten vom eigenen Gerät erkennen und ignorieren zu können. 
Das Modul ngx-mqtt bietet dafür alle möglichen Einzelteile. 

Im Folgenden, bei uns in `app.module.ts` implementiert, werden die Service Optionen für das gesamte Projekt gesetzt. Als Broker (hostname) nutzen wir einen kostenlosen und öffentlichen Service. 
Der Service muss dann allen Appmodulen zur Verfügung gestellt werden.

```javascript
import {
  IMqttMessage,
  MqttModule,
  MqttService,
  IMqttServiceOptions
} from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'broker.emqx.io',
  port: 8083,
  path: '/mqtt'
};

export function mqttServiceFactory() {
  return new MqttService(MQTT_SERVICE_OPTIONS);
}
```

```javascript
...
imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    }),
  ],
...
``` 

Im Typescript unserer Unterseite wird eine Subscription Variable erstellt über die der festgelegte Service abonniert werden kann. Wie oben beschrieben wird dann bei jeder neu zur Verfügung gestellten Nachricht in im Kanal die eigene clientID mit der der Nachricht abgeglichen und bei abweichenden IDs die Distanz ermittelt und angezeigt. 

```javascript
private subscription: Subscription;


  //Constructor für die Geolocalisation
  constructor(
    private geolocation: Geolocation,
    private _mqttService: MqttService,
    private alertCtrl: AlertController) {

    // Alle Nachrichten im Topic überwachen und bei neuen Nachrichten anzeigen
    this.subscription = this._mqttService.observe('mobigi/#').subscribe((message: IMqttMessage) => {
      var newLocation = JSON.parse(message.payload.toString());
      
      // clientIDs vergleichen
      if (newLocation.clientId != this._mqttService.clientId) {
        this.message = JSON.stringify(newLocation);
        this.lat_fremd = newLocation.lat;
        this.long_fremd = newLocation.long;
        
        // Die Distanz wird nur dann berechnet, wenn bereits die eigenen Position festgestellt werden konnte.
        if (this.lat && this.long) {
          this.distance = getDistance(
            { latitude: this.lat, longitude: this.long },
            { latitude: newLocation.lat, longitude: newLocation.long }
          );
        }
      }

    });
```

Die Veröffentlichung der eigenen Position über den Broker im Kanal erfolgt bei jedem Positionsupdate des eigenen geräts über die Funktion ```javascript pushLocation()```.

```javascript
pushLocation() {
  var topic = 'mobigi/' + this._mqttService.clientId;
  this._mqttService.unsafePublish(topic, JSON.stringify({ lat: this.lat, long: this.long, clientId: this._mqttService.clientId }));
}
```
