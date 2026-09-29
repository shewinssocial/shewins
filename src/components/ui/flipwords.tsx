"use client";
import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words = [],
  duration = 2500,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);

  // Serialize words content to prevent interval resets when parent re-renders
  const wordsKey = useMemo(() => (Array.isArray(words) ? words.join('|') : ''), [words]);

  useEffect(() => {
    if (!words || words.length <= 1) return;

    // Continuous interval for infinite, unbreakable flipping
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [wordsKey, duration, words?.length]);

  if (!words || words.length === 0) return null;

  const currentWord = words[index % words.length] || words[0] || "";

  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${currentWord}-${index}`}
          initial={{
            opacity: 0,
            y: 12,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 16,
            mass: 0.8,
          }}
          exit={{
            opacity: 0,
            y: -36,
            x: 24,
            filter: "blur(8px)",
            scale: 1.35,
            position: "absolute",
            top: 0,
            left: 0,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.35,
            },
          }}
          className={cn(
            "z-10 inline-block text-left whitespace-nowrap",
            className
          )}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <span
              key={word + wordIndex}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={word + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.2 + letterIndex * 0.04,
                    duration: 0.25,
                    type: "spring",
                    stiffness: 150,
                    damping: 14,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              {wordIndex < currentWord.split(" ").length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
