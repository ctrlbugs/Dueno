import { useEffect, type DependencyList, type RefObject } from "react";

export const BOOTSTRAP_DROPDOWN_AUTO_HIDE_MS = 3000;
export const HEADER_DROPDOWN_OFFSET = "0,24";

type BootstrapDropdown = {
  hide: () => void;
};

type BootstrapDropdownCtor = {
  getInstance: (element: Element) => BootstrapDropdown | null;
  getOrCreateInstance: (element: Element) => BootstrapDropdown;
};

const getBootstrapDropdown = (): BootstrapDropdownCtor | undefined =>
  (
    window as Window & {
      bootstrap?: { Dropdown?: BootstrapDropdownCtor };
    }
  ).bootstrap?.Dropdown;

const getMenu = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".dropdown-menu");

const isDropdownOpen = (toggle: HTMLElement, menu: HTMLElement | null) =>
  toggle.getAttribute("aria-expanded") === "true" ||
  toggle.classList.contains("show") ||
  Boolean(menu?.classList.contains("show"));

const isInsideDropdown = (
  node: Node | null,
  root: HTMLElement,
  menu: HTMLElement | null,
) => Boolean(node && (root.contains(node) || menu?.contains(node)));

const hideDropdown = (root: HTMLElement, toggle: HTMLElement) => {
  if (!isDropdownOpen(toggle, getMenu(root))) return;

  const Dropdown = getBootstrapDropdown();
  if (Dropdown) {
    Dropdown.getOrCreateInstance(toggle).hide();
    return;
  }

  root.classList.remove("show");
  toggle.classList.remove("show");
  toggle.setAttribute("aria-expanded", "false");
  getMenu(root)?.classList.remove("show");
};

export const attachBootstrapDropdownAutoHide = (
  root: HTMLElement,
  idleMs = BOOTSTRAP_DROPDOWN_AUTO_HIDE_MS,
) => {
  const toggle = root.querySelector<HTMLElement>('[data-bs-toggle="dropdown"]');
  if (!toggle) return () => {};

  let idleTimer: number | undefined;
  let activeCleanup: (() => void) | null = null;

  const clearIdleTimer = () => {
    if (idleTimer !== undefined) {
      window.clearTimeout(idleTimer);
      idleTimer = undefined;
    }
  };

  const closeDropdown = () => {
    hideDropdown(root, toggle);
  };

  const scheduleIdleClose = () => {
    clearIdleTimer();
    idleTimer = window.setTimeout(() => {
      if (isDropdownOpen(toggle, getMenu(root))) {
        closeDropdown();
      }
    }, idleMs);
  };

  const resetIdleClose = () => {
    if (isDropdownOpen(toggle, getMenu(root))) {
      scheduleIdleClose();
    }
  };

  const detachActiveListeners = () => {
    activeCleanup?.();
    activeCleanup = null;
  };

  const attachActiveListeners = () => {
    detachActiveListeners();

    const dismissIfOutsideTarget = (target: Node | null) => {
      const menu = getMenu(root);
      if (!isDropdownOpen(toggle, menu)) return;
      if (isInsideDropdown(target, root, menu)) return;
      closeDropdown();
    };

    const onDocumentPointerDown = (event: Event) => {
      dismissIfOutsideTarget(event.target as Node | null);
    };

    const onDocumentFocusIn = (event: Event) => {
      dismissIfOutsideTarget(event.target as Node | null);
    };

    const onPointerLeave = () => {
      window.requestAnimationFrame(() => {
        const menu = getMenu(root);
        if (!isDropdownOpen(toggle, menu)) return;

        const stillHovered =
          root.matches(":hover") ||
          toggle.matches(":hover") ||
          menu?.matches(":hover");

        if (!stillHovered) {
          closeDropdown();
        }
      });
    };

    const onMenuActivity = () => resetIdleClose();

    const onToggleFocusOut = (event: FocusEvent) => {
      dismissIfOutsideTarget(event.relatedTarget as Node | null);
    };

    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    document.addEventListener("focusin", onDocumentFocusIn, true);
    toggle.addEventListener("mouseleave", onPointerLeave);
    toggle.addEventListener("focusout", onToggleFocusOut);

    const menu = getMenu(root);
    menu?.addEventListener("mouseleave", onPointerLeave);
    menu?.addEventListener("mouseenter", onMenuActivity);
    menu?.addEventListener("focusin", onMenuActivity);
    menu?.addEventListener("click", onMenuActivity);

    activeCleanup = () => {
      document.removeEventListener("pointerdown", onDocumentPointerDown, true);
      document.removeEventListener("focusin", onDocumentFocusIn, true);
      toggle.removeEventListener("mouseleave", onPointerLeave);
      toggle.removeEventListener("focusout", onToggleFocusOut);
      menu?.removeEventListener("mouseleave", onPointerLeave);
      menu?.removeEventListener("mouseenter", onMenuActivity);
      menu?.removeEventListener("focusin", onMenuActivity);
      menu?.removeEventListener("click", onMenuActivity);
    };
  };

  const onShown = () => {
    attachActiveListeners();
    scheduleIdleClose();
  };

  const onHide = () => {
    clearIdleTimer();
    detachActiveListeners();
  };

  toggle.addEventListener("shown.bs.dropdown", onShown);
  toggle.addEventListener("hide.bs.dropdown", onHide);
  root.addEventListener("shown.bs.dropdown", onShown);
  root.addEventListener("hide.bs.dropdown", onHide);

  return () => {
    clearIdleTimer();
    detachActiveListeners();
    toggle.removeEventListener("shown.bs.dropdown", onShown);
    toggle.removeEventListener("hide.bs.dropdown", onHide);
    root.removeEventListener("shown.bs.dropdown", onShown);
    root.removeEventListener("hide.bs.dropdown", onHide);
  };
};

export const useBootstrapDropdownAutoHide = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: DependencyList = [],
) => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    return attachBootstrapDropdownAutoHide(root);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export const attachHeaderDropdownAutoHide = (
  idleMs = BOOTSTRAP_DROPDOWN_AUTO_HIDE_MS,
) => {
  const cleanups: (() => void)[] = [];

  document
    .querySelectorAll(
      "header .header-items .dropdown:not(.topbar-profile):not(.staff-messages-dropdown):not(.header-notifications-dropdown)",
    )
    .forEach((node) => {
      cleanups.push(attachBootstrapDropdownAutoHide(node as HTMLElement, idleMs));
    });

  return () => cleanups.forEach((cleanup) => cleanup());
};
