import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NavLink, useSearchParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { SITE_URL } from '../../utils/seo';
import { buildCollectionPageSchema } from '../../utils/schema';

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

  const breadcrumbItems = [{ label: 'Blog' }];
  const title = 'Blog thiết kế thương hiệu';
  const description = 'Bài viết, ý tưởng và kinh nghiệm về thiết kế logo, nhận diện thương hiệu và xây dựng hình ảnh doanh nghiệp từ HOAVU BRANDING.';
  const path = page > 1 ? `/blog?page=${page}` : '/blog';

  const blogListJsonLd = buildCollectionPageSchema({
    siteUrl: SITE_URL,
    path: '/blog',
    name: title,
    description,
    items: posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.category?.slug || 'uncategorized'}/${post.slug}`,
      name: post.title,
      description: post.excerpt,
    })),
  });

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={path}
        prevPath={page > 2 ? `/blog?page=${page - 1}` : page === 2 ? '/blog' : undefined}
        nextPath={page < pagination.pages ? `/blog?page=${page + 1}` : undefined}
        keywords={['blog thiết kế logo', 'cẩm nang branding', 'ý tưởng nhận diện thương hiệu']}
        jsonLd={blogListJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="section">
        <Container>
          <h1 className="section-title">Blog</h1>
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
