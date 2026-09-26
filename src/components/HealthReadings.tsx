import React from 'react';
import { Heart, Wind, ShieldAlert, CheckCircle2, AlertCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { ReadingClassification } from '../types';
import { Translations } from '../localization/translations';

interface HealthReadingsProps {
  t: Translations;
  heartRate: number | null;
  spo2: number | null;
  readingClassification: ReadingClassification;
  isConnected: boolean;
  onOpenHeartRate: () => void;
  onOpenSpo2: () => void;
  onOpenReadingStatus: () => void;
}

export const HealthReadings: React.FC<HealthReadingsProps> = ({
  t,
  heartRate,
  spo2,
  readingClassification,
  isConnected,
  onOpenHeartRate,
  onOpenSpo2,
  onOpenReadingStatus,
}) => {
  // Helper for reading classification pill
  const getClassificationBadge = (classification: ReadingClassification) => {
    if (!isConnected || classification === 'no_data') {
      return {
        label: t.statusNoData,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: <HelpCircle className="w-3.5 h-3.5" />,
      };
    }
    if (classification === 'normal') {
      return {
        label: t.statusNormal,
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    }
    if (classification === 'attention') {
      return {
        label: t.statusAttention,
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
      };
    }
    return {
      label: t.statusCritical,
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    };
  };

  const badge = getClassificationBadge(readingClassification);

  const displayHr = isConnected && heartRate !== null ? heartRate : '--';
  const displaySpo2 = isConnected && spo2 !== null ? spo2 : '--';

  return (
    <section aria-label="Health Readings" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Heart Rate Card - Fully Clickable */}
        <div
          id="heart-rate-card"
          role="button"
          tabIndex={0}
          onClick={onOpenHeartRate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenHeartRate();
            }
          }}
          className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-rose-200 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[210px] focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          {/* Subtle decorative background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-50 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
                  <Heart
                    className={`w-6 h-6 fill-rose-100 text-rose-600 ${
                      isConnected && heartRate !== null ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
                    {t.heartRate}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    MAX30102
                  </span>
                </div>
              </div>

              {/* Status Pill - Clickable to open Reading Status Modal */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReadingStatus();
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} hover:opacity-85 transition-opacity cursor-pointer`}
                title={t.clickForDetails}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </button>
            </div>

            {/* Main Numeric Display */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 font-sans tabular-nums">
                {displayHr}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600 uppercase">
                {t.bpmUnit}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span>{t.readingStatus}:</span>
              <span className="font-semibold text-slate-700">{badge.label}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-rose-600 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>{t.clickForDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* SpO2 Card - Fully Clickable */}
        <div
          id="spo2-card"
          role="button"
          tabIndex={0}
          onClick={onOpenSpo2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenSpo2();
            }
          }}
          className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[210px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {/* Subtle decorative background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-50 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 group-hover:scale-105 transition-transform">
                  <Wind className="w-6 h-6 text-cyan-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
                    {t.spo2}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    MAX30102
                  </span>
                </div>
              </div>

              {/* Status Pill - Clickable to open Reading Status Modal */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReadingStatus();
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} hover:opacity-85 transition-opacity cursor-pointer`}
                title={t.clickForDetails}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </button>
            </div>

            {/* Main Numeric Display */}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 font-sans tabular-nums">
                {displaySpo2}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-600">
                {t.percentUnit}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span>{t.readingStatus}:</span>
              <span className="font-semibold text-slate-700">{badge.label}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-cyan-700 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>{t.clickForDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
