"use client";

import { useEffect, useRef, useState } from "react";
import { askAboutRahul } from "@/app/actions/chat";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";

const PROMPTS = [
  "What is HireTrack?",
  "How does licensing work?",
  "Why watermark instead of DRM?",
  "What’s he looking for?",
];

const STORAGE_KEY = "rahul-ask-chat-v1";
const MAX_MESSAGES = 50;

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  cached?: boolean;
};

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  text: "Ask about Rahul’s work — HireTrack’s self-hosted ATS, licensing, Selldocs watermarks, or what he’s looking for.",
};

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    (item.role === "user" || item.role === "assistant") &&
    typeof item.text === "string" &&
    (item.cached === undefined || typeof item.cached === "boolean")
  );
}

function readStoredMessages(): Message[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isMessage)) return null;
    return parsed.slice(-MAX_MESSAGES);
  } catch {
    return null;
  }
}

function nextMessageId(messages: Message[]) {
  return messages.reduce((max, message) => Math.max(max, message.id), -1) + 1;
}

export function ChatTile({ className, framed = true }: { className?: string; framed?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readStoredMessages();
    if (stored) {
      setMessages(stored);
      nextId.current = nextMessageId(stored);
      window.requestAnimationFrame(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      /* quota / private mode */
    }
  }, [messages, hydrated]);

  function push(message: Omit<Message, "id">) {
    const id = nextId.current++;
    setMessages((current) => [...current, { ...message, id }].slice(-MAX_MESSAGES));
    window.requestAnimationFrame(() => {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    });
  }

  function clearChat() {
    nextId.current = 1;
    setMessages([WELCOME]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
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
  const hasHistory = messages.some((message) => message.role === "user");

  const body = (
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
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className={cn("text-[10px]", tooShort ? "text-[#ff9f0a]" : "text-white/40")}>
            {tooShort
              ? `At least 4 characters — ${4 - typed} more`
              : remaining !== null
                ? `${remaining} questions left today · min 4 characters`
                : "Min 4 characters — skip hi/hello, ask about his work"}
          </p>
          {hasHistory ? (
            <button
              type="button"
              onClick={clearChat}
              className="shrink-0 text-[10px] text-white/45 hover:text-white/75"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
  );

  if (!framed) {
    return <div className={cn("flex h-full min-h-0 flex-col", className)}>{body}</div>;
  }

  return (
    <MacWindow className={cn("min-h-[280px]", className)} title="Ask">
      {body}
    </MacWindow>
  );
}
