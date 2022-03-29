#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Update these with values suitable for your network.
// variables para control de led y alarmas
int LED = 4;
int BUTTON = 5;
int thisState = 0;
int lastState = 0;
String stringData;
char charData[1024];

// variables para tracking
String bssid, wap_mac, tag_mac, ip;
int rssi, count;

// WiFi
const char* ssid = "CLARO LIZ - 2.4ghz";
const char* password = "liz.jove73031792";

// MQTT
const char *mqtt_broker = "192.168.0.7";
const char *topic_tracking = "mina/subterranea/worker/tracking";
const char *topic_alarm = "mina/subterranea/worker/alarm";
const char *mqtt_username = "winextracking";
const char *mqtt_password = "winextracking21436587";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {

  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT);
  
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connnected ro the WiFi network");
  Serial.println(String(WiFi.macAddress()));
  reconnected();
}

void reconnected() {
  // connecting to mqqt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while(!client.connected()) {
    String client_id = "ESP-";
    client_id += String(WiFi.macAddress());
    Serial.println(client_id);
    if (client.connect("", mqtt_username, mqtt_password)) {
      Serial.println("Public emqx mqtt broker connected");
    } else {
      Serial.println("failed with state");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // publish and suscribe
  client.subscribe(topic_alarm);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char) payload[i];
  }
  Serial.print(message);
   if (message == "on") { digitalWrite(LED, HIGH); }   // LED on
   if (message == "off") { digitalWrite(LED, LOW); } // LED off
  Serial.println();
  Serial.println("-------------------------");
}

void loop() {
  tracking();
  if(!client.connected()) {
    Serial.println("MQTT disconnected");
    reconnected();
  }
  client.loop();
  tag_mac = WiFi.macAddress();
  thisState = digitalRead(BUTTON);
  delay(100);
  char alarm[100];
  StaticJsonDocument<100> doc1;
  if (thisState != lastState) {
    lastState = thisState;
    stringData = String(thisState);
    doc1["alarm"]["tag"] = tag_mac;
    doc1["alarm"]["status"] = stringData;
    for (int i = 0; i < 3; i++) {
      size_t m = serializeJson(doc1, alarm);
      client.publish(topic_alarm, alarm, m);
      Serial.println("PUSH BUTTON ACTIVED");
      Serial.println(stringData);
      delay(50);
    }
  }
  if (WiFi.status() != WL_CONNECTED) {
    //Serial.println("no conectado");
    ESP.restart();
  }
}

void tracking() {
   int networks = WiFi.scanNetworks();
   tag_mac = WiFi.macAddress();
   char buffer[300];
   StaticJsonDocument<300> doc;
   doc["t"]["tag"] = tag_mac;
  // DATA OF TRACKING
  count = 0;
  for (int i = 0; i < networks; ++i)
  {
    // Print SSID and RSSI for each network found
    if (WiFi.SSID(i) == "Interfet") {
      wap_mac = WiFi.BSSIDstr(i);
      rssi = WiFi.RSSI(i);
      ip = WiFi.localIP().toString();
      //Serial.print(rssi);
      //Serial.print("    MAC: ");
      //Serial.println(wap_mac);
      doc["t"]["s"][count]["rssi"] = rssi;
      doc["t"]["s"][count]["wap"] = wap_mac;
      count++;
    }
  }
  if(count > 0) {
   size_t n = serializeJson(doc, buffer);
   client.publish(topic_tracking, buffer, n);
   delay(10);    
  }
}
