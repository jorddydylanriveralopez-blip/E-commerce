import { NextResponse } from "next/server";
import { YAAV_BOT_SYSTEM, fallbackYaavBotReply, type ChatMessage } from "@/lib/yaav-bot";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body.messages ?? []) as ChatMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mensajes requeridos" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          messages: [{ role: "system", content: YAAV_BOT_SYSTEM }, ...messages.slice(-10)],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (openaiRes.ok) {
        const data = await openaiRes.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({ reply, mode: "ai" });
        }
      }
    }

    const reply = fallbackYaavBotReply(lastUser.content);
    return NextResponse.json({ reply, mode: "fallback" });
  } catch {
    return NextResponse.json(
      { reply: "Hubo un error. Intenta de nuevo o explora el menú Ver servicios / Ver productos.", mode: "error" },
      { status: 200 }
    );
  }
}
