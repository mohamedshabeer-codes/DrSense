import React, { useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Wind,
  Fingerprint,
  Sparkles,
  BellRing,
  ShieldCheck,
  Clock,
  History,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  AppEvent,
  ConnectionStatus,
  EarlyWarningState,
  ReadingClassification,
  SensorState,
  SosStatus,
} from '../types';
import { Translations } from '../localization/translations';

export type ModalType =
  | 'heart_rate'
  | 'spo2'
  | 'sensor_status'
  | 'reading_status'
  | 'early_warning'
  | 'ai_insight'
  | 'sos'
  | 'recent_events'
  | 'last_updated'
  | null;

interface DetailModalProps {
  modalType: ModalType;
  t: Translations;
  onClose: () => void;

  // Real hardware states
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  heartRate: number | null;
  spo2: number | null;
  sensorState: SensorState;
  readingClassification: ReadingClassification;
  earlyWarningState: EarlyWarningState;
  sosStatus: SosStatus;
  lastUpdated: string | null;
  events: AppEvent[];
  deviceAddress: string;

  // AI Insights
  aiInsight?: import('../types').AIInsight | null;
  aiStatus?: import('../types').AIAvailabilityStatus;
  isAnalyzing?: boolean;
  onAnalyzeReading?: () => void;

  // Actions
  onRefreshData?: () => void;
  onClearEvents?: () => void;
  onOpenDeviceSetup?: () => void;
  isRefreshing?: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  modalType,
  t,
  onClose,
  isConnected,
  connectionStatus,
  heartRate,
  spo2,
  sensorState,
  readingClassification,
  earlyWarningState,
  sosStatus,
  lastUpdated,
  events,
  deviceAddress,
  aiInsight,
  aiStatus,
  isAnalyzing,
  onAnalyzeReading,
  onRefreshData,
  onClearEvents,
  onOpenDeviceSetup,
  isRefreshing = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!modalType) return null;

  // Backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const displayHr = isConnected && heartRate !== null ? `${heartRate} BPM` : `-- BPM`;
  const displaySpo2 = isConnected && spo2 !== null ? `${spo2} %` : `-- %`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            {modalType === 'heart_rate' && (
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <Heart className="w-5 h-5" />
              </div>
            )}
            {modalType === 'spo2' && (
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
                <Wind className="w-5 h-5" />
              </div>
            )}
            {modalType === 'sensor_status' && (
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Fingerprint className="w-5 h-5" />
              </div>
            )}
            {modalType === 'reading_status' && (
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Activity className="w-5 h-5" />
              </div>
            )}
            {modalType === 'early_warning' && (
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            {modalType === 'ai_insight' && (
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            {modalType === 'sos' && (
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
                <BellRing className="w-5 h-5" />
              </div>
            )}
            {modalType === 'recent_events' && (
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <History className="w-5 h-5" />
              </div>
            )}
            {modalType === 'last_updated' && (
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
                <Clock className="w-5 h-5" />
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {modalType === 'heart_rate' && t.hrModalTitle}
                {modalType === 'spo2' && t.spo2ModalTitle}
                {modalType === 'sensor_status' && t.sensorModalTitle}
                {modalType === 'reading_status' && t.readingStatusModalTitle}
                {modalType === 'early_warning' && t.earlyWarningModalTitle}
                {modalType === 'ai_insight' && t.aiInsightsTitle}
                {modalType === 'sos' && t.sosModalTitle}
                {modalType === 'recent_events' && t.eventsTitle}
                {modalType === 'last_updated' && t.lastUpdatedModalTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">DrSense Hardware Interface</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700">
          
          {/* HEART RATE MODAL CONTENT */}
          {modalType === 'heart_rate' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">{t.heartRate}</span>
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums">{displayHr}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">{t.readingStatus}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800">
                    {isConnected ? t[`status${readingClassification === 'no_data' ? 'NoData' : readingClassification.charAt(0).toUpperCase() + readingClassification.slice(1)}` as keyof Translations] : t.statusNoData}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.hrModalDesc}
              </p>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">{t.hrGuideTitle}</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{t.hrGuideNormal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{t.hrGuideAttention}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{t.hrGuideCritical}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>{t.lastUpdated}:</span>
                <span className="font-mono font-semibold">{lastUpdated || t.neverUpdated}</span>
              </div>
            </div>
          )}

          {/* SPO2 MODAL CONTENT */}
          {modalType === 'spo2' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">{t.spo2}</span>
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums">{displaySpo2}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">{t.readingStatus}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800">
                    {isConnected ? t[`status${readingClassification === 'no_data' ? 'NoData' : readingClassification.charAt(0).toUpperCase() + readingClassification.slice(1)}` as keyof Translations] : t.statusNoData}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.spo2ModalDesc}
              </p>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">{t.spo2GuideTitle}</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{t.spo2GuideNormal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{t.spo2GuideAttention}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{t.spo2GuideCritical}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>{t.lastUpdated}:</span>
                <span className="font-mono font-semibold">{lastUpdated || t.neverUpdated}</span>
              </div>
            </div>
          )}

          {/* SENSOR STATUS MODAL CONTENT */}
          {modalType === 'sensor_status' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.sensorLabel}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">MAX30102</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  <span className="text-base font-bold text-slate-900">
                    {sensorState === 'no_finger' && t.sensorPlaceFinger}
                    {sensorState === 'measuring' && t.sensorMeasuring}
                    {sensorState === 'monitoring' && t.sensorMonitoring}
                    {sensorState === 'unable_to_read' && t.sensorUnavailable}
                    {sensorState === 'device_disconnected' && t.sensorDeviceDisconnected}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.sensorModalDesc}
              </p>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">Placement Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>{t.sensorStep1}</li>
                  <li>{t.sensorStep2}</li>
                  <li>{t.sensorStep3}</li>
                </ol>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">{t.connectionStatusLabel}:</span>
                <span className="font-semibold text-slate-800">
                  {isConnected ? t.deviceConnected : t.deviceNotConnected}
                </span>
              </div>
            </div>
          )}

          {/* READING STATUS MODAL CONTENT */}
          {modalType === 'reading_status' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.readingStatus}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      readingClassification === 'normal'
                        ? 'bg-emerald-500'
                        : readingClassification === 'attention'
                        ? 'bg-amber-500'
                        : readingClassification === 'critical'
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-lg font-bold text-slate-900">
                    {isConnected ? t[`status${readingClassification === 'no_data' ? 'NoData' : readingClassification.charAt(0).toUpperCase() + readingClassification.slice(1)}` as keyof Translations] : t.statusNoData}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.readingStatusModalDesc}
              </p>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.disclaimerTitle}</span>
                </div>
                <p className="leading-relaxed font-medium">
                  {t.readingStatusNonDiagnosticNote}
                </p>
              </div>
            </div>
          )}

          {/* EARLY WARNING INSIGHTS MODAL CONTENT */}
          {modalType === 'early_warning' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.insightsTitle}</span>
                <div className="text-base font-bold text-slate-900 leading-snug">
                  {earlyWarningState === 'sos' && t.insightSosAlert}
                  {earlyWarningState === 'attention' && t.statusAttention}
                  {earlyWarningState === 'stable' && t.statusNormal}
                  {earlyWarningState === 'measuring' && t.sensorMeasuring}
                  {earlyWarningState === 'no_finger' && t.sensorPlaceFinger}
                  {earlyWarningState === 'invalid_data' && t.sensorUnavailable}
                  {earlyWarningState === 'waiting_for_data' && t.statusNoData}
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {earlyWarningState === 'sos' && t.insightSosCheckUser}
                  {earlyWarningState === 'attention' && t.insightAttention}
                  {earlyWarningState === 'stable' && t.insightStable}
                  {earlyWarningState === 'measuring' && t.insightMeasuring}
                  {earlyWarningState === 'no_finger' && t.insightNoFinger}
                  {earlyWarningState === 'invalid_data' && t.insightInvalidData}
                  {earlyWarningState === 'waiting_for_data' && t.insightWaitingData}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">Rule Logic Architecture:</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {t.earlyWarningRuleSummary}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Rule Priority:</span>
                <span className="font-bold text-rose-700">SOS &gt; Critical &gt; Attention &gt; Stable</span>
              </div>
            </div>
          )}

          {/* AI-ASSISTED INSIGHT MODAL CONTENT */}
          {modalType === 'ai_insight' && (
            <div className="space-y-4">
              <div className="bg-linear-to-br from-cyan-50/70 to-blue-50/70 p-4 rounded-xl border border-cyan-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-900 uppercase">
                    {t.aiInsightsTitle}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {aiInsight ? `${t.aiLastAnalyzed}: ${aiInsight.timestamp}` : t.neverUpdated}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {aiInsight ? aiInsight.status : t.aiStatusUnavailable}
                </div>
                {aiInsight && (
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {aiInsight.observation}
                  </p>
                )}
              </div>

              {aiInsight ? (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-600 uppercase block">{t.aiReasonLabel}</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{aiInsight.reason}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-600 uppercase block">{t.aiRecommendationLabel}</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{aiInsight.recommendation}</p>
                  </div>
                  {aiInsight.confidenceNote && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <strong>{t.aiConfidenceLabel}: </strong>{aiInsight.confidenceNote}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  {isConnected
                    ? t.aiNoDataNotice
                    : t.aiDisconnectedNotice}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                {t.aiMedicalDisclaimer}
              </div>
            </div>
          )}

          {/* SOS MODAL CONTENT */}
          {modalType === 'sos' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  sosStatus === 'activated' || sosStatus === 'confirmed'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">{t.sosTitle}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-inherit">
                    ESP32 DevKit V1
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {sosStatus === 'activated' && t.sosActivatedTitle}
                  {sosStatus === 'confirmed' && t.sosConfirmedTitle}
                  {sosStatus === 'pending' && t.sosPendingTitle}
                  {sosStatus === 'pressed' && t.sosPressedTitle}
                  {sosStatus === 'standby' && t.sosStandbyTitle}
                  {sosStatus === 'cancelled' && t.sosCancelledTitle}
                  {sosStatus === 'disconnected' && t.sosDisconnectedTitle}
                  {sosStatus === 'normal' && t.sosNormalTitle}
                </div>
                <p className="text-xs font-medium opacity-90">
                  {sosStatus === 'activated' && t.sosActivatedDesc}
                  {sosStatus === 'confirmed' && t.sosConfirmedDesc}
                  {sosStatus === 'pending' && t.sosPendingDesc}
                  {sosStatus === 'pressed' && t.sosPressedDesc}
                  {sosStatus === 'standby' && t.sosStandbyDesc}
                  {sosStatus === 'cancelled' && t.sosCancelledDesc}
                  {sosStatus === 'disconnected' && t.sosDisconnectedDesc}
                  {sosStatus === 'normal' && t.sosNormalDesc}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.sosModalDesc}
              </p>

              <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Info className="w-4 h-4 text-slate-600" />
                  <span>Hardware Scope:</span>
                </div>
                <p className="leading-relaxed font-medium">
                  {t.sosHardwareOnlyNotice}
                </p>
              </div>
            </div>
          )}

          {/* RECENT EVENTS MODAL CONTENT */}
          {modalType === 'recent_events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </span>

                {events.length > 0 && onClearEvents && (
                  <button
                    type="button"
                    onClick={onClearEvents}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearEventsHistory}</span>
                  </button>
                )}
              </div>

              {events.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500 font-medium">
                  {t.eventsEmpty}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{evt.type}</div>
                        <div className="text-slate-600 mt-0.5">{evt.detail || evt.descriptionKey}</div>
                      </div>
                      <span className="font-mono text-slate-500 shrink-0">{evt.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LAST UPDATED MODAL CONTENT */}
          {modalType === 'last_updated' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.lastUpdated}</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">
                  {lastUpdated || t.neverUpdated}
                </div>
                <div className="text-xs text-slate-600">
                  {isConnected ? t.dataAvailable : t.dataUnavailable}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t.connectionStatusLabel}:</span>
                  <span className="font-bold text-slate-800">
                    {isConnected ? t.deviceConnected : t.deviceNotConnected}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t.activeTarget}:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[200px]">
                    {deviceAddress}
                  </span>
                </div>
              </div>

              {onRefreshData && (
                <button
                  type="button"
                  onClick={onRefreshData}
                  disabled={isRefreshing}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{t.refreshNow}</span>
                </button>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {onOpenDeviceSetup && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDeviceSetup();
              }}
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 cursor-pointer"
            >
              {t.configTitle}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
