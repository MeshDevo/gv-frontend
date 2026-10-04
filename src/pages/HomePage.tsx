import { Link } from "react-router-dom";
import { ContentRow } from "../components/ContentRow/ContentRow";
import { fetchPublishedWorks } from "../features/works/services/workApiService";
import { useRemoteData } from "../features/works/hooks/useRemoteData";

export function HomePage() {
  const worksState = useRemoteData(() => fetchPublishedWorks(), "home");
  if (worksState.status === "loading") return <p className="page message">Loading works…</p>;
  if (worksState.status === "error") return <p className="page message">Could not load works. Check that the API is running.</p>;

  const works = worksState.data.items;
  const featuredWork = works[0];
  if (!featuredWork) return <p className="page message">No published works yet. Add one from the Controller.</p>;

  const heroImage = featuredWork.coverUrl ?? featuredWork.thumbnailUrl;
  const heroStyle = heroImage
    ? { backgroundImage: `url(${heroImage})` }
    : { background: "linear-gradient(120deg,#1d2430,#0f1115)" };
  return (
    <main className="page">
      <section className="hero" style={heroStyle}>
        <div className="hero-content">
          <small>Golden Voice {featuredWork.type.toLowerCase()}</small>
          <h1>{featuredWork.title}</h1>
          {featuredWork.description && <p>{featuredWork.description}</p>}
          <div className="hero-actions">
            <Link className="button-primary" to={`/works/${featuredWork.id}`}>Watch now</Link>
            <Link className="button-secondary" to="/works">Explore</Link>
          </div>
        </div>
      </section>
      <ContentRow title="Featured works" works={works} />
    </main>
  );
}
