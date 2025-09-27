import React from 'react';
import './Header.css';

interface HeaderProps {
  onHamburgerClick: () => void;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ onHamburgerClick }, ref) => (
    <header className = "header" ref={ref}>
      <div className="header-content">
        {/* App Name on the left */}
        <div className="app-name-group">
          <div className="app-name">
            <h1>App Name</h1>
          </div>
          {/* Hamburger menu */}
          <button 
            className="hamburger-menu" 
            aria-label="Menu"
            onClick={onHamburgerClick}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
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
          {/* Profile picture */}
          <div className="profile-picture" aria-label="Profile">
            <div className="profile-avatar"></div>
          </div>
        </div>
      </div>
    </header>
  )
);

export default Header;
