import React from 'react';
import Email from './Email';
import Post from './Post';
import './Feed.css';

interface EmailData {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
}

interface PostData {
  id: string;
  imageUrl: string;
  posterName: string;
  description: string;
  timestamp?: string;
}

interface FeedProps {
  emails?: EmailData[];
  posts?: PostData[];
}

const Feed: React.FC<FeedProps> = ({ emails = [], posts = [] }) => {
  // Hard-coded sample data for now
  const sampleEmails: EmailData[] = [
    {
      id: '1',
      sender: 'John Doe',
      subject: 'Meeting Tomorrow',
      preview: 'Hi, just wanted to confirm our meeting tomorrow at 2 PM. Please let me know if you need to reschedule.',
      timestamp: '2 hours ago',
      isRead: false
    }
  ];

  const samplePosts: PostData[] = [
    {
      id: '1',
      imageUrl: '/postImage.png',
      posterName: 'Jane Smith',
      description: 'Beautiful sunset from my hike today! The colors were absolutely amazing and the view was worth every step.',
      timestamp: '3 hours ago'
    }
  ];

  const displayEmails = emails.length > 0 ? emails : sampleEmails;
  const displayPosts = posts.length > 0 ? posts : samplePosts;

  return (
    <div className="feed">
      <div className="feed-header">
        <h2>Sort by (recent for example)</h2>
      </div>
      
      <div className="feed-content">
        <div className="feed-column">
          <h3>Emails</h3>
          {displayEmails.map((email) => (
            <Email
              key={email.id}
              sender={email.sender}
              subject={email.subject}
              preview={email.preview}
              timestamp={email.timestamp}
              isRead={email.isRead}
            />
          ))}
        </div>
        
        <div className="feed-column">
          <h3>Posts</h3>
          {displayPosts.map((post) => (
            <Post
              key={post.id}
              imageUrl={post.imageUrl}
              posterName={post.posterName}
              description={post.description}
              timestamp={post.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
