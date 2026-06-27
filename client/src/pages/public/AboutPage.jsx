import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { BRAND } from '../../config/brand';
import { useSettings } from '../../context/useSettings';
import { resolveMediaUrl } from '../../utils/media';
import { SITE_URL, absoluteUrl } from '../../utils/seo';
import { buildLogoAlt } from '../../utils/seoContent';

function AboutPage() {
  const { settings } = useSettings();
  const companyName = settings?.companyName || BRAND.name;
  const companyLogo = resolveMediaUrl(settings?.logo || BRAND.logoFull);
  const tagline = settings?.tagline || BRAND.description;

  const steps = [
    { num: 1, title: 'Tiếp nhận thông tin', items: ['Nhận brief từ khách hàng', 'Làm rõ mục tiêu truyền thông', 'Chốt định hướng thẩm mỹ'] },
    { num: 2, title: 'Thỏa thuận và ký kết', items: ['Báo giá minh bạch', 'Thống nhất deliverables', 'Khóa timeline triển khai'] },
    { num: 3, title: 'Thực hiện dự án', items: ['Nghiên cứu visual', 'Phát triển concept', 'Hiệu chỉnh theo phản hồi'] },
    { num: 4, title: 'Bàn giao sản phẩm', items: ['Đóng gói file chuẩn', 'Bàn giao ứng dụng', 'Hướng dẫn sử dụng cơ bản'] },
    { num: 5, title: 'Đồng hành sau dự án', items: ['Hỗ trợ phát sinh hợp lý', 'Gợi ý triển khai thực tế', 'Duy trì đồng bộ thương hiệu'] },
  ];

  const standards = [
    'Logo và nhận diện được trình bày theo bối cảnh sử dụng thực tế, không chỉ là một file hình đơn lẻ.',
    'File bàn giao được sắp xếp rõ ràng để đội marketing, in ấn hoặc nội bộ có thể tiếp tục sử dụng.',
    'Định hướng hình ảnh ưu tiên sự khác biệt có kiểm soát, phù hợp ngành hàng và giai đoạn phát triển của thương hiệu.',
  ];

  const breadcrumbItems = [{ label: 'Giới thiệu' }];

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/gioi-thieu#aboutpage`,
    name: `Giới thiệu ${companyName}`,
    description: `Tìm hiểu về ${companyName}, studio thiết kế logo, nhận diện thương hiệu và visual truyền thông với quy trình làm việc rõ ràng.`,
    url: `${SITE_URL}/gioi-thieu`,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: companyName,
      url: SITE_URL,
      logo: absoluteUrl(companyLogo),
      description: settings?.footerText || BRAND.seoDescription,
      slogan: tagline,
      knowsAbout: [
        'Thiết kế logo',
        'Nhận diện thương hiệu',
        'Visual truyền thông',
        'Brand identity design',
      ],
    },
  };

  return (
    <>
      <SEO
        title="Giới thiệu"
        description={`Tìm hiểu về ${companyName}, studio thiết kế logo, nhận diện thương hiệu và visual truyền thông với quy trình làm việc rõ ràng.`}
        path="/gioi-thieu"
        image={companyLogo}
        imageAlt={settings?.logoAlt || buildLogoAlt(companyName)}
        jsonLd={aboutJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />

      <section className="section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 className="section-title">Về chúng tôi</h1>
              <p className="mt-3" style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>
                {companyName} là studio tập trung vào logo, nhận diện thương hiệu và visual truyền thông cho doanh nghiệp cần một hình ảnh tinh gọn nhưng vẫn đủ độ sang và khác biệt.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>
                Chúng tôi ưu tiên tiến trình rõ ràng, cảm quan cao cấp và khả năng biến tinh thần thương hiệu thành hệ thống hình ảnh có thể dùng thật trên nhiều nền tảng.
              </p>
              <div className="mt-4 d-flex gap-3 flex-wrap">
                <Link to="/lien-he" className="btn-hoavu btn-hoavu--primary" aria-label="Liên hệ HOAVU BRANDING để tư vấn thiết kế thương hiệu">Liên hệ tư vấn</Link>
                <Link to="/du-an" className="btn-hoavu btn-hoavu--outline" aria-label="Xem dự án thiết kế logo và nhận diện thương hiệu đã thực hiện">Xem dự án đã thực hiện</Link>
              </div>
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <div style={{ padding: 24, borderRadius: '32px', background: 'linear-gradient(145deg, rgba(16,63,173,0.12), rgba(242,205,69,0.14))', boxShadow: 'var(--shadow-lg)' }}>
                <img src={companyLogo} alt={settings?.logoAlt || buildLogoAlt(companyName)} style={{ width: 'min(100%, 320px)', display: 'block', margin: '0 auto' }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section--gray">
        <Container>
          <h2 className="section-title text-center" style={{ display: 'block' }}>Quy trình làm việc</h2>
          <Row className="mt-5">
            {steps.map((step) => (
              <Col key={step.num} lg className="mb-4">
                <div className="process-step">
                  <div className="process-step-number">{step.num}</div>
                  <h4>{step.title}</h4>
                  <ul>{step.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title">Tiêu chuẩn bàn giao</h2>
          <div className="rich-text mt-4">
            <ul>{standards.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </Container>
      </section>

      <TestimonialCarousel />
    </>
  );
}

export default AboutPage;
