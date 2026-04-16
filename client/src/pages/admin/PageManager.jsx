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
        { key: 'seo.keywords', label: 'SEO keywords', type: 'list' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default PageManager;
