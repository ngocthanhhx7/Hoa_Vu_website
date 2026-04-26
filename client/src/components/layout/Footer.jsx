import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { BRAND } from '../../config/brand';

function Footer() {
  const footerHeadingStyle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 24,
    color: '#ff980f',
  };

  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-4 align-items-start">
          <Col lg={4}>
            <img src="/brand/Logofoot.svg" alt={`${BRAND.name} footer logo`} style={{ width: 'min(100%, 180px)', marginBottom: 20 }} />
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 24 }}>
              {BRAND.description}
            </p>
            <div className="social-row">
              <a href={BRAND.contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FiExternalLink />
              </a>
              <a href={BRAND.contact.messenger} target="_blank" rel="noreferrer" aria-label="Messenger">
                <FiMessageCircle />
              </a>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <h4 style={footerHeadingStyle}>LIÊN HỆ</h4>
            <div className="footer-contact">
              <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)' }}>
                <FiMapPin style={{ marginTop: 4, color: 'var(--accent)' }} />
                <span>{BRAND.contact.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)' }}>
                <FiExternalLink style={{ marginTop: 4, color: 'var(--accent)' }} />
                <a href={BRAND.contact.facebook} target="_blank" rel="noreferrer">facebook.com/hoavubranding</a>
              </div>
              <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)' }}>
                <FiMessageCircle style={{ marginTop: 4, color: 'var(--accent)' }} />
                <a href={BRAND.contact.messenger} target="_blank" rel="noreferrer">Nhắn tin Messenger</a>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6} xs={6}>
            <h4 style={footerHeadingStyle}>DỊCH VỤ</h4>
            <ul className="footer-links">
              <li><Link to="/dich-vu/thiet-ke-logo">Thiết kế logo</Link></li>
              <li><Link to="/dich-vu/nhan-dien-thuong-hieu">Nhận diện thương hiệu</Link></li>
              <li><Link to="/dich-vu/dich-vu-khac">Dịch vụ khác</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={6} xs={6}>
            <h4 style={footerHeadingStyle}>CHÍNH SÁCH</h4>
            <ul className="footer-links">
              <li><Link to="/chinh-sach/chinh-sach-va-quy-dinh">Chính sách và quy định</Link></li>
              <li><Link to="/chinh-sach/quy-trinh-dat-thiet-ke">Quy trình đặt thiết kế</Link></li>
              <li><Link to="/chinh-sach/chinh-sach-bao-mat-thong-tin">Chính sách bảo mật</Link></li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
