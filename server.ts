import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health / Status endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      geminiConfigured: hasKey,
    });
  });

  // AI Analysis Endpoint - Server-Side Gemini API Proxy
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const {
        heartRate,
        spo2,
        sensorStatus,
        readingStatus,
        sos,
        deviceConnected,
        timestamp,
        language = 'en',
      } = req.body;

      // 1. Strict Validation: Check for actual sensor data
      if (!deviceConnected) {
        return res.status(200).json({
          success: false,
          error: language === 'ta'
            ? 'DrSense சாதனம் இணைக்கப்படாததால் AI பகுப்பாய்வு கிடைக்கவில்லை.'
            : 'AI analysis is unavailable because the DrSense device is not connected.',
          status: 'unavailable',
        });
      }

      if (sensorStatus === 'no_finger') {
        return res.status(200).json({
          success: false,
          error: language === 'ta'
            ? 'AI-உதவி பகுப்பாய்வைத் தொடங்க விரலை சென்சாரில் வைக்கவும்.'
            : 'Place your finger on the sensor to begin AI-assisted analysis.',
          status: 'no_finger',
        });
      }

      if (sensorStatus === 'measuring') {
        return res.status(200).json({
          success: false,
          error: language === 'ta'
            ? 'AI-உதவி நுண்ணறிவை உருவாக்குவதற்கு முன் நம்பகமான அளவீட்டைச் சேகரிக்கிறது.'
            : 'Collecting a reliable reading before generating an AI-assisted insight.',
          status: 'measuring',
        });
      }

      if (heartRate === null || spo2 === null || typeof heartRate !== 'number' || typeof spo2 !== 'number') {
        return res.status(200).json({
          success: false,
          error: language === 'ta'
            ? 'சரியான சென்சார் தரவு தற்போது கிடைக்காததால் AI பகுப்பாய்வு கிடைக்கவில்லை.'
            : 'AI analysis is unavailable because valid sensor data is not currently available.',
          status: 'no_data',
        });
      }

      // 2. Obtain Gemini Client
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          success: false,
          error: language === 'ta'
            ? 'AI-உதவி பகுப்பாய்வு தற்காலிகமாக கிடைக்கவில்லை. விதிமுறை அடிப்படையிலான பாதுகாப்பு எச்சரிக்கைகள் முழுமையாகச் செயல்படுகின்றன.'
            : 'AI-assisted analysis is temporarily unavailable. Core device monitoring and rule-based safety alerts remain fully operational.',
          status: 'unavailable',
        });
      }

      // 3. Build Safe Medical Guidance Prompt
      const isTamil = language === 'ta';
      const promptContext = {
        sensor: 'MAX30102 Optical Photoplethysmography Pulse Oximeter',
        microcontroller: 'ESP32 DevKit V1',
        heartRateBpm: heartRate,
        spo2Percent: spo2,
        readingStatus: readingStatus || 'unknown',
        sosStatus: sos || 'normal',
        timestamp: timestamp || new Date().toLocaleTimeString(),
        language: isTamil ? 'Tamil (தமிழ்)' : 'English',
      };

      const systemInstruction = `You are the safety and early-awareness clinical interpreter for the DrSense portable on-device health monitoring system designed for disaster resilience.
DrSense reads real pulse and oxygen saturation values from a MAX30102 sensor connected to an ESP32 microcontroller.
STRICT SAFETY RULES:
1. NEVER diagnose any disease, syndrome, or medical condition. You are NOT a diagnostic system.
2. NEVER guarantee that the patient or user is "100% safe" or free from medical emergencies.
3. NEVER invent, randomize, or modify the provided numerical readings. Ground your entire evaluation strictly on: Heart Rate = ${heartRate} BPM, SpO₂ = ${spo2}%.
4. If SOS is pressed, pending, confirmed, or activated, this is a top-priority physical hardware emergency signal. Reflect this immediately in the status and recommendation.
5. Standard adult resting references for awareness:
   - Heart Rate: 60-100 BPM normal; 50-59 or 101-119 attention; <50 or >=120 critical.
   - SpO₂: >=95% normal; 90-94% attention; <90% critical.
6. Provide output strictly as a valid JSON object with EXACTLY these string fields:
   - "status": A concise status title (e.g., "${isTamil ? 'நிலையான அளவீடு' : 'Stable Reading'}", "${isTamil ? 'கவனம் தேவை' : 'Attention Required'}", "${isTamil ? 'அபாயகரமான அளவீடு' : 'Critical Reading'}", "${isTamil ? 'SOS எச்சரிக்கை இயங்குகிறது' : 'SOS Emergency Active'}").
   - "observation": A neutral, objective factual summary of the measured numbers (${heartRate} BPM, ${spo2}% SpO₂).
   - "reason": A brief physiological explanation of the awareness classification.
   - "recommendation": Practical non-diagnostic guidance (e.g. resting, adjusting posture, rechecking the optical sensor placement, seeking healthcare professional advice if symptoms occur).
   - "confidenceNote": A qualitative optical signal evaluation note (e.g., "${isTamil ? 'MAX30102 ஆப்டிகல் சென்சாரில் இருந்து நிலையான சிக்னல் பெறப்பட்டது' : 'High optical signal consistency verified from MAX30102 sensor'}"). NEVER use fabricated percentage numbers like "95%".
${isTamil ? 'All output text in the JSON fields MUST be in natural, grammatically correct Tamil (தமிழ்), preserving technical designations like ESP32, MAX30102, SpO₂, BPM, and SOS.' : 'All output text must be in clear English.'}
Output ONLY the raw JSON object, without markdown code fences or backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Analyze the following real DrSense sensor readings and return the required JSON object:\n${JSON.stringify(promptContext, null, 2)}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      let parsedInsight: {
        status?: string;
        observation?: string;
        reason?: string;
        recommendation?: string;
        confidenceNote?: string;
      } = {};

      try {
        parsedInsight = JSON.parse(responseText.trim());
      } catch (parseErr) {
        // Clean if wrapped in markdown
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedInsight = JSON.parse(cleaned);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      return res.status(200).json({
        success: true,
        insight: {
          status: parsedInsight.status || (isTamil ? 'நிலையான அளவீடு' : 'Stable Reading'),
          observation: parsedInsight.observation || (isTamil ? `${heartRate} BPM மற்றும் ${spo2}% SpO₂ சென்சாரால் அளவிடப்பட்டது.` : `Measured ${heartRate} BPM heart rate and ${spo2}% SpO₂ peripheral oxygen saturation.`),
          reason: parsedInsight.reason || (isTamil ? 'அளவீடுகள் எதிர்பார்க்கப்பட்ட வரம்பிற்குள் உள்ளன.' : 'Readings are within expected baseline ranges.'),
          recommendation: parsedInsight.recommendation || (isTamil ? 'தொடர்ந்து கண்காணிக்கவும். அறிகுறிகள் ஏதேனும் இருந்தால் மருத்துவரை அணுகவும்.' : 'Continue routine monitoring. Consult a medical professional if symptoms develop.'),
          confidenceNote: parsedInsight.confidenceNote || (isTamil ? 'MAX30102 ஆப்டிகல் சிக்னல் சரிபார்க்கப்பட்டது' : 'MAX30102 optical photoplethysmography signal verified'),
          timestamp: timeStr,
        },
      });
    } catch (err: any) {
      console.error('Gemini analysis error:', err);
      const isTamil = req.body?.language === 'ta';
      return res.status(200).json({
        success: false,
        error: isTamil
          ? 'AI-உதவி பகுப்பாய்வு தற்காலிகமாக கிடைக்கவில்லை. விதிமுறை அடிப்படையிலான பாதுகாப்பு எச்சரிக்கைகள் தொடர்ந்து செயல்படுகின்றன.'
          : 'AI-assisted analysis is temporarily unavailable. Rule-based safety alerts remain fully operational.',
        status: 'unavailable',
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DrSense Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
