import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { buildTitle } from '../../config/brand';

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>{buildTitle('404')}</title>
      </Helmet>
      <section className="section">
        <Container className="text-center">
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 16 }}>404</h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Trang bạn tìm không tồn tại hoặc đã được thay đổi.</p>
          <Link to="/" className="btn-hoavu btn-hoavu--primary">Quay về trang chủ</Link>
        </Container>
      </section>
    </>
  );
}

export default NotFoundPage;
