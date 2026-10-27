"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import type { MediaAsset } from "@/content/media";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/domain/menu/menu.types";

interface GalleryGridProps {
  readonly assets: readonly MediaAsset[];
  readonly locale: Locale;
  readonly copy: Dictionary["gallery"];
}

type CaptionKey = keyof Dictionary["gallery"]["captions"];

export function GalleryGrid({ assets, locale, copy }: GalleryGridProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<MediaAsset | null>(null);

  const captionFor = (asset: MediaAsset): string => {
    const key = asset.id.replace("gallery-", "") as CaptionKey;
    return copy.captions[key] ?? asset.alt[locale];
  };

  const openImage = (asset: MediaAsset) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setActive(asset);
    dialog.showModal();
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    dialogRef.current?.close();
  };

  const restoreScroll = () => {
    document.body.style.overflow = "";
  };

  return (
    <>
      <p className="mb-6 text-xs uppercase tracking-[0.16em] text-muted">{copy.hint}</p>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {assets.map((asset) => {
          const caption = captionFor(asset);
          return (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => openImage(asset)}
                aria-label={caption}
                className="group relative block w-full overflow-hidden rounded-xl border border-border/60 bg-surface text-left"
              >
                <span className="block aspect-[4/5] w-full">
                  <Image
                    src={asset.src}
                    alt=""
                    width={asset.width}
                    height={asset.height}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-10 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-[11px]"
                >
                  {caption}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={active ? captionFor(active) : copy.title}
        onClose={restoreScroll}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeImage();
        }}
        className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-bg p-0 text-text open:block"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
              {active ? captionFor(active) : null}
            </p>
            <button
              type="button"
              onClick={closeImage}
              aria-label={copy.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-text transition-colors hover:border-gold/60 hover:text-gold-soft"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden px-3 pb-6 sm:px-6">
            {active ? (
              <Image
                src={active.src}
                alt={active.alt[locale]}
                width={active.width}
                height={active.height}
                sizes="100vw"
                className="h-auto max-h-[78dvh] w-auto max-w-full rounded-lg object-contain"
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
