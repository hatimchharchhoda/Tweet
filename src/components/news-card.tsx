"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, MessageSquare, Heart, Repeat2, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"

interface NewsArticle {
  title: string
  description: string
  url?: string
  publishedAt?: string
  source?: { name: string }
}

interface NewsCardProps {
  article: NewsArticle
  index: number
}

export function NewsCard({ article, index }: NewsCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const getDomain = (url?: string) => {
    if (!url) return null
    try {
      const domain = new URL(url).hostname.replace("www.", "")
      return domain.split(".")[0]
    } catch {
      return null
    }
  }

  const domain = getDomain(article.url)
  const sourceName = article.source?.name || domain || "Unknown Source"
  const sourceInitial = sourceName.charAt(0).toUpperCase()

  // Generate a random number of interactions
  const interactions = {
    comments: Math.floor(Math.random() * 50),
    reposts: Math.floor(Math.random() * 100),
    likes: Math.floor(Math.random() * 500) + (liked ? 1 : 0),
  }

  // Format the published date if available
  const formattedDate = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
         opacity: 1,
         y: 0,
         transition: { delay: index * 0.05 },
      }}
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl bg-gradient-to-br from-sky-200/70 via-indigo-200/70 to-purple-200/70 hover:from-sky-300/70 hover:via-indigo-300/70 hover:to-purple-300/70 transition-all duration-300 text-black"
      >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold"
          >
            {sourceInitial}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold truncate">{sourceName}</span>
            {formattedDate && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">{formattedDate}</span>
              </>
            )}
          </div>

          <h2 className="text-lg font-bold mb-2 leading-tight">{article.title}</h2>

          <p className="text-muted-foreground mb-3 line-clamp-3">{article.description}</p>

          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block mb-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Read full article</p>
                  <p className="text-xs text-muted-foreground truncate">{article.url}</p>
                </div>
              </motion.div>
            </a>
          )}

          <div className="flex justify-between text-muted-foreground mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{interactions.comments}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Repeat2 className="h-4 w-4" />
                    <span className="text-xs">{interactions.reposts}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Repost</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 ${liked ? "text-red-500" : ""}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                    <span className="text-xs">{interactions.likes}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBookmarked(!bookmarked)}
                    className={bookmarked ? "text-primary" : ""}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  )
}