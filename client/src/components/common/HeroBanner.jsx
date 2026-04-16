import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { resolveMediaUrl } from '../../utils/media';

const HeroBanner = ({ title, description, ctaText, ctaLink, bgImage, variant = 'default', bannerImages = [] }) => {
  /* ── Slideshow state (only for image-only banners) ── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);
  const images = bannerImages.filter(Boolean);
  const hasSlideshow = images.length > 0;

  useEffect(() => {
    if (!hasSlideshow || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [hasSlideshow, images.length]);

  function goTo(index) {
    setCurrentSlide(index);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
  }

  /* ── Image-only banner (slideshow) ── */
  if (hasSlideshow) {
    return (
      <section className="hero-slideshow">
        <div className="hero-slideshow__track">
          {images.map((img, index) => {
            const src = typeof img === 'string' ? resolveMediaUrl(img) : resolveMediaUrl(img.url);
            const alt = typeof img === 'string' ? 'Banner Hoa Vu' : 'Banner Hoa Vu';

            return (
              <div
                key={img._id || img.url || index}
                className={`hero-slideshow__slide ${index === currentSlide ? 'is-active' : ''}`}
              >
                <img src={src} alt={alt} draggable="false" />
              </div>
            );
          })}
        </div>

        {images.length > 1 && (
          <>
            <button className="hero-slideshow__arrow hero-slideshow__arrow--prev" onClick={() => goTo((currentSlide - 1 + images.length) % images.length)} aria-label="Ảnh trước">
              <FiChevronLeft />
            </button>
            <button className="hero-slideshow__arrow hero-slideshow__arrow--next" onClick={() => goTo((currentSlide + 1) % images.length)} aria-label="Ảnh sau">
              <FiChevronRight />
            </button>

            <div className="hero-slideshow__dots">
              {images.map((img, index) => (
                <button
                  key={img._id || img.url || index}
                  className={`hero-slideshow__dot ${index === currentSlide ? 'is-active' : ''}`}
                  onClick={() => goTo(index)}
                  aria-label={`Ảnh ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  /* ── Classic text banner (fallback) ── */
  const style = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <section className={`hero-banner ${variant === 'home' ? 'hero-banner--home' : ''}`} style={style}>
      <Container>
        <div className="hero-content">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {ctaText && ctaLink && (
            <Link to={ctaLink} className="btn-hoavu btn-hoavu--white">{ctaText}</Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroBanner;
