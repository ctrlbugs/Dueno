const STORAGE_KEY = "_DUENO_AGENT_FOLLOWS";

type FollowEntry = {
  agentId: string;
  userId: string;
  followedAt: string;
};

const readFollows = (): FollowEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FollowEntry[];
  } catch {
    return [];
  }
};

const writeFollows = (follows: FollowEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(follows));
  window.dispatchEvent(new CustomEvent("dueno-follows-updated"));
};

export const getFollowerCount = (agentId: string): number =>
  readFollows().filter((entry) => entry.agentId === agentId).length;

export const isFollowingAgent = (agentId: string, userId: string): boolean =>
  readFollows().some(
    (entry) => entry.agentId === agentId && entry.userId === userId,
  );

export const followAgent = (agentId: string, userId: string) => {
  if (!agentId || !userId || agentId === userId) return;
  const follows = readFollows();
  if (
    follows.some(
      (entry) => entry.agentId === agentId && entry.userId === userId,
    )
  ) {
    return;
  }
  writeFollows([
    ...follows,
    { agentId, userId, followedAt: new Date().toISOString() },
  ]);
};

export const unfollowAgent = (agentId: string, userId: string) => {
  writeFollows(
    readFollows().filter(
      (entry) => !(entry.agentId === agentId && entry.userId === userId),
    ),
  );
};

export const toggleAgentFollow = (agentId: string, userId: string) => {
  if (isFollowingAgent(agentId, userId)) {
    unfollowAgent(agentId, userId);
    return false;
  }
  followAgent(agentId, userId);
  return true;
};

export const subscribeAgentFollows = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-follows-updated", handler);
  return () => window.removeEventListener("dueno-follows-updated", handler);
};
