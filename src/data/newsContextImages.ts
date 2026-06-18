/** Curated images matched to news categories and common story themes. */
export const PROPERTY_SALES_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
];

export const RENTING_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
];

export const INVEST_IMAGES = [
  "https://images.unsplash.com/photo-1605276374104-de8862ebb770?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?auto=format&fit=crop&w=1200&q=80",
];

export const MORTGAGE_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
];

export const MARKET_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611348586804-61bf6c080040?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1577230655745-f82395f41739?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
];

export const NIGERIA_AFRICA_IMAGES = [
  "https://images.unsplash.com/photo-1611348586804-61bf6c080040?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1577230655745-f82395f41739?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
];

export const SECURITY_GOV_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1577230655745-f82395f41739?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611348586804-61bf6c080040?auto=format&fit=crop&w=1200&q=80",
];

export const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  "Property Sales": PROPERTY_SALES_IMAGES,
  Renting: RENTING_IMAGES,
  Invest: INVEST_IMAGES,
  Mortgages: MORTGAGE_IMAGES,
  "Market News": MARKET_NEWS_IMAGES,
  Moving: RENTING_IMAGES,
  Artisan: PROPERTY_SALES_IMAGES,
  Cleaning: RENTING_IMAGES,
};

export const KEYWORD_IMAGE_RULES: { pattern: RegExp; images: string[] }[] = [
  {
    pattern:
      /police|constable|security|law enforcement|weapon|marksmanship|governor|government|tinubu|fcta|ministry/i,
    images: SECURITY_GOV_IMAGES,
  },
  {
    pattern:
      /kogi|nigeria|nigerian|lagos|abuja|africa|african|port harcourt|ibadan|enugu|oyo|fct/i,
    images: NIGERIA_AFRICA_IMAGES,
  },
  {
    pattern: /mortgage|loan|financ|interest rate|lending|bank|credit/i,
    images: MORTGAGE_IMAGES,
  },
  {
    pattern: /rent|rental|lease|tenant|landlord/i,
    images: RENTING_IMAGES,
  },
  {
    pattern: /invest|portfolio|returns|market growth|developer/i,
    images: INVEST_IMAGES,
  },
  {
    pattern: /buy|buying|sale|sell|homebuy|purchase|condo|villa|home/i,
    images: PROPERTY_SALES_IMAGES,
  },
];

export const ALL_CONTEXTUAL_IMAGES = [
  ...new Set([
    ...PROPERTY_SALES_IMAGES,
    ...RENTING_IMAGES,
    ...INVEST_IMAGES,
    ...MORTGAGE_IMAGES,
    ...MARKET_NEWS_IMAGES,
    ...NIGERIA_AFRICA_IMAGES,
    ...SECURITY_GOV_IMAGES,
  ]),
];
