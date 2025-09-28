export interface BaseFeedItem {
  id: string;
  type: 'email' | 'post' | 'group';
  timestamp: string;
}

export interface EmailFeedItem extends BaseFeedItem {
  type: 'email';
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  body?: string;
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
  senderName: string;
  preview: string;
  groupName: string;
  groupId: string;        // For GroupMe messages
  unreadCount?: number;   // Number of unread messages in the group
  groupIconUrl?: string;  // URL for the group's icon
  lastMessageTimestamp?: number; // Unix timestamp of the last message in seconds
}

export type FeedItem = EmailFeedItem | PostFeedItem | GroupFeedItem;

export interface FeedData {
  feedItems: FeedItem[];
}
