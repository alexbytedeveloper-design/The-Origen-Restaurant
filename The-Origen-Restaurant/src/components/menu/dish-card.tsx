import Image from "next/image";
import { Money } from "@/domain/menu/money";
import type { Dish, Locale } from "@/domain/menu/menu.types";
import { cn } from "@/lib/utils/cn";

interface DishCardProps {
  readonly dish: Dish;
  readonly locale: Locale;
  readonly labels: {
    readonly recommended: string;
    readonly note: string;
  };
  readonly variant?: "grid" | "list";
  readonly priority?: boolean;
}

export function DishCard({
  dish,
  locale,
  labels,
  variant = "grid",
  priority = false,
}: DishCardProps) {
  const price = dish.price !== null ? Money.fromAmount(dish.price).format() : null;

  if (dish.isNote) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-surface/40 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          {labels.note}
        </p>
        <p className="mt-1 font-display text-lg">{dish.name[locale]}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {dish.description[locale]}
        </p>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <article className="group flex gap-4 border-b border-border/50 py-5 last:border-0">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface sm:h-[104px] sm:w-[104px]">
          {dish.image && dish.imageAlt ? (
            <Image
              src={dish.image}
              alt={dish.imageAlt[locale]}
              width={208}
              height={208}
              sizes="(max-width: 640px) 88px, 104px"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-snug sm:text-[1.35rem]">
              {dish.name[locale]}
            </h3>
            {price ? (
              <span className="shrink-0 whitespace-nowrap font-sans text-[13px] font-semibold text-gold-soft sm:text-sm">
                {price}
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted sm:text-sm">
            {dish.description[locale]}
          </p>
          {dish.isRecommended ? (
            <span className="tag tag-dot mt-2">{labels.recommended}</span>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="group card-soft flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        {dish.image && dish.imageAlt ? (
          <Image
            src={dish.image}
            alt={dish.imageAlt[locale]}
            width={800}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70"
        />
        {dish.isRecommended ? (
          <span className="tag tag-dot absolute left-3 top-3 bg-bg/65 backdrop-blur">
            {labels.recommended}
          </span>
        ) : null}
      </div>
      <div className={cn("flex flex-1 flex-col p-5")}>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.55rem] leading-tight">{dish.name[locale]}</h3>
          {price ? (
            <span className="shrink-0 whitespace-nowrap font-sans text-sm font-semibold text-gold-soft">
              {price}
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {dish.description[locale]}
        </p>
      </div>
    </article>
  );
}
