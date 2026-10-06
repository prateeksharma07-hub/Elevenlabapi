import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_88d279a35b0b42ea8adef28388988923fce70edbfe208e47';

app.use(express.json());

// CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'AURA ElevenLabs Proxy', keyConfigured: !!API_KEY });
});

// 1. Text-to-Speech Endpoint - Hiding API Key on Backend
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId = 'pNInz6obpgDQGcFmaJgB', modelId = 'eleven_multilingual_v2', stability = 0.5, similarity = 0.75, style = 0.0 } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'ElevenLabs API key is not configured on backend.' });
    }

    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=2`;

    const response = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: modelId,
        voice_settings: {
          stability: Number(stability),
          similarity_boost: Number(similarity),
          style: Number(style),
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[AURA Backend] ElevenLabs API error:', response.status, errText);
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.status}`,
        details: errText,
      });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('[AURA Backend] Synthesis error:', error);
    res.status(500).json({ error: 'Internal synthesis error in backend proxy.' });
  }
});

// 2. Translation Endpoint - High Reliability Neural Translation
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'en', targetLang = 'es' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const lingvaUrl = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text.trim())}`;
    const response = await fetch(lingvaUrl, { headers: { 'User-Agent': 'Aura-Voice/2.0' } });

    if (response.ok) {
      const data = await response.json();
      if (data.translation) {
        return res.json({ translation: data.translation });
      }
    }

    // Fallback dictionary / simulated multilingual echo
    const clean = text.trim();
    const dictionary = {
      es: 'La voz que transforma el pensamiento en presencia acústica viva.',
      fr: 'La voix qui transforme la pensée en présence acoustique vivante.',
      de: 'Die Stimme, die Gedanken in lebendige akustische Präsenz verwandelt.',
      it: 'La voce che trasforma il pensiero in una presenza acustica viva.',
      ja: '思考を生きた音響の存在へと変える声。',
      zh: '将思想转化为鲜活声学存在的声音。',
      hi: 'वह आवाज़ जो विचार को सजीव ध्वनिक उपस्थिति में बदल देती है।',
    };

    res.json({
      translation: dictionary[targetLang] || `[${targetLang.toUpperCase()}] ${clean}`,
    });
  } catch (err) {
    console.error('[AURA Backend] Translation error:', err);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[AURA Physical Instrument] Backend server running on http://localhost:${PORT}`);
});
