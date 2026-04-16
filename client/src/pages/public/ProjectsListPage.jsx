import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ProjectGrid from '../../components/common/ProjectGrid';
import { publicAPI } from '../../services/api';

function ProjectsListPage() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    publicAPI.getServiceCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    publicAPI.getProjects({ page, limit: 12 }).then((res) => {
      if (res.data.success) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      }
    }).catch(() => {});
  }, [page]);

  return (
    <>
      <Helmet>
        <title>Dự án | HOA VU</title>
      </Helmet>
      <HoaVuBreadcrumb items={[{ label: 'Dự án' }]} />
      <section className="section">
        <Container>
          <h2 className="section-title">Tất cả dự án</h2>
          <div className="category-tabs mt-4">
            <NavLink to="/du-an" end className={({ isActive }) => isActive ? 'active' : ''}>Tất cả</NavLink>
            {categories.map((category) => (
              <NavLink key={category._id} to={`/du-an/${category.slug}`} className={({ isActive }) => isActive ? 'active' : ''}>{category.name}</NavLink>
            ))}
          </div>
          <ProjectGrid projects={projects} />
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
        </Container>
      </section>
    </>
  );
}

export default ProjectsListPage;
