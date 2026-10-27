"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { DishCard } from "@/components/menu/dish-card";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/content/dictionaries";
import { MenuCatalog } from "@/domain/menu/menu-catalog";
import type { Locale, MenuCategory } from "@/domain/menu/menu.types";
import { interpolate } from "@/lib/i18n/interpolate";
import { cn } from "@/lib/utils/cn";

interface MenuExplorerProps {
  readonly categories: readonly MenuCategory[];
  readonly locale: Locale;
  readonly copy: Dictionary["menu"];
  readonly common: Dictionary["common"];
}

export function MenuExplorer({ categories, locale, copy, common }: MenuExplorerProps) {
  const catalog = useMemo(() => new MenuCatalog({ categories }), [categories]);
  const [query, setQuery] = useState("");
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? "");
  const deferredQuery = useDeferredValue(query);
  const sectionRefs = useRef(new Map<string, HTMLElement>());

  const results = useMemo(
    () => catalog.search({ query: deferredQuery, recommendedOnly }),
    [catalog, deferredQuery, recommendedOnly],
  );

  const visibleIds = useMemo(() => new Set(results.map((dish) => dish.id)), [results]);

  const groups = useMemo(
    () =>
      catalog.categories
        .map((category) => ({
          category,
          sections: category.sections
            .map((section) => ({
              ...section,
              dishes: section.dishes.filter((dish) => visibleIds.has(dish.id)),
            }))
            .filter((section) => section.dishes.length > 0),
        }))
        .filter((group) => group.sections.length > 0),
    [catalog, visibleIds],
  );

  const dishCount = results.filter((dish) => !dish.isNote).length;
  const filterActive = deferredQuery.trim().length > 0 || recommendedOnly;
  const resultLabel = filterActive
    ? dishCount === 1
      ? copy.resultsOne
      : interpolate(copy.results, { count: dishCount })
    : interpolate(copy.searchStatus, { count: dishCount });

  useEffect(() => {
    const nodes = [...sectionRefs.current.values()];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const target = visible[0]?.target;
        if (target instanceof HTMLElement) {
          setActiveCategory(target.dataset.category ?? "");
        }
      },
      { rootMargin: "-150px 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [groups]);

  const scrollToCategory = (slug: string) => {
    const target = sectionRefs.current.get(slug);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const resetFilters = () => {
    setQuery("");
    setRecommendedOnly(false);
  };

  return (
    <div>
      <div className="sticky top-[calc(var(--header-height)+8px)] z-30 rounded-2xl border border-border/70 bg-[var(--header-bg)] p-3 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchLabel}
              aria-describedby="menu-search-status"
              autoComplete="off"
              className="field-input pl-11 pr-11"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={copy.clearSearch}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-text"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            aria-pressed={recommendedOnly}
            onClick={() => setRecommendedOnly((current) => !current)}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
              recommendedOnly
                ? "border-gold/70 bg-gold/10 text-gold-soft"
                : "border-border/70 text-muted hover:border-gold/40 hover:text-text",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                recommendedOnly ? "bg-gold" : "bg-muted",
              )}
            />
            {copy.recommendedOnly}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <p id="menu-search-status" aria-live="polite" className="text-xs text-muted">
            {resultLabel}
          </p>
          {filterActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-soft transition-colors hover:text-gold"
            >
              {copy.reset}
            </button>
          ) : null}
        </div>

        <nav aria-label={copy.categoriesLabel} className="no-scrollbar -mx-1 mt-2 overflow-x-auto">
          <ul className="flex gap-2 px-1 pb-1">
            {catalog.categories.map((category) => {
              const active = activeCategory === category.slug;
              return (
                <li key={category.slug}>
                  <button
                    type="button"
                    onClick={() => scrollToCategory(category.slug)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors sm:text-[11px]",
                      active
                        ? "border-gold/70 bg-gold/10 text-gold-soft"
                        : "border-border/60 text-muted hover:border-gold/40 hover:text-text",
                    )}
                  >
                    {category.name[locale]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {groups.length === 0 ? (
        <div className="card-soft mt-10 flex flex-col items-center px-6 py-16 text-center">
          <SearchIcon className="h-8 w-8 text-gold" />
          <h2 className="display-3 mt-4">{copy.noResults}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {copy.noResultsHint}
          </p>
          <button type="button" onClick={resetFilters} className="btn btn-secondary mt-6">
            {copy.reset}
          </button>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {groups.map(({ category, sections }, index) => (
            <section
              key={category.id}
              id={`category-${category.slug}`}
              data-category={category.slug}
              aria-labelledby={`category-title-${category.slug}`}
              ref={(node) => {
                if (node) sectionRefs.current.set(category.slug, node);
                else sectionRefs.current.delete(category.slug);
              }}
              className="scroll-mt-[calc(var(--header-height)+190px)]"
            >
              <header className="border-t border-border/60 pt-8">
                <p className="eyebrow">
                  {String(index + 1).padStart(2, "0")} · {category.name[locale]}
                </p>
                <h2 id={`category-title-${category.slug}`} className="display-2 mt-3">
                  {category.name[locale]}
                </h2>
                <p className="lead mt-3">{category.tagline[locale]}</p>
              </header>

              <div className="mt-8 space-y-8">
                {sections.map((section) => (
                  <div key={section.id}>
                    {section.showHeading ? (
                      <h3 className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                        {section.name[locale]}
                      </h3>
                    ) : null}
                    <div className="grid gap-x-10 lg:grid-cols-2">
                      {section.dishes.map((dish) => (
                        <DishCard
                          key={dish.id}
                          dish={dish}
                          locale={locale}
                          labels={{ recommended: common.recommended, note: common.note }}
                          variant="list"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-14 border-t border-border/60 pt-6 text-xs text-muted">
        {copy.priceNote}
      </p>
    </div>
  );
}
