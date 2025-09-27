import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, headerHeight }) => {
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
          {/* GroupMe accounts */}
          <h4>GroupMe accounts</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input type="text" placeholder="e.g. universitylife" className="filter-input" />
            <button className="add-btn">+</button>
          </div>
          <div>
            <span className="chip">@universitylife</span>
            <span className="chip">@cs_department</span>
          </div>

          {/* Outlook keywords */}
          <h4>Outlook keywords</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input type="text" placeholder="e.g. assignment, deadline" className="filter-input" />
            <button className="add-btn">+</button>
          </div>
          <div>
            <span className="chip">assignment</span>
            <span className="chip">deadline</span>
            <span className="chip">enrollment</span>
          </div>

          {/* Content Type */}
          <div className="filter-section">
            <label className="section-title">Content Type</label>
            <label className="filter-option">
              <input type="checkbox" defaultChecked />
              <span>Emails</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" defaultChecked />
              <span>Posts</span>
            </label>
          </div>
          
          {/* Date Range */}
          <div className="filter-section">
            <label className="section-title">Date Range</label>
            <label className="filter-option">
              <input type="radio" name="dateRange" />
              <span>Today</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="dateRange" defaultChecked />
              <span>This Week</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="dateRange" />
              <span>This Month</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="dateRange" />
              <span>All Time</span>
            </label>
          </div>
          
          {/* Sort By */}
          <div className="filter-section">
            <label className="section-title">Sort By</label>
            <label className="filter-option">
              <input type="radio" name="sortBy" defaultChecked />
              <span>Most Recent</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="sortBy" />
              <span>Oldest First</span>
            </label>
            <label className="filter-option">
              <input type="radio" name="sortBy" />
              <span>By Type</span>
            </label>
          </div>
          </div>
        </div>
    </>
  );
};

export default Sidebar;
