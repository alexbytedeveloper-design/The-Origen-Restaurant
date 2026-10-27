import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly cta?: {
    readonly href: string;
    readonly label: string;
  };
  readonly align?: "left" | "center";
  readonly headingId?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  cta,
  align = "left",
  headingId,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-6",
        align === "center" && "flex-col items-center text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={headingId} className="display-2 mt-4">
          {title}
        </h2>
        {lead ? <p className="lead mt-4">{lead}</p> : null}
      </div>
      {cta ? (
        <Link href={cta.href} className="link-arrow shrink-0">
          {cta.label}
          <ArrowRightIcon />
        </Link>
      ) : null}
    </div>
  );
}
