import type { FeedItem } from '../types/feedTypes';

interface Column {
  items: FeedItem[];
  totalHeight: number;
  emailCount: number;
  postCount: number;
}

interface PartitionResult {
  column1: FeedItem[];
  column2: FeedItem[];
  balanceScore: number;
}

// Estimated heights for different item types (in pixels)
const ITEM_HEIGHTS = {
  email: 120, // Estimated height for email items
  post: 200, // Estimated height for post items
};

/**
 * Calculates the estimated height of a feed item
 */
function getItemHeight(item: FeedItem): number {
  return ITEM_HEIGHTS[item.type];
}

/**
 * Calculates the balance score between two columns
 * Lower score means better balance
 */
function calculateBalanceScore(column1: Column, column2: Column): number {
  const heightDiff = Math.abs(column1.totalHeight - column2.totalHeight);
  const typeDiff = Math.abs(column1.emailCount - column2.emailCount) + 
                   Math.abs(column1.postCount - column2.postCount);
  
  // Weight height difference more heavily than type difference
  return heightDiff * 2 + typeDiff;
}

/**
 * Creates a new column with an item added
 */
function addItemToColumn(column: Column, item: FeedItem): Column {
  return {
    items: [...column.items, item],
    totalHeight: column.totalHeight + getItemHeight(item),
    emailCount: column.emailCount + (item.type === 'email' ? 1 : 0),
    postCount: column.postCount + (item.type === 'post' ? 1 : 0),
  };
}

/**
 * Parses a date string in "Month Day, Year" format to a Date object
 */
function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Sorts feed items by recency (most recent first)
 */
function sortByRecency(feedItems: FeedItem[]): FeedItem[] {
  return [...feedItems].sort((a, b) => {
    const dateA = parseDate(a.timestamp);
    const dateB = parseDate(b.timestamp);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });
}

/**
 * Partitions feed items into two balanced columns using a greedy algorithm
 * Prioritizes more recent posts by sorting them first
 */
export function partitionFeedItems(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Sort items by recency first, then by type for better distribution
  const sortedItems = sortByRecency(feedItems).sort((a, b) => {
    // Within the same date, alternate between types for better distribution
    if (a.type !== b.type) {
      return a.type === 'email' ? -1 : 1;
    }
    return 0;
  });

  let column1: Column = { items: [], totalHeight: 0, emailCount: 0, postCount: 0 };
  let column2: Column = { items: [], totalHeight: 0, emailCount: 0, postCount: 0 };

  for (const item of sortedItems) {
    // Calculate what the balance would be if we add to each column
    const column1WithItem = addItemToColumn(column1, item);
    const column2WithItem = addItemToColumn(column2, item);
    
    const score1 = calculateBalanceScore(column1WithItem, column2);
    const score2 = calculateBalanceScore(column1, column2WithItem);
    
    // Add to the column that results in better balance
    if (score1 <= score2) {
      column1 = column1WithItem;
    } else {
      column2 = column2WithItem;
    }
  }

  const balanceScore = calculateBalanceScore(column1, column2);

  return {
    column1: column1.items,
    column2: column2.items,
    balanceScore,
  };
}

/**
 * Alternative partitioning algorithm that prioritizes type balance
 * Also considers recency within each type
 */
export function partitionFeedItemsByType(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Sort by recency first, then separate items by type
  const sortedItems = sortByRecency(feedItems);
  const emails = sortedItems.filter(item => item.type === 'email');
  const posts = sortedItems.filter(item => item.type === 'post');

  const column1: FeedItem[] = [];
  const column2: FeedItem[] = [];

  // Distribute emails alternately
  emails.forEach((email, index) => {
    if (index % 2 === 0) {
      column1.push(email);
    } else {
      column2.push(email);
    }
  });

  // Distribute posts alternately
  posts.forEach((post, index) => {
    if (index % 2 === 0) {
      column1.push(post);
    } else {
      column2.push(post);
    }
  });

  // Calculate balance score
  const column1Stats = {
    emailCount: column1.filter(item => item.type === 'email').length,
    postCount: column1.filter(item => item.type === 'post').length,
    totalHeight: column1.reduce((sum, item) => sum + getItemHeight(item), 0),
  };
  
  const column2Stats = {
    emailCount: column2.filter(item => item.type === 'email').length,
    postCount: column2.filter(item => item.type === 'post').length,
    totalHeight: column2.reduce((sum, item) => sum + getItemHeight(item), 0),
  };

  const balanceScore = calculateBalanceScore(column1Stats, column2Stats);

  return {
    column1,
    column2,
    balanceScore,
  };
}

/**
 * Recency-prioritized partitioning algorithm
 * Places most recent items in column 1, older items in column 2
 */
export function partitionFeedItemsByRecency(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Sort by recency (most recent first)
  const sortedItems = sortByRecency(feedItems);
  
  const column1: FeedItem[] = [];
  const column2: FeedItem[] = [];

  // Place items alternately, but prioritize recent items in column 1
  sortedItems.forEach((item, index) => {
    if (index % 2 === 0) {
      column1.push(item);
    } else {
      column2.push(item);
    }
  });

  // Calculate balance score
  const column1Stats = {
    emailCount: column1.filter(item => item.type === 'email').length,
    postCount: column1.filter(item => item.type === 'post').length,
    totalHeight: column1.reduce((sum, item) => sum + getItemHeight(item), 0),
  };
  
  const column2Stats = {
    emailCount: column2.filter(item => item.type === 'email').length,
    postCount: column2.filter(item => item.type === 'post').length,
    totalHeight: column2.reduce((sum, item) => sum + getItemHeight(item), 0),
  };

  const balanceScore = calculateBalanceScore(column1Stats, column2Stats);

  return {
    column1,
    column2,
    balanceScore,
  };
}

/**
 * Advanced partitioning algorithm that tries multiple strategies and picks the best
 * Now includes recency-prioritized strategy
 */
export function partitionFeedItemsAdvanced(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Try different partitioning strategies
  const strategies = [
    partitionFeedItems(feedItems),
    partitionFeedItemsByType(feedItems),
    partitionFeedItemsByRecency(feedItems),
  ];

  // Return the strategy with the best (lowest) balance score
  return strategies.reduce((best, current) => 
    current.balanceScore < best.balanceScore ? current : best
  );
}
