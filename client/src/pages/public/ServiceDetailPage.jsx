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
import { SITE_URL, buildCanonicalUrl, stripToText } from '../../utils/seo';
import { normalizeFaqs, summarizeForAi } from '../../utils/seoContent';
import { buildFaqSchema, buildServiceSchema } from '../../utils/schema';

function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    publicAPI.getServiceBySlug(slug).then((res) => {
      if (res.data.success) {
        setService(res.data.data);
        publicAPI.getProjects({ category: res.data.data.category?._id, limit: 8 }).then((projectRes) => {
          if (projectRes.data.success) setProjects(projectRes.data.data);
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [slug]);

  const safeHtml = useMemo(() => DOMPurify.sanitize(service?.htmlContent || ''), [service?.htmlContent]);

  if (!service) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  const seoDescription = service.seo?.description || service.shortDescription || service.description || stripToText(service.htmlContent);
  const servicePath = service.seo?.canonicalPath || `/dich-vu/${service.slug}`;
  const breadcrumbItems = [{ label: 'Dịch vụ', to: '/dich-vu' }, { label: service.title }];
  const faqs = normalizeFaqs(service.seo?.faqs);
  const aiSummary = summarizeForAi(service.seo?.aiSummary || service.shortDescription || service.description || service.htmlContent, 4);

  const serviceJsonLd = [
    buildServiceSchema({
      siteUrl: SITE_URL,
      path: servicePath,
      name: service.title,
      description: seoDescription,
      image: service.seo?.ogImage || service.heroImage ? buildCanonicalUrl(service.seo?.ogImage || service.heroImage) : undefined,
      features: service.features || [],
    }),
    buildFaqSchema(faqs, { visible: faqs.length > 0 }),
  ].filter(Boolean);

  return (
    <>
      <SEO
        title={service.seo?.title || service.title}
        description={seoDescription}
        path={servicePath}
        image={service.seo?.ogImage || service.heroImage}
        imageAlt={service.seo?.imageAlt || service.heroImageAlt || service.title}
        keywords={service.seo?.keywords}
        noindex={service.seo?.noindex}
        jsonLd={serviceJsonLd}
        breadcrumbItems={breadcrumbItems}
        datePublished={service.createdAt}
        dateModified={service.updatedAt}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <HeroBanner title={service.title} description={service.description} ctaText="Liên hệ tư vấn" ctaLink="/lien-he" />
      <StatsCounter />

      {(service.features?.length || safeHtml || aiSummary.length || service.offerText) && (
        <section className="section">
          <Container>
            {aiSummary.length ? (
              <div className="rich-text mb-4">
                <h2>Dịch vụ này phù hợp khi nào?</h2>
                <ul>{aiSummary.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
            {service.features?.length ? (
              <>
                <h2 className="section-title">Dịch vụ này bao gồm gì?</h2>
                <ul style={{ color: 'var(--gray-700)', lineHeight: 1.8 }}>
                  {service.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </>
            ) : null}
            {service.offerText ? (
              <div className="rich-text mb-4">
                <h2>Kết quả bàn giao</h2>
                <p>{service.offerText}</p>
              </div>
            ) : null}
            {safeHtml ? <div dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ lineHeight: 1.9, color: 'var(--gray-700)' }} /> : null}
          </Container>
        </section>
      )}

      {faqs.length ? (
        <section className="section section--gray">
          <Container>
            <h2 className="section-title">Câu hỏi thường gặp</h2>
            <div className="rich-text mt-4">
              {faqs.map((item) => (
                <div key={item.question} className="mb-3">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {projects.length > 0 && (
        <section className="section">
          <Container>
            <h2 className="section-title">Dự án đã thực hiện</h2>
            <p className="mb-4" style={{ color: 'var(--gray-600)' }}>Một số dự án liên quan đến nhóm dịch vụ này.</p>
            <ProjectGrid projects={projects} />
            <div className="text-center mt-3">
              <Link to={`/du-an/${service.category?.slug || 'thiet-ke-logo'}`} className="btn-hoavu btn-hoavu--primary" aria-label={`Xem thêm dự án ${service.title}`}>
                Xem thêm
              </Link>
            </div>
          </Container>
        </section>
      )}

      <TestimonialCarousel />
    </>
  );
}

export default ServiceDetailPage;
