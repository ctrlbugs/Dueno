import type { AgentUser } from "../types/user";

/** Showcase agents always visible on the public site (production + dev). */
export const PUBLIC_AGENT_IDS = new Set(["agent-2", "agent-3"]);

const PUBLIC_CREATED_AT = {
  emeka: "2025-05-01T10:00:00.000Z",
  sammy: "2025-05-15T10:00:00.000Z",
} as const;

const emekaNwosu: AgentUser = {
  id: "agent-2",
  firstName: "Emeka",
  lastName: "Nwosu",
  email: "emeka.nwosu@duenoproperty.com",
  phone: "+2348098765432",
  password: "",
  agencyName: "Abuja Elite Homes",
  licenseNumber: "NIESV-2023-088",
  city: "Abuja",
  state: "FCT",
  status: "approved",
  createdAt: PUBLIC_CREATED_AT.emeka,
  createdBy: "self",
  trustScore: 92,
  availability: "away",
  bio: "Licensed NIESV agent specialising in Abuja luxury homes.",
  socialLinks: {
    x: "https://x.com/duenoproperty",
    instagram: "https://instagram.com/duenoproperty",
    linkedin: "https://linkedin.com/company/duenoproperty",
  },
  registration: {
    dateOfBirth: "1990-01-01",
    nationality: "Nigerian",
    residentialAddress: "Asokoro, Abuja",
    lga: "Abuja Municipal",
    idDocumentType: "nin",
    agentType: "individual",
    yearsOfExperience: 8,
    areasOfOperation: ["Abuja", "Lagos"],
    propertyCategories: ["Residential", "Luxury Properties"],
    isLicensedPractitioner: true,
    professionalMemberships: [
      "Nigerian Institution of Estate Surveyors and Valuers (NIESV)",
    ],
    bankAccountName: "Emeka Nwosu",
    bankAccountNumber: "0123456789",
    bankName: "Access Bank",
    certifiedAccurateAt: PUBLIC_CREATED_AT.emeka,
    termsAcceptedAt: PUBLIC_CREATED_AT.emeka,
    privacyAcceptedAt: PUBLIC_CREATED_AT.emeka,
  },
};

const sammyAkindele: AgentUser = {
  id: "agent-3",
  firstName: "Sammy",
  lastName: "Akindele",
  email: "sammy.akindele@duenoproperty.com",
  phone: "+2348034567890",
  password: "",
  agencyName: "Dueno Property",
  licenseNumber: "NIESV-2024-014",
  city: "Lagos",
  state: "Lagos",
  status: "approved",
  createdAt: PUBLIC_CREATED_AT.sammy,
  createdBy: "admin",
  trustScore: 88,
  availability: "available",
  bio: "Experienced Lagos property agent helping clients buy, sell, and rent verified homes across the city.",
  socialLinks: {
    instagram: "https://instagram.com/duenoproperty",
    linkedin: "https://linkedin.com/company/duenoproperty",
    facebook: "https://facebook.com/duenoproperty",
  },
  registration: {
    dateOfBirth: "1988-06-15",
    nationality: "Nigerian",
    residentialAddress: "Victoria Island, Lagos",
    lga: "Eti-Osa",
    idDocumentType: "nin",
    agentType: "individual",
    yearsOfExperience: 6,
    areasOfOperation: ["Lagos"],
    propertyCategories: ["Residential", "Commercial"],
    isLicensedPractitioner: true,
    professionalMemberships: [
      "Nigerian Institution of Estate Surveyors and Valuers (NIESV)",
    ],
    bankAccountName: "Sammy Akindele",
    bankAccountNumber: "0987654321",
    bankName: "GTBank",
    certifiedAccurateAt: PUBLIC_CREATED_AT.sammy,
    termsAcceptedAt: PUBLIC_CREATED_AT.sammy,
    privacyAcceptedAt: PUBLIC_CREATED_AT.sammy,
  },
};

export const getPublicAgentById = (id: string): AgentUser | undefined => {
  if (id === "agent-2") return { ...emekaNwosu };
  if (id === "agent-3") return { ...sammyAkindele };
  return undefined;
};

export const getPublicAgents = (): AgentUser[] => [
  { ...emekaNwosu },
  { ...sammyAkindele },
];
