import { Link } from 'react-router-dom';
import { Breadcrumb, Container } from 'react-bootstrap';

function HoaVuBreadcrumb({ items = [] }) {
  return (
    <section className="hoavu-breadcrumb">
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Trang chủ</Breadcrumb.Item>
          {items.map((item, index) => (
            <Breadcrumb.Item
              key={`${item.label}-${index}`}
              active={index === items.length - 1}
              linkAs={item.to ? Link : undefined}
              linkProps={item.to ? { to: item.to } : undefined}
            >
              {item.label}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Container>
    </section>
  );
}

export default HoaVuBreadcrumb;
