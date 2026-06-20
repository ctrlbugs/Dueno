import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import {
  AGENT_LIST_CATEGORY_OPTIONS,
  AGENT_LIST_DEFAULT_CITY,
  AGENT_LIST_STATE_OPTIONS,
  agentMatchesListCity,
  agentMatchesListState,
  type AgentListState,
} from "../../../../../data/agentListFilters";
import { AGENT_OPERATION_AREAS } from "../../../../../types/agentRegistration";
import {
  getApprovedPublicAgents,
  subscribeAgents,
} from "../../../../../services/agentStore";
import type { AgentUser } from "../../../../../types/user";
import AgentGridCard from "../shared/AgentGridCard";
import AgentListSwiper from "../shared/AgentListSwiper";

const ALL_OPTION = { value: "all", label: "All" };

const AgentList = () => {
  const [agents, setAgents] = useState<AgentUser[]>(() => getApprovedPublicAgents());
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => subscribeAgents(() => setAgents(getApprovedPublicAgents())), []);

  const stateOptions = useMemo(
    () => [
      ALL_OPTION,
      ...AGENT_LIST_STATE_OPTIONS.map((value) => ({ value, label: value })),
    ],
    [],
  );

  const cityOptions = useMemo(() => {
    if (stateFilter === "all") {
      const values = [...new Set(agents.map((agent) => agent.city).filter(Boolean))].sort();
      return [ALL_OPTION, ...values.map((value) => ({ value, label: value }))];
    }

    const values = [
      ...new Set(
        agents
          .filter((agent) => agentMatchesListState(agent, stateFilter as AgentListState))
          .map((agent) => agent.city)
          .filter(Boolean),
      ),
    ].sort();

    const defaultCity = AGENT_LIST_DEFAULT_CITY[stateFilter as AgentListState];
    const merged = defaultCity
      ? [defaultCity, ...values.filter((city) => city !== defaultCity)]
      : values;

    return [ALL_OPTION, ...merged.map((value) => ({ value, label: value }))];
  }, [agents, stateFilter]);

  const categoryOptions = useMemo(() => {
    const values = new Set<string>(AGENT_LIST_CATEGORY_OPTIONS);
    agents.forEach((agent) => {
      agent.registration?.propertyCategories?.forEach((category) => values.add(category));
    });
    return [
      ALL_OPTION,
      ...[...values].sort().map((value) => ({ value, label: value })),
    ];
  }, [agents]);

  const handleStateChange = (option: { value: string; label: string } | null) => {
    const nextState = option?.value ?? "all";
    setStateFilter(nextState);

    if (nextState === "all") {
      setCityFilter("all");
      return;
    }

    setCityFilter(AGENT_LIST_DEFAULT_CITY[nextState as AgentListState] ?? nextState);
  };

  const filteredAgents = useMemo(
    () =>
      agents.filter((agent) => {
        if (
          stateFilter !== "all" &&
          !agentMatchesListState(agent, stateFilter as AgentListState)
        ) {
          return false;
        }
        if (cityFilter !== "all" && !agentMatchesListCity(agent, cityFilter)) {
          return false;
        }
        if (
          categoryFilter !== "all" &&
          !agent.registration?.propertyCategories?.includes(categoryFilter)
        ) {
          return false;
        }
        return true;
      }),
    [agents, categoryFilter, cityFilter, stateFilter],
  );

  return (
    <div className="page-wrapper">
      <Breadcrumb title="Agent List" paths={[{ label: "Agent List", active: true }]} />

      <div className="content">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-4 col-sm-6">
              <div className="mb-3">
                <label className="form-label">State</label>
                <CommonSelect
                  options={stateOptions}
                  className="select"
                  value={stateOptions.find((option) => option.value === stateFilter)}
                  onChange={handleStateChange}
                  responsiveMenuHeight
                />
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="mb-3">
                <label className="form-label">City</label>
                <CommonSelect
                  options={cityOptions}
                  className="select"
                  value={cityOptions.find((option) => option.value === cityFilter)}
                  onChange={(option) => setCityFilter(option?.value ?? "all")}
                  responsiveMenuHeight
                />
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="mb-3">
                <label className="form-label">Property Category</label>
                <CommonSelect
                  options={categoryOptions}
                  className="select"
                  value={categoryOptions.find((option) => option.value === categoryFilter)}
                  onChange={(option) => setCategoryFilter(option?.value ?? "all")}
                  responsiveMenuHeight
                />
              </div>
            </div>
          </div>

          {filteredAgents.length > 0 ? (
            <>
              <div className="d-lg-none">
                <AgentListSwiper agents={filteredAgents} />
              </div>
              <div className="row justify-content-start g-4 d-none d-lg-flex">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="col-xl-4 col-lg-6 d-flex">
                    <AgentGridCard agent={agent} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <h5 className="mb-2">No verified agents yet</h5>
              <p className="text-muted mb-0">
                Approved Dueno agents will appear here after signup and verification.
                Operating areas include {AGENT_OPERATION_AREAS.join(", ")}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
