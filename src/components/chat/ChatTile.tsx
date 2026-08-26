"use client";

import { useRef, useState } from "react";
import { askAboutRahul } from "@/app/actions/chat";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";

const PROMPTS = ["What is HireTrack?", "Tell me about Selldocs", "What’s he looking for?"];

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  cached?: boolean;
};

export function ChatTile({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Ask about Rahul’s work — HireTrack, Selldocs, BRAI, or what he’s looking for.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);

  function push(message: Omit<Message, "id">) {
    const id = nextId.current++;
    setMessages((current) => [...current, { ...message, id }]);
    window.requestAnimationFrame(() => {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function ask(question: string) {
    const text = question.trim();
    if (pending) return;
    if (text.length < 4) {
      setInput(text);
      return;
    }
    setInput("");
    setPending(true);
    push({ role: "user", text });
    const result = await askAboutRahul(text);
    if (result.ok) {
      setRemaining(result.remaining);
      push({ role: "assistant", text: result.answer, cached: result.cached });
    } else {
      if (typeof result.remaining === "number") setRemaining(result.remaining);
      push({ role: "assistant", text: result.error });
    }
    setPending(false);
  }

  const typed = input.trim().length;
  const tooShort = typed > 0 && typed < 4;

  return (
    <MacWindow className={cn("min-h-[280px]", className)} title="Ask">
      <div className="flex min-h-0 flex-1 flex-col p-2.5">
        <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[92%] rounded-2xl px-2.5 py-1.5 text-[12px] leading-snug",
                message.role === "user"
                  ? "ml-auto bg-[#0a84ff] text-white"
                  : "bg-white/10 text-white/90",
              )}
            >
              {message.text}
              {message.cached ? (
                <span className="mt-1 block text-[10px] text-white/45">cached</span>
              ) : null}
            </div>
          ))}
          {pending ? <p className="text-[11px] text-white/45">Thinking…</p> : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={pending}
              onClick={() => void ask(prompt)}
              className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/12 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          className="mt-2 flex gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            minLength={4}
            maxLength={280}
            placeholder="Ask about his work (min 4 characters)"
            title="At least 4 characters"
            className="min-w-0 flex-1 rounded-md border-0 bg-white/8 px-2.5 py-1.5 text-[12px] text-white outline-none placeholder:text-white/35 focus:bg-white/10"
          />
          <button
            type="submit"
            disabled={pending || input.trim().length < 4}
            className="rounded-md bg-[#0a84ff] px-2.5 py-1.5 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            Ask
          </button>
        </form>
        <p className={cn("mt-1 text-[10px]", tooShort ? "text-[#ff9f0a]" : "text-white/40")}>
          {tooShort
            ? `At least 4 characters — ${4 - typed} more`
            : remaining !== null
              ? `${remaining} questions left today · min 4 characters`
              : "Min 4 characters — skip hi/hello, ask about his work"}
        </p>
      </div>
    </MacWindow>
  );
}
