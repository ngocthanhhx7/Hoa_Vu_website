import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FiExternalLink, FiMessageCircle } from 'react-icons/fi';
import { BRAND } from '../../config/brand';

function Header() {
  return (
    <header className="site-header">
      <div className="topbar d-none d-md-block" style={{ background: 'linear-gradient(90deg, var(--primary-dark), #082b78)', color: '#fff', padding: '8px 0', fontSize: 13 }}>
        <Container className="d-flex justify-content-between">
          <div className="d-flex gap-4">
            <a href={BRAND.contact.facebook} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center gap-2 text-white">
              <FiExternalLink /> {BRAND.contact.primaryText}
            </a>
            <a href={BRAND.contact.messenger} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center gap-2 text-white">
              <FiMessageCircle /> Messenger
            </a>
          </div>
          <div>{BRAND.description}</div>
        </Container>
      </div>

      <Navbar expand="lg" style={{ background: 'rgba(255,255,255,0.96)', boxShadow: 'var(--shadow-sm)', padding: '12px 0' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
            <img src={BRAND.logoMark} alt={BRAND.name} style={{ width: 54, height: 54, boxShadow: '0 12px 28px rgba(11, 54, 152, 0.16)' }} />
            <div className="brand-mark">
              <strong>{BRAND.shortName}</strong>
              <span>Branding studio</span>
            </div>
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

            <a href={BRAND.contact.facebook} target="_blank" rel="noreferrer" className="btn-hoavu btn-hoavu--primary d-none d-lg-inline-flex">
              NHẮN TIN FANPAGE
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
