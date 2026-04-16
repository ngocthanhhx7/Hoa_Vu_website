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
        aria-label="Messenger"
      >
        <FiMessageCircle />
      </a>
      <a
        className="phone"
        href={BRAND.contact.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Fanpage Hoa Vu Branding"
      >
        <FiExternalLink />
      </a>
    </div>
  );
};

export default FloatingCTA;
