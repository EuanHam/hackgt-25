import React from 'react';
import './Sidebar.css';
import Select from "react-select";

interface Group {
  id: string;
  name: string;
  imageURL: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight: number;
  groups: Group[]; // Add groups prop
  // Selected group ids from the select component
  selectedGroupIds?: string[];
  onSelectedGroupsChange?: (ids: string[]) => void;
  // Content type filters
  contentFilters?: { emails: boolean; posts: boolean; groups: boolean };
  onContentFiltersChange?: (filters: { emails: boolean; posts: boolean; groups: boolean }) => void;
  // Date range filter: 'today' | 'week' | 'month' | 'all'
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  // Sort by: 'recent' | 'oldest' | 'type'
  sortBy?: string;
  onSortByChange?: (sortBy: string) => void;
}

// Remove the hardcoded accountOptions
// const accountOptions = [ ... ];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "6px",
    borderColor: "#ccc",
    minHeight: "38px",
    boxShadow: "none",
    "&:hover": { borderColor: "#888" },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  headerHeight,
  groups,
  selectedGroupIds,
  onSelectedGroupsChange,
  contentFilters,
  onContentFiltersChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
}) => {
  
  // Dynamically generate account options from groups prop
  const accountOptions = groups.map(group => ({
    value: group.id,
    label: group.name,
    // Optional: include additional data if needed
    groupData: group
  }));

  // Handle selection change
  const handleAccountChange = (selectedOptions: any) => {
    console.log('Selected groups:', selectedOptions);
    const ids = (selectedOptions || []).map((o: any) => o.value);
    if (onSelectedGroupsChange) onSelectedGroupsChange(ids);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose}></div>
      )}
      
      {/* Sidebar */}
  <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} style={{ top: headerHeight }}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="sidebar-content">
          {/* GroupMe accounts */}
          <h4>GroupMe Accounts ({groups.length})</h4>
          <div style={{ marginBottom: "1rem" }}>
            <Select
              options={accountOptions}
              isMulti
              placeholder="Select groups..."
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
              onChange={handleAccountChange}
              styles={customStyles}
              value={accountOptions.filter(opt => (selectedGroupIds || []).includes(opt.value))}
            />
          </div>

          {/* Content Type */}
          <div className="filter-section">
            <label className="section-title">Content Type</label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={contentFilters?.emails ?? true}
                onChange={(e) => onContentFiltersChange && onContentFiltersChange({
                  emails: e.target.checked,
                  posts: contentFilters?.posts ?? true,
                  groups: contentFilters?.groups ?? true,
                })}
              />
              <span>Emails</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={contentFilters?.groups ?? true}
                onChange={(e) => onContentFiltersChange && onContentFiltersChange({
                  emails: contentFilters?.emails ?? true,
                  posts: contentFilters?.posts ?? true,
                  groups: e.target.checked,
                })}
              />
              <span>GroupMe Messages</span> {/* Updated label */}
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={contentFilters?.posts ?? true}
                onChange={(e) => onContentFiltersChange && onContentFiltersChange({
                  emails: contentFilters?.emails ?? true,
                  posts: e.target.checked,
                  groups: contentFilters?.groups ?? true,
                })}
              />
              <span>Instagram Posts</span>
            </label>
          </div>
          
          {/* Date Range */}
          <div className="filter-section">
            <label className="section-title">Date Range</label>
            <label className="filter-option">
              <input
                type="radio"
                name="dateRange"
                checked={dateRange === 'today'}
                onChange={() => onDateRangeChange && onDateRangeChange('today')}
              />
              <span>Today</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="dateRange"
                checked={dateRange === 'week' || !dateRange}
                onChange={() => onDateRangeChange && onDateRangeChange('week')}
              />
              <span>This Week</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="dateRange"
                checked={dateRange === 'month'}
                onChange={() => onDateRangeChange && onDateRangeChange('month')}
              />
              <span>This Month</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="dateRange"
                checked={dateRange === 'all'}
                onChange={() => onDateRangeChange && onDateRangeChange('all')}
              />
              <span>All Time</span>
            </label>
          </div>
          
          {/* Sort By */}
          <div className="filter-section">
            <label className="section-title">Sort By</label>
            <label className="filter-option">
              <input
                type="radio"
                name="sortBy"
                checked={!sortBy || sortBy === 'recent'}
                onChange={() => onSortByChange && onSortByChange('recent')}
              />
              <span>Most Recent</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === 'oldest'}
                onChange={() => onSortByChange && onSortByChange('oldest')}
              />
              <span>Oldest First</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === 'type'}
                onChange={() => onSortByChange && onSortByChange('type')}
              />
              <span>By Type</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;