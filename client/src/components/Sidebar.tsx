import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose}></div>
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="filter-section">
            <h4>Content Type</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input type="checkbox" defaultChecked />
                <span>Emails</span>
              </label>
              <label className="filter-option">
                <input type="checkbox" defaultChecked />
                <span>Posts</span>
              </label>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Date Range</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" name="dateRange" value="today" />
                <span>Today</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="dateRange" value="week" defaultChecked />
                <span>This Week</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="dateRange" value="month" />
                <span>This Month</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="dateRange" value="all" />
                <span>All Time</span>
              </label>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Sort By</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" name="sortBy" value="recent" defaultChecked />
                <span>Most Recent</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="sortBy" value="oldest" />
                <span>Oldest First</span>
              </label>
              <label className="filter-option">
                <input type="radio" name="sortBy" value="type" />
                <span>By Type</span>
              </label>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="filter-apply">Apply Filters</button>
            <button className="filter-clear">Clear All</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
