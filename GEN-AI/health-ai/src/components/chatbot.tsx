"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle, X, Brain, Maximize2, Minimize2, Copy, Check, ChevronDown, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message { id: string; text: string; sender: "user" | "bot"; ts: number; }
let ctr = 0;
function msg(text: string, sender: Message["sender"]): Message {
  return { id: `m-${++ctr}-${Date.now()}`, text, sender, ts: Date.now() };
}

const SUGGESTIONS = [
  "What does the diabetes dataset contain?",
  "Assess risk: glucose 160, BMI 34, age 52",
  "Recommend drug for age 55, Na-to-K 18, high BP",
  "What factors predict diabetes?",
  "Compare drugA vs drugB",
  "Show drug distribution stats",
];

const SESSION_KEY = "medinsight-chat";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
      aria-label="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { try { const s = sessionStorage.getItem(SESSION_KEY); if (s) setMessages(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { if (messages.length) try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch {} }, [messages]);
  useEffect(() => { if (scrollRef.current) { const el = scrollRef.current; if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) el.scrollTop = el.scrollHeight; } }, [messages]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setFull(false); } }; document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h); }, [open]);

  const handleScroll = useCallback(() => { if (!scrollRef.current) return; const el = scrollRef.current; setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 100); }, []);
  const scrollBottom = useCallback(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, []);

  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setMessages((p) => [...p, msg(q, "user")]);
    setInput("");
    setLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const t = setTimeout(() => ctrl.abort(), 30000);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }), signal: ctrl.signal });
      const d: unknown = await r.json();
      const txt = typeof d === "object" && d !== null && "response" in d && typeof (d as Record<string, unknown>).response === "string" ? (d as { response: string }).response : "Unexpected response.";
      setMessages((p) => [...p, msg(txt, "bot")]);
    } catch (e) {
      const abort = e instanceof DOMException && e.name === "AbortError";
      setMessages((p) => [...p, msg(abort ? "Request timed out." : "Connection error.", "bot")]);
    } finally { clearTimeout(t); setLoading(false); }
  }, [input, loading]);

  const panel = full ? "fixed inset-4 sm:inset-8 z-50 flex flex-col rounded-2xl border border-border bg-white shadow-2xl" : "flex w-80 sm:w-96 flex-col rounded-2xl border border-border bg-white shadow-2xl max-h-[80vh]";

  return (
    <>
      {full && open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setFull(false)} />}
      <div className={cn("fixed z-50", full && open ? "inset-0 flex items-center justify-center" : "bottom-5 right-5")}>
        <AnimatePresence>
          {!open && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-110 cursor-pointer"
              aria-label="Open MedInsight AI">
              <Heart className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: full ? 0 : 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: full ? 0 : 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className={panel} role="dialog" aria-label="MedInsight AI">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-white rounded-t-2xl shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Brain className="h-4 w-4" /></div>
                  <div><span className="font-semibold text-sm block leading-tight">MedInsight AI</span><span className="text-[10px] text-blue-200">Healthcare Analytics Agent</span></div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setFull(!full)} className="rounded-lg p-1.5 hover:bg-white/20 cursor-pointer" aria-label={full ? "Exit fullscreen" : "Fullscreen"}>
                    {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button onClick={() => { setOpen(false); setFull(false); }} className="rounded-lg p-1.5 hover:bg-white/20 cursor-pointer" aria-label="Close"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div ref={scrollRef} onScroll={handleScroll} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 min-h-0" role="log" aria-live="polite">
                {messages.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50"><Brain className="h-8 w-8 text-blue-500" /></div>
                    <div><p className="font-semibold text-gray-800">MedInsight AI</p><p className="text-xs text-gray-400 mt-1 max-w-[240px]">Analyze diabetes risk, explore drug recommendations, and query clinical datasets.</p></div>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {SUGGESTIONS.slice(0, full ? 6 : 3).map((s) => (
                        <button key={s} onClick={() => send(s)} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-left">{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={cn("flex flex-col gap-1", m.sender === "user" ? "items-end" : "items-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.sender === "user" ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-br-md" : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-md")}>
                      {m.sender === "bot" ? (
                        <div className="prose prose-sm prose-gray max-w-none prose-headings:text-sm prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                        </div>
                      ) : m.text}
                    </div>
                    {m.sender === "bot" && <CopyBtn text={m.text} />}
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex items-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-gray-50 border border-gray-100 px-4 py-3">
                    <div className="flex gap-1">{[0, 150, 300].map((d) => (<span key={d} className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />))}</div>
                    <span className="text-xs text-gray-400 ml-1">Analyzing...</span>
                  </div></div>
                )}
              </div>

              {showScroll && <div className="absolute bottom-20 left-1/2 -translate-x-1/2"><button onClick={scrollBottom} className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-border shadow-md cursor-pointer" aria-label="Scroll down"><ChevronDown className="h-4 w-4 text-gray-500" /></button></div>}

              <div className="border-t border-border p-3 shrink-0 rounded-b-2xl">
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                  <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about diabetes risk, drug data..." disabled={loading}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 transition-all" aria-label="Chat message" />
                  <Button type="submit" size="sm" className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 px-3" disabled={loading || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
                </form>
                <p className="mt-2 text-center text-[10px] text-gray-300">Powered by Gemini &middot; 968 clinical records</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
