# 🎙️ AURA One // Physical Voice Instrument — ElevenLabs AI

An award-winning, cinematic 3D web experience and neural text-to-speech instrument powered by **ElevenLabs**. Designed with rich tactile physics, real-time Web Audio FFT frequency visualization, fluid dynamic aurora gradients, and low-latency multilingual speech synthesis.

---

## ✨ Features

- **🧠 ElevenLabs Neural TTS Engine**: Deep, authoritative narration using ElevenLabs Multilingual v2 models with zero-failure Web Audio buffer decoding.
- **🎨 Fluid Aurora Visuals**: High-energy moving ambient mesh gradients, neon glow cyber-deck styling, and glassmorphism.
- **🎛️ Physical 3D Instrument Capsule**: React Three Fiber 3D viewport featuring an interactive physical hardware capsule with tactile knobs, metallic speaker grille, and pulsing LED rings.
- **⚡ Real-Time Audio Frequency Analysis**: Live 512-point FFT frequency sampling (`subBass`, `mid`, `treble`, `peak`) driving real-time 3D vertex displacements and responsive particle clouds.
- **🌍 Polyglot Neural Translation**: Integrated speech translation workflow supporting 29+ languages with one-click transfer into the Voice Studio.
- **🔒 Backend Proxy Architecture**: Secure server middleware hiding the ElevenLabs API key behind `/api/tts` with client-side fallback resilience.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/prateeksharma07-hub/Elevenlabapi.git
cd Elevenlabapi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your ElevenLabs API Key:
```env
PORT=3001
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 8 (TypeScript)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Audio Engine**: Web Audio API (AudioContext, AnalyserNode, AudioBufferSourceNode)
- **Animations**: GSAP, Lenis Smooth Scroll
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Cyberdeck Aesthetics

---

## 📜 License

MIT License © 2026 Prateek Sharma
