import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react';
import './ImageGallery.css';

const ImageGallery = ({ images, title }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef(null);

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Focus modal when opened for keyboard navigation
  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showModal]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <>
      <div className="gallery-grid">
        <button
          type="button"
          className="gallery-main"
          onClick={() => openModal(0)}
          aria-label={`View ${title} main image`}
        >
          <img src={images[0]} alt={`${title} - Main`} />
        </button>
        <div className="gallery-side">
          {images.slice(1, 5).map((img, index) => (
            <button
              type="button"
              key={index}
              className="gallery-thumbnail"
              onClick={() => openModal(index + 1)}
              aria-label={`View image ${index + 2}`}
            >
              <img src={img} alt={`${title} - ${index + 2}`} />
              {index === 3 && images.length > 5 && (
                <div className="gallery-more">
                  <Grid3X3 size={20} />
                  <span>+{images.length - 5} more</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <button type="button" className="show-all-btn" onClick={() => openModal(0)}>
          <Grid3X3 size={16} />
          Show all photos
        </button>
      </div>

      {showModal && (
        <div
          className="gallery-modal"
          onClick={closeModal}
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button type="button" className="modal-close" onClick={closeModal} aria-label="Close gallery">
            <X size={24} />
          </button>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-nav prev" onClick={prevImage} aria-label="Previous image">
              <ChevronLeft size={32} />
            </button>

            <div className="modal-image-container">
              <img src={images[currentIndex]} alt={`${title} - ${currentIndex + 1}`} />
              <div className="modal-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            <button type="button" className="modal-nav next" onClick={nextImage} aria-label="Next image">
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="modal-thumbnails" role="tablist" aria-label="Image thumbnails">
            {images.map((img, index) => (
              <button
                type="button"
                key={index}
                className={`modal-thumb ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`View image ${index + 1}`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
