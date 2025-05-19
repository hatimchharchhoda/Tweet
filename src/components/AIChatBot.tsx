// Enhanced AIChatBot.tsx UI/UX Version
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Bot,
  User,
  X,
  Send,
  MessageSquare,
  TrendingUp,
  Newspaper,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "news" | "trending" | "general" | "world";
}

interface AIChatBotProps {
  className?: string;
}

export function AIChatBot({ className }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedTopics = [
    { label: "Latest News", icon: <Newspaper size={16} />, type: "news" },
    { label: "What's Trending", icon: <TrendingUp size={16} />, type: "trending" },
    { label: "Global Updates", icon: <Globe size={16} />, type: "world" },
    { label: "Help me with...", icon: <MessageSquare size={16} />, type: "general" },
  ] satisfies { label: string; icon: React.ReactNode; type: "news" | "trending" | "general" | "world" }[];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content:
          "👋 Hello! I'm your AI assistant. Ask me about the latest news, global updates, or trending topics!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (
    content: string,
    type?: "news" | "trending" | "general" | "world"
  ) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/ai-chat", {
        message: content,
        messageType: type || "general",
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        sender: "bot",
        timestamp: new Date(),
        type,
      };

      setMessages((prev) => [...prev, botMessage]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "⚠️ Oops! Something went wrong. Try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestedTopic = (
    topic: string,
    type: "news" | "trending" | "general" | "world"
  ) => {
    handleSendMessage(topic, type);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 rounded-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-all ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[22rem] sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="text-md font-semibold">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 text-white"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[75%] text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs opacity-70 mb-1">
                      {msg.sender === "user" ? <User size={12} /> : <Bot size={12} />}
                      <span>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.type && <span className="ml-auto uppercase">{msg.type}</span>}
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Bot size={12} className="text-blue-500" />
                      <span className="animate-pulse text-gray-500">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length < 3 && (
              <div className="bg-white px-4 py-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedTopic(t.label, t.type)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition"
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-3 border-t border-gray-200 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send size={18} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}