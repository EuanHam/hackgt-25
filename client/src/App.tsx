import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import type { FeedItem } from './types/feedTypes'
import feedData from './data/feedData.json'
import './App.css'

const TOKEN = import.meta.env.VITE_TEMPORARY_TOKEN

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const SIDEBAR_WIDTH = 340;
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [imageModalState, setImageModalState] = useState({
    isOpen: false,
    imageUrl: '',
    alt: ''
  })

  console.log(TOKEN)

  const handleHamburgerClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  const handleImageClick = (imageUrl: string, alt: string) => {
    setImageModalState({
      isOpen: true,
      imageUrl,
      alt
    })
  }

  const handleImageModalClose = () => {
    setImageModalState({
      isOpen: false,
      imageUrl: '',
      alt: ''
    })
  }

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to truncate text to fit UI (approximately 2 lines)
  const truncatePreview = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Function to parse email "from" field and extract display name and email
  const parseFromField = (from: string): { name: string; email: string } => {
    if (!from) return { name: 'Unknown Sender', email: '' };
    
    // Handle formats like "John Doe <john@example.com>" or just "john@example.com"
    const emailRegex = /<([^>]+)>/;
    const emailMatch = from.match(emailRegex);
    
    if (emailMatch) {
      // Format: "John Doe <john@example.com>"
      const email = emailMatch[1];
      const name = from.replace(emailRegex, '').trim();
      return { name: name || email, email };
    } else {
      // Just an email address
      const emailOnlyRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailOnlyRegex.test(from.trim())) {
        return { name: from.trim(), email: from.trim() };
      } else {
        // Assume it's just a name
        return { name: from.trim(), email: '' };
      }
    }
  };

  // Function to format timestamp to show only date (no time)
  const formatDateOnly = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      return date.toLocaleDateString();
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Start with hardcoded feed data
      const hardcodedItems = feedData.feedItems as FeedItem[];
      let allItems = [...hardcodedItems];

      // Fetch emails if token is available
      if (TOKEN) {
        try {
          const emailsResponse = await fetch(
            'http://127.0.0.1:8000/emails?start_date=2025-09-26&max_results=10',
            {
              headers: {
                'Authorization': `Bearer ${TOKEN}`
              }
            }
          );
          
          if (emailsResponse.ok) {
            const emailsData = await emailsResponse.json();
            console.log('Fetched emails:', emailsData);
            
            // Transform API response to FeedItem format
            const transformedEmails: FeedItem[] = emailsData.emails?.map((email: any, index: number) => {
              const fromInfo = parseFromField(email.from || email.sender || '');
              return {
                id: email.id || `api-email-${index}`,
                type: 'email' as const,
                sender: fromInfo.name,
                senderEmail: fromInfo.email,
                subject: email.subject || 'No Subject',
                preview: truncatePreview(email.body || email.snippet || 'No preview available'),
                timestamp: formatDateOnly(email.date || new Date().toISOString()),
                isRead: email.isRead || false
              };
            }) || [];
            
            // Add emails to the beginning of the list
            allItems = [...transformedEmails, ...allItems];
          } else {
            console.error('Failed to fetch emails, using hardcoded data only');
          }
        } catch (emailError) {
          console.error('Error fetching emails:', emailError);
        }
      } else {
        console.log('No token provided, skipping email fetch');
      }

      // Fetch GroupMe groups
      try {
        console.log('Testing GroupMe connection...');
        const groupsResponse = await fetch('http://127.0.0.1:8000/groups');
        
        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          console.log('GroupMe groups fetched:', groupsData);
          
          // For now, let's try to get recent messages to simulate unread count
          let groupmeItems: FeedItem[] = [];
          
          try {
            // Fetch recent messages for all groups to simulate unread count
            const messagesResponse = await fetch('http://127.0.0.1:8000/groups/messages?limit=5');
            const messagesData = messagesResponse.ok ? await messagesResponse.json() : [];
            
            // Transform GroupMe groups to GroupFeedItem format
            groupmeItems = groupsData.slice(0, 5).map((group: any) => {
              // Find messages for this group to simulate unread count
              const groupMessages = messagesData.find((msg: any) => msg.group_id === group.id);
              const unreadCount = groupMessages ? Math.min(groupMessages.message_count || 0, 3) : 0; // Simulate 0-3 unread messages
              
              return {
                id: `groupme-group-${group.id}`,
                type: 'group' as const,
                groupName: group.name,
                groupId: group.id,
                senderName: 'GroupMe',
                preview: groupMessages ? 
                  `Latest: ${groupMessages.messages?.[0]?.text?.substring(0, 50) || 'No recent messages'}` : 
                  `Group chat with ${group.name}`,
                timestamp: new Date().toLocaleDateString(),
                unreadCount: unreadCount,
                groupIconUrl: group.imageURL || '',
              };
            });
          } catch (messagesError) {
            console.error('Error fetching GroupMe messages, using basic group info:', messagesError);
            // Fallback to basic group info without unread counts
            groupmeItems = groupsData.slice(0, 5).map((group: any) => ({
              id: `groupme-group-${group.id}`,
              type: 'group' as const,
              groupName: group.name,
              groupId: group.id,
              senderName: 'GroupMe',
              preview: `Group chat with ${group.name}`,
              timestamp: new Date().toLocaleDateString(),
              unreadCount: 2, // Fixed for now
              groupIconUrl: group.imageURL || '',
            }));
          }

          // Add GroupMe items to the list
          allItems = [...groupmeItems, ...allItems];
        } else {
          console.error('Failed to fetch GroupMe groups');
        }
      } catch (groupmeError) {
        console.error('Error fetching GroupMe data:', groupmeError);
      }

      // Set the final combined items
      setFeedItems(allItems);

    } catch (error) {
      console.error('Error in fetchData:', error);
      // Fallback to hardcoded data on error
      setFeedItems(feedData.feedItems as FeedItem[]);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [])

  

  return (
    <div className="app">
    <Header ref={headerRef} onHamburgerClick={handleHamburgerClick} />
    <div
      className="main-wrapper"
      style={{
        marginTop: headerHeight,
        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        transform: isSidebarOpen ? `translateX(${SIDEBAR_WIDTH / 2}px)` : 'none'
      }}
    >
      <main className="main-content">
        {loading ? (
          <div className="loading-spinner">
            <p>Loading feed...</p>
          </div>
        ) : (
          <Feed 
            feedItems={feedItems} 
            onImageClick={handleImageClick} 
          />
        )}
      </main>
    </div>
    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} headerHeight={headerHeight} />
    <ImageModal 
      isOpen={imageModalState.isOpen}
      imageUrl={imageModalState.imageUrl}
      alt={imageModalState.alt}
      onClose={handleImageModalClose}
    />
  </div>
  )
}

export default App
