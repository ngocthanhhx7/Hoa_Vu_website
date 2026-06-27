import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { FiArrowRight, FiAward, FiCheckCircle, FiEye, FiHeart, FiMessageCircle, FiTarget } from 'react-icons/fi';
import HeroBanner from '../../components/common/HeroBanner';
import ProjectGrid from '../../components/common/ProjectGrid';
import SEO from '../../components/common/SEO';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { BRAND } from '../../config/brand';
import { useSettings } from '../../context/useSettings';
import { publicAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import { SITE_URL, absoluteUrl } from '../../utils/seo';
import { buildServiceCtaLabel } from '../../utils/seoContent';
import { buildProfessionalServiceSchema } from '../../utils/schema';

function HomePage() {
  const { settings } = useSettings();
  const companyName = settings?.companyName || BRAND.name;
  const companyLogo = resolveMediaUrl(settings?.logo || BRAND.logoFull);
  const tagline = settings?.tagline || BRAND.description;

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    publicAPI.getBanners().then((res) => {
      if (res.data.success) setBannerImages(res.data.data);
    }).catch(() => {});

    publicAPI.getFeaturedProjects(8).then((res) => {
      if (res.data.success) setProjects(res.data.data);
    }).catch(() => {});

    publicAPI.getServices().then((res) => {
      if (res.data.success) setServices(res.data.data);
    }).catch(() => {});
  }, []);

  const introCards = useMemo(() => ([
    { icon: <FiHeart />, title: 'TEAM / ĐỘI NGŨ', desc: 'HOAVU là đơn vị thiết kế logo với tinh thần trẻ, linh hoạt và luôn tìm cách làm tốt hơn qua từng dự án. Đội ngũ ưu tiên giải pháp có thể triển khai thật, không chỉ đẹp trên bản trình bày.' },
    { icon: <FiEye />, title: 'VISION / TẦM NHÌN', desc: 'HOAVU hướng đến việc đồng hành cùng doanh nghiệp xây dựng hình ảnh thương hiệu rõ ràng, dễ nhận diện và có khả năng mở rộng trên nhiều điểm chạm truyền thông.' },
    { icon: <FiTarget />, title: 'MISSION / SỨ MỆNH', desc: 'HOAVU biến những ý tưởng khởi đầu thành nền tảng thương hiệu có cấu trúc, giúp doanh nghiệp tự tin triển khai logo, nhận diện và visual truyền thông nhất quán.' },
    { icon: <FiAward />, title: 'CORE VALUE / GIÁ TRỊ CỐT LÕI', desc: 'Chuyên nghiệp trong quy trình, sáng tạo trong thiết kế và tận tâm trong phản hồi là ba nguyên tắc giúp HOAVU giữ chất lượng qua từng dự án.' },
  ]), []);

  const aiSearchCards = useMemo(() => ([
    {
      title: 'HOAVU làm gì?',
      desc: `${companyName} tư vấn và thiết kế logo, hệ thống nhận diện thương hiệu, visual truyền thông và các ấn phẩm giúp doanh nghiệp có hình ảnh rõ ràng, nhất quán và dễ ghi nhớ.`,
    },
    {
      title: 'Phù hợp với ai?',
      desc: 'Dịch vụ phù hợp với doanh nghiệp mới cần xây dựng thương hiệu từ đầu, thương hiệu đang tái định vị hoặc đội ngũ cần chuẩn hóa hình ảnh trước khi mở rộng truyền thông.',
    },
    {
      title: 'Quy trình tư vấn nhanh',
      desc: 'Khách hàng gửi brief, HOAVU làm rõ mục tiêu, đề xuất hướng thiết kế, triển khai concept và bàn giao bộ file ứng dụng theo phạm vi đã thống nhất.',
    },
  ]), [companyName]);

  const heroImages = bannerImages.length > 0 ? bannerImages : [BRAND.banner];

  const homeJsonLd = [
    buildProfessionalServiceSchema({
      siteUrl: SITE_URL,
      name: companyName,
      description: settings?.seo?.description || settings?.footerText || BRAND.seoDescription,
      image: absoluteUrl(settings?.seo?.ogImage || BRAND.defaultImage),
      logo: absoluteUrl(companyLogo),
      offers: services.map((service) => ({
        name: service.title,
        description: service.shortDescription || service.description || '',
        url: `${SITE_URL}/dich-vu/${service.slug}`,
      })),
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Dự án nổi bật của HOAVU BRANDING',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: projects.length,
      itemListElement: projects.slice(0, 8).map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/du-an/${project.category?.slug || 'thiet-ke-logo'}/${project.slug}`,
        name: project.title,
      })),
    },
  ];

  return (
    <>
      <SEO
        title={settings?.seo?.title || 'Thiết kế logo và nhận diện thương hiệu'}
        description={settings?.seo?.description || settings?.footerText || BRAND.seoDescription}
        path={settings?.seo?.canonicalPath || '/'}
        image={settings?.seo?.ogImage || BRAND.banner}
        imageAlt={settings?.seo?.imageAlt || 'Banner dịch vụ thiết kế logo và nhận diện thương hiệu HOAVU'}
        noindex={settings?.seo?.noindex}
        keywords={settings?.seo?.keywords?.length ? settings.seo.keywords : ['thiết kế logo', 'nhận diện thương hiệu', 'thiết kế branding', companyName]}
        jsonLd={homeJsonLd}
      />
      <h1 className="visually-hidden">{companyName} - {tagline}</h1>

      <HeroBanner bannerImages={heroImages} />

      <section className="section section--gray">
        <Container>
          <h2 className="section-title">HOAVU BRANDING giúp gì cho doanh nghiệp?</h2>
          <Row className="mt-4">
            {aiSearchCards.map((card) => (
              <Col key={card.title} lg={4} md={6} className="mb-4">
                <div className="intro-card h-100">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title">Giới thiệu</h2>
          <Row className="mt-4">
            {introCards.map((card, index) => (
              <Col key={card.title} lg={3} md={6} className="mb-4">
                <div className="intro-card h-100 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="intro-card-icon" aria-hidden="true">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <Link to="/gioi-thieu" className="detail-link" aria-label="Xem thêm giới thiệu về HOAVU BRANDING">Chi tiết <FiArrowRight /></Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section section--primary home-services-section">
        <Container>
          <div className="home-services-header">
            <div>
              <span className="section-eyebrow section-eyebrow--light">Branding solutions</span>
              <h2 className="section-title">Dịch vụ</h2>
            </div>
            <p>
              Các giải pháp thiết kế được xây dựng theo từng mục tiêu thương hiệu: từ logo, bộ nhận diện đến ấn phẩm truyền thông và nền tảng số.
            </p>
          </div>
          {services.length > 0 ? (
            <Row className="home-services-grid g-4">
              {services.map((service, index) => (
                <Col key={service._id} lg={4} md={6} className="mb-4">
                  <Link to={`/dich-vu/${service.slug}`} className="service-card-link d-block h-100" aria-label={buildServiceCtaLabel(service.title)}>
                    <div className="service-card">
                      <div className="service-card-top">
                        <span className="service-card-index">0{index + 1}</span>
                        <div className="service-card-icon" aria-hidden="true">&#127912;</div>
                      </div>
                      <h3>{service.title}</h3>
                      <ul>
                        {service.features?.slice(0, 5).map((feature) => (
                          <li key={feature}><FiCheckCircle aria-hidden="true" /> <span>{feature}</span></li>
                        ))}
                      </ul>
                      <span className="service-card-cta">Xem chi tiết <FiArrowRight aria-hidden="true" /></span>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="home-empty-state home-empty-state--primary">
              <h3>Đang cập nhật dịch vụ</h3>
              <p>Các gói thiết kế sẽ được hiển thị sau khi dữ liệu được đồng bộ. Bạn vẫn có thể liên hệ để được tư vấn nhanh.</p>
              <Link to="/lien-he" className="btn-hoavu btn-hoavu--white" aria-label="Tư vấn dịch vụ thiết kế thương hiệu">
                Tư vấn dịch vụ <FiMessageCircle aria-hidden="true" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title">Dự án</h2>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            Một số dự án nổi bật thể hiện cách {companyName} triển khai mood thương hiệu, logo và chất liệu thị giác đồng nhất.
          </p>
          <ProjectGrid projects={projects} />
          <div className="text-center mt-4">
            <Link to="/du-an" className="btn-hoavu btn-hoavu--primary" aria-label="Xem thêm dự án thiết kế logo và nhận diện thương hiệu">
              Xem thêm <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <TestimonialCarousel />
    </>
  );
}

export default HomePage;
