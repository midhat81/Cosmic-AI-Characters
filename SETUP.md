# Cosmic Characters - Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Ollama** installed and running

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Ollama

Make sure Ollama is installed and running:
```bash
# Check if Ollama is running
ollama list

# Pull the llama3.1 model if not already downloaded
ollama pull llama3.1
```

### 3. Environment Configuration

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Update the values if needed (defaults should work for local development).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
cosmic-characters/
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
├── features/              # Feature-specific components
├── hooks/                 # Custom React hooks
├── services/              # API services
├── store/                 # Zustand state management
├── lib/                   # Utilities and configuration
├── types/                 # TypeScript types
├── utils/                 # Helper functions
├── styles/                # Global styles
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

## Features

✅ AI-powered chat with local Ollama
✅ 5 unique cosmic characters
✅ Real-time streaming responses
✅ Voice input (Speech-to-Text)
✅ Voice output (Text-to-Speech)
✅ Conversation memory
✅ Persistent chat history
✅ Responsive design
✅ Dark mode ready

## Troubleshooting

### Ollama Connection Issues

Make sure Ollama is running:
```bash
ollama serve
```

### Port Already in Use

Change the port in `package.json`:
```bash
next dev -p 3001
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand
- **AI**: Ollama (Local)
- **Voice**: Browser APIs

## License

MIT