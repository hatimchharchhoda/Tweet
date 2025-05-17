"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

interface NewsArticle {
  title: string;
  description: string;
  url?: string;
  publishedAt?: string;
  source?: { name: string };
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/latest_news");
      setNews(response.data || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load news articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const renderNewsItem = (news: NewsArticle, idx: number) => {
    const getDomain = (url?: string) => {
      if (!url) return null;
      try {
        const domain = new URL(url).hostname.replace("www.", "");
        return domain.split(".")[0];
      } catch {
        return null;
      }
    };

    const domain = getDomain(news.url);
    const sourceName = news.source?.name || domain || "Unknown Source";

    return (
      <div
        key={idx}
        className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border hover:shadow-md transition-shadow flex gap-4"
      >
        <div className="flex flex-col items-center w-16 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold shrink-0">
            {domain ? domain.charAt(0).toUpperCase() : "N"}
          </div>
          <span
            className="text-xs mt-1 text-muted-foreground text-center w-full truncate px-1"
            title={sourceName}
          >
            {sourceName}
          </span>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1">
            <h2 className="text-lg font-bold line-clamp-2">{news.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {news.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            {news.url && (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full"
              >
                <span className="hidden sm:inline">Read on</span> {sourceName}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full relative">
      <AnimatedBackground />
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <h1 className="text-2xl font-bold mb-4 text-center text-primary">
            Latest News
          </h1>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-60">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-primary font-medium">Loading...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="flex justify-center items-center h-60 text-muted-foreground">
              No news available.
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item, idx) => renderNewsItem(item, idx))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}