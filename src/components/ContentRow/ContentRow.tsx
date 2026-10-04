import type { Work } from "../../features/works/types/workTypes";
import { WorkCard } from "../WorkCard/WorkCard";

export function ContentRow({ title, works }: { title: string; works: Work[] }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <div className="content-row">{works.map((work) => <WorkCard key={work.id} work={work} />)}</div>
    </section>
  );
}
