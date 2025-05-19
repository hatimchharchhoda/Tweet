"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios"; // ✅ Needed for API call
import { toast } from "@/hooks/use-toast"; // Optional: for error handling UI

export default function NewsChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! Ask me anything about today's news or headlines!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/ai-chat", {
        message: input,
        messageType: "news", // You can modify based on context
      });

      const botMessage = {
        role: "ai",
        content: res.data.message || "Sorry, I couldn't find any news right now.",
      };

      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast?.({
        title: "Error",
        description: "Failed to get response from AI.",
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Oops! Something went wrong. Try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="rounded-full px-4 py-2 gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-4 h-4" />
          Ask News
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 90 }}
            className="fixed right-0 top-[4rem] h-[calc(100vh-4rem)] w-full sm:w-[24rem] bg-white shadow-2xl z-[100] flex flex-col border-l rounded-l-xl"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-tl-xl">
              <h2 className="text-lg font-semibold">🧠 News Assistant</h2>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-slate-300" />
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-100 text-right ml-auto max-w-[80%]"
                      : "bg-gray-100 text-left mr-auto max-w-[80%]"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 text-gray-500 p-2 rounded-md text-sm w-fit">
                  Typing...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t flex items-center gap-2"
            >
              <Input
                placeholder="Ask about headlines..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                <SendHorizonal className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}