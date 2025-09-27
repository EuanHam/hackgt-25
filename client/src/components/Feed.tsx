import React from 'react';
import Email from './Email';
import Post from './Post';
import type { FeedItem } from '../types/feedTypes';
import { partitionFeedItemsAdvanced } from '../utils/feedPartitioner';
import feedData from '../data/feedData.json';
import './Feed.css';

interface FeedProps {
  feedItems?: FeedItem[];
  onImageClick?: (imageUrl: string, alt: string) => void;
}

const Feed: React.FC<FeedProps> = ({ feedItems, onImageClick }) => {
  // Use provided feedItems or fall back to JSON data
  const items = feedItems || feedData.feedItems;

  // Use the advanced partitioning algorithm to balance columns
  const { column1, column2, balanceScore } = partitionFeedItemsAdvanced(items as FeedItem[]);

  // Helper function to render feed item based on type
  const renderFeedItem = (item: any) => {
    if (item.type === 'email') {
      return (
        <Email
          key={item.id}
          sender={item.sender}
          subject={item.subject}
          preview={item.preview}
          timestamp={item.timestamp}
          isRead={item.isRead}
        />
      );
    } else if (item.type === 'post') {
      return (
        <Post
          key={item.id}
          imageUrl={item.imageUrl}
          posterName={item.posterName}
          description={item.description}
          timestamp={item.timestamp}
          onImageClick={onImageClick}
        />
      );
    }
    return null;
  };

  return (
    <div className="feed">
      <div className="feed-header">
        <h2>Sort by (recent for example)</h2>
        {/* Debug info - remove in production */}
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Balance Score: {balanceScore.toFixed(2)} | 
          Column 1: {column1.length} items | 
          Column 2: {column2.length} items
        </div>
      </div>
      
      <div className="feed-content">
        <div className="feed-column">
          {column1.map(renderFeedItem)}
        </div>
        
        <div className="feed-column">
          {column2.map(renderFeedItem)}
        </div>
      </div>
    </div>
  );
};

export default Feed;
