export interface BaseFeedItem {
  id: string;
  type: 'email' | 'post';
  timestamp: string;
}

export interface EmailFeedItem extends BaseFeedItem {
  type: 'email';
  sender: string;
  subject: string;
  preview: string;
  isRead?: boolean;
}

export interface PostFeedItem extends BaseFeedItem {
  type: 'post';
  imageUrl: string;
  posterName: string;
  description: string;
}

export type FeedItem = EmailFeedItem | PostFeedItem;

export interface FeedData {
  feedItems: FeedItem[];
}
