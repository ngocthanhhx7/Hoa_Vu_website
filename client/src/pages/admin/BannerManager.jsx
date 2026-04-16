import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FiArrowDown, FiArrowUp, FiImage, FiPlus, FiSave, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    setLoading(true);
    try {
      const res = await adminAPI.getBanners();
      setBanners(res.data?.data || []);
    } catch {
      setFeedback({ type: 'danger', msg: 'Không thể tải danh sách banner.' });
    } finally {
      setLoading(false);
    }
  }

  function addBanner() {
    setBanners((prev) => [...prev, { url: '', order: prev.length, isActive: true }]);
  }

  function updateBanner(index, field, value) {
    setBanners((prev) => prev.map((banner, currentIndex) => (
      currentIndex === index ? { ...banner, [field]: value } : banner
    )));
  }

  function removeBanner(index) {
    setBanners((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  }

  function moveBanner(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) {
      return;
    }

    setBanners((prev) => {
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((banner, currentIndex) => ({ ...banner, order: currentIndex }));
    });
  }

  async function handleUpload(index, event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminAPI.uploadMedia(formData, 'banners');
      const uploadedUrl = res.data?.data?.url;
      if (uploadedUrl) {
        updateBanner(index, 'url', uploadedUrl);
        setFeedback({ type: 'success', msg: 'Tải banner lên thành công.' });
      }
    } catch {
      setFeedback({ type: 'danger', msg: 'Tải banner lên thất bại.' });
    } finally {
      event.target.value = '';
    }
  }

  async function handleSave() {
    const validBanners = banners.filter((banner) => String(banner.url || '').trim());

    if (validBanners.length === 0 && banners.length > 0) {
      setFeedback({ type: 'warning', msg: 'Vui lòng thêm ảnh cho ít nhất 1 banner.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const ordered = validBanners.map((banner, index) => ({
        url: banner.url,
        isActive: banner.isActive !== false,
        order: index,
      }));

      const res = await adminAPI.updateBanners(ordered);
      setBanners(res.data?.data || ordered);
      setFeedback({ type: 'success', msg: 'Đã lưu banner thành công.' });
    } catch {
      setFeedback({ type: 'danger', msg: 'Lưu banner thất bại. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ fontWeight: 800 }}>Quản lý banner</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={addBanner}>
            <FiPlus /> Thêm banner
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            <FiSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      <Alert variant="info">
        Banner trang chủ chỉ cần hình ảnh. Admin có thể tải ảnh lên, thay ảnh, sắp xếp thứ tự và bật/tắt hiển thị.
      </Alert>

      {feedback ? (
        <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      ) : null}

      {banners.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FiImage size={48} style={{ color: 'var(--gray-400)', marginBottom: 16 }} />
            <h5 style={{ color: 'var(--gray-600)' }}>Chưa có banner nào</h5>
            <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
              Nhấn &quot;Thêm banner&quot; để thêm hình banner cho trang chủ.
            </p>
            <Button variant="primary" onClick={addBanner}>
              <FiPlus /> Thêm banner đầu tiên
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {banners.map((banner, index) => (
            <Card key={banner._id || `banner-${index}`} style={{ border: '1px solid var(--gray-200)' }}>
              <Card.Body>
                <Row className="align-items-start g-3">
                  <Col md={4}>
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 6',
                        borderRadius: 10,
                        overflow: 'hidden',
                        background: 'var(--gray-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {banner.url ? (
                        <img
                          src={resolveMediaUrl(banner.url)}
                          alt="Xem trước banner"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <FiImage size={36} style={{ color: 'var(--gray-400)' }} />
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Đường dẫn ảnh banner</Form.Label>
                      <Form.Control
                        size="sm"
                        value={banner.url || ''}
                        onChange={(event) => updateBanner(index, 'url', event.target.value)}
                        placeholder="Dán URL ảnh hoặc tải ảnh lên"
                      />
                    </Form.Group>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <label className="d-flex align-items-center gap-1 btn btn-outline-secondary btn-sm" style={{ cursor: 'pointer' }}>
                        <FiUploadCloud /> Tải ảnh lên
                        <input type="file" accept="image/*" hidden onChange={(event) => handleUpload(index, event)} />
                      </label>
                    </div>

                    <Form.Check
                      type="switch"
                      label="Hiển thị banner này"
                      checked={banner.isActive !== false}
                      onChange={(event) => updateBanner(index, 'isActive', event.target.checked)}
                    />
                  </Col>

                  <Col md={2} className="d-flex flex-column gap-2 align-items-end">
                    <span className="badge bg-light text-dark border">#{index + 1}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => moveBanner(index, -1)} disabled={index === 0} title="Di chuyển lên">
                      <FiArrowUp />
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => moveBanner(index, 1)} disabled={index === banners.length - 1} title="Di chuyển xuống">
                      <FiArrowDown />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => removeBanner(index)} title="Xóa banner">
                      <FiTrash2 />
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BannerManager;
