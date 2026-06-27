import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FiExternalLink, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import { BRAND } from '../../config/brand';
import { useSettings } from '../../context/useSettings';
import { publicAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import { SITE_URL } from '../../utils/seo';
import { buildLogoAlt } from '../../utils/seoContent';

function ContactPage() {
  const { settings } = useSettings();
  const facebookUrl = settings?.socialLinks?.facebook || BRAND.contact.facebook;
  const messengerUrl = facebookUrl ? facebookUrl.replace(/facebook\.com/i, 'm.me').replace(/www\./i, '') : BRAND.contact.messenger;
  const address = settings?.address || BRAND.contact.address;
  const logo = resolveMediaUrl(settings?.logo || BRAND.logoFull);
  const companyName = settings?.companyName || BRAND.name;

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
      value: settings?.companyName ? `@${settings.companyName.toLowerCase().replace(/\s+/g, '')}` : '@hoavubranding',
      icon: <FiExternalLink style={{ marginRight: 8 }} aria-hidden="true" />,
      href: facebookUrl,
      ariaLabel: 'Mở fanpage HOAVU BRANDING để nhận tư vấn thiết kế logo',
    },
    {
      label: 'Messenger',
      value: 'Nhắn tin trực tiếp để nhận tư vấn',
      icon: <FiMessageCircle style={{ marginRight: 8 }} aria-hidden="true" />,
      href: messengerUrl,
      ariaLabel: 'Nhắn tin Messenger với HOAVU BRANDING để nhận tư vấn thiết kế thương hiệu',
    },
  ];

  const breadcrumbItems = [{ label: 'Liên hệ' }];

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/lien-he#contactpage`,
    name: `Liên hệ ${companyName}`,
    description: `Liên hệ ${companyName} để tư vấn thiết kế logo, nhận diện thương hiệu và visual truyền thông cho doanh nghiệp.`,
    url: `${SITE_URL}/lien-he`,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: companyName,
      url: SITE_URL,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: messengerUrl,
        availableLanguage: ['Vietnamese'],
      },
    },
  };

  return (
    <>
      <SEO
        title="Liên hệ tư vấn thiết kế thương hiệu"
        description={`Liên hệ ${companyName} để tư vấn thiết kế logo, nhận diện thương hiệu và visual truyền thông cho doanh nghiệp.`}
        path="/lien-he"
        image={logo}
        imageAlt={settings?.logoAlt || buildLogoAlt(companyName)}
        jsonLd={contactJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="contact-form-section">
        <Container>
          <Row>
            <Col lg={7} className="mb-4">
              <h1 className="section-title">Đăng ký tư vấn</h1>
              <p style={{ color: 'var(--gray-600)', marginTop: 16 }}>
                Để phản hồi nhanh nhất, bạn có thể để lại form hoặc nhắn trực tiếp qua fanpage {companyName}.
              </p>
              {status.message ? <Alert variant={status.type} className="mt-3">{status.message}</Alert> : null}
              <Form onSubmit={handleSubmit} className="contact-form mt-4">
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Control name="name" placeholder="Họ và tên *" aria-label="Họ và tên" value={form.name} onChange={handleChange} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Control name="phone" placeholder="Số điện thoại *" aria-label="Số điện thoại" value={form.phone} onChange={handleChange} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Control name="email" type="email" placeholder="Email" aria-label="Email" value={form.email} onChange={handleChange} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Control name="company" placeholder="Công ty / Tổ chức" aria-label="Công ty hoặc tổ chức" value={form.company} onChange={handleChange} />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Select name="service" value={form.service} onChange={handleChange} aria-label="Dịch vụ quan tâm">
                      <option value="">Dịch vụ quan tâm</option>
                      <option value="thiet-ke-logo">Thiết kế logo</option>
                      <option value="nhan-dien-thuong-hieu">Nhận diện thương hiệu</option>
                      <option value="dich-vu-khac">Dịch vụ khác</option>
                    </Form.Select>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Control as="textarea" rows={4} name="message" placeholder="Nội dung tin nhắn" aria-label="Nội dung tin nhắn" value={form.message} onChange={handleChange} />
                  </Col>
                </Row>
                <Button type="submit" className="btn-hoavu btn-hoavu--primary" disabled={loading} aria-label="Gửi yêu cầu tư vấn thiết kế thương hiệu">
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                </Button>
              </Form>
            </Col>

            <Col lg={5}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Thông tin liên hệ</h3>
              {contactCards.map((card) => (
                <div key={card.label} className="contact-info-card">
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>{card.label}</div>
                  <a href={card.href} target="_blank" rel="noreferrer" aria-label={card.ariaLabel} style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
                    {card.icon}{card.value}
                  </a>
                </div>
              ))}
              <div className="contact-info-card mt-3">
                <p style={{ fontSize: 14, marginBottom: 10 }}>
                  <FiMapPin style={{ marginRight: 8, color: 'var(--primary)', flexShrink: 0 }} aria-hidden="true" />
                  {address}
                </p>
                <p style={{ fontSize: 14, marginBottom: 0, color: 'var(--gray-600)' }}>{settings?.tagline || BRAND.contact.supportText}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ContactPage;
