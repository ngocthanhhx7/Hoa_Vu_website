import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';

function TestimonialManager() {
  return (
    <CrudManager
      title="Quản lý đánh giá"
      apiGet={adminAPI.getTestimonials}
      apiCreate={adminAPI.createTestimonial}
      apiUpdate={adminAPI.updateTestimonial}
      apiDelete={adminAPI.deleteTestimonial}
      columns={[
        { key: 'clientName', label: 'Tên khách hàng' },
        { key: 'clientTitle', label: 'Chức vụ' },
        { key: 'clientCompany', label: 'Công ty' },
        { key: 'content', label: 'Nội dung', render: (item) => `${item.content?.slice(0, 80) || ''}${item.content?.length > 80 ? '...' : ''}` },
      ]}
      fields={[
        { key: 'clientName', label: 'Tên khách hàng' },
        { key: 'clientTitle', label: 'Chức vụ' },
        { key: 'clientCompany', label: 'Công ty' },
        { key: 'content', label: 'Nội dung', type: 'textarea' },
        { key: 'order', label: 'Thứ tự', type: 'number' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default TestimonialManager;
