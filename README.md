# MobiGI_LBS
Dies ist der Code welcher im Rahmen einer Projektarbeit im Modul GIT-Mobil_Gi entstanden ist. Dieses Readme wird noch weiter ausgebaut.



## Build APK
* Mit dem Befehl `ionic capacitor bild android` die Code-Basis in Android-App umwandeln (Android-Studio sollte sich automatisch öffnen)
* Für die Kommunikation mit dem MQTT-Broker muss in der Datei AndroidManifest.xml (unter *app/manifests/AndroidManifest.xml*) auf Zeile 12 folgendes ergänzt werden: `android:usesCleartextTraffic="true"
* In Android-Studio kann unter *Build > Build Bundle(s) / APK(s)* die APK erstellt werden.
