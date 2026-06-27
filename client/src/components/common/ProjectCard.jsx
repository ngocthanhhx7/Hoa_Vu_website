import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildProjectPath } from '../../utils/category';
import { resolveMediaUrl } from '../../utils/media';
import { buildProjectImageAlt } from '../../utils/seoContent';

function ProjectCard({ project }) {
  const [hasError, setHasError] = useState(false);

  const imageUrl = useMemo(() => {
    const candidate = project?.thumbnail || project?.images?.[0] || '';
    return resolveMediaUrl(candidate);
  }, [project]);

  const showImage = Boolean(imageUrl) && !hasError;
  const imageAlt = project.thumbnailAlt || buildProjectImageAlt({
    title: project.title,
    categoryName: project.category?.name,
    clientName: project.client?.name,
  });

  return (
    <Link className="project-card" to={buildProjectPath(project)} aria-label={`Xem chi tiết dự án ${project.title}`}>
      {showImage ? (
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="project-card-fallback" aria-hidden="true">
          {project.client?.name?.[0] || project.title?.[0] || 'P'}
        </div>
      )}

      <div className="project-card-overlay">
        <div className="project-card-title">{project.client?.industry || project.category?.name || 'Dự án'}</div>
        <div className="project-card-name">{project.client?.name || project.title}</div>
        <span className="project-card-chip">Chi tiết</span>
      </div>
    </Link>
  );
}

export default ProjectCard;

