import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import StatsCounter from '../../components/common/StatsCounter';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { BRAND, buildTitle } from '../../config/brand';

function AboutPage() {
  const steps = [
    { num: 1, title: 'Tiếp nhận thông tin', items: ['Nhận brief từ khách hàng', 'Làm rõ mục tiêu truyền thông', 'Chốt định hướng thẩm mỹ'] },
    { num: 2, title: 'Thỏa thuận và ký kết', items: ['Báo giá minh bạch', 'Thống nhất deliverables', 'Khóa timeline triển khai'] },
    { num: 3, title: 'Thực hiện dự án', items: ['Nghiên cứu visual', 'Phát triển concept', 'Hiệu chỉnh theo phản hồi'] },
    { num: 4, title: 'Bàn giao sản phẩm', items: ['Đóng gói file chuẩn', 'Bàn giao ứng dụng', 'Hướng dẫn sử dụng cơ bản'] },
    { num: 5, title: 'Đồng hành sau dự án', items: ['Hỗ trợ phát sinh hợp lý', 'Gợi ý triển khai thực tế', 'Duy trì đồng bộ thương hiệu'] },
  ];

  return (
    <>
      <Helmet>
        <title>{buildTitle('Giới thiệu')}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Giới thiệu' }]} />

      <section className="section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h2 className="section-title">Về chúng tôi</h2>
              <p className="mt-3" style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>
                {BRAND.name} là studio tập trung vào logo, nhận diện thương hiệu và visual truyền thông cho doanh nghiệp cần một hình ảnh tinh gọn nhưng vẫn đủ độ sang và khác biệt.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>
                Chúng tôi ưu tiên tiến trình rõ ràng, cảm quan cao cấp và khả năng biến tinh thần thương hiệu thành hệ thống hình ảnh có thể dùng thật trên nhiều nền tảng.
              </p>
              <div className="mt-4 d-flex gap-3 flex-wrap">
                <Link to="/lien-he" className="btn-hoavu btn-hoavu--primary">Liên hệ tư vấn</Link>
                <Link to="/du-an" className="btn-hoavu btn-hoavu--outline">Xem dự án đã thực hiện</Link>
              </div>
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <div style={{ padding: 24, borderRadius: '32px', background: 'linear-gradient(145deg, rgba(16,63,173,0.12), rgba(242,205,69,0.14))', boxShadow: 'var(--shadow-lg)' }}>
                <img src={BRAND.logoFull} alt={BRAND.name} style={{ width: 'min(100%, 320px)', display: 'block', margin: '0 auto' }} />
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

      <StatsCounter />
      <TestimonialCarousel />
    </>
  );
}

export default AboutPage;
