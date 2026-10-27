import type { Dish, MenuCategory, MenuDocument } from "./menu.types";

export interface MenuSearchOptions {
  readonly query?: string;
  readonly recommendedOnly?: boolean;
  readonly categorySlug?: string;
}

interface IndexedDish {
  readonly dish: Dish;
  readonly categorySlug: string;
  readonly sectionId: string;
  readonly haystack: string;
}

export interface MenuStats {
  readonly categories: number;
  readonly sections: number;
  readonly dishes: number;
  readonly priced: number;
}

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .trim();

export class MenuCatalog {
  public readonly categories: readonly MenuCategory[];
  private readonly index: readonly IndexedDish[];

  public constructor(document: Pick<MenuDocument, "categories">) {
    this.categories = [...document.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    this.index = this.categories.flatMap((category) =>
      category.sections.flatMap((section) =>
        section.dishes.map((dish) => ({
          dish,
          categorySlug: category.slug,
          sectionId: section.id,
          haystack: normalize(
            [
              dish.name.es,
              dish.name.en,
              dish.description.es,
              dish.description.en,
              category.name.es,
              category.name.en,
              section.name.es,
              section.name.en,
            ].join(" "),
          ),
        })),
      ),
    );
  }

  public get dishes(): readonly Dish[] {
    return this.index.map((entry) => entry.dish);
  }

  public get recommended(): readonly Dish[] {
    return this.dishes.filter((dish) => dish.isRecommended && !dish.isNote);
  }

  public get stats(): MenuStats {
    return {
      categories: this.categories.length,
      sections: this.categories.reduce((total, category) => total + category.sections.length, 0),
      dishes: this.dishes.length,
      priced: this.dishes.filter((dish) => dish.price !== null).length,
    };
  }

  public findCategory(slug: string): MenuCategory | undefined {
    return this.categories.find((category) => category.slug === slug);
  }

  public findDish(id: string): Dish | undefined {
    return this.dishes.find((dish) => dish.id === id);
  }

  public search(options: MenuSearchOptions = {}): readonly Dish[] {
    const query = normalize(options.query ?? "");
    const recommendedOnly = options.recommendedOnly ?? false;
    const categorySlug = options.categorySlug;

    return this.index
      .filter((entry) => {
        if (recommendedOnly && !entry.dish.isRecommended) return false;
        if (categorySlug && entry.categorySlug !== categorySlug) return false;
        if (query.length === 0) return true;
        return entry.haystack.includes(query);
      })
      .map((entry) => entry.dish);
  }

  public groupByCategory(dishes: readonly Dish[]): readonly {
    category: MenuCategory;
    dishes: readonly Dish[];
  }[] {
    const ids = new Set(dishes.map((dish) => dish.id));
    return this.categories
      .map((category) => ({
        category,
        dishes: category.sections.flatMap((section) => section.dishes).filter((dish) => ids.has(dish.id)),
      }))
      .filter((group) => group.dishes.length > 0);
  }
}
