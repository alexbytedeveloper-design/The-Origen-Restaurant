import { RESTAURANT } from "@/content/restaurant";
import type { Locale } from "@/domain/menu/menu.types";
import { cn } from "@/lib/utils/cn";

interface BrandWordmarkProps {
  readonly locale: Locale;
  readonly size?: "sm" | "lg";
}

export function BrandWordmark({ locale, size = "sm" }: BrandWordmarkProps) {
  const isLarge = size === "lg";

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center",
          isLarge ? "h-16 w-12" : "h-10 w-8",
        )}
      >
        <svg
          viewBox="0 0 40 52"
          aria-hidden
          focusable="false"
          className="absolute inset-0 h-full w-full text-gold/80"
          fill="none"
          stroke="currentColor"
        >
          <path d="M5 50V22a15 15 0 0 1 30 0v28" strokeWidth="1.15" />
          <path
            d="M10 50V22.5a10 10 0 0 1 20 0V50"
            strokeWidth="0.7"
            strokeOpacity="0.55"
          />
          <path d="M20 7v2.5" strokeWidth="0.9" strokeOpacity="0.7" />
        </svg>
        <span
          aria-hidden
          className={cn(
            "relative font-display leading-none text-gold-soft",
            isLarge ? "mt-3 text-3xl" : "mt-2 text-xl",
          )}
        >
          O
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display italic leading-none text-gold-soft",
            isLarge ? "text-[2rem]" : "text-[15px]",
          )}
        >
          The
        </span>
        <span
          className={cn(
            "font-sans font-semibold uppercase text-text",
            isLarge
              ? "mt-1.5 text-[1.35rem] tracking-[0.4em]"
              : "mt-1 text-[11px] tracking-[0.34em]",
          )}
        >
          Origen
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 uppercase text-muted",
            isLarge
              ? "mt-3 text-[8px] tracking-[0.3em]"
              : "mt-1.5 text-[6px] tracking-[0.26em]",
          )}
        >
          <span aria-hidden className="h-px w-3 bg-gold/50" />
          {RESTAURANT.city} · {RESTAURANT.established}
        </span>
        <span className="sr-only">{`${RESTAURANT.name}, ${locale === "es" ? "La Habana" : "Havana"}`}</span>
      </span>
    </span>
  );
}
