import { Link, createSearchParams, useLocation } from 'react-router-dom';

function Pagination({ currentPage, totalPages }) {
  const location = useLocation();

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-wrap">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const params = new URLSearchParams(location.search);
        params.set('page', String(page));

        return (
          <Link key={page} className={page === currentPage ? 'active' : ''} to={{ pathname: location.pathname, search: `?${createSearchParams(params)}` }}>
            {page}
          </Link>
        );
      })}
    </div>
  );
}

export default Pagination;
