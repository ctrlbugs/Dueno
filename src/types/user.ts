export type AgentStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "suspended";

export type UserRole = "buyer" | "agent" | "admin";

export type AgentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  agencyName: string;
  licenseNumber: string;
  city: string;
  state: string;
  status: AgentStatus;
  createdAt: string;
  createdBy: "admin" | "self";
  notes?: string;
  avatarDataUrl?: string;
  trustScore?: number;
  bio?: string;
  registration?: import("./agentRegistration").AgentRegistrationDetails;
};

export type BuyerUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
};

export type PublicSession = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agentStatus?: AgentStatus;
};

export type ListingImage = {
  id: string;
  name: string;
  dataUrl: string;
};

export type PendingListing = import("./listing").ListingRecord;

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin";
  token: string;
};
