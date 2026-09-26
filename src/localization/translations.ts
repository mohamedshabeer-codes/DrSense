import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  deviceStatusTitle: string;
  deviceConnected: string;
  deviceNotConnected: string;
  deviceConnecting: string;
  reconnect: string;
  disconnect: string;
  connect: string;
  retry: string;
  close: string;
  refreshNow: string;
  clearAddress: string;
  resetDefault: string;
  clickForDetails: string;
  viewFullLog: string;
  clearEventsHistory: string;
  noEventsYet: string;
  hardwareNote: string;
  activeTarget: string;

  // Readings
  heartRate: string;
  spo2: string;
  bpmUnit: string;
  percentUnit: string;
  readingStatus: string;
  statusNormal: string;
  statusAttention: string;
  statusCritical: string;
  statusNoData: string;
  statusChecking: string;

  // Sensor statuses
  sensorPlaceFinger: string;
  sensorMeasuring: string;
  sensorRemainStill: string;
  sensorMonitoring: string;
  sensorUnavailable: string;
  sensorAdjustFinger: string;
  sensorDeviceDisconnected: string;
  sensorWaitingDevice: string;

  // Early warning insights
  insightsTitle: string;
  ruleBasedSafetyTitle: string;
  aiInsightsTitle: string;
  aiInsightsSubtitle: string;
  aiStatusAvailable: string;
  aiStatusAnalyzing: string;
  aiStatusUnavailable: string;
  aiAnalyzeButton: string;
  aiRefreshButton: string;
  aiCooldownNotice: string;
  aiStatusLabel: string;
  aiObservationLabel: string;
  aiReasonLabel: string;
  aiRecommendationLabel: string;
  aiConfidenceLabel: string;
  aiNoFakeDataNote: string;
  aiOfflineNotice: string;
  aiNoDataNotice: string;
  aiNoFingerNotice: string;
  aiMeasuringNotice: string;
  aiDisconnectedNotice: string;
  aiPoweredBy: string;
  aiMedicalDisclaimer: string;
  aiLastAnalyzed: string;
  insightWaitingData: string;
  insightNoFinger: string;
  insightMeasuring: string;
  insightStable: string;
  insightAttention: string;
  insightSosAlert: string;
  insightSosCheckUser: string;
  insightInvalidData: string;

  // SOS
  sosTitle: string;
  sosNormalTitle: string;
  sosNormalDesc: string;
  sosStandbyTitle: string;
  sosStandbyDesc: string;
  sosPressedTitle: string;
  sosPressedDesc: string;
  sosPendingTitle: string;
  sosPendingDesc: string;
  sosConfirmedTitle: string;
  sosConfirmedDesc: string;
  sosActivatedTitle: string;
  sosActivatedDesc: string;
  sosCancelledTitle: string;
  sosCancelledDesc: string;
  sosDisconnectedTitle: string;
  sosDisconnectedDesc: string;

  // Device status section
  drsenseDevice: string;
  sensorLabel: string;
  sensorReady: string;
  sensorWaiting: string;
  sensorNotAvailable: string;
  lastUpdated: string;
  connectionStatusLabel: string;
  neverUpdated: string;

  // Configuration
  configTitle: string;
  configSubtitle: string;
  configAddressLabel: string;
  configAddressPlaceholder: string;
  configHelpText: string;
  toggleConfigOpen: string;
  toggleConfigClose: string;
  connResultSuccess: string;
  connResultFailed: string;
  connAttempting: string;

  // Modal Specific Titles & Explanations
  hrModalTitle: string;
  hrModalDesc: string;
  hrGuideTitle: string;
  hrGuideNormal: string;
  hrGuideAttention: string;
  hrGuideCritical: string;

  spo2ModalTitle: string;
  spo2ModalDesc: string;
  spo2GuideTitle: string;
  spo2GuideNormal: string;
  spo2GuideAttention: string;
  spo2GuideCritical: string;

  sensorModalTitle: string;
  sensorModalDesc: string;
  sensorStep1: string;
  sensorStep2: string;
  sensorStep3: string;

  readingStatusModalTitle: string;
  readingStatusModalDesc: string;
  readingStatusNonDiagnosticNote: string;

  earlyWarningModalTitle: string;
  earlyWarningModalDesc: string;
  earlyWarningRuleSummary: string;

  sosModalTitle: string;
  sosModalDesc: string;
  sosHardwareOnlyNotice: string;

  lastUpdatedModalTitle: string;
  lastUpdatedModalDesc: string;
  dataAvailability: string;
  dataAvailable: string;
  dataUnavailable: string;

  // Events
  eventsTitle: string;
  eventsEmpty: string;
  eventDeviceConnected: string;
  eventDeviceConnectedDesc: string;
  eventDeviceDisconnected: string;
  eventDeviceDisconnectedDesc: string;
  eventReadingStarted: string;
  eventReadingStartedDesc: string;
  eventReadingUnavailable: string;
  eventReadingUnavailableDesc: string;
  eventReadingRestored: string;
  eventReadingRestoredDesc: string;
  eventSosPressed: string;
  eventSosPressedDesc: string;
  eventSosPending: string;
  eventSosPendingDesc: string;
  eventSosActivated: string;
  eventSosActivatedDesc: string;
  eventSosCancelled: string;
  eventSosCancelledDesc: string;
  eventStatusChanged: string;
  eventStatusChangedDesc: string;

  // Project Info
  aboutTitle: string;
  aboutPoint1: string;
  aboutPoint2: string;
  aboutPoint3: string;
  aboutPoint4: string;
  aboutPoint5: string;

  // Disclaimer
  disclaimerTitle: string;
  disclaimerLine1: string;
  disclaimerLine2: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'DrSense',
    appSubtitle: 'Personal Health Monitoring & Early Warning System',
    tagline: 'On-Device Disaster Resilience Monitoring',
    deviceStatusTitle: 'Device Status',
    deviceConnected: 'Device Connected',
    deviceNotConnected: 'Device Not Connected',
    deviceConnecting: 'Connecting...',
    reconnect: 'Reconnect',
    disconnect: 'Disconnect',
    connect: 'Connect',
    retry: 'Retry',
    close: 'Close',
    refreshNow: 'Refresh Data',
    clearAddress: 'Clear',
    resetDefault: 'Reset to Default',
    clickForDetails: 'Click for details',
    viewFullLog: 'View Event History',
    clearEventsHistory: 'Clear History',
    noEventsYet: 'No events recorded yet.',
    hardwareNote: 'Physical ESP32 & MAX30102 on local network',
    activeTarget: 'Configured Address',

    heartRate: 'Heart Rate',
    spo2: 'SpO₂',
    bpmUnit: 'BPM',
    percentUnit: '%',
    readingStatus: 'Reading Status',
    statusNormal: 'Normal',
    statusAttention: 'Needs Attention',
    statusCritical: 'Critical',
    statusNoData: 'No Data',
    statusChecking: 'Checking...',

    sensorPlaceFinger: 'Place your finger on the sensor',
    sensorMeasuring: 'Checking your readings...',
    sensorRemainStill: 'Please remain still.',
    sensorMonitoring: 'Your readings are being monitored.',
    sensorUnavailable: 'Reading unavailable',
    sensorAdjustFinger: 'Please adjust your finger and try again.',
    sensorDeviceDisconnected: 'Device not connected',
    sensorWaitingDevice: 'Waiting for the DrSense device.',

    insightsTitle: 'Early-Warning Insights',
    ruleBasedSafetyTitle: 'Rule-Based Safety Classification',
    aiInsightsTitle: 'AI-Assisted Early-Warning Insights',
    aiInsightsSubtitle: 'AI Live Sensor Interpretation Layer',
    aiStatusAvailable: 'AI Ready',
    aiStatusAnalyzing: 'Analyzing readings...',
    aiStatusUnavailable: 'AI Temporarily Unavailable',
    aiAnalyzeButton: 'Analyze Reading',
    aiRefreshButton: 'Refresh AI Insight',
    aiCooldownNotice: 'Please wait a moment before requesting the next AI analysis.',
    aiStatusLabel: 'Status',
    aiObservationLabel: 'Observation',
    aiReasonLabel: 'Reason',
    aiRecommendationLabel: 'Recommendation',
    aiConfidenceLabel: 'Signal Assessment',
    aiNoFakeDataNote: 'Real MAX30102 readings only • No simulated values',
    aiOfflineNotice: 'AI-assisted analysis is temporarily unavailable. Core device monitoring and rule-based safety alerts remain fully operational.',
    aiNoDataNotice: 'AI analysis is unavailable because valid sensor data is not currently available.',
    aiNoFingerNotice: 'Place your finger on the sensor to begin AI-assisted analysis.',
    aiMeasuringNotice: 'Collecting a reliable reading before generating an AI-assisted insight.',
    aiDisconnectedNotice: 'AI analysis is unavailable because the DrSense device is not connected.',
    aiPoweredBy: 'AI-assisted analysis • Real MAX30102 & ESP32 Data Only',
    aiMedicalDisclaimer: 'DrSense provides early-awareness insights based on sensor readings. It is not a medical diagnostic device. Always consider symptoms and professional medical advice when making health decisions.',
    aiLastAnalyzed: 'Last AI Analysis',
    insightWaitingData: 'Waiting for readings from the DrSense device.',
    insightNoFinger: 'Please place your finger properly on the sensor to begin monitoring.',
    insightMeasuring: 'Checking your readings. Please remain still.',
    insightStable: 'Your current readings appear stable. Continue monitoring.',
    insightAttention: 'These readings may need attention. Please check the sensor again and seek assistance if symptoms occur.',
    insightSosAlert: 'SOS signal detected.',
    insightSosCheckUser: 'Please check the user immediately.',
    insightInvalidData: 'We could not get a reliable reading. Please adjust your finger and try again.',

    sosTitle: 'Emergency Alert & SOS',
    sosNormalTitle: 'SYSTEM NORMAL',
    sosNormalDesc: 'No active emergency',
    sosStandbyTitle: 'SOS STANDBY',
    sosStandbyDesc: 'Ready for emergency signals from hardware',
    sosPressedTitle: 'SOS BUTTON PRESSED',
    sosPressedDesc: 'Physical emergency button pressed on DrSense device.',
    sosPendingTitle: 'SOS CONFIRMATION PENDING',
    sosPendingDesc: 'Verifying emergency alert signal...',
    sosConfirmedTitle: 'SOS CONFIRMED',
    sosConfirmedDesc: 'Emergency signal confirmed by DrSense device.',
    sosActivatedTitle: 'SOS ACTIVATED',
    sosActivatedDesc: 'Emergency alert detected from the DrSense device.',
    sosCancelledTitle: 'SOS CANCELLED',
    sosCancelledDesc: 'Emergency alert has been cleared.',
    sosDisconnectedTitle: 'DEVICE NOT CONNECTED',
    sosDisconnectedDesc: 'Emergency monitoring unavailable while disconnected.',

    drsenseDevice: 'DrSense Device',
    sensorLabel: 'Sensor',
    sensorReady: 'Ready',
    sensorWaiting: 'Waiting',
    sensorNotAvailable: 'Not Available',
    lastUpdated: 'Last Updated',
    connectionStatusLabel: 'Connection Status',
    neverUpdated: '--',

    configTitle: 'Device Setup & Connection',
    configSubtitle: 'Direct communication with physical ESP32 on your local network',
    configAddressLabel: 'Device Address',
    configAddressPlaceholder: 'http://ESP32_IP_ADDRESS/data',
    configHelpText: 'Enter the local IP address of your ESP32 (e.g. http://192.168.4.1/data or http://192.168.1.50/data). Periodic polling occurs approximately every 1 second.',
    toggleConfigOpen: 'Device Setup',
    toggleConfigClose: 'Close Setup',
    connResultSuccess: 'Successfully connected to DrSense device.',
    connResultFailed: 'Connection failed. Check device power and local Wi-Fi.',
    connAttempting: 'Checking connection to ESP32...',

    hrModalTitle: 'Heart Rate Details',
    hrModalDesc: 'Heart Rate pulse measurement from MAX30102 sensor optical photoplethysmography.',
    hrGuideTitle: 'General Reference Ranges (Adult at Rest):',
    hrGuideNormal: 'Normal: 60 to 100 BPM.',
    hrGuideAttention: 'Needs Attention: Below 60 BPM or above 100 BPM at rest.',
    hrGuideCritical: 'Critical Alert: Below 45 BPM or above 135 BPM.',

    spo2ModalTitle: 'SpO₂ Blood Oxygen Details',
    spo2ModalDesc: 'Peripheral capillary oxygen saturation level measured via optical red and infrared light absorption.',
    spo2GuideTitle: 'Standard Reference Levels:',
    spo2GuideNormal: 'Normal: 95% to 100%.',
    spo2GuideAttention: 'Needs Attention: 90% to 94%.',
    spo2GuideCritical: 'Critical: Below 90% indicates immediate oxygen attention is required.',

    sensorModalTitle: 'MAX30102 Sensor Guidance',
    sensorModalDesc: 'Integrated pulse oximetry and heart-rate optical biosensor connected to ESP32.',
    sensorStep1: 'Place fingertip gently and completely over the optical sensor lens.',
    sensorStep2: 'Keep your hand and finger stationary without pressing too hard.',
    sensorStep3: 'Wait 3–5 seconds for the reading to stabilize and display.',

    readingStatusModalTitle: 'Reading Status Overview',
    readingStatusModalDesc: 'Status indicator classifying vital measurements against standard threshold bands.',
    readingStatusNonDiagnosticNote: 'Important Notice: Reading Status is an indicator only and is not a medical diagnosis. DrSense does not diagnose or predict diseases.',

    earlyWarningModalTitle: 'Early-Warning Insight Details',
    earlyWarningModalDesc: 'Deterministic on-device rules evaluating real sensor signals, vitals, and emergency flags.',
    earlyWarningRuleSummary: 'Rule logic evaluates incoming Heart Rate, SpO₂, and hardware SOS push-button status. Emergency SOS triggers always take absolute highest priority.',

    sosModalTitle: 'Physical SOS Emergency Alert',
    sosModalDesc: 'Hardware push-button connected to ESP32 DevKit V1 for immediate disaster and emergency signaling.',
    sosHardwareOnlyNotice: 'Notice: This alerts on the local device dashboard and on-device LED indicator. It does not dispatch automated phone calls, SMS, ambulance, police, or hospital emergency services.',

    lastUpdatedModalTitle: 'Data Synchronization Status',
    lastUpdatedModalDesc: 'Status of real-time communication between DrSense hardware and dashboard.',
    dataAvailability: 'Data Availability',
    dataAvailable: 'Real Hardware Data Active',
    dataUnavailable: 'No Hardware Data Received',

    eventsTitle: 'Recent Events',
    eventsEmpty: 'No events recorded yet.',
    eventDeviceConnected: 'Device Connected',
    eventDeviceConnectedDesc: 'Communication established with DrSense hardware.',
    eventDeviceDisconnected: 'Device Disconnected',
    eventDeviceDisconnectedDesc: 'Lost connection to DrSense hardware.',
    eventReadingStarted: 'Sensor Reading Started',
    eventReadingStartedDesc: 'Finger detected on MAX30102 sensor.',
    eventReadingUnavailable: 'Sensor Reading Unavailable',
    eventReadingUnavailableDesc: 'Finger removed or signal disrupted.',
    eventReadingRestored: 'Sensor Reading Restored',
    eventReadingRestoredDesc: 'Stable sensor readings resumed.',
    eventSosPressed: 'SOS Button Pressed',
    eventSosPressedDesc: 'Physical push button triggered on ESP32.',
    eventSosPending: 'SOS Confirmation Pending',
    eventSosPendingDesc: 'Checking emergency signal from hardware.',
    eventSosActivated: 'SOS Activated',
    eventSosActivatedDesc: 'Active emergency alert raised from device.',
    eventSosCancelled: 'SOS Cancelled',
    eventSosCancelledDesc: 'Emergency alert cleared.',
    eventStatusChanged: 'Reading Status Changed',
    eventStatusChangedDesc: 'Health readings transitioned state.',

    aboutTitle: 'What is DrSense?',
    aboutPoint1: 'DrSense monitors Heart Rate and SpO₂ using the physical device.',
    aboutPoint2: 'The sensors send readings through the ESP32 to the local application.',
    aboutPoint3: 'The system provides simple early-warning information.',
    aboutPoint4: 'The physical SOS button can send an emergency signal to the application.',
    aboutPoint5: 'Local monitoring can remain useful when centralized systems may be unavailable.',

    disclaimerTitle: 'Notice',
    disclaimerLine1: 'DrSense provides early-awareness insights based on sensor readings. It is not a medical diagnostic device.',
    disclaimerLine2: 'Always consider symptoms and professional medical advice when making health decisions.',
  },

  ta: {
    appName: 'DrSense',
    appSubtitle: 'தனிநபர் சுகாதார கண்காணிப்பு & முன்கூட்டிய எச்சரிக்கை அமைப்பு',
    tagline: 'பேரிடர் தாங்கும் திறன் கொண்ட நேரடி கண்காணிப்பு',
    deviceStatusTitle: 'சாதன நிலை',
    deviceConnected: 'சாதனம் இணைக்கப்பட்டுள்ளது',
    deviceNotConnected: 'சாதனம் இணைக்கப்படவில்லை',
    deviceConnecting: 'இணைகிறது...',
    reconnect: 'மீண்டும் இணை',
    disconnect: 'துண்டிக்கவும்',
    connect: 'இணைக்கவும்',
    retry: 'மீண்டும் முயற்சி செய்',
    close: 'மூடு',
    refreshNow: 'இப்போது புதுப்பி',
    clearAddress: 'அழி',
    resetDefault: 'இயல்புநிலைக்கு மீட்டமை',
    clickForDetails: 'விவரங்களுக்கு கிளிக் செய்யவும்',
    viewFullLog: 'முழு வரலாற்றைப் பார்',
    clearEventsHistory: 'வரலாற்றை அழி',
    noEventsYet: 'இதுவரை எந்த நிகழ்வுகளும் பதிவாகவில்லை.',
    hardwareNote: 'உள்ளூர் நெட்வொர்க்கில் உள்ள நேரடி ESP32 & MAX30102',
    activeTarget: 'அமைக்கப்பட்ட முகவரி',

    heartRate: 'இதயத் துடிப்பு',
    spo2: 'SpO₂',
    bpmUnit: 'BPM',
    percentUnit: '%',
    readingStatus: 'அளவீட்டு நிலை',
    statusNormal: 'இயல்பானது',
    statusAttention: 'கவனம் தேவை',
    statusCritical: 'அபாயகரமானது',
    statusNoData: 'தரவு இல்லை',
    statusChecking: 'சரிபார்க்கப்படுகிறது...',

    sensorPlaceFinger: 'விரலை சென்சாரில் வைக்கவும்',
    sensorMeasuring: 'உங்கள் அளவீடுகள் சரிபார்க்கப்படுகின்றன...',
    sensorRemainStill: 'தயவுசெய்து அசையாமல் இருக்கவும்.',
    sensorMonitoring: 'உங்கள் அளவீடுகள் கண்காணிக்கப்படுகின்றன.',
    sensorUnavailable: 'அளவீடு கிடைக்கவில்லை',
    sensorAdjustFinger: 'தயவுசெய்து விரலை சரிசெய்து மீண்டும் முயற்சிக்கவும்.',
    sensorDeviceDisconnected: 'சாதனம் இணைக்கப்படவில்லை',
    sensorWaitingDevice: 'DrSense சாதனத்திற்காக காத்திருக்கிறது.',

    insightsTitle: 'முன்கூட்டிய எச்சரிக்கை நுண்ணறிவு',
    ruleBasedSafetyTitle: 'விதிமுறை அடிப்படையிலான பாதுகாப்பு வகைப்பாடு',
    aiInsightsTitle: 'AI-உதவி முன்கூட்டிய எச்சரிக்கை நுண்ணறிவு',
    aiInsightsSubtitle: 'AI நேரடி சென்சார் விளக்க அடுக்கு',
    aiStatusAvailable: 'AI தயார்',
    aiStatusAnalyzing: 'AI அளவீடுகளை பகுப்பாய்வு செய்கிறது...',
    aiStatusUnavailable: 'AI தற்காலிகமாக கிடைக்கவில்லை',
    aiAnalyzeButton: 'அளவீட்டை பகுப்பாய்வு செய்',
    aiRefreshButton: 'AI நுண்ணறிவைப் புதுப்பி',
    aiCooldownNotice: 'அடுத்த AI பகுப்பாய்வைக் கோருவதற்கு முன் சிறிது நேரம் காத்திருக்கவும்.',
    aiStatusLabel: 'நிலை',
    aiObservationLabel: 'கவனிப்பு',
    aiReasonLabel: 'காரணம்',
    aiRecommendationLabel: 'பரிந்துரை',
    aiConfidenceLabel: 'சிக்னல் மதிப்பீடு',
    aiNoFakeDataNote: 'உண்மையான MAX30102 அளவீடுகள் மட்டுமே • போலியான மதிப்புகள் இல்லை',
    aiOfflineNotice: 'AI-உதவி பகுப்பாய்வு தற்காலிகமாக கிடைக்கவில்லை. முக்கிய சாதனக் கண்காணிப்பு மற்றும் விதிமுறை அடிப்படையிலான பாதுகாப்பு எச்சரிக்கைகள் முழுமையாகச் செயல்படுகின்றன.',
    aiNoDataNotice: 'சரியான சென்சார் தரவு தற்போது கிடைக்காததால் AI பகுப்பாய்வு கிடைக்கவில்லை.',
    aiNoFingerNotice: 'AI-உதவி பகுப்பாய்வைத் தொடங்க விரலை சென்சாரில் வைக்கவும்.',
    aiMeasuringNotice: 'AI-உதவி நுண்ணறிவை உருவாக்குவதற்கு முன் நம்பகமான அளவீட்டைச் சேகரிக்கிறது.',
    aiDisconnectedNotice: 'DrSense சாதனம் இணைக்கப்படாததால் AI பகுப்பாய்வு கிடைக்கவில்லை.',
    aiPoweredBy: 'AI-உதவி பகுப்பாய்வு • உண்மையான MAX30102 மற்றும் ESP32 தரவு மட்டுமே',
    aiMedicalDisclaimer: 'DrSense சென்சார் அளவீடுகளின் அடிப்படையில் முன்கூட்டிய விழிப்புணர்வு தகவல்களை மட்டுமே வழங்குகிறது. இது மருத்துவ நோயறிதல் சாதனம் அல்ல. சுகாதார முடிவுகளை எடுக்கும்போது எப்போதும் அறிகுறிகளையும் தகுதியான மருத்துவ ஆலோசனைகளையும் கருத்தில் கொள்ளுங்கள்.',
    aiLastAnalyzed: 'கடைசி AI பகுப்பாய்வு',
    insightWaitingData: 'DrSense சாதனத்திலிருந்து அளவீடுகளுக்காக காத்திருக்கிறது.',
    insightNoFinger: 'கண்காணிப்பைத் தொடங்க விரலை சென்சாரில் சரியாக வைக்கவும்.',
    insightMeasuring: 'உங்கள் அளவீடுகள் சரிபார்க்கப்படுகின்றன. தயவுசெய்து அசையாமல் இருக்கவும்.',
    insightStable: 'உங்கள் தற்போதைய அளவீடுகள் சீராக உள்ளன. கண்காணிப்பைத் தொடரவும்.',
    insightAttention: 'இந்த அளவீடுகளுக்கு கவனம் தேவைப்படலாம். சென்சாரை மீண்டும் சரிபார்க்கவும், அறிகுறிகள் இருந்தால் உதவி பெறவும்.',
    insightSosAlert: 'SOS அவசர சமிக்ஞை கண்டறியப்பட்டது.',
    insightSosCheckUser: 'உடனடியாக பயனரை பரிசோதிக்கவும்.',
    insightInvalidData: 'நம்பகமான அளவீட்டைப் பெற முடியவில்லை. விரலை சரிசெய்து மீண்டும் முயற்சிக்கவும்.',

    sosTitle: 'அவசர எச்சரிக்கை & SOS',
    sosNormalTitle: 'அமைப்பு இயல்பானது',
    sosNormalDesc: 'செயலில் உள்ள அவசரநிலை இல்லை',
    sosStandbyTitle: 'SOS காத்திருப்பு',
    sosStandbyDesc: 'சாதனத்தின் அவசர சமிக்ஞைக்கு தயாராக உள்ளது',
    sosPressedTitle: 'SOS பொத்தான் அழுத்தப்பட்டது',
    sosPressedDesc: 'DrSense சாதனத்தில் உள்ள நேரடி அவசர பொத்தான் இயக்கப்பட்டது.',
    sosPendingTitle: 'SOS உறுதிப்படுத்தல் நிலுவையில் உள்ளது',
    sosPendingDesc: 'அவசர எச்சரிக்கை சமிக்ஞை சரிபார்க்கப்படுகிறது...',
    sosConfirmedTitle: 'SOS உறுதிப்படுத்தப்பட்டது',
    sosConfirmedDesc: 'DrSense சாதனத்திலிருந்து அவசர சமிக்ஞை உறுதி செய்யப்பட்டது.',
    sosActivatedTitle: 'SOS செயல்படுத்தப்பட்டது',
    sosActivatedDesc: 'DrSense சாதனத்திலிருந்து அவசர எச்சரிக்கை கண்டறியப்பட்டது.',
    sosCancelledTitle: 'SOS ரத்து செய்யப்பட்டது',
    sosCancelledDesc: 'அவசர சமிக்ஞை அழிக்கப்பட்டது.',
    sosDisconnectedTitle: 'சாதனம் இணைக்கப்படவில்லை',
    sosDisconnectedDesc: 'சாதனம் இணைக்கப்படாதபோது அவசர கண்காணிப்பு கிடைக்காது.',

    drsenseDevice: 'DrSense சாதனம்',
    sensorLabel: 'சென்சார்',
    sensorReady: 'தயார்',
    sensorWaiting: 'காத்திருக்கிறது',
    sensorNotAvailable: 'கிடைக்கவில்லை',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    connectionStatusLabel: 'இணைப்பு நிலை',
    neverUpdated: '--',

    configTitle: 'சாதன அமைப்பு & பிணைய இணைப்பு',
    configSubtitle: 'உங்கள் உள்ளூர் வைஃபை நெட்வொர்க் வழியாக ESP32 வன்பொருளுடன் நேரடி தொடர்பு',
    configAddressLabel: 'சாதன முகவரி',
    configAddressPlaceholder: 'http://ESP32_IP_ADDRESS/data',
    configHelpText: 'உங்கள் ESP32 இன் உள்ளூர் பிணைய முகவரியை உள்ளிடவும் (எ.கா. http://192.168.4.1/data அல்லது http://192.168.1.50/data). பயன்பாடு வினாடிக்கு ஒரு முறை தரவை புதுப்பிக்கிறது.',
    toggleConfigOpen: 'சாதன அமைப்பு',
    toggleConfigClose: 'அமைப்பை மூடு',
    connResultSuccess: 'DrSense சாதனத்துடன் வெற்றிகரமாக இணைக்கப்பட்டது.',
    connResultFailed: 'இணைப்பு தோல்வியடைந்தது. சாதனத்தின் மின்சாரம் மற்றும் வைஃபை சரிபார்க்கவும்.',
    connAttempting: 'ESP32 இணைப்பு சரிபார்க்கப்படுகிறது...',

    hrModalTitle: 'இதயத் துடிப்பு விவரங்கள்',
    hrModalDesc: 'MAX30102 ஒளியியல் சென்சார் மூலம் பெறப்பட்ட தற்போதைய இதயத் துடிப்பு அளவீடு.',
    hrGuideTitle: 'பொதுவான வழிகாட்டு அளவுகள் (ஓய்வு நிலையில் உள்ள பெரியவர்கள்):',
    hrGuideNormal: 'இயல்பானது: 60 முதல் 100 BPM வரை.',
    hrGuideAttention: 'கவனம் தேவை: ஓய்வில் 60 BPM-க்கு கீழே அல்லது 100 BPM-க்கு மேலே.',
    hrGuideCritical: 'அபாய எச்சரிக்கை: 45 BPM-க்கு கீழே அல்லது 135 BPM-க்கு மேலே.',

    spo2ModalTitle: 'SpO₂ இரத்த ஆக்சிஜன் விவரங்கள்',
    spo2ModalDesc: 'ஒளியியல் சிவப்பு மற்றும் அகச்சிவப்பு ஒளி உறிஞ்சுதல் மூலம் அளவிடப்பட்ட இரத்த ஆக்சிஜன் சதவீதம்.',
    spo2GuideTitle: 'நிலையான குறிப்பு நிலைகள்:',
    spo2GuideNormal: 'இயல்பானது: 95% முதல் 100% வரை.',
    spo2GuideAttention: 'கவனம் தேவை: 90% முதல் 94% வரை.',
    spo2GuideCritical: 'அபாயகரமானது: 90%-க்கு கீழே இருந்தால் உடனடி ஆக்சிஜன் கவனம் தேவை.',

    sensorModalTitle: 'MAX30102 சென்சார் வழிகாட்டல்',
    sensorModalDesc: 'ESP32 உடன் இணைக்கப்பட்ட ஒருங்கிணைந்த இதயத் துடிப்பு & ஆக்சிஜன் சென்சார்.',
    sensorStep1: 'விரல் நுனியை சென்சாரின் ஒளியியல் லென்ஸ் மீது மெதுவாக வைக்கவும்.',
    sensorStep2: 'அதிக அழுத்தம் தராமல் கையை அசையாமல் வைக்கவும்.',
    sensorStep3: 'அளவீடு நிலையாக திரையில் தோன்ற 3 முதல் 5 வினாடிகள் காத்திருக்கவும்.',

    readingStatusModalTitle: 'அளவீட்டு நிலை விளக்கம்',
    readingStatusModalDesc: 'சென்சார் அளவீடுகளை நிலையான வரம்புகளுடன் வகைப்படுத்தும் நிலை காட்டி.',
    readingStatusNonDiagnosticNote: 'முக்கிய அறிவிப்பு: இந்த அளவீட்டு நிலை விழிப்புணர்வுக்கான வழிகாட்டி மட்டுமே, இது மருத்துவ நோயறிதல் அல்ல. DrSense நோய்களைக் கண்டறிவதில்லை.',

    earlyWarningModalTitle: 'முன்கூட்டிய எச்சரிக்கை விதி நுண்ணறிவு',
    earlyWarningModalDesc: 'சென்சார் சமிக்ஞைகள் மற்றும் அவசர நிலைகளை மதிப்பிடும் உள்ளூர் விதிமுறை அமைப்பு.',
    earlyWarningRuleSummary: 'இதயத் துடிப்பு, SpO₂ மற்றும் வன்பொருள் SOS சமிக்ஞைகளை அடிப்படையாகக் கொண்டு செயல்படுகிறது. SOS சமிக்ஞை எப்போதும் முதல் முன்னுரிமை பெறும்.',

    sosModalTitle: 'நேரடி SOS அவசர எச்சரிக்கை',
    sosModalDesc: 'பேரிடர் காலங்களில் உடனடி எச்சரிக்கை சமிக்ஞையை அனுப்ப ESP32 இல் உள்ள நேரடி பொத்தான்.',
    sosHardwareOnlyNotice: 'அறிவிப்பு: இது உள்ளூர் சாதனம் மற்றும் டாஷ்போர்டில் மட்டுமே எச்சரிக்கையை காட்டுகிறது. இது தொலைபேசி அழைப்பு, SMS, ஆம்புலன்ஸ் அல்லது காவல்துறைக்கு தானாக தகவல் அனுப்பாது.',

    lastUpdatedModalTitle: 'தரவு ஒத்திசைவு & கடைசி புதுப்பிப்பு',
    lastUpdatedModalDesc: 'DrSense சாதனம் மற்றும் இந்த டாஷ்போர்டு இடையேயான நேரடி தகவல் தொடர்பு நிலை.',
    dataAvailability: 'தரவு கிடைக்கும் நிலை',
    dataAvailable: 'உண்மையான வன்பொருள் தரவு பெறப்படுகிறது',
    dataUnavailable: 'வன்பொருள் தரவு எதுவும் பெறப்படவில்லை',

    eventsTitle: 'சமீபத்திய நிகழ்வுகள்',
    eventsEmpty: 'இதுவரை எந்த நிகழ்வுகளும் பதிவாகவில்லை.',
    eventDeviceConnected: 'சாதனம் இணைக்கப்பட்டது',
    eventDeviceConnectedDesc: 'DrSense வன்பொருளுடன் தொடர்பு நிறுவப்பட்டது.',
    eventDeviceDisconnected: 'சாதனம் துண்டிக்கப்பட்டது',
    eventDeviceDisconnectedDesc: 'DrSense வன்பொருளுடனான இணைப்பு துண்டிக்கப்பட்டது.',
    eventReadingStarted: 'சென்சார் அளவீடு தொடங்கியது',
    eventReadingStartedDesc: 'MAX30102 சென்சாரில் விரல் கண்டறியப்பட்டது.',
    eventReadingUnavailable: 'சென்சார் அளவீடு கிடைக்கவில்லை',
    eventReadingUnavailableDesc: 'விரல் எடுக்கப்பட்டது அல்லது சமிக்ஞை தடைபட்டது.',
    eventReadingRestored: 'சென்சார் அளவீடு மீட்டமைக்கப்பட்டது',
    eventReadingRestoredDesc: 'நிலையான சென்சார் அளவீடுகள் மீண்டும் தொடங்கின.',
    eventSosPressed: 'SOS பொத்தான் அழுத்தப்பட்டது',
    eventSosPressedDesc: 'ESP32 இல் உள்ள நேரடி பொத்தான் இயக்கப்பட்டது.',
    eventSosPending: 'SOS உறுதிப்படுத்தல் நிலுவையில் உள்ளது',
    eventSosPendingDesc: 'வன்பொருளிலிருந்து அவசர சமிக்ஞை சரிபார்க்கப்படுகிறது.',
    eventSosActivated: 'SOS செயல்படுத்தப்பட்டது',
    eventSosActivatedDesc: 'சாதனத்திலிருந்து நேரடி அவசர எச்சரிக்கை எழுப்பப்பட்டது.',
    eventSosCancelled: 'SOS ரத்து செய்யப்பட்டது',
    eventSosCancelledDesc: 'அவசர எச்சரிக்கை அழிக்கப்பட்டது.',
    eventStatusChanged: 'அளவீட்டு நிலை மாறியது',
    eventStatusChangedDesc: 'சுகாதார அளவீடுகள் புதிய நிலைக்கு மாறின.',

    aboutTitle: 'DrSense என்றால் என்ன?',
    aboutPoint1: 'DrSense சாதனம் மூலம் இதயத் துடிப்பு மற்றும் SpO₂ அளவைக் கண்காணிக்கிறது.',
    aboutPoint2: 'சென்சார்கள் அளவீடுகளை ESP32 மூலம் உள்ளூர் பயன்பாட்டிற்கு அனுப்புகின்றன.',
    aboutPoint3: 'இந்த அமைப்பு எளிய முன்கூட்டிய எச்சரிக்கை தகவல்களை வழங்குகிறது.',
    aboutPoint4: 'சாதனத்திலுள்ள நேரடி SOS பொத்தான் அவசர சமிக்ஞையை பயன்பாட்டிற்கு அனுப்பும்.',
    aboutPoint5: 'மையப்படுத்தப்பட்ட அமைப்புகள் கிடைக்காத சூழ்நிலைகளிலும் உள்ளூர் கண்காணிப்பு பயனுள்ளதாக இருக்கும்.',

    disclaimerTitle: 'முக்கிய அறிவிப்பு',
    disclaimerLine1: 'DrSense சென்சார் அளவீடுகளின் அடிப்படையில் முன்கூட்டிய விழிப்புணர்வு தகவல்களை மட்டுமே வழங்குகிறது. இது மருத்துவ நோயறிதல் சாதனம் அல்ல.',
    disclaimerLine2: 'சுகாதார முடிவுகளை எடுக்கும்போது எப்போதும் அறிகுறிகளையும் தகுதியான மருத்துவ ஆலோசனைகளையும் கருத்தில் கொள்ளுங்கள்.',
  },
};
