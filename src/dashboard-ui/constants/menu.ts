export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

/** Demo menu data removed — Dueno defines menus in src/admin/adminMenu.ts and src/agent/agentMenu.ts */
export const MENU_ITEMS: MenuItemTypes[] = [];
export const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [];
