"use client";

import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { CINEMATIC_EASE, MOTION_DURATION } from "../../motion/cinematic";

const SLOT_HEIGHT_EM = 2.75;

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
  const wordsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [selectorWidth, setSelectorWidth] = useState(0);
  const [slotWidth, setSlotWidth] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const totalOriginal = words.length;
  // Duplicate once so the last → first transition can scroll seamlessly, then snap.
  const duplicatedWords = totalOriginal > 0 ? [...words, words[0]] : [];

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

  const updateSelector = useCallback(
    (wordIndex: number) => {
      const el = wordsRef.current[wordIndex];
      const textEl = el?.querySelector("p");
      if (textEl) {
        setSelectorWidth(Math.ceil(textEl.getBoundingClientRect().width) + selectorPaddingX * 2);
      }
    },
    [selectorPaddingX],
  );

  useLayoutEffect(() => {
    const run = () => {
      measureSlots();
      updateSelector(0);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }
  }, [measureSlots, updateSelector, words, textClassName]);

  useEffect(() => {
    const onResize = () => {
      measureSlots();
      updateSelector(activeIndex);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureSlots, updateSelector, activeIndex]);

  useEffect(() => {
    if (totalOriginal === 0 || prefersReducedMotion) {
      setOffsetIndex(0);
      setActiveIndex(0);
      updateSelector(0);
      return;
    }

    const id = window.setInterval(() => {
      setOffsetIndex((prev) => {
        const next = prev + 1;
        const wordIndex = next % totalOriginal;
        setActiveIndex(wordIndex);
        updateSelector(wordIndex);
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [totalOriginal, prefersReducedMotion, intervalMs, updateSelector]);

  // After scrolling onto the duplicated first word, snap back to the real first item.
  useEffect(() => {
    if (offsetIndex < totalOriginal || totalOriginal === 0) return;

    const timeout = window.setTimeout(() => {
      setIsJumping(true);
      setOffsetIndex(0);
      setActiveIndex(0);
      updateSelector(0);
      // Allow the next paint with transition disabled, then re-enable.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsJumping(false));
      });
    }, MOTION_DURATION * 1000 + 40);

    return () => window.clearTimeout(timeout);
  }, [offsetIndex, totalOriginal, updateSelector]);

  if (totalOriginal === 0) return null;

  return (
    <div className={cn("mx-auto flex w-full max-w-full min-w-0 justify-center", className)}>
      <div
        className={cn(
          "relative max-w-full overflow-hidden text-center font-bold uppercase leading-[0.88]",
          textClassName,
        )}
        style={{
          height: `${SLOT_HEIGHT_EM}em`,
          width: slotWidth != null ? `min(${slotWidth}px, 100%)` : "max-content",
          minWidth: slotWidth != null ? `min(${slotWidth}px, 12ch)` : "12ch",
          maxWidth: "100%",
        }}
      >
        <motion.ul
          className="m-0 flex w-full list-none flex-col p-0"
          animate={{ y: `${-offsetIndex * SLOT_HEIGHT_EM}em` }}
          transition={
            isJumping || prefersReducedMotion
              ? { duration: 0 }
              : { duration: MOTION_DURATION, ease: CINEMATIC_EASE }
          }
        >
          {duplicatedWords.map((word, i) => {
            const wordIndex = i % totalOriginal;
            const isActive = accentActive && wordIndex === activeIndex && i === offsetIndex;

            return (
              <li
                key={`${word}-${i}`}
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="flex w-full shrink-0 items-center justify-center"
                style={{ height: `${SLOT_HEIGHT_EM}em` }}
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
          transition={{ duration: MOTION_DURATION, ease: CINEMATIC_EASE }}
        >
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              boxShadow: "0 0 24px rgba(255, 107, 0, 0.18), inset 0 0 16px rgba(255, 107, 0, 0.03)",
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
