import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { SITE_URL } from '../../utils/seo';
import { buildServiceCtaLabel } from '../../utils/seoContent';
import { buildCollectionPageSchema } from '../../utils/schema';

function ServicesListPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    publicAPI.getServices().then((res) => {
      if (res.data.success) {
        setServices(res.data.data);
      }
    }).catch(() => {});
  }, []);

  const breadcrumbItems = [{ label: 'Dịch vụ' }];
  const title = 'Dịch vụ thiết kế thương hiệu';
  const description = 'Khám phá các dịch vụ thiết kế logo, nhận diện thương hiệu và visual truyền thông của HOAVU BRANDING cho doanh nghiệp.';

  const servicesJsonLd = buildCollectionPageSchema({
    siteUrl: SITE_URL,
    path: '/dich-vu',
    name: title,
    description,
    items: services.map((service) => ({
      url: `${SITE_URL}/dich-vu/${service.slug}`,
      name: service.title,
      description: service.shortDescription || service.description,
    })),
  });

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/dich-vu"
        keywords={['dịch vụ thiết kế logo', 'nhận diện thương hiệu', 'thiết kế thương hiệu']}
        jsonLd={servicesJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="section">
        <Container>
          <h1 className="section-title">Dịch vụ</h1>
          <p className="mt-3 mb-4" style={{ color: 'var(--gray-600)' }}>
            Các nhóm dịch vụ được thiết kế để doanh nghiệp có thể bắt đầu từ logo, mở rộng sang nhận diện và tiếp tục triển khai trên nền tảng số.
          </p>
          <Row>
            {services.map((service) => (
              <Col key={service._id} lg={4} md={6} className="mb-4">
                <div className="service-card">
                  <div className="service-card-icon" aria-hidden="true">&#127912;</div>
                  <h3>{service.title}</h3>
                  <p style={{ color: 'var(--gray-600)', minHeight: 72 }}>{service.shortDescription || service.description}</p>
                  <ul>
                    {service.features?.slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <Link to={`/dich-vu/${service.slug}`} className="btn-hoavu btn-hoavu--outline mt-3" aria-label={buildServiceCtaLabel(service.title)}>
                    Xem chi tiết
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ServicesListPage;
