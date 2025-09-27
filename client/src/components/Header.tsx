import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        {/* App Name on the left */}
        <div className="app-name">
          <h1>App Name</h1>
        </div>
        
        {/* Search bar in the center */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-bar"
          />
        </div>
        
        {/* Right side elements */}
        <div className="header-right">
          {/* Hamburger menu */}
          <button className="hamburger-menu" aria-label="Menu">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
          
          {/* Profile picture */}
          <div className="profile-picture" aria-label="Profile">
            <div className="profile-avatar"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
