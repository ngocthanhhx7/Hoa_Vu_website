import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hoavu.vn');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.login({ email, password });
      if (res.data.success) {
        localStorage.setItem('hoavu_admin_token', res.data.data.token);
        localStorage.setItem('hoavu_admin_user', JSON.stringify(res.data.data.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--gray-50)' }}>
      <Container style={{ maxWidth: 420 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 40, boxShadow: 'var(--shadow-xl)' }}>
          <div className="text-center mb-4">
            <div style={{ width: 60, height: 60, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 28, margin: '0 auto 12px' }}>H</div>
            <h3 style={{ fontWeight: 800, fontSize: 20 }}>HOA VU Admin</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Đăng nhập quản trị</p>
          </div>
          {error ? <Alert variant="danger" className="py-2">{error}</Alert> : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Control type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required style={{ padding: '12px 16px', borderRadius: 8 }} /></Form.Group>
            <Form.Group className="mb-4"><Form.Control type="password" placeholder="Mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} required style={{ padding: '12px 16px', borderRadius: 8 }} /></Form.Group>
            <Button type="submit" className="w-100 btn-hoavu btn-hoavu--primary" disabled={loading} style={{ justifyContent: 'center' }}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
