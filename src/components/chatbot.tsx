"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    const userMsg: Message = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!apiUrl) {
      setMessages((prev) => [
        ...prev,
        { text: "The AI assistant is not connected yet. Configure the chat API endpoint to enable this feature.", sender: "bot" },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-110 cursor-pointer"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex w-80 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:w-96"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold text-sm">Wildlife AI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/20 cursor-pointer" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex h-72 flex-col gap-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-muted px-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                    <Sparkles className="h-7 w-7 text-green-500" />
                  </div>
                  <p className="font-medium text-gray-700">How can I help?</p>
                  <p className="text-xs text-gray-400">Ask about wildlife laws, NGOs, or sanctuaries in India.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
                >
                  <span
                    className={cn(
                      "inline-block max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md",
                    )}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2 text-sm text-muted">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about wildlife NGOs..."
                  disabled={loading}
                />
                <Button type="submit" size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
