"use client";

import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "../lib/utils";

const SLOT_HEIGHT = "2.75em";

export interface LoopingWordsProps {
  words: string[];
  className?: string;
  textClassName?: string;
  accentActive?: boolean;
  intervalMs?: number;
  /** Extra horizontal space (px) on each side of the word slot */
  slotPaddingX?: number;
  /** Extra horizontal space (px) on each side of the bracket selector */
  selectorPaddingX?: number;
}

export function LoopingWords({
  words,
  className,
  textClassName = "text-[11vw] md:text-[6vw]",
  accentActive = true,
  intervalMs = 2400,
  slotPaddingX = 0,
  selectorPaddingX = 16,
}: LoopingWordsProps) {
  const controls = useAnimationControls();
  const wordsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [selectorWidth, setSelectorWidth] = useState(0);
  const [slotWidth, setSlotWidth] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const duplicatedWords = [...words, ...words];
  const totalOriginal = words.length;

  const measureSlots = useCallback(() => {
    let max = 0;
    for (let i = 0; i < totalOriginal; i++) {
      const el = wordsRef.current[i];
      const textEl = el?.querySelector("p");
      if (textEl) {
        max = Math.max(max, textEl.getBoundingClientRect().width);
      }
    }
    if (max > 0) {
      setSlotWidth(Math.ceil(max) + slotPaddingX * 2);
    }
  }, [totalOriginal, slotPaddingX]);

  const updateWidth = useCallback(
    (slotIndex: number) => {
      const el = wordsRef.current[slotIndex];
      const textEl = el?.querySelector("p");
      if (textEl) {
        setSelectorWidth(Math.ceil(textEl.getBoundingClientRect().width) + selectorPaddingX * 2);
      }
      setActiveIndex(slotIndex % totalOriginal);
    },
    [totalOriginal, selectorPaddingX],
  );

  useLayoutEffect(() => {
    const run = () => {
      measureSlots();
      updateWidth(0);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }
  }, [measureSlots, updateWidth, words, textClassName]);

  useEffect(() => {
    const onResize = () => {
      measureSlots();
      updateWidth(activeIndex);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureSlots, updateWidth, activeIndex]);

  useEffect(() => {
    if (totalOriginal === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      updateWidth(0);
      return;
    }

    let index = 0;
    const interval = setInterval(async () => {
      index++;
      updateWidth(index % totalOriginal);

      await controls.start({
        y: `-${(index * 100) / duplicatedWords.length}%`,
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
      });

      if (index === totalOriginal) {
        index = 0;
        controls.set({ y: "0%" });
        updateWidth(0);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [controls, totalOriginal, duplicatedWords.length, intervalMs, updateWidth]);

  if (totalOriginal === 0) return null;

  return (
    <div className={cn("mx-auto flex w-full justify-center", className)}>
      <div
        className={cn(
          "relative overflow-hidden text-center font-bold uppercase leading-[0.88]",
          textClassName,
        )}
        style={{
          height: SLOT_HEIGHT,
          width: slotWidth != null ? slotWidth : "max-content",
          minWidth: slotWidth != null ? slotWidth : "12ch",
        }}
      >
        <motion.ul
          className="m-0 flex w-full list-none flex-col p-0"
          animate={controls}
          initial={{ y: "0%" }}
        >
          {duplicatedWords.map((word, i) => {
            const wordIndex = i % totalOriginal;
            const isActive = accentActive && wordIndex === activeIndex;

            return (
              <li
                key={i}
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="flex w-full shrink-0 items-center justify-center"
                style={{ height: SLOT_HEIGHT }}
              >
                <p
                  className={cn(
                    "m-0 inline-block whitespace-nowrap tracking-[-0.03em] transition-colors duration-500",
                    isActive ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]",
                  )}
                >
                  {word}
                </p>
              </li>
            );
          })}
        </motion.ul>

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--bg-primary) 0%, transparent 38%, transparent 62%, var(--bg-primary) 100%)",
          }}
        />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[0.92em] -translate-x-1/2 -translate-y-1/2"
          animate={{ width: selectorWidth || "auto" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              boxShadow: "0 0 32px rgba(255, 107, 0, 0.22), inset 0 0 20px rgba(255, 107, 0, 0.04)",
            }}
          />
          <div className="absolute top-0 left-0 h-[0.14em] w-[0.14em] border-l-[0.04em] border-t-[0.04em] border-[var(--text-accent)]" />
          <div className="absolute top-0 right-0 h-[0.14em] w-[0.14em] border-r-[0.04em] border-t-[0.04em] border-[var(--text-accent)]" />
          <div className="absolute bottom-0 left-0 h-[0.14em] w-[0.14em] border-b-[0.04em] border-l-[0.04em] border-[var(--text-accent)]" />
          <div className="absolute bottom-0 right-0 h-[0.14em] w-[0.14em] border-b-[0.04em] border-r-[0.04em] border-[var(--text-accent)]" />
        </motion.div>
      </div>
    </div>
  );
}
