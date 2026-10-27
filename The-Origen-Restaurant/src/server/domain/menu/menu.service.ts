import type { Dish, MenuCategory, MenuDocument } from "@/domain/menu/menu.types";
import { MenuCatalog } from "@/domain/menu/menu-catalog";

export interface MenuHomeData {
  readonly signature: Dish;
  readonly recommended: readonly Dish[];
  readonly categories: readonly MenuCategory[];
}

export class MenuService {
  private readonly catalog: MenuCatalog;

  public constructor(private readonly document: MenuDocument) {
    this.catalog = new MenuCatalog(document);
  }

  public getDocument(): MenuDocument {
    return this.document;
  }

  public getCategories(): readonly MenuCategory[] {
    return this.catalog.categories;
  }

  public getRecommended(limit = 6): readonly Dish[] {
    return this.catalog.recommended.slice(0, limit);
  }

  public getSignature(): Dish {
    const signature =
      this.catalog.findDish("el-consentido-origen") ??
      this.catalog.recommended[0] ??
      this.catalog.dishes[0];
    if (!signature) {
      throw new Error("The menu has no dishes.");
    }
    return signature;
  }

  public getHomeData(): MenuHomeData {
    return {
      signature: this.getSignature(),
      recommended: this.getRecommended(6),
      categories: this.catalog.categories,
    };
  }

  public getStats() {
    return this.catalog.stats;
  }
}
