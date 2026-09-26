import React from 'react';
import { History, Bell, CheckCircle2, AlertTriangle, ShieldAlert, Info, ChevronRight, Sparkles } from 'lucide-react';
import { AppEvent } from '../types';
import { Translations } from '../localization/translations';

interface RecentEventsListProps {
  t: Translations;
  events: AppEvent[];
  onOpenEventsHistory: () => void;
}

export const RecentEventsList: React.FC<RecentEventsListProps> = ({
  t,
  events,
  onOpenEventsHistory,
}) => {
  // Helper to translate event title and description based on event.type
  const getLocalizedEventInfo = (event: AppEvent) => {
    switch (event.type) {
      case 'DEVICE_CONNECTED':
        return {
          title: t.eventDeviceConnected,
          desc: t.eventDeviceConnectedDesc,
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'DEVICE_DISCONNECTED':
        return {
          title: t.eventDeviceDisconnected,
          desc: t.eventDeviceDisconnectedDesc,
          icon: <AlertTriangle className="w-4 h-4 text-slate-500" />,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'READING_STARTED':
        return {
          title: t.eventReadingStarted,
          desc: t.eventReadingStartedDesc,
          icon: <Info className="w-4 h-4 text-sky-600" />,
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'READING_UNAVAILABLE':
        return {
          title: t.eventReadingUnavailable,
          desc: t.eventReadingUnavailableDesc,
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'READING_RESTORED':
        return {
          title: t.eventReadingRestored,
          desc: t.eventReadingRestoredDesc,
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'SOS_PRESSED':
        return {
          title: t.eventSosPressed,
          desc: t.eventSosPressedDesc,
          icon: <Bell className="w-4 h-4 text-rose-600" />,
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      case 'SOS_PENDING':
        return {
          title: t.eventSosPending,
          desc: t.eventSosPendingDesc,
          icon: <Bell className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'SOS_ACTIVATED':
        return {
          title: t.eventSosActivated,
          desc: t.eventSosActivatedDesc,
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
        };
      case 'SOS_CANCELLED':
        return {
          title: t.eventSosCancelled,
          desc: t.eventSosCancelledDesc,
          icon: <CheckCircle2 className="w-4 h-4 text-slate-600" />,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'AI_INSIGHT_UPDATED':
        return {
          title: t.aiInsightsTitle,
          desc: event.detail ? `${t.aiObservationLabel}: ${event.detail}` : t.aiInsightsSubtitle,
          icon: <Sparkles className="w-4 h-4 text-cyan-600" />,
          badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        };
      case 'STATUS_CHANGED':
      default:
        return {
          title: t.eventStatusChanged,
          desc: event.detail ? `${t.eventStatusChangedDesc} (${event.detail})` : t.eventStatusChangedDesc,
          icon: <Info className="w-4 h-4 text-cyan-600" />,
          badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        };
    }
  };

  return (
    <section aria-label="Recent Events" className="w-full">
      <div
        id="recent-events-card"
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenEventsHistory}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenEventsHistory();
              }
            }}
            className="group flex items-center gap-2.5 cursor-pointer select-none rounded-xl p-1 -m-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform">
              <History className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-cyan-800 transition-colors">
                {t.eventsTitle}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenEventsHistory}
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 cursor-pointer"
            >
              {t.viewFullLog}
            </button>
            {events.length > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {events.length}
              </span>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenEventsHistory}
            className="py-8 text-center text-sm text-slate-500 font-medium cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          >
            {t.eventsEmpty}
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map((evt) => {
              const info = getLocalizedEventInfo(evt);
              return (
                <div
                  key={evt.id}
                  role="button"
                  tabIndex={0}
                  onClick={onOpenEventsHistory}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenEventsHistory();
                    }
                  }}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200 mt-0.5">
                      {info.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {info.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${info.badge}`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        {info.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0 mt-0.5">
                    {evt.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
