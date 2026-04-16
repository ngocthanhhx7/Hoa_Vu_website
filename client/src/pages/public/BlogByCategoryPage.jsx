import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import { publicAPI } from '../../services/api';

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

  return (
    <>
      <Helmet>
        <title>{currentCategory ? `${currentCategory.name} | HOA VU` : 'Blog | HOA VU'}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: currentCategory?.name || category }]} />
      <section className="section">
        <Container>
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
