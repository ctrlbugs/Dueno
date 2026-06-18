import { getDevSeedBuyers } from "../config/devAccounts";
import type { BuyerUser } from "../types/user";

const STORAGE_KEY = "_DUENO_BUYERS";

const readBuyers = (): BuyerUser[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedBuyers();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as BuyerUser[];
  } catch {
    const seeded = seedBuyers();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const seedBuyers = (): BuyerUser[] => getDevSeedBuyers();

const writeBuyers = (buyers: BuyerUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buyers));
};

export const getBuyerByEmail = (email: string): BuyerUser | undefined =>
  readBuyers().find(
    (buyer) => buyer.email.toLowerCase() === email.toLowerCase()
  );

export const authenticateBuyer = (
  email: string,
  password: string
): BuyerUser | null => {
  const buyer = getBuyerByEmail(email);
  if (!buyer || buyer.password !== password) return null;
  return buyer;
};

export const createBuyer = (input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): BuyerUser => {
  const buyers = readBuyers();
  if (getBuyerByEmail(input.email)) {
    throw new Error("An account with this email already exists.");
  }

  const buyer: BuyerUser = {
    ...input,
    id: `buyer-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };

  writeBuyers([buyer, ...buyers]);
  return buyer;
};
