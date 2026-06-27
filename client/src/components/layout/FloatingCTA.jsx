import { FiExternalLink, FiMessageCircle } from 'react-icons/fi';
import { BRAND } from '../../config/brand';

const FloatingCTA = () => {
  return (
    <div className="floating-cta">
      <a
        className="messenger"
        href={BRAND.contact.messenger}
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn tin Messenger với HOAVU BRANDING"
      >
        <FiMessageCircle />
      </a>
      <a
        className="phone"
        href={BRAND.contact.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Mở fanpage HOAVU BRANDING để nhận tư vấn thiết kế logo"
      >
        <FiExternalLink />
      </a>
    </div>
  );
};

export default FloatingCTA;
