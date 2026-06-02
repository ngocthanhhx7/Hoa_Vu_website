import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row, Tabs, Tab, Card, Spinner } from 'react-bootstrap';
import { FiUpload, FiTrash2, FiGlobe, FiPhone, FiShare2, FiSliders, FiMessageSquare, FiInfo } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { createUploadFormData, getUploadErrorMessage } from '../../utils/uploadFile';

const ensureHexHash = (val, fallback = '#000000') => {
  if (!val) return fallback;
  const clean = val.trim();
  if (clean.startsWith('#')) return clean;
  if (/^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(clean)) {
    return `#${clean}`;
  }
  return clean;
};

function SettingsPage() {
  const { refreshSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [alert, setAlert] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then((res) => {
      const data = res.data?.data || {};
      setForm({
        companyName: data.companyName || '',
        tagline: data.tagline || '',
        logo: data.logo || '',
        favicon: data.favicon || '',
        address: data.address || '',
        email: data.email || '',
        phones: data.phones?.length ? data.phones : [
          { label: 'Liên hệ tư vấn dịch vụ', number: '' },
          { label: 'Liên hệ thiết kế', number: '' }
        ],
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          youtube: data.socialLinks?.youtube || '',
          zalo: data.socialLinks?.zalo || '',
          tiktok: data.socialLinks?.tiktok || '',
        },
        stats: {
          clients: data.stats?.clients || '',
          countries: data.stats?.countries || '',
          staff: data.stats?.staff || '',
          support: data.stats?.support || '',
        },
        theme: {
          primaryColor: data.theme?.primaryColor || '#D2232A',
          secondaryColor: data.theme?.secondaryColor || '#FFFFFF',
          accentColor: data.theme?.accentColor || '#FF6B35',
          fontFamily: data.theme?.fontFamily || 'Montserrat, sans-serif',
        },
        footerText: data.footerText || '',
        copyright: data.copyright || '',
        chatbotConfig: data.chatbotConfig || { greeting: '', quickReplies: [], enabled: true },
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

  async function handleImageUpload(field, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isLogo = field === 'logo';
    if (isLogo) setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const { formData } = await createUploadFormData(file);
      const res = await adminAPI.uploadMedia(formData, 'brand');
      const url = res.data?.data?.url;
      if (url) {
        setNested(field, url);
        setAlert({ type: 'success', msg: `Tải ảnh ${isLogo ? 'logo' : 'favicon'} lên thành công.` });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', msg: getUploadErrorMessage(err, 'Tải ảnh lên thất bại.') });
    } finally {
      if (isLogo) setUploadingLogo(false);
      else setUploadingFavicon(false);
      event.target.value = '';
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      let qReplies = form.chatbotConfig.quickReplies;
      if (typeof qReplies === 'string') {
        qReplies = qReplies.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
      }
      const payload = {
        ...form,
        theme: {
          ...form.theme,
          primaryColor: ensureHexHash(form.theme.primaryColor, '#D2232A'),
          accentColor: ensureHexHash(form.theme.accentColor, '#FF6B35'),
        },
        chatbotConfig: {
          ...form.chatbotConfig,
          quickReplies: qReplies,
        },
      };
      await adminAPI.updateSettings(payload);
      refreshSettings();
      setAlert({ type: 'success', msg: 'Cập nhật cài đặt thành công.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Cập nhật thất bại.' });
    }
  }

  if (!form) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-2 text-muted">Đang tải cài đặt hệ thống...</p>
      </div>
    );
  }

  const logoPreviewStyle = {
    width: 'min(180px, 100%)',
    height: 72,
    objectFit: 'contain',
    objectPosition: 'left center',
    margin: '0 auto 12px',
  };

  const faviconPreviewStyle = {
    width: 48,
    height: 48,
    objectFit: 'contain',
    margin: '0 auto 24px',
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: 4,
    background: '#fff',
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: 24 }}>Cài đặt hệ thống</h2>
      {alert ? <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert> : null}
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* Form Settings Columns */}
          <Col lg={8}>
            <div className="admin-card" style={{ padding: 24 }}>
              <Tabs defaultActiveKey="general" className="mb-4 admin-tabs" variant="pills">
                {/* General Settings */}
                <Tab eventKey="general" title={<span><FiInfo className="me-2" />Thông tin chung</span>}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Tên công ty / Thương hiệu</Form.Label>
                        <Form.Control value={form.companyName} onChange={(e) => setNested('companyName', e.target.value)} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Tagline (Slogan)</Form.Label>
                        <Form.Control value={form.tagline} onChange={(e) => setNested('tagline', e.target.value)} />
                      </Form.Group>
                    </Col>

                    {/* Logo & Favicon upload row */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Logo website</Form.Label>
                        <Card className="p-3 border-dashed text-center position-relative">
                          {uploadingLogo ? (
                            <div className="py-4"><Spinner animation="border" size="sm" variant="danger" /></div>
                          ) : form.logo ? (
                            <div>
                              <img src={form.logo} alt="Logo Preview" style={logoPreviewStyle} />
                              <div className="d-flex justify-content-center gap-2">
                                <Button variant="outline-danger" size="sm" onClick={() => setNested('logo', '')}>
                                  <FiTrash2 className="me-1" /> Xóa Logo
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-3">
                              <FiUpload className="fs-3 text-muted mb-2" />
                              <p className="text-muted small mb-2">Tải logo lên (khuyên dùng định dạng PNG, SVG)</p>
                              <Form.Control type="file" accept="image/*" className="d-none" id="logo-upload" onChange={(e) => handleImageUpload('logo', e)} />
                              <Button variant="danger" size="sm" onClick={() => document.getElementById('logo-upload').click()}>
                                Chọn ảnh
                              </Button>
                            </div>
                          )}
                        </Card>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Favicon (Icon tab trình duyệt)</Form.Label>
                        <Card className="p-3 border-dashed text-center position-relative">
                          {uploadingFavicon ? (
                            <div className="py-4"><Spinner animation="border" size="sm" variant="danger" /></div>
                          ) : form.favicon ? (
                            <div>
                              <img src={form.favicon} alt="Favicon Preview" style={faviconPreviewStyle} />
                              <div className="d-flex justify-content-center gap-2">
                                <Button variant="outline-danger" size="sm" onClick={() => setNested('favicon', '')}>
                                  <FiTrash2 className="me-1" /> Xóa Favicon
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-3">
                              <FiUpload className="fs-3 text-muted mb-2" />
                              <p className="text-muted small mb-2">Tải favicon lên (kích thước chuẩn 48x48 hoặc 192x192)</p>
                              <Form.Control type="file" accept="image/*" className="d-none" id="favicon-upload" onChange={(e) => handleImageUpload('favicon', e)} />
                              <Button variant="danger" size="sm" onClick={() => document.getElementById('favicon-upload').click()}>
                                Chọn ảnh
                              </Button>
                            </div>
                          )}
                        </Card>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Copyright text</Form.Label>
                        <Form.Control value={form.copyright} onChange={(e) => setNested('copyright', e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Contact and Social */}
                <Tab eventKey="contact" title={<span><FiPhone className="me-2" />Liên hệ & MXH</span>}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Email nhận tin</Form.Label>
                        <Form.Control type="email" value={form.email} onChange={(e) => setNested('email', e.target.value)} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Địa chỉ</Form.Label>
                        <Form.Control value={form.address} onChange={(e) => setNested('address', e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Số điện thoại 1 (Tư vấn)</Form.Label>
                        <Form.Control value={form.phones[0]?.number || ''} onChange={(e) => setForm((curr) => ({ ...curr, phones: [{ ...(curr.phones[0] || { label: 'Liên hệ tư vấn dịch vụ' }), number: e.target.value }, curr.phones[1] || { label: 'Liên hệ thiết kế', number: '' }] }))} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Số điện thoại 2 (Thiết kế)</Form.Label>
                        <Form.Control value={form.phones[1]?.number || ''} onChange={(e) => setForm((curr) => ({ ...curr, phones: [curr.phones[0] || { label: 'Liên hệ tư vấn dịch vụ', number: '' }, { ...(curr.phones[1] || { label: 'Liên hệ thiết kế' }), number: e.target.value }] }))} />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mt-4"><h5 className="border-bottom pb-2 fw-bold text-secondary"><FiShare2 className="me-2" />Mạng xã hội</h5></Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Facebook</Form.Label>
                        <Form.Control value={form.socialLinks.facebook || ''} onChange={(e) => setNested('socialLinks.facebook', e.target.value)} placeholder="https://facebook.com/..." />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Instagram</Form.Label>
                        <Form.Control value={form.socialLinks.instagram || ''} onChange={(e) => setNested('socialLinks.instagram', e.target.value)} placeholder="https://instagram.com/..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Zalo Link</Form.Label>
                        <Form.Control value={form.socialLinks.zalo || ''} onChange={(e) => setNested('socialLinks.zalo', e.target.value)} placeholder="https://zalo.me/..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">YouTube</Form.Label>
                        <Form.Control value={form.socialLinks.youtube || ''} onChange={(e) => setNested('socialLinks.youtube', e.target.value)} placeholder="https://youtube.com/..." />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">TikTok</Form.Label>
                        <Form.Control value={form.socialLinks.tiktok || ''} onChange={(e) => setNested('socialLinks.tiktok', e.target.value)} placeholder="https://tiktok.com/..." />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Theme colors & styling */}
                <Tab eventKey="theme" title={<span><FiSliders className="me-2" />Chủ đề & Màu sắc</span>}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Màu sắc chính (Primary Color)</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control 
                            type="color" 
                            value={ensureHexHash(form.theme.primaryColor, '#D2232A')} 
                            onChange={(e) => setNested('theme.primaryColor', e.target.value)} 
                            style={{ width: 60, height: 40, padding: 2, cursor: 'pointer' }} 
                          />
                          <Form.Control 
                            value={form.theme.primaryColor || ''} 
                            onChange={(e) => setNested('theme.primaryColor', e.target.value)} 
                            onBlur={(e) => setNested('theme.primaryColor', ensureHexHash(e.target.value, '#D2232A'))}
                            placeholder="#D2232A" 
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Màu nhấn (Accent Color)</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control 
                            type="color" 
                            value={ensureHexHash(form.theme.accentColor, '#FF6B35')} 
                            onChange={(e) => setNested('theme.accentColor', e.target.value)} 
                            style={{ width: 60, height: 40, padding: 2, cursor: 'pointer' }} 
                          />
                          <Form.Control 
                            value={form.theme.accentColor || ''} 
                            onChange={(e) => setNested('theme.accentColor', e.target.value)} 
                            onBlur={(e) => setNested('theme.accentColor', ensureHexHash(e.target.value, '#FF6B35'))}
                            placeholder="#FF6B35" 
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Phông chữ hiển thị (Font Family)</Form.Label>
                        <Form.Select value={form.theme.fontFamily || 'Montserrat, sans-serif'} onChange={(e) => setNested('theme.fontFamily', e.target.value)}>
                          <option value="Montserrat, sans-serif">Montserrat (Đề xuất)</option>
                          <option value="'SVN-Avo', sans-serif">SVN-Avo</option>
                          <option value="'UTM Avo', sans-serif">UTM Avo</option>
                          <option value="'Inter', sans-serif">Inter</option>
                          <option value="'Roboto', sans-serif">Roboto</option>
                          <option value="'Outfit', sans-serif">Outfit</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Mô tả Footer (Footer description)</Form.Label>
                        <Form.Control as="textarea" rows={3} value={form.footerText} onChange={(e) => setNested('footerText', e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Stats */}
                <Tab eventKey="stats" title={<span><FiGlobe className="me-2" />Thông số</span>}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Khách hàng hài lòng (Clients)</Form.Label>
                        <Form.Control value={form.stats.clients || ''} onChange={(e) => setNested('stats.clients', e.target.value)} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Quốc gia phủ sóng (Countries)</Form.Label>
                        <Form.Control value={form.stats.countries || ''} onChange={(e) => setNested('stats.countries', e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Thành viên (Staff)</Form.Label>
                        <Form.Control value={form.stats.staff || ''} onChange={(e) => setNested('stats.staff', e.target.value)} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Hỗ trợ (Support)</Form.Label>
                        <Form.Control value={form.stats.support || ''} onChange={(e) => setNested('stats.support', e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Chatbot settings */}
                <Tab eventKey="chatbot" title={<span><FiMessageSquare className="me-2" />Trợ lý ảo (Chatbot)</span>}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Check type="switch" id="chatbot-enabled-switch" label="Kích hoạt chatbot tự động" checked={form.chatbotConfig.enabled !== false} onChange={(e) => setNested('chatbotConfig.enabled', e.target.checked)} />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Lời chào của chatbot</Form.Label>
                        <Form.Control as="textarea" rows={3} value={form.chatbotConfig.greeting || ''} onChange={(e) => setNested('chatbotConfig.greeting', e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Danh sách câu trả lời nhanh (Phân tách bằng dấu phẩy hoặc dòng mới)</Form.Label>
                        <Form.Control as="textarea" rows={3} value={Array.isArray(form.chatbotConfig.quickReplies) ? form.chatbotConfig.quickReplies.join('\n') : form.chatbotConfig.quickReplies || ''} onChange={(e) => setNested('chatbotConfig.quickReplies', e.target.value)} placeholder="Nhận báo giá&#10;Dịch vụ thiết kế&#10;Liên hệ tư vấn" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
              
              <Button variant="danger" type="submit" size="lg" className="mt-4 px-5">Lưu cài đặt</Button>
            </div>
          </Col>

          {/* Right Column: Live Web Preview Mockup */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: 24 }}>
              <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Card.Header className="bg-dark text-white py-3 d-flex align-items-center justify-content-between border-0">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>XEM TRƯỚC GIAO DIỆN HỆ THỐNG</div>
                  <div />
                </Card.Header>
                <Card.Body className="p-0 bg-light">
                  {/* Browser simulated wrapper */}
                  <div style={{ background: '#e4e4e7', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #d4d4d8' }}>
                    <div className="bg-white rounded px-3 py-1 text-muted d-flex align-items-center gap-2" style={{ fontSize: 9, width: '100%', maxWidth: 260, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {form.favicon ? (
                        <img src={form.favicon} alt="Favicon" style={{ height: 10, width: 10, objectFit: 'contain' }} />
                      ) : (
                        <span style={{ width: 8, height: 8, background: '#999', borderRadius: '50%' }} />
                      )}
                      <span>https://hoavu.com.vn</span>
                    </div>
                  </div>

                  {/* Site mockup viewport */}
                  <div style={{ background: '#fff', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
                    {/* Simulated Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px',
                      background: '#ffffff',
                      borderBottom: '1px solid #f3f4f6',
                      fontFamily: form.theme.fontFamily || 'Montserrat, sans-serif'
                    }}>
                      {form.logo ? (
                        <img src={form.logo} alt="Logo" style={{ width: 52, height: 22, objectFit: 'contain', objectPosition: 'left center' }} />
                      ) : (
                        <span style={{ fontWeight: 800, color: ensureHexHash(form.theme.primaryColor, '#D2232A'), fontSize: 11 }}>
                          {form.companyName || 'HOAVU'}
                        </span>
                      )}
                      <div className="d-flex gap-3 align-items-center" style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>
                        <span style={{ color: ensureHexHash(form.theme.primaryColor, '#D2232A') }}>TRANG CHỦ</span>
                        <span>DỊCH VỤ</span>
                        <span>DỰ ÁN</span>
                      </div>
                    </div>

                    {/* Simulated Hero Section */}
                    <div style={{
                      flex: 1,
                      padding: '40px 20px',
                      background: `linear-gradient(135deg, ${ensureHexHash(form.theme.primaryColor, '#D2232A')}e0 0%, ${ensureHexHash(form.theme.primaryColor, '#D2232A')} 100%)`,
                      color: '#fff',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontFamily: form.theme.fontFamily || 'Montserrat, sans-serif',
                      minHeight: 180
                    }}>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8, textTransform: 'uppercase' }}>
                        {form.companyName || 'HOAVU BRANDING'}
                      </h4>
                      <p style={{ fontSize: 10, opacity: 0.9, marginBottom: 16, maxWidth: 220, lineHeight: 1.4 }}>
                        {form.tagline || 'Nâng tầm thương hiệu'}
                      </p>
                      <button style={{
                        background: ensureHexHash(form.theme.accentColor, '#FF6B35'),
                        border: 'none',
                        color: '#fff',
                        padding: '8px 18px',
                        borderRadius: 20,
                        fontSize: 9,
                        fontWeight: 700,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                      }}>
                        NHẮN TIN FANPAGE
                      </button>
                    </div>

                    {/* Simulated Footer */}
                    <div style={{
                      background: '#111827',
                      color: '#9ca3af',
                      padding: '16px',
                      fontSize: 8,
                      fontFamily: form.theme.fontFamily || 'Montserrat, sans-serif'
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        {form.logo ? (
                          <img src={form.logo} alt="Logo" style={{ width: 48, height: 18, objectFit: 'contain', objectPosition: 'left center', filter: 'brightness(0) invert(1)' }} />
                        ) : (
                          <span style={{ fontWeight: 800, color: '#fff' }}>{form.companyName || 'HOAVU'}</span>
                        )}
                        <span>{form.email || 'info@hoavu.vn'}</span>
                      </div>
                      <p style={{ margin: 0, opacity: 0.6, fontSize: 8 }}>
                        Địa chỉ: {form.address || 'Hồ Chí Minh'}
                      </p>
                      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                      <p style={{ margin: 0, opacity: 0.5, fontSize: 7, textAlign: 'center' }}>
                        {form.copyright || '© 2026 HOA VU. All rights reserved.'}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="mt-3 p-3 bg-white rounded-3 border">
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: '#4b5563' }}>Bảng màu chủ đề đang chọn:</div>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: ensureHexHash(form.theme.primaryColor, '#D2232A'), border: '1px solid #e5e7eb' }} />
                    <div style={{ fontSize: 11 }}>
                      <div style={{ fontWeight: 600 }}>Màu chính</div>
                      <code className="text-muted small">{ensureHexHash(form.theme.primaryColor, '#D2232A')}</code>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: ensureHexHash(form.theme.accentColor, '#FF6B35'), border: '1px solid #e5e7eb' }} />
                    <div style={{ fontSize: 11 }}>
                      <div style={{ fontWeight: 600 }}>Màu nhấn</div>
                      <code className="text-muted small">{ensureHexHash(form.theme.accentColor, '#FF6B35')}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default SettingsPage;
