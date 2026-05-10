# DeepChat — AI Chatbot

A modern AI chatbot built with **Next.js 16**, **LangChain.js**, and **DeepSeek** as the LLM provider. Features real-time streaming responses, multi-conversation management, and a clean SaaS-style UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| LLM Orchestration | LangChain.js (`@langchain/openai`) |
| LLM Provider | DeepSeek (`deepseek-chat`) |
| Styling | Tailwind CSS + Typography plugin |
| Streaming | Server-Sent Events (SSE) |

## Features

- Real-time streaming responses from DeepSeek AI
- Multi-conversation with sidebar history
- Markdown rendering with syntax-highlighted code blocks
- Stop generation mid-stream
- Auto-resize message input
- Light theme modern SaaS UI

## Prerequisites

- Node.js 18+
- npm 9+
- DeepSeek API Key → [platform.deepseek.com](https://platform.deepseek.com)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MaulanaRhezaArdiansyah/chatbot.git
cd chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your DeepSeek API key:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set your key:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

> Get your API key from [platform.deepseek.com/api-keys](https://platform.deepseek.com/api-keys)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts   # Streaming chat API endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatInterface.tsx   # Main chat layout & empty state
│   ├── MessageBubble.tsx   # Message rendering with Markdown
│   ├── ChatInput.tsx       # Auto-resize input with stop button
│   └── Sidebar.tsx         # Conversation history sidebar
├── hooks/
│   └── useChat.ts          # Chat state & streaming logic
└── lib/
    └── langchain.ts        # LangChain + DeepSeek setup
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | Yes | API key from platform.deepseek.com |
