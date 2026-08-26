"use client";

import { useActionState, useState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";
import { SocialLinks } from "@/components/system/SocialLinks";
import { MacWindow } from "@/components/system/MacWindow";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const initial: ContactState | null = null;

export function ContactForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <MacWindow className={className} title="Mail">
      <div className="flex min-h-0 flex-1 flex-col p-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-medium tracking-tight">New Message</h2>
        <SocialLinks />
      </div>
      <form action={action} className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
        <label className="flex min-h-0 flex-1 flex-col">
          <span className="sr-only">Message</span>
          <textarea
            name="message"
            required
            minLength={8}
            placeholder="Message"
            className="min-h-0 w-full flex-1 resize-none rounded-md border-0 bg-white/8 px-2.5 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/10"
          />
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-md bg-[#0a84ff] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send"}
          </button>
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-md bg-white/10 px-2.5 py-1.5 text-[12px] font-medium text-white/90 hover:bg-white/16"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {state ? (
          <p className={cn("text-[11px]", state.ok ? "text-[#30d158]" : "text-[#ff9f0a]")}>{state.message}</p>
        ) : null}
      </form>
      </div>
    </MacWindow>
  );
}
