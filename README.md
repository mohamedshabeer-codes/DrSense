# 🩺 DrSense

## AI-Powered Personal Health Monitoring & Early Warning System

[![Hardware](https://img.shields.io/badge/Hardware-ESP32-blue?style=for-the-badge&logo=espressif)](https://www.espressif.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Sensor](https://img.shields.io/badge/Sensor-MAX30102-red?style=for-the-badge)](https://datasheets.maximintegrated.com/en/ds/MAX30102.pdf)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Current Prototype](#-current-prototype)
- [Vital Sign Monitoring](#-vital-sign-monitoring)
- [AI-Assisted Analysis](#-ai-assisted-health-analysis)
- [Early Warning System](#-early-warning-system)
- [Emergency SOS](#-emergency-sos)
- [Web Dashboard](#-web-dashboard)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [System Workflow](#-system-workflow)
- [Security](#-security)
- [Future Development](#-future-development)
- [Design Philosophy](#-design-philosophy)
- [Research & Development](#-research--development)
- [Scalability](#-scalability)
- [Disclaimer](#-disclaimer)
- [Vision](#-vision)
- [Team](#-team)

---

## Overview

**DrSense** is an ESP32-based health monitoring system designed for real-time vital-sign monitoring, AI-assisted health analysis, and early warning support. It focuses on affordable, portable, and disaster-resilient healthcare solutions.

The system combines continuous health monitoring with edge AI analysis to provide contextual health insights even in resource-limited environments.

---

## 🎯 Problem Statement

**Problem Statement ID:** SIH26181 (Smart India Hackathon 2026)

During emergencies and disaster situations, injured or vulnerable individuals may have limited access to immediate medical assistance. Continuous health monitoring becomes difficult due to:

- Limited connectivity
- Insufficient resources
- Inadequate healthcare infrastructure
- Lack of portable monitoring solutions

**DrSense** addresses these challenges through a compact, affordable health-monitoring platform capable of continuously monitoring vital signs and providing early warning assistance.

---

## 💡 Our Solution

DrSense combines multiple technologies to deliver comprehensive health monitoring:

- ❤️ **Real-time Heart Rate Monitoring** — MAX30102 sensor integration
- 🫁 **SpO₂ (Blood Oxygen) Monitoring** — Continuous saturation tracking
- 📟 **Local OLED Display** — Offline vital sign visualization
- 🆘 **Emergency SOS Functionality** — Physical button + wireless alerts
- 📡 **ESP32-Based Wireless Communication** — Wi-Fi connectivity
- 🌐 **React-Based Monitoring Dashboard** — Web interface for remote monitoring
- 🤖 **AI-Assisted Health Analysis** — Gemini API integration for contextual insights
- ⚠️ **Early-Warning Detection** — Intelligent pattern recognition
- 🔒 **Privacy-Conscious Architecture** — Local processing prioritized
- 🚑 **Disaster-Resilient Design** — Works in low-connectivity environments

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────┐
│              HEALTH SENSOR                   │
│                                              │
│              MAX30102                        │
│        Heart Rate + SpO₂ Monitoring          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  ESP32                       │
│                                              │
│  • Sensor Integration                        │
│  • Data Processing                            │
│  • Wi-Fi Communication                        │
│  • REST API                                   │
│  • Local Alerts                               │
└───────────────┬──────────────────────────────┘
                │
                ├──────────────► OLED Display
                │
                ├──────────────► SOS Button / LED
                │
                ▼
┌──────────────────────────────────────────────┐
│            REST API / JSON                   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          REACT DASHBOARD                     │
│                                              │
│  • Live Health Readings                      │
│  • Device Status                             │
│  • Early Warnings                            │
│  • SOS Monitoring                            │
│  • AI Insights                               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│        AI-ASSISTED ANALYSIS                  │
│         (Gemini API)                         │
│                                              │
│  • Recent Reading Analysis                   │
│  • Trend Interpretation                      │
│  • Contextual Health Insights                │
│  • Early Warning Support                     │
└──────────────────────────────────────────────┘
```

---

## ✨ Key Features

### Hardware Integration
- ✅ ESP32 microcontroller with Wi-Fi connectivity
- ✅ MAX30102 heart rate and SpO₂ sensor
- ✅ 1.3-inch OLED display for local readings
- ✅ Physical SOS button for emergencies
- ✅ LED status indicators
- ✅ I²C communication protocol

### Software Capabilities
- ✅ Real-time vital sign monitoring
- ✅ OLED-based local health display
- ✅ REST API communication
- ✅ React-based web dashboard
- ✅ Early-warning interface
- ✅ AI-assisted contextual health insights
- ✅ SOS button with emergency indication
- ✅ Multi-language support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Microcontroller** | ESP32 |
| **Hardware Communication** | I²C, Wi-Fi |
| **Sensor** | MAX30102 |
| **Frontend** | React.js, TypeScript, Vite |
| **Backend** | Node.js, Express |
| **API Communication** | REST, JSON |
| **AI Integration** | Gemini API |
| **Local Display** | OLED (1.3-inch) |
| **Build Tool** | Vite |
| **Package Manager** | npm |

---

## 🔧 Current Prototype

### Hardware Components
- **ESP32** — Main microcontroller and system controller
- **MAX30102** — Heart-rate and SpO₂ monitoring sensor
- **1.3-inch OLED Display** — Local display of health readings
- **SOS Button** — Emergency activation
- **LED** — Status indication
- **I²C Bus** — Sensor and OLED communication
- **Wi-Fi Module** — Wireless communication

### Software Components
- **React.js** — Web-based monitoring dashboard
- **TypeScript** — Application development
- **Vite** — Frontend development and build tooling
- **Node.js** — Backend runtime
- **ESP32 WebServer** — Device-side API server
- **REST API** — ESP32-to-dashboard communication
- **JSON** — Data exchange format
- **Gemini API** — AI-assisted health analysis

### Implemented Capabilities
✅ Real-time heart-rate monitoring
✅ Real-time SpO₂ monitoring
✅ OLED-based local health display
✅ ESP32 Wi-Fi connectivity
✅ REST API communication
✅ React-based live dashboard
✅ SOS button and emergency indication
✅ Early-warning interface
✅ AI-assisted contextual health insights

> **Note:** Current prototype focuses on HR and SpO₂ monitoring using MAX30102. Additional sensors (IMU, temperature, GNSS) are planned for future MVP development.

---

## ❤️ Vital Sign Monitoring

### Heart Rate Monitoring
The MAX30102 sensor collects pulse information and estimates heart rate. Readings are processed by the ESP32 and displayed on:
- OLED display (local)
- Web dashboard (remote)
- REST API endpoint

### Blood Oxygen Saturation (SpO₂)
The MAX30102 estimates blood oxygen saturation. SpO₂ readings may be affected by:
- Sensor placement
- User movement
- Skin contact quality
- Blood perfusion
- Environmental conditions

### Local OLED Display
The 1.3-inch OLED provides immediate visual feedback without requiring web access:
- Real-time vital sign display
- Emergency status indicators
- Alert notifications

---

## 🤖 AI-Assisted Health Analysis

DrSense includes an intelligent analysis layer that interprets readings contextually rather than through simple thresholds.

### Contextual Analysis Approach

**Instead of single-reading alerts:**
```
Heart Rate ↑ → Immediate Alert ❌
```

**DrSense performs:**
```
Heart Rate ↑
    +
Recent Trend Analysis
    +
SpO₂ Context
    +
Historical Baseline
    ↓
Contextual Interpretation ✅
```

### Example Scenarios

**Scenario 1: Elevated Heart Rate**
- High Heart Rate (95 bpm)
- Recent Stable SpO₂ (98%)
- No Persistent Abnormal Trend
- **Result:** Normal after exercise or stress → No alert

**Scenario 2: Combined Abnormal Pattern**
- Elevated Heart Rate (110 bpm)
- Declining SpO₂ (92%)
- Persistent 10-minute abnormal trend
- **Result:** Potential concern → Early warning

### AI Integration
- **Provider:** Google Gemini API
- **Purpose:** Generate contextual health insights
- **Input:** Recent reading history + vital sign trends
- **Output:** Interpretive analysis (non-diagnostic)

⚠️ **Important:** AI-generated insights are experimental and NOT medical diagnoses.

---

## ⚠️ Early Warning System

The dashboard includes intelligent early-warning logic for identifying concerning patterns.

### Warning States

**🟢 NORMAL**
- Stable readings within expected range
- No abnormal patterns detected
- Standard monitoring active

**🟡 WARNING**
- Potentially concerning change detected
- Warrants attention and monitoring
- User should verify condition

**🔴 CRITICAL**
- Significant abnormal pattern identified
- May require immediate attention
- Consider seeking medical assistance

> **Note:** These states are for prototype monitoring and are NOT clinical diagnoses.

---

## 🆘 Emergency SOS

DrSense includes a physical SOS button for immediate emergency indication.

### Current Functionality
- Physical button on device
- Immediate indication on dashboard
- LED status change
- Event logging

### Future Enhancements
- 📲 Emergency contact notifications
- 🚨 Caregiver alerts
- 📍 Emergency location sharing
- 📝 Priority event logging
- 🏥 Disaster-response integration

---

## 🖥️ Web Dashboard

The React dashboard provides centralized monitoring and device control.

### Dashboard Features

**Monitoring Section**
- 📊 Live health readings display
- ❤️ Real-time heart rate graph
- 🫁 SpO₂ saturation trends
- 📡 Device connectivity status
- 🔋 Battery level indicator

**Alert Section**
- 🆘 SOS monitoring and response
- ⚠️ Early-warning indicators
- 📋 Recent events timeline
- 🔔 Notification history

**Analysis Section**
- 🤖 AI health insights
- 📈 Trend analysis
- 📊 Statistical summaries
- 📝 Health notes

**Configuration**
- 🔧 Device settings
- ⚙️ Threshold adjustment
- 🌐 Wi-Fi configuration
- 🗣️ Language selection

**Internationalization**
- 🌍 Multi-language support
- 📍 Localization support

---

## 📁 Project Structure

```
DrSense/
│
├── esp32/
│   └── drsense.ino                 # ESP32 firmware
│
├── src/
│   ├── components/
│   │   ├── AIInsightCard.tsx
│   │   ├── DetailModal.tsx
│   │   ├── DeviceConfigurationPanel.tsx
│   │   ├── DeviceStatusCard.tsx
│   │   ├── Disclaimer.tsx
│   │   ├── EarlyWarningCard.tsx
│   │   ├── Header.tsx
│   │   ├── HealthReadings.tsx
│   │   ├── ProjectInfo.tsx
│   │   ├── RecentEventsList.tsx
│   │   ├── SensorStatusBanner.tsx
│   │   └── SosMonitoringCard.tsx
│   │
│   ├── localization/
│   │   └── translations.ts         # Multi-language strings
│   │
│   ├── logic/
│   │   └── earlyWarningLogic.ts    # Warning state logic
│   │
│   ├── services/
│   │   ├── esp32Service.ts         # Device communication
│   │   └── geminiService.ts        # AI analysis service
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example                    # Environment template
├── .gitignore
├── package.json
├── package-lock.json
├── server.ts                       # Backend server
├── tsconfig.json
├── vite.config.ts
├── index.html
├── metadata.json
├── README.md
└── LICENSE
```

---

## 🔄 System Workflow

```
┌─────────────┐
│  MAX30102   │
│   Sensor    │
└──────┬──────┘
       │ (I²C)
       ▼
┌──────────────────┐
│      ESP32       │
│  • Processing    │
│  • Storage       │
│  • Analysis      │
└──────┬───────────┘
       │
   ┌───┴────┬─────────┬──────────┐
   │        │         │          │
   ▼        ▼         ▼          ▼
 OLED     SOS       LED        Wi-Fi
          Button              │
                              │ (REST API)
                              ▼
                    ┌──────────────────┐
                    │  Web Dashboard   │
                    │  (React)         │
                    └──────┬───────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
       Monitoring    Early Warning   AI Analysis
                                     (Gemini)
```

---

## 🚀 Getting Started

### Prerequisites
- Arduino IDE or PlatformIO
- Node.js (v14 or higher)
- npm
- ESP32 development board
- MAX30102 sensor module
- OLED display (1.3-inch)
- USB cable for programming

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Jasrinhumaira/DrSense-SIH26181.git
cd DrSense-SIH26181
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_ESP32_IP=192.168.1.100
```

⚠️ **Never commit** your `.env` file or API keys. Use `.env.example` as template.

#### 4. Configure ESP32 Wi-Fi

Open `esp32/drsense.ino` and update:
```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```

#### 5. Upload Firmware to ESP32

```bash
# Using Arduino IDE
1. Open esp32/drsense.ino
2. Select Board: ESP32 Dev Module
3. Select COM Port
4. Click Upload
```

Or using PlatformIO:
```bash
platformio run --target upload
```

#### 6. Start Web Application
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

**Ensure** the ESP32 and computer are on the same Wi-Fi network.

---

## 🔐 Security

### Do NOT Commit:
- `.env` and `.env.local` files
- API keys and tokens
- Wi-Fi credentials
- Private keys
- `node_modules/` directory

### Environment Variables:
```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_ESP32_IP=your_esp32_ip
```

### API Key Management:
- Store keys in environment variables only
- Use `.env` locally, never in repository
- Reference `.env.example` for required variables
- Rotate keys if exposed

### Data Security:
- Prioritize local processing
- Minimize cloud data transmission
- Avoid storing sensitive health data
- Implement proper access controls

---

## 🔮 Future Development

### Planned Hardware Expansion

**6-Axis IMU (Inertial Measurement Unit)**
- Activity context detection
- Fall detection
- Movement patterns

**Temperature Sensor**
- Body-temperature monitoring
- Fever detection
- Thermal alerts

**GNSS Module**
- Emergency location tracking
- GPS-based emergency response
- Location logging

**Additional Sensors**
- ECG (Electrocardiogram)
- Respiration rate
- Blood pressure
- Glucose levels

### Planned Software Features

**Edge AI / TinyML**
- Lightweight ML models on ESP32
- Sensor fusion algorithms
- Time-series analysis
- Personalized baseline learning

**Enhanced Analytics**
- Historical data tracking
- Trend prediction
- Anomaly detection
- Risk scoring

**Connectivity Expansion**
- Bluetooth Low Energy (BLE)
- LoRaWAN support
- Cellular backup
- Cloud synchronization

**Integration**
- Electronic health records (EHR)
- Telemedicine platforms
- Wearable device integration
- Emergency services API

### Deployment Technologies
- **TensorFlow Lite for Microcontrollers**
- **LiteRT for resource-constrained devices**
- **ONNX for cross-platform models**

---

## 🔬 Research & Development

DrSense explores cutting-edge technologies in:

- ✅ ESP32 edge computing
- ✅ Pulse-oximetry sensor integration
- ✅ Vital-sign signal processing
- ✅ Real-time trend analysis
- ✅ Sensor fusion techniques
- ✅ Personalized baseline detection
- ✅ AI-assisted health interpretation
- ✅ Edge AI / TinyML deployment
- ✅ Disaster-resilient IoT systems
- ✅ Low-cost healthcare technology

---

## 🌱 Scalability

The architecture supports future expansion:

**Hardware Scalability**
- Multi-sensor integration
- Multiple device support
- Edge gateway architecture

**Software Scalability**
- Microservices architecture
- Cloud integration
- Historical data storage
- Analytics pipeline

**User Scalability**
- Caregiver dashboards
- Multi-device monitoring
- User hierarchies
- Role-based access control

**Feature Scalability**
- Plugin architecture
- Custom algorithm integration
- Third-party service integration
- API extensibility

---

## 🧠 Design Philosophy

### Core Principles

**Affordable** 💰
Use accessible embedded hardware and sensors to reduce system cost.

**Portable** 📦
Design around compact hardware suitable for personal and field use.

**Context-Aware** 🎯
Avoid treating single abnormal readings as definitive medical conditions.

**Privacy-Conscious** 🔒
Prioritize local processing and minimize sensitive health data transfer.

**Disaster-Resilient** 🚑
Design with low-connectivity and emergency scenarios in mind.

**Extensible** 🔌
Allow additional sensors, communication methods, and AI models to be integrated over time.

---

## 📊 Current Status

### Prototype Status: ✅ Functional

**Implemented Features:**
- ✅ ESP32 hardware integration
- ✅ MAX30102 sensor integration
- ✅ Heart-rate monitoring
- ✅ SpO₂ monitoring
- ✅ OLED display output
- ✅ SOS button functionality
- ✅ LED status indication
- ✅ Wi-Fi connectivity
- ✅ REST API communication
- ✅ React monitoring dashboard
- ✅ Early-warning interface
- ✅ AI-assisted analysis architecture

---

## ⚕️ Disclaimer

**DrSense is an experimental prototype** developed for research, educational, demonstration, and innovation purposes.

### Important Notes:
- ❌ **NOT a medical diagnostic device**
- ❌ **NOT a replacement for professional medical evaluation**
- ❌ **NOT approved for clinical use**

### Sensor Limitations:
Readings may be affected by:
- Sensor placement and orientation
- User movement and motion artifacts
- Skin contact quality
- Blood perfusion variation
- Environmental temperature
- Hardware and software limitations
- Signal processing artifacts

### AI Disclaimer:
- AI-generated insights are experimental and informational only
- Not qualified as medical analysis
- Should not be used for clinical decision-making
- Always consult healthcare professionals for medical concerns

### Emergency:
**For medical emergencies, call emergency services immediately.**

---

## 🚀 Vision

### Making Intelligent Health Monitoring Accessible

**DrSense aims to bridge:**

```
Hardware  +  IoT  +  AI  +  Healthcare  +  Emergency Response
                        ↓
        Practical Next-Generation Personal Health Monitoring
```

### Long-Term Goals:
- 🌍 Global accessibility
- 💰 Affordability at scale
- 🔒 Privacy-first approach
- 🚑 Disaster response capability
- 📱 Seamless integration
- 🤝 Healthcare system integration
- 🎓 Educational impact
- 🔬 Research advancement

### Target Applications:
- 🚨 Disaster response operations
- 🏕️ Remote and rural healthcare
- 🏚️ Emergency shelter monitoring
- 👨‍👩‍👧 Family health tracking
- 🏥 Preliminary health observation
- ⛑️ First responder support
- 🌐 Global health initiatives

---

## 👥 Team

### Team Invictus — DrSense Development Team

| Member | Role |
|--------|------|
| **Mohamed Shabeer** | Project Lead & System Architecture |
| **Jasrin Humaira** |Lead Software Development |
| **Kalaiselvi** | Frontend & Integration |
| **Sireesh** | Research & Technical Analysis |
| **Narendra Prasath** | Project Ideation & Concept Development |
| **Nisarudden** | Technical Support & Development Assistance |

### Roles & Responsibilities

**Project Lead**
- Overall project leadership
- System architecture design
- Hardware integration
- Team coordination

**Software Team**
- Web application development
- Dashboard implementation
- API integration
- Software testing

**Research Team**
- Project ideation
- Technical analysis
- Innovation exploration
- Concept refinement

**Support Team**
- Technical assistance
- Development support
- Testing and QA
- Documentation

---

## 📄 License

This project is developed for **Smart India Hackathon 2026 (SIH26181)**.

For licensing information, see the LICENSE file.


⭐ If you find this project helpful, please consider giving it a star!
