import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useSearchParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import { publicAPI } from '../../services/api';

function BlogListPage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    publicAPI.getBlogCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    publicAPI.getBlogPosts({ page, limit: 9 }).then((res) => {
      if (res.data.success) {
        setPosts(res.data.data);
        setPagination(res.data.pagination);
      }
    }).catch(() => {});
  }, [page]);

  return (
    <>
      <Helmet>
        <title>Blog | HOA VU</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Blog' }]} />
      <section className="section">
        <Container>
          <h2 className="section-title">Blog</h2>
          <div className="category-tabs mt-4">
            <NavLink to="/blog" end className={({ isActive }) => isActive ? 'active' : ''}>Tất cả</NavLink>
            {categories.map((category) => (
              <NavLink key={category._id} to={`/blog/${category.slug}`} className={({ isActive }) => isActive ? 'active' : ''}>{category.name}</NavLink>
            ))}
          </div>
          <Row>
            {posts.map((post) => (
              <Col key={post._id} lg={4} md={6} className="mb-4">
                <BlogCard post={post} />
              </Col>
            ))}
          </Row>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
        </Container>
      </section>
    </>
  );
}

export default BlogListPage;
