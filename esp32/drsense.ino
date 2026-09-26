#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include "MAX30100_PulseOximeter.h"

// =====================================================
// WI-FI SETTINGS
// =====================================================

const char* WIFI_SSID = "MY_WIFI_NAME";
const char* WIFI_PASSWORD = "MY_WIFI_PASSWORD";


WebServer server(80);

bool wifiStarted = false;
bool webServerStarted = false;

unsigned long lastWifiRetry = 0;
const unsigned long WIFI_RETRY_TIME = 15000;

// =====================================================
// PIN SETTINGS
// =====================================================

#define SDA_PIN 21
#define SCL_PIN 22

#define SOS_BUTTON 27
#define LED_PIN 26

// =====================================================
// OLED SETTINGS
// =====================================================

#define OLED_ADDRESS 0x3C

Adafruit_SH1106G display(
  128,
  64,
  &Wire,
  -1
);

// =====================================================
// MAX30100 SENSOR
// =====================================================

PulseOximeter pox;

bool sensorReady = false;

float heartRate = 0.0;
float oxygenLevel = 0.0;

// =====================================================
// SENSOR SMOOTHING
// =====================================================

// Raw sensor readings
float rawHeartRate = 0.0;
float rawSpO2 = 0.0;

// Smoothed readings
float smoothHeartRate = 0.0;
float smoothSpO2 = 0.0;

// First valid reading flags
bool firstValidHeartRate = true;
bool firstValidSpO2 = true;

// Lower values provide stronger smoothing
const float HEART_RATE_SMOOTHING = 0.15;
const float SPO2_SMOOTHING = 0.10;

// Valid measurement ranges
const float MIN_HEART_RATE = 45.0;
const float MAX_HEART_RATE = 180.0;

const float MIN_SPO2 = 70.0;
const float MAX_SPO2 = 100.0;

// =====================================================
// SOS SETTINGS
// =====================================================

bool sosActive = false;
bool previousButtonState = HIGH;

unsigned long lastButtonTime = 0;
unsigned long sosStartTime = 0;

const unsigned long BUTTON_DEBOUNCE = 250;
const unsigned long SOS_TIME = 1500;

// =====================================================
// TIMING SETTINGS
// =====================================================

unsigned long lastSensorPrint = 0;
unsigned long lastDisplayUpdate = 0;

const unsigned long SENSOR_INTERVAL = 1000;
const unsigned long DISPLAY_INTERVAL = 1000;

// =====================================================
// FUNCTION DECLARATIONS
// =====================================================

void onBeatDetected();

void showMessage(String line1, String line2 = "");
void displayVitals();
void displaySOS();

void checkSOS();

void startWiFi();
void maintainWiFi();
void startWebServer();

void handleRoot();
void handleData();

// =====================================================
// HEARTBEAT CALLBACK
// =====================================================

void onBeatDetected() {
  Serial.println("BEAT DETECTED");
}

// =====================================================
// OLED MESSAGE
// =====================================================

void showMessage(String line1, String line2) {
  display.clearDisplay();

  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);

  display.setCursor(5, 22);
  display.println(line1);

  if (line2.length() > 0) {
    display.setCursor(5, 38);
    display.println(line2);
  }

  display.display();
}

// =====================================================
// OLED VITALS DISPLAY
// =====================================================

void displayVitals() {
  display.clearDisplay();

  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);

  display.setCursor(3, 0);
  display.println("DrSense");

  display.drawLine(0, 10, 127, 10, SH110X_WHITE);

  // Heart-rate label
  display.setTextSize(1);
  display.setCursor(5, 19);
  display.println("Heart Rate:");

  // Heart-rate value
  display.setTextSize(2);
  display.setCursor(75, 16);

  if (heartRate > 0) {
    display.print((int)heartRate);
  } else {
    display.print("--");
  }

  // BPM label
  display.setTextSize(1);
  display.setCursor(105, 21);
  display.print("B");

  // SpO2 label
  display.setTextSize(1);
  display.setCursor(5, 39);
  display.println("SpO2:");

  // SpO2 value
  display.setTextSize(2);
  display.setCursor(75, 36);

  if (oxygenLevel > 0 && oxygenLevel <= 100) {
    display.print((int)oxygenLevel);
  } else {
    display.print("--");
  }

  // Percentage symbol
  display.setTextSize(1);
  display.setCursor(110, 43);
  display.print("%");

  display.display();
}

// =====================================================
// SOS DISPLAY
// =====================================================

void displaySOS() {
  display.clearDisplay();

  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);

  display.setCursor(3, 0);
  display.println("DrSense");

  display.drawLine(0, 10, 127, 10, SH110X_WHITE);

  display.setTextSize(2);
  display.setCursor(38, 22);
  display.println("SOS!");

  display.setTextSize(1);
  display.setCursor(25, 45);
  display.println("Help Required");

  display.display();
}

// =====================================================
// SOS BUTTON HANDLING
// =====================================================

void checkSOS() {
  bool currentButtonState = digitalRead(SOS_BUTTON);

  if (
    previousButtonState == HIGH &&
    currentButtonState == LOW &&
    millis() - lastButtonTime > BUTTON_DEBOUNCE
  ) {
    lastButtonTime = millis();
    sosStartTime = millis();

    sosActive = true;
    digitalWrite(LED_PIN, HIGH);

    Serial.println("SOS ACTIVATED");
  }

  previousButtonState = currentButtonState;

  if (
    sosActive &&
    millis() - sosStartTime >= SOS_TIME
  ) {
    sosActive = false;
    digitalWrite(LED_PIN, LOW);

    Serial.println("SOS CLEARED");
  }
}

// =====================================================
// WI-FI STARTUP
// =====================================================

void startWiFi() {
  if (wifiStarted) {
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(false);

  Serial.println();
  Serial.println("Starting Wi-Fi...");
  Serial.print("SSID: ");
  Serial.println(WIFI_SSID);

  // Non-blocking Wi-Fi connection
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  wifiStarted = true;
  lastWifiRetry = millis();
}

// =====================================================
// WI-FI MAINTENANCE
// =====================================================

void maintainWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!webServerStarted) {
      startWebServer();
    }

    return;
  }

  if (
    millis() - lastWifiRetry >= WIFI_RETRY_TIME
  ) {
    Serial.println("Retrying Wi-Fi...");

    // Do not disconnect the ESP32.
    // This prevents unnecessary interruptions.
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    lastWifiRetry = millis();
  }
}

// =====================================================
// ROOT WEB PAGE
// =====================================================

void handleRoot() {
  server.send(
    200,
    "text/plain",
    "DrSense online\nUse /data to read sensor data."
  );
}

// =====================================================
// JSON SENSOR DATA
// =====================================================

void handleData() {
  String json = "{";

  json += "\"heartRate\":";
  json += String(heartRate, 1);
  json += ",";

  json += "\"spo2\":";
  json += String(oxygenLevel, 1);
  json += ",";

  json += "\"sos\":";
  json += sosActive ? "true" : "false";
  json += ",";

  json += "\"sensorReady\":";
  json += sensorReady ? "true" : "false";
  json += ",";

  json += "\"wifiConnected\":";
  json += WiFi.status() == WL_CONNECTED ? "true" : "false";

  json += "}";

  server.sendHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  server.send(
    200,
    "application/json",
    json
  );
}

// =====================================================
// START WEB SERVER
// =====================================================

void startWebServer() {
  if (
    webServerStarted ||
    WiFi.status() != WL_CONNECTED
  ) {
    return;
  }

  server.on("/", HTTP_GET, handleRoot);
  server.on("/data", HTTP_GET, handleData);

  server.begin();

  webServerStarted = true;

  Serial.println();
  Serial.println("Web server started.");

  Serial.print("Open this address: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/data");
}

// =====================================================
// SETUP
// =====================================================

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println();
  Serial.println("==============================");
  Serial.println("       DrSense STARTING");
  Serial.println("==============================");

  // Configure pins
  pinMode(SOS_BUTTON, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(LED_PIN, LOW);

  // =================================================
  // INITIALIZE I2C
  // =================================================

  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000);

  Serial.println("I2C initialized.");

  // =================================================
  // INITIALIZE OLED
  // =================================================

  Serial.println("Starting OLED...");

  if (!display.begin(OLED_ADDRESS, true)) {
    Serial.println("ERROR: OLED not detected.");

    while (true) {
      delay(1000);
    }
  }

  Serial.println("OLED detected.");

  showMessage("DrSense", "Starting...");
  delay(1500);

  // =================================================
  // INITIALIZE MAX30100 BEFORE WI-FI
  // =================================================

  Serial.println("Starting MAX30100...");

  if (!pox.begin()) {
    Serial.println("ERROR: MAX30100 initialization failed.");

    sensorReady = false;

    showMessage(
      "MAX30100 ERROR",
      "Check wiring"
    );
  } else {
    Serial.println("MAX30100 detected successfully.");

    sensorReady = true;

    pox.setOnBeatDetectedCallback(onBeatDetected);

    showMessage(
      "Place finger",
      "on sensor"
    );
  }

  // =================================================
  // START WI-FI LAST
  // =================================================

  startWiFi();

  Serial.println("Setup complete.");
  Serial.println("Keep your finger still on the sensor.");
}

// =====================================================
// MAIN LOOP
// =====================================================

void loop() {
  // IMPORTANT:
  // MAX30100 must be updated continuously.
  if (sensorReady) {
    pox.update();
  }

  // Handle web requests
  if (webServerStarted) {
    server.handleClient();
  }

  // Maintain Wi-Fi without blocking
  maintainWiFi();

  // Check SOS button
  checkSOS();

  // =================================================
  // READ AND SMOOTH SENSOR VALUES
  // =================================================

  if (
    millis() - lastSensorPrint >= SENSOR_INTERVAL
  ) {
    lastSensorPrint = millis();

    if (sensorReady) {
      // Read raw values
      rawHeartRate = pox.getHeartRate();
      rawSpO2 = pox.getSpO2();

      // ---------------------------------------------
      // SMOOTH HEART RATE
      // ---------------------------------------------

      if (
        rawHeartRate >= MIN_HEART_RATE &&
        rawHeartRate <= MAX_HEART_RATE
      ) {
        if (firstValidHeartRate) {
          smoothHeartRate = rawHeartRate;
          firstValidHeartRate = false;
        } else {
          smoothHeartRate =
            (HEART_RATE_SMOOTHING * rawHeartRate) +
            (
              (1.0 - HEART_RATE_SMOOTHING) *
              smoothHeartRate
            );
        }

        heartRate = smoothHeartRate;
      }

      // ---------------------------------------------
      // SMOOTH SpO2
      // ---------------------------------------------

      if (
        rawSpO2 >= MIN_SPO2 &&
        rawSpO2 <= MAX_SPO2
      ) {
        if (firstValidSpO2) {
          smoothSpO2 = rawSpO2;
          firstValidSpO2 = false;
        } else {
          smoothSpO2 =
            (SPO2_SMOOTHING * rawSpO2) +
            (
              (1.0 - SPO2_SMOOTHING) *
              smoothSpO2
            );
        }

        oxygenLevel = smoothSpO2;
      }

      // ---------------------------------------------
      // SERIAL OUTPUT
      // ---------------------------------------------

      Serial.print("Raw BPM: ");
      Serial.print(rawHeartRate, 1);

      Serial.print(" | Smooth BPM: ");
      Serial.print(heartRate, 1);

      Serial.print(" | Raw SpO2: ");
      Serial.print(rawSpO2, 1);

      Serial.print(" | Smooth SpO2: ");
      Serial.print(oxygenLevel, 1);

      Serial.println("%");
    } else {
      Serial.println("MAX30100 is not ready.");
    }
  }

  // =================================================
  // OLED UPDATE
  // =================================================

  if (
    millis() - lastDisplayUpdate >= DISPLAY_INTERVAL
  ) {
    lastDisplayUpdate = millis();

    if (sosActive) {
      displaySOS();
    } else if (sensorReady) {
      displayVitals();
    } else {
      showMessage(
        "MAX30100 ERROR",
        "Check wiring"
      );
    }
  }
}