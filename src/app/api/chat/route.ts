import { NextRequest } from "next/server";
import { createDeepSeekModel, convertToLangChainMessages, SYSTEM_PROMPT, ChatMessage } from "@/lib/langchain";
import { SystemMessage } from "@langchain/core/messages";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = createDeepSeekModel(true);
    const langchainMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...convertToLangChainMessages(messages),
    ];

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResult = await model.stream(langchainMessages);

          for await (const chunk of streamResult) {
            const content = chunk.content;
            if (typeof content === "string" && content) {
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const error = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
