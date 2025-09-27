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
    },
    {
      id: '2',
      sender: 'Sarah Wilson',
      subject: 'Project Update',
      preview: 'The project is progressing well. We should have the first draft ready by next week.',
      timestamp: '4 hours ago',
      isRead: true
    }
  ];

  const samplePosts: PostData[] = [
    {
      id: '1',
      imageUrl: '/postImage.png',
      posterName: 'Jane Smith',
      description: 'Beautiful sunset from my hike today! The colors were absolutely amazing and the view was worth every step.',
      timestamp: '3 hours ago'
    },
    {
      id: '2',
      imageUrl: '/postImage.png',
      posterName: 'Mike Johnson',
      description: 'Just finished reading an amazing book about productivity. Highly recommend it to anyone looking to improve their workflow.',
      timestamp: '1 day ago'
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
          {/* Column 1: Email first, then Post */}
          <Email
            sender={displayEmails[0].sender}
            subject={displayEmails[0].subject}
            preview={displayEmails[0].preview}
            timestamp={displayEmails[0].timestamp}
            isRead={displayEmails[0].isRead}
          />
          <Post
            imageUrl={displayPosts[0].imageUrl}
            posterName={displayPosts[0].posterName}
            description={displayPosts[0].description}
            timestamp={displayPosts[0].timestamp}
          />
        </div>
        
        <div className="feed-column">
          {/* Column 2: Post first, then Email */}
          <Post
            imageUrl={displayPosts[1].imageUrl}
            posterName={displayPosts[1].posterName}
            description={displayPosts[1].description}
            timestamp={displayPosts[1].timestamp}
          />
          <Email
            sender={displayEmails[1].sender}
            subject={displayEmails[1].subject}
            preview={displayEmails[1].preview}
            timestamp={displayEmails[1].timestamp}
            isRead={displayEmails[1].isRead}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
