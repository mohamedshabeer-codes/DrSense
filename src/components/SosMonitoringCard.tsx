import React from 'react';
import { AlertCircle, BellRing, Check, Radio, Shield, WifiOff, ChevronRight } from 'lucide-react';
import { SosStatus } from '../types';
import { Translations } from '../localization/translations';

interface SosMonitoringCardProps {
  t: Translations;
  sosStatus: SosStatus;
  isConnected: boolean;
  onOpenSosDetails: () => void;
}

export const SosMonitoringCard: React.FC<SosMonitoringCardProps> = ({
  t,
  sosStatus,
  isConnected,
  onOpenSosDetails,
}) => {
  const getSosDetails = () => {
    if (!isConnected || sosStatus === 'disconnected') {
      return {
        title: t.sosDisconnectedTitle,
        desc: t.sosDisconnectedDesc,
        theme: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
        badge: 'bg-slate-200 text-slate-700',
        icon: <WifiOff className="w-6 h-6 text-slate-500" />,
        isEmergency: false,
      };
    }

    switch (sosStatus) {
      case 'activated':
        return {
          title: t.sosActivatedTitle,
          desc: t.sosActivatedDesc,
          theme: 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300 ring-offset-2 hover:bg-rose-100',
          badge: 'bg-rose-600 text-white animate-pulse',
          icon: <BellRing className="w-6 h-6 text-rose-600 animate-bounce" />,
          isEmergency: true,
        };
      case 'confirmed':
        return {
          title: t.sosConfirmedTitle,
          desc: t.sosConfirmedDesc,
          theme: 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100',
          badge: 'bg-rose-600 text-white',
          icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
          isEmergency: true,
        };
      case 'pending':
        return {
          title: t.sosPendingTitle,
          desc: t.sosPendingDesc,
          theme: 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100',
          badge: 'bg-amber-600 text-white animate-pulse',
          icon: <Radio className="w-6 h-6 text-amber-600 animate-spin" />,
          isEmergency: false,
        };
      case 'pressed':
        return {
          title: t.sosPressedTitle,
          desc: t.sosPressedDesc,
          theme: 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100',
          badge: 'bg-amber-600 text-white',
          icon: <AlertCircle className="w-6 h-6 text-amber-600 animate-pulse" />,
          isEmergency: false,
        };
      case 'standby':
        return {
          title: t.sosStandbyTitle,
          desc: t.sosStandbyDesc,
          theme: 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50',
          badge: 'bg-sky-100 text-sky-800 border border-sky-200',
          icon: <Shield className="w-6 h-6 text-sky-600" />,
          isEmergency: false,
        };
      case 'cancelled':
        return {
          title: t.sosCancelledTitle,
          desc: t.sosCancelledDesc,
          theme: 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100',
          badge: 'bg-slate-200 text-slate-700',
          icon: <Check className="w-6 h-6 text-slate-600" />,
          isEmergency: false,
        };
      case 'normal':
      default:
        return {
          title: t.sosNormalTitle,
          desc: t.sosNormalDesc,
          theme: 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50',
          badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
          icon: <Shield className="w-6 h-6 text-emerald-600" />,
          isEmergency: false,
        };
    }
  };

  const details = getSosDetails();

  return (
    <div
      id="sos-monitoring-card"
      role="button"
      tabIndex={0}
      onClick={onOpenSosDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenSosDetails();
        }
      }}
      className={`group rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 ${details.theme}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-inherit flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {details.icon}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t.sosTitle}
              </span>
              <span
                className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${details.badge}`}
              >
                {details.title}
              </span>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900 mt-1">
              {details.title}
            </h3>

            <p className="text-sm text-slate-600 mt-0.5 font-medium">
              {details.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 group-hover:translate-x-0.5 transition-transform">
            <span>{t.clickForDetails}</span>
            <ChevronRight className="w-4 h-4" />
          </span>

          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-inherit">
            Hardware Push-Button
          </span>
        </div>

      </div>
    </div>
  );
};
