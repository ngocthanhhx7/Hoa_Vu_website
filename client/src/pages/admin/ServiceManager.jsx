import { useEffect, useState } from 'react';
import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';

function ServiceManager() {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    adminAPI.getServiceCategories().then((res) => {
      setCategoryOptions((res.data?.data || []).map((item) => ({ value: item._id, label: item.name })));
    }).catch(() => {});
  }, []);

  return (
    <CrudManager
      title="Quản lý dịch vụ"
      apiGet={adminAPI.getServices}
      apiCreate={adminAPI.createService}
      apiUpdate={adminAPI.updateService}
      apiDelete={adminAPI.deleteService}
      columns={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'category.name', label: 'Danh mục' },
        { key: 'order', label: 'Thứ tự' },
        { key: 'isActive', label: 'Hiển thị', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      fields={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Danh mục', type: 'select', options: categoryOptions },
        { key: 'icon', label: 'Icon' },
        { key: 'shortDescription', label: 'Mô tả ngắn', type: 'textarea' },
        { key: 'description', label: 'Mô tả đầy đủ', type: 'textarea' },
        { key: 'features', label: 'Tính năng', type: 'list', helpText: 'Nhập bằng dấu phẩy hoặc xuống dòng.' },
        { key: 'htmlContent', label: 'Nội dung HTML', type: 'textarea' },
        { key: 'order', label: 'Thứ tự', type: 'number' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default ServiceManager;
