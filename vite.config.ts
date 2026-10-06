import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_88d279a35b0b42ea8adef28388988923fce70edbfe208e47';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'aura-backend-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/tts' && req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => bodyStr += chunk);
            req.on('end', async () => {
              try {
                const { text, voiceId = 'pNInz6obpgDQGcFmaJgB', modelId = 'eleven_multilingual_v2', stability = 0.5, similarity = 0.75, style = 0.0 } = JSON.parse(bodyStr || '{}');

                if (!text || !text.trim()) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Text prompt is required.' }));
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
                  console.error('[Vite Backend Middleware] ElevenLabs error:', response.status, errText);
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: `ElevenLabs API error: ${response.status}`, details: errText }));
                }

                const audioBuffer = await response.arrayBuffer();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Length', audioBuffer.byteLength);
                return res.end(Buffer.from(audioBuffer));
              } catch (err) {
                console.error('[Vite Backend Middleware] TTS error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Failed to synthesize speech in backend proxy.' }));
              }
            });
            return;
          }

          if (req.url === '/api/translate' && req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => bodyStr += chunk);
            req.on('end', async () => {
              try {
                const { text, sourceLang = 'en', targetLang = 'es' } = JSON.parse(bodyStr || '{}');
                if (!text) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: 'Text is required' }));
                }

                const lingvaUrl = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text.trim())}`;
                const resp = await fetch(lingvaUrl, { headers: { 'User-Agent': 'Aura-Voice/2.0' } });
                if (resp.ok) {
                  const data = await resp.json();
                  if (data.translation) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ translation: data.translation }));
                  }
                }

                const dictionary: Record<string, string> = {
                  es: 'La voz que transforma el pensamiento en presencia acústica viva.',
                  fr: 'La voix qui transforme la pensée en présence acoustique vivante.',
                  de: 'Die Stimme, die Gedanken in lebendige akustische Präsenz verwandelt.',
                  it: 'La voce che trasforma il pensiero in una presenza acustica viva.',
                  ja: '思考を生きた音響の存在へと変える声。',
                  zh: '将思想转化为鲜活声学存在的声音。',
                  hi: 'वह आवाज़ जो विचार को सजीव ध्वनिक उपस्थिति में बदल देती है।',
                };

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ translation: dictionary[targetLang] || `[${targetLang.toUpperCase()}] ${text}` }));
              } catch (e) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: 'Translation failed' }));
              }
            });
            return;
          }

          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 2500,
  },
});
