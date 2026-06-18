import Index3 from "../components/home/index-3/index3";
import { all_routes } from "./all_routes";
import { Navigate, Route } from "react-router";
import BuyGrid from "../components/listing-modules/buy-property/buy-grid/buyGrid";
import BuyDetails from "../components/listing-modules/buy-property/buy-details/buyDetails";
import {
  DEFAULT_RENT_PROPERTY_SLUG,
  DEFAULT_SALE_PROPERTY_SLUG,
} from "../../data/estateProperties";
import RentGrid from "../components/listing-modules/rent-property/rent-grid/rentGrid";
import AgentList from "../components/listing-modules/agent-module/agent-list/agentList";
import DuenoAgentProfile from "../components/listing-modules/agent-module/dueno-agent-profile/DuenoAgentProfile";
import AddProperyBuy from "../components/add-property-buy/addProperyBuy";
import Cart from "../components/cart/cart";
import Notification from "../components/notification/notification";
import BlogGrid from "../components/blog-modules/blog-grid/blogGrid";
import BlogDetails from "../components/blog-modules/blog-details/blogDetails";
import AboutUs from "../components/pages-modules/about-us/aboutUs";
import SignUp from "../components/auth-modules/sign-up/signUp";
import SignIn from "../components/auth-modules/sign-in/signIn";
import ForgorPassword from "../components/auth-modules/forgort-password/forgorPassword";
import ResetPassword from "../components/auth-modules/reset-password/resetPassword";
import ContactUs from "../components/pages-modules/contact-us/contactUs";
import ServicesHubPage from "../components/pages-modules/services/ServicesHubPage";
import ServiceDetailPage from "../components/pages-modules/services/ServiceDetailPage";
import Error404 from "../components/pages-modules/error-404/error404";
import Error500 from "../components/pages-modules/error-500/error500";
import Faq from "../components/pages-modules/faq/faq";
import TermsCondition from "../components/pages-modules/terms-condition/termsCondition";
import PrivacyPolicy from "../components/pages-modules/privacy-policy/privacyPolicy";

const routes = all_routes;

export const publicRoutes = [
  {
    path: "/",
    name: "Root",
    element: <Navigate to={routes.index3} replace />,
    route: Route,
  },
  {
    path: routes.index3,
    element: <Index3 />,
    meta_title: "Home | Dueno Property",
    route: Route,
  },
  {
    path: routes.index,
    element: <Navigate to={routes.index3} replace />,
    route: Route,
  },
  {
    path: routes.index2,
    element: <Navigate to={routes.index3} replace />,
    route: Route,
  },
  {
    path: routes.buyProperty,
    element: <BuyGrid />,
    meta_title: "Buy Property | Dueno Property",
    route: Route,
  },
  {
    path: "/buy-property-grid",
    element: <Navigate to={routes.buyProperty} replace />,
    route: Route,
  },
  {
    path: routes.buyDetailsLegacy,
    element: (
      <Navigate to={`/buy-details/${DEFAULT_SALE_PROPERTY_SLUG}`} replace />
    ),
    route: Route,
  },
  {
    path: routes.buyDetails,
    element: <BuyDetails />,
    meta_title: "Property Details | Dueno Property",
    route: Route,
  },
  {
    path: routes.rentProperty,
    element: <RentGrid />,
    meta_title: "Rent Property | Dueno Property",
    route: Route,
  },
  {
    path: "/rent-property-grid",
    element: <Navigate to={routes.rentProperty} replace />,
    route: Route,
  },
  {
    path: routes.rentDetailsLegacy,
    element: (
      <Navigate to={`/rent-details/${DEFAULT_RENT_PROPERTY_SLUG}`} replace />
    ),
    route: Route,
  },
  {
    path: routes.rentDetails,
    element: <BuyDetails />,
    meta_title: "Rental Details | Dueno Property",
    route: Route,
  },
  {
    path: routes.agentList,
    element: <AgentList />,
    meta_title: "Agents | Dueno Property",
    route: Route,
  },
  {
    path: routes.duenoAgentProfile,
    element: <DuenoAgentProfile />,
    meta_title: "Agent Profile | Dueno Property",
    route: Route,
  },
  {
    path: routes.addpropertybuy,
    element: <AddProperyBuy />,
    meta_title: "Post Property | Dueno Property",
    route: Route,
  },
  {
    path: routes.cart,
    element: <Cart />,
    meta_title: "Saved Properties | Dueno Property",
    route: Route,
  },
  {
    path: routes.notification,
    element: <Notification />,
    meta_title: "Notifications | Dueno Property",
    route: Route,
  },
  {
    path: routes.blogGrid,
    element: <BlogGrid />,
    meta_title: "Blog | Dueno Property",
    route: Route,
  },
  {
    path: routes.blogDetailsArticle,
    element: <BlogDetails />,
    meta_title: "Blog | Dueno Property",
    route: Route,
  },
  {
    path: routes.blogDetails,
    element: <BlogDetails />,
    meta_title: "Blog | Dueno Property",
    route: Route,
  },
  {
    path: routes.aboutUs,
    element: <AboutUs />,
    meta_title: "About Us | Dueno Property",
    route: Route,
  },
  {
    path: routes.contactUs,
    element: <ContactUs />,
    meta_title: "Contact Us | Dueno Property",
    route: Route,
  },
  {
    path: routes.services,
    element: <ServicesHubPage />,
    meta_title: "Services | Dueno Property",
    route: Route,
  },
  {
    path: routes.serviceDetail,
    element: <ServiceDetailPage />,
    meta_title: "Service | Dueno Property",
    route: Route,
  },
  {
    path: routes.faq,
    element: <Faq />,
    meta_title: "FAQ | Dueno Property",
    route: Route,
  },
  {
    path: routes.termsCondition,
    element: <TermsCondition />,
    meta_title: "Terms & Conditions | Dueno Property",
    route: Route,
  },
  {
    path: routes.privacyPolicy,
    element: <PrivacyPolicy />,
    meta_title: "Privacy Policy | Dueno Property",
    route: Route,
  },
  {
    path: "*",
    element: <Navigate to={routes.index3} replace />,
    route: Route,
  },
];

export const authRoutes = [
  {
    path: routes.signup,
    element: <SignUp />,
    meta_title: "Sign Up | Dueno Property",
    route: Route,
  },
  {
    path: routes.signin,
    element: <SignIn />,
    meta_title: "Sign In | Dueno Property",
    route: Route,
  },
  {
    path: routes.forgotPassword,
    element: <ForgorPassword />,
    meta_title: "Forgot Password | Dueno Property",
    route: Route,
  },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
    meta_title: "Reset Password | Dueno Property",
    route: Route,
  },
  {
    path: routes.error404,
    element: <Error404 />,
    meta_title: "Page Not Found | Dueno Property",
    route: Route,
  },
  {
    path: routes.error500,
    element: <Error500 />,
    meta_title: "Server Error | Dueno Property",
    route: Route,
  },
];
