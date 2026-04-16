import { useEffect, useState } from 'react';
import { Alert, Col, Row, Table } from 'react-bootstrap';
import { FiAlertCircle, FiFileText, FiFolder, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { adminAPI } from '../../services/api';

function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getDashboard().then((res) => {
      if (res.data.success) {
        setData(res.data.data);
      }
    }).catch((err) => {
      setError(err.response?.data?.message || 'Không thể tải dashboard.');
    });
  }, []);

  const cards = data ? [
    { label: 'Dự án', value: data.counts.projects, icon: <FiFolder />, color: '#D2232A' },
    { label: 'Bài viết', value: data.counts.blogs, icon: <FiFileText />, color: '#FF6B35' },
    { label: 'Liên hệ', value: data.counts.contacts, icon: <FiUsers />, color: '#28a745' },
    { label: 'Đánh giá', value: data.counts.testimonials, icon: <FiMessageSquare />, color: '#6f42c1' },
    { label: 'Lead mới', value: data.counts.newLeads, icon: <FiAlertCircle />, color: '#dc3545' },
  ] : [];

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: 24 }}>Dashboard</h2>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <Row>
        {cards.map((card) => (
          <Col key={card.label} lg md={4} sm={6} className="mb-3">
            <div className="admin-stat-card" style={{ borderLeftColor: card.color }}>
              <div style={{ fontSize: 28, color: card.color, marginBottom: 8 }}>{card.icon}</div>
              <div className="number">{card.value}</div>
              <div className="label">{card.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {data?.recentContacts?.length ? (
        <div className="admin-card mt-4">
          <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Liên hệ gần đây</h5>
          <Table responsive hover size="sm">
            <thead>
              <tr><th>Tên</th><th>SĐT</th><th>Dịch vụ</th><th>Trạng thái</th><th>Ngày</th></tr>
            </thead>
            <tbody>
              {data.recentContacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.service || '-'}</td>
                  <td>{contact.status}</td>
                  <td>{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

export default DashboardPage;
