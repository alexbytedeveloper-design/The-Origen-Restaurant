import { cn } from "@/lib/utils/cn";

interface OrnamentProps {
  readonly className?: string;
}

/**
 * A drawn filigree rule. It carries the arch of the wordmark into the page
 * without repeating the logo, and it stays crisp at every size.
 */
export function OrnamentDivider({ className }: OrnamentProps) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-gold/45" />
      <svg viewBox="0 0 64 18" className="h-4 w-16 text-gold/75" fill="none">
        <path d="M2 9h18" stroke="currentColor" strokeWidth="0.8" />
        <path d="M22 9c4-6 8-6 10 0-2 6-6 6-10 0Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M32 9c2-4 4-4 6 0-2 4-4 4-6 0Z" fill="currentColor" fillOpacity="0.35" />
        <path d="M38 9c2-6 6-6 10 0-4 6-8 6-10 0Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M44 9h18" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/45 to-gold/45" />
    </div>
  );
}

/** Four hairline brass corners, laid over a leather or paper panel. */
export function BrassCorners() {
  return (
    <>
      <span aria-hidden className="corner-mark corner-mark-tl" />
      <span aria-hidden className="corner-mark corner-mark-tr" />
      <span aria-hidden className="corner-mark corner-mark-bl" />
      <span aria-hidden className="corner-mark corner-mark-br" />
    </>
  );
}

/** A compact diamond, used between micro-labels and in the press band. */
export function DiamondMark({ className }: OrnamentProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-1.5 w-1.5 rotate-45 bg-current", className)}
    />
  );
}

/** The logo's arch, drawn large and quiet as a section watermark. */
export function ArchWatermark({ className }: OrnamentProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 260"
      className={cn("pointer-events-none text-gold/20", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    >
      <path d="M12 250V92a88 88 0 0 1 176 0v158" />
      <path d="M28 250V94a72 72 0 0 1 144 0v156" strokeOpacity="0.55" />
      <path d="M100 34v216" strokeOpacity="0.28" strokeDasharray="1 9" />
    </svg>
  );
}

interface SectionNumberProps {
  readonly value: string;
  readonly className?: string;
}

/** A roman-feeling folio number, set in the display face as a marginal note. */
export function SectionNumber({ value, className }: SectionNumberProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-display text-[2.6rem] leading-none text-gold/55 tabular-nums",
        className,
      )}
    >
      {value}
    </span>
  );
}
