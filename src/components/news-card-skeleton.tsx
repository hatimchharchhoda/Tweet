"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsCardSkeletonProps {
  delay?: number
}

export function NewsCardSkeleton({ delay = 0 }: NewsCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay },
      }}
      className="p-4"
    >
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>

          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[90%]" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          <Skeleton className="h-16 w-full rounded-xl" />

          <div className="flex justify-between pt-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}