export type Language = 'en' | 'ta';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export type SensorState =
  | 'no_finger'
  | 'measuring'
  | 'monitoring'
  | 'unable_to_read'
  | 'device_disconnected';

export type ReadingClassification = 'normal' | 'attention' | 'critical' | 'no_data';

export type EarlyWarningState =
  | 'waiting_for_data'
  | 'no_finger'
  | 'measuring'
  | 'stable'
  | 'attention'
  | 'sos'
  | 'invalid_data';

export type SosStatus =
  | 'normal'
  | 'standby'
  | 'pressed'
  | 'pending'
  | 'confirmed'
  | 'activated'
  | 'cancelled'
  | 'disconnected';

export interface DevicePayload {
  heartRate?: number | string | null;
  spo2?: number | string | null;
  sos?: boolean | string | number | null;
  sensorStatus?: string | null;
  deviceConnected?: boolean | null;
  timestamp?: string | null;
}

export interface AppEvent {
  id: string;
  type: string;
  titleKey: string;
  descriptionKey: string;
  timestamp: string;
  status: 'info' | 'warning' | 'emergency' | 'success';
  detail?: string;
}

export interface HardwareState {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  heartRate: number | null;
  spo2: number | null;
  sensorState: SensorState;
  sosStatus: SosStatus;
  readingClassification: ReadingClassification;
  earlyWarningState: EarlyWarningState;
  lastUpdated: string | null;
  deviceAddress: string;
  events: AppEvent[];
}

export type AIAvailabilityStatus =
  | 'available'
  | 'analyzing'
  | 'unavailable'
  | 'no_data'
  | 'cooldown';

export interface AIInsight {
  status: string;
  observation: string;
  reason: string;
  recommendation: string;
  confidenceNote?: string;
  timestamp: string;
}

export interface AIAnalysisRequest {
  heartRate: number | null;
  spo2: number | null;
  sensorStatus: string;
  readingStatus: string;
  sos: string;
  deviceConnected: boolean;
  timestamp: string | null;
  language?: Language;
}
