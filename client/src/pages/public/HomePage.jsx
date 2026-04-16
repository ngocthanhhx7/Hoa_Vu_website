import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { FiArrowRight, FiAward, FiEye, FiHeart, FiTarget } from 'react-icons/fi';
import HeroBanner from '../../components/common/HeroBanner';
import ProjectGrid from '../../components/common/ProjectGrid';
import StatsCounter from '../../components/common/StatsCounter';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { BRAND, buildTitle } from '../../config/brand';
import { publicAPI } from '../../services/api';

function HomePage() {
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
    { icon: <FiHeart />, title: 'TEAM / ĐỘI NGŨ', desc: 'Một studio gọn, linh hoạt và tập trung vào việc biến brief kinh doanh thành hệ thống hình ảnh có bản lĩnh riêng.' },
    { icon: <FiEye />, title: 'VISION / TẦM NHÌN', desc: 'Xây dựng những thương hiệu có thần thái thị giác rõ ràng, sang trọng và dễ nhận ra trên mọi điểm chạm.' },
    { icon: <FiTarget />, title: 'MISSION / SỨ MỆNH', desc: 'Thiết kế logo, nhận diện và ấn phẩm truyền thông vừa đẹp, vừa đủ lực để nâng cảm nhận thương hiệu.' },
    { icon: <FiAward />, title: 'CORE VALUE / GIÁ TRỊ CỐT LÕI', desc: 'Tinh gọn, chỉn chu, có thẩm mỹ và luôn ưu tiên tính ứng dụng thực tế trong từng quyết định thiết kế.' },
  ]), []);

  const heroImages = bannerImages.length > 0 ? bannerImages : [BRAND.banner];

  return (
    <>
      <Helmet>
        <title>{buildTitle('Trang chủ')}</title>
      </Helmet>

      <HeroBanner bannerImages={heroImages} />

      <section className="section">
        <Container>
          <h2 className="section-title">Giới thiệu</h2>
          <Row className="mt-4">
            {introCards.map((card, index) => (
              <Col key={card.title} lg={3} md={6} className="mb-4">
                <div className="intro-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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

      <section className="section section--primary">
        <Container>
          <h2 className="section-title">Dịch vụ</h2>
          <Row className="mt-4">
            {services.map((service) => (
              <Col key={service._id} lg={4} md={6} className="mb-4">
                <Link to={`/dich-vu/${service.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="service-card">
                    <div className="service-card-icon">&#127912;</div>
                    <h3>{service.title}</h3>
                    <ul>
                      {service.features?.slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title">Dự án</h2>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            Một số dự án nổi bật thể hiện cách {BRAND.shortName} triển khai mood thương hiệu, logo và chất liệu thị giác đồng nhất.
          </p>
          <ProjectGrid projects={projects} />
          <div className="text-center mt-4">
            <Link to="/du-an" className="btn-hoavu btn-hoavu--primary">
              Xem thêm <FiArrowRight />
            </Link>
          </div>
        </Container>
      </section>

      <StatsCounter />
      <TestimonialCarousel />
    </>
  );
}

export default HomePage;
