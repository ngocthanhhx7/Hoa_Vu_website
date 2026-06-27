import { Link } from 'react-router-dom';
import { buildBlogPath } from '../../utils/category';
import { BRAND } from '../../config/brand';
import { clampText, formatDate, stripHtml } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/media';
import { buildBlogImageAlt } from '../../utils/seoContent';

function BlogCard({ post }) {
  const excerpt = post.excerpt || clampText(stripHtml(post.htmlContent), 180);
  const thumbnail = resolveMediaUrl(post.thumbnail);

  return (
    <article className="blog-card">
      <div className="media">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={post.thumbnailAlt || buildBlogImageAlt(post.title)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div aria-hidden="true">
            <small className="d-block text-uppercase fw-semibold mb-2">{post.category?.name || 'Blog'}</small>
            <strong className="fs-5">{post.author?.name || `${BRAND.shortName} Team`}</strong>
          </div>
        )}
      </div>
      <div className="content">
        <p className="text-soft small mb-2">{formatDate(post.createdAt)}</p>
        <h3 className="h5 mb-3">{post.title}</h3>
        <p className="text-soft mb-4">{excerpt}</p>
        <Link className="fw-semibold" to={buildBlogPath(post)} aria-label={`Đọc tiếp bài viết ${post.title}`}>
          Đọc tiếp
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
