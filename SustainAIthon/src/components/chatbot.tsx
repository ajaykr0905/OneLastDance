"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  MessageCircle,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

let counter = 0;
function makeMsg(text: string, sender: Message["sender"]): Message {
  return { id: `m-${++counter}-${Date.now()}`, text, sender, timestamp: Date.now() };
}

const SUGGESTIONS = [
  "Which tiger reserves are in Madhya Pradesh?",
  "Tell me about Kaziranga National Park",
  "List conservation scientists from Karnataka",
  "What NGOs work in Maharashtra?",
  "How many bird sanctuaries does India have?",
  "Resources for wildlife conservation tech",
];

const SESSION_KEY = "wildguard-chat-history";
const API_TIMEOUT = 30_000;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
      aria-label="Copy message"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (isNearBottom) el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setFullscreen(false); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, makeMsg(query, "user")]);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      const data: unknown = await res.json();
      const responseText =
        typeof data === "object" && data !== null && "response" in data && typeof (data as Record<string, unknown>).response === "string"
          ? (data as { response: string }).response
          : "Received an unexpected response.";

      setMessages((prev) => [...prev, makeMsg(responseText, "bot")]);
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        makeMsg(isAbort ? "Request timed out. Please try again." : "Connection error. Please try again.", "bot"),
      ]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [input, loading]);

  const panelClasses = fullscreen
    ? "fixed inset-4 sm:inset-8 z-50 flex flex-col rounded-2xl border border-border bg-white shadow-2xl"
    : "flex w-80 sm:w-96 flex-col rounded-2xl border border-border bg-white shadow-2xl max-h-[80vh]";

  return (
    <>
      {fullscreen && open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => { setFullscreen(false); }}
        />
      )}

      <div className={cn("fixed z-50", fullscreen && open ? "inset-0 flex items-center justify-center" : "bottom-5 right-5")}>
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-110 cursor-pointer"
              aria-label="Open WildGuard AI assistant"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: fullscreen ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: fullscreen ? 0 : 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={panelClasses}
              role="dialog"
              aria-label="WildGuard AI Assistant"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white rounded-t-2xl shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm block leading-tight">WildGuard AI</span>
                    <span className="text-[10px] text-green-200">Wildlife Conservation Agent</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="rounded-lg p-1.5 hover:bg-white/20 cursor-pointer"
                    aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { setOpen(false); setFullscreen(false); }}
                    className="rounded-lg p-1.5 hover:bg-white/20 cursor-pointer"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 min-h-0"
                role="log"
                aria-live="polite"
              >
                {messages.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                      <Sparkles className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">WildGuard AI</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                        Ask me anything about Indian wildlife sanctuaries, conservation scientists, or environmental resources.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {SUGGESTIONS.slice(0, fullscreen ? 6 : 3).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700 hover:bg-green-100 transition-colors cursor-pointer text-left"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("flex flex-col gap-1", msg.sender === "user" ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md"
                          : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-md",
                      )}
                    >
                      {msg.sender === "bot" ? (
                        <div className="prose prose-sm prose-gray max-w-none prose-headings:text-sm prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-green-600 prose-strong:text-gray-900 prose-code:text-green-700 prose-code:bg-green-50 prose-code:px-1 prose-code:rounded">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    {msg.sender === "bot" && <CopyButton text={msg.text} />}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-gray-50 border border-gray-100 px-4 py-3">
                      <div className="flex gap-1" aria-label="Thinking">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="h-2 w-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">Analyzing...</span>
                    </div>
                  </div>
                )}
              </div>

              {showScroll && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                  <button
                    onClick={scrollToBottom}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-border shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    aria-label="Scroll to bottom"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              )}

              <div className="border-t border-border p-3 shrink-0 rounded-b-2xl">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about wildlife sanctuaries..."
                    disabled={loading}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 disabled:opacity-50 transition-all"
                    aria-label="Chat message"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-3"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-2 text-center text-[10px] text-gray-300">
                  Powered by Gemini &middot; Data from 25 Indian states
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
