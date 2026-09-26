import React from 'react';
import { Fingerprint, Loader2, CheckCircle2, AlertTriangle, WifiOff, ChevronRight } from 'lucide-react';
import { SensorState } from '../types';
import { Translations } from '../localization/translations';

interface SensorStatusBannerProps {
  t: Translations;
  sensorState: SensorState;
  onOpenSensorDetails: () => void;
}

export const SensorStatusBanner: React.FC<SensorStatusBannerProps> = ({
  t,
  sensorState,
  onOpenSensorDetails,
}) => {
  // Config for each sensor state
  const getStateDetails = () => {
    switch (sensorState) {
      case 'no_finger':
        return {
          title: t.sensorPlaceFinger,
          subtitle: t.insightNoFinger,
          icon: <Fingerprint className="w-5 h-5 text-amber-700" />,
          containerStyle: 'bg-amber-50/90 border-amber-200 text-amber-950 hover:bg-amber-100/70',
          indicatorDot: 'bg-amber-500',
        };
      case 'measuring':
        return {
          title: t.sensorMeasuring,
          subtitle: t.sensorRemainStill,
          icon: <Loader2 className="w-5 h-5 text-sky-700 animate-spin" />,
          containerStyle: 'bg-sky-50/90 border-sky-200 text-sky-950 hover:bg-sky-100/70',
          indicatorDot: 'bg-sky-500 animate-ping',
        };
      case 'monitoring':
        return {
          title: t.sensorMonitoring,
          subtitle: t.insightStable,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
          containerStyle: 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70',
          indicatorDot: 'bg-emerald-500',
        };
      case 'unable_to_read':
        return {
          title: t.sensorUnavailable,
          subtitle: t.sensorAdjustFinger,
          icon: <AlertTriangle className="w-5 h-5 text-rose-700" />,
          containerStyle: 'bg-rose-50/90 border-rose-200 text-rose-950 hover:bg-rose-100/70',
          indicatorDot: 'bg-rose-500',
        };
      case 'device_disconnected':
      default:
        return {
          title: t.sensorDeviceDisconnected,
          subtitle: t.sensorWaitingDevice,
          icon: <WifiOff className="w-5 h-5 text-slate-600" />,
          containerStyle: 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200/70',
          indicatorDot: 'bg-slate-400',
        };
    }
  };

  const details = getStateDetails();

  return (
    <div
      id="sensor-status-banner"
      role="button"
      tabIndex={0}
      onClick={onOpenSensorDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenSensorDetails();
        }
      }}
      className={`group rounded-2xl border p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 ${details.containerStyle}`}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-white/80 backdrop-blur-xs border border-inherit shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          {details.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              {details.title}
            </h3>
            <span className={`w-2 h-2 rounded-full shrink-0 ${details.indicatorDot}`} />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            {details.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 group-hover:translate-x-0.5 transition-transform">
          <span>{t.clickForDetails}</span>
          <ChevronRight className="w-4 h-4" />
        </span>
        <div className="hidden md:flex items-center text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/70 border border-inherit text-slate-700">
          MAX30102
        </div>
      </div>
    </div>
  );
};
