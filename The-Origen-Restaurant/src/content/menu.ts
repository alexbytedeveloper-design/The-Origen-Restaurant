import rawMenu from "./menu.json";
import { MenuCatalog } from "@/domain/menu/menu-catalog";
import { menuDocumentSchema } from "@/domain/menu/menu.schema";

export const MENU_DOCUMENT = menuDocumentSchema.parse(rawMenu);
export const MENU_CATALOG = new MenuCatalog(MENU_DOCUMENT);
