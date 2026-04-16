import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import { publicAPI } from '../../services/api';

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

  return (
    <>
      <Helmet>
        <title>{page.title} | HOA VU</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Chính sách', to: '/chinh-sach/chinh-sach-va-quy-dinh' }, { label: page.title }]} />
      <section className="section">
        <Container>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ maxWidth: 900, lineHeight: 2, color: 'var(--gray-700)' }} />
        </Container>
      </section>
    </>
  );
}

export default PolicyPage;
