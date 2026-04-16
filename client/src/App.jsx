import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles/index.css';
import MainLayout from './components/layout/MainLayout';
import AboutPage from './pages/public/AboutPage';
import BlogByCategoryPage from './pages/public/BlogByCategoryPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import BlogListPage from './pages/public/BlogListPage';
import ContactPage from './pages/public/ContactPage';
import HomePage from './pages/public/HomePage';
import NotFoundPage from './pages/public/NotFoundPage';
import PolicyPage from './pages/public/PolicyPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import ProjectsByCategoryPage from './pages/public/ProjectsByCategoryPage';
import ProjectsListPage from './pages/public/ProjectsListPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import ServicesListPage from './pages/public/ServicesListPage';
import AdminLayout from './pages/admin/AdminLayout';
import BannerManager from './pages/admin/BannerManager';
import BlogManager from './pages/admin/BlogManager';
import ContactManager from './pages/admin/ContactManager';
import DashboardPage from './pages/admin/DashboardPage';
import LoginPage from './pages/admin/LoginPage';
import MediaManager from './pages/admin/MediaManager';
import PageManager from './pages/admin/PageManager';
import ProjectManager from './pages/admin/ProjectManager';
import ServiceManager from './pages/admin/ServiceManager';
import SettingsPage from './pages/admin/SettingsPage';
import TestimonialManager from './pages/admin/TestimonialManager';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('hoavu_admin_token');
  return token ? children : <Navigate replace to="/admin/login" />;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/dich-vu" element={<ServicesListPage />} />
            <Route path="/dich-vu/:slug" element={<ServiceDetailPage />} />
            <Route path="/du-an" element={<ProjectsListPage />} />
            <Route path="/du-an/:category" element={<ProjectsByCategoryPage />} />
            <Route path="/du-an/:category/:slug" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:category" element={<BlogByCategoryPage />} />
            <Route path="/blog/:category/:slug" element={<BlogDetailPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="/chinh-sach/:slug" element={<PolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="testimonials" element={<TestimonialManager />} />
            <Route path="contacts" element={<ContactManager />} />
            <Route path="pages" element={<PageManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
