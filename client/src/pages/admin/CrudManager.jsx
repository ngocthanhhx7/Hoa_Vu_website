import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';

function getValueByPath(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source);
}

function setValueByPath(target, path, value) {
  const keys = path.split('.');
  const clone = { ...target };
  let current = clone;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
      return;
    }
    current[key] = current[key] ? { ...current[key] } : {};
    current = current[key];
  });

  return clone;
}

function serializeFieldValue(field, value) {
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'number') return value === '' ? undefined : Number(value);
  if (field.type === 'list') return String(value || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  return value;
}

function normalizeIdentifier(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (typeof value._id === 'string') return value._id;
    if (value._id && typeof value._id === 'object' && typeof value._id.$oid === 'string') return value._id.$oid;
    if (typeof value.$oid === 'string') return value.$oid;
  }
  return String(value);
}

function CrudManager({
  title,
  apiGet,
  apiCreate,
  apiUpdate,
  apiDelete,
  fields,
  columns,
  hideCreate = false,
  modalSize = 'lg',
  renderField,
}) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  async function runLoad() {
    try {
      const res = await apiGet();
      setItems(res.data?.data || []);
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Không thể tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    setLoading(true);
    runLoad();
  }

  function buildEmptyForm() {
    return fields.reduce((result, field) => setValueByPath(result, field.key, field.type === 'checkbox' ? false : ''), {});
  }

  function openCreate() {
    setEditing(null);
    setForm(buildEmptyForm());
    setShowModal(true);
  }

  function openEdit(item) {
    const nextForm = fields.reduce((result, field) => {
      const rawValue = getValueByPath(item, field.key);
      let value = rawValue;

      if (field.type === 'list' && Array.isArray(rawValue)) {
        value = rawValue.join('\n');
      }

      if (field.type === 'select') {
        value = normalizeIdentifier(rawValue);
      }

      return setValueByPath(result, field.key, value ?? (field.type === 'checkbox' ? false : ''));
    }, {});
    setEditing(item);
    setForm(nextForm);
    setShowModal(true);
  }

  function handleChange(field, value) {
    setForm((current) => setValueByPath(current, field.key, value));
  }

  async function handleSave() {
      const payload = fields.reduce((result, field) => {
      const rawValue = getValueByPath(form, field.key);
      const preparedValue = field.type === 'select' ? normalizeIdentifier(rawValue) : rawValue;
      const value = serializeFieldValue(field, preparedValue);
      return value === undefined ? result : setValueByPath(result, field.key, value);
    }, {});

    try {
      if (editing) {
        await apiUpdate(editing._id, payload);
        setAlert({ type: 'success', msg: 'Cập nhật thành công.' });
      } else {
        await apiCreate(payload);
        setAlert({ type: 'success', msg: 'Tạo mới thành công.' });
      }
      setShowModal(false);
      refresh();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Có lỗi xảy ra.' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xác nhận xóa mục này?')) return;
    try {
      await apiDelete(id);
      setAlert({ type: 'success', msg: 'Đã xóa thành công.' });
      refresh();
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Xóa thất bại.' });
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ fontWeight: 800 }}>{title}</h2>
        {!hideCreate ? <Button variant="danger" onClick={openCreate}><FiPlus /> Thêm mới</Button> : null}
      </div>
      {alert ? <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert> : null}
      <div className="admin-card">
        <Table responsive hover>
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
              <th style={{ width: 120 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(item) : String(getValueByPath(item, column.key) ?? '')}</td>)}
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(item)}><FiEdit /></Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></Button>
                </td>
              </tr>
            ))}
            {!items.length && !loading ? <tr><td colSpan={columns.length + 1} className="text-center text-muted py-4">Chưa có dữ liệu</td></tr> : null}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size={modalSize}>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Chỉnh sửa' : 'Thêm mới'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row>
            {fields.map((field) => {
              const value = getValueByPath(form, field.key) ?? (field.type === 'checkbox' ? false : '');
              const customField = renderField?.({
                field,
                value,
                form,
                editing,
                onChange: (nextValue) => handleChange(field, nextValue),
              });

              return (
                <Col key={field.key} md={field.fullWidth || field.type === 'textarea' || field.type === 'list' ? 12 : 6} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    {customField || (field.type === 'textarea' || field.type === 'list' ? (
                      <Form.Control
                        as="textarea"
                        rows={field.rows || (field.type === 'list' ? 3 : 5)}
                        value={value}
                        onChange={(event) => handleChange(field, event.target.value)}
                      />
                    ) : field.type === 'select' ? (
                      <Form.Select value={value} onChange={(event) => handleChange(field, event.target.value)}>
                        <option value="">-- Chọn --</option>
                        {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </Form.Select>
                    ) : field.type === 'checkbox' ? (
                      <Form.Check type="switch" checked={Boolean(value)} onChange={(event) => handleChange(field, event.target.checked)} label={value ? 'Bật' : 'Tắt'} />
                    ) : (
                      <Form.Control type={field.type || 'text'} value={value} onChange={(event) => handleChange(field, event.target.value)} />
                    ))}
                    {!customField && field.helpText ? <Form.Text muted>{field.helpText}</Form.Text> : null}
                  </Form.Group>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleSave}>{editing ? 'Cập nhật' : 'Tạo mới'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CrudManager;
