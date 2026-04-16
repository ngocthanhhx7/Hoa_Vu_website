import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import ProjectGrid from '../../components/common/ProjectGrid';
import { publicAPI } from '../../services/api';
import { normalizeMediaList, resolveMediaUrl } from '../../utils/media';

function ProjectDetailPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    publicAPI.getProjectBySlug(slug).then((res) => {
      if (res.data.success) {
        const currentProject = res.data.data;
        setProject(currentProject);
        if (currentProject.category?.slug && currentProject.category.slug !== category) {
          navigate(`/du-an/${currentProject.category.slug}/${currentProject.slug}`, { replace: true });
        }
        publicAPI.getProjects({ category: currentProject.category?._id, limit: 4 }).then((relatedRes) => {
          if (relatedRes.data.success) {
            setRelated(relatedRes.data.data.filter((item) => item._id !== currentProject._id));
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [category, navigate, slug]);

  const safeHtml = useMemo(() => DOMPurify.sanitize(project?.htmlContent || ''), [project?.htmlContent]);
  const visuals = useMemo(() => normalizeMediaList(project?.thumbnail, project?.images || []), [project]);

  if (!project) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{project.seo?.title || `${project.title} | HOA VU`}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Dự án', to: '/du-an' }, { label: project.category?.name || category, to: `/du-an/${project.category?.slug || category}` }, { label: project.title }]} />
      <section className="section project-detail-page">
        <Container>
          <Row className="justify-content-center">
            <Col xl={10}>
              <div className="project-detail-header">
                <span className="project-detail-header__eyebrow">{project.category?.name || 'Dự án'}</span>
                <h1>{project.title}</h1>
                {project.description ? <p>{project.description}</p> : null}
              </div>

              <Row className="g-4 align-items-start">
                <Col lg={8}>
                  {visuals.length > 0 ? (
                    <div className="project-visual-stack">
                      {visuals.map((item, index) => (
                        <figure key={`${item}-${index}`} className="project-visual-frame">
                          <img src={resolveMediaUrl(item)} alt={`${project.title} - visual ${index + 1}`} />
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <div className="project-visual-placeholder">Dự án chưa có hình ảnh hiển thị.</div>
                  )}

                  <div className="project-detail-content-card">
                    <div className="project-detail-content-card__label">Tên khách hàng</div>
                    <h2>{project.client?.name || project.title}</h2>

                    <div className="project-detail-meta-grid">
                      {project.client?.industry ? (
                        <div className="project-detail-meta-item">
                          <span>Lĩnh vực</span>
                          <strong>{project.client.industry}</strong>
                        </div>
                      ) : null}
                      {project.category?.name ? (
                        <div className="project-detail-meta-item">
                          <span>Danh mục</span>
                          <strong>{project.category.name}</strong>
                        </div>
                      ) : null}
                      {visuals.length ? (
                        <div className="project-detail-meta-item">
                          <span>Số lượng ảnh</span>
                          <strong>{visuals.length}</strong>
                        </div>
                      ) : null}
                    </div>

                    <div className="project-detail-richtext rich-text">
                      {safeHtml ? <div dangerouslySetInnerHTML={{ __html: safeHtml }} /> : null}
                      {!safeHtml && project.description ? <p>{project.description}</p> : null}
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <aside className="project-detail-sidebar">
                    <div className="project-detail-sidebar__card">
                      <h3>Thông tin dự án</h3>
                      {project.client?.name ? (
                        <div className="project-detail-sidebar__item">
                          <span>Khách hàng</span>
                          <strong>{project.client.name}</strong>
                        </div>
                      ) : null}
                      {project.client?.industry ? (
                        <div className="project-detail-sidebar__item">
                          <span>Lĩnh vực</span>
                          <strong>{project.client.industry}</strong>
                        </div>
                      ) : null}
                      {project.category?.name ? (
                        <div className="project-detail-sidebar__item">
                          <span>Dịch vụ</span>
                          <strong>{project.category.name}</strong>
                        </div>
                      ) : null}
                    </div>

                    {project.tags?.length ? (
                      <div className="project-detail-sidebar__card">
                        <h3>Từ khóa</h3>
                        <div className="project-detail-tag-list">
                          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      </div>
                    ) : null}
                  </aside>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section section--gray">
          <Container>
            <h2 className="section-title">Dự án liên quan</h2>
            <div className="mt-4"><ProjectGrid projects={related} /></div>
          </Container>
        </section>
      )}
    </>
  );
}

export default ProjectDetailPage;

