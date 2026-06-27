import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from '../../components/common/BlogCard';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import { SITE_URL, stripToText } from '../../utils/seo';
import { buildBlogImageAlt, normalizeFaqs, summarizeForAi } from '../../utils/seoContent';
import { buildBlogPostingSchema, buildFaqSchema } from '../../utils/schema';

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
  const canonicalPath = post.seo?.canonicalPath || postPath;
  const seoDescription = post.seo?.description || post.excerpt || stripToText(post.htmlContent);
  const seoImage = resolveMediaUrl(post.seo?.ogImage || post.thumbnail);
  const faqs = normalizeFaqs(post.seo?.faqs);
  const aiSummary = summarizeForAi(post.seo?.aiSummary || post.excerpt || post.htmlContent, 5);
  const breadcrumbItems = [
    { label: 'Blog', to: '/blog' },
    { label: post.category?.name || category, to: `/blog/${post.category?.slug || category}` },
    { label: post.title },
  ];

  const blogJsonLd = [
    buildBlogPostingSchema({
      siteUrl: SITE_URL,
      path: canonicalPath,
      title: post.title,
      description: seoDescription,
      image: seoImage,
      authorName: post.author?.name || 'Hoa Vu Team',
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      articleSection: post.category?.name || 'Blog',
      keywords: post.seo?.keywords || post.tags,
    }),
    buildFaqSchema(faqs, { visible: faqs.length > 0 }),
  ].filter(Boolean);

  return (
    <>
      <SEO
        title={post.seo?.title || post.title}
        description={seoDescription}
        path={canonicalPath}
        image={seoImage}
        imageAlt={post.seo?.imageAlt || post.thumbnailAlt || buildBlogImageAlt(post.title)}
        type="article"
        keywords={post.seo?.keywords || post.tags}
        noindex={post.seo?.noindex}
        jsonLd={blogJsonLd}
        breadcrumbItems={breadcrumbItems}
        datePublished={post.createdAt}
        dateModified={post.updatedAt}
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

              {seoImage ? (
                <figure className="mb-4">
                  <img
                    src={seoImage}
                    alt={post.thumbnailAlt || post.seo?.imageAlt || buildBlogImageAlt(post.title)}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </figure>
              ) : null}

              {aiSummary.length ? (
                <div className="rich-text mb-4">
                  <h2>Tóm tắt nhanh</h2>
                  <ul>{aiSummary.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ) : null}

              <div dangerouslySetInnerHTML={{ __html: safeHtml }} style={{ lineHeight: 2, fontSize: 16, color: 'var(--gray-700)' }} />

              {faqs.length ? (
                <div className="rich-text mt-5">
                  <h2>Câu hỏi thường gặp</h2>
                  {faqs.map((item) => (
                    <div key={item.question} className="mb-3">
                      <h3>{item.question}</h3>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}
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
