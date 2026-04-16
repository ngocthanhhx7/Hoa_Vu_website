import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FiExternalLink, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import { BRAND, buildTitle } from '../../config/brand';
import { publicAPI } from '../../services/api';

function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name || !form.phone) {
      setStatus({ type: 'danger', message: 'Vui lòng nhập tên và số điện thoại.' });
      return;
    }

    try {
      setLoading(true);
      const res = await publicAPI.submitContact(form);
      if (res.data.success) {
        setStatus({ type: 'success', message: res.data.message });
        setForm({ name: '', phone: '', email: '', company: '', service: '', message: '' });
      }
    } catch {
      setStatus({ type: 'danger', message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }

  const contactCards = [
    {
      label: 'Fanpage chính thức',
      value: '@hoavubranding',
      icon: <FiExternalLink style={{ marginRight: 8 }} />,
      href: BRAND.contact.facebook,
    },
    {
      label: 'Messenger',
      value: 'Nhắn tin trực tiếp để nhận tư vấn',
      icon: <FiMessageCircle style={{ marginRight: 8 }} />,
      href: BRAND.contact.messenger,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{buildTitle('Liên hệ')}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Liên hệ' }]} />
      <section className="contact-form-section">
        <Container>
          <Row>
            <Col lg={7} className="mb-4">
              <h2 className="section-title">Đăng ký tư vấn</h2>
              <p style={{ color: 'var(--gray-600)', marginTop: 16 }}>
                Để phản hồi nhanh nhất, bạn có thể để lại form hoặc nhắn trực tiếp qua fanpage Hoa Vu Branding.
              </p>
              {status.message ? <Alert variant={status.type} className="mt-3">{status.message}</Alert> : null}
              <Form onSubmit={handleSubmit} className="contact-form mt-4">
                <Row>
                  <Col md={6} className="mb-3"><Form.Control name="name" placeholder="Họ và tên *" value={form.name} onChange={handleChange} required /></Col>
                  <Col md={6} className="mb-3"><Form.Control name="phone" placeholder="Số điện thoại *" value={form.phone} onChange={handleChange} required /></Col>
                  <Col md={6} className="mb-3"><Form.Control name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} /></Col>
                  <Col md={6} className="mb-3"><Form.Control name="company" placeholder="Công ty / Tổ chức" value={form.company} onChange={handleChange} /></Col>
                  <Col md={12} className="mb-3">
                    <Form.Select name="service" value={form.service} onChange={handleChange}>
                      <option value="">Dịch vụ quan tâm</option>
                      <option value="thiet-ke-logo">Thiết kế logo</option>
                      <option value="nhan-dien-thuong-hieu">Nhận diện thương hiệu</option>
                      <option value="dich-vu-khac">Dịch vụ khác</option>
                    </Form.Select>
                  </Col>
                  <Col md={12} className="mb-3"><Form.Control as="textarea" rows={4} name="message" placeholder="Nội dung tin nhắn" value={form.message} onChange={handleChange} /></Col>
                </Row>
                <Button type="submit" className="btn-hoavu btn-hoavu--primary" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}</Button>
              </Form>
            </Col>

            <Col lg={5}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Thông tin liên hệ</h3>
              {contactCards.map((card) => (
                <div key={card.label} className="contact-info-card">
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>{card.label}</div>
                  <a href={card.href} target="_blank" rel="noreferrer" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                    {card.icon}{card.value}
                  </a>
                </div>
              ))}
              <div className="contact-info-card mt-3">
                <p style={{ fontSize: 14, marginBottom: 10 }}>
                  <FiMapPin style={{ marginRight: 8, color: 'var(--primary)' }} />
                  {BRAND.contact.address}
                </p>
                <p style={{ fontSize: 14, marginBottom: 0, color: 'var(--gray-600)' }}>{BRAND.contact.supportText}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ContactPage;
