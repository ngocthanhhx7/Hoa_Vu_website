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
        { key: 'heroImage', label: 'Ảnh hero URL' },
        { key: 'heroImageAlt', label: 'Alt ảnh hero' },
        { key: 'shortDescription', label: 'Mô tả ngắn', type: 'textarea' },
        { key: 'description', label: 'Mô tả đầy đủ', type: 'textarea' },
        { key: 'features', label: 'Tính năng', type: 'list', helpText: 'Nhập bằng dấu phẩy hoặc xuống dòng.' },
        { key: 'offerText', label: 'Kết quả bàn giao / Offer text', type: 'textarea' },
        { key: 'serviceArea', label: 'Khu vực phục vụ' },
        { key: 'htmlContent', label: 'Nội dung HTML', type: 'textarea' },
        { key: 'seo.title', label: 'SEO title' },
        { key: 'seo.description', label: 'SEO description', type: 'textarea' },
        { key: 'seo.primaryKeyword', label: 'Từ khóa chính' },
        { key: 'seo.secondaryKeywords', label: 'Từ khóa phụ', type: 'list' },
        { key: 'seo.keywords', label: 'SEO keywords', type: 'list' },
        { key: 'seo.canonicalPath', label: 'Canonical path' },
        { key: 'seo.ogImage', label: 'OG image URL' },
        { key: 'seo.imageAlt', label: 'SEO image alt' },
        { key: 'seo.aiSummary', label: 'AI summary', type: 'textarea', rows: 3 },
        { key: 'seo.faqs', label: 'FAQ SEO (mỗi dòng: Câu hỏi | Câu trả lời)', type: 'faqList', fullWidth: true, placeholder: 'Dịch vụ bao gồm gì? | Dịch vụ bao gồm tư vấn, thiết kế concept và bàn giao file.' },
        { key: 'seo.noindex', label: 'Không index trang này', type: 'checkbox' },
        { key: 'order', label: 'Thứ tự', type: 'number' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default ServiceManager;
