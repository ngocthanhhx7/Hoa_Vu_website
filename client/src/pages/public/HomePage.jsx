import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { FiArrowRight, FiAward, FiEye, FiHeart, FiTarget } from 'react-icons/fi';
import HeroBanner from '../../components/common/HeroBanner';
import ProjectGrid from '../../components/common/ProjectGrid';
// import StatsCounter from '../../components/common/StatsCounter';
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
    { icon: <FiHeart />, title: 'TEAM / ĐỘI NGŨ', desc: 'Hoavu là đơn vị thiết kế logo với tinh thần trẻ, đầy nhiệt huyết, linh hoạt và luôn tìm cách làm tốt hơn qua từng dự án. Không ngừng học hỏi, cập nhật và đổi mới để mỗi thiết kế không chỉ đẹp mà còn hiệu quả khi triển khai thực tế.' },
    { icon: <FiEye />, title: 'VISION / TẦM NHÌN', desc: 'Trong 5 năm tới, Hoavu hướng đến việc đồng hành và hỗ trợ hơn 5000 khách hàng xây dựng hình ảnh thương hiệu rõ ràng, dễ nhận diện và triển khai thực tế hiệu quả.' },
    { icon: <FiTarget />, title: 'MISSION / SỨ MỆNH', desc: 'Hoavu biến những ý tưởng khởi đầu trở thành nền tảng thương hiệu rõ ràng và có giá trị lâu dài, xây dựng nền tảng vững chắc để tiếp tục phát triển trong tương lai.' },
    { icon: <FiAward />, title: 'CORE VALUE / GIÁ TRỊ CỐT LÕI', desc: '"Chuyên nghiệp - Sáng tạo - Tận tâm" Chuyên nghiệp trong công việc, sáng tạo trong thiết kế, tận tâm trong phục vụ khách hàng.' },
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

      {/* <StatsCounter /> */}
      <TestimonialCarousel />
    </>
  );
}

export default HomePage;
