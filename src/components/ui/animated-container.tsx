"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up"
}: AnimatedContainerProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants as any}
    >
      {children}
    </motion.div>
  )
}

// スタッガーアニメーション用のコンテナ
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants as any}
    >
      {children}
    </motion.div>
  )
}

// 個別のスタッガーアイテム
export function StaggerItem({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={itemVariants as any}
    >
      {children}
    </motion.div>
  )
}

// ホバーアニメーション
export function HoverScale({
  children,
  className = "",
  scale = 1.05
}: {
  children: ReactNode
  className?: string
  scale?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// フェードイン・アウト
export function FadeInOut({
  children,
  className = "",
  isVisible = true
}: {
  children: ReactNode
  className?: string
  isVisible?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
