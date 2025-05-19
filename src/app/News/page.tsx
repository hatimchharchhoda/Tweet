"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { ArrowUpRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import { NewsCardSkeleton } from "@/components/news-card-skeleton"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedBackground from "@/components/AnimatedBackground"
import NewsChatBot from "@/components/NewsChatBot"

interface NewsArticle {
  title: string
  description: string
  url?: string
  publishedAt?: string
  source?: { name: string }
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const response = await axios.get("/api/latest_news")

      // Add a small delay to make the refresh animation more noticeable
      if (showRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 600))
      }

      setNews(response.data || [])

      if (showRefreshing) {
        toast({
          title: "Feed updated",
          description: "Your news feed has been refreshed with the latest stories",
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching news:", error)
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to load news articles.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleRefresh = () => {
    fetchNews(true)
  }

  return (
    <div className="relative w-full h-screen">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen ">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-gradient-to-r from-sky-300/70 via-indigo-300/70 to-purple-300/70">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary ">
              <span className="text-2xl mr-1">📰</span> NewsFlow
            </h1>
            <Button
              variant="ghost"
              size="icon" 
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="relative"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              {news.length > 0 && !loading && !refreshing && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"
                />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-4"
              >
                {[...Array(5)].map((_, i) => (
                  <NewsCardSkeleton key={i} delay={i * 0.1} />
                ))}
              </motion.div>
            ) : news.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-center items-center h-60 p-4"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No news available</h3>
                <p className="text-muted-foreground text-center mt-2">Check back later for the latest updates</p>
                <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                  Refresh
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-slate-200 dark:divide-slate-800"
              >
                {news.map((item, idx) => (
                  <NewsCard key={idx} article={item} index={idx} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <NewsChatBot/>
      </div>
    </div>
  )
}