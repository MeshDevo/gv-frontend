import { useState } from "react";
import { FilterPills } from "../components/FilterPills/FilterPills";
import { WorkCard } from "../components/WorkCard/WorkCard";
import { fetchPublishedWorks } from "../features/works/services/workApiService";
import { useRemoteData } from "../features/works/hooks/useRemoteData";
import { WORK_TYPE, type WorkType } from "../features/works/types/workTypes";

const TYPE_FILTER_OPTIONS: { label: string; value: WorkType | "" }[] = [
  { label: "All", value: "" },
  ...Object.values(WORK_TYPE).map((type) => ({ label: type.charAt(0) + type.slice(1).toLowerCase(), value: type })),
];

export function WorksPage() {
  const [selectedType, setSelectedType] = useState<WorkType | "">("");
  const worksState = useRemoteData(() => fetchPublishedWorks(selectedType || undefined), selectedType);

  return (
    <main className="page">
      <h1>Works</h1>
      <FilterPills options={TYPE_FILTER_OPTIONS} selectedValue={selectedType} onSelect={setSelectedType} />
      {worksState.status === "loading" && <p className="message">Loading works…</p>}
      {worksState.status === "error" && <p className="message">Could not load works. Check that the API is running.</p>}
      {worksState.status === "ready" && worksState.data.items.length === 0 && (
        <p className="message">No published works in this category yet.</p>
      )}
      {worksState.status === "ready" && (
        <div className="works-grid">{worksState.data.items.map((work) => <WorkCard key={work.id} work={work} />)}</div>
      )}
    </main>
  );
}
