import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import type { FeedItem } from './types/feedTypes'
import feedData from './data/feedData.json'
import mockGroupData from './data/group.json'
import './App.css'

const TOKEN = import.meta.env.VITE_TEMPORARY_TOKEN

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const SIDEBAR_WIDTH = 340;
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [imageModalState, setImageModalState] = useState({
    isOpen: false,
    imageUrl: '',
    alt: ''
  })

  interface GroupMeGroup {
  id: string;
  name: string;
  imageURL: string;
}

  const [groupMeGroups, setGroupMeGroups] = useState<GroupMeGroup[]>([])
  // Sidebar filter state
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [contentFilters, setContentFilters] = useState<{emails:boolean; posts:boolean; groups:boolean}>({emails:true, posts:true, groups:true})
  const [dateRange, setDateRange] = useState<string>('week')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [activeTab, setActiveTab] = useState<'emails' | 'groupme'>('emails')


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
      
  // Start with hardcoded feed data (exclude groups, which come from API)
  const hardcodedItems = (feedData.feedItems as FeedItem[]).filter(item => item.type !== 'group');
  let allItems: FeedItem[] = [...hardcodedItems];

      // Fetch emails if token is available
      if (TOKEN) {
        try {
          const emailsResponse = await fetch(
            'http://127.0.0.1:8000/emails?start_date=2025-09-20&max_results=20&use_ai_filter=true',
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
              const fromInfo = parseFromField(email.From || email.sender || '');
              return {
                id: email.id || `api-email-${index}`,
                type: 'email' as const,
                sender: fromInfo.name,
                senderEmail: fromInfo.email,
                subject: email.Subject || 'No Subject',
                preview: truncatePreview(email.Body || email.snippet || 'No preview available'),
                timestamp: formatDateOnly(email.Date || new Date().toISOString()),
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

      // GroupMe data (live or mock)
      const useApi = import.meta.env.VITE_USE_GROUPME_API === 'true';
      let groupItems: FeedItem[] = [];
      if (useApi) {
        try {
          const groupsRes = await fetch('http://127.0.0.1:8000/groups');
          const groups = groupsRes.ok ? await groupsRes.json() : [];
          const msgsRes = await fetch('http://127.0.0.1:8000/groups/messages?limit=5');
          const msgs = msgsRes.ok ? await msgsRes.json() : [];
          groupItems = groups.map((g: any) => {
            const m = msgs.find((x: any) => x.group_id === g.id);
            const lastTs = m?.messages?.[0]?.timestamp;
            return {
              id: `group-${g.id}`,
              type: 'group' as const,
              groupName: g.name,
              groupId: g.id,
              preview: m ? `Latest: ${m.messages[0]?.text?.slice(0,50)}` : `Group chat with ${g.name}`,
              timestamp: lastTs ? formatDateOnly(new Date(lastTs*1000).toISOString()) : formatDateOnly(new Date().toISOString()),
              unreadCount: m?.message_count || 0,
              lastMessageTimestamp: lastTs,
              groupIconUrl: g.imageURL || ''
            };
          });
          } catch { console.log('Live GroupMe API failed, using mock'); }
      }
      if (!useApi || groupItems.length === 0) {
        groupItems = (mockGroupData as any[]).map(g => {
          const last = g.messages[0];
          return {
            id: `mock-${g.group_id}`,
            type: 'group' as const,
            groupName: g.group_name,
            groupId: g.group_id,
            senderName: 'GroupMe',
            preview: last?.text ? `Latest: ${last.text.slice(0,50)}` : `Group chat with ${g.group_name}`,
            timestamp: last ? formatDateOnly(new Date(last.timestamp*1000).toISOString()) : formatDateOnly(new Date().toISOString()),
            unreadCount: g.message_count,
            lastMessageTimestamp: last?.timestamp,
            groupIconUrl: ''
          };
        });
      }
      allItems = [...groupItems, ...allItems];
      // set groups for sidebar (transform to the shape Sidebar expects)
      setGroupMeGroups(groupItems.map(g => ({ id: (g as any).groupId || (g as any).id, name: (g as any).groupName, imageURL: (g as any).groupIconUrl || '' })));

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

  // Filter feed items by search query and sidebar filters
  const filterFeedItems = (items: FeedItem[], query: string): FeedItem[] => {
    let results = items.slice();

    // Content type filtering
    results = results.filter(item => {
      if (item.type === 'email') return contentFilters.emails;
      if (item.type === 'post') return contentFilters.posts;
      if (item.type === 'group') return contentFilters.groups;
      return true;
    });

    // Filter by selected GroupMe accounts
    if (selectedGroupIds.length > 0) {
      results = results.filter(item => {
        if (item.type !== 'group') return true;
        const g = item as any;
        return selectedGroupIds.includes(String(g.groupId)) || selectedGroupIds.includes(String(g.id));
      });
    }

    // Date range filtering
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      results = results.filter(item => {
        let itemDate = new Date(item.timestamp);
        if ((item as any).lastMessageTimestamp) {
          itemDate = new Date(((item as any).lastMessageTimestamp) * 1000);
        }
        if (isNaN(itemDate.getTime())) return true;

        if (dateRange === 'today') return itemDate.toDateString() === now.toDateString();
        if (dateRange === 'week') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return itemDate >= sevenDaysAgo;
        }
        if (dateRange === 'month') {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return itemDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    // Text search
    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      results = results.filter(item => {
        if (item.type === 'email') {
          const e = item as any;
          return (
            (e.sender && e.sender.toLowerCase().includes(q)) ||
            (e.subject && e.subject.toLowerCase().includes(q)) ||
            (e.preview && e.preview.toLowerCase().includes(q))
          );
        }
        if (item.type === 'post') {
          const p = item as any;
          return (
            (p.posterName && p.posterName.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        if (item.type === 'group') {
          const g = item as any;
          return (
            (g.groupName && g.groupName.toLowerCase().includes(q)) ||
            (g.preview && g.preview.toLowerCase().includes(q))
          );
        }
        return false;
      });
    }

    // Sorting
    results.sort((a, b) => {
      const getDate = (it: FeedItem) => {
        if ((it as any).lastMessageTimestamp) return new Date(((it as any).lastMessageTimestamp) * 1000).getTime();
        const d = new Date(it.timestamp).getTime();
        return isNaN(d) ? 0 : d;
      }
      if (sortBy === 'recent' || !sortBy) return getDate(b) - getDate(a);
      if (sortBy === 'oldest') return getDate(a) - getDate(b);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

    return results;
  }

  return (
    <div className="app">
    <Header ref={headerRef} onHamburgerClick={handleHamburgerClick} onSearch={setSearchQuery} />
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
            feedItems={filterFeedItems(feedItems, searchQuery)} 
            onImageClick={handleImageClick} 
          />
        )}
      </main>
    </div>
    <Sidebar 
      isOpen={isSidebarOpen} 
      onClose={handleSidebarClose} 
      headerHeight={headerHeight} 
      groups={groupMeGroups}
      selectedGroupIds={selectedGroupIds}
      onSelectedGroupsChange={setSelectedGroupIds}
      contentFilters={contentFilters}
      onContentFiltersChange={setContentFilters}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      sortBy={sortBy}
      onSortByChange={setSortBy}
    />
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