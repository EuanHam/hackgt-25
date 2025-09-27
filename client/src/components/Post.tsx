import React from 'react';
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
  return (
    <div className="post">
      <div className="post-image-container">
        <img 
          src={imageUrl} 
          alt={description}
          className="post-image"
        />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="poster-name">{posterName}</div>
          {timestamp && <div className="post-timestamp">{timestamp}</div>}
        </div>
        <div className="post-description">{description}</div>
      </div>
    </div>
  );
};

export default Post;
