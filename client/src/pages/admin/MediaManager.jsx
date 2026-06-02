import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FiCopy, FiCheck, FiTrash2, FiImage, FiFileText, FiUploadCloud } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

function MediaCard({ item, onDelete }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(resolveMediaUrl(item.url));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isImage = item.mimetype?.startsWith('image/');

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden position-relative media-item-card" style={{ borderRadius: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}>
      <div 
        style={{ 
          position: 'relative', 
          aspectRatio: '16/10', 
          background: '#f8f9fa', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid #f1f2f6'
        }}
      >
        {isImage ? (
          <img
            src={resolveMediaUrl(item.url)}
            alt={item.alt || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <FiFileText size={48} style={{ color: '#a4b0be' }} />
        )}
        <span className="badge bg-dark text-white" style={{ position: 'absolute', top: 10, left: 10, opacity: 0.85, fontSize: 11, fontWeight: 600 }}>
          {item.folder}
        </span>
        <span className={`badge ${item.storageProvider === 's3' ? 'bg-primary' : 'bg-secondary'} text-white`} style={{ position: 'absolute', top: 10, right: 10, opacity: 0.85, fontSize: 11, fontWeight: 600 }}>
          {item.storageProvider || 'local'}
        </span>
      </div>
      <Card.Body className="d-flex flex-column justify-content-between p-3" style={{ minHeight: 120 }}>
        <div className="mb-2">
          <h6 className="text-truncate mb-1" style={{ fontSize: 14, fontWeight: 700, color: '#2f3542' }} title={item.originalName}>
            {item.originalName}
          </h6>
          <p className="text-muted text-truncate mb-0" style={{ fontSize: 11, fontFamily: 'monospace' }} title={item.url}>
            {item.url}
          </p>
        </div>
        <div className="d-flex gap-2 mt-2">
          <Button
            variant={copied ? 'success' : 'outline-primary'}
            size="sm"
            className="w-100 d-inline-flex align-items-center justify-content-center gap-1"
            style={{ fontSize: 12, fontWeight: 600 }}
            onClick={handleCopy}
          >
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Đã copy' : 'Copy URL'}
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="d-inline-flex align-items-center justify-content-center"
            style={{ width: 40 }}
            onClick={() => onDelete(item._id)}
            title="Xóa tệp"
          >
            <FiTrash2 />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function MediaManager() {
  const [media, setMedia] = useState([]);
  const [folder, setFolder] = useState('general');
  const [alt, setAlt] = useState('');
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    adminAPI.getMedia({ page: 1, limit: 100 }).then((res) => {
      setMedia(res.data?.data || []);
    }).catch((err) => {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Không thể tải media.' });
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    if (!file) {
      setAlert({ type: 'danger', msg: 'Vui lòng chọn tệp.' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', alt);

    try {
      await adminAPI.uploadMedia(formData, folder);
      setAlert({ type: 'success', msg: 'Tải lên thành công.' });
      setFile(null);
      setFileKey(Date.now());
      setAlt('');
      load();
    } catch (err) {
      console.error('Lỗi upload media:', err);
      setAlert({ type: 'danger', msg: err.response?.data?.message || err.message || 'Tải lên thất bại.' });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xác nhận xóa media này? Thao tác này sẽ xóa tệp vĩnh viễn khỏi hệ thống lưu trữ (S3/Local).')) {
      return;
    }
    try {
      await adminAPI.deleteMedia(id);
      setAlert({ type: 'success', msg: 'Đã xóa media khỏi hệ thống lưu trữ thành công.' });
      load();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || err.message || 'Xóa thất bại.' });
    }
  }

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: 24 }}>Quản lý media</h2>
      {alert ? <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert> : null}
      
      <div className="admin-card mb-4" style={{ borderRadius: 12, border: '1px solid #f1f2f6' }}>
        <Form onSubmit={handleUpload}>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">Thư mục</Form.Label>
                <Form.Control value={folder} onChange={(event) => setFolder(event.target.value)} placeholder="Ví dụ: projects, banners" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">Văn bản thay thế (Alt)</Form.Label>
                <Form.Control value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Mô tả ảnh cho SEO" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">Chọn tệp hình ảnh/tài liệu</Form.Label>
                <Form.Control key={fileKey} type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="danger" className="w-100 d-inline-flex align-items-center justify-content-center gap-2" disabled={uploading}>
                <FiUploadCloud /> {uploading ? 'Đang tải...' : 'Tải lên'}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-5 admin-card" style={{ borderRadius: 12 }}>
          <FiImage size={48} style={{ color: '#a4b0be', marginBottom: 16 }} />
          <h5 className="text-muted">Chưa có tệp tin nào</h5>
          <p className="text-muted small">Hãy chọn tệp và tải lên ở form phía trên.</p>
        </div>
      ) : (
        <Row className="g-3">
          {media.map((item) => (
            <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
              <MediaCard item={item} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default MediaManager;
