export type Locale = "es" | "en";

export interface LocalizedText {
  readonly es: string;
  readonly en: string;
}

export interface Dish {
  readonly id: string;
  readonly name: LocalizedText;
  readonly description: LocalizedText;
  readonly price: number | null;
  readonly currency: "USD";
  readonly image: string | null;
  readonly imageAlt: LocalizedText | null;
  readonly isRecommended: boolean;
  readonly isNote: boolean;
  readonly sortOrder: number;
}

export interface MenuSection {
  readonly id: string;
  readonly name: LocalizedText;
  readonly showHeading: boolean;
  readonly dishes: readonly Dish[];
}

export interface MenuCategory {
  readonly id: string;
  readonly slug: string;
  readonly name: LocalizedText;
  readonly tagline: LocalizedText;
  readonly sortOrder: number;
  readonly sections: readonly MenuSection[];
}

export interface MenuDocument {
  readonly version: number;
  readonly updatedAt: string;
  readonly currency: "USD";
  readonly categories: readonly MenuCategory[];
}
