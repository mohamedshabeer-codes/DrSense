import {
  EarlyWarningState,
  ReadingClassification,
  SensorState,
  SosStatus,
} from '../types';

export interface EvaluationResult {
  sensorState: SensorState;
  readingClassification: ReadingClassification;
  earlyWarningState: EarlyWarningState;
}

/**
 * Normalizes raw sensor status strings from various ESP32 firmware variations
 */
export function normalizeSensorStatus(
  rawStatus: string | null | undefined,
  isConnected: boolean,
  heartRate: number | null,
  spo2: number | null
): SensorState {
  if (!isConnected) {
    return 'device_disconnected';
  }

  const s = (rawStatus || '').toLowerCase().trim();

  if (s.includes('no_finger') || s.includes('nofinger') || s.includes('place_finger') || s.includes('finger_removed')) {
    return 'no_finger';
  }
  if (s.includes('measuring') || s.includes('detecting') || s.includes('calculating') || s.includes('checking')) {
    return 'measuring';
  }
  if (s.includes('unable') || s.includes('invalid') || s.includes('unreliable') || s.includes('error')) {
    return 'unable_to_read';
  }
  if (s.includes('monitoring') || s.includes('ready') || s.includes('active') || s.includes('ok')) {
    return 'monitoring';
  }

  // If status is empty but we have valid numbers
  if (heartRate !== null && spo2 !== null && heartRate > 0 && spo2 > 0) {
    return 'monitoring';
  }

  // Default when connected but no reading yet
  return 'measuring';
}

/**
 * Evaluates the reading classification and early-warning insight state
 * based strictly on real incoming values without inventing or faking any values.
 */
export function evaluateHealthReadings(
  isConnected: boolean,
  sensorState: SensorState,
  heartRate: number | null,
  spo2: number | null,
  sosStatus: SosStatus
): EvaluationResult {
  // Disconnected state
  if (!isConnected) {
    return {
      sensorState: 'device_disconnected',
      readingClassification: 'no_data',
      earlyWarningState: 'waiting_for_data',
    };
  }

  // 1. SOS ALWAYS takes absolute highest priority
  const isSosActive =
    sosStatus === 'pressed' ||
    sosStatus === 'pending' ||
    sosStatus === 'confirmed' ||
    sosStatus === 'activated';

  if (isSosActive) {
    return {
      sensorState,
      readingClassification: 'critical',
      earlyWarningState: 'sos',
    };
  }

  // 2. Sensor state handling
  if (sensorState === 'no_finger') {
    return {
      sensorState: 'no_finger',
      readingClassification: 'no_data',
      earlyWarningState: 'no_finger',
    };
  }

  if (sensorState === 'measuring') {
    return {
      sensorState: 'measuring',
      readingClassification: 'no_data',
      earlyWarningState: 'measuring',
    };
  }

  if (sensorState === 'unable_to_read') {
    return {
      sensorState: 'unable_to_read',
      readingClassification: 'no_data',
      earlyWarningState: 'invalid_data',
    };
  }

  // If no readings are available
  if (heartRate === null || spo2 === null) {
    return {
      sensorState,
      readingClassification: 'no_data',
      earlyWarningState: 'waiting_for_data',
    };
  }

  // If values are <= 0 or physiologically erratic for MAX30102 sensor
  if (heartRate <= 25 || heartRate > 240 || spo2 <= 50 || spo2 > 100) {
    return {
      sensorState: 'unable_to_read',
      readingClassification: 'no_data',
      earlyWarningState: 'invalid_data',
    };
  }

  // 3. Rule-based evaluation of real heart rate and SpO2
  // Standard physiological ranges:
  // Normal Heart Rate: 60 - 100 BPM
  // Normal SpO2: 95% - 100%
  // Attention Heart Rate: 50-59 or 101-125 BPM
  // Attention SpO2: 90% - 94%
  // Critical Heart Rate: < 50 or > 125 BPM
  // Critical SpO2: < 90%

  const isHrCritical = heartRate < 45 || heartRate > 135;
  const isSpo2Critical = spo2 < 90;

  const isHrAttention = (heartRate >= 45 && heartRate < 60) || (heartRate > 100 && heartRate <= 135);
  const isSpo2Attention = spo2 >= 90 && spo2 < 95;

  if (isHrCritical || isSpo2Critical) {
    return {
      sensorState: 'monitoring',
      readingClassification: 'critical',
      earlyWarningState: 'attention',
    };
  }

  if (isHrAttention || isSpo2Attention) {
    return {
      sensorState: 'monitoring',
      readingClassification: 'attention',
      earlyWarningState: 'attention',
    };
  }

  return {
    sensorState: 'monitoring',
    readingClassification: 'normal',
    earlyWarningState: 'stable',
  };
}
