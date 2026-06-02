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
    <div className="admin-login-screen">
      <Container style={{ maxWidth: 440 }}>
        <div className="admin-login-card">
          <div className="text-center mb-4">
            <div className="admin-login-logo">H</div>
            <h3>HOA VU Admin</h3>
            <p>Đăng nhập để quản lý website</p>
          </div>
          {error ? <Alert variant="danger" className="py-2">{error}</Alert> : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" placeholder="admin@hoavu.vn" value={email} onChange={(event) => setEmail(event.target.value)} required /></Form.Group>
            <Form.Group className="mb-4"><Form.Label>Mật khẩu</Form.Label><Form.Control type="password" placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} required /></Form.Group>
            <Button type="submit" className="w-100 admin-primary-btn" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
