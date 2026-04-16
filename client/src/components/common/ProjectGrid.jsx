import ProjectCard from './ProjectCard';

function ProjectGrid({ projects }) {
  if (!projects?.length) {
    return (
      <div className="text-center py-5" style={{ color: 'var(--gray-500)' }}>
        Chưa có dự án phù hợp.
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project._id || project.slug} project={project} />
      ))}
    </div>
  );
}

export default ProjectGrid;
