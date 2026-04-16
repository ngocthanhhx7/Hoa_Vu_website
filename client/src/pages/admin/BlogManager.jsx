import { useEffect, useState } from 'react';
import CrudManager from './CrudManager';
import { adminAPI } from '../../services/api';

function BlogManager() {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    adminAPI.getBlogCategories().then((res) => {
      setCategoryOptions((res.data?.data || []).map((item) => ({ value: item._id, label: item.name })));
    }).catch(() => {});
  }, []);

  return (
    <CrudManager
      title="Quản lý blog"
      apiGet={() => adminAPI.getBlogPosts({ page: 1, limit: 100 })}
      apiCreate={adminAPI.createBlogPost}
      apiUpdate={adminAPI.updateBlogPost}
      apiDelete={adminAPI.deleteBlogPost}
      columns={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'category.name', label: 'Danh mục' },
        { key: 'author.name', label: 'Tác giả' },
        { key: 'isFeatured', label: 'Nổi bật', render: (item) => item.isFeatured ? 'Yes' : 'No' },
      ]}
      fields={[
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Danh mục', type: 'select', options: categoryOptions },
        { key: 'thumbnail', label: 'Thumbnail URL' },
        { key: 'excerpt', label: 'Tóm tắt', type: 'textarea' },
        { key: 'htmlContent', label: 'Nội dung HTML', type: 'textarea' },
        { key: 'author.name', label: 'Tác giả' },
        { key: 'tags', label: 'Tags', type: 'list' },
        { key: 'readTime', label: 'Read time', type: 'number' },
        { key: 'isFeatured', label: 'Nổi bật', type: 'checkbox' },
        { key: 'isActive', label: 'Hiển thị', type: 'checkbox' },
      ]}
    />
  );
}

export default BlogManager;
