"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/yaav-bot";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy **YaavBot** 🤖 Tu asistente de Yaavstore. ¿Buscas planes, chips, equipos o quieres publicar como Yaavser?",
};

function renderMarkdownLite(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function YaavBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages, loading]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "No pude responder. Intenta otra pregunta." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sin conexión. Revisa tu internet e intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[90] flex flex-col items-end gap-3 safe-bottom">
      {open && (
        <div
          className="yaavbot-panel w-[min(100vw-2rem,400px)] flex flex-col overflow-hidden"
          style={{ maxHeight: "min(70dvh, 540px)" }}
        >
          <div className="yaavbot-panel-header flex items-center gap-3 px-4 py-4 text-white shrink-0">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-inner">
              <Bot className="h-6 w-6" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yaav-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-yaav-500" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base font-bold uppercase tracking-wider flex items-center gap-1.5">
                YaavBot
                <Sparkles className="h-3.5 w-3.5 text-yaav-300" />
              </p>
              <p className="text-[10px] text-white/75 uppercase tracking-[0.15em]">
                IA · Planes, chips y equipos
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[220px] bg-white/95 backdrop-blur-md">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yaavs-navy to-yaavs-navy-light text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "yaavbot-bubble-user text-white"
                      : "yaavbot-bubble-bot text-neutral-700"
                  }`}
                >
                  {msg.role === "assistant" ? renderMarkdownLite(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yaavs-navy/10">
                  <Bot className="h-3.5 w-3.5 text-yaavs-navy" />
                </div>
                <div className="yaavbot-bubble-bot px-3 py-2 text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-neutral-200/80 bg-white p-3 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-yaavs-navy focus:ring-2 focus:ring-yaavs-navy/10 min-h-[44px] transition-shadow"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="yaavbot-send-btn flex h-11 w-11 shrink-0 items-center justify-center disabled:opacity-50"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <div className="relative flex items-end gap-3">
        {!open && (
          <div className="yaavbot-hint hidden sm:block">
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-yaavs-navy">
              ¿Necesitas ayuda?
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Pregúntame por planes y chips</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`yaavbot-fab group ${open ? "yaavbot-fab--open" : ""}`}
          aria-label={open ? "Cerrar asistente" : "Abrir asistente YaavBot"}
          aria-expanded={open}
        >
          <span className="yaavbot-fab-ring" aria-hidden />
          <span className="yaavbot-fab-inner">
            {open ? (
              <X className="h-7 w-7 transition-transform group-hover:rotate-90 duration-300" />
            ) : (
              <Bot className="h-7 w-7 transition-transform group-hover:scale-110 duration-300" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
