import { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ProjectGrid from '../../components/common/ProjectGrid';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { SITE_URL } from '../../utils/seo';

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

  const breadcrumbItems = [{ label: 'Dự án' }];

  const projectsListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/du-an#collectionpage`,
    name: 'Dự án thiết kế thương hiệu',
    description: 'Xem các dự án thiết kế logo, nhận diện thương hiệu và visual branding đã thực hiện bởi HOAVU BRANDING.',
    url: `${SITE_URL}/du-an`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Danh sách dự án thiết kế thương hiệu',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/du-an/${project.category?.slug || 'thiet-ke-logo'}/${project.slug}`,
        name: project.title,
      })),
    },
  };

  return (
    <>
      <SEO
        title="Dự án thiết kế thương hiệu"
        description="Xem các dự án thiết kế logo, nhận diện thương hiệu và visual branding đã thực hiện bởi HOAVU BRANDING."
        path={page > 1 ? `/du-an?page=${page}` : '/du-an'}
        keywords={['dự án thiết kế logo', 'portfolio branding', 'dự án nhận diện thương hiệu']}
        jsonLd={projectsListJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="section">
        <Container>
          <h1 className="section-title">Tất cả dự án</h1>
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
