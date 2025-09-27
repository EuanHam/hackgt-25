import React, { useEffect } from 'react';
import './ImageModal.css';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, alt, onClose }) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="image-modal-backdrop" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="image-modal" onClick={onClose}>
        <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="image-modal-close" onClick={onClose}>
            ×
          </button>
          <img 
            src={imageUrl} 
            alt={alt} 
            className="image-modal-image"
          />
        </div>
      </div>
    </>
  );
};

export default ImageModal;