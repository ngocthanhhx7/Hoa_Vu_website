import { Link } from 'react-router-dom';
import { buildBlogPath } from '../../utils/category';
import { clampText, formatDate, stripHtml } from '../../utils/format';
import { BRAND } from '../../config/brand';

function BlogCard({ post }) {
  const excerpt = post.excerpt || clampText(stripHtml(post.htmlContent), 180);

  return (
    <article className="blog-card">
      <div className="media">
        <div>
          <small className="d-block text-uppercase fw-semibold mb-2">{post.category?.name || 'Blog'}</small>
          <strong className="fs-5">{post.author?.name || `${BRAND.shortName} Team`}</strong>
        </div>
      </div>
      <div className="content">
        <p className="text-soft small mb-2">{formatDate(post.createdAt)}</p>
        <h3 className="h5 mb-3">{post.title}</h3>
        <p className="text-soft mb-4">{excerpt}</p>
        <Link className="fw-semibold" to={buildBlogPath(post)}>
          Read more
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
