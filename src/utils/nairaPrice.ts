const NAIRA_SYMBOL = "₦";

export const stripPriceDigits = (value: string) => value.replace(/\D/g, "");

export const formatNairaPrice = (value: string | number): string => {
  const digits =
    typeof value === "number"
      ? String(Math.max(0, Math.round(value)))
      : stripPriceDigits(value);

  if (!digits) return "";

  return `${NAIRA_SYMBOL}${Number(digits).toLocaleString("en-NG")}`;
};

/** Normalize stored or raw prices for display (e.g. 3000000 → ₦3,000,000). */
export const formatPropertyPrice = (price: string): string => {
  const trimmed = price?.trim() ?? "";
  if (!trimmed) return "";

  const digits = stripPriceDigits(trimmed);
  if (!digits) return trimmed;

  return formatNairaPrice(digits);
};
