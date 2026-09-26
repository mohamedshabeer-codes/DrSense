import { ConnectionStatus, DevicePayload, SosStatus } from '../types';

export interface Esp32ServiceCallbacks {
  onData: (payload: DevicePayload) => void;
  onStatusChange: (status: ConnectionStatus, errorMsg?: string) => void;
}

export interface PollResult {
  success: boolean;
  message: string;
}

export class Esp32Service {
  private targetUrl: string = 'http://ESP32_IP_ADDRESS/data';
  private pollingIntervalMs: number = 1000;
  private timerId: number | null = null;
  private isPollingActive: boolean = false;
  private callbacks: Esp32ServiceCallbacks | null = null;
  private currentStatus: ConnectionStatus = 'disconnected';
  private abortController: AbortController | null = null;
  private consecutiveFailures: number = 0;
  private lastErrorMessage: string = '';

  constructor(initialUrl?: string, intervalMs?: number) {
    if (initialUrl) {
      this.targetUrl = this.normalizeUrl(initialUrl);
    }
    if (intervalMs) {
      this.pollingIntervalMs = intervalMs;
    }
  }

  public normalizeUrl(url: string): string {
    let clean = url.trim();
    if (!clean) return 'http://ESP32_IP_ADDRESS/data';
    if (clean === 'http://ESP32_IP_ADDRESS' || clean === 'http://ESP32_IP_ADDRESS/') {
      return 'http://ESP32_IP_ADDRESS/data';
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'http://' + clean;
    }
    // ensure /data endpoint
    if (!clean.endsWith('/data') && !clean.includes('/data?')) {
      clean = clean.replace(/\/+$/, '') + '/data';
    }
    return clean;
  }

  public setCallbacks(callbacks: Esp32ServiceCallbacks) {
    this.callbacks = callbacks;
  }

  public setTargetUrl(url: string) {
    const normalized = this.normalizeUrl(url);
    if (this.targetUrl !== normalized) {
      this.targetUrl = normalized;
      if (this.isPollingActive) {
        this.restart();
      }
    }
  }

  public resetTargetUrl() {
    this.setTargetUrl('http://ESP32_IP_ADDRESS/data');
    this.updateStatus('disconnected', 'Device address reset to default placeholder');
  }

  public getTargetUrl(): string {
    return this.targetUrl;
  }

  public getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  public getLastError(): string {
    return this.lastErrorMessage;
  }

  public start() {
    if (this.isPollingActive) return;
    this.isPollingActive = true;
    this.consecutiveFailures = 0;
    this.pollOnce();
  }

  public stop() {
    this.isPollingActive = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.updateStatus('disconnected');
  }

  public restart(): Promise<PollResult> {
    this.stop();
    this.start();
    return this.pollOnce();
  }

  public isPlaceholder(): boolean {
    const u = this.targetUrl.toLowerCase();
    return (
      u === '' ||
      u === 'http://esp32_ip_address' ||
      u === 'http://esp32_ip_address/data' ||
      u === 'http://' ||
      u === 'https://'
    );
  }

  public async pollOnce(): Promise<PollResult> {
    // Check if placeholder address is set
    if (this.isPlaceholder()) {
      this.lastErrorMessage = 'Device address not configured. Please enter your local ESP32 IP address.';
      this.updateStatus('disconnected', this.lastErrorMessage);
      this.scheduleNext(this.pollingIntervalMs);
      return {
        success: false,
        message: this.lastErrorMessage,
      };
    }

    const endpoint = this.targetUrl;

    if (this.currentStatus === 'disconnected') {
      this.updateStatus('connecting');
    }

    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      this.abortController?.abort();
    }, 3000);

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: this.abortController.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Device responded with error status: ${response.status}`);
      }

      const json = await response.json();
      this.consecutiveFailures = 0;
      this.lastErrorMessage = '';
      this.updateStatus('connected');

      // Forward genuine hardware payload
      if (this.callbacks) {
        this.callbacks.onData(json);
      }

      return {
        success: true,
        message: 'Connected to DrSense hardware successfully.',
      };
    } catch (err: unknown) {
      window.clearTimeout(timeoutId);
      this.consecutiveFailures++;

      let errorDescription = 'Connection failed';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorDescription = 'Connection timed out. Check that the ESP32 is powered on and reachable on the local network.';
        } else {
          errorDescription = err.message || 'Unable to connect to ESP32';
        }
      }

      this.lastErrorMessage = errorDescription;

      // When failure happens, mark as disconnected
      this.updateStatus('disconnected', errorDescription);

      return {
        success: false,
        message: errorDescription,
      };
    } finally {
      this.abortController = null;
      this.scheduleNext(this.pollingIntervalMs);
    }
  }

  private scheduleNext(delayMs: number) {
    if (!this.isPollingActive) return;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
    }
    this.timerId = window.setTimeout(() => {
      this.pollOnce();
    }, delayMs);
  }

  private updateStatus(status: ConnectionStatus, errorMsg?: string) {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.callbacks?.onStatusChange(status, errorMsg);
    }
  }
}

/**
 * Parses raw sos value from payload into known SosStatus
 */
export function parseSosStatus(
  rawSos: boolean | string | number | null | undefined,
  isConnected: boolean
): SosStatus {
  if (!isConnected) {
    return 'disconnected';
  }

  if (rawSos === true || rawSos === 1 || rawSos === '1') {
    return 'activated';
  }

  if (typeof rawSos === 'string') {
    const s = rawSos.toLowerCase().trim();
    if (s === 'pressed') return 'pressed';
    if (s === 'pending') return 'pending';
    if (s === 'confirmed') return 'confirmed';
    if (s === 'activated' || s === 'active' || s === 'true' || s === 'emergency') return 'activated';
    if (s === 'cancelled' || s === 'cleared') return 'cancelled';
    if (s === 'standby') return 'standby';
    if (s === 'normal' || s === 'false' || s === '0') return 'normal';
  }

  return 'normal';
}
