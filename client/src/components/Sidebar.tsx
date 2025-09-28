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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, headerHeight, groups }) => {
  
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
    // You can pass this up to App.tsx via a callback prop if needed
    // onGroupsChange(selectedOptions);
  };

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
            />
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
              <span>GroupMe Messages</span> {/* Updated label */}
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