import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FiFile, FiFileText, FiFolder, FiGrid, FiHome, FiImage, FiLayers, FiLogOut, FiMessageSquare, FiSettings, FiUsers } from 'react-icons/fi';

function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('hoavu_admin_user') || '{}');

  function handleLogout() {
    localStorage.removeItem('hoavu_admin_token');
    localStorage.removeItem('hoavu_admin_user');
    navigate('/admin/login');
  }

  const menuItems = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/banners', icon: <FiLayers />, label: 'Banner' },
    { to: '/admin/services', icon: <FiGrid />, label: 'Dịch vụ' },
    { to: '/admin/projects', icon: <FiFolder />, label: 'Dự án' },
    { to: '/admin/blog', icon: <FiFileText />, label: 'Blog' },
    { to: '/admin/testimonials', icon: <FiMessageSquare />, label: 'Đánh giá' },
    { to: '/admin/contacts', icon: <FiUsers />, label: 'Liên hệ' },
    { to: '/admin/pages', icon: <FiFile />, label: 'Trang tĩnh' },
    { to: '/admin/media', icon: <FiImage />, label: 'Media' },
    { to: '/admin/settings', icon: <FiSettings />, label: 'Cài đặt' },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/" className="admin-brand__link">
            <div className="admin-brand__mark">H</div>
            <div>
              <div className="admin-brand__name">HOA VU CMS</div>
              <div className="admin-brand__meta">Admin workspace</div>
            </div>
          </Link>
        </div>
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link key={item.to} as={NavLink} to={item.to} end={item.to === '/admin/dashboard'}>
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
        <div className="admin-user-panel">
          <div className="admin-user-panel__avatar">{(user.name || 'Admin').charAt(0).toUpperCase()}</div>
          <div className="admin-user-panel__body">
            <div className="admin-user-panel__label">Đang đăng nhập</div>
            <div className="admin-user-panel__name">{user.name || 'Admin'}</div>
          </div>
          <button className="admin-logout" onClick={handleLogout} title="Đăng xuất"><FiLogOut /></button>
        </div>
      </aside>
      <main className="admin-content"><Outlet /></main>
    </div>
  );
}

export default AdminLayout;
