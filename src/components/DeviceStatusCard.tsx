import React from 'react';
import { Cpu, RefreshCw, Radio, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { ConnectionStatus, SensorState } from '../types';
import { Translations } from '../localization/translations';

interface DeviceStatusCardProps {
  t: Translations;
  connectionStatus: ConnectionStatus;
  sensorState: SensorState;
  lastUpdated: string | null;
  onReconnect: () => void;
  onOpenDeviceSetup: () => void;
  onOpenLastUpdated: () => void;
}

export const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({
  t,
  connectionStatus,
  sensorState,
  lastUpdated,
  onReconnect,
  onOpenDeviceSetup,
  onOpenLastUpdated,
}) => {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  // Sensor label
  const getSensorStatusLabel = () => {
    if (!isConnected) return t.sensorNotAvailable;
    if (sensorState === 'monitoring') return t.sensorReady;
    if (sensorState === 'measuring' || sensorState === 'no_finger') return t.sensorWaiting;
    return t.sensorNotAvailable;
  };

  const getSensorStatusColor = () => {
    if (!isConnected) return 'text-slate-600';
    if (sensorState === 'monitoring') return 'text-emerald-700';
    if (sensorState === 'measuring' || sensorState === 'no_finger') return 'text-amber-700';
    return 'text-rose-700';
  };

  return (
    <div
      id="device-status-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenDeviceSetup}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenDeviceSetup();
            }
          }}
          className="group flex items-center gap-3 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl p-1 -m-1"
          title={t.toggleConfigOpen}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-cyan-700" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-cyan-800 transition-colors">
                {t.deviceStatusTitle}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              ESP32 DevKit V1 • {t.clickForDetails}
            </p>
          </div>
        </div>

        {/* Reconnect button */}
        <button
          id="reconnect-device-btn"
          type="button"
          onClick={onReconnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
          <span>{t.reconnect}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        
        {/* DrSense Device - Clickable */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenDeviceSetup}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenDeviceSetup();
            }
          }}
          className="group space-y-1 cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          title={t.toggleConfigOpen}
        >
          <span className="text-xs text-slate-500 font-medium block">
            {t.drsenseDevice}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-emerald-500'
                  : isConnecting
                  ? 'bg-sky-500 animate-ping'
                  : 'bg-slate-400'
              }`}
            />
            <span
              className={`text-sm font-bold ${
                isConnected
                  ? 'text-emerald-800'
                  : isConnecting
                  ? 'text-sky-800'
                  : 'text-slate-700'
              }`}
            >
              {isConnected ? t.deviceConnected : t.deviceNotConnected}
            </span>
          </div>
        </div>

        {/* Sensor - Clickable */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenDeviceSetup}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenDeviceSetup();
            }
          }}
          className="group space-y-1 cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <span className="text-xs text-slate-500 font-medium block">
            {t.sensorLabel}
          </span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className={`w-3.5 h-3.5 ${getSensorStatusColor()}`} />
            <span className={`text-sm font-bold ${getSensorStatusColor()}`}>
              {getSensorStatusLabel()}
            </span>
          </div>
        </div>

        {/* Connection Status - Clickable */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenDeviceSetup}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenDeviceSetup();
            }
          }}
          className="group space-y-1 cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <span className="text-xs text-slate-500 font-medium block">
            {t.connectionStatusLabel}
          </span>
          <div className="flex items-center gap-1.5">
            <Radio
              className={`w-3.5 h-3.5 ${
                isConnected
                  ? 'text-emerald-600'
                  : isConnecting
                  ? 'text-sky-600 animate-spin'
                  : 'text-slate-400'
              }`}
            />
            <span
              className={`text-sm font-bold ${
                isConnected
                  ? 'text-emerald-800'
                  : isConnecting
                  ? 'text-sky-800'
                  : 'text-slate-700'
              }`}
            >
              {isConnected
                ? t.deviceConnected
                : isConnecting
                ? t.deviceConnecting
                : t.deviceNotConnected}
            </span>
          </div>
        </div>

        {/* Last Updated - Clickable to open Last Updated details */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenLastUpdated}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenLastUpdated();
            }
          }}
          className="group space-y-1 cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          title={t.clickForDetails}
        >
          <span className="text-xs text-slate-500 font-medium block">
            {t.lastUpdated}
          </span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
            <span className="text-sm font-bold text-slate-700 font-mono group-hover:text-sky-800 transition-colors">
              {lastUpdated ? lastUpdated : t.neverUpdated}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
