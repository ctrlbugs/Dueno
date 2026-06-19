const BACKDROP_ID = "dueno-sidebar-backdrop";

const isMobileSidebarLayout = () =>
  document.documentElement.getAttribute("data-sidenav-size") === "full";

const hideSidebarBackdrop = () => {
  const backdrop = document.getElementById(BACKDROP_ID);
  backdrop?.remove();
  document.body.style.removeProperty("overflow");
};

const showSidebarBackdrop = (onClose: () => void) => {
  hideSidebarBackdrop();

  const backdrop = document.createElement("div");
  backdrop.id = BACKDROP_ID;
  backdrop.className = "offcanvas-backdrop fade show";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";
  backdrop.addEventListener("click", onClose);
};

const closeSidebar = () => {
  document.documentElement.classList.remove("sidebar-enable");
  hideSidebarBackdrop();
};

const toggleSidebar = () => {
  const html = document.documentElement;

  if (html.classList.contains("sidebar-enable")) {
    closeSidebar();
    return;
  }

  html.classList.add("sidebar-enable");

  if (isMobileSidebarLayout()) {
    showSidebarBackdrop(closeSidebar);
  }
};

export default toggleSidebar;
