import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { publicAPI } from '../../services/api';

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    publicAPI.getTestimonials().then(res => {
      if (res.data.success) setTestimonials(res.data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  const pages = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    pages.push(testimonials.slice(i, i + 3));
  }

  return (
    <section className="testimonial-section">
      <Container>
        <h2 className="section-title mb-3">Khách hàng đánh giá về Hoa Vu</h2>
        <p className="mb-5" style={{ color: 'var(--gray-600)' }}>
          Hơn 20.000 khách hàng đã sử dụng dịch vụ của chúng tôi.
        </p>

        <Row>
          {(pages[activeIndex] || pages[0])?.map((t, i) => (
            <Col key={t._id || i} md={4} className="mb-4 fade-in-up">
              <div className="testimonial-card">
                <div className="client-info">
                  <div className="client-avatar">
                    {(t.clientName || '?')[0]}
                  </div>
                  <div>
                    <div className="client-name">{t.clientName}</div>
                    <div className="client-title">
                      {t.clientTitle}{t.clientCompany ? ` | ${t.clientCompany}` : ''}
                    </div>
                  </div>
                </div>
                <div className="content">&quot;{t.content}&quot;</div>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {pages.map((_, i) => (
            <button key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: 12, height: 12, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === activeIndex ? 'var(--primary)' : 'var(--gray-300)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialCarousel;
