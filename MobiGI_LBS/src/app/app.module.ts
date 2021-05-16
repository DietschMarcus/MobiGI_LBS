import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//Modul importiert für Geolokalsiation
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
//Seite Importiert zum Testen
import { Abfrage } from '../pages/GL/home';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable } from 'rxjs/Observable';

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


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    //Seite hinzugefüt zum Testen
    Abfrage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    //Seite hinzugefüt zum Testen
    Abfrage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //Provider für die Geolokalisation eingefügt
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
