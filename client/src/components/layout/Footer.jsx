import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiMapPin, FiMessageCircle, FiYoutube, FiInstagram } from 'react-icons/fi';
import { BRAND } from '../../config/brand';
import { useSettings } from '../../context/SettingsContext';

function Footer() {
  const { settings } = useSettings();
  
  const companyLogo = settings?.logo || "/brand/Logofoot.svg";
  const companyName = settings?.companyName || BRAND.name;
  const description = settings?.tagline || BRAND.description;
  const address = settings?.address || BRAND.contact.address;
  const copyright = settings?.copyright || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  const facebookUrl = settings?.socialLinks?.facebook || BRAND.contact.facebook;
  const instagramUrl = settings?.socialLinks?.instagram;
  const youtubeUrl = settings?.socialLinks?.youtube;
  const zaloUrl = settings?.socialLinks?.zalo;

  const messengerUrl = facebookUrl ? facebookUrl.replace(/facebook\.com/i, 'm.me').replace(/www\./i, '') : BRAND.contact.messenger;

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
            <img src={companyLogo} alt={`${companyName} footer logo`} style={{ width: 'min(100%, 90px)', marginBottom: 20, maxHeight: 60, objectFit: 'contain' }} />
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 24 }}>
              {description}
            </p>
            <div className="social-row d-flex flex-wrap gap-2">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FiExternalLink />
                </a>
              )}
              {messengerUrl && (
                <a href={messengerUrl} target="_blank" rel="noreferrer" aria-label="Messenger">
                  <FiMessageCircle />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="Youtube">
                  <FiYoutube />
                </a>
              )}
            </div>
          </Col>

          <Col lg={4} md={6}>
            <h4 style={footerHeadingStyle}>LIÊN HỆ</h4>
            <div className="footer-contact">
              <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)', marginBottom: 12 }}>
                <FiMapPin style={{ marginTop: 4, flexShrink: 0, color: 'var(--accent)' }} />
                <span>{address}</span>
              </div>
              {facebookUrl && (
                <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)', marginBottom: 12 }}>
                  <FiExternalLink style={{ marginTop: 4, flexShrink: 0, color: 'var(--accent)' }} />
                  <a href={facebookUrl} target="_blank" rel="noreferrer">Facebook Fanpage</a>
                </div>
              )}
              {zaloUrl && (
                <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.82)', marginBottom: 12 }}>
                  <FiMessageCircle style={{ marginTop: 4, flexShrink: 0, color: 'var(--accent)' }} />
                  <a href={zaloUrl} target="_blank" rel="noreferrer">Zalo Chat</a>
                </div>
              )}
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
          {copyright}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
