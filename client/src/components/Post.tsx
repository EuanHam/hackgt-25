import React from 'react';
import './Post.css';

interface PostProps {
  imageUrl: string;
  posterName: string;
  description: string;
  timestamp?: string;
  onImageClick?: (imageUrl: string, alt: string) => void;
}

const Post: React.FC<PostProps> = ({ 
  imageUrl, 
  posterName, 
  description, 
  timestamp,
  onImageClick 
}) => {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(imageUrl, description);
    }
  };

  return (
    <div className="post">
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
            onClick={handleImageClick}
          />
        </div>
        <div className="post-content">
          <div className="post-description">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
