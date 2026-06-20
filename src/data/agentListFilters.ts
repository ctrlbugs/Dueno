export const AGENT_LIST_STATE_OPTIONS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Owerri",
  "Delta",
] as const;

export type AgentListState = (typeof AGENT_LIST_STATE_OPTIONS)[number];

const STATE_MATCHERS: Record<
  AgentListState,
  { states: string[]; cities: string[]; areas: string[] }
> = {
  Lagos: { states: ["Lagos"], cities: ["Lagos"], areas: ["Lagos"] },
  Abuja: {
    states: ["Abuja", "FCT", "Federal Capital Territory"],
    cities: ["Abuja"],
    areas: ["Abuja"],
  },
  "Port Harcourt": {
    states: ["Rivers"],
    cities: ["Port Harcourt", "Port-Harcourt"],
    areas: ["Port Harcourt"],
  },
  Ibadan: { states: ["Oyo"], cities: ["Ibadan"], areas: ["Ibadan"] },
  Kano: { states: ["Kano"], cities: ["Kano"], areas: ["Kano"] },
  Owerri: { states: ["Imo"], cities: ["Owerri"], areas: ["Owerri"] },
  Delta: { states: ["Delta"], cities: [], areas: [] },
};

export const AGENT_LIST_DEFAULT_CITY: Record<AgentListState, string> = {
  Lagos: "Lagos",
  Abuja: "Abuja",
  "Port Harcourt": "Port Harcourt",
  Ibadan: "Ibadan",
  Kano: "Kano",
  Owerri: "Owerri",
  Delta: "Delta",
};

export const AGENT_LIST_CATEGORY_OPTIONS = ["Buy Property", "Rent Property"] as const;

const normalize = (value: string) => value.trim().toLowerCase();

export const agentMatchesListState = (
  agent: {
    state: string;
    city: string;
    registration?: { areasOfOperation?: string[] };
  },
  stateFilter: AgentListState,
): boolean => {
  const matchers = STATE_MATCHERS[stateFilter];
  const state = normalize(agent.state);
  const city = normalize(agent.city);
  const areas =
    agent.registration?.areasOfOperation?.map((area) => normalize(area)) ?? [];

  if (matchers.states.some((item) => normalize(item) === state)) return true;
  if (matchers.cities.some((item) => normalize(item) === city)) return true;
  if (matchers.areas.some((item) => areas.includes(normalize(item)))) return true;

  if (normalize(stateFilter) === state || normalize(stateFilter) === city) {
    return true;
  }

  return false;
};

export const agentMatchesListCity = (
  agent: { state: string; city: string },
  cityFilter: string,
): boolean => normalize(agent.city) === normalize(cityFilter);
