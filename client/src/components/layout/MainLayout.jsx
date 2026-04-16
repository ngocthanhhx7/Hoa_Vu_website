import { Outlet } from 'react-router-dom';
import ChatbotWidget from '../common/ChatbotWidget';
import FloatingCTA from './FloatingCTA';
import Footer from './Footer';
import Header from './Header';

function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
      <ChatbotWidget />
    </div>
  );
}

export default MainLayout;
