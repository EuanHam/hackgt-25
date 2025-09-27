export interface BaseFeedItem {
  id: string;
  type: 'email' | 'post' | 'group';
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

export interface GroupFeedItem extends BaseFeedItem {
  type: 'group';
  groupName: string;
  unreadCount: number;
}

export type FeedItem = EmailFeedItem | PostFeedItem | GroupFeedItem;

export interface FeedData {
  feedItems: FeedItem[];
}
