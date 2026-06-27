import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import HoaVuBreadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ProjectGrid from '../../components/common/ProjectGrid';
import SEO from '../../components/common/SEO';
import { publicAPI } from '../../services/api';
import { SITE_URL } from '../../utils/seo';
import { buildCollectionPageSchema } from '../../utils/schema';

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

  const breadcrumbItems = [{ label: 'Dự án', to: '/du-an' }, { label: currentCategory?.name || category }];
  const title = currentCategory ? `Dự án ${currentCategory.name}` : 'Dự án thiết kế thương hiệu';
  const description = `Các dự án ${currentCategory?.name || 'thiết kế thương hiệu'} đã thực hiện bởi HOAVU BRANDING.`;
  const basePath = `/du-an/${category}`;
  const path = page > 1 ? `${basePath}?page=${page}` : basePath;

  const projectsCategoryJsonLd = buildCollectionPageSchema({
    siteUrl: SITE_URL,
    path: basePath,
    name: title,
    description,
    items: projects.map((project) => ({
      url: `${SITE_URL}/du-an/${project.category?.slug || category}/${project.slug}`,
      name: project.title,
      description: project.description,
    })),
  });

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={path}
        prevPath={page > 2 ? `${basePath}?page=${page - 1}` : page === 2 ? basePath : undefined}
        nextPath={page < pagination.pages ? `${basePath}?page=${page + 1}` : undefined}
        jsonLd={projectsCategoryJsonLd}
        breadcrumbItems={breadcrumbItems}
      />
      <HoaVuBreadcrumb items={breadcrumbItems} />
      <section className="section">
        <Container>
          <h1 className="section-title">{currentCategory?.name || 'Danh mục dự án'}</h1>
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
