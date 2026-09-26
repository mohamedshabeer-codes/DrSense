import React from 'react';
import { Sparkles, ShieldCheck, AlertCircle, AlertOctagon, HelpCircle, Activity, ChevronRight } from 'lucide-react';
import { EarlyWarningState } from '../types';
import { Translations } from '../localization/translations';

interface EarlyWarningCardProps {
  t: Translations;
  earlyWarningState: EarlyWarningState;
  onOpenEarlyWarningDetails: () => void;
}

export const EarlyWarningCard: React.FC<EarlyWarningCardProps> = ({
  t,
  earlyWarningState,
  onOpenEarlyWarningDetails,
}) => {
  const getInsightContent = () => {
    switch (earlyWarningState) {
      case 'sos':
        return {
          title: t.insightSosAlert,
          description: t.insightSosCheckUser,
          theme: 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/70',
          accent: 'bg-rose-600 text-white',
          icon: <AlertOctagon className="w-6 h-6 text-rose-600 animate-bounce" />,
          statusTag: 'SOS ALERT',
          statusColor: 'bg-rose-600 text-white animate-pulse',
        };
      case 'attention':
        return {
          title: t.statusAttention,
          description: t.insightAttention,
          theme: 'bg-amber-50/80 border-amber-300 text-amber-950 hover:bg-amber-100/70',
          accent: 'bg-amber-500 text-white',
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          statusTag: t.statusAttention,
          statusColor: 'bg-amber-100 text-amber-900 border border-amber-300',
        };
      case 'stable':
        return {
          title: t.statusNormal,
          description: t.insightStable,
          theme: 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70',
          accent: 'bg-emerald-600 text-white',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
          statusTag: t.statusNormal,
          statusColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
        };
      case 'measuring':
        return {
          title: t.sensorMeasuring,
          description: t.insightMeasuring,
          theme: 'bg-sky-50/80 border-sky-200 text-sky-950 hover:bg-sky-100/70',
          accent: 'bg-sky-600 text-white',
          icon: <Activity className="w-6 h-6 text-sky-600 animate-pulse" />,
          statusTag: 'ACTIVE CHECK',
          statusColor: 'bg-sky-100 text-sky-900 border border-sky-200',
        };
      case 'no_finger':
        return {
          title: t.sensorPlaceFinger,
          description: t.insightNoFinger,
          theme: 'bg-amber-50/60 border-amber-200 text-amber-950 hover:bg-amber-100/70',
          accent: 'bg-amber-500 text-white',
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          statusTag: t.sensorPlaceFinger,
          statusColor: 'bg-amber-100 text-amber-900 border border-amber-200',
        };
      case 'invalid_data':
        return {
          title: t.sensorUnavailable,
          description: t.insightInvalidData,
          theme: 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200/70',
          accent: 'bg-slate-500 text-white',
          icon: <AlertCircle className="w-6 h-6 text-slate-600" />,
          statusTag: 'UNRELIABLE',
          statusColor: 'bg-slate-200 text-slate-800 border border-slate-300',
        };
      case 'waiting_for_data':
      default:
        return {
          title: t.statusNoData,
          description: t.insightWaitingData,
          theme: 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50',
          accent: 'bg-slate-400 text-white',
          icon: <HelpCircle className="w-6 h-6 text-slate-500" />,
          statusTag: t.statusNoData,
          statusColor: 'bg-slate-100 text-slate-700 border border-slate-200',
        };
    }
  };

  const insight = getInsightContent();

  return (
    <div
      id="early-warning-insights-card"
      role="button"
      tabIndex={0}
      onClick={onOpenEarlyWarningDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenEarlyWarningDetails();
        }
      }}
      className={`group rounded-2xl border-2 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 ${insight.theme}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-inherit flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {insight.icon}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                {t.ruleBasedSafetyTitle || t.insightsTitle}
              </span>
              <span
                className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${insight.statusColor}`}
              >
                {insight.statusTag}
              </span>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900 mt-1">
              {insight.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-700 mt-1 font-medium leading-relaxed">
              {insight.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:translate-x-0.5 transition-transform shrink-0 self-end sm:self-center">
          <span>{t.clickForDetails}</span>
          <ChevronRight className="w-4 h-4" />
        </div>

      </div>
    </div>
  );
};
