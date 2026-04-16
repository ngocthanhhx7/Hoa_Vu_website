import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';
import { normalizeMediaList, resolveMediaUrl } from '../../utils/media';

function ProjectMediaField({ label, value, onChange, multiple = false, folder = 'projects', helpText }) {
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const items = useMemo(() => normalizeMediaList(value), [value]);

  async function handleUpload(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    setUploading(true);
    setFeedback(null);

    try {
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt', file.name);
        const res = await adminAPI.uploadMedia(formData, folder);
        const nextUrl = res.data?.data?.url;
        if (nextUrl) uploadedUrls.push(nextUrl);
      }

      if (uploadedUrls.length) {
        onChange(multiple ? normalizeMediaList(items, uploadedUrls).join('\n') : uploadedUrls[0]);
      }

      setFeedback({ type: 'success', msg: `Đã tải lên ${uploadedUrls.length} ảnh.` });
    } catch (err) {
      setFeedback({ type: 'danger', msg: err.response?.data?.message || 'Tải ảnh thất bại.' });
    } finally {
      event.target.value = '';
      setUploading(false);
    }
  }

  function removeItem(target) {
    if (multiple) {
      onChange(items.filter((item) => item !== target).join('\n'));
      return;
    }
    onChange('');
  }

  return (
    <div className="project-media-field">
      {multiple ? (
        <Form.Control
          as="textarea"
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Mỗi dòng một URL ảnh"
        />
      ) : (
        <Form.Control
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="URL ảnh đại diện"
        />
      )}

      <div className="project-media-field__toolbar">
        <label className={`project-media-upload ${uploading ? 'is-disabled' : ''}`}>
          <FiUploadCloud />
          <span>{uploading ? 'Đang tải lên...' : multiple ? 'Tải nhiều ảnh' : `Tải ${label.toLowerCase()}`}</span>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
        <span className="project-media-field__hint">Ảnh tải lên sẽ tự chèn vào form.</span>
      </div>

      {feedback ? <Alert variant={feedback.type} className="mt-2 mb-0 py-2">{feedback.msg}</Alert> : null}

      {items.length > 0 ? (
        <div className="project-media-preview-grid">
          {items.map((item) => (
            <div key={item} className="project-media-preview-card">
              <div className="project-media-preview-card__image">
                <img src={resolveMediaUrl(item)} alt="" />
              </div>
              <div className="project-media-preview-card__body">
                <div className="project-media-preview-card__url">{item}</div>
                <Button variant="outline-danger" size="sm" onClick={() => removeItem(item)}>
                  <FiTrash2 /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="project-media-empty">
          <FiImage />
          <span>Chưa có ảnh nào cho trường này.</span>
        </div>
      )}

      {helpText ? <Form.Text muted>{helpText}</Form.Text> : null}
    </div>
  );
}

function ProjectManager() {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    adminAPI.getServiceCategories().then((res) => {
      setCategoryOptions((res.data?.data || []).map((item) => ({ value: item._id, label: item.name })));
    }).catch(() => {});
  }, []);

  return (
    <CrudManager
      title="Quản lý dự án"
      apiGet={() => adminAPI.getProjects({ page: 1, limit: 100 })}
      apiCreate={adminAPI.createProject}
      apiUpdate={adminAPI.updateProject}
      apiDelete={adminAPI.deleteProject}
      columns={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'category.name', label: 'Danh mục' },
        { key: 'client.name', label: 'Khách hàng' },
        { key: 'isFeatured', label: 'Nổi bật', render: (item) => item.isFeatured ? 'Có' : 'Không' },
      ]}
      fields={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Danh mục', type: 'select', options: categoryOptions },
        { key: 'thumbnail', label: 'Ảnh đại diện', fullWidth: true, helpText: 'Có thể dán URL hoặc upload trực tiếp.' },
        { key: 'client.name', label: 'Tên khách hàng' },
        { key: 'client.industry', label: 'Lĩnh vực' },
        { key: 'description', label: 'Mô tả', type: 'textarea' },
        { key: 'htmlContent', label: 'Nội dung HTML', type: 'textarea', rows: 8 },
        { key: 'images', label: 'Danh sách hình', type: 'list', fullWidth: true, helpText: 'Mỗi dòng là một ảnh gallery. Có thể upload nhiều ảnh cùng lúc.' },
        { key: 'tags', label: 'Tags', type: 'list' },
        { key: 'order', label: 'Thứ tự', type: 'number' },
        { key: 'isFeatured', label: 'Nổi bật', type: 'checkbox' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
      renderField={({ field, value, onChange }) => {
        if (field.key === 'thumbnail') {
          return <ProjectMediaField label="ảnh đại diện" value={value} onChange={onChange} helpText={field.helpText} />;
        }

        if (field.key === 'images') {
          return <ProjectMediaField label="thư viện ảnh" value={value} onChange={onChange} multiple helpText={field.helpText} />;
        }

        return null;
      }}
    />
  );
}

export default ProjectManager;

