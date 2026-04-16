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
    <div style={{ display: 'flex' }}>
      <aside className="admin-sidebar">
        <div className="text-center mb-4 px-3">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ width: 45, height: 45, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 auto 8px' }}>H</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>HOA VU CMS</div>
          </Link>
        </div>
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link key={item.to} as={NavLink} to={item.to} end={item.to === '/admin/dashboard'}>
              {item.icon} {item.label}
            </Nav.Link>
          ))}
        </Nav>
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, padding: '0 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>User: {user.name || 'Admin'}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}><FiLogOut /> Đăng xuất</button>
        </div>
      </aside>
      <main className="admin-content"><Outlet /></main>
    </div>
  );
}

export default AdminLayout;
