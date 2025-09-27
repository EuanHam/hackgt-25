import { partitionFeedItems, partitionFeedItemsByType, partitionFeedItemsByRecency, partitionFeedItemsAdvanced } from './feedPartitioner';
import type { FeedItem } from '../types/feedTypes';

// Test data for different scenarios
const testScenarios = {
  balanced: [
    { id: '1', type: 'email', sender: 'A', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
    { id: '2', type: 'post', imageUrl: '/test.jpg', posterName: 'B', description: 'Test', timestamp: '1h' },
    { id: '3', type: 'email', sender: 'C', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
    { id: '4', type: 'post', imageUrl: '/test.jpg', posterName: 'D', description: 'Test', timestamp: '1h' },
  ] as FeedItem[],
  
  emailHeavy: [
    { id: '1', type: 'email', sender: 'A', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
    { id: '2', type: 'email', sender: 'B', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
    { id: '3', type: 'email', sender: 'C', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
    { id: '4', type: 'post', imageUrl: '/test.jpg', posterName: 'D', description: 'Test', timestamp: '1h' },
  ] as FeedItem[],
  
  postHeavy: [
    { id: '1', type: 'post', imageUrl: '/test.jpg', posterName: 'A', description: 'Test', timestamp: '1h' },
    { id: '2', type: 'post', imageUrl: '/test.jpg', posterName: 'B', description: 'Test', timestamp: '1h' },
    { id: '3', type: 'post', imageUrl: '/test.jpg', posterName: 'C', description: 'Test', timestamp: '1h' },
    { id: '4', type: 'email', sender: 'D', subject: 'Test', preview: 'Test', timestamp: '1h', isRead: false },
  ] as FeedItem[],
  
  largeDataset: Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    type: i % 3 === 0 ? 'email' : 'post',
    ...(i % 3 === 0 
      ? { sender: `Sender${i}`, subject: `Subject${i}`, preview: `Preview${i}`, timestamp: '1h', isRead: false }
      : { imageUrl: '/test.jpg', posterName: `Poster${i}`, description: `Description${i}`, timestamp: '1h' }
    )
  })) as FeedItem[],
};

// Test function to run all scenarios
export function testPartitioningAlgorithms() {
  console.log('🧪 Testing Feed Partitioning Algorithms\n');
  
  Object.entries(testScenarios).forEach(([scenarioName, items]) => {
    console.log(`📊 Scenario: ${scenarioName.toUpperCase()}`);
    console.log(`   Items: ${items.length} (${items.filter(i => i.type === 'email').length} emails, ${items.filter(i => i.type === 'post').length} posts)`);
    
    // Test all four algorithms
    const greedy = partitionFeedItems(items);
    const typeBased = partitionFeedItemsByType(items);
    const recencyBased = partitionFeedItemsByRecency(items);
    const advanced = partitionFeedItemsAdvanced(items);
    
    console.log(`   Greedy Algorithm:     Score ${greedy.balanceScore.toFixed(2)} | Col1: ${greedy.column1.length} | Col2: ${greedy.column2.length}`);
    console.log(`   Type-Based Algorithm: Score ${typeBased.balanceScore.toFixed(2)} | Col1: ${typeBased.column1.length} | Col2: ${typeBased.column2.length}`);
    console.log(`   Recency-Based Algo:  Score ${recencyBased.balanceScore.toFixed(2)} | Col1: ${recencyBased.column1.length} | Col2: ${recencyBased.column2.length}`);
    console.log(`   Advanced Algorithm:   Score ${advanced.balanceScore.toFixed(2)} | Col1: ${advanced.column1.length} | Col2: ${advanced.column2.length}`);
    
    // Show column composition
    const showComposition = (column: FeedItem[], name: string) => {
      const emails = column.filter(i => i.type === 'email').length;
      const posts = column.filter(i => i.type === 'post').length;
      console.log(`     ${name}: ${emails} emails, ${posts} posts`);
    };
    
    console.log('   Advanced Algorithm Composition:');
    showComposition(advanced.column1, 'Column 1');
    showComposition(advanced.column2, 'Column 2');
    console.log('');
  });
}

// Function to compare algorithm performance
export function compareAlgorithms(items: FeedItem[]) {
  const results = {
    greedy: partitionFeedItems(items),
    typeBased: partitionFeedItemsByType(items),
    recencyBased: partitionFeedItemsByRecency(items),
    advanced: partitionFeedItemsAdvanced(items),
  };
  
  const best = Object.entries(results).reduce((best, [name, result]) => 
    result.balanceScore < best.balanceScore ? { name, ...result } : best
  );
  
  return {
    results,
    best: best.name,
    bestScore: best.balanceScore,
  };
}

// Export for use in development
export { testScenarios };
