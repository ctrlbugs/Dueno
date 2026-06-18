declare module "@dashboard-ui/assets/scss/app.scss";
declare module "@dashboard-ui/assets/scss/icons.scss";

declare module "@dashboard-ui/common/context" {
  import type { ReactNode } from "react";

  export const ThemeSettings: {
    layout: {
      type: { vertical: string; horizontal: string };
      mode: { fluid: string; boxed: string };
      menuPosition: { scrollable: string; fixed: string };
    };
    theme: { light: string; dark: string };
    topbar: { theme: { light: string; dark: string } };
    sidebar: {
      theme: { light: string; dark: string };
      size: Record<string, string>;
    };
  };

  export function ThemeProvider(props: { children: ReactNode }): React.JSX.Element;
  export function useThemeContext(): {
    settings: {
      theme: string;
      layout: { mode: string; menuPosition: string };
      topbar: { theme: string };
      sidebar: { theme: string; size: string };
    };
    updateSidebar: (value: { size: string }) => void;
  };
}

declare module "@dashboard-ui/constants/menu" {
  export interface MenuItemTypes {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: { variant: string; text: string };
    parentKey?: string;
    target?: string;
    children?: MenuItemTypes[];
  }
}

declare module "@dashboard-ui/Layouts/Menu" {
  import type { MenuItemTypes } from "@dashboard-ui/constants/menu";

  const AppMenu: (props: { menuItems: MenuItemTypes[] }) => React.JSX.Element;
  export default AppMenu;
}

declare module "@dashboard-ui/hooks" {
  export function useViewport(): { width: number; height: number };
}

declare module "@dashboard-ui/utils" {
  export function changeHTMLAttribute(attr: string, value: string): void;
}
