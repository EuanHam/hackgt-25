import type { FeedItem } from '../types/feedTypes';

interface Column {
  items: FeedItem[];
  totalHeight: number;
}

interface PartitionResult {
  column1: FeedItem[];
  column2: FeedItem[];
  balanceScore: number;
}

// Estimated heights for different item types (in pixels)
const ITEM_HEIGHTS = {
  email: 120, // Estimated height for email items
  post: 200,  // Estimated height for post items
  group: 100, // Estimated height for group items
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
  // Prefer left column to be taller or equal to right column
  const heightDiff = column1.totalHeight - column2.totalHeight;
  // If left is taller, no penalty. If right is taller, add a large penalty
  return heightDiff >= 0 ? heightDiff : 1000 - heightDiff;
}

/**
 * Creates a new column with an item added
 */
function addItemToColumn(column: Column, item: FeedItem): Column {
  return {
    items: [...column.items, item],
    totalHeight: column.totalHeight + getItemHeight(item)
  };
}

/**
 * Parses a date string in "Month Day, Year" format to a Date object
 */
function parseDate(dateString: string): Date {
  try {
    // Handle the specific format "Month Day, Year"
    const parts = dateString.trim().split(/[\s,]+/);
    if (parts.length >= 3) {
      const monthName = parts[0];
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      // More reliable month parsing
      const monthMap: Record<string, number> = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      };
      
      const month = monthMap[monthName.toLowerCase()];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        // Validate the date
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date;
        }
      }
    }
    
    // Fallback to default Date parsing
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }
    
    console.warn(`Invalid date format: ${dateString}`);
    return new Date(0); // Return epoch for invalid dates
  } catch (e) {
    console.error(`Error parsing date: ${dateString}`, e);
    return new Date(0); // Return epoch for invalid dates
  }
}

/**
 * Sorts feed items by recency (most recent first)
 * Prioritizes current year (2024) over future years (2025+)
 */
function sortByRecency(feedItems: FeedItem[]): FeedItem[] {
  const currentYear = new Date().getFullYear();
  
  const itemsWithDates = feedItems.map(item => {
    const date = parseDate(item.timestamp);
    return {
      item,
      date,
      // Future years (beyond current year) should be treated as earlier than current year
      sortKey: date.getFullYear() > currentYear 
        ? new Date(currentYear, 11, 31, 23, 59, 59).getTime() - (date.getFullYear() - currentYear) * 1000000000
        : date.getTime()
    };
  });

  // Log the original and parsed dates for debugging
  console.log('=== Original Order ===');
  itemsWithDates.forEach(({ item, date, sortKey }) => {
    console.log(`[${item.type}] ${item.timestamp} -> ${date.toString()}, sortKey: ${new Date(sortKey).toString()}`);
  });

  // Sort by our custom sort key
  const sorted = [...itemsWithDates].sort((a, b) => b.sortKey - a.sortKey);

  // Log the sorted order for debugging
  console.log('\n=== Sorted Order ===');
  sorted.forEach(({ item, date, sortKey }) => {
    console.log(`[${item.type}] ${item.timestamp} -> ${date.toString()}, sortKey: ${new Date(sortKey).toString()}`);
  });

  return sorted.map(({ item }) => item);
}

/**
 * Partitions feed items into two balanced columns using a greedy algorithm
 * Prioritizes more recent posts by sorting them first
 */
export function partitionFeedItems(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Sort items by recency (most recent first)
  const sortedItems = sortByRecency(feedItems);

  let column1: Column = { items: [], totalHeight: 0 };
  let column2: Column = { items: [], totalHeight: 0 };

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
 * Simple partitioning algorithm that only considers date and column height
 */
export function partitionFeedItemsByType(feedItems: FeedItem[]): PartitionResult {
  if (feedItems.length === 0) {
    return { column1: [], column2: [], balanceScore: 0 };
  }

  // Sort by recency (most recent first)
  const sortedItems = sortByRecency(feedItems);
  
  const column1: FeedItem[] = [];
  const column2: FeedItem[] = [];
  let height1 = 0;
  let height2 = 0;

  // Distribute items, ensuring left column is always taller or equal to right column
  for (const item of sortedItems) {
    const itemHeight = getItemHeight(item);
    
    // Always add to left column unless it would make right column taller
    if (height1 + itemHeight >= height2) {
      column1.push(item);
      height1 += itemHeight;
    } else {
      column2.push(item);
      height2 += itemHeight;
    }
  }

  return {
    column1,
    column2,
    balanceScore: Math.abs(height1 - height2)
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
  let height1 = 0;
  let height2 = 0;

  // Distribute items, ensuring left column is always taller or equal to right column
  for (const item of sortedItems) {
    const itemHeight = getItemHeight(item);
    
    // Always add to left column unless it would make right column taller
    if (height1 + itemHeight >= height2) {
      column1.push(item);
      height1 += itemHeight;
    } else {
      column2.push(item);
      height2 += itemHeight;
    }
  }

  return {
    column1,
    column2,
    balanceScore: Math.abs(height1 - height2)
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
