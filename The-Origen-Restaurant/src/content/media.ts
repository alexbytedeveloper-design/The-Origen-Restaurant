import type { LocalizedText } from "@/domain/menu/menu.types";

export interface MediaAsset {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: LocalizedText;
  readonly owner: string;
  readonly dueDate: string;
  readonly status: "placeholder" | "received" | "optimized" | "live";
}

const placeholder = (
  id: string,
  src: string,
  width: number,
  height: number,
  es: string,
  en: string,
): MediaAsset => ({
  id,
  src,
  width,
  height,
  alt: { es, en },
  owner: "The Origen",
  dueDate: "2026-11-19",
  status: "placeholder",
});

export const HERO_MEDIA = placeholder(
  "hero-signature",
  "/images/hero-signature.webp",
  1400,
  1050,
  "Composición editorial del plato insignia de The Origen",
  "Editorial composition of The Origen's signature dish",
);

export const STORY_MEDIA = placeholder(
  "story-room",
  "/images/story-room.webp",
  1200,
  900,
  "Composición editorial del salón de The Origen",
  "Editorial composition of The Origen dining room",
);

export const GALLERY_MEDIA: readonly MediaAsset[] = [
  placeholder("gallery-room", "/images/gallery-01.webp", 1200, 900, "El salón", "The dining room"),
  placeholder("gallery-bar", "/images/gallery-02.webp", 900, 1200, "La barra", "The bar"),
  placeholder("gallery-cocktail", "/images/gallery-03.webp", 1200, 900, "Coctelería de autor", "Signature cocktails"),
  placeholder("gallery-fire", "/images/gallery-04.webp", 900, 1200, "Cortes a la piedra", "Stone-grilled cuts"),
  placeholder("gallery-dessert", "/images/gallery-05.webp", 1200, 900, "Postres de la casa", "House desserts"),
  placeholder("gallery-terrace", "/images/gallery-06.webp", 1200, 900, "La terraza", "The terrace"),
  placeholder("gallery-table", "/images/gallery-07.webp", 900, 1200, "Mesa para dos", "Table for two"),
  placeholder("gallery-coffee", "/images/gallery-08.webp", 1200, 900, "La sobremesa", "After-dinner coffee"),
  placeholder("gallery-details", "/images/gallery-09.webp", 900, 1200, "Detalles de la casa", "Details of the house"),
];

export const OG_MEDIA = {
  es: placeholder("og-es", "/og/es.jpg", 1200, 630, "The Origen, La Habana", "The Origen, Havana"),
  en: placeholder("og-en", "/og/en.jpg", 1200, 630, "The Origen, Havana", "The Origen, Havana"),
} as const;
