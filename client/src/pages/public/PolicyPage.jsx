import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { stripToText } from '../../utils/seo';

function PolicyPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    publicAPI.getPageBySlug(slug).then((res) => {
      if (res.data.success) {
        setPage(res.data.data);
      }
    }).catch(() => {});
  }, [slug]);

  const safeHtml = useMemo(() => DOMPurify.sanitize(page?.htmlContent || ''), [page?.htmlContent]);

  if (!page) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  const pagePath = `/chinh-sach/${page.slug}`;

  return (
    <>
      <SEO
        title={page.seo?.title || page.title}
        description={page.seo?.description || stripToText(page.htmlContent)}
        path={pagePath}
        keywords={page.seo?.keywords}
        breadcrumbItems={[
          { label: 'Chính sách', to: '/chinh-sach/chinh-sach-va-quy-dinh' },
          { label: page.title }
        ]}
      />
      <HoaVuBreadcrumb items={[{ label: 'Chính sách', to: '/chinh-sach/chinh-sach-va-quy-dinh' }, { label: page.title }]} />
      <section className="section">
        <Container>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24, color: 'var(--color-text, #142446)' }}>{page.title}</h1>
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ maxWidth: 900, lineHeight: 1.85, color: 'var(--color-text, #142446)' }} />
        </Container>
      </section>
    </>
  );
}

export default PolicyPage;
