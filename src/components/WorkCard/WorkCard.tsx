import { Link } from "react-router-dom";
import type { Work } from "../../features/works/types/workTypes";

export function WorkCard({ work }: { work: Work }) {
  // Without an uploaded image the CSS gradient placeholder is shown.
  const imageStyle = work.thumbnailUrl ? { backgroundImage: `url(${work.thumbnailUrl})` } : undefined;
  return (
    <Link to={`/works/${work.id}`} className="work-card">
      <div className="work-card-image" style={imageStyle} />
      <div className="work-card-info">
        <div className="work-card-type">{work.type}</div>
        <div className="work-card-title">{work.title}</div>
      </div>
    </Link>
  );
}
