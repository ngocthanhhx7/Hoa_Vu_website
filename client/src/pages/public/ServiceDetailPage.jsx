import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import HeroBanner from '../../components/common/HeroBanner';
import ProjectGrid from '../../components/common/ProjectGrid';
import SEO from '../../components/common/SEO';
import StatsCounter from '../../components/common/StatsCounter';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { publicAPI } from '../../services/api';
import { buildCanonicalUrl, stripToText } from '../../utils/seo';

function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    publicAPI.getServiceBySlug(slug).then((res) => {
      if (res.data.success) {
        setService(res.data.data);
        publicAPI.getProjects({ category: res.data.data.category?._id, limit: 8 }).then((projectRes) => {
          if (projectRes.data.success) {
            setProjects(projectRes.data.data);
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [slug]);

  const safeHtml = useMemo(() => DOMPurify.sanitize(service?.htmlContent || ''), [service?.htmlContent]);

  if (!service) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  const seoDescription = service.seo?.description || service.shortDescription || service.description || stripToText(service.htmlContent);
  const servicePath = `/dich-vu/${service.slug}`;

  return (
    <>
      <SEO
        title={service.seo?.title || service.title}
        description={seoDescription}
        path={servicePath}
        image={service.heroImage}
        keywords={service.seo?.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: seoDescription,
          url: buildCanonicalUrl(servicePath),
          provider: {
            '@type': 'Organization',
            name: 'HOAVU BRANDING',
            url: buildCanonicalUrl('/'),
          },
          areaServed: 'VN',
        }}
      />
      <HoaVuBreadcrumb items={[{ label: 'Dịch vụ', to: '/dich-vu' }, { label: service.title }]} />
      <HeroBanner title={service.title} description={service.description} ctaText="Liên hệ tư vấn" ctaLink="/lien-he" />
      <StatsCounter />

      {(service.features?.length || safeHtml) && (
        <section className="section">
          <Container>
            {service.features?.length ? (
              <ul style={{ color: 'var(--gray-700)', lineHeight: 1.8 }}>
                {service.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            ) : null}
            {safeHtml ? <div dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ lineHeight: 1.9, color: 'var(--gray-700)' }} /> : null}
          </Container>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section">
          <Container>
            <h2 className="section-title">Dự án đã thực hiện</h2>
            <p className="mb-4" style={{ color: 'var(--gray-600)' }}>Một số dự án liên quan đến nhóm dịch vụ này.</p>
            <ProjectGrid projects={projects} />
            <div className="text-center mt-3">
              <Link to={`/du-an/${service.category?.slug || 'thiet-ke-logo'}`} className="btn-hoavu btn-hoavu--primary">Xem thêm</Link>
            </div>
          </Container>
        </section>
      )}

      <TestimonialCarousel />
    </>
  );
}

export default ServiceDetailPage;
