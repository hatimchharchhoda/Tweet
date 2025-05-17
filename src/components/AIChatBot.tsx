// components/AIChatBot.tsx
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
  Globe
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
  
  // Changed from useState to just a constant since we don't modify it
  const suggestedTopics = [
    { label: "Latest News", icon: <Newspaper size={16} />, type: "news" as const },
    { label: "What's Trending", icon: <TrendingUp size={16} />, type: "trending" as const },
    { label: "Global Updates", icon: <Globe size={16} />, type: "world" as const },
    { label: "Help me with...", icon: <MessageSquare size={16} />, type: "general" as const },
  ];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat is opened for the first time
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hello! I'm your AI assistant. I can help you with the latest news, trending topics, or answer any questions you might have. What would you like to know today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom whenever messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (content: string, type?: "news" | "trending" | "general" | "world") => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to AI API
      const response = await axios.post("/api/ai-chat", {
        message: content,
        messageType: type || "general"
      });

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        sender: "bot",
        timestamp: new Date(),
        type
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant",
        variant: "destructive",
      });
      
      // Add error bot message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestedTopic = (topic: string, type: "news" | "trending" | "general" | "world") => {
    handleSendMessage(topic, type);
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 rounded-full p-3 shadow-lg ${className}`}
        variant="default"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-primary text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} className="text-white" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "user" ? (
                        <User size={14} className="text-white/80" />
                      ) : (
                        <Bot size={14} className="text-primary/80" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.type && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                          {message.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <Bot size={14} className="text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested topics */}
            {messages.length < 3 && (
              <div className="px-3 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedTopic(topic.label, topic.type)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center gap-1 transition-colors"
                    >
                      {topic.icon}
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
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