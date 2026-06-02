import { useEffect, useId, useRef, useState } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';
import { publicAPI } from '../../services/api';
import { BRAND } from '../../config/brand';

const DEFAULT_GREETING = 'Xin chào! Tôi là trợ lý AI của doanh nghiệp. Tôi có thể giúp bạn tìm hiểu dịch vụ, báo giá và kết nối nhanh tới đội ngũ tư vấn.';
const DEFAULT_QUICK_REPLIES = ['Dịch vụ', 'Nhận báo giá', 'Xem dự án', 'Liên hệ tư vấn'];

function ChatbotWidget() {
  const { settings } = useSettings();
  const chatbotConfig = settings?.chatbotConfig || {};
  const greeting = chatbotConfig.greeting || DEFAULT_GREETING;
  const facebookUrl = settings?.socialLinks?.facebook || BRAND.contact.facebook;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [quickReplies, setQuickReplies] = useState(DEFAULT_QUICK_REPLIES);
  const sessionId = useId();
  const messagesRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(chatbotConfig.quickReplies) && chatbotConfig.quickReplies.length > 0) {
      setQuickReplies(chatbotConfig.quickReplies);
    }
  }, [settings]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  function toggleChat() {
    setIsOpen((current) => {
      const next = !current;
      if (next && messages.length === 0) {
        setMessages([{ role: 'bot', message: greeting }]);
      }
      return next;
    });
  }

  async function sendMessage(text) {
    const userMessage = (text || input).trim();
    if (!userMessage) {
      return;
    }

    setMessages((current) => [...current, { role: 'user', message: userMessage }]);
    setInput('');

    try {
      const res = await publicAPI.sendChatMessage({ sessionId: `chat_${sessionId}`, message: userMessage });
      if (res.data.success) {
        setMessages((current) => [...current, { role: 'bot', message: res.data.data.message, action: res.data.data.action }]);
        if (Array.isArray(res.data.data.quickReplies) && res.data.data.quickReplies.length > 0) {
          setQuickReplies(res.data.data.quickReplies);
        }
      }
    } catch {
      setMessages((current) => [...current, { role: 'bot', message: `Hiện chưa thể phản hồi tự động. Bạn có thể nhắn trực tiếp qua fanpage: ${BRAND.contact.facebook}` }]);
    }
  }

  return (
    <div className="chatbot-widget">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Hoa Vu Branding</h4>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>
              <FiX />
            </button>
          </div>

          <div className="chatbot-messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-message chat-message--${message.role}`}>
                {message.message}
                {message.action ? (
                  <div style={{ marginTop: 8 }}>
                    <a href={message.action.url} style={{ color: message.role === 'bot' ? 'var(--primary)' : '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'underline' }}>
                      {`${message.action.label} ->`}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="chat-quick-replies">
            {quickReplies.map((item) => (
              <button key={item} className="chat-quick-reply" onClick={() => sendMessage(item)}>{item}</button>
            ))}
          </div>

          <div className="chatbot-input">
            <input type="text" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }} placeholder="Nhập tin nhắn..." />
            <button onClick={() => sendMessage()}><FiSend /></button>
          </div>
        </div>
      ) : null}

      <button className="chatbot-trigger" onClick={toggleChat}>
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>
    </div>
  );
}

export default ChatbotWidget;
