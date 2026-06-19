import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { header } from "./headerData";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../imageWithBasePath";
import { img_path } from "../../../environment";
import { setDataTheme } from "../../redux/themeSettingSlice";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { isServiceDetailPath } from "../../../data/duenoServices";
import HeaderNotificationsDropdown from "./HeaderNotificationsDropdown";
import HeaderAccountMenu from "./HeaderAccountMenu";
import { useSavedPropertyCount } from "./useSavedPropertyCount";
import { useAuth } from "../../../context/AuthContext";
import { getAgentById } from "../../../services/agentStore";

const Header = () => {
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isServiceDetailPage = isServiceDetailPath(location.pathname);
  const isHeroHeaderPage =
    location.pathname === all_routes.index3 || isServiceDetailPage;
  const dispatch = useDispatch();
  const [isFixed, setIsFixed] = useState(false);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const handleDataThemeChange = (theme: string) => {
    dispatch(setDataTheme(theme));
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMegaSuppressed, setServicesMegaSuppressed] = useState(false);
  const savedPropertyCount = useSavedPropertyCount();
  const { user, logout, isAuthenticated } = useAuth();
  const agent =
    user?.role === "agent" ? getAgentById(user.id) : undefined;
  const canPostProperty =
    user?.role === "agent" && user.agentStatus === "approved";
  const showBuyerNotifications = user?.role === "buyer";
  const toggleMobileMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const nextOpen = !mobileMenuOpen;
    document.documentElement.classList.toggle("menu-opened", nextOpen);
    setMobileMenuOpen(nextOpen);
  };
  const closeMobileMenu = (event?: React.MouseEvent) => {
    event?.preventDefault();
    document.documentElement.classList.remove("menu-opened");
    setMobileMenuOpen(false);
    setSubopen("");
    setSubsidebar("");
    setSubsidebar2("");
  };

  const handleServiceLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    route: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSubopen("");
    setServicesMegaSuppressed(true);
    closeMobileMenu();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    navigate(route);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };
  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  const toggleSubsidebar2 = (subitem: any) => {
    if (subitem === subsidebar2) {
      setSubsidebar2("");
    } else {
      setSubsidebar2(subitem);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (isServiceDetailPath(location.pathname)) {
        return;
      }
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);
  useEffect(() => {
    document.documentElement.classList.remove("menu-opened");
    setMobileMenuOpen(false);
    setSubopen("");
    if (isServiceDetailPath(location.pathname)) {
      setIsFixed(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dataTheme);
  }, [dataTheme]);
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);
  return (
    <>
      {mobileMenuOpen ? (
        <button
          type="button"
          className="sidebar-overlay opened"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
        />
      ) : null}
      {/* Header Start */}
      <header
        className={
          // Always add fixed class if isFixed is true, regardless of page
          `header${
            location.pathname === "/index-2"
              ? " header-two"
              : isHeroHeaderPage
              ? " header-three"
              : ""
          }${isFixed && !isServiceDetailPage ? " fixed" : ""}`
        }
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <Link to={all_routes.index3} className="navbar-brand logo">
                <ImageWithBasePath
                  src={
                    isHeroHeaderPage
                      ? "assets/img/logo-white.svg"
                      : "assets/img/logo.svg"
                  }
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Link to={all_routes.index3} className="navbar-brand logo-dark">
                <ImageWithBasePath
                  src={
                    isHeroHeaderPage
                      ? `assets/img/logo.svg`
                      : `assets/img/logo-white.svg`
                  }
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Link
                id="mobile_btn"
                to="#"
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <i className="material-icons-outlined">menu</i>
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to={all_routes.index3} className="menu-logo">
                  <ImageWithBasePath
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link
                  to={all_routes.index3}
                  className="menu-logo menu-logo-dark"
                >
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link
                  id="menu_close"
                  className="menu-close"
                  to="#"
                  onClick={closeMobileMenu}
                >
                  <i className="material-icons-outlined">close</i>
                </Link>
              </div>
              <ul className={`main-nav  navbar-nav`}>
                {header.map((mainMenus: any, mainIndex) => (
                  <React.Fragment key={mainIndex}>
                    {mainMenus.isMegaMenu ? (
                      <li
                        key={mainIndex}
                        className={`has-submenu megamenu services-nav-item${
                          servicesMegaSuppressed ? " services-mega-suppressed" : ""
                        } ${
                          mainMenus?.menu?.some(
                            (item: any) => item?.route === location.pathname,
                          ) || location.pathname.startsWith("/services/")
                            ? "active"
                            : ""
                        }`}
                        onMouseLeave={() => setServicesMegaSuppressed(false)}
                      >
                        <Link
                          to="#"
                          onClick={() => toggleSidebar(mainMenus.tittle)}
                        >
                          {mainMenus.tittle}
                          <i className="material-icons-outlined">
                            {mainMenus.icon}
                          </i>
                        </Link>
                        <ul
                          className={`submenu mega-submenu services-mega-submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                        >
                          <li>
                            <div className="megamenu-wrapper services-mega-menu">
                              <div className="row g-0">
                                <div className="col-lg-4 services-mega-intro">
                                  {mainMenus.megaMenuIntro?.img && (
                                    <div className="services-mega-intro-img">
                                      <ImageWithBasePath
                                        src={mainMenus.megaMenuIntro.img}
                                        className="img-fluid"
                                        alt={mainMenus.megaMenuIntro.title}
                                      />
                                    </div>
                                  )}
                                  <h5>{mainMenus.megaMenuIntro?.title}</h5>
                                  <p>{mainMenus.megaMenuIntro?.description}</p>
                                </div>
                                <div className="col-lg-8 services-mega-grid">
                                  <div className="row g-3">
                                    {mainMenus.menu.map(
                                      (menu: any, idx: number) => (
                                        <div className="col-md-6" key={idx}>
                                          <Link
                                            to={menu.route}
                                            className={`services-mega-item ${
                                              location.pathname === menu.route
                                                ? "active"
                                                : ""
                                            }`}
                                            onClick={(event) =>
                                              handleServiceLinkClick(
                                                event,
                                                menu.route,
                                              )
                                            }
                                          >
                                            <span
                                              className="services-mega-item-bg"
                                              style={{
                                                backgroundImage: `url(${img_path}${menu.img})`,
                                              }}
                                              aria-hidden="true"
                                            />
                                            <span
                                              className="services-mega-item-overlay"
                                              aria-hidden="true"
                                            />
                                            <span className="services-mega-item-content">
                                              <span className="services-mega-item-title">
                                                <span className="services-mega-item-name">
                                                  {menu.menuValue}
                                                </span>
                                                <i className="material-icons-outlined">
                                                  arrow_forward
                                                </i>
                                              </span>
                                              <span className="services-mega-item-desc">
                                                {menu.description}
                                              </span>
                                            </span>
                                          </Link>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    ) : mainMenus.separateRoute ? (
                      <li
                        key={mainIndex}
                        className={`has-submenu megamenu ${
                          location.pathname === "/index" ||
                          location.pathname === "/index-2" ||
                          location.pathname === all_routes.index3
                            ? "active"
                            : ""
                        }`}
                        onClick={() => toggleSidebar(mainMenus.tittle)}
                      >
                        <Link to="#">
                          {mainMenus.tittle}
                          <i className="material-icons-outlined">
                            {mainMenus.icon}
                          </i>
                        </Link>
                        <ul
                          className={`submenu mega-submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                        >
                          <li>
                            <div className="megamenu-wrapper">
                              <div className="row">
                                {mainMenus.menu.map((menu: any, idx: any) => (
                                  <div className="col-lg-3" key={idx}>
                                    <div
                                      className={`single-demo ${
                                        location.pathname === menu.route
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div className="demo-img">
                                        <Link to={menu.route}>
                                          <ImageWithBasePath
                                            src={menu.img}
                                            className="img-fluid "
                                            alt="img"
                                          />
                                        </Link>
                                      </div>
                                      <div className="demo-info">
                                        <Link
                                          to={menu.route}
                                          className={`inner-demo-img`}
                                        >
                                          {menu.menuValue}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      mainMenus?.asDirectLink &&
                      mainMenus?.menu?.length === 1 &&
                      !mainMenus?.menu?.[0]?.hasSubRoute ? (
                        <li
                          className={
                            location.pathname === mainMenus.menu[0].route
                              ? "active"
                              : ""
                          }
                        >
                          <Link to={mainMenus.menu[0].route}>
                            {mainMenus.tittle}
                          </Link>
                        </li>
                      ) : (
                        <li
                          className={`has-submenu ${
                            mainMenus?.menu?.some(
                              (item: any) =>
                                item?.route === location.pathname ||
                                item?.subMenus?.some(
                                  (subItem: any) =>
                                    subItem?.route === location.pathname
                                )
                            )
                              ? "active"
                              : ""
                          }`}
                        >
                          <Link
                            to="#"
                            onClick={() => toggleSidebar(mainMenus.tittle)}
                          >
                            {mainMenus.tittle}
                            <i className="material-icons-outlined">
                              {mainMenus.icon}
                            </i>
                          </Link>
                          <ul
                            className={`submenu ${
                              subOpen === mainMenus.tittle ? "d-block" : ""
                            }`}
                          >
                            {mainMenus.menu?.map((menu: any, menuIndex: any) => (
                              <React.Fragment key={`${mainIndex}-${menuIndex}`}>
                                {menu.hasSubRoute ? (
                                  <li
                                    key={`${mainIndex}-${menuIndex}`}
                                    className={`${
                                      menu.hasSubRoute ? "has-submenu" : ""
                                    } ${
                                      menu?.subMenus?.some(
                                        (item: any) =>
                                          location.pathname === item?.route
                                      )
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      to="#"
                                      className={`hideonmob`}
                                      onClick={() => {
                                        toggleSubsidebar(menu.menuValue);
                                      }}
                                    >
                                      {menu.menuValue}
                                    </Link>
                                    <ul
                                      className={`submenu showonmob ${
                                        subsidebar === menu.menuValue
                                          ? "d-block"
                                          : ""
                                      }`}
                                    >
                                      {menu.subMenus?.map(
                                        (subMenu: any, subMenuIndex: any) => (
                                          <React.Fragment
                                            key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                          >
                                            {subMenu.hasSubRoute ? (
                                              <li
                                                className={`${
                                                  subMenu?.subMenus?.some(
                                                    (item: any) =>
                                                      location.pathname ===
                                                      item?.route
                                                  )
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    toggleSubsidebar2(
                                                      subMenu.menuValue
                                                    );
                                                  }}
                                                >
                                                  {subMenu.menuValue}
                                                </Link>
                                                <ul
                                                  className={`submenu ${
                                                    subsidebar2 ===
                                                    subMenu.menuValue
                                                      ? "d-block"
                                                      : ""
                                                  }`}
                                                >
                                                  {subMenu.subMenus?.map(
                                                    (
                                                      menu: any,
                                                      menuIndex2: any
                                                    ) => (
                                                      <li
                                                        key={menuIndex2}
                                                        className={
                                                          location.pathname ===
                                                          menu.route
                                                            ? "active"
                                                            : ""
                                                        }
                                                      >
                                                        <Link to={menu.route}>
                                                          {menu.menuValue}
                                                        </Link>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </li>
                                            ) : (
                                              <li
                                                className={
                                                  location.pathname ===
                                                  subMenu.route
                                                    ? "active"
                                                    : ""
                                                }
                                                key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                              >
                                                <Link
                                                  to={subMenu.route}
                                                  target={`${
                                                    subMenu.admin
                                                      ? "_blank"
                                                      : "_self"
                                                  }`}
                                                >
                                                  {subMenu.menuValue}
                                                </Link>
                                              </li>
                                            )}
                                          </React.Fragment>
                                        )
                                      )}
                                    </ul>
                                  </li>
                                ) : (
                                  <li
                                    key={`${mainIndex}-${menuIndex}`}
                                    className={
                                      location.pathname === menu.route
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <Link to={menu.route}>{menu.menuValue}</Link>
                                  </li>
                                )}
                              </React.Fragment>
                            ))}
                          </ul>
                        </li>
                      )
                    )}
                  </React.Fragment>
                ))}
              </ul>
              <div className="menu-dropdown">
                <div className="menu-dropdown-icons">
                  <div className="dropdown menu-lang-dropdown">
                    <Link
                      to="#"
                      className="menu-icon-btn dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-display="static"
                      aria-expanded="false"
                      aria-label="Language"
                      onClick={(event) => event.preventDefault()}
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ng.svg"
                        alt="Language"
                        height={14}
                      />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item d-flex align-items-center active"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/ng.svg"
                          alt=""
                          className="me-2"
                          height={16}
                        />
                        <span className="align-middle">English</span>
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/de.svg"
                          alt=""
                          className="me-2"
                          height={16}
                        />
                        <span className="align-middle">German</span>
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/fr.svg"
                          alt=""
                          className="me-2"
                          height={16}
                        />
                        <span className="align-middle">French</span>
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item d-flex align-items-center"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/ae.svg"
                          alt=""
                          className="me-2"
                          height={16}
                        />
                        <span className="align-middle">Arabic</span>
                      </Link>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`menu-icon-btn menu-theme-toggle${
                      dataTheme === "dark" ? " is-dark" : ""
                    }`}
                    aria-label={
                      dataTheme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                    aria-pressed={dataTheme === "dark"}
                    onClick={() =>
                      handleDataThemeChange(
                        dataTheme === "dark" ? "light" : "dark",
                      )
                    }
                  >
                    <i className="material-icons-outlined">
                      {dataTheme === "dark" ? "dark_mode" : "wb_sunny"}
                    </i>
                  </button>
                </div>
              </div>
              <div className="menu-login">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={
                        user?.role === "admin"
                          ? "/admin"
                          : user?.role === "agent"
                            ? user.agentStatus === "approved"
                              ? "/agent/dashboard"
                              : "/agent/pending-review"
                            : all_routes.index3
                      }
                      className="btn btn-primary w-100 mb-2"
                    >
                      My Account
                    </Link>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => {
                        logout();
                        navigate(all_routes.signin);
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.signin}
                      className="btn btn-primary w-100 mb-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      to={all_routes.signup}
                      className="btn btn-secondary w-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
            {location.pathname === "/index" ||
            location.pathname === "/index-2" ||
            isHeroHeaderPage ? (
              <div className="nav header-items">
                <Link
                  to="#"
                  className="topbar-link btn btn-light topbar-search"
                  data-bs-toggle="modal"
                  data-bs-target="#search-modal"
                >
                  <i className="material-icons-outlined">search</i>
                </Link>
                <div className="dropdown topbar-lang">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/ng.svg"
                      alt="Language"
                      height={16}
                    />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ng.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">English</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/de.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">German</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/fr.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">French</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ae.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">Arabic</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <i className="material-icons-outlined">wb_sunny</i>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "light" && "active"
                      }`}
                      id="light-mode-toggle"
                      onClick={() => handleDataThemeChange("light")}
                    >
                      <i className="material-icons-outlined me-2">wb_sunny</i>
                      <span className="align-middle">Light Mode</span>
                    </Link>
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "dark" && "active"
                      }`}
                      id="dark-mode-toggle"
                      onClick={() => handleDataThemeChange("dark")}
                    >
                      <i className="material-icons-outlined me-2">dark_mode</i>
                      <span className="align-middle">Dark Mode</span>
                    </Link>
                  </div>
                </div>
                {canPostProperty ? (
                  <Link
                    to="/agent/listings/new"
                    className="btn btn-lg btn-dark d-inline-flex align-items-center topbar-add"
                  >
                    <i className="material-icons-outlined me-1">home</i>
                    Post Property
                  </Link>
                ) : null}
                {isAuthenticated && user ? (
                  <HeaderAccountMenu
                    user={user}
                    agent={agent}
                    onLogout={logout}
                  />
                ) : (
                  <>
                    <Link
                      to={all_routes.signin}
                      className="btn btn-lg btn-dark d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-1">perm_identity</i>
                      Sign In
                    </Link>
                    <Link
                      to={all_routes.signup}
                      className="btn btn-lg btn-primary d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-1">person_add</i>
                      Register
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="nav header-items">
                <Link
                  to="#"
                  className={`topbar-link btn btn-light topbar-search ${
                    [
                      "/buy-details",
                      "/rent-details",
                      "/buy-details-schedule",
                    ].includes(location.pathname)
                      ? "custom-btn-light"
                      : ""
                  }`}
                  data-bs-toggle="modal"
                  data-bs-target="#search-modal"
                >
                  <i className="material-icons-outlined">search</i>
                </Link>
                <div className="dropdown topbar-lang">
                  <Link
                    to="#"
                    className={`topbar-link btn btn-light  ${
                      [
                        "/buy-details",
                        "/rent-details",
                        "/buy-details-schedule",
                      ].includes(location.pathname)
                        ? "custom-btn-light"
                        : ""
                    }`}
                    data-bs-toggle="dropdown"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/ng.svg"
                      alt="Language"
                      height={16}
                    />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ng.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">English</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/de.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">German</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/fr.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">French</span>
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item d-flex align-items-center"
                    >
                      <ImageWithBasePath
                        src="assets/img/flags/ae.svg"
                        alt="image"
                        className="me-2"
                        height={16}
                      />
                      <span className="align-middle">Arabic</span>
                    </Link>
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="topbar-link btn btn-light"
                    data-bs-toggle="dropdown"
                  >
                    <i className="material-icons-outlined">wb_sunny</i>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "light" && "active"
                      }`}
                      id="light-mode-toggle"
                      onClick={() => handleDataThemeChange("light")}
                    >
                      <i className="material-icons-outlined me-2">wb_sunny</i>
                      <span className="align-middle">Light Mode</span>
                    </Link>
                    <Link
                      to="#"
                      className={`dropdown-item d-flex align-items-center ${
                        dataTheme === "dark" && "active"
                      }`}
                      id="dark-mode-toggle"
                      onClick={() => handleDataThemeChange("dark")}
                    >
                      <i className="material-icons-outlined me-2">dark_mode</i>
                      <span className="align-middle">Dark Mode</span>
                    </Link>
                  </div>
                </div>
                {showBuyerNotifications ? <HeaderNotificationsDropdown /> : null}
                <Link
                  to={all_routes.cart}
                  className={`topbar-link btn btn-light topbar-cart ${
                    [
                      "/buy-details",
                      "/rent-details",
                      "/buy-details-schedule",
                    ].includes(location.pathname)
                      ? "custom-btn-light"
                      : ""
                  }`}
                  aria-label="Saved properties"
                >
                  <i className="material-icons-outlined">favorite</i>
                  {savedPropertyCount > 0 ? (
                    <span className="badge-icon bg-danger">{savedPropertyCount}</span>
                  ) : null}
                </Link>
                {canPostProperty ? (
                  <Link
                    to="/agent/listings/new"
                    className="btn btn-lg btn-dark d-inline-flex align-items-center topbar-add"
                  >
                    <i className="material-icons-outlined me-1">home</i>
                    Post Property
                  </Link>
                ) : null}
                {isAuthenticated && user ? (
                  <HeaderAccountMenu
                    user={user}
                    agent={agent}
                    onLogout={logout}
                  />
                ) : (
                  <>
                    <Link
                      to={all_routes.signin}
                      className="btn btn-lg btn-dark d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-1">perm_identity</i>
                      Sign In
                    </Link>
                    <Link
                      to={all_routes.signup}
                      className="btn btn-lg btn-primary d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-1">person_add</i>
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
      {/* Header End */}
    </>
  );
};

export default Header;
