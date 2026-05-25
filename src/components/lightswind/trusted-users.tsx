import React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/utils";
import { CountUp } from "./count-up";

interface TrustedUsersProps {
  avatars: string[];
  rating?: number;
  totalUsersText?: number;
  caption?: string;
  className?: string;
  starColorClass?: string;
  ringColors?: string[];
  linkHref?: string;
  linkLabel?: string;
}

export const TrustedUsers: React.FC<TrustedUsersProps> = ({
  avatars,
  rating = 5,
  totalUsersText = 1000, // ✅ default as number
  caption = "Trusted by",
  className = "",
  starColorClass = "text-yellow-400",
  ringColors = [],
  linkHref = "/pricing",
  linkLabel = "Pro users",
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-4 bg-transparent py-2 text-foreground sm:justify-center sm:gap-6 sm:py-4',
        className,
      )}
    >
      <div className="flex -space-x-4">
        {avatars.map((src, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full overflow-hidden ring-1 ring-offset-2 ring-offset-[var(--bg-primary)] ${
              ringColors[i] || "ring-blue-900"
            }`}
          >
            <img
              src={src}
              alt={`Avatar ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy" // Add lazy loading
              decoding="async" // Suggest asynchronous decoding
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-1">
        <div className={`flex gap-1 ${starColorClass}`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} fill="currentColor" className="w-4 h-4" aria-hidden="true" />
          ))}
        </div>
        <div className="text-foreground text-xs md:text-sm font-medium flex items-center flex-wrap">
          {caption}
          <CountUp
            value={totalUsersText}
            duration={2}
            separator=","
            className="ml-1 text-lg"
            suffix="+"
            colorScheme="gradient"
          />
          {linkHref && linkLabel ? (
            <a className="underline text-[var(--text-accent)] ml-1" href={linkHref}>
              {linkLabel}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
