import type { EstateProperty } from "../data/estateProperties";
import { stripPriceDigits } from "./nairaPrice";

export type ListingSortBy = "Default" | "A-Z";
export type ListingPriceRange = "Low to High" | "High to Low";

export const parsePropertyPriceNumeric = (price: string): number => {
  const digits = stripPriceDigits(price);
  return digits ? Number(digits) : 0;
};

export const sortEstateProperties = (
  properties: EstateProperty[],
  sortBy: ListingSortBy,
  priceRange: ListingPriceRange,
): EstateProperty[] => {
  const sorted = [...properties];

  if (sortBy === "A-Z") {
    sorted.sort((a, b) =>
      (a.fullTitle || a.title).localeCompare(b.fullTitle || b.title, undefined, {
        sensitivity: "base",
      }),
    );
    return sorted;
  }

  if (priceRange === "Low to High") {
    sorted.sort(
      (a, b) =>
        parsePropertyPriceNumeric(a.price) - parsePropertyPriceNumeric(b.price),
    );
  } else {
    sorted.sort(
      (a, b) =>
        parsePropertyPriceNumeric(b.price) - parsePropertyPriceNumeric(a.price),
    );
  }

  return sorted;
};
