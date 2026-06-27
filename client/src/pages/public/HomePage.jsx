import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { FiArrowRight, FiAward, FiCheckCircle, FiEye, FiHeart, FiMessageCircle, FiTarget } from 'react-icons/fi';
import HeroBanner from '../../components/common/HeroBanner';
import ProjectGrid from '../../components/common/ProjectGrid';
import SEO from '../../components/common/SEO';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { BRAND } from '../../config/brand';
import { publicAPI } from '../../services/api';
import { SITE_URL, absoluteUrl } from '../../utils/seo';
import { useSettings } from '../../context/useSettings';
import { resolveMediaUrl } from '../../utils/media';

function HomePage() {
  const { settings } = useSettings();
  const companyName = settings?.companyName || BRAND.name;
  const companyLogo = resolveMediaUrl(settings?.logo || BRAND.logoFull);
  const tagline = settings?.tagline || BRAND.description;
  const facebookUrl = settings?.socialLinks?.facebook || BRAND.contact.facebook;

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    publicAPI.getBanners().then((res) => {
      if (res.data.success) {
        setBannerImages(res.data.data);
      }
    }).catch(() => {});

    publicAPI.getFeaturedProjects(8).then((res) => {
      if (res.data.success) {
        setProjects(res.data.data);
      }
    }).catch(() => {});

    publicAPI.getServices().then((res) => {
      if (res.data.success) {
        setServices(res.data.data);
      }
    }).catch(() => {});
  }, []);

  const introCards = useMemo(() => ([
    { icon: <FiHeart />, title: 'TEAM / ĐỘI NGŨ', desc: 'Hoavu là đơn vị thiết kế logo với tinh thần trẻ, đầy nhiệt huyết, linh hoạt và luôn tìm cách làm tốt hơn qua từng dự án. Không ngừng học hỏi, cập nhật và đổi mới để mỗi thiết kế không chỉ đẹp mà còn hiệu quả khi triển khai thực tế.' },
    { icon: <FiEye />, title: 'VISION / TẦM NHÌN', desc: 'Trong 5 năm tới, Hoavu hướng đến việc đồng hành và hỗ trợ hơn 5000 khách hàng xây dựng hình ảnh thương hiệu rõ ràng, dễ nhận diện và triển khai thực tế hiệu quả.' },
    { icon: <FiTarget />, title: 'MISSION / SỨ MỆNH', desc: 'Hoavu biến những ý tưởng khởi đầu trở thành nền tảng thương hiệu rõ ràng và có giá trị lâu dài, xây dựng nền tảng vững chắc để tiếp tục phát triển trong tương lai.' },
    { icon: <FiAward />, title: 'CORE VALUE / GIÁ TRỊ CỐT LÕI', desc: '"Chuyên nghiệp - Sáng tạo - Tận tâm" Chuyên nghiệp trong công việc, sáng tạo trong thiết kế, tận tâm trong phục vụ khách hàng.' },
  ]), []);

  const heroImages = bannerImages.length > 0 ? bannerImages : [BRAND.banner];

  // LocalBusiness + ProfessionalService schema for homepage
  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#localbusiness`,
      name: companyName,
      alternateName: BRAND.shortName,
      url: SITE_URL,
      image: absoluteUrl(BRAND.defaultImage),
      logo: absoluteUrl(companyLogo),
      description: settings?.footerText || BRAND.seoDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hồ Chí Minh',
        addressCountry: 'VN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Vietnam',
      },
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
      sameAs: [facebookUrl].filter(Boolean),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Dịch vụ thiết kế thương hiệu',
        itemListElement: services.map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.shortDescription || service.description || '',
            url: `${SITE_URL}/dich-vu/${service.slug}`,
          },
          position: index + 1,
        })),
      },
    },
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
        title="Thiết kế logo và nhận diện thương hiệu"
        description={settings?.footerText || BRAND.seoDescription}
        path="/"
        image={BRAND.banner}
        keywords={['thiết kế logo', 'nhận diện thương hiệu', 'thiết kế branding', companyName]}
        jsonLd={homeJsonLd}
      />
      <h1 className="visually-hidden">{companyName} - {tagline}</h1>

      <HeroBanner bannerImages={heroImages} />

      <section className="section">
        <Container>
          <h2 className="section-title">Giới thiệu</h2>
          <Row className="mt-4">
            {introCards.map((card, index) => (
              <Col key={card.title} lg={3} md={6} className="mb-4">
                <div className="intro-card h-100 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="intro-card-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <Link to="/gioi-thieu" className="detail-link">Chi tiết <FiArrowRight /></Link>
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
              Các giải pháp thiết kế được xây dựng theo từng mục tiêu thương hiệu: từ logo, bộ nhận diện đến gian hàng và nền tảng số.
            </p>
          </div>
          {services.length > 0 ? (
            <Row className="home-services-grid g-4">
              {services.map((service, index) => (
                <Col key={service._id} lg={4} md={6} className="mb-4">
                  <Link to={`/dich-vu/${service.slug}`} className="service-card-link d-block h-100">
                    <div className="service-card">
                      <div className="service-card-top">
                        <span className="service-card-index">0{index + 1}</span>
                        <div className="service-card-icon">&#127912;</div>
                      </div>
                      <h3>{service.title}</h3>
                      <ul>
                        {service.features?.slice(0, 5).map((feature) => (
                          <li key={feature}><FiCheckCircle /> <span>{feature}</span></li>
                        ))}
                      </ul>
                      <span className="service-card-cta">Xem chi tiết <FiArrowRight /></span>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="home-empty-state home-empty-state--primary">
              <h3>Đang cập nhật dịch vụ</h3>
              <p>Các gói thiết kế sẽ được hiển thị sau khi dữ liệu được đồng bộ. Bạn vẫn có thể liên hệ để được tư vấn nhanh.</p>
              <Link to="/lien-he" className="btn-hoavu btn-hoavu--white">
                Tư vấn dịch vụ <FiMessageCircle />
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
            <Link to="/du-an" className="btn-hoavu btn-hoavu--primary">
              Xem thêm <FiArrowRight />
            </Link>
          </div>
        </Container>
      </section>

      {/* <StatsCounter /> */}
      <TestimonialCarousel />
    </>
  );
}

export default HomePage;
