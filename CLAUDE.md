# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # development server (Turbopack, hot-reload)
npm run build      # production build — always clear .next first if switching providers
npm start          # production server (requires a completed build)
npx tsc --noEmit   # type check without building
```

Changing `.env.local` only requires a server restart (`npm start`), not a rebuild. Rebuilding is only needed for code changes.

## Architecture

**Request flow:** `useChat` (hook) → `POST /api/chat` → `createChatModel` → LangChain provider → SSE stream back to client.

### LLM Provider system (`src/lib/langchain.ts`)

The active provider is controlled entirely by `LLM_PROVIDER` env var (`anthropic` | `openai` | `deepseek`). To add a new provider: add an entry to `PROVIDER_CONFIGS`, add its `if` branch in `createChatModel`, and add its API key to `.env.local.example`. DeepSeek uses `@langchain/openai` with a custom `baseURL` since it's OpenAI-compatible.

### Streaming (`src/app/api/chat/route.ts`)

Uses Server-Sent Events (SSE). The route wraps `model.stream()` in a `ReadableStream` and emits `data: {"content":"..."}` chunks. Chunk content is normalized to string because LangChain can return `string | ContentBlock[]` depending on provider. Errors mid-stream are sent as `data: {"error":"..."}` so the client can display them inline.

### Client state (`src/hooks/useChat.ts`)

All conversation state lives in `useChat` — no external store. `sendMessage` computes `currentMessages` from the stale closure before any `setConversations` call to avoid capturing the optimistic assistant placeholder in the payload sent to the API. The assistant message is pre-inserted as `""` then updated in-place as SSE chunks arrive.

## Environment Variables

| Variable | Required for |
|---|---|
| `LLM_PROVIDER` | Selecting provider (default: `anthropic`) |
| `ANTHROPIC_API_KEY` | `LLM_PROVIDER=anthropic` |
| `OPENAI_API_KEY` | `LLM_PROVIDER=openai` |
| `DEEPSEEK_API_KEY` | `LLM_PROVIDER=deepseek` |
