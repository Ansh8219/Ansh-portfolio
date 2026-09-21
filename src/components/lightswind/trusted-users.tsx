import React from "react";
import { cn } from "../lib/utils";
import { CountUp } from "./count-up";

interface TrustedUsersProps {
  avatars: string[];
  totalUsersText?: number;
  caption?: string;
  label?: string;
  className?: string;
}

export const TrustedUsers: React.FC<TrustedUsersProps> = ({
  avatars,
  totalUsersText = 250,
  caption = "Trusted by",
  label = "clients",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "hero-trust flex items-center gap-3.5 sm:gap-4",
        className,
      )}
    >
      <div className="flex shrink-0 -space-x-2.5" aria-hidden="true">
        {avatars.map((src, i) => (
          <div
            key={i}
            className="relative h-9 w-9 overflow-hidden rounded-full border border-[#ff6b00]/45 shadow-[0_0_0_2px_var(--bg-primary)] sm:h-10 sm:w-10"
            style={{ zIndex: avatars.length - i }}
          >
            <img
              src={src}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="low"
            />
          </div>
        ))}
      </div>

      <p className="m-0 text-[0.9375rem] font-medium leading-snug text-[var(--text-secondary)]">
        <span>{caption} </span>
        <CountUp
          value={totalUsersText}
          duration={2}
          separator=","
          triggerOnView={false}
          className="hero-trust-count inline-flex !text-[1.05em] !font-semibold leading-none"
          numberClassName="hero-trust-count"
          suffix=""
          colorScheme="custom"
          customColor="#ff6b00"
        />
        <span className="hero-trust-count">+</span>
        <span> {label}</span>
      </p>
    </div>
  );
};
