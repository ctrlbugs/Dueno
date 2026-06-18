import type { MenuItemTypes } from "@dashboard-ui/constants/menu";

export const DUENO_ADMIN_MENU: MenuItemTypes[] = [
  { key: "main", label: "Dueno Admin", isTitle: true },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "ri-dashboard-3-line",
    url: "/admin",
  },
  { key: "agents-section", label: "Agents", isTitle: true },
  {
    key: "agents",
    label: "All Agents",
    icon: "ri-team-line",
    url: "/admin/agents",
  },
  {
    key: "create-agent",
    label: "Create Agent",
    icon: "ri-user-add-line",
    url: "/admin/agents/create",
  },
  {
    key: "applications",
    label: "Applications",
    icon: "ri-file-list-3-line",
    url: "/admin/applications",
    badge: { variant: "warning", text: "New" },
  },
  { key: "listings-section", label: "Listings", isTitle: true },
  {
    key: "listings-queue",
    label: "Approval Queue",
    icon: "ri-building-2-line",
    url: "/admin/listings",
  },
  {
    key: "listings-all",
    label: "All Listings",
    icon: "ri-home-smile-line",
    url: "/admin/listings/all",
  },
  {
    key: "listings-create",
    label: "Create Listing",
    icon: "ri-add-circle-line",
    url: "/admin/listings/create",
  },
  {
    key: "messages",
    label: "Messages",
    icon: "ri-message-3-line",
    url: "/admin/messages",
  },
  { key: "site-section", label: "Site", isTitle: true },
  {
    key: "view-site",
    label: "View Website",
    icon: "ri-external-link-line",
    url: "/home",
    target: "_blank",
  },
];

export const getPendingApplicationBadge = (count: number): MenuItemTypes[] =>
  DUENO_ADMIN_MENU.map((item) =>
    item.key === "applications" && count > 0
      ? {
          ...item,
          badge: { variant: "warning", text: String(count) },
        }
      : item.key === "applications" && count === 0
        ? { ...item, badge: undefined }
        : item
  );

export const getAdminMenuWithBadges = (counts: {
  pendingApplications?: number;
  unreadMessages?: number;
}): MenuItemTypes[] =>
  DUENO_ADMIN_MENU.map((item) => {
    if (item.key === "applications" && (counts.pendingApplications ?? 0) > 0) {
      return {
        ...item,
        badge: { variant: "warning", text: String(counts.pendingApplications) },
      };
    }
    if (item.key === "applications") {
      return { ...item, badge: undefined };
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
