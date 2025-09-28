import React, { useState } from 'react';
import './Post.css';

interface PostProps {
  imageUrl: string;
  posterName: string;
  description: string;
  timestamp?: string;
}

const Post: React.FC<PostProps> = ({ 
  imageUrl, 
  posterName, 
  description, 
  timestamp
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Post card preview */}
      <div className="post" onClick={() => setIsModalOpen(true)}>
        <div className="post-header">
          <div className="poster-name">{posterName}</div>
          {timestamp && <div className="post-timestamp">{timestamp}</div>}
        </div>
        <div className="post-main-content">
          <div className="post-image-container">
            <img 
              src={imageUrl} 
              alt={description}
              className="post-image"
            />
          </div>
          <div className="post-content">
            <div className="post-description">{description}</div>
          </div>
        </div>
      </div>

      {/* Instagram-style modal */}
      {isModalOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal post-modal">
            {/* Close button */}
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>

            <div className="post-modal-content">
              {/* Left: image */}
              <div className="post-modal-image">
                <img src={imageUrl} alt={description} />
              </div>

              {/* Right: details */}
              <div className="post-modal-details">
                <div className="post-modal-header">
                  <strong>{posterName}</strong>
                  {timestamp && <span className="post-modal-timestamp">{timestamp}</span>}
                </div>
                <div className="post-modal-description">
                  {description}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Post;
