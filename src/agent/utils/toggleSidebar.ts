const toggleSidebar = () => {
  const html = document.documentElement;
  if (html.classList.contains("sidebar-enable")) {
    html.classList.remove("sidebar-enable");
  } else {
    html.classList.add("sidebar-enable");
  }
};

export default toggleSidebar;
