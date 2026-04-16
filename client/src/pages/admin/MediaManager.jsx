import { useEffect, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

function MediaManager() {
  const [media, setMedia] = useState([]);
  const [folder, setFolder] = useState('general');
  const [alt, setAlt] = useState('');
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', alt);

    try {
      await adminAPI.uploadMedia(formData, folder);
      setAlert({ type: 'success', msg: 'Tải lên thành công.' });
      setFile(null);
      setAlt('');
      load();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Tải lên thất bại.' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xác nhận xóa media này?')) {
      return;
    }
    try {
      await adminAPI.deleteMedia(id);
      setAlert({ type: 'success', msg: 'Đã xóa media.' });
      load();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Xóa thất bại.' });
    }
  }

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: 24 }}>Quản lý media</h2>
      {alert ? <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert> : null}
      <div className="admin-card">
        <Form onSubmit={handleUpload}>
          <div className="row g-3 align-items-end">
            <div className="col-md-4"><Form.Group><Form.Label>Thư mục</Form.Label><Form.Control value={folder} onChange={(event) => setFolder(event.target.value)} /></Form.Group></div>
            <div className="col-md-4"><Form.Group><Form.Label>Văn bản thay thế</Form.Label><Form.Control value={alt} onChange={(event) => setAlt(event.target.value)} /></Form.Group></div>
            <div className="col-md-4"><Form.Group><Form.Label>Tệp</Form.Label><Form.Control type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} /></Form.Group></div>
          </div>
          <Button type="submit" variant="danger" className="mt-3">Tải lên</Button>
        </Form>
      </div>
      <div className="admin-card">
        <Table responsive hover>
          <thead><tr><th>Tên tệp</th><th>Thư mục</th><th>Loại</th><th>Văn bản thay thế</th><th>URL</th><th>Hành động</th></tr></thead>
          <tbody>
            {media.map((item) => (
              <tr key={item._id}>
                <td>{item.originalName}</td>
                <td>{item.folder}</td>
                <td>{item.storageProvider || 'local'}</td>
                <td>{item.alt}</td>
                <td><a href={resolveMediaUrl(item.url)} target="_blank" rel="noreferrer">{item.url}</a></td>
                <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>Xóa</Button></td>
              </tr>
            ))}
            {!media.length ? <tr><td colSpan={6} className="text-center text-muted py-4">Chưa có media</td></tr> : null}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default MediaManager;
