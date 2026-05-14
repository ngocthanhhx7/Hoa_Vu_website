import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { SITE_URL } from '../../utils/seo';

function BlogByCategoryPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    publicAPI.getBlogCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
        setCurrentCategory(res.data.data.find((item) => item.slug === category) || null);
      }
    }).catch(() => {});
  }, [category]);

  useEffect(() => {
    if (!currentCategory?._id) {
      return;
    }

    publicAPI.getBlogPosts({ category: currentCategory._id, page, limit: 9 }).then((res) => {
      if (res.data.success) {
        setPosts(res.data.data);
        setPagination(res.data.pagination);
      }
    }).catch(() => {});
  }, [currentCategory, page]);

  const breadcrumbItems = [{ label: 'Blog', to: '/blog' }, { label: currentCategory?.name || category }];

  const blogCategoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/blog/${category}#collectionpage`,
    name: currentCategory ? `Blog ${currentCategory.name}` : 'Blog thiết kế thương hiệu',
    description: `Bài viết ${currentCategory?.name || 'về thiết kế thương hiệu'} từ HOAVU BRANDING.`,
    url: `${SITE_URL}/blog/${category}`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/blog/${post.category?.slug || category}/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <SEO
        title={currentCategory ? `Blog ${currentCategory.name}` : 'Blog thiết kế thương hiệu'}
        description={`Bài viết ${currentCategory?.name || 'về thiết kế thương hiệu'} từ HOAVU BRANDING.`}
        path={page > 1 ? `/blog/${category}?page=${page}` : `/blog/${category}`}
        jsonLd={blogCategoryJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="section">
        <Container>
          <h1 className="section-title">{currentCategory?.name || 'Blog'}</h1>
          <div className="category-tabs mb-4">
            <NavLink to="/blog" end className={({ isActive }) => isActive ? 'active' : ''}>Tất cả</NavLink>
            {categories.map((item) => (
              <NavLink key={item._id} to={`/blog/${item.slug}`} className={({ isActive }) => isActive ? 'active' : ''}>{item.name}</NavLink>
            ))}
          </div>
          <Row>
            {posts.map((post) => (
              <Col key={post._id} lg={4} md={6} className="mb-4">
                <BlogCard post={post} />
              </Col>
            ))}
          </Row>
          {posts.length === 0 ? <div className="text-center py-5" style={{ color: 'var(--gray-500)' }}>Chưa có bài viết nào trong danh mục này.</div> : null}
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
        </Container>
      </section>
    </>
  );
}

export default BlogByCategoryPage;
