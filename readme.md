# 🌌 Cosmic Characters

An AI-driven web application that allows users to interact with themed virtual characters through real-time chat and voice. Built with Next.js, React, TypeScript, and powered by local AI (Ollama).

![Cosmic Characters](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Ollama](https://img.shields.io/badge/Ollama-Local_AI-green?style=for-the-badge)

---

## ✨ Features

- 🤖 **AI-Powered Conversations** - Chat with 5 unique cosmic characters, each with distinct personalities
- 🎭 **Character Personalities** - Mars (Adventurous), Luna (Wise), Nebula (Playful), Stellar (Mysterious), Cosmos (Calm)
- 💬 **Real-time Streaming** - See AI responses appear in real-time as they're generated
- 🎤 **Voice Input** - Speak to characters using Speech-to-Text (browser-based)
- 🔊 **Voice Output** - Hear character responses with Text-to-Speech
- 💾 **Conversation Memory** - Characters remember previous conversations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Beautiful UI** - Modern interface with smooth animations using Framer Motion
- 🔒 **Privacy First** - All AI processing runs locally on your device via Ollama



## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React

### AI & Voice
- **AI Engine:** Ollama (Local LLM)
- **Model:** Llama 3.2 (3B parameters)
- **Text-to-Speech:** Browser Web Speech API
- **Speech-to-Text:** Browser Web Speech API

### Architecture
- **Design Pattern:** Feature-based architecture
- **Code Quality:** ESLint + Prettier
- **Type Safety:** Strict TypeScript configuration

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Ollama** ([Download here](https://ollama.com/download))

### Install Ollama

**Windows:**
```bash
# Download installer from https://ollama.com/download
# Run the installer
# Verify installation
ollama --version
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/midhat81/cosmic-characters.git
cd cosmic-characters
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Download AI Model
```bash
# Pull the Llama 3.2 model (2GB download)
ollama pull llama3.2:3b

# Verify model is downloaded
ollama list
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

Update the values (defaults should work for local development):
```env
# AI Service Configuration
AI_SERVICE=local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# Voice Services
TTS_SERVICE=browser
STT_SERVICE=browser

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Cosmic Characters
NEXT_PUBLIC_MAX_MESSAGE_LENGTH=2000
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=60
NEXT_PUBLIC_ENABLE_STREAMING=true
NEXT_PUBLIC_STREAM_CHUNK_SIZE=10
```

---

## 🚀 Running the Application

### Start Ollama (Terminal 1)
```bash
ollama serve
```

Keep this terminal running. You should see:
```
Ollama server running on http://127.0.0.1:11434
```

### Start Next.js Dev Server (Terminal 2)
```bash
npm run dev
# or
yarn dev
```

### Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure
```
cosmic-characters/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── chat/            # Chat endpoint
│   │   ├── characters/      # Character data endpoint
│   │   └── voice/           # Voice endpoints
│   ├── characters/          # Character pages
│   ├── about/               # About page
│   ├── settings/            # Settings page
│   ├── chats/               # Chat history page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── animations/          # Animation components
│       ├── FadeIn.tsx
│       └── TypingEffect.tsx
│
├── features/                # Feature modules
│   ├── characters/          # Character management
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterList.tsx
│   │   ├── character.data.ts
│   │   └── useCharacters.ts
│   ├── chat/                # Chat functionality
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatInput.tsx
│   ├── voice/               # Voice features
│   │   ├── VoiceRecorder.tsx
│   │   └── VoicePlayer.tsx
│   └── memory/              # Conversation memory
│       └── memory.service.ts
│
├── hooks/                   # Custom React hooks
│   ├── useChat.ts
│   ├── useVoice.ts
│   ├── useStreamingResponse.ts
│   └── ...
│
├── services/                # External services
│   ├── ai.service.ts        # AI/Ollama integration
│   ├── tts.service.ts       # Text-to-Speech
│   └── stt.service.ts       # Speech-to-Text
│
├── store/                   # Zustand state stores
│   ├── chat.store.ts
│   ├── character.store.ts
│   ├── settings.store.ts
│   └── ui.store.ts
│
├── types/                   # TypeScript type definitions
│   ├── character.ts
│   ├── chat.ts
│   └── voice.ts
│
├── utils/                   # Utility functions
│   ├── formatTime.ts
│   ├── generateId.ts
│   └── promptBuilder.ts
│
├── styles/                  # Global styles
│   ├── theme.css
│   └── animations.css
│
└── public/                  # Static assets
    ├── characters/          # Character images
    └── icons/
```

---

## 🎭 Available Characters

### 1. **Mars** - The Adventurous Explorer
- Personality: Adventurous, Excited
- Speaks with enthusiasm and encourages exploration

### 2. **Luna** - The Wise Moonkeeper
- Personality: Wise, Calm
- Offers deep insights and philosophical guidance

### 3. **Nebula** - The Playful Stardust
- Personality: Playful, Happy
- Brings joy and creativity to conversations

### 4. **Stellar** - The Mysterious Voyager
- Personality: Mysterious, Thoughtful
- Speaks in intriguing riddles and metaphors

### 5. **Cosmos** - The Eternal Guardian
- Personality: Calm, Thoughtful
- Radiates peace and universal wisdom

---

## 🎮 Usage

### Starting a Conversation

1. Click **"Explore Characters"** on the home page
2. Select a character by clicking their card
3. Click **"Start Conversation"**
4. Type your message or use voice input
5. Receive AI-powered responses in real-time

### Using Voice Features

**Voice Input (Speech-to-Text):**
1. Click the 🎤 microphone button in the chat input
2. Allow microphone permissions when prompted
3. Speak your message
4. Click stop or wait for auto-send

**Voice Output (Text-to-Speech):**
1. After receiving a response, click the 🔊 speaker icon
2. The message will be read aloud
3. Enable auto-play in Settings for automatic TTS

### Managing Conversations

- **View History:** Click "Chats" in the sidebar
- **Continue Chat:** Click on any previous conversation
- **Delete Chat:** Click the trash icon on a conversation
- **New Chat:** Click "Characters" and select a character again

---

## ⚙️ Configuration

### AI Settings

Edit `.env.local` to customize AI behavior:
```env
# Use different model
OLLAMA_MODEL=llama3.1

# Adjust context length (in constants.ts)
maxTokens: 2048
temperature: 0.8
```

### Voice Settings

Go to **Settings** page in the app to configure:
- Enable/disable voice features
- Auto-play TTS responses
- TTS speed and volume
- STT language

---

## 🧪 Development

### Available Scripts
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Adding a New Character

1. Edit `features/characters/character.data.ts`
2. Add character object to `CHARACTERS` array:
```typescript
{
  id: 'newchar',
  name: 'Character Name',
  title: 'Character Title',
  description: 'Character description',
  personality: 'adventurous',
  mood: 'happy',
  avatar: '/characters/newchar.png',
  color: '#HEX_COLOR',
  background: 'linear-gradient(...)',
  traits: ['trait1', 'trait2'],
  backstory: 'Character backstory...',
  systemPrompt: 'You are...',
  greeting: 'Hello! ...',
}
```

3. Add character image to `public/characters/`

---

## 🐛 Troubleshooting

### Ollama Not Responding

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

**Restart Ollama:**
```bash
# Press Ctrl+C to stop
ollama serve
```

### Voice Features Not Working

**Browser Compatibility:**
- Chrome/Edge: ✅ Full support
- Firefox: ⚠️ Limited support
- Safari: ⚠️ Limited support

**Check Permissions:**
- Allow microphone access in browser settings
- Voice APIs require HTTPS or localhost

### Model Not Found
```bash
# List installed models
ollama list

# Pull missing model
ollama pull llama3.2:3b
```

### Port Already in Use
```bash
# Change dev server port
npm run dev -- -p 3001
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Muhammad Midhat**

- Portfolio: [Your Portfolio URL]
- GitHub: [@midhat81](https://github.com/midhat81)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/muhammadmidhat81)

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) - Local LLM runtime
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📧 Support

For support, email [mianmidhat@gmail.com] or open an issue on GitHub.

---

<p align="center">Made with ❤️ by Muhammad Midhat</p>