import type { MenuItemTypes } from "@dashboard-ui/constants/menu";

export const DUENO_AGENT_MENU: MenuItemTypes[] = [
  { key: "main", label: "Dueno Agent", isTitle: true },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "ri-dashboard-3-line",
    url: "/agent/dashboard",
  },
  { key: "listings-section", label: "Properties", isTitle: true },
  {
    key: "listings",
    label: "My Listings",
    icon: "ri-building-4-line",
    url: "/agent/listings",
  },
  {
    key: "add-listing",
    label: "Add Listing",
    icon: "ri-add-circle-line",
    url: "/agent/listings/new",
    badge: { variant: "success", text: "New" },
  },
  {
    key: "profile",
    label: "Public Profile",
    icon: "ri-user-star-line",
    url: "/agent/profile",
  },
  {
    key: "messages",
    label: "Messages",
    icon: "ri-message-3-line",
    url: "/agent/messages",
  },
  { key: "site-section", label: "Explore", isTitle: true },
  {
    key: "view-site",
    label: "View Website",
    icon: "ri-external-link-line",
    url: "/home",
    target: "_blank",
  },
  {
    key: "buy-grid",
    label: "Browse Properties",
    icon: "ri-search-line",
    url: "/buy-property",
    target: "_blank",
  },
];

export const getAgentMenuWithBadges = (counts: {
  pendingListings?: number;
  unreadMessages?: number;
}): MenuItemTypes[] =>
  DUENO_AGENT_MENU.map((item) => {
    if (item.key === "listings" && (counts.pendingListings ?? 0) > 0) {
      return {
        ...item,
        badge: { variant: "warning", text: String(counts.pendingListings) },
      };
    }
    if (item.key === "messages" && (counts.unreadMessages ?? 0) > 0) {
      return {
        ...item,
        badge: { variant: "danger", text: String(counts.unreadMessages) },
      };
    }
    if (item.key === "messages") {
      return { ...item, badge: undefined };
    }
    return item;
  });
