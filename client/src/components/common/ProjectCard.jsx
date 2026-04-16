import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildProjectPath } from '../../utils/category';
import { resolveMediaUrl } from '../../utils/media';

function ProjectCard({ project }) {
  const [hasError, setHasError] = useState(false);

  const imageUrl = useMemo(() => {
    const candidate = project?.thumbnail || project?.images?.[0] || '';
    return resolveMediaUrl(candidate);
  }, [project]);

  const showImage = Boolean(imageUrl) && !hasError;

  return (
    <Link className="project-card" to={buildProjectPath(project)}>
      {showImage ? (
        <img
          src={imageUrl}
          alt={project.title}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="project-card-fallback" aria-hidden="true">
          {project.client?.name?.[0] || project.title?.[0] || 'P'}
        </div>
      )}

      <div className="project-card-overlay">
        <div className="project-card-title">{project.client?.industry || project.category?.name || 'D? án'}</div>
        <div className="project-card-name">{project.client?.name || project.title}</div>
        <span className="project-card-chip">Chi ti?t</span>
      </div>
    </Link>
  );
}

export default ProjectCard;

