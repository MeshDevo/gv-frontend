import { useParams } from "react-router-dom";
import { fetchPublishedWorkById } from "../features/works/services/workApiService";
import { useRemoteData } from "../features/works/hooks/useRemoteData";

// The episode grid needs the dubbed module's endpoints; it is added in the next step.
export function WorkDetailPage() {
  const { workId = "" } = useParams();
  const workState = useRemoteData(() => fetchPublishedWorkById(workId), workId);
  if (workState.status === "loading") return <p className="page message">Loading…</p>;
  if (workState.status === "error") return <p className="page message">This work could not be found.</p>;

  const work = workState.data;
  const coverUrl = work.coverUrl ?? work.thumbnailUrl;
  const releaseYear = work.releaseDate ? `, ${new Date(work.releaseDate).getFullYear()}` : "";
  return (
    <main className="page detail">
      <div className="detail-cover" style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined} />
      <div>
        <h1>{work.title}</h1>
        <p className="detail-meta">{work.type.toLowerCase()}{releaseYear}</p>
        {work.description && <p>{work.description}</p>}
      </div>
    </main>
  );
}
