import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ProjectGrid from '../../components/common/ProjectGrid';
import { publicAPI } from '../../services/api';

function ProjectsByCategoryPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [currentCategory, setCurrentCategory] = useState(null);
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    publicAPI.getServiceCategories().then((res) => {
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

    publicAPI.getProjects({ category: currentCategory._id, page, limit: 12 }).then((res) => {
      if (res.data.success) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      }
    }).catch(() => {});
  }, [currentCategory, page]);

  return (
    <>
      <Helmet>
        <title>{currentCategory ? `${currentCategory.name} | HOA VU` : 'Dự án | HOA VU'}</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Dự án', to: '/du-an' }, { label: currentCategory?.name || category }]} />
      <section className="section">
        <Container>
          <h2 className="section-title">{currentCategory?.name || 'Danh mục dự án'}</h2>
          <div className="category-tabs mt-4">
            <NavLink to="/du-an" end className={({ isActive }) => isActive ? 'active' : ''}>Tất cả</NavLink>
            {categories.map((item) => (
              <NavLink key={item._id} to={`/du-an/${item.slug}`} className={({ isActive }) => isActive ? 'active' : ''}>{item.name}</NavLink>
            ))}
          </div>
          <ProjectGrid projects={projects} />
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
        </Container>
      </section>
    </>
  );
}

export default ProjectsByCategoryPage;
