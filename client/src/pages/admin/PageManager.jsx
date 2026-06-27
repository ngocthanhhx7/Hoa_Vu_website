import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';

function PageManager() {
  return (
    <CrudManager
      title="Quản lý trang tĩnh"
      apiGet={adminAPI.getPages}
      apiCreate={adminAPI.createPage}
      apiUpdate={adminAPI.updatePage}
      apiDelete={adminAPI.deletePage}
      columns={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Slug' },
        { key: 'isActive', label: 'Hiển thị', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      fields={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Slug' },
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
        { key: 'seo.faqs', label: 'FAQ SEO (mỗi dòng: Câu hỏi | Câu trả lời)', type: 'faqList', fullWidth: true },
        { key: 'seo.noindex', label: 'Không index trang này', type: 'checkbox' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default PageManager;
