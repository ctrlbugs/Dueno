export type IdDocumentType =
  | "nin"
  | "international_passport"
  | "drivers_license"
  | "voters_card";

export type AgentBusinessType = "individual" | "company";

export type AgentGender =
  | "male"
  | "female"
  | "other"
  | "prefer_not_to_say";

export type AgentRegistrationDetails = {
  middleName?: string;
  dateOfBirth: string;
  gender?: AgentGender;
  nationality: string;
  profilePhotoDataUrl?: string;
  alternatePhone?: string;
  residentialAddress: string;
  lga: string;
  idDocumentType: IdDocumentType;
  idDocumentDataUrl?: string;
  agentType: AgentBusinessType;
  companyName?: string;
  cacRegistrationNumber?: string;
  cacCertificateDataUrl?: string;
  yearsOfExperience: number;
  areasOfOperation: string[];
  propertyCategories: string[];
  isLicensedPractitioner: boolean;
  professionalMemberships: string[];
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  certifiedAccurateAt: string;
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
};

export const ID_DOCUMENT_LABELS: Record<IdDocumentType, string> = {
  nin: "NIN Slip",
  international_passport: "International Passport",
  drivers_license: "Driver's License",
  voters_card: "Voter's Card",
};

export const AGENT_OPERATION_AREAS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Enugu",
  "Kano",
  "Ibadan",
  "Other",
] as const;

export const AGENT_PROPERTY_CATEGORIES = [
  "Buy Property",
  "Rent Property",
  "Residential",
  "Commercial",
  "Land",
  "Short-let",
  "Luxury Properties",
] as const;

export const PROFESSIONAL_MEMBERSHIPS = [
  "Nigerian Institution of Estate Surveyors and Valuers (NIESV)",
  "Estate Surveyors and Valuers Registration Board of Nigeria (ESVARBON)",
  "Association of Estate Agents in Nigeria",
  "Other",
] as const;

export const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Suntrust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  "Other",
] as const;
