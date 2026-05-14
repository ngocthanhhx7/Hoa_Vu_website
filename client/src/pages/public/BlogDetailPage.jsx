import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import { SITE_URL, absoluteUrl, buildCanonicalUrl, stripToText } from '../../utils/seo';

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

  const postPath = `/blog/${post.category?.slug || category}/${post.slug}`;
  const seoDescription = post.seo?.description || post.excerpt || stripToText(post.htmlContent);
  const seoImage = resolveMediaUrl(post.thumbnail);
  const breadcrumbItems = [
    { label: 'Blog', to: '/blog' },
    { label: post.category?.name || category, to: `/blog/${post.category?.slug || category}` },
    { label: post.title },
  ];

  const blogJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${SITE_URL}${postPath}#blogposting`,
      headline: post.title,
      description: seoDescription,
      url: buildCanonicalUrl(postPath),
      image: seoImage ? absoluteUrl(seoImage) : undefined,
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      wordCount: stripToText(post.htmlContent).split(/\s+/).length || undefined,
      inLanguage: 'vi-VN',
      author: {
        '@type': 'Person',
        name: post.author?.name || 'Hoa Vu Team',
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'HOAVU BRANDING',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/favicon-512x512.png'),
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': buildCanonicalUrl(postPath),
      },
      articleSection: post.category?.name || 'Blog',
      keywords: (post.seo?.keywords || post.tags || []).join(', '),
    },
  ];

  return (
    <>
      <SEO
        title={post.seo?.title || post.title}
        description={seoDescription}
        path={postPath}
        image={seoImage}
        imageAlt={post.title}
        type="article"
        keywords={post.seo?.keywords || post.tags}
        jsonLd={blogJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
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
