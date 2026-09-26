import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  ArrowRight,
  RefreshCw,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
} from 'lucide-react';
import { ConnectionStatus } from '../types';
import { Translations } from '../localization/translations';

interface DeviceConfigurationPanelProps {
  t: Translations;
  currentAddress: string;
  connectionStatus: ConnectionStatus;
  lastUpdated: string | null;
  lastError?: string;
  onSaveAddress: (address: string) => Promise<{ success: boolean; message: string }>;
  onReconnect: () => Promise<{ success: boolean; message: string }>;
  onResetAddress: () => void;
  onClose: () => void;
}

export const DeviceConfigurationPanel: React.FC<DeviceConfigurationPanelProps> = ({
  t,
  currentAddress,
  connectionStatus,
  lastUpdated,
  lastError,
  onSaveAddress,
  onReconnect,
  onResetAddress,
  onClose,
}) => {
  const [addressInput, setAddressInput] = useState(
    currentAddress === 'http://ESP32_IP_ADDRESS/data' || currentAddress === 'http://ESP32_IP_ADDRESS'
      ? ''
      : currentAddress
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    lastError ? { type: 'error', message: lastError } : null
  );

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = addressInput.trim();
    setIsSubmitting(true);
    setFeedback({ type: 'info', message: t.connAttempting });

    try {
      const result = await onSaveAddress(clean || 'http://ESP32_IP_ADDRESS/data');
      if (result.success) {
        setFeedback({ type: 'success', message: t.connResultSuccess });
      } else {
        setFeedback({ type: 'error', message: result.message || t.connResultFailed });
      }
    } catch {
      setFeedback({ type: 'error', message: t.connResultFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setIsSubmitting(true);
    setFeedback({ type: 'info', message: t.connAttempting });
    try {
      const result = await onReconnect();
      if (result.success) {
        setFeedback({ type: 'success', message: t.connResultSuccess });
      } else {
        setFeedback({ type: 'error', message: result.message || t.connResultFailed });
      }
    } catch {
      setFeedback({ type: 'error', message: t.connResultFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setAddressInput('');
  };

  const handleResetToDefault = () => {
    setAddressInput('');
    onResetAddress();
    setFeedback({
      type: 'info',
      message: 'Address reset to placeholder (http://ESP32_IP_ADDRESS/data). Status: Device Not Connected.',
    });
  };

  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting' || isSubmitting;

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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {t.configTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.hardwareNote}
              </p>
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700">
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="device-address-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  {t.configAddressLabel}
                </label>
                <div className="flex items-center gap-2">
                  {addressInput && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      {t.clearAddress}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.resetDefault}</span>
                  </button>
                </div>
              </div>

              <input
                id="device-address-input"
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="http://ESP32_IP_ADDRESS/data"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-slate-900 placeholder:text-slate-400"
              />

              <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
                {t.configHelpText}
              </p>
            </div>

            {/* Action Buttons: Connect, Retry, Reconnect */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                id="modal-connect-btn"
                type="submit"
                disabled={isConnecting}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>{t.connect}</span>
              </button>

              <button
                id="modal-retry-btn"
                type="button"
                onClick={handleRetry}
                disabled={isConnecting}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                <span>{t.retry}</span>
              </button>

              <button
                id="modal-reconnect-btn"
                type="button"
                onClick={handleRetry}
                disabled={isConnecting}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-600" />
                <span>{t.reconnect}</span>
              </button>
            </div>
          </form>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedback.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-sky-50 border-sky-200 text-sky-900'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{feedback.message}</span>
            </div>
          )}

          {/* Live Diagnostic Details */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">{t.connectionStatusLabel}:</span>
              <span
                className={`font-bold inline-flex items-center gap-1.5 ${
                  isConnected
                    ? 'text-emerald-700'
                    : isConnecting
                    ? 'text-sky-700'
                    : 'text-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? 'bg-emerald-500'
                      : isConnecting
                      ? 'bg-sky-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {isConnected
                  ? t.deviceConnected
                  : isConnecting
                  ? t.deviceConnecting
                  : t.deviceNotConnected}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">{t.activeTarget}:</span>
              <span className="font-mono text-slate-800 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] truncate max-w-[240px]">
                {currentAddress}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">{t.lastUpdated}:</span>
              <span className="font-mono text-slate-700 font-semibold">
                {lastUpdated || t.neverUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
