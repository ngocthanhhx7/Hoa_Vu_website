import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import { useSettings } from '../../context/useSettings';
import { resolveMediaUrl } from '../../utils/media';
import { buildLogoAlt } from '../../utils/seoContent';

function Header() {
  const { settings } = useSettings();
  const companyLogo = resolveMediaUrl(settings?.logo || BRAND.logoMark);
  const companyName = settings?.companyName || BRAND.name;
  const facebookUrl = settings?.socialLinks?.facebook || BRAND.contact.facebook;

  return (
    <header className="site-header">
      <Navbar expand="lg" style={{ background: 'rgba(255,255,255,0.96)', boxShadow: 'var(--shadow-sm)', padding: '12px 0' }}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="site-header-logo d-flex align-items-center flex-shrink-0"
            aria-label={`Về trang chủ ${companyName}`}
          >
            <img src={companyLogo} alt={settings?.logoAlt || buildLogoAlt(companyName)} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto fw-bold" style={{ gap: 16 }}>
              <Nav.Link as={NavLink} to="/" end>TRANG CHỦ</Nav.Link>
              <Nav.Link as={NavLink} to="/gioi-thieu">GIỚI THIỆU</Nav.Link>
              <NavDropdown title="DỊCH VỤ" id="service-nav">
                <NavDropdown.Item as={Link} to="/dich-vu">Tất cả dịch vụ</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dich-vu/thiet-ke-logo">Thiết kế logo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dich-vu/nhan-dien-thuong-hieu">Nhận diện thương hiệu</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dich-vu/dich-vu-khac">Dịch vụ khác</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="DỰ ÁN" id="project-nav">
                <NavDropdown.Item as={Link} to="/du-an">Tất cả dự án</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/du-an/thiet-ke-logo">Thiết kế logo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/du-an/nhan-dien-thuong-hieu">Nhận diện thương hiệu</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/du-an/dich-vu-khac">Dịch vụ khác</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="BLOG" id="blog-nav">
                <NavDropdown.Item as={Link} to="/blog">Tất cả bài viết</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blog/tin-tuc">Tin tức</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blog/idea">Idea</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blog/cam-nang-thiet-ke">Cẩm nang thiết kế</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/lien-he">LIÊN HỆ</Nav.Link>
            </Nav>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-hoavu btn-hoavu--primary d-none d-lg-inline-flex"
              aria-label="Nhắn tin fanpage HOAVU BRANDING để nhận tư vấn thiết kế logo"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              NHẮN TIN FANPAGE
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
