import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import { publicAPI } from '../../services/api';

function BlogDetailPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    publicAPI.getBlogPostBySlug(slug).then((res) => {
      if (res.data.success) {
        const currentPost = res.data.data;
        setPost(currentPost);
        if (currentPost.category?.slug && currentPost.category.slug !== category) {
          navigate(`/blog/${currentPost.category.slug}/${currentPost.slug}`, { replace: true });
        }
      }
    }).catch(() => {});
  }, [category, navigate, slug]);

  const safeHtml = useMemo(() => DOMPurify.sanitize(post?.htmlContent || ''), [post?.htmlContent]);

  if (!post) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{post.seo?.title || `${post.title} | HOA VU`}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: post.category?.name || category, to: `/blog/${post.category?.slug || category}` }, { label: post.title }]} />
      <section className="section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{post.title}</h1>
              <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--gray-500)', marginBottom: 30 }}>
                <span>{post.author?.name || 'Hoa Vu Team'}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                <span>{post.readTime || 5} phút đọc</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ lineHeight: 2, fontSize: 16, color: 'var(--gray-700)' }} />
            </Col>
          </Row>

          {post.relatedPosts?.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--gray-200)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Bài viết liên quan</h3>
              <Row>
                {post.relatedPosts.map((item) => (
                  <Col key={item._id} lg={3} md={6} className="mb-4">
                    <BlogCard post={{ ...item, category: post.category }} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

export default BlogDetailPage;
