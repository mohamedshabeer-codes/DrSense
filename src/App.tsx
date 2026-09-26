import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HealthReadings } from './components/HealthReadings';
import { SensorStatusBanner } from './components/SensorStatusBanner';
import { EarlyWarningCard } from './components/EarlyWarningCard';
import { SosMonitoringCard } from './components/SosMonitoringCard';
import { DeviceStatusCard } from './components/DeviceStatusCard';
import { DeviceConfigurationPanel } from './components/DeviceConfigurationPanel';
import { RecentEventsList } from './components/RecentEventsList';
import { ProjectInfo } from './components/ProjectInfo';
import { Disclaimer } from './components/Disclaimer';
import { DetailModal, ModalType } from './components/DetailModal';
import { AIInsightCard } from './components/AIInsightCard';
import { geminiService } from './services/geminiService';

import {
  AppEvent,
  ConnectionStatus,
  DevicePayload,
  EarlyWarningState,
  Language,
  ReadingClassification,
  SensorState,
  SosStatus,
  AIInsight,
  AIAvailabilityStatus,
  AIAnalysisRequest,
} from './types';
import { translations } from './localization/translations';
import {
  evaluateHealthReadings,
  normalizeSensorStatus,
} from './logic/earlyWarningLogic';
import { Esp32Service, parseSosStatus, PollResult } from './services/esp32Service';

const DEFAULT_DEVICE_ADDRESS = 'http://ESP32_IP_ADDRESS/data';

export default function App() {
  // Language State
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Device & Hardware State (Strictly initialized to disconnected/empty per requirements)
  const [deviceAddress, setDeviceAddress] = useState<string>(DEFAULT_DEVICE_ADDRESS);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [sensorState, setSensorState] = useState<SensorState>('device_disconnected');
  const [sosStatus, setSosStatus] = useState<SosStatus>('normal');
  const [readingClassification, setReadingClassification] = useState<ReadingClassification>('no_data');
  const [earlyWarningState, setEarlyWarningState] = useState<EarlyWarningState>('waiting_for_data');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [lastError, setLastError] = useState<string>('');

  // AI-Assisted Early-Warning Insights State
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [aiStatus, setAiStatus] = useState<AIAvailabilityStatus>('no_data');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Interactive UI Modal States
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [activeDetailModal, setActiveDetailModal] = useState<ModalType>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // ESP32 Service Ref
  const serviceRef = useRef<Esp32Service | null>(null);

  // Event Helper (Prevents duplicate event flooding)
  const lastStateRef = useRef<{
    connectionStatus: ConnectionStatus;
    sensorState: SensorState;
    sosStatus: SosStatus;
    classification: ReadingClassification;
  }>({
    connectionStatus: 'disconnected',
    sensorState: 'device_disconnected',
    sosStatus: 'normal',
    classification: 'no_data',
  });

  const recordEvent = useCallback(
    (
      type: string,
      titleKey: string,
      descriptionKey: string,
      status: 'info' | 'warning' | 'emergency' | 'success',
      detail?: string
    ) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newEvt: AppEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        titleKey,
        descriptionKey,
        timestamp: timeStr,
        status,
        detail,
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 49)]);
    },
    []
  );

  // Handle genuine incoming hardware payload
  const handleHardwareData = useCallback(
    (payload: DevicePayload) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // 1. Parse numeric Heart Rate & SpO2
      let hrVal: number | null = null;
      if (typeof payload.heartRate === 'number' && !isNaN(payload.heartRate)) {
        hrVal = Math.round(payload.heartRate);
      } else if (typeof payload.heartRate === 'string') {
        const parsed = parseFloat(payload.heartRate);
        if (!isNaN(parsed)) hrVal = Math.round(parsed);
      }

      let spo2Val: number | null = null;
      if (typeof payload.spo2 === 'number' && !isNaN(payload.spo2)) {
        spo2Val = Math.round(payload.spo2);
      } else if (typeof payload.spo2 === 'string') {
        const parsed = parseFloat(payload.spo2);
        if (!isNaN(parsed)) spo2Val = Math.round(parsed);
      }

      // 2. Parse sensor status
      const parsedSensorState = normalizeSensorStatus(
        payload.sensorStatus,
        true,
        hrVal,
        spo2Val
      );

      // 3. Parse SOS status from physical ESP32 push button
      const parsedSos = parseSosStatus(payload.sos, true);

      // 4. Deterministic Rule-Based Early Warning Evaluation
      const evaluation = evaluateHealthReadings(
        true,
        parsedSensorState,
        hrVal,
        spo2Val,
        parsedSos
      );

      // 5. Update state with real values
      setHeartRate(hrVal);
      setSpo2(spo2Val);
      setSensorState(parsedSensorState);
      setSosStatus(parsedSos);
      setReadingClassification(evaluation.readingClassification);
      setEarlyWarningState(evaluation.earlyWarningState);
      setLastUpdated(payload.timestamp ? String(payload.timestamp) : timeStr);

      // 6. Record genuine transitions to events
      const prev = lastStateRef.current;

      // SOS transition
      if (parsedSos !== prev.sosStatus) {
        if (parsedSos === 'activated' || parsedSos === 'confirmed') {
          recordEvent(
            'SOS_ACTIVATED',
            'eventSosActivated',
            'eventSosActivatedDesc',
            'emergency'
          );
        } else if (parsedSos === 'pressed') {
          recordEvent(
            'SOS_PRESSED',
            'eventSosPressed',
            'eventSosPressedDesc',
            'warning'
          );
        } else if (parsedSos === 'pending') {
          recordEvent(
            'SOS_PENDING',
            'eventSosPending',
            'eventSosPendingDesc',
            'warning'
          );
        } else if (prev.sosStatus === 'activated' && parsedSos === 'normal') {
          recordEvent(
            'SOS_CANCELLED',
            'eventSosCancelled',
            'eventSosCancelledDesc',
            'info'
          );
        }
      }

      // Sensor state transition
      if (parsedSensorState !== prev.sensorState) {
        if (parsedSensorState === 'monitoring') {
          recordEvent(
            'READING_STARTED',
            'eventReadingStarted',
            'eventReadingStartedDesc',
            'success'
          );
        } else if (parsedSensorState === 'no_finger' || parsedSensorState === 'unable_to_read') {
          recordEvent(
            'READING_UNAVAILABLE',
            'eventReadingUnavailable',
            'eventReadingUnavailableDesc',
            'warning'
          );
        }
      }

      // Reading Classification transition
      if (
        evaluation.readingClassification !== prev.classification &&
        evaluation.readingClassification !== 'no_data'
      ) {
        recordEvent(
          'STATUS_CHANGED',
          'eventStatusChanged',
          'eventStatusChangedDesc',
          evaluation.readingClassification === 'critical'
            ? 'emergency'
            : evaluation.readingClassification === 'attention'
            ? 'warning'
            : 'success',
          evaluation.readingClassification.toUpperCase()
        );
      }

      lastStateRef.current = {
        connectionStatus: 'connected',
        sensorState: parsedSensorState,
        sosStatus: parsedSos,
        classification: evaluation.readingClassification,
      };
    },
    [recordEvent]
  );

  // Handle status transitions
  const handleStatusChange = useCallback(
    (status: ConnectionStatus, errorMsg?: string) => {
      setConnectionStatus(status);
      if (errorMsg) {
        setLastError(errorMsg);
      } else if (status === 'connected') {
        setLastError('');
      }

      const prev = lastStateRef.current;

      if (status === 'connected' && prev.connectionStatus !== 'connected') {
        recordEvent(
          'DEVICE_CONNECTED',
          'eventDeviceConnected',
          'eventDeviceConnectedDesc',
          'success'
        );
      } else if (status === 'disconnected' && prev.connectionStatus === 'connected') {
        recordEvent(
          'DEVICE_DISCONNECTED',
          'eventDeviceDisconnected',
          'eventDeviceDisconnectedDesc',
          'warning'
        );

        // Reset readings on genuine disconnection
        setHeartRate(null);
        setSpo2(null);
        setSensorState('device_disconnected');
        setSosStatus('normal');
        setReadingClassification('no_data');
        setEarlyWarningState('waiting_for_data');
        setAiInsight(null);
        setAiStatus('no_data');
        setAiError(null);
        geminiService.resetCache();
      }

      lastStateRef.current.connectionStatus = status;
    },
    [recordEvent]
  );

  // Trigger AI-Assisted Early-Warning Analysis
  const handleAnalyzeReading = useCallback(
    async (force: boolean = false) => {
      if (connectionStatus !== 'connected') {
        setAiError(t.aiDisconnectedNotice);
        setAiStatus('unavailable');
        return;
      }

      if (sensorState === 'no_finger') {
        setAiError(t.aiNoFingerNotice);
        setAiStatus('unavailable');
        return;
      }

      if (sensorState === 'measuring') {
        setAiError(t.aiMeasuringNotice);
        setAiStatus('unavailable');
        return;
      }

      if (heartRate === null || spo2 === null) {
        setAiError(t.aiNoDataNotice);
        setAiStatus('unavailable');
        return;
      }

      setIsAnalyzing(true);
      setAiStatus('analyzing');
      setAiError(null);

      const request: AIAnalysisRequest = {
        heartRate,
        spo2,
        sensorStatus: sensorState,
        readingStatus: readingClassification,
        sos: sosStatus,
        deviceConnected: connectionStatus === 'connected',
        timestamp: lastUpdated,
        language: lang,
      };

      const result = await geminiService.analyzeReading(request, force);

      if (result.success && result.insight) {
        setAiInsight(result.insight);
        setAiStatus('available');
        setAiError(null);
        recordEvent(
          'AI_INSIGHT_UPDATED',
          'aiInsightsTitle',
          'aiLastAnalyzed',
          result.insight.status.toLowerCase().includes('critical') ||
            result.insight.status.toLowerCase().includes('அபாய')
            ? 'emergency'
            : result.insight.status.toLowerCase().includes('attention') ||
              result.insight.status.toLowerCase().includes('கவனம்')
            ? 'warning'
            : 'info',
          result.insight.status
        );
      } else {
        setAiError(result.error || t.aiOfflineNotice);
        setAiStatus('unavailable');
      }

      setIsAnalyzing(false);
    },
    [
      connectionStatus,
      sensorState,
      heartRate,
      spo2,
      readingClassification,
      sosStatus,
      lastUpdated,
      lang,
      t,
      recordEvent,
    ]
  );

  // Automated background AI awareness evaluation on significant reading updates
  useEffect(() => {
    if (
      connectionStatus === 'connected' &&
      sensorState === 'monitoring' &&
      heartRate !== null &&
      spo2 !== null
    ) {
      // Analyze with force=false to respect cooldown and unchanged data hashing
      handleAnalyzeReading(false);
    }
  }, [connectionStatus, sensorState, heartRate, spo2, readingClassification, handleAnalyzeReading]);

  // Initialize service on mount
  useEffect(() => {
    const service = new Esp32Service(deviceAddress, 1000);
    service.setCallbacks({
      onData: handleHardwareData,
      onStatusChange: handleStatusChange,
    });
    serviceRef.current = service;
    service.start();

    return () => {
      service.stop();
    };
  }, [deviceAddress, handleHardwareData, handleStatusChange]);

  // Reconnect action returning result
  const handleReconnect = async (): Promise<PollResult> => {
    if (serviceRef.current) {
      return await serviceRef.current.restart();
    }
    return { success: false, message: 'Service not initialized' };
  };

  // Save new device address and immediately test connection
  const handleSaveAddress = async (newAddr: string): Promise<PollResult> => {
    setDeviceAddress(newAddr);
    if (serviceRef.current) {
      serviceRef.current.setTargetUrl(newAddr);
      return await serviceRef.current.restart();
    }
    return { success: false, message: 'Service not initialized' };
  };

  // Reset to default placeholder address
  const handleResetAddress = () => {
    setDeviceAddress(DEFAULT_DEVICE_ADDRESS);
    if (serviceRef.current) {
      serviceRef.current.resetTargetUrl();
    }
    setHeartRate(null);
    setSpo2(null);
    setSensorState('device_disconnected');
    setSosStatus('normal');
    setReadingClassification('no_data');
    setEarlyWarningState('waiting_for_data');
    setAiInsight(null);
    setAiStatus('no_data');
    setAiError(null);
    geminiService.resetCache();
  };

  // Refresh data now
  const handleRefreshData = async () => {
    if (!serviceRef.current) return;
    setIsRefreshing(true);
    try {
      await serviceRef.current.pollOnce();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Clear events history
  const handleClearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        t={t}
        currentLang={lang}
        onLanguageChange={setLang}
        connectionStatus={connectionStatus}
        onToggleConfig={() => setIsConfigOpen(true)}
        isConfigOpen={isConfigOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Sensor Status Guidance Banner (Clickable) */}
        <SensorStatusBanner
          t={t}
          sensorState={sensorState}
          onOpenSensorDetails={() => setActiveDetailModal('sensor_status')}
        />

        {/* Primary Health Readings: Heart Rate & SpO2 (Both Clickable) */}
        <HealthReadings
          t={t}
          heartRate={heartRate}
          spo2={spo2}
          readingClassification={readingClassification}
          isConnected={connectionStatus === 'connected'}
          onOpenHeartRate={() => setActiveDetailModal('heart_rate')}
          onOpenSpo2={() => setActiveDetailModal('spo2')}
          onOpenReadingStatus={() => setActiveDetailModal('reading_status')}
        />

        {/* Prominent Rule-Based Early-Warning Insights (Clickable) */}
        <EarlyWarningCard
          t={t}
          earlyWarningState={earlyWarningState}
          onOpenEarlyWarningDetails={() => setActiveDetailModal('early_warning')}
        />

        {/* AI-Assisted Early-Warning Insights (Gemini AI Live Sensor Interpretation) */}
        <AIInsightCard
          t={t}
          aiInsight={aiInsight}
          aiStatus={aiStatus}
          aiError={aiError}
          isConnected={connectionStatus === 'connected'}
          sensorState={sensorState}
          heartRate={heartRate}
          spo2={spo2}
          sosStatus={sosStatus}
          earlyWarningState={earlyWarningState}
          onAnalyzeReading={() => handleAnalyzeReading(true)}
          onOpenAIDetails={() => setActiveDetailModal('ai_insight')}
          isAnalyzing={isAnalyzing}
          canAnalyze={
            connectionStatus === 'connected' &&
            heartRate !== null &&
            spo2 !== null &&
            sensorState !== 'no_finger' &&
            sensorState !== 'measuring' &&
            sensorState !== 'device_disconnected'
          }
        />

        {/* Hardware SOS Monitoring Section (Clickable) */}
        <SosMonitoringCard
          t={t}
          sosStatus={sosStatus}
          isConnected={connectionStatus === 'connected'}
          onOpenSosDetails={() => setActiveDetailModal('sos')}
        />

        {/* Device Status & Connection Diagnostics (Interactive) */}
        <DeviceStatusCard
          t={t}
          connectionStatus={connectionStatus}
          sensorState={sensorState}
          lastUpdated={lastUpdated}
          onReconnect={handleReconnect}
          onOpenDeviceSetup={() => setIsConfigOpen(true)}
          onOpenLastUpdated={() => setActiveDetailModal('last_updated')}
        />

        {/* Recent Events (Clickable) */}
        <RecentEventsList
          t={t}
          events={events}
          onOpenEventsHistory={() => setActiveDetailModal('recent_events')}
        />

        {/* Project Information */}
        <ProjectInfo t={t} />

        {/* Medical Notice & Disclaimer */}
        <Disclaimer t={t} />

      </main>

      {/* Device Setup Modal / Side Panel */}
      {isConfigOpen && (
        <DeviceConfigurationPanel
          t={t}
          currentAddress={deviceAddress}
          connectionStatus={connectionStatus}
          lastUpdated={lastUpdated}
          lastError={lastError}
          onSaveAddress={handleSaveAddress}
          onReconnect={handleReconnect}
          onResetAddress={handleResetAddress}
          onClose={() => setIsConfigOpen(false)}
        />
      )}

      {/* Unified Interactive Details Modal */}
      {activeDetailModal && (
        <DetailModal
          modalType={activeDetailModal}
          t={t}
          onClose={() => setActiveDetailModal(null)}
          isConnected={connectionStatus === 'connected'}
          connectionStatus={connectionStatus}
          heartRate={heartRate}
          spo2={spo2}
          sensorState={sensorState}
          readingClassification={readingClassification}
          earlyWarningState={earlyWarningState}
          sosStatus={sosStatus}
          lastUpdated={lastUpdated}
          events={events}
          deviceAddress={deviceAddress}
          aiInsight={aiInsight}
          aiStatus={aiStatus}
          isAnalyzing={isAnalyzing}
          onAnalyzeReading={() => handleAnalyzeReading(true)}
          onRefreshData={handleRefreshData}
          onClearEvents={handleClearEvents}
          onOpenDeviceSetup={() => {
            setActiveDetailModal(null);
            setIsConfigOpen(true);
          }}
          isRefreshing={isRefreshing}
        />
      )}
    </div>
  );
}
