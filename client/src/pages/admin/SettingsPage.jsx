import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

function SettingsPage() {
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    adminAPI.getSettings().then((res) => {
      const data = res.data?.data || {};
      setForm({
        companyName: data.companyName || '',
        tagline: data.tagline || '',
        address: data.address || '',
        email: data.email || '',
        phones: data.phones?.length ? data.phones : [{ label: 'Liên hệ tư vấn dịch vụ', number: '' }, { label: 'Liên hệ thiết kế', number: '' }],
        socialLinks: data.socialLinks || {},
        stats: data.stats || {},
        theme: data.theme || {},
        footerText: data.footerText || '',
        copyright: data.copyright || '',
        chatbotConfig: data.chatbotConfig || { greeting: '', quickReplies: [] },
      });
    }).catch((err) => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Không thể tải cài đặt.' });
    });
  }, []);

  function setNested(path, value) {
    setForm((current) => {
      const next = structuredClone(current);
      const keys = path.split('.');
      let ref = next;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          ref[key] = value;
        } else {
          ref[key] = ref[key] || {};
          ref = ref[key];
        }
      });
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        chatbotConfig: {
          ...form.chatbotConfig,
          quickReplies: String(form.chatbotConfig.quickReplies || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean),
        },
      };
      await adminAPI.updateSettings(payload);
      setAlert({ type: 'success', msg: 'Cập nhật cài đặt thành công.' });
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Cập nhật thất bại.' });
    }
  }

  if (!form) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: 24 }}>Cài đặt hệ thống</h2>
      {alert ? <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert> : null}
      <div className="admin-card">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}><Form.Group><Form.Label>Tên công ty</Form.Label><Form.Control value={form.companyName} onChange={(event) => setNested('companyName', event.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Tagline</Form.Label><Form.Control value={form.tagline} onChange={(event) => setNested('tagline', event.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control value={form.email} onChange={(event) => setNested('email', event.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Địa chỉ</Form.Label><Form.Control value={form.address} onChange={(event) => setNested('address', event.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Số điện thoại 1</Form.Label><Form.Control value={form.phones[0]?.number || ''} onChange={(event) => setForm((current) => ({ ...current, phones: [{ ...(current.phones[0] || { label: 'Liên hệ tư vấn dịch vụ' }), number: event.target.value }, current.phones[1] || { label: 'Liên hệ thiết kế', number: '' }] }))} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Số điện thoại 2</Form.Label><Form.Control value={form.phones[1]?.number || ''} onChange={(event) => setForm((current) => ({ ...current, phones: [current.phones[0] || { label: 'Liên hệ tư vấn dịch vụ', number: '' }, { ...(current.phones[1] || { label: 'Liên hệ thiết kế' }), number: event.target.value }] }))} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Facebook</Form.Label><Form.Control value={form.socialLinks.facebook || ''} onChange={(event) => setNested('socialLinks.facebook', event.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Instagram</Form.Label><Form.Control value={form.socialLinks.instagram || ''} onChange={(event) => setNested('socialLinks.instagram', event.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Zalo</Form.Label><Form.Control value={form.socialLinks.zalo || ''} onChange={(event) => setNested('socialLinks.zalo', event.target.value)} /></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Clients</Form.Label><Form.Control value={form.stats.clients || ''} onChange={(event) => setNested('stats.clients', event.target.value)} /></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Countries</Form.Label><Form.Control value={form.stats.countries || ''} onChange={(event) => setNested('stats.countries', event.target.value)} /></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Staff</Form.Label><Form.Control value={form.stats.staff || ''} onChange={(event) => setNested('stats.staff', event.target.value)} /></Form.Group></Col>
            <Col md={3}><Form.Group><Form.Label>Support</Form.Label><Form.Control value={form.stats.support || ''} onChange={(event) => setNested('stats.support', event.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Primary color</Form.Label><Form.Control value={form.theme.primaryColor || ''} onChange={(event) => setNested('theme.primaryColor', event.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Accent color</Form.Label><Form.Control value={form.theme.accentColor || ''} onChange={(event) => setNested('theme.accentColor', event.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Font family</Form.Label><Form.Control value={form.theme.fontFamily || ''} onChange={(event) => setNested('theme.fontFamily', event.target.value)} /></Form.Group></Col>
            <Col xs={12}><Form.Group><Form.Label>Footer text</Form.Label><Form.Control as="textarea" rows={3} value={form.footerText} onChange={(event) => setNested('footerText', event.target.value)} /></Form.Group></Col>
            <Col xs={12}><Form.Group><Form.Label>Copyright</Form.Label><Form.Control value={form.copyright} onChange={(event) => setNested('copyright', event.target.value)} /></Form.Group></Col>
            <Col xs={12}><Form.Group><Form.Label>Chatbot greeting</Form.Label><Form.Control as="textarea" rows={3} value={form.chatbotConfig.greeting || ''} onChange={(event) => setNested('chatbotConfig.greeting', event.target.value)} /></Form.Group></Col>
            <Col xs={12}><Form.Group><Form.Label>Chatbot quick replies</Form.Label><Form.Control as="textarea" rows={3} value={Array.isArray(form.chatbotConfig.quickReplies) ? form.chatbotConfig.quickReplies.join(', ') : form.chatbotConfig.quickReplies || ''} onChange={(event) => setNested('chatbotConfig.quickReplies', event.target.value)} /></Form.Group></Col>
          </Row>
          <Button variant="danger" type="submit" className="mt-4">Lưu cài đặt</Button>
        </Form>
      </div>
    </div>
  );
}

export default SettingsPage;
