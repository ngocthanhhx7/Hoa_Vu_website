import { Container, Row, Col } from 'react-bootstrap';

function AnimatedNumber({ value }) {
  return <>{value.toLocaleString()}</>;
}

function StatsCounter({ stats }) {
  const defaultStats = stats || [
    { value: '20000', label: 'Khách hàng hài lòng', suffix: '' },
    { value: '30', label: 'Quốc gia sử dụng', suffix: '+' },
    { value: '50', label: 'Nhân sự sáng tạo', suffix: '+' },
    { value: '247', label: 'Hỗ trợ khách hàng', suffix: '', isText: true, display: '24/7' },
  ];

  return (
    <section className="stats-section">
      <Container>
        <Row>
          {defaultStats.map((stat) => (
            <Col key={stat.label} md={3} sm={6} className="mb-3">
              <div className="stat-item">
                <div className="stat-number">
                  {stat.isText ? (stat.display || stat.value) : <AnimatedNumber value={parseInt(stat.value, 10)} />}
                  {stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default StatsCounter;
