import { all_routes } from "../../../feature-module/routes/all_routes";
import {
  DUENO_SERVICES,
  getDuenoServicePath,
} from "../../../data/duenoServices";

export const header = [
  {
    tittle: "Home",
    base: "index-3",
    icon: "expand_more",
    asDirectLink: true,
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Home",
        route: all_routes.index3,
        hasSubRoute: false,
        showSubRoute: false,
        subMenus: [],
      },
    ],
  },
  {
    tittle: "Services",
    base: "services",
    icon: "expand_more",
    showAsTab: false,
    separateRoute: false,
    isMegaMenu: true,
    megaMenuIntro: {
      title: "Services",
      description:
        "Everything you need for a seamless property experience.",
      img: "assets/img/Intro-Image.png",
    },
    menu: DUENO_SERVICES.map((service) => ({
      menuValue: service.title,
      description: service.menuDescription,
      img: service.megaMenuImage,
      route: getDuenoServicePath(service.slug),
      hasSubRoute: false,
      showSubRoute: false,
      subMenus: [],
    })),
  },
  {
    tittle: "Agent",
    showAsTab: false,
    separateRoute: false,
    base: "agent",
    icon: "expand_more",
    menu: [
      {
        menuValue: "Agent Listing",
        route: all_routes.agentList,
        hasSubRoute: false,
        showSubRoute: false,
        subMenus: [],
      },
    ],
  },
  {
    tittle: "About Us",
    showAsTab: false,
    separateRoute: false,
    base: "about",
    icon: "expand_more",
    asDirectLink: true,
    menu: [
      {
        menuValue: "About Us",
        route: all_routes.aboutUs,
        hasSubRoute: false,
        showSubRoute: false,
        subMenus: [],
      },
    ],
  },
  {
    tittle: "Contact",
    showAsTab: false,
    separateRoute: false,
    base: "contact",
    icon: "expand_more",
    asDirectLink: true,
    menu: [
      {
        menuValue: "Contact Us",
        route: all_routes.contactUs,
        hasSubRoute: false,
        showSubRoute: false,
        subMenus: [],
      },
    ],
  },
];
