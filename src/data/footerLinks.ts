import { all_routes } from "../feature-module/routes/all_routes";
import { getDuenoServicePath } from "./duenoServices";

export type FooterLink = {
  label: string;
  to: string;
};

export const FOOTER_COMPANY_LINKS: FooterLink[] = [
  { label: "About Us", to: all_routes.aboutUs },
  { label: "Blog", to: all_routes.blogGrid },
  { label: "Agent Listings", to: all_routes.agentList },
  { label: "Buy Property", to: all_routes.buyProperty },
  { label: "Rent Property", to: all_routes.rentProperty },
  { label: "Client Stories", to: `${all_routes.index3}#client-stories` },
];

export const FOOTER_USEFUL_LINKS: FooterLink[] = [
  { label: "Privacy Policy", to: all_routes.privacyPolicy },
  { label: "Terms & Condition", to: all_routes.termsCondition },
  { label: "Mortgage Service", to: getDuenoServicePath("mortgages") },
  { label: "Moving Service", to: getDuenoServicePath("moving-services") },
  { label: "Cleaning Services", to: getDuenoServicePath("property-cleaning") },
  { label: "Contact Us", to: all_routes.contactUs },
];
