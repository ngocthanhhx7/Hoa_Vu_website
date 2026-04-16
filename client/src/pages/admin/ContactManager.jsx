import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';

function ContactManager() {
  return (
    <CrudManager
      title="Quản lý liên hệ"
      apiGet={() => adminAPI.getContacts({ page: 1, limit: 100 })}
      apiCreate={() => Promise.reject(new Error('Không hỗ trợ tạo liên hệ thủ công.'))}
      apiUpdate={adminAPI.updateContact}
      apiDelete={adminAPI.deleteContact}
      hideCreate
      columns={[
        { key: 'name', label: 'Tên' },
        { key: 'phone', label: 'SDT' },
        { key: 'email', label: 'Email' },
        { key: 'service', label: 'Dịch vụ' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      fields={[
        { key: 'name', label: 'Tên' },
        { key: 'phone', label: 'SDT' },
        { key: 'email', label: 'Email' },
        { key: 'company', label: 'Công ty' },
        { key: 'service', label: 'Dịch vụ' },
        { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'new', label: 'Mới' }, { value: 'contacted', label: 'Đã liên hệ' }, { value: 'in-progress', label: 'Đang xử lý' }, { value: 'closed', label: 'Đã đóng' }] },
        { key: 'notes', label: 'Ghi chú', type: 'textarea' },
        { key: 'message', label: 'Tin nhắn', type: 'textarea' },
      ]}
    />
  );
}

export default ContactManager;
