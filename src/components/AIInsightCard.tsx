import React from 'react';
import {
  Sparkles,
  Bot,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  WifiOff,
  Activity,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { AIInsight, AIAvailabilityStatus, SensorState, EarlyWarningState, SosStatus } from '../types';
import { Translations } from '../localization/translations';

interface AIInsightCardProps {
  t: Translations;
  aiInsight: AIInsight | null;
  aiStatus: AIAvailabilityStatus;
  aiError: string | null;
  isConnected: boolean;
  sensorState: SensorState;
  heartRate: number | null;
  spo2: number | null;
  sosStatus: SosStatus;
  earlyWarningState: EarlyWarningState;
  onAnalyzeReading: () => void;
  onOpenAIDetails?: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  t,
  aiInsight,
  aiStatus,
  aiError,
  isConnected,
  sensorState,
  heartRate,
  spo2,
  sosStatus,
  earlyWarningState,
  onAnalyzeReading,
  onOpenAIDetails,
  isAnalyzing,
  canAnalyze,
}) => {
  const isSosActive =
    sosStatus === 'pressed' ||
    sosStatus === 'pending' ||
    sosStatus === 'confirmed' ||
    sosStatus === 'activated';

  // Determine current contextual guidance message
  const getContextualNotice = (): { text: string; icon: React.ReactNode; tone: string } => {
    if (!isConnected) {
      return {
        text: t.aiDisconnectedNotice,
        icon: <WifiOff className="w-5 h-5 text-slate-500" />,
        tone: 'bg-slate-50 border-slate-200 text-slate-700',
      };
    }

    if (sensorState === 'no_finger') {
      return {
        text: t.aiNoFingerNotice,
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        tone: 'bg-amber-50/70 border-amber-200 text-amber-900',
      };
    }

    if (sensorState === 'measuring') {
      return {
        text: t.aiMeasuringNotice,
        icon: <Activity className="w-5 h-5 text-sky-600 animate-pulse" />,
        tone: 'bg-sky-50/70 border-sky-200 text-sky-900',
      };
    }

    if (heartRate === null || spo2 === null) {
      return {
        text: t.aiNoDataNotice,
        icon: <HelpCircle className="w-5 h-5 text-slate-500" />,
        tone: 'bg-slate-50 border-slate-200 text-slate-700',
      };
    }

    if (aiError) {
      return {
        text: aiError,
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        tone: 'bg-amber-50/80 border-amber-300 text-amber-950',
      };
    }

    return {
      text: t.aiNoDataNotice,
      icon: <HelpCircle className="w-5 h-5 text-slate-500" />,
      tone: 'bg-slate-50 border-slate-200 text-slate-700',
    };
  };

  const notice = getContextualNotice();

  // Status badge styling based on AI insight status or SOS
  const getInsightStatusTheme = () => {
    if (isSosActive) {
      return {
        border: 'border-rose-400 bg-rose-50/80',
        badge: 'bg-rose-600 text-white animate-pulse',
        icon: <AlertOctagon className="w-5 h-5 text-rose-600 animate-bounce" />,
      };
    }

    if (!aiInsight) {
      return {
        border: 'border-slate-200 bg-white',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: <Bot className="w-5 h-5 text-slate-600" />,
      };
    }

    const lowerStatus = aiInsight.status.toLowerCase();
    if (lowerStatus.includes('critical') || lowerStatus.includes('அபாய')) {
      return {
        border: 'border-rose-300 bg-rose-50/70',
        badge: 'bg-rose-600 text-white',
        icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      };
    }

    if (lowerStatus.includes('attention') || lowerStatus.includes('கவனம்')) {
      return {
        border: 'border-amber-300 bg-amber-50/70',
        badge: 'bg-amber-100 text-amber-900 border border-amber-300',
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      };
    }

    return {
      border: 'border-emerald-300 bg-emerald-50/60',
      badge: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    };
  };

  const theme = getInsightStatusTheme();

  return (
    <section
      id="ai-early-warning-section"
      aria-label="AI-Assisted Early-Warning Insights"
      className="w-full"
    >
      <div
        className={`rounded-2xl border-2 p-5 sm:p-6 shadow-xs transition-all duration-200 relative overflow-hidden bg-white ${theme.border}`}
      >
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-cyan-600 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Bot className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  {t.aiInsightsTitle}
                </h2>
                
                {/* AI Status Indicator */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border">
                  {isAnalyzing ? (
                    <span className="flex items-center gap-1.5 text-sky-800 bg-sky-50 border-sky-200">
                      <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
                      {t.aiStatusAnalyzing}
                    </span>
                  ) : aiStatus === 'available' ? (
                    <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {t.aiStatusAvailable}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      {t.aiStatusUnavailable}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t.aiPoweredBy}
              </p>
            </div>
          </div>

          {/* Action Button: Analyze / Refresh */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              id="ai-analyze-reading-btn"
              type="button"
              onClick={onAnalyzeReading}
              disabled={isAnalyzing || !canAnalyze}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 active:scale-98 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              title={canAnalyze ? t.aiAnalyzeButton : notice.text}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{aiInsight ? t.aiRefreshButton : t.aiAnalyzeButton}</span>
            </button>
          </div>

        </div>

        {/* Content Body */}
        <div className="mt-5">
          {aiInsight && !isAnalyzing ? (
            /* Structured AI-Assisted Insight Display */
            <div className="space-y-4">
              
              {/* Status Header Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-white shadow-2xs border border-inherit">
                    {theme.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t.aiStatusLabel}:
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${theme.badge}`}
                    >
                      {aiInsight.status}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-500">
                  <span>{t.aiLastAnalyzed}: </span>
                  <span className="font-mono font-bold text-slate-700">{aiInsight.timestamp}</span>
                </div>
              </div>

              {/* Observation Block */}
              <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  {t.aiObservationLabel}
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {aiInsight.observation}
                </p>
              </div>

              {/* Reason & Recommendation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Reason */}
                <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    {t.aiReasonLabel}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {aiInsight.reason}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="bg-white/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    {t.aiRecommendationLabel}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {aiInsight.recommendation}
                  </p>
                </div>

              </div>

              {/* Qualitative Optical Signal Assessment (Grounded only, no fake percentages) */}
              {aiInsight.confidenceNote && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    <strong className="font-semibold text-slate-700">{t.aiConfidenceLabel}: </strong>
                    {aiInsight.confidenceNote}
                  </span>
                </div>
              )}

              {/* Grounded Evidence Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <span className="font-semibold text-slate-600">
                  {t.aiNoFakeDataNote}
                </span>
                <div className="flex items-center gap-3 font-mono">
                  <span>HR: <strong className="text-slate-800">{heartRate !== null ? `${heartRate} BPM` : '--'}</strong></span>
                  <span>SpO₂: <strong className="text-slate-800">{spo2 !== null ? `${spo2}%` : '--'}</strong></span>
                  <span>SOS: <strong className="text-slate-800 uppercase">{sosStatus}</strong></span>
                </div>
              </div>

            </div>
          ) : isAnalyzing ? (
            /* Analyzing Live State */
            <div className="py-8 px-4 text-center space-y-3 bg-sky-50/50 rounded-xl border border-sky-100">
              <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-sky-950">
                  {t.aiStatusAnalyzing}
                </h4>
                <p className="text-xs text-sky-800 max-w-md mx-auto">
                  Interpreting current optical photoplethysmography readings ({heartRate} BPM, {spo2}% SpO₂) with AI-assisted analysis.
                </p>
              </div>
            </div>
          ) : (
            /* Contextual Guidance / Fallback State */
            <div className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 ${notice.tone}`}>
              <div className="p-2 rounded-lg bg-white shadow-2xs border border-inherit shrink-0 mt-0.5">
                {notice.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {t.aiInsightsTitle}
                </h4>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {notice.text}
                </p>
                {aiError && (
                  <p className="text-xs text-slate-600 font-medium pt-1">
                    {t.aiOfflineNotice}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Medical Non-Diagnostic Limitation Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-normal font-medium">
          {t.aiMedicalDisclaimer}
        </div>

      </div>
    </section>
  );
};
