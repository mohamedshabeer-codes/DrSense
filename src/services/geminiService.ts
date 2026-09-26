import { AIAnalysisRequest, AIInsight } from '../types';

export interface AIAnalysisResult {
  success: boolean;
  insight?: AIInsight;
  error?: string;
  status?: string;
}

class GeminiService {
  private lastAnalysisTime: number = 0;
  private lastRequestHash: string = '';
  private lastInsight: AIInsight | null = null;
  private isRequestInProgress: boolean = false;
  private readonly COOLDOWN_MS = 6000; // 6 seconds cooldown between automated or repeated requests

  /**
   * Check if real sensor readings are present and valid for AI evaluation.
   * Grounded strictly in real MAX30102 readings; no fake data.
   */
  public canAnalyze(request: AIAnalysisRequest): boolean {
    return (
      request.deviceConnected &&
      request.heartRate !== null &&
      request.spo2 !== null &&
      request.sensorStatus !== 'no_finger' &&
      request.sensorStatus !== 'measuring' &&
      request.sensorStatus !== 'device_disconnected'
    );
  }

  /**
   * Get remaining cooldown seconds if within cooldown window
   */
  public getCooldownRemaining(): number {
    const elapsed = Date.now() - this.lastAnalysisTime;
    if (elapsed < this.COOLDOWN_MS) {
      return Math.ceil((this.COOLDOWN_MS - elapsed) / 1000);
    }
    return 0;
  }

  /**
   * Analyze real sensor readings using the server-side Gemini API proxy.
   * If network is down, Gemini is unavailable, or API key is missing,
   * it fails gracefully with an informative error without interrupting
   * local rule-based monitoring.
   */
  public async analyzeReading(
    request: AIAnalysisRequest,
    force: boolean = false
  ): Promise<AIAnalysisResult> {
    // 1. Check if an analysis is already active
    if (this.isRequestInProgress) {
      return {
        success: false,
        error: request.language === 'ta'
          ? 'முந்தைய பகுப்பாய்வு செயல்பாட்டில் உள்ளது. தயவுசெய்து காத்திருக்கவும்.'
          : 'An analysis is already in progress. Please wait.',
      };
    }

    // 2. Strict check for genuine sensor readings
    if (!this.canAnalyze(request)) {
      let errorMsg = 'Valid sensor data is not currently available for AI analysis.';
      if (!request.deviceConnected) {
        errorMsg = request.language === 'ta'
          ? 'DrSense சாதனம் இணைக்கப்படாததால் AI பகுப்பாய்வு கிடைக்கவில்லை.'
          : 'AI analysis is unavailable because the DrSense device is not connected.';
      } else if (request.sensorStatus === 'no_finger') {
        errorMsg = request.language === 'ta'
          ? 'AI-உதவி பகுப்பாய்வைத் தொடங்க விரலை சென்சாரில் வைக்கவும்.'
          : 'Place your finger on the sensor to begin AI-assisted analysis.';
      } else if (request.sensorStatus === 'measuring') {
        errorMsg = request.language === 'ta'
          ? 'AI-உதவி நுண்ணறிவை உருவாக்குவதற்கு முன் நம்பகமான அளவீட்டைச் சேகரிக்கிறது.'
          : 'Collecting a reliable reading before generating an AI-assisted insight.';
      }

      return {
        success: false,
        error: errorMsg,
      };
    }

    // 3. Prevent duplicate requests if sensor values are identical and not forced
    const requestHash = `${request.heartRate}-${request.spo2}-${request.sos}-${request.sensorStatus}-${request.language}`;
    const now = Date.now();
    const timeSinceLast = now - this.lastAnalysisTime;

    if (!force && requestHash === this.lastRequestHash && this.lastInsight) {
      if (timeSinceLast < this.COOLDOWN_MS) {
        return {
          success: true,
          insight: this.lastInsight,
        };
      }
    }

    // Enforce minimal cooldown to prevent API spam
    if (!force && timeSinceLast < this.COOLDOWN_MS) {
      const waitSec = Math.ceil((this.COOLDOWN_MS - timeSinceLast) / 1000);
      return {
        success: false,
        error: request.language === 'ta'
          ? `அடுத்த AI பகுப்பாய்விற்கு முன் ${waitSec} விநாடிகள் காத்திருக்கவும்.`
          : `Please wait ${waitSec}s before requesting a new AI analysis.`,
      };
    }

    this.isRequestInProgress = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.insight) {
        this.lastAnalysisTime = Date.now();
        this.lastRequestHash = requestHash;
        this.lastInsight = data.insight;
        return {
          success: true,
          insight: data.insight,
        };
      }

      return {
        success: false,
        error: data.error || (request.language === 'ta'
          ? 'AI-உதவி பகுப்பாய்வு தற்காலிகமாக கிடைக்கவில்லை.'
          : 'AI-assisted analysis is temporarily unavailable.'),
      };
    } catch (err: any) {
      console.warn('DrSense Gemini AI service error (offline/unavailable):', err);
      return {
        success: false,
        error: request.language === 'ta'
          ? 'AI-உதவி பகுப்பாய்வு தற்காலிகமாக கிடைக்கவில்லை. முக்கிய சாதனக் கண்காணிப்பு மற்றும் பாதுகாப்பு எச்சரிக்கைகள் முழுமையாகச் செயல்படுகின்றன.'
          : 'AI-assisted analysis is temporarily unavailable. Core device monitoring and rule-based safety alerts remain fully operational.',
      };
    } finally {
      this.isRequestInProgress = false;
    }
  }

  public resetCache() {
    this.lastAnalysisTime = 0;
    this.lastRequestHash = '';
    this.lastInsight = null;
    this.isRequestInProgress = false;
  }
}

export const geminiService = new GeminiService();
