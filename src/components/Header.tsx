import React from 'react';
import { Activity, Settings2 } from 'lucide-react';
import { ConnectionStatus, Language } from '../types';
import { Translations } from '../localization/translations';

interface HeaderProps {
  t: Translations;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  connectionStatus: ConnectionStatus;
  onToggleConfig: () => void;
  isConfigOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  currentLang,
  onLanguageChange,
  connectionStatus,
  onToggleConfig,
  isConfigOpen,
}) => {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-200">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  {t.appName}
                </h1>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/70">
                  ESP32 • MAX30102
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls: Connection Pill + Language Selector + Config Toggle */}
          <div className="flex items-center flex-wrap gap-2.5 sm:justify-end">
            
            {/* Live Connection Badge - Clickable to open Device Setup */}
            <button
              type="button"
              id="header-device-status-badge"
              onClick={onToggleConfig}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                  : isConnecting
                  ? 'bg-sky-50 text-sky-800 border-sky-200 animate-pulse hover:bg-sky-100/70'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
              }`}
              title={t.toggleConfigOpen}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected
                      ? 'bg-emerald-500'
                      : isConnecting
                      ? 'bg-sky-500'
                      : 'bg-slate-400'
                  }`}
                ></span>
              </span>
              <span>
                {isConnected
                  ? t.deviceConnected
                  : isConnecting
                  ? t.deviceConnecting
                  : t.deviceNotConnected}
              </span>
            </button>

            {/* Language Selector */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                id="lang-btn-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white text-cyan-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                id="lang-btn-ta"
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currentLang === 'ta'
                    ? 'bg-white text-cyan-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Device Setup Button */}
            <button
              id="device-config-toggle-btn"
              type="button"
              onClick={onToggleConfig}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isConfigOpen
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={isConfigOpen ? t.toggleConfigClose : t.toggleConfigOpen}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{t.toggleConfigOpen}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
